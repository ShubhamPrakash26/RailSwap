export default function SwapRequestCard() {
  return (
    <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">

      <p className="text-xs font-bold uppercase text-emerald-400 mb-6">
        Swap Requests
      </p>

      <p className="font-bold text-white">
        Pending Request
      </p>

      <p className="text-sm text-slate-400 mb-4">
        Awaiting response from Seat 42-B
      </p>

      <div className="flex justify-between bg-slate-800 p-3 rounded-lg mb-4">
        <span className="text-slate-300">
          Success Probability
        </span>

        <span className="font-bold text-emerald-400">
          82%
        </span>
      </div>

      <button className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800">
        View Details
      </button>

    </div>
  );
}