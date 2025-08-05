import React from "react";
import TicketsTable from "../../components/common/TicketsTable";

function ClosedTickets() {
  const tickets = [
  {
    id: 'TCKT001',
    status: 'Open',
    priority: 'High',
    department: 'IT',
    assignee: 'John Doe',
  },
  {
    id: 'TCKT002',
    status: 'Closed',
    priority: 'Low',
    department: 'HR',
    assignee: 'Jane Smith',
  },
];  

  return (
    <>
      <TicketsTable tickets={tickets} />
    </>
  );
}

export default ClosedTickets;
