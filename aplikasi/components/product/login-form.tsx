"use client";
import {useRouter} from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import {demoAccounts,DEMO_PASSWORD} from '@/lib/demo-data';
import {loginDemo} from '@/lib/demo-session';
export function LoginForm(){
  const router=useRouter();
  const [email,setEmail]=useState('admin@demo.bnpp.test');
  const [password,setPassword]=useState('DemoBnpp2027!');
  const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{
    loginDemo(email,password);router.push('/beranda/');
  }catch(e){setError(e instanceof Error?e.message:'Tidak dapat membuka preview. Silakan coba lagi.');setBusy(false);}}
  return <div className="login-form"><span className="demo-tag">DATA SIMULASI</span><h2>Masuk ke ruang kerja</h2><p className="muted" style={{marginBottom:28}}>Gunakan akun demo sesuai peran Anda.</p>
    <form className="form-grid" onSubmit={submit}><label className="field"><span>Email</span><Input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label className="field"><span>Kata sandi</span><Input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>{error?<p className="error-message" role="alert">{error}</p>:null}<Button type="submit" disabled={busy} className="w-full h-12 text-base">{busy?<LoaderCircle className="animate-spin"/>:<LockKeyhole size={17}/>} {busy?'Memeriksa akun…':'Masuk'}</Button></form>
    <div className="login-accounts"><p className="text-sm font-semibold">Pilih akun untuk mencoba</p><div className="account-options">{demoAccounts.map(({label,key})=><button type="button" disabled={busy} key={key} onClick={()=>{setEmail(`${key}@demo.bnpp.test`);setPassword(DEMO_PASSWORD);setError('');}}>{label}</button>)}</div><p className="text-sm muted">Kata sandi demo: <code>{DEMO_PASSWORD}</code></p></div>
    <p className="login-footer">Preview statis dengan data dummy. Login hanya simulasi untuk mencoba tampilan sesuai peran, bukan autentikasi produksi. Fitur tambah, ubah, dan hapus data tersedia pada tahap berikutnya.</p>
  </div>;
}
