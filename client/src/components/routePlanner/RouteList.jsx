import RouteCard from "./RouteCard";

export default function RouteList() {

  const routes = [
    {
      title: "New Delhi → Varanasi via Lucknow",
      duration: "12h 45m • 1 Transfer",
      price: "₹1450",
      recommended: true
    },
    {
      title: "New Delhi → Varanasi via Kanpur",
      duration: "11h 20m • 1 Transfer",
      price: "₹1820"
    },
    {
      title: "New Delhi → Varanasi via Allahabad",
      duration: "14h 10m • 1 Transfer",
      price: "₹1120"
    }
  ];

  return (
    <div className="space-y-6">

      {routes.map((route, index) => (
        <RouteCard key={index} {...route} />
      ))}

    </div>
  );
}