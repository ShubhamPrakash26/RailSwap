import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}