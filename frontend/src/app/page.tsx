"use client";
import Link from 'next/link';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white" dir="rtl">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 rotate-3">
          <ShieldCheck size={50} />
        </div>
        
        <h1 className="text-5xl font-black tracking-tighter mb-4">
          سامانه متمرکز پلیس <span className="text-blue-500">L.A. Noire</span>
        </h1>
        
        <p className="text-slate-400 text-lg max-w-lg leading-relaxed mb-10">
          واحد مدیریت پرونده‌های جنایی و سیستم نظارت بر مظنونین. 
          لطفاً جهت دسترسی به مرکز فرماندهی، احراز هویت کنید.
        </p>

        <Link href="/login" 
          className="group flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-blue-500 hover:text-white transition-all shadow-xl"
        >
          ورود به سامانه عملیاتی
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}