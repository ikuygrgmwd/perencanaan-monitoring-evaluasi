import {AppError,database,requireActor,requireAdmin,protectMutation,jsonBody,response,digest,randomToken,verifyPassword,sessionToken,cookieValue,SESSION_SECONDS,auditStatement} from '@/lib/server';
import {readData,saveMaster} from '@/lib/master-data';
import type {Actor,Resource} from '@/lib/model';
import {z} from 'zod';
export const dynamic='force-dynamic';
const resources=new Set(['organizations','locations','indicators','users']);

async function handle(request:Request){try{
  const [route,id,...rest]=new URL(request.url).pathname.slice(5).split('/');const method=request.method;
  if(rest.length)throw new AppError(404,'Halaman API tidak ditemukan.');
  if(method!=='GET')protectMutation(request);
  if(route==='login'&&method==='POST'&&!id){
    const parsed=z.object({email:z.string().trim().email().max(180).transform(v=>v.toLowerCase()),password:z.string().min(1).max(128)}).strict().safeParse(await jsonBody(request));
    if(!parsed.success)throw new AppError(400,'Isi email dan kata sandi dengan benar.');
    const {email,password}=parsed.data;const db=database();const limitKey=await digest(email);const now=Date.now();
    const limit=await db.prepare('SELECT attempts,until FROM login_limits WHERE key=?').bind(limitKey).first<{attempts:number;until:number}>();
    if(limit&&limit.until>now&&limit.attempts>=10)throw new AppError(429,'Terlalu banyak percobaan. Coba lagi dalam 15 menit.');
    const user=await db.prepare('SELECT u.*,o.active org_active FROM users u JOIN organizations o ON o.id=u.org_id WHERE u.email=?').bind(email).first<{id:string;org_id:string;name:string;email:string;role:'admin'|'user';password_hash:string;active:number;org_active:number}>();
    const valid=user?await verifyPassword(password,user.password_hash):await verifyPassword(password,'pbkdf2$100000$dummy$'+ '0'.repeat(64));
    if(!user||!valid||!user.active||!user.org_active){
      await db.prepare('INSERT INTO login_limits(key,attempts,until) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN until>? THEN attempts+1 ELSE 1 END,until=CASE WHEN until>? THEN until ELSE ? END').bind(limitKey,now+900000,now,now,now+900000).run();
      throw new AppError(401,'Email atau kata sandi salah, atau akun tidak aktif.');
    }
    const token=randomToken();const hash=await digest(token);
    await db.batch([
      db.prepare('DELETE FROM login_limits WHERE key=?').bind(limitKey),db.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(now),
      db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(hash,user.id,now+SESSION_SECONDS*1000),
      auditStatement({...user,org_name:'',org_kind:''} as Actor,'Masuk','sessions',user.id,`${user.name} masuk ke aplikasi`),
    ]);
    return response({ok:true},200,{'Set-Cookie':cookieValue(token,request)});
  }
  if(route==='logout'&&method==='POST'&&!id){
    const token=sessionToken(request.headers.get('cookie'));if(token)await database().prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digest(token)).run();
    return response({ok:true},200,{'Set-Cookie':cookieValue('',request,0)});
  }
  const actor=await requireActor(request);
  if(route==='bootstrap'&&method==='GET'&&!id)return response(await readData(actor));
  if(resources.has(route)){
    if(method==='GET'){
      const data=await readData(actor);const records=data[route as Resource];
      if(id){const record=records.find(r=>r.id===id);if(!record)throw new AppError(404,'Data tidak ditemukan atau tidak dapat diakses.');return response(record);}
      return response(records);
    }
    requireAdmin(actor);
    if((method==='POST'&&!id)||(method==='PUT'&&id))return response(await saveMaster(actor,route as Resource,await jsonBody(request),id),method==='POST'?201:200);
  }
  throw new AppError(404,'Tindakan tidak tersedia.');
}catch(e){
  if(e instanceof AppError)return response({error:e.message},e.status);
  if(e instanceof Error&&(e.message.includes('UNIQUE constraint')||('code' in e&&e.code==='23505')))return response({error:'Kode atau email sudah digunakan. Gunakan nilai lain.'},409);
  console.error('Permintaan gagal',e instanceof Error?e.message:'unknown');
  return response({error:'Layanan belum dapat memproses permintaan. Data Anda belum disimpan; silakan coba kembali.'},503);
}}
export const GET=handle;export const POST=handle;export const PUT=handle;
