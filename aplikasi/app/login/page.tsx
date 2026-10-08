import { LoginForm } from "@/components/product/login-form";
export default function LoginPage() {
  return <main className="login-layout">
    <section className="login-aside">
      <div className="brand"><div className="brand-mark" aria-hidden="true">B</div><div><strong>RUANG PERBATASAN</strong><small>Perencanaan dan pengendalian BWN–KP</small></div></div>
      <div className="login-intro"><div className="eyebrow" style={{color:'#d4b46c'}}>Badan Nasional Pengelola Perbatasan</div><h1>Satu ruang kerja.<br/>Arah pembangunan<br/>yang terhubung.</h1><p>Menyiapkan rencana, memantau pelaksanaan, dan menelusuri hasil pembangunan kawasan perbatasan.</p><div className="domain-lines">{['Batas Wilayah Negara','Gerbang Negara dan PLBN','Kawasan Perbatasan','Koridor Ekonomi Perbatasan'].map((s,i)=><div key={s}><span>0{i+1}</span>{s}</div>)}</div></div>
      <footer className="eyebrow" style={{color:'#bacadc'}}>Grand Desain 2026–2045</footer>
    </section>
    <section className="login-main"><LoginForm/></section>
  </main>;
}
