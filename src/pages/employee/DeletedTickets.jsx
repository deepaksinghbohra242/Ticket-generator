import React from "react";
import Card from "../../components/common/Card";

function DeletedTickets() {
  const ticket = {
    id: "#12346",
    status: "Closed",
    department: "HR",
    description: "Access revoked issue.",
    deletedOn: "2025-07-25",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
      {[...Array(4)].map((_, i) => (
        <Card key={i} ticket={ticket} type="deleted" />
      ))}
    </div>
  );
}

export default DeletedTickets;
  