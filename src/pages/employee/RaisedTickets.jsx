import React, { useState } from "react";
import TicketsTable from "../../components/common/TicketsTable";
import { Ticket, Edit3, Trash2, Eye } from 'lucide-react';

function RaisedTickets() {
  const temp = [
    {
      ticketNo: 1,
      employeeName: "Pooja",
      empId: "1004",
      department: "Transport",
      subject: "Long Cab Hours",
      detailedMessage: "Cab TAkes Long Routes",
      assignee: null,
      status: "OPEN",
      priority: "HIGH",
      createdAt: "2025-08-05T05:39:40.433008",
    },
    {
      ticketNo: 2,
      employeeName: "Pooja",
      empId: "1004",
      department: "Transport",
      subject: "Long Cab Hours",
      detailedMessage: "Cab TAkes Long Routes",
      assignee: null,
      status: "OPEN",
      priority: "HIGH",
      createdAt: "2025-08-05T05:39:40.433008",
    },
    {
      ticketNo: 3,
      employeeName: "Pooja",
      empId: "1004",
      department: "Transport",
      subject: "Long Cab Hours",
      detailedMessage: "Cab TAkes Long Routes",
      assignee: null,
      status: "OPEN",
      priority: "HIGH",
      createdAt: "2025-08-05T05:39:40.433008",
    },
  ];
  const [tickets, setTickets] = useState(temp);

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Raised Tickets</h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded" />
      </div>

      <TicketsTable tickets={tickets} />
    </>
  );
}

export default RaisedTickets;
