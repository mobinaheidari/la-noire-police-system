"use client";
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { ShieldAlert, Clock, DollarSign, UserX, Loader2 } from 'lucide-react';

export default function MostWantedPage() {
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostWanted = async () => {
      try {
        const res = await api.get('/suspects/list/most-wanted/');
        setCriminals(res.data);
      } catch (err) {
        console.error("خطا در بارگذاری لیست سیاه", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMostWanted();
  }, []);

 
  const calculateReward = (days: number, level: number) => {
    const rank = 4 - level; 
    return days * rank * 20000000;
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-slate-900" size={48} />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* هدر صفحه به سبک تیتر روزنامه‌های قدیمی */}
      <div className="text-center space-y-4 border-b-4 border-double border-slate-900 pb-8">
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-red-700 decoration-4 underline-offset-8">
          L.A. MOST WANTED
        </h1>
        <p className="text-xl font-serif font-black italic text-red-800">
          دستور بازداشت فوری - زنده یا مرده
        </p>
      </div>

      {criminals.length === 0 ? (
        <div className="text-center p-20 border-2 border-dashed border-slate-400">
          <p className="font-serif italic text-slate-500">در حال حاضر هیچ مظنونی بیش از ۳۰ روز در تعقیب نیست.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {criminals.map((criminal: any) => {
            const reward = calculateReward(criminal.days_wanted || 0, criminal.crime_level);
            
            return (
              <div key={criminal.id} className="noir-card relative group flex flex-col md:flex-row overflow-hidden bg-[#fdfcf8]">
                {/* برچسب وضعیت در گوشه */}
                <div className="absolute top-0 left-0 bg-red-700 text-white px-8 py-1 -rotate-45 -translate-x-8 translate-y-2 font-black text-xs shadow-lg z-20">
                  EXTREMELY DANGEROUS
                </div>

                {/* تصویر مظنون (فیلتر سیاه و سفید) */}
                <div className="w-full md:w-56 h-72 bg-slate-300 border-b-2 md:border-b-0 md:border-l-4 border-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 z-10"></div>
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <UserX size={80} strokeWidth={1} />
                  </div>
                  {/* اگر تصویر داشتی اینجا بگذار */}
                  {/* <img src={criminal.photo} className="w-full h-full object-cover grayscale contrast-125" /> */}
                </div>

                {/* جزئیات پرونده و جایزه */}
                <div className="flex-1 p-8 space-y-6">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase leading-none">
                      {criminal.user_details?.first_name || 'نامشخص'} {criminal.user_details?.last_name || ''}
                    </h2>
                    <p className="text-sm font-bold text-slate-500 mt-1">کد شناسایی: #{criminal.id * 1042}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm font-black italic">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={18} className="text-red-800" />
                      <span>{criminal.days_wanted} روز فراری</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <ShieldAlert size={18} className="text-red-800" />
                      <span>سطح جرم: {criminal.crime_level}</span>
                    </div>
                  </div>

                  {/* بخش نمایش جایزه (فرمول ۳۰۰ امتیازی) */}
                  <div className="bg-slate-900 p-5 border-2 border-dashed border-[#f2f0e9] relative">
                    <div className="absolute -top-3 right-4 bg-red-700 text-white text-[10px] px-2 py-0.5 font-bold">
                      REWARD AMOUNT
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white tracking-tighter">
                        {reward.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-300 font-bold">ریال</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-2 font-serif italic">
                      این مبلغ بر اساس روزهای تحت تعقیب و رتبه جرمی محاسبه شده است.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* پانویس قانونی داک */}
      <div className="text-center pt-10 border-t border-slate-300">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
          All information is confidential. Department of Investigation - 1947
        </p>
      </div>
    </div>
  );
}