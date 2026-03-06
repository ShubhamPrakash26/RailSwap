export default function CommunityCard() {
  return (
    <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">

      <p className="text-xs font-bold uppercase text-purple-400 mb-6">
        Community Activity
      </p>

      <p className="text-sm font-medium text-slate-200">
        "Anyone traveling to Bangalore tomorrow?
        Looking for tips on the new terminal."
      </p>

      <p className="text-xs text-slate-400 mt-3">
        4 replies in the last hour
      </p>

    </div>
  );
}