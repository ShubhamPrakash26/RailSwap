import DashboardLayout from "../components/layout/DashboardLayout";
import RouteSearch from "../components/routePlanner/RouteSearch";
import RouteTabs from "../components/routePlanner/RouteTabs";
import RouteList from "../components/routePlanner/RouteList";
import RouteInfo from "../components/routePlanner/RouteInfo";

export default function RoutePlanner() {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <RouteSearch />

        <RouteTabs />

        <RouteList />

        <RouteInfo />

      </div>

    </DashboardLayout>
  );
}