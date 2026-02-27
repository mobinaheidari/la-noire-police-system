"use client";

import { useState } from "react"; 
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/authStore";
import { Bell, Search, UserCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    if (confirm("آیا از خروج از سامانه اطمینان دارید؟")) {
      logout();
      router.replace("/login");
    }
  };

  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      
      router.push(`/cases?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10"
      dir="rtl"
    >
      {/* سرچ */}
      <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full w-96 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
        <Search size={18} className="text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="جستجوی عنوان پرونده یا شماره..."
          className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* نوتیفیکیشن */}
        <button className="relative text-slate-500 hover:text-blue-600">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            ۳
          </span>
        </button>

        {/* پروفایل + خروج */}
        <div className="flex items-center gap-4 border-r pr-6 border-slate-200">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">
              {user?.first_name
                ? `${user.first_name} ${user.last_name}`
                : "افسر سامانه"}
            </p>

            <p className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-center">
              {user?.roles?.length
                ? user.roles[0].name
                : "نقش تعیین نشده"}
            </p>
          </div>

          <UserCircle size={32} className="text-slate-400" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all font-bold"
          >
            <LogOut size={18} />
            <span className="text-sm">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}