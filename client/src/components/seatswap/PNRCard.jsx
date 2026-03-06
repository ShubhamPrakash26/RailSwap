import { useState, useEffect } from 'react';
import API from '../../lib/api';

export default function PNRCard({ onCreated }) {
  const [pnr, setPnr] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [coach, setCoach] = useState('');
  const [seat, setSeat] = useState('');
  const [seatType, setSeatType] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCreate = async () => {
    if (!pnr || !trainNumber) return alert('PNR and Train Number required');
    setLoading(true);
    try {
      const payload = { pnr, trainNumber, coach, seat, seatType, travelDate };
      const res = await API.post('/swap/journey', payload);
      setMessage('Journey saved');
      if (onCreated) onCreated(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) alert('Please login to save journey');
      else alert(err.response?.data?.message || 'Failed to save journey');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

        <h2 className="text-lg font-semibold text-white mb-4">Add / Save PNR</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={pnr} onChange={e=>setPnr(e.target.value)} placeholder="PNR" className="bg-slate-900 border border-slate-700 rounded-lg p-2" />
          <input value={trainNumber} onChange={e=>setTrainNumber(e.target.value)} placeholder="Train Number" className="bg-slate-900 border border-slate-700 rounded-lg p-2" />
          <input value={coach} onChange={e=>setCoach(e.target.value)} placeholder="Coach (e.g. B2)" className="bg-slate-900 border border-slate-700 rounded-lg p-2" />
          <input value={seat} onChange={e=>setSeat(e.target.value)} placeholder="Seat (e.g. RAC 27)" className="bg-slate-900 border border-slate-700 rounded-lg p-2" />
          <input value={seatType} onChange={e=>setSeatType(e.target.value)} placeholder="Seat Type (Lower/Upper/RAC)" className="bg-slate-900 border border-slate-700 rounded-lg p-2" />
          <input value={travelDate} onChange={e=>setTravelDate(e.target.value)} type="date" className="bg-slate-900 border border-slate-700 rounded-lg p-2" />
        </div>

        <div className="mt-4">
          <button onClick={handleCreate} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
            {loading ? 'Saving...' : 'Save Journey'}
          </button>
          {message && <span className="ml-3 text-sm text-slate-400">{message}</span>}
        </div>

      </div>

      <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/20 mt-4">
        <h3 className="text-blue-400 font-semibold mb-2">Pro Tip</h3>
        <p className="text-sm text-slate-400">Passengers in nearby coaches are more likely to accept swaps.</p>
      </div>
    </div>
  );
}