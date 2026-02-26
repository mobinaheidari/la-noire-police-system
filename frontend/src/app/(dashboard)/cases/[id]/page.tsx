"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { User, ShieldAlert, Fingerprint, ArrowRight, Loader2, Info, X, Mic } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  
  const user = useAuthStore((state: any) => state.user);

  const [suspects, setSuspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<any>(null);
  const [interrogationText, setInterrogationText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/suspects/list/?case=${id}`);
        setSuspects(response.data);
      } catch (err) {
        console.error("خطا در دریافت لیست مظنونین:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchSuspects();
  }, [id]);

  
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
      
      alert("✅ گزارش بازجویی با موفقیت در بایگانی ثبت شد.");
      setIsModalOpen(false);
      setInterrogationText("");
    } catch (err: any) {
      console.error("خطا در ثبت بازجویی:", err.response?.data);
      alert("❌ خطای سیستمی: گزارش بازجویی رد شد.");
    } finally {
      setSubmitting(false);
    }
  };

  const openInterrogationModal = (suspect: any) => {
    setSelectedSuspect(suspect);
    setIsModalOpen(true);
  };

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
            <p className="text-slate-500 mt-1">لیست مظنونین تحت نظر کارآگاه {user?.username || 'ناشناس'}</p>
          </div>
        </div>
      </div>

      {/* لیست مظنونین */}
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-slate-400 font-medium">در حال استخراج پرونده‌های مرتبط...</p>
        </div>
      ) : suspects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center text-center">
          <Info size={40} className="text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">مظنونی ثبت نشده است</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {suspects.map((suspect) => (
            <div key={suspect.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="h-56 bg-slate-100 flex items-center justify-center relative">
                <User size={100} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-4 right-6 left-6 flex justify-between items-end">
                  <div className={`text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase ${suspect.status === 'most_wanted' ? 'bg-rose-600 animate-pulse' : 'bg-slate-800'}`}>
                    {suspect.status === 'most_wanted' ? 'تحت تعقیب' : suspect.status}
                  </div>
                  <span className="text-slate-400 font-mono text-xs">ID: #{suspect.id}</span>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-black text-slate-800 text-center">
                  {suspect.first_name ? `${suspect.first_name} ${suspect.last_name}` : 'مظنون ناشناس'}
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">
                    <Fingerprint size={18} />
                    سوابق
                  </button>
                  <button 
                    onClick={() => openInterrogationModal(suspect)}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all shadow-lg"
                  >
                    <Mic size={18} />
                    بازجویی
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مودال ثبت بازجویی */}
      {isModalOpen && selectedSuspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <Mic size={24} className="text-rose-600 animate-pulse" />
                  اتاق بازجویی
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  مظنون: {selectedSuspect.first_name || 'ناشناس'} | کارآگاه: {user?.username}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors bg-white p-2 rounded-full border border-slate-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleInterrogationSubmit} className="p-8 space-y-6">
              <textarea 
                required
                rows={6}
                value={interrogationText}
                onChange={(e) => setInterrogationText(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all resize-none text-sm leading-relaxed"
                placeholder="متن کامل اظهارات مظنون را وارد کنید..."
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">
                  لغو
                </button>
                <button 
                  disabled={submitting}
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : 'ثبت گزارش'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}