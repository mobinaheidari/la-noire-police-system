"use client";
import { useAuthStore } from '@/features/auth/authStore';
import { FileText, Users, Gavel, Activity, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { label: 'پرونده‌های فعال', value: '۱۲', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'مظنونین تحت نظر', value: '۴۸', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'احکام صادره', value: '۵', icon: Gavel, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'هشدار امنیتی', value: '۳', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* بنر خوش‌آمدگویی پلیسی */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">
            خوش آمدید، افسر {user?.first_name || 'محترم'}
          </h1>
          <p className="mt-4 text-slate-400 max-w-md leading-relaxed text-lg">
            تمامی واحدها در حالت آماده‌باش هستند. گزارش‌های جدید در بخش پرونده‌ها منتظر بررسی شماست.
          </p>
        </div>
        
        {/* واترمارک پشت زمینه برای قشنگی */}
        <div className="absolute left-[-5%] bottom-[-20%] text-[15rem] font-black opacity-5 select-none italic">
          L.A.P.D
        </div>
      </div>

      {/* شبکه کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}