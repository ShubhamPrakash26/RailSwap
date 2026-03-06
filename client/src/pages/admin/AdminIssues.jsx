import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../lib/api';

export default function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ train: '', category: '', status: '' });

  const load = async (opts = {}) => {
    setLoading(true);
    try {
      const q = { ...filters, ...opts };
      const params = new URLSearchParams();
      if (q.train) params.set('train', q.train);
      if (q.category) params.set('category', q.category);
      if (q.status) params.set('status', q.status);
      params.set('limit', '100');

      const res = await API.get(`/admin/issues?${params.toString()}`);
      setIssues(res.data.items || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load issues');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // hardcoded stats for UI
  const stats = {
    total: 1284,
    open: 156,
    processing: 42,
    resolved: 1086
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-950">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">train</span>
            </div>
            <h2 className="font-bold text-lg tracking-tight">RailSupport</h2>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link to="/admin/issues" className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined">warning</span>
              <span className="text-sm font-medium">Issues</span>
            </Link>
            <Link to="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">rate_review</span>
              <span className="text-sm font-medium">Reviews</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold truncate">Admin User</p>
                <p className="text-[10px] text-slate-500 truncate">Senior Admin</p>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-sm">settings</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-background-dark/50">
          <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Reported Issues</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and resolve passenger-reported railway issues.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-semibold border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-800 transition-colors">Export CSV</button>
              <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Ticket
              </button>
            </div>
          </header>

          <div className="px-8 pb-12 space-y-8">
            {/* Stats */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Issues</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.total.toLocaleString()}</h3>
                    <p className="text-emerald-500 text-xs font-medium mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-xs">trending_up</span> +12.5% </p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"> <span className="material-symbols-outlined">summarize</span> </div>
                </div>
              </div>

              <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Open</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.open}</h3>
                    <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-xs">priority_high</span> High Priority </p>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-500"> <span className="material-symbols-outlined">pending</span> </div>
                </div>
              </div>

              <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Under Process</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.processing}</h3>
                    <p className="text-amber-500 text-xs font-medium mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-xs">sync</span> Ongoing </p>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"> <span className="material-symbols-outlined">engineering</span> </div>
                </div>
              </div>

              <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Resolved</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.resolved.toLocaleString()}</h3>
                    <p className="text-emerald-500 text-xs font-medium mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-xs">check_circle</span> 84.5% Rate </p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"> <span className="material-symbols-outlined">done_all</span> </div>
                </div>
              </div>
            </section>

            {/* Filter bar */}
            <section className="p-4 rounded-xl glass-card bg-slate-900/60 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                <input className="w-full bg-slate-800/60 border-slate-700 focus:ring-primary focus:border-primary rounded-lg pl-10 text-sm p-3 text-slate-200" placeholder="Train No or ID..." type="text" value={filters.train} onChange={e => setFilters(f => ({ ...f, train: e.target.value }))} />
              </div>
              <select className="bg-slate-800/60 border-slate-700 focus:ring-primary focus:border-primary rounded-lg text-sm min-w-[150px] p-3 text-slate-200" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                <option value="">All Categories</option>
                <option>Cleanliness</option>
                <option>Food Quality</option>
                <option>Safety</option>
                <option>Delays</option>
              </select>
              <select className="bg-slate-800/60 border-slate-700 focus:ring-primary focus:border-primary rounded-lg text-sm min-w-[150px] p-3 text-slate-200" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                <option value="">Status</option>
                <option value="open">Open</option>
                <option value="under_process">Process</option>
                <option value="resolved">Resolved</option>
              </select>
              <button onClick={() => load()} className="bg-primary px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/80 transition-all">Filter</button>
              <button onClick={() => { setFilters({ train: '', category: '', status: '' }); load({}); }} className="text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors">Clear filters</button>
            </section>

            {/* Graphs and overview */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 p-6 rounded-xl glass-card">
                <h4 className="text-sm font-bold mb-6 flex items-center gap-2"> <span className="material-symbols-outlined text-[18px]">pie_chart</span> Issue Breakdown </h4>
                <div className="relative flex items-center justify-center py-4">
                  <div className="size-48 rounded-full border-[12px] border-slate-800 relative flex items-center justify-center" style={{width:120,height:120}}>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="text-xl font-bold">1.2k</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs"> <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Cleanliness</span> <span className="font-bold">45%</span> </div>
                  <div className="flex items-center justify-between text-xs"> <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Safety</span> <span className="font-bold">28%</span> </div>
                  <div className="flex items-center justify-between text-xs"> <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Food</span> <span className="font-bold">17%</span> </div>
                  <div className="flex items-center justify-between text-xs"> <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Delays</span> <span className="font-bold">10%</span> </div>
                </div>
              </div>

              <div className="lg:col-span-1 p-6 rounded-xl glass-card">
                <h4 className="text-sm font-bold mb-6 flex items-center gap-2"> <span className="material-symbols-outlined text-[18px]">bar_chart</span> Issues per Train </h4>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1"> <div className="flex justify-between text-xs mb-1"> <span>Rajdhani Express (12423)</span> <span className="text-slate-400">124 Issues</span> </div> <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"> <div className="bg-primary h-full w-[85%] rounded-full"></div> </div> </div>
                  <div className="space-y-1"> <div className="flex justify-between text-xs mb-1"> <span>Shatabdi Exp (12002)</span> <span className="text-slate-400">98 Issues</span> </div> <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"> <div className="bg-primary h-full w-[65%] rounded-full"></div> </div> </div>
                  <div className="space-y-1"> <div className="flex justify-between text-xs mb-1"> <span>Duronto Exp (12213)</span> <span className="text-slate-400">72 Issues</span> </div> <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"> <div className="bg-primary h-full w-[50%] rounded-full"></div> </div> </div>
                </div>
              </div>

              <div className="lg:col-span-1 p-6 rounded-xl glass-card">
                <h4 className="text-sm font-bold mb-6 flex items-center gap-2"> <span className="material-symbols-outlined text-[18px]">history</span> Recent Activity </h4>
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-slate-800">
                  <div className="relative pl-8"> <div className="absolute left-0 top-1 size-6 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center z-10"> <span className="material-symbols-outlined text-[12px] text-emerald-500">check</span> </div> <p className="text-xs font-semibold">Issue #8423 Resolved</p> <p className="text-[10px] text-slate-500">2 mins ago • Tech Support</p> </div>
                  <div className="relative pl-8"> <div className="absolute left-0 top-1 size-6 rounded-full bg-primary/10 border border-primary flex items-center justify-center z-10"> <span className="material-symbols-outlined text-[12px] text-primary">add</span> </div> <p className="text-xs font-semibold">New Report: Coach B4 Water Leak</p> <p className="text-[10px] text-slate-500">14 mins ago • Passenger X</p> </div>
                </div>
              </div>
            </section>

            {/* Manage Issues - list */}
            <section className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Manage Issues</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"> <span className="material-symbols-outlined text-[20px]">sort</span> </button>
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"> <span className="material-symbols-outlined text-[20px]">filter_list</span> </button>
                </div>
              </div>

              <div className="space-y-3">
                {loading && <div className="text-sm text-slate-400">Loading...</div>}
                {!loading && issues.length === 0 && <div className="text-sm text-slate-400">No issues found.</div>}

                {issues.map(i => (
                  <div key={i._id} className={`p-4 rounded-xl glass-card hover:bg-slate-800/40 transition-all flex flex-wrap lg:flex-nowrap gap-6 items-center ${i.status === 'open' ? 'border-l-4 border-l-red-500' : i.status === 'under_process' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-emerald-500'}`}>
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold ${i.status === 'open' ? 'bg-red-500/10 text-red-500' : i.status === 'under_process' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'} px-2 py-0.5 rounded uppercase tracking-tighter`}>{i.status === 'resolved' ? 'Completed' : i.status === 'open' ? 'High Priority' : i.status === 'under_process' ? 'Medium' : 'Unresolved'}</span>
                        <span className="text-xs text-slate-500 font-medium">Ticket #{i._id.slice(-5)}</span>
                      </div>
                      <h4 className="font-bold text-base">{i.title || i.category || 'Issue'}</h4>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{i.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">train</span> {i.trainNumber || '—'}</div>
                        <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">location_on</span> {i.location || '—'}</div>
                        <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> {i.createdAt ? new Date(i.createdAt).toLocaleTimeString() : '—'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 w-full lg:w-auto">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-700" style={{width:40,height:40}} />
                        <div>
                          <p className="text-xs font-bold">{i.createdBy?.username || (i.createdBy?.email || 'Guest')}</p>
                          <p className="text-[10px] text-slate-500">{i.createdBy?.email || ''}</p>
                        </div>
                      </div>

                      <div className="flex-1 lg:flex-none flex items-center justify-end gap-3">
                        <select defaultValue={i.status || 'open'} onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await API.patch(`/admin/issues/${i._id}/status`, { status: newStatus });
                            setIssues(prev => prev.map(p => p._id === i._id ? { ...p, status: newStatus } : p));
                          } catch (err) {
                            console.error(err);
                            alert('Failed to update status');
                          }
                        }} className={`text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-0 ${i.status === 'open' ? 'bg-red-500/10 text-red-500' : i.status === 'under_process' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          <option value="open">Open</option>
                          <option value="under_process">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <div className="flex gap-1">
                          <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">edit</span></button>
                          <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
