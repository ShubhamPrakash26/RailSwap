import { MapPin, Calendar, Search } from "lucide-react";

export default function RouteSearch({ from, to, date, setFrom, setTo, setDate, onSearch, loading }) {
  return (
    <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div>
          <label className="text-xs uppercase text-slate-400 font-bold">From</label>

          <div className="relative mt-1">
            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />

            <input
              value={from}
              onChange={(e) => setFrom(e.target.value.toUpperCase())}
              placeholder="Station code (e.g. NDLS)"
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase text-slate-400 font-bold">To</label>

          <div className="relative mt-1">
            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />

            <input
              value={to}
              onChange={(e) => setTo(e.target.value.toUpperCase())}
              placeholder="Station code (e.g. BSB)"
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase text-slate-400 font-bold">Travel Date</label>

          <div className="relative mt-1">
            <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />

            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={onSearch}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          <Search size={18} />
          {loading ? 'Searching...' : 'Search Routes'}
        </button>

      </div>

    </div>
  );
}