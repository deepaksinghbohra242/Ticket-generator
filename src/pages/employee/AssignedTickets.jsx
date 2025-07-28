import React from "react";
import Card from "../../components/common/Card";

function AssignedTickets() {
  const ticket = {
    id: "#12345",
    status: "Open",
    department: "IT",
    description: "System crash on login.",
    createdAt: "2025-07-27",
    createdBy: "John Doe",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <Card key={i} ticket={ticket} type="assigned" />
      ))}
    </div>
  );
}

export default AssignedTickets;
