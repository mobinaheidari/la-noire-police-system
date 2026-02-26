"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // در آینده اینجا متد اصلی لاگین فراخوانی می‌شود
    console.log("در حال تلاش برای ورود با:", identifier);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800 font-sans">
          
          <div className="bg-slate-900 p-8 text-center text-white border-b-4 border-blue-600">
            <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4 text-blue-500">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-bold">ورود به مرکز فرماندهی</h2>
            <p className="text-slate-400 mt-2 text-sm">سامانه جامع پلیس L.A. Noire</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">شناسه کاربری</label>
              <div className="relative text-slate-400 focus-within:text-blue-600 transition-colors">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required 
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900"
                  placeholder="کد ملی / ایمیل / نام کاربری"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">رمز عبور امنیتی</label>
              <div className="relative text-slate-400 focus-within:text-blue-600 transition-colors">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required 
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2">
              بررسی هویت و ورود
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}