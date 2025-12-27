import React from 'react';
import { Ticket, Edit3, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function TicketsTable({ tickets = [], type }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const headers = ['Ticket ID', 'Status', 'Priority', 'Department', 'Assignee', 'Created At', 'Actions'];

  const getFromPath = () => {
    if (isAdmin && type === 'all') return '/dashboard/tickets';
    if (type === 'assigned') return '/dashboard/assignedticket';
    if (type === 'closed') return '/dashboard/closedticket';
    if (type === 'raised') return '/dashboard/raisedticket';
    return '/dashboard/homepage'; 
  };

  const handleTicketRouting = (id) => {
    const fromPath = getFromPath();
    navigate(`/dashboard/viewticket/${id}`, { state: { from: fromPath } });
  };

  const formatText = (text) => {
    if (!text || typeof text !== 'string') return 'N/A';
    const cleanText = text.toString().trim();
    if (!cleanText) return 'N/A';
    return cleanText.charAt(0).toUpperCase() + cleanText.slice(1).toLowerCase();
  };

  // Helper function to get status styling
  const getStatusStyle = (status) => {
    if (!status) return 'border-gray-400 text-gray-500';
    
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'border-green-500 text-green-600';
      case 'CLOSED':
        return 'border-gray-400 text-gray-500';
      default:
        return 'border-yellow-500 text-yellow-600';
    }
  };

  // Helper function to get priority styling
  const getPriorityStyle = (priority) => {
    if (!priority) return 'border-gray-400 text-gray-500';
    
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'border-red-500 text-red-600';
      case 'MEDIUM':
        return 'border-yellow-500 text-yellow-600';
      case 'LOW':
        return 'border-green-500 text-green-600';
      default:
        return 'border-gray-400 text-gray-500';
    }
  };

  return (
    <div className="mb-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.ticketNo} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap font-semibold text-indigo-600">
                    {ticket.ticketNo ? ticket.ticketNo.toString().padStart(5, '0') : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(ticket.status)}`}>
                      {formatText(ticket.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityStyle(ticket.priority)}`}>
                      {formatText(ticket.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {ticket.department || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {ticket.assignee || 'Unassigned'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTicketRouting(ticket.ticketNo)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {type === "raised" && (
                        <button
                          onClick={() => navigate(`/dashboard/editticket/${ticket.ticketNo}`)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-4 text-center text-gray-500">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TicketsTable;