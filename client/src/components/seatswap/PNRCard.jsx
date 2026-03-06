export default function PNRCard() {
  return (
    <>
      <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            Your PNR Details
          </h2>

          <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-500/20 text-orange-400">
            RAC PENDING
          </span>
        </div>

        <div className="space-y-4">

          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-slate-400">Train Number</span>
            <span className="font-bold text-white">
              12345 (HWH - CSMT)
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-slate-400">Coach</span>
            <span className="font-bold text-white">
              B2 (3-Tier AC)
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-slate-400">Seat Number</span>
            <span className="font-bold text-emerald-400">
              RAC 27
            </span>
          </div>

        </div>

        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">
          You are sharing seat 27 with another passenger.
        </div>

      </div>

      {/* TIP CARD */}

      <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20">

        <h3 className="text-blue-400 font-semibold mb-2">
          Pro Tip
        </h3>

        <p className="text-sm text-slate-400">
          Passengers in Coach B2 and B3 are most likely to accept swaps to be closer to their groups.
        </p>

      </div>
    </>
  );
}