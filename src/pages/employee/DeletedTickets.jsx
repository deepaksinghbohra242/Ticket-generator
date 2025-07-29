import React from "react";
import TicketGrid from "../../components/common/TicketGrid";


function DeletedTickets() {
  const ticket = [{
    id: "#12346",
    status: "Closed",
    department: "HR",
    description: "Access revoked issue.",
    deletedOn: "2025-07-25",
  }];

  return (
    <>
    <TicketGrid 
          tickets={ticket} 
          type="deleted" 
          title="🗑️ Deleted Tickets" 
        />
    </>
  );
}

export default DeletedTickets;
  