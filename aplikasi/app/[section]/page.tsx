import {cookies} from 'next/headers';
import {redirect,notFound} from 'next/navigation';
import {actorForToken,COOKIE} from '@/lib/server';
import {readData} from '@/lib/master-data';
import {Workspace} from '@/components/product/workspace';
export const dynamic='force-dynamic';
const sections=['beranda','organisasi','akun','lokus','domain','indikator','profil','aktivitas'];
export default async function WorkspacePage({params}:{params:Promise<{section:string}>}){
  const {section}=await params;if(!sections.includes(section))notFound();
  const actor=await actorForToken((await cookies()).get(COOKIE)?.value||'');if(!actor)redirect('/login');
  if(['akun','aktivitas'].includes(section)&&actor.role!=='admin')return <Workspace initial={await readData(actor)} section="ditolak"/>;
  return <Workspace initial={await readData(actor)} section={section}/>;
}
