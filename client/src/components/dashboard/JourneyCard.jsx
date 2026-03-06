export default function JourneyCard() {
  return (
    <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">

      <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
        Upcoming Journey
      </p>

      <p className="text-sm text-slate-400">
        PNR Number
      </p>

      <p className="text-2xl font-bold text-white mb-4">
        425-9830122
      </p>

      <div className="flex justify-between py-4 border-y border-slate-700">

        <div>
          <p className="font-bold text-white">NDLS</p>
          <p className="text-xs text-slate-400">Delhi</p>
        </div>

        <div>
          <p className="font-bold text-white">BOM</p>
          <p className="text-xs text-slate-400">Mumbai</p>
        </div>

      </div>

      <div className="flex justify-between mt-4 text-sm text-slate-400">
        <span>Date: 24 Oct</span>
        <span className="font-semibold text-white">
          Rajdhani Express
        </span>
      </div>

    </div>
  );
}