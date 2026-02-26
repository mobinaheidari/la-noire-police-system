"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { User, ShieldAlert, Fingerprint, ArrowRight, Loader2, Info } from 'lucide-react';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [suspects, setSuspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/suspects/list/?case=${id}`);
        setSuspects(response.data);
      } catch (err) {
        console.error("خطا در دریافت لیست مظنونین پرونده:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchSuspects();
    }
  }, [id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* دکمه بازگشت */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit"
      >
        <ArrowRight size={18} />
        بازگشت به لیست پرونده‌ها
      </button>

      {/* هدر صفحه پرونده */}
      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white border border-slate-700 shadow-lg">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">پرونده کلاسه #{id}</h1>
            <p className="text-slate-500 mt-1">لیست مظنونین و افراد مرتبط با این پرونده</p>
          </div>
        </div>
      </div>

      {/* بخش نمایش مظنونین */}
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-slate-400 font-medium">در حال استخراج داده‌های پرونده...</p>
        </div>
      ) : suspects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Info size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">هیچ مظنونی یافت نشد</h3>
          <p className="text-slate-500 mt-2">برای این پرونده هنوز هیچ فرد مظنونی در سیستم ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suspects.map((suspect) => (
            <div key={suspect.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              
              {/* عکس مظنون */}
              <div className="h-56 bg-slate-100 flex items-center justify-center relative">
                {suspect.status === 'most_wanted' && (
                  <div className="absolute inset-0 bg-rose-500/10 z-0"></div>
                )}
                <User size={100} className="text-slate-300 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                
                <div className="absolute bottom-4 right-6 left-6 flex justify-between items-end relative z-10">
                  <div className={`text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-md ${suspect.status === 'most_wanted' ? 'bg-rose-600 animate-pulse' : 'bg-slate-800'}`}>
                    {suspect.status === 'most_wanted' ? 'تحت تعقیب' : suspect.status}
                  </div>
                  <span className="text-slate-400 font-mono text-xs font-bold">ID: #{suspect.id.toString().padStart(4, '0')}</span>
                </div>
              </div>
              
              {/* اطلاعات کارت */}
              <div className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-black text-slate-800">
                    {suspect.first_name ? `${suspect.first_name} ${suspect.last_name}` : 'مظنون ناشناس'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all border border-slate-100">
                    <Fingerprint size={18} />
                    سوابق
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all shadow-lg shadow-slate-200">
                    بازجویی
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}