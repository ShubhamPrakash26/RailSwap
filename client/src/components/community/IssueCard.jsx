import API from '../../lib/api';

export default function IssueCard({ issue, onChange }) {
  const { category, location, description, status, stationCode, trainNumber, _id, createdAt, resolution } = issue;

  const handleResolve = async () => {
    try {
      await API.patch(`/community/issues/${_id}`, { status: 'resolved' });
      if (onChange) onChange();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert('Please login to resolve issues');
      } else {
        alert('Failed to resolve');
      }
    }
  };

  return (
    <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700">

      <div className="flex justify-between">

        <div>

          <h4 className="font-bold text-white">
            {category} {location ? `• ${location}` : ''}
          </h4>

          <p className="text-sm text-slate-400">
            {description}
          </p>

          <p className="text-xs text-slate-500 mt-2">{stationCode || trainNumber} • {new Date(createdAt).toLocaleString()}</p>

          {resolution && (
            <p className="text-sm text-green-300 mt-2">Resolution: {resolution}</p>
          )}

        </div>

        <div className="text-right">
          <span className={`text-xs px-2 py-1 rounded ${
            status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>{status}</span>

          {status !== 'resolved' && (
            <button onClick={handleResolve} className="block mt-3 bg-blue-600 text-white px-3 py-1 rounded">Mark Resolved</button>
          )}

        </div>

      </div>

    </div>
  );
}