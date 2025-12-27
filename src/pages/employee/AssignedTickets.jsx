import React, { useState , useEffect } from "react";
import TicketsTable from "../../components/common/TicketsTable";
import { Ticket, Edit3, Trash2, Eye } from 'lucide-react';
import { ticketAPI } from "../../api/ticketAPI";


function AssignedTickets() {
 
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketAPI.assignedTickets();
          setTickets(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading tickets...</p>;
  }


  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Assigned Tickets</h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded" />
      </div>

      <TicketsTable tickets={tickets}  type="assigned" />
    </>
  );
}

export default AssignedTickets;
