import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';

export default function SubmitReview() {
  const [journeys, setJourneys] = useState([]);
  const [form, setForm] = useState({ journeyId: '', rating: 5, text: '', keywords: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/swap/journeys');
        const list = res.data.items || res.data.journeys || res.data || [];
        // if wrapped object, extract array
        setJourneys(Array.isArray(list) ? list : (list.items || list));
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        journeyId: form.journeyId,
        rating: form.rating,
        text: form.text,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean)
      };

      await API.post('/reviews', payload);
      alert('Review submitted');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#0b1220] p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Select Journey</label>
            <select required value={form.journeyId} onChange={e => setForm({ ...form, journeyId: e.target.value })} className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-black">
              <option value="">-- choose --</option>
              {journeys.map(j => (
                <option key={j._id} value={j._id}>{j.trainNumber} — {j.pnr || j._id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Rating</label>
            <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="w-24 p-2 rounded-lg border" />
          </div>

          <div>
            <label className="block text-sm mb-2">Review</label>
            <textarea required value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className="w-full p-3 rounded-lg h-32 bg-gray-50 dark:bg-black" />
          </div>

          <div>
            <label className="block text-sm mb-2">Keywords (comma separated)</label>
            <input value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-black" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Submit Review</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg border">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
