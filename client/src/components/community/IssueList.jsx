import IssueCard from "./IssueCard";

export default function IssueList() {

  const issues = [
    {
      title: "Dirty Washroom",
      train: "12951 Rajdhani",
      status: "Pending"
    },
    {
      title: "Food Quality Poor",
      train: "NDLS Station",
      status: "Resolved"
    }
  ];

  return (
    <div className="space-y-4">

      <h3 className="text-xl font-bold text-white">
        Active Issues
      </h3>

      {issues.map((issue, i) => (
        <IssueCard key={i} {...issue} />
      ))}

    </div>
  );
}