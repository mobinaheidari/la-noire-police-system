"use client";
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { 
  User, ShieldAlert, Fingerprint, ArrowRight, 
  Loader2, Info, X, Mic, History, Calendar, 
  FileSearch, ChevronLeft 
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state: any) => state.user);

  // States
  const [suspects, setSuspects] = useState<any[]>([]);
  const [interrogations, setInterrogations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<any>(null);
  const [interrogationText, setInterrogationText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch Data function 
  const fetchPageData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);

      const [suspectsRes, historyRes] = await Promise.all([
        api.get(`/suspects/list/?case=${id}`),
        api.get(`/suspects/interrogations/?case=${id}`)
      ]);
      setSuspects(suspectsRes.data);
      setInterrogations(historyRes.data);
    } catch (err) {
      console.error("خطا در بازیابی اطلاعات پرونده:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  // Submit Interrogation
  const handleInterrogationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspect || !user) return;
    
    setSubmitting(true);
    try {
      await api.post('/suspects/interrogations/', {
        suspect: selectedSuspect.id,
        transcript: interrogationText, 
        detective: user.id,        
        sergeant: user.id,         
        detective_score: 5,        
        sergeant_score: 5          
      });
      
      setIsModalOpen(false);
      setInterrogationText("");
      fetchPageData();
    } catch (err: any) {
      alert("❌ خطا در ثبت گزارش در پایگاه داده مرکزی.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && suspects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-slate-400 mb-4" size={48} />
        <p className="text-slate-500 font-bold">در حال فراخوانی پرونده کلاسه #{id}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm"
        >
          <div className="bg-white p-2 rounded-lg border border-slate-200 group-hover:border-slate-400">
            <ArrowRight size={18} />
          </div>
          بازگشت به بایگانی
        </button>
      </div>

      {/* Case File Header */}
      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-slate-900"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-900 border border-slate-200">
              <ShieldAlert size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900">پرونده کلاسه #{id}</h1>
                <span className="bg-amber-100 text-amber-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">طبقه‌بندی شده</span>
              </div>
              <p className="text-slate-500 mt-2 font-medium">
                افسر پرونده: <span className="text-slate-900 underline underline-offset-4 decoration-slate-200">کارآگاه {user?.username}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suspects Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
          <h2 className="text-xl font-black text-slate-800 italic">مظنونین و افراد تحت پیگرد</h2>
        </div>

        {suspects.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-16 flex flex-col items-center text-center">
            <Info size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">هیچ فردی برای این پرونده ثبت نشده است.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suspects.map((suspect) => (
              <div key={suspect.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="h-52 bg-slate-100 flex items-center justify-center relative">
                  <User size={90} className="text-slate-200 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 inset-x-4 flex justify-between items-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      suspect.status === 'most_wanted' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 text-white'
                    }`}>
                      {suspect.status === 'most_wanted' ? 'Most Wanted' : suspect.status}
                    </span>
                    <span className="text-slate-400 font-mono text-xs bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-100">ID: {suspect.id}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-800 text-center mb-6">
                    {suspect.first_name ? `${suspect.first_name} ${suspect.last_name}` : 'هویت ناشناس'}
                  </h3>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-slate-50 text-slate-600 py-3.5 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                      <Fingerprint size={16} /> سوابق
                    </button>
                    <button 
                      onClick={() => { setSelectedSuspect(suspect); setIsModalOpen(true); }}
                      className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                    >
                      <Mic size={16} /> بازجویی
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Interrogation History Section (Timeline Style) */}
      <section className="space-y-6 pt-10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-8 bg-slate-900 rounded-full"></div>
          <h2 className="text-xl font-black text-slate-800 italic">بایگانی اعترافات و گزارش‌های بازجویی</h2>
        </div>

        <div className="space-y-4">
          {interrogations.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center">
              <History size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">تاریخچه‌ای برای این پرونده ثبت نشده است.</p>
            </div>
          ) : (
            interrogations.map((entry) => (
              <div key={entry.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-colors flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <FileSearch size={24} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-black text-slate-900">گزارش بازجویی #{entry.id}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Calendar size={12} /> {new Date(entry.created_at).toLocaleDateString('fa-IR')}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-100 px-3 py-1 rounded-full font-bold">
                      مظنون کد: {entry.suspect}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                    "{entry.transcript}"
                  </p>
                </div>
                <div className="md:text-left shrink-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">افسر بازجو</p>
                  <p className="text-sm font-black text-slate-800">Detective #{entry.detective}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Interrogation Modal */}
      {isModalOpen && selectedSuspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                  <Mic size={28} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">اتاق بازجویی ۰۱</h2>
                  <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-tighter">
                    مظنون: {selectedSuspect.first_name || 'ناشناس'} | کلاسه: {id}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-xl shadow-sm text-slate-400 hover:text-rose-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleInterrogationSubmit} className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase mr-2">صورتجلسه بازجویی / اعترافات</label>
                <textarea 
                  required
                  rows={6}
                  value={interrogationText}
                  onChange={(e) => setInterrogationText(e.target.value)}
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all resize-none text-sm leading-relaxed italic"
                  placeholder="شاهد/مظنون اظهار داشت که..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors text-sm">
                  انصراف و خروج
                </button>
                <button 
                  disabled={submitting}
                  type="submit"
                  className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 text-sm"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <FileSearch size={18} />
                      تایید و ضمیمه به پرونده
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}