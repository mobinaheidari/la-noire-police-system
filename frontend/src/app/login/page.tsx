"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User } from "lucide-react";
import api from "@/services/api";
import { useAuthStore } from "@/features/auth/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login/", {
        username: identifier, 
        password: password,
      });

      
      const { access, refresh } = response.data;
      
      
      const user = response.data.user || null;

      setAuth(user, access);
      router.replace("/dashboard");
    } catch (err: any) {
      setError("اطلاعات ورود نامعتبر است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800 font-sans">
          <div className="bg-slate-900 p-8 text-center text-white border-b-4 border-blue-600">
            <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4 text-blue-500">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-bold">
              ورود به مرکز فرماندهی
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              سامانه جامع پلیس L.A. Noire
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">
                شناسه کاربری
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900"
                  placeholder="کد ملی / ایمیل / نام کاربری"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">
                رمز عبور امنیتی
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all"
            >
              {loading ? "در حال بررسی..." : "بررسی هویت و ورود"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}