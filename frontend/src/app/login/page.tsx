"use client";
import { useState } from 'react';
import { ShieldCheck, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // فعلاً برای تست، مستقیماً به داشبورد می‌رویم
    // بعداً که مبینا API را آماده کرد، اینجا عمل Login واقعی را انجام می‌دهیم
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* کارت لاگین */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          
          {/* هدر کارت */}
          <div className="bg-slate-900 p-8 text-center text-white border-b-4 border-blue-600">
            <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4 text-blue-500">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">ورود به مرکز فرماندهی</h2>
            <p className="text-slate-400 mt-2 text-sm">سامانه جامع پلیس L.A. Noire</p>
          </div>
          
          {/* فرم ورود */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">کد ملی (نام کاربری)</label>
              <div className="relative text-slate-400 focus-within:text-blue-600 transition-colors">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required 
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900"
                  placeholder="کد ملی ۱۰ رقمی"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
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

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
            >
              بررسی هویت و ورود
            </button>
            
            <p className="text-[11px] text-center text-slate-400 mt-4 leading-relaxed">
              هشدار: هرگونه دسترسی غیرمجاز به این سامانه پیگرد قانونی دارد و تحت نظارت واحد امنیت شبکه می‌باشد.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

