import { MapPin, Calendar, Search } from "lucide-react";

export default function RouteSearch() {
  return (
    <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div>
          <label className="text-xs uppercase text-slate-400 font-bold">
            From
          </label>

          <div className="relative mt-1">
            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />

            <input
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
              defaultValue="New Delhi (NDLS)"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase text-slate-400 font-bold">
            To
          </label>

          <div className="relative mt-1">
            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />

            <input
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
              defaultValue="Varanasi (BSB)"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase text-slate-400 font-bold">
            Travel Date
          </label>

          <div className="relative mt-1">
            <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />

            <input
              type="date"
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            />
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
          <Search size={18} />
          Search Routes
        </button>

      </div>

    </div>
  );
}