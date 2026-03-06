export default function ActivityTimeline() {
  return (
    <section>

      <div className="flex justify-between mb-6">

        <h2 className="text-xl font-bold text-white">
          Activity Timeline
        </h2>

        <button className="text-sm text-blue-400">
          View All
        </button>

      </div>

      <div className="space-y-6">

        <div>
          <p className="font-semibold text-white">
            New swap request sent
          </p>

          <p className="text-sm text-slate-400">
            Requested Lower Berth from S-7 Seat 14
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">
            Priya replied to your post
          </p>

          <p className="text-sm text-slate-400">
            Pantry food is decent on this route
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">
            Alternate route generated
          </p>

          <p className="text-sm text-slate-400">
            Found 2 faster routes via Bhopal
          </p>
        </div>

      </div>

    </section>
  );
}