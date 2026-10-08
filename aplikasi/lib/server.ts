export {database} from './database';
import {database} from './database';
import type {Actor} from './model';

export class AppError extends Error { constructor(public status:number,message:string){super(message);} }
export const COOKIE='bnpp_demo_session';
export const SESSION_SECONDS=8*60*60;
export async function digest(value:string){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))));}
function hex(value:Uint8Array){return Array.from(value,b=>b.toString(16).padStart(2,'0')).join('');}
export function randomToken(){return hex(crypto.getRandomValues(new Uint8Array(32)));}
export async function hashPassword(password:string,salt=hex(crypto.getRandomValues(new Uint8Array(16)))){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256);
  return `pbkdf2$100000$${salt}$${hex(new Uint8Array(bits))}`;
}
export async function verifyPassword(password:string,stored:string){
  const parts=stored.split('$');if(parts.length!==4||parts[0]!=='pbkdf2'||parts[1]!=='100000')return false;
  const candidate=await hashPassword(password,parts[2]);let diff=candidate.length^stored.length;
  for(let i=0;i<stored.length;i++)diff|=stored.charCodeAt(i)^(candidate.charCodeAt(i)||0);
  return diff===0;
}
export function sessionToken(cookie:string|null){return cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1)||'';}
export async function actorForToken(token:string):Promise<Actor|null>{
  if(!/^[a-f0-9]{64}$/.test(token))return null;
  try{
    return await database().prepare(`SELECT u.id,u.name,u.email,u.role,u.org_id,o.name org_name,o.kind org_kind FROM sessions s JOIN users u ON u.id=s.user_id JOIN organizations o ON o.id=u.org_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1 AND o.active=1`).bind(await digest(token),Date.now()).first<Actor>();
  }catch{return null;}
}
export async function requireActor(request:Request){const actor=await actorForToken(sessionToken(request.headers.get('cookie')));if(!actor)throw new AppError(401,'Sesi berakhir. Silakan masuk kembali.');return actor;}
export function requireAdmin(actor:Actor){if(actor.role!=='admin')throw new AppError(403,'Hanya admin BNPP yang dapat melakukan tindakan ini.');}
export function protectMutation(request:Request){
  if(request.headers.get('origin')!==new URL(request.url).origin)throw new AppError(403,'Asal permintaan tidak diizinkan.');
  if(request.headers.get('sec-fetch-site')==='cross-site')throw new AppError(403,'Permintaan lintas situs ditolak.');
}
export async function jsonBody(request:Request){
  if(!request.headers.get('content-type')?.startsWith('application/json'))throw new AppError(415,'Gunakan data JSON.');
  if(Number(request.headers.get('content-length')||0)>16384)throw new AppError(413,'Data terlalu besar.');
  const raw=await request.text();if(raw.length>16384)throw new AppError(413,'Data terlalu besar.');
  try{return JSON.parse(raw);}catch{throw new AppError(400,'Format data tidak valid.');}
}
export function response(data:unknown,status=200,extra:Record<string,string>={}){
  return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin',...extra}});
}
export function cookieValue(token:string,request:Request,maxAge=SESSION_SECONDS){
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(request.url).protocol==='https:'?'; Secure':''}`;
}
export function auditStatement(actor:Actor,action:string,entity:string,id:string,summary:string){return database().prepare('INSERT INTO audits(id,actor_id,org_id,action,entity,entity_id,summary,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),actor.id,actor.org_id,action,entity,id,summary,Date.now());}
