import {z} from 'zod';
import {AppError,auditStatement,database,hashPassword} from './server';
import type {Actor,Domain,Organization,User,Location,Indicator,Audit,Resource} from './model';

const text=z.string().trim().min(2,'Minimal 2 karakter.').max(180,'Maksimal 180 karakter.');
const code=z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{2,24}$/,'Kode berisi 2–24 huruf, angka, atau tanda hubung.');
const id=z.string().min(1).max(80); const active=z.number().int().min(0).max(1);
const schemas={
  organizations:z.object({code,name:text,kind:z.enum(['BNPP','KL','PEMDA','UNIT','PLBN']),region:text,active}).strict(),
  locations:z.object({code,name:text,region:text,domain_id:id,description:z.string().trim().min(5).max(1000),active,org_ids:z.array(id).min(1,'Pilih minimal satu organisasi.').max(50)}).strict(),
  indicators:z.object({code,name:text,unit:text,domain_id:id,definition:z.string().trim().min(5).max(1000),frequency:z.enum(['Bulanan','Triwulanan','Tahunan']),active}).strict(),
  users:z.object({name:text,email:z.string().trim().email().max(180).transform(s=>s.toLowerCase()),role:z.enum(['admin','user']),org_id:id,active,password:z.string().min(12,'Kata sandi minimal 12 karakter.').max(128).optional()}).strict(),
};

export async function readData(actor:Actor){
  const db=database(); const admin=actor.role==='admin';
  const orgQuery=admin?db.prepare('SELECT * FROM organizations ORDER BY code'):db.prepare('SELECT * FROM organizations WHERE id=?').bind(actor.org_id);
  const userQuery=admin?db.prepare('SELECT u.id,u.name,u.email,u.role,u.org_id,u.active,o.name org_name FROM users u JOIN organizations o ON o.id=u.org_id ORDER BY u.role,u.name'):db.prepare('SELECT u.id,u.name,u.email,u.role,u.org_id,u.active,o.name org_name FROM users u JOIN organizations o ON o.id=u.org_id WHERE u.id=?').bind(actor.id);
  const locQuery=admin?db.prepare('SELECT * FROM locations ORDER BY code'):db.prepare('SELECT l.* FROM locations l JOIN assignments a ON a.location_id=l.id WHERE a.org_id=? ORDER BY l.code').bind(actor.org_id);
  const grantQuery=admin?db.prepare('SELECT org_id,location_id FROM assignments'):db.prepare('SELECT org_id,location_id FROM assignments WHERE org_id=?').bind(actor.org_id);
  const auditQuery=admin?db.prepare('SELECT a.*,u.name actor_name FROM audits a JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC LIMIT 30'):db.prepare('SELECT a.*,u.name actor_name FROM audits a JOIN users u ON u.id=a.actor_id WHERE a.actor_id=? ORDER BY a.created_at DESC LIMIT 15').bind(actor.id);
  const [orgs,users,locs,grants,domains,indicators,audits]=await Promise.all([
    orgQuery.all<Organization>(),userQuery.all<User>(),locQuery.all<Location>(),grantQuery.all<{org_id:string;location_id:string}>(),
    db.prepare('SELECT * FROM domains ORDER BY code').all<Domain>(),db.prepare('SELECT * FROM indicators ORDER BY code').all<Indicator>(),auditQuery.all<Audit>(),
  ]);
  return {actor,organizations:orgs.results,users:users.results,domains:domains.results,indicators:indicators.results,audits:audits.results,
    locations:locs.results.map(l=>({...l,org_ids:grants.results.filter(g=>g.location_id===l.id).map(g=>g.org_id)}))};
}

