"use client";
import { useAuthStore } from '@/features/auth/authStore';
import { Bell, Search, UserCircle } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10" dir="rtl">
      <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full w-96">
        <Search size={18} className="text-slate-400 ml-2" />
        <input type="text" placeholder="جستجوی پرونده، کد ملی..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-blue-600">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">۳</span>
        </button>
        
        <div className="flex items-center gap-3 border-r pr-6 border-slate-200">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{user?.first_name || 'افسر'} {user?.last_name || 'سنا'}</p>
            <p className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-center">
              {user?.roles?.[0]?.name || 'کارآگاه ارشد'}
            </p>
          </div>
          <UserCircle size={32} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}