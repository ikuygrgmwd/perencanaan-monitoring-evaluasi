"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockKeyhole, LoaderCircle } from "lucide-react";
const accounts=[['Admin BNPP','admin'],['K/L','kl'],['Pemda','pemda'],['Batas darat','darat'],['Batas laut','laut'],['Batas udara','udara'],['PLBN','plbn']];
export function LoginForm(){
  const [email,setEmail]=useState('admin@demo.bnpp.test');
  const [password,setPassword]=useState('DemoBnpp2027!');
  const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{
    const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data=await r.json() as {error?:string};if(!r.ok)throw new Error(data.error||'Tidak dapat masuk. Silakan coba lagi.');window.location.assign('/beranda');
  }catch(e){setError(e instanceof Error?e.message:'Koneksi terputus. Silakan coba lagi.');setBusy(false);}}
  return <div className="login-form"><span className="demo-tag">DATA SIMULASI</span><h2>Masuk ke ruang kerja</h2><p className="muted" style={{marginBottom:28}}>Gunakan akun demo sesuai peran Anda.</p>
    <form className="form-grid" onSubmit={submit}><label className="field"><span>Email</span><Input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label className="field"><span>Kata sandi</span><Input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>{error?<p className="error-message" role="alert">{error}</p>:null}<Button type="submit" disabled={busy} className="w-full h-12 text-base">{busy?<LoaderCircle className="animate-spin"/>:<LockKeyhole size={17}/>} {busy?'Memeriksa akun…':'Masuk'}</Button></form>
    <div className="login-accounts"><p className="text-sm font-semibold">Pilih akun untuk mencoba</p><div className="account-options">{accounts.map(([label,key])=><button type="button" disabled={busy} key={key} onClick={()=>{setEmail(`${key}@demo.bnpp.test`);setPassword('DemoBnpp2027!');setError('');}}>{label}</button>)}</div><p className="text-sm muted">Kata sandi demo: <code>DemoBnpp2027!</code></p></div>
    <p className="login-footer">Seluruh akun dan data di lingkungan ini adalah simulasi. Jangan masukkan data operasional atau informasi pribadi.</p>
  </div>;
}
