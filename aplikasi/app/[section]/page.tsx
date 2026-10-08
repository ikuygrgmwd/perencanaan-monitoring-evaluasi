import {notFound} from 'next/navigation';
import {DemoWorkspace} from '@/components/product/demo-workspace';
const sections=['beranda','program','monitoring','dashboard','evaluasi','milestone','organisasi','akun','lokus','domain','indikator','profil','aktivitas'];
export const dynamicParams=false;
export function generateStaticParams(){return sections.map(section=>({section}));}
export default async function WorkspacePage({params}:{params:Promise<{section:string}>}){
  const {section}=await params;if(!sections.includes(section))notFound();
  return <DemoWorkspace section={section}/>;
}
