export default function RouteInfo() {
  return (
    <div className="grid md:grid-cols-2 gap-8 mt-12">

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-xl text-white">

        <h3 className="text-xl font-bold mb-3">
          Can't find a seat?
        </h3>

        <p className="text-sm opacity-90 mb-6">
          Join our Seat Swap community. Someone on the same train might
          be getting off early.
        </p>

        <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg">
          Join Community
        </button>

      </div>

      <div className="bg-[#1E293B] border border-slate-700 p-8 rounded-xl">

        <h3 className="text-xl font-bold text-white mb-4">
          Why use Route Planner?
        </h3>

        <ul className="space-y-3 text-sm text-slate-400">

          <li>✔ Discover hidden train connections</li>
          <li>✔ Real-time availability tracking</li>
          <li>✔ Optimized transfer time planning</li>

        </ul>

      </div>

    </div>
  );
}