import SwapRequestCard from "./SwapRequestCard";
import { useEffect, useState } from 'react';
import API from '../../lib/api';

export default function SwapList() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trainFilter, setTrainFilter] = useState('');
  const [seatTypeFilter, setSeatTypeFilter] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const q = {};
      if (trainFilter) q.train = trainFilter;
      if (seatTypeFilter) q.seatType = seatTypeFilter;
      const params = new URLSearchParams(q).toString();
      const res = await API.get('/swap/requests' + (params ? `?${params}` : ''));
      setSwaps(res.data.items || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load swap requests');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>

      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">

        <div className="flex gap-2">

          <select value={seatTypeFilter} onChange={e=>setSeatTypeFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
            <option value="">All Seat Types</option>
            <option value="Lower">Lower Berth</option>
            <option value="Side Lower">Side Lower</option>
            <option value="Upper">Upper Berth</option>
            <option value="RAC">RAC</option>
          </select>

          <input value={trainFilter} onChange={e=>setTrainFilter(e.target.value)} placeholder="Train number" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" />

          <button onClick={fetch} className="bg-slate-700 px-3 rounded">Apply</button>

        </div>

        <span className="text-sm text-slate-400">
          {loading ? 'Loading...' : `${swaps.length} results`}
        </span>

      </div>

      {/* SWAP LIST */}

      <div className="space-y-4">

        {swaps.map((swap) => (
          <SwapRequestCard key={swap._id} swap={swap} onChange={fetch} />
        ))}

        {!loading && swaps.length === 0 && (
          <div className="text-sm text-slate-400">No swap requests found.</div>
        )}

      </div>

    </div>
  );
}