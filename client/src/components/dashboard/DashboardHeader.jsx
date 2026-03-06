import { Bell, Plus } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Traveler Dashboard
        </h1>

        <p className="text-slate-400 mt-1">
          Welcome back, Arjun! Here's your journey overview.
        </p>
      </div>

      <div className="flex items-center gap-3">

        <button className="p-2.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500">
          <Bell size={18} />
        </button>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg">
          <Plus size={16} />
          New Request
        </button>

      </div>
    </header>
  );
}