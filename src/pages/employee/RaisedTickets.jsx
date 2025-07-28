import React from "react";
import Card from "../../components/common/Card";

function RaisedTickets() {
  const ticket = {
    id: "#12347",
    status: "Open",
    department: "Finance",
    description: "Payroll calculation error.",
    createdAt: "2025-07-24",
    assignee: "Finance Team",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <Card key={i} ticket={ticket} type="raised" />
      ))}
    </div>
  );
}

export default RaisedTickets;
