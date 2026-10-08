"use client";
import Link from "next/link";
import {Button} from '@/components/ui/button';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="mx-auto max-w-xl p-10"><h1>Ruang kerja belum tersedia</h1><p className="my-5 muted">Terjadi masalah saat memuat data. Coba kembali tanpa mengirim perubahan berulang kali.</p><Button onClick={reset}>Coba kembali</Button><Link href="/login" className="ml-5 underline">Ke halaman masuk</Link></main>;}
