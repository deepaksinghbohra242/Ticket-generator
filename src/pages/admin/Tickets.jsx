import React, { useContext, useEffect, useState } from "react";
import TicketsTable from "../../components/common/TicketsTable";
import { ticketAPI } from "../../api/ticketAPI";
import { Ticket } from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";

function Tickets() {

  const {isAdmin} = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if(isAdmin){
          const data = await ticketAPI.getAllTickets();
          setTickets(data);
        }else{
          const data = await ticketAPI.getUserTickets();
          setTickets(data);
        }
        

      } catch (error) {
        console.error("Failed to fetch tickets:", error);
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
          <h2 className="text-2xl font-bold text-gray-800">Tickets</h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded" />
      </div>

      <TicketsTable tickets={tickets} type="admin" />
    </>
  );
}

export default Tickets;
