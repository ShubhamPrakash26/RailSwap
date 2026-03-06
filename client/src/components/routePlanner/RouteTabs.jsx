export default function RouteTabs() {
  return (
    <div className="flex justify-between items-center">

      <div className="flex bg-slate-800 p-1 rounded-lg">

        <button className="px-4 py-2 bg-slate-700 rounded text-sm font-semibold text-blue-400">
          Fastest Route
        </button>

        <button className="px-4 py-2 text-sm text-slate-400">
          Cheapest Route
        </button>

        <button className="px-4 py-2 text-sm text-slate-400">
          Fewest Transfers
        </button>

      </div>

      <span className="text-sm text-slate-400">
        Showing 12 alternate connections
      </span>

    </div>
  );
}