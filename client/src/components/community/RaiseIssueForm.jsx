import { useState, useEffect } from 'react';
import API from '../../lib/api';

export default function RaiseIssueForm({ selected }) {
  const [category, setCategory] = useState('Cleanliness');
  const [location, setLocation] = useState('');
  const [trainInput, setTrainInput] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected?.train) setTrainInput(selected.train);
  }, [selected?.train]);

  const handleSubmit = async () => {
    if (!selected?.station && !selected?.train && !trainInput) {
      alert('Please select a station or train first, or enter a train number');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        stationCode: selected.station || undefined,
        trainNumber: selected.train || trainInput || undefined,
        category,
        location,
        description
      };
      await API.post('/community/issues', payload);
      setCategory('Cleanliness');
      setLocation('');
      setDescription('');
      // optionally emit an event or use parent callback; here we'll reload the page
      window.dispatchEvent(new Event('community:issue:created'));
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) alert('Please login to create issues');
      else alert('Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700">

      <h3 className="text-lg font-semibold text-white mb-4">
        Raise an Issue
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2">
          <option>Cleanliness</option>
          <option>Food Quality</option>
          <option>Safety</option>
          <option>Delay</option>
          <option>Other</option>
        </select>

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Coach / Platform"
          className="bg-slate-900 border border-slate-700 rounded-lg p-2"
        />

      </div>

      <input
        value={trainInput}
        onChange={(e) => setTrainInput(e.target.value)}
        placeholder="Train Number (optional)"
        className="w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg p-2"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue..."
        className="w-full mt-4 bg-slate-900 border border-slate-700 rounded-lg p-3"
      />

      <button onClick={handleSubmit} disabled={loading} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg">
        {loading ? 'Submitting...' : 'Submit Issue'}
      </button>

    </div>
  );
}