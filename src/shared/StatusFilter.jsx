import { useSearchParams } from "react-router-dom";

function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);

    if (status === "all") {
      newParams.delete("status");
    } else {
      newParams.set("status", status);
    }

    setSearchParams(newParams);
  };

  return (
    <div>
      <label htmlFor="statusFilter">Show:</label>

      <select
        id="statusFilter"
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="all">All Todos</option>
        <option value="active">Active Todos</option>
        <option value="completed">Completed Todos</option>
      </select>
    </div>
  );
}

export default StatusFilter;