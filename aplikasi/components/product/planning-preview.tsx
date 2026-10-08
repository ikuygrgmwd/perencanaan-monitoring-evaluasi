"use client";

import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight,Check,Flag,Target,TrendingUp,MapPin,Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Table,TableHeader,TableHead,TableBody,TableRow,TableCell} from '@/components/ui/table';
import {planningFor,progressLabel,rupiah,type PreviewPlan} from '@/lib/preview-planning';
import type {Bootstrap} from '@/lib/model';

function StateBadge({progress}:{progress:number}){
  return <span className={`plan-status ${progress>=100?'complete':progress>=60?'ontrack':'attention'}`}>{progressLabel(progress)}</span>;
}
function Meter({value,label}:{value:number;label:string}){
  return <div className="plan-meter" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span style={{width:`${value}%`}}/></div>;
}

function MilestoneFlow({plan}:{plan:PreviewPlan}){
  const stages=[
    {title:'Kondisi awal',time:'Januari 2026',value:plan.baseline,note:'Titik awal pengukuran',icon:MapPin,state:'done'},
    {title:'Posisi saat ini',time:'Snapshot · 8 Oktober 2026',value:plan.current,note:plan.action,icon:TrendingUp,state:'current'},
    {title:'Target akhir',time:'Desember 2026',value:plan.target,note:`Sisa ${plan.target-plan.current} ${plan.indicator.unit.toLowerCase()} untuk mencapai target`,icon:Flag,state:'target'},
  ];
  return <section className="panel milestone-panel"><div className="panel-heading"><div><p className="eyebrow text-primary mb-2">{plan.id} · {plan.location.name}</p><h2>{plan.name}</h2></div><StateBadge progress={plan.progress}/></div>
    <ol className="milestone-flow" aria-label={`Alur pencapaian ${plan.name}`}>
      {stages.map((stage,index)=><li className={`flow-step ${stage.state}`} key={stage.title}><div className="flow-top"><span className="flow-icon"><stage.icon size={20}/></span><small>{stage.time}</small></div><h3>{stage.title}</h3><p className="flow-value">{stage.value}<span>{plan.indicator.unit}</span></p><p className="flow-note">{stage.note}</p>{index<2?<ArrowRight className="flow-arrow" size={24} aria-hidden="true"/>:null}</li>)}
    </ol>
    <div className="milestone-bottom"><div><span className="eyebrow">Capaian terhadap target akhir</span><div className="milestone-progress"><Meter value={plan.progress} label={`Capaian ${plan.name}`}/><strong>{plan.progress}%</strong></div></div><p><Target size={18}/><span><strong>Langkah berikutnya</strong>{plan.recommendation}</span></p></div>
  </section>;
}

