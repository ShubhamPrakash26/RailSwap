import API from "../../lib/api";

export default function IssueCard({ issue, onChange }) {
  const {
    category,
    location,
    description,
    status,
    stationCode,
    trainNumber,
    _id,
    createdAt,
    resolution
  } = issue;

  const handleResolve = async () => {
    try {
      await API.patch(`/community/issues/${_id}`, { status: "resolved" });
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Please login to resolve issues");
      } else {
        alert("Failed to resolve");
      }
    }
  };

  return (
    <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 
    shadow-md hover:shadow-lg transition">

      <div className="flex justify-between gap-4">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-semibold text-white text-sm">
              {category}
            </h4>

            {location && (
              <span className="text-xs text-slate-400">
                • {location}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {description}
          </p>

          <p className="text-xs text-slate-500 mt-3">
            {stationCode || trainNumber} •{" "}
            {new Date(createdAt).toLocaleString()}
          </p>

          {resolution && (
            <p className="text-sm text-green-300 mt-2">
              Resolution: {resolution}
            </p>
          )}

        </div>

        <div className="flex flex-col items-end gap-3">

          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              status === "resolved"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {status}
          </span>

          {status !== "resolved" && (
            <button
              onClick={handleResolve}
              className="bg-blue-600 hover:bg-blue-700 text-xs text-white px-3 py-1.5 rounded-md transition"
            >
              Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
}