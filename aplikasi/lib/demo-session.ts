import {demoAccounts, DEMO_PASSWORD} from './demo-data';

const SESSION_KEY='ruang-perbatasan-demo-v1';
const SESSION_EVENT='ruang-perbatasan-demo-change';

// Hanya pilihan akun untuk navigasi demo, bukan token autentikasi.
export function readDemoSession(): string | null {
  try {
    const key=window.sessionStorage.getItem(SESSION_KEY);
    return demoAccounts.some(account=>account.key===key)?key:null;
  } catch {return null;}
}
export function loginDemo(email: string,password: string) {
  const account=demoAccounts.find(item=>`${item.key}@demo.bnpp.test`===email.trim().toLowerCase());
  if(!account||password!==DEMO_PASSWORD)throw new Error('Email atau kata sandi demo salah. Pilih salah satu akun contoh di bawah.');
  try {window.sessionStorage.setItem(SESSION_KEY,account.key);}
  catch {throw new Error('Penyimpanan sesi browser tidak tersedia. Izinkan penyimpanan situs lalu coba lagi.');}
  window.dispatchEvent(new Event(SESSION_EVENT));
}
export function logoutDemo() {
  window.sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}
export function subscribeDemoSession(onChange:()=>void) {
  window.addEventListener('storage',onChange);
  window.addEventListener('pageshow',onChange);
  window.addEventListener(SESSION_EVENT,onChange);
  return ()=>{
    window.removeEventListener('storage',onChange);
    window.removeEventListener('pageshow',onChange);
    window.removeEventListener(SESSION_EVENT,onChange);
  };
}
