import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import JourneyCard from "../components/dashboard/JourneyCard";
import SwapRequestCard from "../components/dashboard/SwapRequestCard";
import CommunityCard from "../components/dashboard/CommunityCard";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";

export default function Dashboard() {
  return (
    <DashboardLayout>

      <DashboardHeader />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <JourneyCard />
        <SwapRequestCard />
        <CommunityCard />
      </div>

      <ActivityTimeline />

    </DashboardLayout>
  );
}