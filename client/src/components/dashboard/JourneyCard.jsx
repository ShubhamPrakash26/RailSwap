import React, { useEffect, useState } from 'react';

export default function JourneyCard() {
  const [journey, setJourney] = useState(null);

  const fetchJourney = async () => {
    try {
      const API = (await import('../../lib/api')).default;
      const res = await API.get('/swap/journeys');
      const items = res.data.items || [];
      if (items.length) {
        const it = items[0];
        setJourney({
          pnr: it.pnr,
          from: it.fromStation || it.start || 'NDLS',
          to: it.toStation || it.end || 'BOM',
          date: it.travelDate ? new Date(it.travelDate).toLocaleDateString() : '',
          train: it.trainNumber || '' ,
          coach: it.coach || '',
          seat: it.seat || '',
        });
      } else {
        setJourney(null);
      }
    } catch (err) {
      console.error('Failed to load journey for card', err);
    }
  };

  useEffect(() => {
    fetchJourney();
    const onAccepted = () => fetchJourney();
    window.addEventListener('swapAccepted', onAccepted);
    return () => window.removeEventListener('swapAccepted', onAccepted);
  }, []);

  return (
    <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-700">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">Upcoming Journey</p>

      {!journey ? (
        <div className="text-slate-400">No upcoming journeys</div>
      ) : (
        <>
          <p className="text-sm text-slate-400">PNR Number</p>
          <p className="text-2xl font-bold text-white mb-4">{journey.pnr}</p>

          <div className="flex justify-between py-4 border-y border-slate-700">
            <div>
              <p className="font-bold text-white">{journey.from}</p>
              <p className="text-xs text-slate-400">Origin</p>
            </div>
            <div>
              <p className="font-bold text-white">{journey.to}</p>
              <p className="text-xs text-slate-400">Destination</p>
            </div>
          </div>

          <div className="flex justify-between mt-4 text-sm text-slate-400">
            <span>Date: {journey.date}</span>
            <span className="font-semibold text-white">{journey.train} • {journey.coach}{journey.seat ? ` / ${journey.seat}` : ''}</span>
          </div>
        </>
      )}
    </div>
  );
}