import RouteCard from "./RouteCard";

export default function RouteList({ routes = [], loading = false }) {
  if (loading) return <div className="text-slate-400">Searching for routes...</div>;
  if (!routes || !routes.length) return <div className="text-slate-400">No routes found.</div>;

  return (
    <div className="space-y-6">
      {routes.map((route, index) => (
        <RouteCard key={index} route={route} />
      ))}
    </div>
  );
}