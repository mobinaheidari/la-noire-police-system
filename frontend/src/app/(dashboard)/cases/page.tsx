"use client";
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Case } from '@/types/case';
import { Plus, FileText, Clock, AlertCircle } from 'lucide-react';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases/list/');
      setCases(response.data);
    } catch (err) {
      console.error("خطا در دریافت پرونده‌ها", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'closed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending_officer': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">مدیریت پرونده‌های جنایی</h1>
          <p className="text-slate-500 text-sm mt-1">لیست تمامی گزارش‌ها و پرونده‌های تحت بررسی</p>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
          <Plus size={18} />
          ثبت پرونده جدید
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">هیچ پرونده‌ای در سامانه یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-500 transition-colors">
                  <FileText size={24} />
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getStatusStyle(c.status)}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">{c.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                {c.description}
              </p>
              
              <div className="flex items-center gap-4 text-slate-400 text-xs border-t pt-4">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {new Date(c.created_at).toLocaleDateString('fa-IR')}
                </div>
                <div className="mr-auto text-blue-600 font-bold hover:underline cursor-pointer">
                  مشاهده جزئیات
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}