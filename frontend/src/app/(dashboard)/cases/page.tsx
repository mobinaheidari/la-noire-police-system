"use client";
import { useEffect, useState, useMemo } from 'react';
import api from '@/services/api';
import { Case } from '@/types/case';
import { useAuthStore } from '@/features/auth/authStore';
import { 
  Plus, FileText, Clock, ChevronLeft, Search, 
  Filter, AlertCircle, Loader2, X 
} from 'lucide-react';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
 
  const [newCase, setNewCase] = useState({ title: '', description: '', status: 'open' });
  const [submitting, setSubmitting] = useState(false);

  const token = useAuthStore((state) => state.token);

  const fetchCases = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await api.get('/cases/list/');
      setCases(response.data);
    } catch (err) {
      console.error("خطا در دریافت پرونده‌ها:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [token]);

 
  const filteredCases = useMemo(() => {
    return cases.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toString().includes(searchQuery)
    );
  }, [cases, searchQuery]);

  
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/cases/list/', newCase);
      setIsModalOpen(false);
      setNewCase({ title: '', description: '', status: 'open' });
      fetchCases(); 
    } catch (err) {
      alert("خطا در ثبت پرونده. لطفاً فیلدها را چک کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open': return { label: 'جاری', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'closed': return { label: 'مختومه', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case 'pending_officer': return { label: 'در انتظار افسر', color: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'pending_cadet': return { label: 'در انتظار کارآموز', color: 'text-slate-600 bg-slate-50 border-slate-100' };
      default: return { label: 'نامشخص', color: 'text-slate-400 bg-slate-50 border-slate-100' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <FileText size={20} />
            </div>
            مدیریت پرونده‌های جنایی
          </h1>
          <p className="text-slate-500 text-sm mt-1 mr-13">دسترسی به بایگانی مرکزی دپارتمان پلیس</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          ثبت گزارش عملیاتی جدید
        </button>
      </div>

      {/* بخش فیلتر و جستجو */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان یا کد پرونده..." 
            className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all shadow-sm text-slate-700"
          />
        </div>
      </div>

      {/* نمایش لیست */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">در حال فراخوانی پرونده‌ها...</p>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center text-center">
          <AlertCircle size={40} className="text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">پرونده‌ای یافت نشد</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filteredCases.map((item) => {
            const statusInfo = getStatusInfo(item.status);
            return (
              <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[11px] font-black px-4 py-1.5 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-slate-300 font-mono text-sm">#{item.id.toString().padStart(4, '0')}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2 h-10">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                      <Clock size={14} />
                      {new Date(item.created_at).toLocaleDateString('fa-IR')}
                    </div>
                    <button className="flex items-center gap-1 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
                      جزئیات
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- مودال ثبت پرونده جدید --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">گزارش جدید</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCase} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان پرونده</label>
                <input 
                  required
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                  placeholder="مثال: سرقت مسلحانه در پاشا..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">توضیحات اولیه</label>
                <textarea 
                  required
                  rows={4}
                  value={newCase.description}
                  onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all resize-none"
                  placeholder="جزئیات صحنه جرم را وارد کنید..."
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  انصراف
                </button>
                <button 
                  disabled={submitting}
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : 'ثبت در بایگانی'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}