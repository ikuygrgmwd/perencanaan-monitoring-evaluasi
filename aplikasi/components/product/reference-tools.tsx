"use client";
import {useEffect} from 'react';
import type {Bootstrap} from '@/lib/model';

type ToolRegistry={registerTool:(tool:{name:string;title:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean};execute:(input:unknown)=>unknown},options:{signal:AbortSignal})=>unknown};
export function ReferenceTools({data}:{data:Bootstrap}){
  useEffect(()=>{
    const context=(document as Document & {modelContext?:ToolRegistry}).modelContext;
    if(!context?.registerTool)return;
    const lifecycle=new AbortController();
    const tool={
      name:'read_visible_reference_summary',title:'Ringkasan data acuan yang dapat diakses',
      description:'Membaca ringkasan organisasi, lokus, domain, dan indikator yang sudah terlihat pada sesi aktif. Tidak mengubah data.',
      inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},
      execute(input:unknown){
        if(input===null||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Gunakan objek kosong.');
        return {simulation:true,role:data.actor.role,organization:data.actor.org_name,organizations:data.organizations.map(o=>({code:o.code,name:o.name,active:!!o.active})),locations:data.locations.map(l=>({code:l.code,name:l.name,active:!!l.active})),domains:data.domains.map(d=>d.name),indicatorCount:data.indicators.length};
      },
    };
    try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Dukungan opsional; tidak menghalangi antarmuka biasa. */}
    return ()=>lifecycle.abort();
  },[data]);
  return null;
}