export function PlanningPreview({data,section}:{data:Bootstrap;section:string}){
  const [domain,setDomain]=useState('all');
  const [query,setQuery]=useState('');
  const allPlans=planningFor(data);
  const plans=allPlans.filter(plan=>(domain==='all'||plan.location.domain_id===domain)&&`${plan.name} ${plan.location.name} ${plan.id}`.toLocaleLowerCase('id').includes(query.toLocaleLowerCase('id')));
  const average=plans.length?Math.round(plans.reduce((sum,plan)=>sum+plan.progress,0)/plans.length):0;
  const completed=plans.filter(plan=>plan.progress>=100).length;
  const attention=plans.filter(plan=>plan.progress<60).length;
  const budget=plans.reduce((sum,plan)=>sum+plan.budget,0);
  const spent=plans.reduce((sum,plan)=>sum+plan.spent,0);
  return <div className="planning-preview">
    <div className="planning-toolbar"><div className="search-box"><Search size={18}/><Input aria-label="Cari program atau lokus" placeholder="Cari program atau lokus…" value={query} onChange={event=>setQuery(event.target.value)}/></div><label className="domain-filter">Domain<select value={domain} onChange={event=>setDomain(event.target.value)}>{[{id:'all',name:'Semua domain'},...data.domains].map(item=><option value={item.id} key={item.id}>{item.name}</option>)}</select></label><span className="period-label">Tahun 2026 · Triwulan IV</span></div>
    <div className="stat-grid plan-stats">{[{label:'Program dalam lingkup',value:plans.length,note:'Program dan kegiatan dummy'},{label:'Rata-rata capaian',value:`${average}%`,note:'Rerata persentase tiap program'},{label:'Target tercapai',value:completed,note:'Capaian mencapai target akhir'},{label:'Perlu perhatian',value:attention,note:'Capaian di bawah 60%'}].map(item=><div className="stat-card" key={item.label}><div className="stat-top">{item.label}</div><strong>{item.value}</strong><small>{item.note}</small></div>)}</div>
    {!plans.length?<section className="panel empty-text"><Search className="mx-auto mb-3"/><h2>Tidak ada program yang cocok</h2><p>Coba kata kunci atau domain lain.</p></section>:<>
      {section==='milestone'?<><section className="milestone-intro"><div><p className="eyebrow">Peta pencapaian · 2026</p><h2>Dari kondisi saat ini menuju tujuan bersama.</h2><p>Alur menghubungkan kondisi awal, capaian dummy saat ini, dan target akhir pada lokus yang sudah terdaftar.</p></div><div className="milestone-key"><span><Check size={15}/> Kondisi awal</span><span><TrendingUp size={15}/> Posisi saat ini</span><span><Flag size={15}/> Tujuan</span></div></section><div className="milestone-list">{plans.map(plan=><MilestoneFlow key={plan.id} plan={plan}/>)}</div></>:null}
      {section==='program'?<section className="panel"><div className="panel-heading"><div><h2>Rencana program & kegiatan</h2><p className="muted text-sm mt-1">{plans.length} program · Pagu dummy {rupiah(budget)}</p></div><Link href="/milestone/" className="text-link">Lihat milestone →</Link></div><Table><TableHeader><TableRow><TableHead>Program / kegiatan</TableHead><TableHead>Lokus & penanggung jawab</TableHead><TableHead>Target 2026</TableHead><TableHead>Pagu indikatif</TableHead></TableRow></TableHeader><TableBody>{plans.map(plan=><TableRow key={plan.id}><TableCell className="primary-cell"><small className="text-primary">{plan.id}</small><strong className="block mt-1">{plan.name}</strong><p className="record-detail">{plan.action}</p></TableCell><TableCell>{plan.location.name}<small className="block muted mt-1">{plan.owner}</small></TableCell><TableCell>{plan.target} {plan.indicator.unit.toLowerCase()}<small className="block muted mt-1">{plan.indicator.name}</small></TableCell><TableCell className="whitespace-nowrap">{rupiah(plan.budget)}</TableCell></TableRow>)}</TableBody></Table></section>:null}
      {section==='monitoring'?<section className="panel"><div className="panel-heading"><div><h2>Pemantauan pelaksanaan</h2><p className="muted text-sm mt-1">Snapshot dummy · 8 Oktober 2026</p></div><Link href="/evaluasi/" className="text-link">Lihat evaluasi →</Link></div><Table><TableHeader><TableRow><TableHead>Program</TableHead><TableHead>Realisasi / target</TableHead><TableHead>Capaian</TableHead><TableHead>Catatan pemantauan</TableHead></TableRow></TableHeader><TableBody>{plans.map(plan=><TableRow key={plan.id}><TableCell className="primary-cell"><strong>{plan.name}</strong><small className="block muted mt-1">{plan.location.name}</small></TableCell><TableCell>{plan.current} / {plan.target} {plan.indicator.unit.toLowerCase()}</TableCell><TableCell><div className="monitor-progress"><strong>{plan.progress}%</strong><Meter value={plan.progress} label={plan.name}/><StateBadge progress={plan.progress}/></div></TableCell><TableCell className="primary-cell">{plan.risk}</TableCell></TableRow>)}</TableBody></Table></section>:null}
      {section==='dashboard'?<div className="dashboard-preview"><section className="panel"><div className="panel-heading"><div><h2>Capaian per program</h2><p className="muted text-sm mt-1">Persentase realisasi terhadap target akhir 2026</p></div></div><div className="achievement-chart">{plans.map(plan=><div key={plan.id}><div><span>{plan.location.name}</span><strong>{plan.progress}%</strong></div><Meter value={plan.progress} label={plan.name}/><small className="muted">{plan.current} dari {plan.target} {plan.indicator.unit.toLowerCase()}</small></div>)}</div></section><aside className="space-y-5"><section className="scope-card"><p className="eyebrow mb-3">Realisasi anggaran</p><h2>{rupiah(spent)}</h2><p className="my-3">Dari pagu dummy {rupiah(budget)}</p><Meter value={Math.round(spent/budget*100)} label="Realisasi anggaran"/><strong className="block mt-3">{Math.round(spent/budget*100)}% terserap</strong></section><section className="panel p-6"><h2 className="mb-4">Ringkasan status</h2><div className="status-summary"><p><span>Tercapai</span><strong>{completed}</strong></p><p><span>Sesuai rencana</span><strong>{plans.length-completed-attention}</strong></p><p><span>Perlu perhatian</span><strong>{attention}</strong></p></div><Link href="/monitoring/" className="scope-link">Tinjau monitoring →</Link></section></aside></div>:null}
      {section==='evaluasi'?<div className="evaluation-list">{plans.map(plan=><section className="panel" key={plan.id}><div className="panel-heading"><div><p className="eyebrow text-primary mb-2">{plan.id} · {plan.location.name}</p><h2>{plan.name}</h2></div><StateBadge progress={plan.progress}/></div><div className="evaluation-body"><div><p className="eyebrow mb-2">Temuan</p><p>{plan.risk}</p><small className="block muted mt-3">Realisasi {plan.current} dari {plan.target} {plan.indicator.unit.toLowerCase()} · {plan.progress}%</small></div><div><p className="eyebrow text-primary mb-2">Rekomendasi tindak lanjut</p><p>{plan.recommendation}</p><small className="block muted mt-3">{plan.owner} · Tenggat contoh: November 2026</small></div></div></section>)}</div>:null}
    </>}
    <p className="planning-footnote">Angka dan rekomendasi merupakan simulasi preview per 8 Oktober 2026. Status menggunakan ambang contoh: tercapai ≥100%, sesuai rencana ≥60%, perlu perhatian &lt;60%.</p>
  </div>;
}
