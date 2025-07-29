import React from "react";
import TicketGrid from "../../components/common/TicketGrid";


function RaisedTickets() {
  const ticket = [{
    id: "#12347",
    status: "Open",
    department: "Finance",
    description: "Payroll calculation error.",
    createdAt: "2025-07-24",
    assignee: "Finance Team",
  } ,
{
    id: "#12347",
    status: "Open",
    department: "Finance",
    description: "Payroll calculation error.",
    createdAt: "2025-07-24",
    assignee: "Finance Team",
  } ,
{
    id: "#12347",
    status: "Open",
    department: "Finance",
    description: "Payroll calculation error.",
    createdAt: "2025-07-24",
    assignee: "Finance Team",
  },{
    id: "#12347",
    status: "Open",
    department: "Finance",
    description: "Payroll calculation error.",
    createdAt: "2025-07-24",
    assignee: "Finance Team",
  }];

  return (
    <>
      <TicketGrid
        tickets={ticket}
        type="raised"
        title="📤 Raised Tickets"
      />
    </>
  );
}

export default RaisedTickets;
