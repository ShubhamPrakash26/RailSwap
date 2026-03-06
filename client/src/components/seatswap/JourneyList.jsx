import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

export default function JourneyList() {
  // --- STATE ---
  const [journeys, setJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [desiredSeat, setDesiredSeat] = useState("");
  const [activeJourney, setActiveJourney] = useState(null);

  // --- DATA FETCHING ---
  // fetch function in component scope so other effects can call it
  const fetchJourneys = async () => {
    try {
      setIsLoading(true);
      // fetch user's journeys from server
      const res = await (await import('../../lib/api')).default.get('/swap/journeys');
      const items = res.data.items || [];
      // normalize server items to local shape if necessary
      const mapped = items.map((it) => ({
        id: it._id || it.id,
        pnr: it.pnr,
        trainNo: it.trainNumber || it.trainNo,
        coach: it.coach,
        ticketStatus: it.seatType || it.ticketStatus,
        berthPreference: it.berthPreference || '',
        currentOffer: it.currentOffer || null,
        swapStatus: it.swapStatus || 'none'
      }));
      setJourneys(mapped);
    } catch (err) {
      console.error("Error fetching journeys:", err);
      setError("Failed to load journey data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  useEffect(() => {
    const onAccepted = (e) => {
      // a swap was accepted that might affect journey details; re-fetch
      try {
        // if event provides updated journeys, update locally for speed
        const detail = e?.detail || {};
        if (detail.updatedRequesterJourney || detail.updatedAcceptorJourney) {
          // re-fetch to keep consistent with server
          fetchJourneys();
        } else {
          fetchJourneys();
        }
      } catch (err) {
        fetchJourneys();
      }
    };
    window.addEventListener('swapAccepted', onAccepted);
    return () => window.removeEventListener('swapAccepted', onAccepted);
  }, []);

  // --- HANDLERS ---
  const handleOpenModal = (journey) => {
    setActiveJourney(journey);
    setIsModalOpen(true);
  };

  const handleSubmitOffer = async () => {
    const finalSeatPreference = desiredSeat.trim() === "" ? "Any" : desiredSeat;

    if (!activeJourney) return;

    // Call backend to create swap request
    try {
      setIsLoading(true);
      const API = (await import('../../lib/api')).default;
      const payload = { journeyId: activeJourney.id, desiredSeatType: finalSeatPreference };
      const res = await API.post('/swap/requests', payload);
      const created = res.data;

      // Update UI optimistically
      setJourneys((prev) => 
        prev.map((j) => 
          j.id === activeJourney.id 
            ? { ...j, currentOffer: finalSeatPreference, swapStatus: "searching" } 
            : j
        )
      );

      // Dispatch global event so lists can refresh
      try { window.dispatchEvent(new CustomEvent('swapCreated', { detail: created })); } catch (e) {}

      const { showToast } = await import('../../lib/toast');
      showToast('Swap request created successfully');
    } catch (err) {
      console.error('Failed to create swap request', err);
      const { showToast } = await import('../../lib/toast');
      showToast(err?.response?.data?.message || 'Failed to create swap request', 'error');
    } finally {
      setIsModalOpen(false);
      setDesiredSeat("");
      setActiveJourney(null);
      setIsLoading(false);
    }
  };

  const handleCancelOffer = (id) => {
    setJourneys((prev) => 
      prev.map((j) => 
        j.id === id ? { ...j, currentOffer: null, swapStatus: "none" } : j
      )
    );
  };

  // --- RENDER HELPERS ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-3">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <p className="text-sm">Fetching your journeys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-500/20">
        <AlertCircle size={20} />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      <h3 className="text-slate-400 font-medium mb-3">Your Saved Journeys</h3>

      {journeys.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-slate-800/20 rounded-2xl border border-slate-700/50">
          No upcoming journeys found.
        </div>
      ) : (
        journeys.map((journey) => (
          <div key={journey.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-bold text-lg mb-1">PNR: {journey.pnr}</h4>
                <p className="text-slate-400 text-sm">
                  {journey.trainNo} &bull; {journey.coach} &bull; {journey.ticketStatus} &bull; {journey.berthPreference}
                </p>
              </div>
              
              {!journey.currentOffer && (
                <button
                  onClick={() => handleOpenModal(journey)}
                  className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  Create Offer
                </button>
              )}
            </div>
            
            {journey.currentOffer && (
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-700/50 text-sm">
                <span className="text-slate-300">
                  Offer: <span className="text-white font-medium">{journey.currentOffer}</span> &bull; Status: <span className="text-emerald-400">{journey.swapStatus}</span>
                </span>
                <button 
                  onClick={() => handleCancelOffer(journey.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* CUSTOM MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-semibold text-white">Create Swap Offer</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Desired seat type for PNR {activeJourney?.pnr}
                </label>
                <input
                  type="text"
                  value={desiredSeat}
                  onChange={(e) => setDesiredSeat(e.target.value)}
                  placeholder="e.g. Lower, Upper, RAC (Leave blank for Any)"
                  autoFocus
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <p className="text-xs text-slate-500">
                Leaving this blank sets your preference to "Any", which increases your chances of finding a match quickly.
              </p>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOffer}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all cursor-pointer"
              >
                Confirm Offer
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}