import { useState } from 'react';

export default function CommunitySelector({ onSelect }) {
  const [train, setTrain] = useState('');
  const [station, setStation] = useState('');

  const handleView = () => {
    const s = station?.trim().toUpperCase();
    const t = train?.trim();

    if (!s && !t) {
      alert('Please enter a Station code or Train number');
      return;
    }

    // Send both when present so server can filter by either/both
    onSelect({ station: s || undefined, train: t || undefined });
  };

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

      <h2 className="text-xl font-bold text-white mb-4">
        Community Support
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <input
          value={train}
          onChange={(e) => setTrain(e.target.value)}
          placeholder="Train Number (e.g. 12951)"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
        />

        <input
          value={station}
          onChange={(e) => setStation(e.target.value)}
          placeholder="Station (e.g. NDLS)"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
        />

        <button
          onClick={handleView}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2"
        >
          View Community
        </button>

      </div>

    </div>
  );
}