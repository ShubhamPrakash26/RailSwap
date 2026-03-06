export default function IssueCard({ title, train, status }) {

  return (
    <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700">

      <div className="flex justify-between">

        <div>

          <h4 className="font-bold text-white">
            {title}
          </h4>

          <p className="text-sm text-slate-400">
            {train}
          </p>

        </div>

        <span className={`text-xs px-2 py-1 rounded ${
          status === "Resolved"
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}>

          {status}

        </span>

      </div>

    </div>
  );
}