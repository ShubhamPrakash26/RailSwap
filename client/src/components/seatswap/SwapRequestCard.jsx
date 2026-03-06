export default function SwapRequestCard({
  name,
  verified,
  wants,
  offer,
  time,
  distance
}) {
  return (
    <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 hover:border-emerald-400/40 transition">

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-2">

            <h3 className="font-bold text-white">
              {name}
            </h3>

            {verified && (
              <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full">
                VERIFIED
              </span>
            )}

          </div>

          <p className="text-sm text-slate-400">
            Wants to swap for
            <span className="text-emerald-400 font-semibold ml-1">
              {wants}
            </span>
          </p>

        </div>

        <div className="text-right">

          <div className="text-xs text-slate-500">
            OFFERING
          </div>

          <div className="font-bold text-white">
            {offer}
          </div>

        </div>

      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-700">

        <div className="text-xs text-slate-500 flex gap-4">

          <span>{time}</span>
          <span>{distance}</span>

        </div>

        <div className="flex gap-3">

          <button className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg">
            Reject
          </button>

          <button className="px-6 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow">
            Accept Swap
          </button>

        </div>

      </div>

    </div>
  );
}