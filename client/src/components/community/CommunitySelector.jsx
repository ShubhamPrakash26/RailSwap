import { useState } from "react";

export default function CommunitySelector({ onSelect }) {

  const [mode, setMode] = useState("train"); // train | station
  const [train, setTrain] = useState("");
  const [station, setStation] = useState("");

  const handleView = () => {

    const t = train.trim();
    const s = station.trim().toUpperCase();

    if (mode === "train" && !t) {
      alert("Please enter a train number");
      return;
    }

    if (mode === "station" && !s) {
      alert("Please enter a station code");
      return;
    }

    onSelect({
      train: mode === "train" ? t : undefined,
      station: mode === "station" ? s : undefined
    });
  };

  return (
    <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700 shadow-lg">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-white">
          Community Support
        </h2>
        <span className="text-xs text-slate-400">
          View discussions & issues
        </span>
      </div>

      {/* Toggle */}
      <div className="flex bg-slate-900 rounded-lg p-1 mb-4 w-fit">

        <button
          onClick={() => setMode("train")}
          className={`px-4 py-1.5 text-sm rounded-md transition ${
            mode === "train"
              ? "bg-blue-500 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Train
        </button>

        <button
          onClick={() => setMode("station")}
          className={`px-4 py-1.5 text-sm rounded-md transition ${
            mode === "station"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Station
        </button>

      </div>

      <div className="flex gap-4">

        {mode === "train" && (
          <input
            value={train}
            onChange={(e) => setTrain(e.target.value)}
            placeholder="Enter Train Number (e.g. 12951)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        )}

        {mode === "station" && (
          <input
            value={station}
            onChange={(e) => setStation(e.target.value)}
            placeholder="Enter Station Code (e.g. NDLS)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        )}

        <button
          onClick={handleView}
          className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
          transition-all text-white font-medium rounded-lg px-5 py-2 shadow"
        >
          View
        </button>

      </div>

    </div>
  );
}