export async function saveMaster(actor:Actor,resource:Resource,raw:unknown,recordId?:string){
  const result=schemas[resource].safeParse(raw);
  if(!result.success)throw new AppError(400,result.error.issues.map(e=>`${e.path.join('.')}: ${e.message}`).join(' '));
  const db=database();const record=result.data;const recordID=recordId||crypto.randomUUID();
  if(recordId&&!await db.prepare(`SELECT id FROM ${resource} WHERE id=?`).bind(recordId).first())throw new AppError(404,'Data tidak ditemukan.');
  // Table identifiers come only from the Resource allowlist in the route, never user SQL.
  if(resource==='organizations'&&recordId===actor.org_id){
    const data=record as z.infer<typeof schemas.organizations>;
    if(!data.active||data.kind!=='BNPP')throw new AppError(400,'Organisasi admin yang sedang digunakan harus tetap aktif sebagai BNPP.');
  }
  if(resource==='organizations'&&recordId){
    const data=record as z.infer<typeof schemas.organizations>;
    const admins=await db.prepare("SELECT id FROM users WHERE org_id=? AND role='admin' AND active=1").bind(recordId).first();
    if(admins&&(!data.active||data.kind!=='BNPP'))throw new AppError(400,'Organisasi dengan admin aktif harus tetap aktif dan bertipe BNPP.');
  }
  if('domain_id' in record&&!await db.prepare('SELECT id FROM domains WHERE id=?').bind(record.domain_id).first())throw new AppError(400,'Domain tidak valid.');
  const statements:D1PreparedStatement[]=[];
  let values:Record<string,unknown>={...record};
  if(resource==='users'){
    const data=record as z.infer<typeof schemas.users>;
    const org=await db.prepare('SELECT kind,active FROM organizations WHERE id=?').bind(data.org_id).first<{kind:string;active:number}>();
    if(!org||!org.active)throw new AppError(400,'Organisasi tidak ditemukan atau tidak aktif.');
    if(data.role==='admin'&&org.kind!=='BNPP')throw new AppError(400,'Peran admin hanya dapat diberikan kepada organisasi BNPP.');
    if(recordId===actor.id&&(!data.active||data.role!=='admin'||data.org_id!==actor.org_id))throw new AppError(400,'Anda tidak dapat menonaktifkan atau mengurangi akses akun sendiri.');
    if(!recordId&&!data.password)throw new AppError(400,'Kata sandi diperlukan untuk akun baru.');
    const {password,...rest}=data;values={...rest};if(password)values.password_hash=await hashPassword(password);
    if(recordId)statements.push(db.prepare('DELETE FROM sessions WHERE user_id=?').bind(recordId));
  }
  if(resource==='locations'){
    const data=record as z.infer<typeof schemas.locations>;
    const orgIds=[...new Set(data.org_ids)];
    for(const orgId of orgIds){if(!await db.prepare('SELECT id FROM organizations WHERE id=?').bind(orgId).first())throw new AppError(400,'Organisasi penugasan tidak valid.');}
    const {org_ids,...rest}=data;values=rest;
    if(recordId)statements.push(db.prepare('DELETE FROM assignments WHERE location_id=?').bind(recordId));
    // Append grants after the location row to satisfy foreign keys.
  }
  const columns=Object.keys(values);const bindings=Object.values(values);
  statements.unshift(recordId?db.prepare(`UPDATE ${resource} SET ${columns.map(c=>`${c}=?`).join(',')} WHERE id=?`).bind(...bindings,recordID):db.prepare(`INSERT INTO ${resource}(id,${columns.join(',')}) VALUES(?,${columns.map(()=>'?').join(',')})`).bind(recordID,...bindings));
  if(resource==='locations')for(const orgId of new Set((record as z.infer<typeof schemas.locations>).org_ids))statements.push(db.prepare('INSERT INTO assignments(org_id,location_id) VALUES(?,?)').bind(orgId,recordID));
  statements.push(auditStatement(actor,recordId?'Mengubah':'Menambahkan',resource,recordID,`${recordId?'Mengubah':'Menambahkan'} ${record.name}`));
  await db.batch(statements);return {id:recordID};
}
