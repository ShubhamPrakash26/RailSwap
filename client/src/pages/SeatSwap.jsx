import DashboardLayout from "../components/layout/DashboardLayout";
import PNRCard from "../components/seatswap/PNRCard";
import SwapList from "../components/seatswap/SwapList";
import JourneyList from "../components/seatswap/JourneyList";

export default function SeatSwap() {
  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          RAC Seat Swap Management
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your current seat position and explore potential swaps with fellow travelers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <PNRCard />
          <JourneyList />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8">
          <SwapList />
        </div>

      </div>

    </DashboardLayout>
  );
}