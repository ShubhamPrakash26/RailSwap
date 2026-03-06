import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import RouteSearch from "../components/routePlanner/RouteSearch";
import RouteTabs from "../components/routePlanner/RouteTabs";
import RouteList from "../components/routePlanner/RouteList";
import RouteInfo from "../components/routePlanner/RouteInfo";
import API from "../lib/api";

export default function RoutePlanner() {
  const [from, setFrom] = useState("NDLS");
  const [to, setTo] = useState("BSB");
  const [date, setDate] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!from || !to) return;
    setLoading(true);
    try {
      const res = await API.get('/routes/search', { params: { from, to, date } });
      setRoutes(res.data || []);
    } catch (err) {
      console.error('Route search failed', err);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <RouteSearch
          from={from}
          to={to}
          date={date}
          setFrom={setFrom}
          setTo={setTo}
          setDate={setDate}
          onSearch={search}
          loading={loading}
        />

        <RouteTabs />

        <RouteList routes={routes} loading={loading} />

        <RouteInfo />
      </div>
    </DashboardLayout>
  );
}