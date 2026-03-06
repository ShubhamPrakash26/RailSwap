export default function RouteCard({ title, duration, price, recommended }) {
  return (
    <div className={`bg-[#1E293B] border rounded-xl p-6 
    ${recommended ? "border-blue-500" : "border-slate-700"}`}>

      <div className="flex justify-between items-start">

        <div>

          {recommended && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded mb-2 inline-block">
              Highly Recommended
            </span>
          )}

          <h3 className="text-lg font-bold text-white">
            {title}
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Total Duration: {duration}
          </p>

        </div>

        <div className="text-right">

          <p className="text-sm text-slate-400">
            Total Price
          </p>

          <p className="text-2xl font-bold text-white">
            {price}
          </p>

        </div>

      </div>

      <div className="flex justify-between items-center mt-6">

        <div className="flex gap-4 text-xs text-slate-400">
          <span>Easy Transfer</span>
          <span>Food Available</span>
          <span>Wi-Fi</span>
        </div>

        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
          Select Route
        </button>

      </div>

    </div>
  );
}