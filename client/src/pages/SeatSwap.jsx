import DashboardLayout from "../components/layout/DashboardLayout";
import PNRCard from "../components/seatswap/PNRCard";
import SwapList from "../components/seatswap/SwapList";
import JourneyList from "../components/seatswap/JourneyList";

import {
  Train,
  Users,
  ArrowLeftRight,
  Ticket,
  Sparkles,
  Activity,
  Clock,
  MapPin,
  Info
} from "lucide-react";

export default function SeatSwap() {
  return (
    <DashboardLayout>
      {/* HERO */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-black p-10 shadow-2xl">
        <div className="absolute -top-20 -right-20 h-72 w-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-72 w-72 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-indigo-400" size={26} />
              <h1 className="text-3xl font-bold text-white tracking-tight">
                RAC Seat Swap Hub
              </h1>
            </div>

            <p className="text-slate-400 max-w-xl text-lg">
              Coordinate with fellow passengers, find optimal seat partners,
              and turn your RAC ticket into a comfortable journey experience.
            </p>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-500 transition-all px-8 py-3.5 rounded-xl text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
            Find Swap Partner
          </button>
        </div>
      </div>

      {/* DASHBOARD METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <Metric
          icon={<Ticket className="text-indigo-400" />}
          title="Your RAC Position"
          value="RAC 23"
          highlight
        />
        <Metric
          icon={<Users className="text-purple-400" />}
          title="Available Partners"
          value="18"
        />
        <Metric
          icon={<ArrowLeftRight className="text-emerald-400" />}
          title="Active Requests"
          value="5"
        />
        <Metric
          icon={<Activity className="text-blue-400" />}
          title="Swap Success Rate"
          value="82%"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT SIDE */}
        <div className="xl:col-span-4 space-y-8">
          <GlassCard title="Your Ticket">
            <PNRCard />
          </GlassCard>

          <GlassCard title="Upcoming Journey">
            <JourneyList />
          </GlassCard>

          <GlassCard title="Recent Activity">
            <div className="space-y-5">
              <ActivityItem
                icon={<Clock size={16} className="text-blue-400" />}
                text="Swap request sent to Seat 15"
                time="2 min ago"
              />
              <ActivityItem
                icon={<Users size={16} className="text-purple-400" />}
                text="New SL partner available"
                time="10 min ago"
              />
              <ActivityItem
                icon={<MapPin size={16} className="text-emerald-400" />}
                text="Journey chart prepared"
                time="1 hour ago"
              />
            </div>
          </GlassCard>
        </div>

        {/* RIGHT SIDE */}
        <div className="xl:col-span-8 space-y-8">
          {/* SWAP MATCHING */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Smart Seat Matches
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  AI suggested swap partners for your RAC 23 position
                </p>
              </div>

              <button className="bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-lg text-sm text-white font-medium transition border border-slate-700">
                Refresh List
              </button>
            </div>
            <SwapList />
          </div>

          {/* REALISTIC SEAT MAP PREVIEW */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                  <Train size={20} className="text-slate-400" />
                  Coach S5 Layout
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Realistic top-down view. Identify your berth and partners.
                </p>
              </div>

              {/* LEGEND */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
                  Your Seat
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
                  Match
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-700 border border-slate-600"></div>
                  Available
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-800/50 border border-slate-800"></div>
                  Booked
                </div>
              </div>
            </div>

            {/* SEAT MAP CONTAINER */}
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[600px] space-y-4">
                {/* Render 3 Compartments (24 Seats) */}
                {[0, 1, 2].map((compartmentIndex) => (
                  <Compartment key={compartmentIndex} index={compartmentIndex} />
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 text-xs text-slate-500 bg-slate-800/30 p-4 rounded-xl">
              <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <p>
                <strong>LB:</strong> Lower Berth &bull; <strong>MB:</strong> Middle Berth &bull; <strong>UB:</strong> Upper Berth &bull; <strong>SL:</strong> Side Lower &bull; <strong>SU:</strong> Side Upper. 
                Your current RAC seat is highlighted in glowing Indigo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* =========================================
   COMPONENTS
   ========================================= */

function Metric({ icon, title, value, highlight }) {
  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-5 transition-all duration-300 ${
        highlight
          ? "border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.15)]"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3 mb-3 bg-slate-800/50 w-max p-2 rounded-lg">
        {icon}
      </div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function GlassCard({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
      <h2 className="text-white font-semibold text-lg mb-5">{title}</h2>
      {children}
    </div>
  );
}

function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex items-center justify-between text-sm group">
      <div className="flex items-center gap-3 text-slate-300">
        <div className="bg-slate-800 group-hover:bg-slate-700 transition-colors p-2.5 rounded-lg border border-slate-700/50">
          {icon}
        </div>
        <span className="font-medium">{text}</span>
      </div>
      <span className="text-slate-500 text-xs font-medium">{time}</span>
    </div>
  );
}

/* --- IRCTC SEAT LAYOUT LOGIC --- */

// Helper to determine Berth Type based on standard IRCTC math
const getSeatType = (seatNo) => {
  const mod = seatNo % 8;
  if (mod === 1 || mod === 4) return "LB";
  if (mod === 2 || mod === 5) return "MB";
  if (mod === 3 || mod === 6) return "UB";
  if (mod === 7) return "SL";
  if (mod === 0) return "SU";
  return "";
};

// Simulated Database for Seat Status
const getSeatStatus = (seatNo) => {
  if (seatNo === 23) return "current"; // User's RAC Seat (SL)
  if (seatNo === 15 || seatNo === 7) return "match"; // Potential SL partners
  if ([2, 3, 5, 9, 12, 14, 18, 20, 24].includes(seatNo)) return "booked";
  return "available";
};

// Single Compartment Component (8 Seats)
function Compartment({ index }) {
  const startSeat = index * 8 + 1;
  
  // Left side seats (Main Bay)
  const leftBay1 = [startSeat, startSeat + 1, startSeat + 2]; // e.g., 1, 2, 3
  const leftBay2 = [startSeat + 3, startSeat + 4, startSeat + 5]; // e.g., 4, 5, 6
  
  // Right side seats (Side Bay)
  const rightBay = [startSeat + 6, startSeat + 7]; // e.g., 7 (SL), 8 (SU)

  return (
    <div className="flex items-stretch bg-slate-800/20 rounded-2xl border border-slate-700/30 overflow-hidden relative">
      {/* Window left */}
      <div className="w-1.5 bg-slate-700/50"></div>

      <div className="flex flex-1 items-center justify-between p-4 gap-6">
        
        {/* MAIN BAY (6 Seats) */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {leftBay1.map((seatNo) => (
              <Seat key={seatNo} seatNo={seatNo} />
            ))}
          </div>
          {/* Table representation */}
          <div className="h-2 w-full bg-slate-800 rounded-full my-1"></div>
          <div className="flex gap-2">
            {leftBay2.map((seatNo) => (
              <Seat key={seatNo} seatNo={seatNo} />
            ))}
          </div>
        </div>

        {/* AISLE */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="h-full border-l-2 border-dashed border-slate-700/50 absolute top-0 bottom-0"></div>
          <span className="bg-slate-900 text-slate-600 text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded z-10 relative">
            Aisle
          </span>
        </div>

        {/* SIDE BAY (2 Seats) */}
        <div className="flex flex-col gap-6">
          {rightBay.map((seatNo) => (
            <Seat key={seatNo} seatNo={seatNo} />
          ))}
        </div>
      </div>

      {/* Window right */}
      <div className="w-1.5 bg-slate-700/50"></div>
    </div>
  );
}

// Individual Seat Component
function Seat({ seatNo }) {
  const status = getSeatStatus(seatNo);
  const type = getSeatType(seatNo);

  const baseClasses = "relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border cursor-pointer select-none";
  
  let statusClasses = "";
  
  switch (status) {
    case "current":
      statusClasses = "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.6)] scale-105 z-10 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900";
      break;
    case "match":
      statusClasses = "bg-purple-600/90 border-purple-400 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]";
      break;
    case "booked":
      statusClasses = "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed";
      break;
    case "available":
    default:
      statusClasses = "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500";
      break;
  }

  return (
    <div className={`${baseClasses} ${statusClasses}`} title={`Seat ${seatNo} - ${type} (${status})`}>
      <span className={`text-lg font-bold ${status === 'booked' ? 'opacity-50' : ''}`}>
        {seatNo}
      </span>
      <span className={`text-[10px] font-medium tracking-wide ${status === 'current' || status === 'match' ? 'text-indigo-100' : 'text-slate-500'}`}>
        {type}
      </span>
      
      {/* Pulse effect for current seat */}
      {status === "current" && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400 border border-slate-900"></span>
        </span>
      )}
    </div>
  );
}