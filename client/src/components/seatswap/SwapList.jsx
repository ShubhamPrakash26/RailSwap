import SwapRequestCard from "./SwapRequestCard";

export default function SwapList() {

  const swaps = [
    {
      name: "Rahul S.",
      verified: true,
      wants: "RAC 32",
      offer: "Side Lower, B2",
      time: "5 mins ago",
      distance: "2 coaches away"
    },
    {
      name: "Ananya M.",
      wants: "RAC 27",
      offer: "Upper Berth, B2",
      time: "12 mins ago",
      distance: "Same coach"
    }
  ];

  return (
    <div>

      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">

        <div className="flex gap-2">

          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
            <option>All Seat Types</option>
            <option>Lower Berth</option>
            <option>Side Lower</option>
            <option>Upper Berth</option>
          </select>

          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
            <option>All Coaches</option>
            <option>B1</option>
            <option>B2</option>
            <option>B3</option>
          </select>

        </div>

        <span className="text-sm text-slate-400">
          Showing 12 results
        </span>

      </div>

      {/* SWAP LIST */}

      <div className="space-y-4">

        {swaps.map((swap, index) => (
          <SwapRequestCard key={index} {...swap} />
        ))}

      </div>

    </div>
  );
}