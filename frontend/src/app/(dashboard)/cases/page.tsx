export default function CasesPage() {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col items-center justify-center text-center">
      
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">📂</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-800">
        مدیریت پرونده‌ها
      </h1>

      <p className="text-slate-500 mt-3 max-w-sm leading-relaxed">
        در این بخش می‌توانید پرونده‌های ثبت‌شده را مشاهده، ایجاد یا ویرایش نمایید.
        امکانات کامل مدیریت پرونده در فاز بعدی فعال خواهد شد.
      </p>

    </div>
  );
}