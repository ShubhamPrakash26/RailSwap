export default function RaiseIssueForm() {

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

      <h3 className="text-lg font-semibold text-white mb-4">
        Raise an Issue
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        <select className="bg-slate-900 border border-slate-700 rounded-lg p-2">

          <option>Issue Type</option>
          <option>Food Quality</option>
          <option>Cleanliness</option>
          <option>Safety</option>
          <option>Delay</option>

        </select>

        <input
          placeholder="Coach / Platform"
          className="bg-slate-900 border border-slate-700 rounded-lg p-2"
        />

      </div>

      <textarea
        placeholder="Describe the issue..."
        className="w-full mt-4 bg-slate-900 border border-slate-700 rounded-lg p-3"
      />

      <button className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg">
        Submit Issue
      </button>

    </div>
  );
}