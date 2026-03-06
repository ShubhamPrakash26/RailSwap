import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../lib/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/reviews');
      setReviews(res.data.reviews || []);
      const kw = await API.get('/admin/reviews/keywords');
      setKeywords(kw.data.stats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // derived aggregates
  const aggregates = useMemo(() => {
    const out = { total: 0, avg: 0, positive: 0, negative: 0, dist: {1:0,2:0,3:0,4:0,5:0} };
    if (!reviews || reviews.length === 0) return out;
    out.total = reviews.length;
    let sum = 0; let pos=0; let neg=0;
    reviews.forEach(r => {
      const s = Number(r.rating) || 0; sum += s;
      if (s >= 4) pos++;
      if (s <= 2) neg++;
      if (s >=1 && s <=5) out.dist[s] = (out.dist[s]||0) + 1;
    });
    out.avg = +(sum / out.total).toFixed(2);
    out.positive = Math.round((pos / out.total) * 100);
    out.negative = Math.round((neg / out.total) * 100);
    return out;
  }, [reviews]);

  const topKeywords = keywords.slice(0,6);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar (same as Issues page) */}
        <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-950">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">train</span>
            </div>
            <h2 className="font-bold text-lg tracking-tight">RailAdmin</h2>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link to="/admin/issues" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">warning</span>
              <span className="text-sm font-medium">Issues</span>
            </Link>
            <Link to="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined">rate_review</span>
              <span className="text-sm font-medium">Reviews</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-800">
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
          <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-background-dark/80 backdrop-blur-md">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">User Review Analytics</h1>
              <p className="text-slate-400 text-sm">Understand passenger experience through ratings and review insights.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => window.print()} className="px-4 py-2 text-sm font-semibold border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-800 transition-colors">Export</button>
              <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Review
              </button>
            </div>
          </header>

          <div className="px-8 pb-12 space-y-8">
            {/* KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl glass-card relative overflow-hidden group">
                <p className="text-sm font-medium text-slate-400">Total Reviews</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{aggregates.total.toLocaleString()}</span>
                  <span className="text-emerald-500 text-xs font-bold flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span>+12%</span>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{width: '65%'}} />
                </div>
              </div>

              <div className="p-6 rounded-xl glass-card relative overflow-hidden group">
                <p className="text-sm font-medium text-slate-400">Average Rating</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{aggregates.avg || '—'}</span>
                  <span className="text-emerald-500 text-xs font-bold flex items-center"><span className="material-symbols-outlined text-xs">star</span>+0.3</span>
                </div>
                <div className="mt-4 flex gap-1">
                  {Array.from({length:5}).map((_,i) => (
                    <span key={i} className={`material-symbols-outlined text-sm ${i < Math.round(aggregates.avg || 0) ? 'text-yellow-400' : 'text-slate-700'}`}>star</span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl glass-card relative overflow-hidden group">
                <p className="text-sm font-medium text-slate-400">Positive Reviews</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{aggregates.positive}%</span>
                  <span className="text-emerald-500 text-xs font-bold flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span>+5%</span>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width: `${aggregates.positive}%`}} />
                </div>
              </div>

              <div className="p-6 rounded-xl glass-card relative overflow-hidden group">
                <p className="text-sm font-medium text-slate-400">Negative Reviews</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{aggregates.negative}%</span>
                  <span className="text-rose-500 text-xs font-bold flex items-center"><span className="material-symbols-outlined text-xs">trending_down</span>-2%</span>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{width: `${aggregates.negative}%`}} />
                </div>
              </div>
            </section>

            {/* Charts Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rating Distribution */}
              <div className="lg:col-span-1 p-6 rounded-xl glass-card">
                <h3 className="font-bold text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-lg">bar_chart</span> Rating Distribution</h3>
                <div className="space-y-4">
                  {[5,4,3,2,1].map(k => {
                    const count = aggregates.dist[k] || 0;
                    const pct = aggregates.total ? Math.round((count / aggregates.total) * 100) : 0;
                    return (
                      <div className="flex items-center gap-3" key={k}>
                        <span className="text-xs font-medium w-4 text-slate-400">{k}</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full">
                          <div className={`h-full ${k>=4 ? 'bg-primary' : k===3 ? 'bg-primary/60' : 'bg-rose-400' } rounded-full`} style={{width: `${pct}%`}} />
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment Donut */}
              <div className="lg:col-span-1 p-6 rounded-xl glass-card">
                <h3 className="font-bold text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-emerald-500 text-lg">donut_large</span> Sentiment Analysis</h3>
                <div className="relative size-40 mx-auto">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path className="stroke-emerald-500 fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray={`${aggregates.positive}, 100`} strokeWidth="3"></path>
                    <path className="stroke-slate-600 fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray={`${100-aggregates.positive-aggregates.negative}, 100`} strokeDashoffset={`-${aggregates.positive}`} strokeWidth="3"></path>
                    <path className="stroke-rose-500 fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray={`${aggregates.negative}, 100`} strokeDashoffset={`-${aggregates.positive + (100-aggregates.positive-aggregates.negative)}`} strokeWidth="3"></path>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{aggregates.positive}%</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Positive</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-around text-xs font-medium text-slate-400">
                  <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500"></span> Positive</div>
                  <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-slate-500"></span> Neutral</div>
                  <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-rose-500"></span> Negative</div>
                </div>
              </div>

              {/* Top Mentions */}
              <div className="lg:col-span-1 p-6 rounded-xl glass-card">
                <h3 className="font-bold text-sm mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-indigo-500 text-lg">tag</span> Top Mentions</h3>
                <div className="space-y-4">
                  {topKeywords.map((k,i) => (
                    <div className="flex flex-col gap-1" key={k._id || i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{k._id}</span>
                        <span className="text-slate-400">{k.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full">
                        <div className={`h-full ${i===0 ? 'bg-emerald-500' : i===1 ? 'bg-primary' : 'bg-primary/60'} rounded-full`} style={{width: `${Math.min(95, Math.round((k.count / (topKeywords[0]?.count||1)) * 100))}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Review Feed & Side Panels */}
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-lg">Recent Reviews</h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-full border border-slate-700 text-xs font-medium">All</button>
                    <button className="px-3 py-1 rounded-full text-xs font-medium text-slate-400">Critical</button>
                    <button className="px-3 py-1 rounded-full text-xs font-medium text-slate-400">Praise</button>
                  </div>
                </div>

                {loading && <div className="text-sm text-slate-400">Loading...</div>}

                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className={`group p-6 rounded-xl glass-card hover:border-primary/30 transition-all cursor-pointer ${r.rating <=2 ? 'border-l-4 border-l-rose-500' : r.rating >=4 ? 'border-l-4 border-l-emerald-500' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="size-10 rounded-full bg-indigo-900/20 flex items-center justify-center text-indigo-300 font-bold">{(r.author?.username || 'S')[0]}</div>
                          <div>
                            <h4 className="text-sm font-semibold">{r.author?.username || r.author?.email || 'Shubham'}</h4>
                            <div className="flex gap-0.5 mt-1">
                              {Array.from({length:5}).map((_,i) => (
                                <span key={i} className={`material-symbols-outlined text-xs ${i < (r.rating||0) ? 'text-yellow-400' : 'text-slate-700'}`}>star</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">{r.trainNumber ? `Train #${r.trainNumber}` : '—'}</div>
                          <p className="text-[10px] text-slate-400 mt-2">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{r.text}</p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {(r.keywords||[]).slice(0,4).map(k => (
                          <span key={k} className="px-2 py-1 rounded bg-slate-800 text-[10px] font-medium text-slate-300">#{k}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-xl border border-dashed border-slate-700 text-sm font-medium text-slate-400 hover:text-primary hover:border-primary transition-all">Load More Reviews</button>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-xl glass-card">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-emerald-500"><span className="material-symbols-outlined">thumb_up</span> Top Praises</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between"><span className="text-xs font-medium">Punctuality</span><span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">92%</span></li>
                    <li className="flex items-center justify-between"><span className="text-xs font-medium">Staff Courtesy</span><span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">88%</span></li>
                    <li className="flex items-center justify-between"><span className="text-xs font-medium">Cleanliness</span><span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">85%</span></li>
                    <li className="flex items-center justify-between"><span className="text-xs font-medium">Booking App</span><span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">79%</span></li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl glass-card">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-rose-500"><span className="material-symbols-outlined">thumb_down</span> Top Complaints</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between"><span className="text-xs font-medium">Wi-Fi Speed</span><span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">64%</span></li>
                    <li className="flex items-center justify-between"><span className="text-xs font-medium">Food Prices</span><span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">42%</span></li>
                    <li className="flex items-center justify-between"><span className="text-xs font-medium">AC Cooling</span><span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">28%</span></li>
                  </ul>
                  <div className="mt-6 p-4 rounded-lg bg-rose-500/5 border border-rose-500/10">
                    <p className="text-[11px] text-rose-500 font-bold uppercase tracking-wider mb-1">Critical Alert</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Train #1105 reports consistent AC failure in Coach B over last 3 trips.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
