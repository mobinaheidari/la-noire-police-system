"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderOpen, 
  ShieldAlert, 
  Users, 
  Scale, 
  Target, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';

const menuItems = [
  { name: 'داشبورد', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'پرونده‌ها', icon: FolderOpen, href: '/cases' },
  { name: 'شواهد', icon: ShieldAlert, href: '/evidences' },
  { name: 'مظنونین', icon: Users, href: '/suspects' },
  { name: 'دادگاه‌ها', icon: Scale, href: '/trials' },
  { name: 'لیست سیاه (Most Wanted)', icon: Target, href: '/most-wanted', isSpecial: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-l border-slate-800" dir="rtl">
      <div className="p-6 text-center border-b border-slate-800">
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">LA Noire System</h1>
        <p className="text-xs text-blue-400 mt-1 font-medium">واحد عملیات مرکزی</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                isActive 
                  ? (item.isSpecial ? 'bg-red-700 text-white shadow-lg shadow-red-900/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20')
                  : (item.isSpecial ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' : 'hover:bg-slate-800 hover:text-white')
              }`}
            >
              <item.icon 
                size={20} 
                className={isActive ? 'text-white' : (item.isSpecial ? 'text-red-500 group-hover:text-red-400' : 'group-hover:text-blue-400')} 
              />
              <span className={`font-medium ${item.isSpecial && !isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={20} />
          <span className="font-medium">خروج از سامانه</span>
        </button>
      </div>
    </aside>
  );
}