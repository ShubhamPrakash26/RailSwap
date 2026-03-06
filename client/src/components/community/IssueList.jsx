import IssueCard from "./IssueCard";
import { useEffect, useState } from "react";
import API from "../../lib/api";

export default function IssueList({ selected }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
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
    window.addEventListener("community:issue:created", onCreated);

    return () =>
      window.removeEventListener("community:issue:created", onCreated);
  }, [selected?.station, selected?.train]);

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Active Issues
        </h3>

        {loading && (
          <span className="text-xs text-slate-400">
            Loading...
          </span>
        )}
      </div>

      {!selected?.station && !selected?.train && (
        <div className="text-sm text-slate-400 bg-slate-900 border border-slate-700 p-4 rounded-lg">
          Enter a station code or train number and click **View Community**
          to see related issues.
        </div>
      )}

      {issues.map((issue) => (
        <IssueCard key={issue._id} issue={issue} onChange={fetch} />
      ))}

      {(selected?.station || selected?.train) &&
        issues.length === 0 &&
        !loading && (
          <div className="text-sm text-slate-400 bg-slate-900 border border-slate-700 p-4 rounded-lg">
            No issues found for this selection.
          </div>
        )}
    </div>
  );
}