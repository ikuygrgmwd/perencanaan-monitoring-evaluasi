"use client";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useEffect,useSyncExternalStore} from 'react';
import {readDemoData} from '@/lib/demo-data';
import {readDemoSession,subscribeDemoSession} from '@/lib/demo-session';
import {Workspace} from './workspace';

const serverSnapshot=()=>undefined;

export function DemoWorkspace({section}:{section:string}) {
  const router=useRouter();
  const account=useSyncExternalStore(subscribeDemoSession,readDemoSession,serverSnapshot);
  useEffect(()=>{
    if(account===null)router.replace('/login/');
  },[account,router]);
  const data=account?readDemoData(account):null;
  if(!data)return <main className="mx-auto max-w-xl p-10"><p role="status">Menyiapkan preview…</p><Link className="text-link" href="/login/">Ke halaman masuk</Link></main>;
  const restricted=['akun','aktivitas'].includes(section)&&data.actor.role!=='admin';
  return <Workspace key={`${account}-${section}`} initial={data} section={restricted?'ditolak':section}/>;
}
