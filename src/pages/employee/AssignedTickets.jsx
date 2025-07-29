import React from "react";
import TicketGrid from "../../components/common/TicketGrid";

function AssignedTickets() {
  const ticket = [{
    id: "#12345",
    status: "Open",
    department: "IT",
    description: "System crash on login.",
    createdAt: "2025-07-27",
    createdBy: "John Doe",
  }];

  return (
    <>
      <TicketGrid tickets={ticket} type="assigned" title="📋 Assigned Tickets" />
    </>
  );
}

export default AssignedTickets;
