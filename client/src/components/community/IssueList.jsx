import IssueCard from "./IssueCard";
import { useEffect, useState } from 'react';
import API from '../../lib/api';

export default function IssueList({ selected }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    // If no selection, do not fetch and show prompt
    if (!selected?.station && !selected?.train) {
      setIssues([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q = {};
      if (selected?.station) q.station = selected.station;
      if (selected?.train) q.train = selected.train;
      const params = new URLSearchParams(q).toString();
      const res = await API.get(`/community/issues?${params}`);
      setIssues(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();

    const onCreated = () => fetch();
    window.addEventListener('community:issue:created', onCreated);
    return () => window.removeEventListener('community:issue:created', onCreated);
  }, [selected?.station, selected?.train]);

  return (
    <div className="space-y-4">

      <h3 className="text-xl font-bold text-white">
        Active Issues {loading ? '(loading...)' : ''}
      </h3>

      {!selected?.station && !selected?.train && (
        <div className="text-sm text-slate-400">Enter a station code or train number and click "View Community" to see related issues.</div>
      )}

      {selected?.station || selected?.train ? (
        issues.map((issue) => (
          <IssueCard key={issue._id} issue={issue} onChange={fetch} />
        ))
      ) : null}

      {selected && (selected.station || selected.train) && issues.length === 0 && !loading && (
        <div className="text-sm text-slate-400">No issues found for this selection.</div>
      )}

    </div>
  );
}