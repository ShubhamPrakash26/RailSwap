export default function CommunitySelector() {

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

      <h2 className="text-xl font-bold text-white mb-4">
        Community Support
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <input
          placeholder="Train Number (e.g. 12951)"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
        />

        <input
          placeholder="Station (e.g. NDLS)"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
        />

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
          View Community
        </button>

      </div>

    </div>
  );
}