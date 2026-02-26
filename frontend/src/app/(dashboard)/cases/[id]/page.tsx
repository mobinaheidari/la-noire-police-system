"use client";
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { 
  User, ShieldAlert, Fingerprint, ArrowRight, 
  Loader2, Info, X, Mic, History, Calendar, 
  FileSearch, Gavel, DollarSign, CheckCircle2, Clock
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state: any) => state.user);

  // Data States
  const [suspects, setSuspects] = useState<any[]>([]);
  const [interrogations, setInterrogations] = useState<any[]>([]);
  const [bails, setBails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interrogation Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interrogationText, setInterrogationText] = useState("");
  
  // Bail Modal States
  const [isBailModalOpen, setIsBailModalOpen] = useState(false);
  const [bailAmount, setBailAmount] = useState("");
  
  // Shared States
  const [selectedSuspect, setSelectedSuspect] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch All Data (Suspects, Interrogations, Bails)
  const fetchPageData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [suspectsRes, historyRes, bailsRes] = await Promise.all([
        api.get(`/suspects/list/?case=${id}`),
        api.get(`/suspects/interrogations/?case=${id}`),
        api.get(`/suspects/bails/?case=${id}`)
      ]);
      setSuspects(suspectsRes.data);
      setInterrogations(historyRes.data);
      setBails(bailsRes.data);
    } catch (err) {
      console.error("خطا در بازیابی پرونده:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  // Handle Interrogation Submission
  const handleInterrogationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspect || !user) return;
    setSubmitting(true);
    try {
      await api.post('/suspects/interrogations/', {
        suspect: selectedSuspect.id,
        transcript: interrogationText, 
        detective: user.id, sergeant: user.id,
        detective_score: 5, sergeant_score: 5
      });
      setIsModalOpen(false);
      setInterrogationText("");
      fetchPageData();
    } catch (err) {
      alert("خطا در ثبت بازجویی");
    } finally {
      setSubmitting(false);
    }
  };
  const handleStatusChange = async (suspectId: number, newStatus: string) => {
    try {
      
      await api.patch(`/suspects/list/${suspectId}/`, { status: newStatus });
      fetchPageData(); 
    } catch (err) {
      alert("❌ خطا در تغییر وضعیت مظنون");
    }
  };
  // Handle Bail Submission
  const handleBailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspect) return;
    setSubmitting(true);
    try {
      await api.post('/suspects/bails/', {
        suspect: selectedSuspect.id,
        amount: bailAmount,
        is_paid: false
      });
      alert("⚖️ قرار وثیقه با موفقیت صادر شد.");
      setIsBailModalOpen(false);
      setBailAmount("");
      fetchPageData();
    } catch (err) {
      alert("خطا در صدور قرار وثیقه");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && suspects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-slate-400 mb-4" size={48} />
        <p className="text-slate-500 font-bold tracking-widest">STATION LOADING...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-3 h-full bg-slate-900"></div>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">پرونده کلاسه #{id}</h1>
            <p className="text-slate-500 font-medium">کارآگاه مسئول: {user?.username || 'ناشناس'}</p>
          </div>
        </div>
        <button onClick={() => router.back()} className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl transition-all border border-slate-200">
          <ArrowRight size={24} className="text-slate-600" />
        </button>
      </div>

      {/* Suspects Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          مظنونین پرونده
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suspects.map((suspect) => (
            <div key={suspect.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-48 bg-slate-100 flex items-center justify-center relative">
                <User size={80} className="text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                  suspect.status === 'arrested' ? 'bg-amber-100 text-amber-700' : 'bg-slate-800 text-white'
                }`}>
                  {suspect.status}
                </span>
              </div>
              <div className="p-8 space-y-6">
                <h3 className="text-xl font-black text-slate-800 text-center">{suspect.first_name} {suspect.last_name}</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => { setSelectedSuspect(suspect); setIsModalOpen(true); }}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Mic size={16} /> ثبت بازجویی
                  </button>
                  {suspect.status === 'arrested' && (
                    <button 
                      onClick={() => { setSelectedSuspect(suspect); setIsBailModalOpen(true); }}
                      className="w-full bg-amber-500 text-white py-3.5 rounded-2xl font-bold text-xs hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Gavel size={16} /> صدور قرار وثیقه
                    </button>
                  )}
                  {suspect.status !== 'arrested' && suspect.status !== 'cleared' && (
                      <button 
                        onClick={() => handleStatusChange(suspect.id, 'arrested')}
                        className="w-full mt-2 bg-slate-100 text-slate-600 py-2 rounded-xl font-bold text-[10px] hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200 border-dashed"
                      >
                        🚨 انتقال به بازداشتگاه
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interrogations & Bails History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Interrogation History */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
            تاریخچه بازجویی‌ها
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {interrogations.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">Report #{entry.id}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(entry.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
                <p className="text-slate-600 text-sm italic leading-relaxed">"{entry.transcript}"</p>
                <p className="text-[10px] text-slate-400 font-bold">توسط کارآگاه کد: {entry.detective}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bail History */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
            وضعیت وثیقه‌ها
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {bails.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed rounded-[2rem] p-10 text-center text-slate-400 text-sm">قراری صادر نشده است.</div>
            ) : (
              bails.map((bail) => (
                <div key={bail.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${bail.is_paid ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                      {bail.is_paid ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">مبلغ: {Number(bail.amount).toLocaleString()} تومان</p>
                      <p className="text-[10px] text-slate-400 font-bold">شناسه مظنون: {bail.suspect}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${bail.is_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {bail.is_paid ? 'پرداخت شده' : 'در انتظار'}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Interrogation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Mic className="text-rose-600" /> ثبت اعترافات
            </h2>
            <textarea 
              rows={5} value={interrogationText} onChange={(e) => setInterrogationText(e.target.value)}
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none text-sm"
              placeholder="شرح بازجویی..."
            />
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-slate-400">انصراف</button>
              <button onClick={handleInterrogationSubmit} disabled={submitting} className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-sm">
                {submitting ? 'در حال ثبت...' : 'تایید و ذخیره'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bail Modal */}
      {isBailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-3 rounded-2xl text-white"><DollarSign size={24} /></div>
              <h2 className="text-2xl font-black text-slate-900">صدور قرار وثیقه</h2>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">مبلغ وثیقه (تومان)</label>
              <input 
                type="number" value={bailAmount} onChange={(e) => setBailAmount(e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none text-xl font-black text-slate-900"
                placeholder="0"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsBailModalOpen(false)} className="flex-1 font-bold text-slate-400">لغو</button>
              <button onClick={handleBailSubmit} disabled={submitting} className="flex-[2] bg-amber-500 text-white py-4 rounded-2xl font-black text-sm">
                {submitting ? 'در حال ثبت...' : 'صدور حکم وثیقه'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}