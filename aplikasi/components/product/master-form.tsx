"use client";
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {LoaderCircle} from 'lucide-react';
import type {Bootstrap,Resource,MasterRecord} from '@/lib/model';
const labels:Record<Resource,string>={organizations:'organisasi / unit',users:'akun pengguna',locations:'lokus',indicators:'indikator'};
type Fields=Record<string,string|number|string[]>;
function initialValues(resource:Resource,record:MasterRecord|null,data:Bootstrap):Fields{
 const defaults:Record<Resource,Fields>={
 organizations:{code:'',name:'',kind:'KL',region:'',active:1},
 users:{name:'',email:'',password:'',role:'user',org_id:data.organizations[0]?.id||'',active:1},
 locations:{code:'',name:'',region:'',domain_id:data.domains[0]?.id||'',description:'',org_ids:[],active:1},
 indicators:{code:'',name:'',unit:'',domain_id:data.domains[0]?.id||'',definition:'',frequency:'Triwulanan',active:1},
 };
 if(!record)return defaults[resource];const values={...defaults[resource]};for(const key of Object.keys(values)){if(key in record)values[key]=(record as unknown as Fields)[key];}return values;
}
export function MasterForm({resource,record,data,onClose,onSaved}:{resource:Resource;record:MasterRecord|null;data:Bootstrap;onClose:()=>void;onSaved:()=>Promise<void>}){
 const [fields,setFields]=useState(()=>initialValues(resource,record,data));const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const set=(key:string,value:string|number|string[])=>setFields(f=>({...f,[key]:value}));
 function input(key:string,label:string,type='text',required=true){return <label className="field" key={key}><span>{label}</span><Input type={type} value={String(fields[key]||'')} required={required} maxLength={type==='password'?128:180} minLength={type==='password'?12:undefined} autoComplete={type==='password'?'new-password':undefined} onChange={e=>set(key,e.target.value)}/></label>;}
 function select(key:string,label:string,options:{id:string;name:string}[]){return <div className="field" key={key}><label htmlFor={`field-${key}`}>{label}</label><Select value={String(fields[key])} onValueChange={v=>set(key,v)}><SelectTrigger id={`field-${key}`} className="w-full"><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem value={o.id} key={o.id}>{o.name}</SelectItem>)}</SelectContent></Select></div>;}
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{
   const payload:Fields={...fields,active:Number(fields.active)};if(resource==='users'&&record&&!payload.password)delete payload.password;
   const r=await fetch(`/api/${resource}${record?`/${record.id}`:''}`,{method:record?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const body=await r.json() as {error?:string};
   if(!r.ok){if(r.status===401)window.location.assign('/login');throw new Error(body.error||'Tidak dapat menyimpan data.');}
   await onSaved();onClose();
 }catch(e){setError(e instanceof Error?e.message:'Koneksi terputus. Silakan coba lagi.');}finally{setBusy(false);}}
 return <Dialog open onOpenChange={open=>{if(!open&&!busy)onClose();}}><DialogContent className="master-dialog" showCloseButton={false}><DialogHeader><DialogTitle>{record?'Ubah':'Tambah'} {labels[resource]}</DialogTitle><DialogDescription>Data simulasi. Kolom wajib perlu dilengkapi sebelum disimpan.</DialogDescription></DialogHeader><form className="form-grid" onSubmit={submit}>
   {resource!=='users'?input('code','Kode'):null}{input('name',resource==='users'?'Nama pengguna':'Nama')}
   {resource==='organizations'?<>{select('kind','Jenis organisasi',[{id:'BNPP',name:'BNPP'},{id:'KL',name:'Kementerian / Lembaga'},{id:'PEMDA',name:'Pemerintah Daerah'},{id:'UNIT',name:'Keasdepan / Unit teknis'},{id:'PLBN',name:'PLBN'}])}{input('region','Cakupan wilayah')}</>:null}
   {resource==='users'?<>{input('email','Email','email')}{select('org_id','Organisasi / unit',data.organizations.filter(o=>o.active))}{select('role','Peran',[{id:'user',name:'Pengguna'},{id:'admin',name:'Admin BNPP'}])}{input('password',record?'Kata sandi baru (kosongkan jika tetap)':'Kata sandi (minimal 12 karakter)','password',!record)}</>:null}
   {resource==='locations'||resource==='indicators'?select('domain_id','Domain pengelolaan',data.domains):null}
   {resource==='locations'?<>{input('region','Kawasan / wilayah')}<fieldset className="field"><legend className="font-semibold mb-2">Organisasi yang mendapat akses</legend><div className="grant-list">{data.organizations.map(o=><label key={o.id} className="flex items-center gap-3"><Checkbox checked={(fields.org_ids as string[]).includes(o.id)} onCheckedChange={v=>set('org_ids',v?[...fields.org_ids as string[],o.id]:(fields.org_ids as string[]).filter(id=>id!==o.id))}/><span>{o.name}</span></label>)}</div></fieldset></>:null}
   {resource==='indicators'?<>{input('unit','Satuan')}{select('frequency','Frekuensi pelaporan',['Bulanan','Triwulanan','Tahunan'].map(s=>({id:s,name:s})))}</>:null}
   {resource==='locations'||resource==='indicators'?<label className="field"><span>{resource==='locations'?'Keterangan lokus':'Definisi indikator'}</span><Textarea required minLength={5} maxLength={1000} value={String(fields[resource==='locations'?'description':'definition'])} onChange={e=>set(resource==='locations'?'description':'definition',e.target.value)}/></label>:null}
   {select('active','Status',[{id:'1',name:'Aktif'},{id:'0',name:'Nonaktif'}])}
   {error?<p role="alert" className="error-message">{error}</p>:null}<div className="flex justify-end gap-3"><Button variant="outline" type="button" disabled={busy} onClick={onClose}>Batal</Button><Button type="submit" disabled={busy}>{busy?<LoaderCircle className="animate-spin"/>:null}{busy?'Menyimpan…':'Simpan'}</Button></div>
 </form></DialogContent></Dialog>;
}
