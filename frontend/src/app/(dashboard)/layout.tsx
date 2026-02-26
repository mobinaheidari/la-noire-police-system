"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!savedToken) {
      router.replace("/login");
    }
  }, [router]);

  
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}