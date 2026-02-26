"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '@/services/api';
import { useAuthStore } from '@/features/auth/authStore';
import { 
  Users, Search, Filter, ShieldAlert, 
  Fingerprint, Loader2, UserX, FileText 
} from 'lucide-react';
import Link from 'next/link';


interface Suspect {
  id: number;
  case: number;
  status: string;
  first_name?: string;
  last_name?: string;
}

export default function SuspectsPage() {
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchAllSuspects = async () => {
      if (!token) return;
      try {
        setLoading(true);
      
        const response = await api.get('/suspects/list/');
        setSuspects(response.data);
      } catch (err) {
        console.error("خطا در دریافت بانک مظنونین:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSuspects();
  }, [token]);

  
  const filteredSuspects = useMemo(() => {
    return suspects.filter(s => 
      s.id.toString().includes(searchQuery) ||
      (s.first_name && s.first_name.includes(searchQuery)) ||
      (s.last_name && s.last_name.includes(searchQuery)) ||
      s.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suspects, searchQuery]);

  
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'most_wanted': 
        return { label: 'تحت تعقیب (خطرناک)', bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-600' };
      case 'suspect': 
        return { label: 'مظنون', bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-500' };
      case 'cleared': 
        return { label: 'رفع سوءظن', bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-500' };
      case 'arrested': 
        return { label: 'بازداشت شده', bg: 'bg-slate-800', text: 'text-white', border: 'border-slate-800' };
      default: 
        return { label: status || 'نامشخص', bg: 'bg-slate-200', text: 'text-slate-700', border: 'border-slate-300' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-300">
              <Users size={24} />
            </div>
            بانک اطلاعاتی مظنونین
          </h1>
          <p className="text-slate-500 text-sm mt-2 mr-16">
            دسترسی یکپارچه به لیست تمام افراد تحت پیگرد، مظنونین و بازداشت‌شدگان
          </p>
        </div>
      </div>

      {/* نوار جستجو و فیلتر */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس شماره ID، نام یا وضعیت (مثلاً most_wanted)..." 
            className="w-full pr-12 pl-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm font-medium"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-4 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm font-bold">
          <Filter size={18} />
          فیلتر وضعیت
        </button>
      </div>

      {/* نمایش وضعیت بارگذاری یا دیتای خالی */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold text-lg">در حال استعلام از پایگاه داده پلیس...</p>
        </div>
      ) : filteredSuspects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-24 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <UserX size={48} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">رکوردی یافت نشد</h3>
          <p className="text-slate-500 mt-2 font-medium">مظنونی با این مشخصات در سیستم ثبت نشده است.</p>
        </div>
      ) : (
        /* گرید نمایش کارت مظنونین */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
          {filteredSuspects.map((suspect) => {
            const statusConfig = getStatusConfig(suspect.status);
            const isMostWanted = suspect.status.toLowerCase() === 'most_wanted';

            return (
              <div key={suspect.id} className={`bg-white rounded-[2rem] border-2 ${isMostWanted ? 'border-rose-100 shadow-rose-100' : 'border-slate-100'} overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 group flex flex-col`}>
                
                {/* بخش عکس (Mugshot) */}
                <div className={`h-48 flex items-center justify-center relative ${isMostWanted ? 'bg-rose-50' : 'bg-slate-100'}`}>
                  {isMostWanted && (
                    <div className="absolute top-0 left-0 w-full bg-rose-600 text-white text-xs font-black py-1 text-center tracking-widest uppercase animate-pulse">
                      هشدار سطح بالا
                    </div>
                  )}
                  
                  <Users size={80} className={`${isMostWanted ? 'text-rose-200' : 'text-slate-300'} group-hover:scale-110 transition-transform duration-500`} />
                  
                  <div className={`absolute -bottom-4 bg-white px-4 py-1.5 rounded-xl border-2 ${statusConfig.border} font-black text-xs shadow-sm flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full ${statusConfig.bg} ${isMostWanted ? 'animate-ping' : ''}`}></div>
                    {statusConfig.label}
                  </div>
                </div>
                
                {/* اطلاعات مظنون */}
                <div className="p-6 pt-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-800">
                        {suspect.first_name || suspect.last_name ? `${suspect.first_name || ''} ${suspect.last_name || ''}` : 'مظنون ناشناس'}
                      </h3>
                      <p className="text-slate-400 font-mono text-xs mt-1">ID: #{suspect.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>

                  {/* اتصال به پرونده */}
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <Link href={`/cases/${suspect.case}`} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors bg-slate-50 p-3 rounded-xl hover:bg-blue-50">
                      <FileText size={16} />
                      مشاهده پرونده مرتبط
                    </Link>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}