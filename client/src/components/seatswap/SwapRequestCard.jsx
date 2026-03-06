import API from '../../lib/api';
import { useState } from 'react';

export default function SwapRequestCard({ swap, onChange }) {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!confirm('Accept this swap? You will choose which saved journey to use.')) return;
    setLoading(true);
    try {
      // fetch user's journeys to choose from
      const resJourneys = await API.get('/swap/journeys');
      const myJourneys = resJourneys.data.items || [];
      if (!myJourneys.length) {
        alert('No saved journeys found for your account on this train. Please add one.');
        setLoading(false);
        return;
      }
      // If multiple, ask user to pick
      let chosenId = myJourneys[0]._id;
      if (myJourneys.length > 1) {
        const list = myJourneys.map((j, i) => `${i+1}) PNR:${j.pnr} ${j.trainNumber} ${j.coach} ${j.seat}`).join('\n');
        const idx = prompt(`Pick a journey to use for swap (enter number):\n${list}`, '1');
        if (idx === null) { setLoading(false); return; }
        const i = parseInt(idx, 10) - 1;
        if (isNaN(i) || i < 0 || i >= myJourneys.length) { alert('Invalid choice'); setLoading(false); return; }
        chosenId = myJourneys[i]._id;
      }

      const resAccept = await API.post(`/swap/requests/${swap._id}/accept`, { myJourneyId: chosenId });
      const { updatedRequesterJourney, updatedAcceptorJourney } = resAccept.data || {};
      const { showToast } = await import('../../lib/toast');
      showToast('Swap accepted and journeys updated');
      // notify other components to refresh
      try { window.dispatchEvent(new CustomEvent('swapAccepted', { detail: { updatedRequesterJourney, updatedAcceptorJourney } })); } catch (e) {}
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) alert('Please login to accept swaps');
      else alert(err.response?.data?.message || 'Failed to accept');
    } finally { setLoading(false); }
  };

  const offering = swap.journey ? `${swap.journey.coach || ''} ${swap.journey.seat || ''}` : `${swap.coach || ''} ${swap.seat || ''}`;

  return (
    <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 hover:border-emerald-400/40 transition">

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-2">

            <h3 className="font-bold text-white">{swap.createdByName || (swap.createdBy ? 'User' : 'Guest')}</h3>

            {swap.verified && (
              <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full">VERIFIED</span>
            )}

          </div>

          <p className="text-sm text-slate-400">Wants to swap for <span className="text-emerald-400 font-semibold ml-1">{swap.desiredSeatType}</span></p>

        </div>

        <div className="text-right">

          <div className="text-xs text-slate-500">OFFERING</div>

          <div className="font-bold text-white">{offering}</div>

        </div>

      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-700">

        <div className="text-xs text-slate-500 flex gap-4">
          <span>{new Date(swap.createdAt).toLocaleString()}</span>
          <span>{swap.coach ? `Coach ${swap.coach}` : ''}</span>
        </div>

        <div className="flex gap-3">

          <button disabled className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg">Reject</button>

          <button onClick={handleAccept} disabled={loading} className="px-6 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow">{loading ? 'Accepting...' : 'Accept Swap'}</button>

        </div>

      </div>

    </div>
  );
}