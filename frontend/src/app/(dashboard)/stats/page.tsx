export default function StatsPage() {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col items-center justify-center text-center">
      
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">📊</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-800">
        گزارش‌ها و آمار سامانه
      </h1>

      <p className="text-slate-500 mt-3 max-w-sm leading-relaxed">
        آمارهای عملیاتی، گزارش‌های مدیریتی و تحلیل داده‌های سامانه در این بخش نمایش داده خواهد شد.
        این ماژول در حال پیاده‌سازی است.
      </p>

    </div>
  );
}