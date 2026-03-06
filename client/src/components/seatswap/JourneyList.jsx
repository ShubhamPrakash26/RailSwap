import { useEffect, useState } from 'react';
import API from '../../lib/api';

export default function JourneyList({ onCreated }) {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingOfferFor, setCreatingOfferFor] = useState(null);
  const [desiredSeatType, setDesiredSeatType] = useState('Any');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await API.get('/swap/journeys');
      setJourneys(res.data.items || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load journeys (login required)');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const createOffer = async (journeyId) => {
    const dst = prompt('Desired seat type (e.g. Lower, Upper, RAC) — leave blank for Any', 'Any');
    if (dst === null) return;
    try {
      const res = await API.post('/swap/requests', { journeyId, desiredSeatType: dst });
      alert('Offer created');
      if (onCreated) onCreated(res.data);
      fetch();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create offer');
    }
  };

  const cancelOffer = async (swapId) => {
    if (!confirm('Cancel this offer?')) return;
    try {
      await API.post(`/swap/requests/${swapId}/cancel`);
      alert('Cancelled');
      fetch();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Your Saved Journeys</h3>

      {loading && <div className="text-sm text-slate-400">Loading...</div>}

      {!loading && journeys.length === 0 && (
        <div className="text-sm text-slate-400">No saved journeys. Add one using the form.</div>
      )}

      {journeys.map(j => (
        <div key={j._id} className="bg-[#1E293B] p-4 rounded border border-slate-700">
          <div className="flex justify-between">
            <div>
              <div className="font-bold text-white">PNR: {j.pnr}</div>
              <div className="text-sm text-slate-400">{j.trainNumber} • {j.coach} • {j.seat} • {j.seatType}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={()=>createOffer(j._id)} className="bg-emerald-600 text-white px-3 py-1 rounded">Create Offer</button>
            </div>
          </div>

          <div className="mt-3 text-sm text-slate-400">
            {/* list my offers for this journey */}
            <MyOffers journeyId={j._id} onCancel={cancelOffer} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MyOffers({ journeyId, onCancel }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/swap/requests/my?journeyId=${journeyId}`);
      setOffers(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetch(); }, [journeyId]);

  if (loading) return <div className="text-sm text-slate-400">Loading offers...</div>;
  if (!offers || offers.length === 0) return <div className="text-sm text-slate-400">No offers for this journey</div>;

  return (
    <div className="space-y-2">
      {offers.map(o => (
        <div key={o._id} className="flex items-center justify-between">
          <div className="text-sm">Offer: {o.desiredSeatType} • Status: {o.status} {o.confirmed ? '(confirmed)' : ''}</div>
          <div>
            <button onClick={()=>onCancel(o._id)} className="text-sm px-2 py-1 bg-slate-700 rounded">Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
}
