import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Repeat,
  Route,
  Users,
  Settings,
  Train
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-[#020617] flex flex-col sticky top-0 h-screen">

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
          <Train size={20} />
        </div>
        <span className="font-bold text-xl text-blue-500">
          RailSwap
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/seat-swap"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800"
        >
          <Repeat size={18} />
          Seat Swap
        </NavLink>

        <NavLink
          to="/route-planner"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800"
        >
          <Route size={18} />
          Route Planner
        </NavLink>

        <NavLink
          to="/community"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800"
        >
          <Users size={18} />
          Community
        </NavLink>

      </nav>

      {/* Profile */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold">
              Arjun Sharma
            </p>
            <p className="text-xs text-slate-400">
              Premium Member
            </p>
          </div>

          <Settings size={16} className="text-slate-500" />

        </div>
      </div>
    </aside>
  );
}