export default function RouteCard({ route }) {
  const title = route.route.map(r => `${r.name || r.code} (${r.code})`).join(' → ');
  const trains = (route.trains || []).map(t => `${t.number}${t.name ? ' • ' + t.name : ''}`).join(' | ');
  const dur = route.durationMinutes != null ? `${Math.floor(route.durationMinutes/60)}h ${route.durationMinutes%60}m` : '-';

  // Price display: support both legacy string and new per-class object
  const priceDisplayObj = route.priceDisplay && typeof route.priceDisplay === 'object' ? route.priceDisplay : null;
  const priceLegacy = route.priceDisplay && typeof route.priceDisplay === 'string' ? route.priceDisplay : null;
  const classesOrder = ['SL', '3A', '2A', '1A'];

  return (
    <div className={`bg-[#1E293B] border rounded-xl p-6 border-slate-700`}>

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-lg font-bold text-white">{title}</h3>

          <p className="text-sm text-slate-400 mt-1">Total Duration: {dur} • {route.transfers} Transfer{route.transfers > 1 ? 's' : ''}</p>

          <p className="text-sm text-slate-400 mt-1">Trains: {trains}</p>

        </div>

        <div className="text-right">

          <p className="text-sm text-slate-400">Price</p>

          {priceLegacy ? (
            <p className="text-2xl font-bold text-white">{priceLegacy}</p>
          ) : priceDisplayObj ? (
            <div className="flex gap-2 mt-2 justify-end">
              {classesOrder.map(cls => (
                <div key={cls} className="bg-slate-800 px-3 py-1 rounded text-xs text-white">
                  <span className="font-semibold">{cls}</span>
                  <span className="ml-2">{priceDisplayObj[cls] || '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-2xl font-bold text-white">—</p>
          )}

        </div>

      </div>

      <div className="flex justify-between items-center mt-6">

        <div className="flex gap-4 text-xs text-slate-400">
          <span>Easy Transfer</span>
          <span>Food Available</span>
          <span>Wi-Fi</span>
        </div>

        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Select Route</button>

      </div>

    </div>
  );
}