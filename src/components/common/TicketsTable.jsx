import React from 'react';
import { Ticket, Edit3, Trash2 , Eye } from 'lucide-react';

function TicketsTable({ tickets = [] }) {
  const headers = ['Ticket ID', 'Status', 'Priority', 'Department', 'Assignee', 'Actions'];

  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Tickets</h2>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded" />
      </div>

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
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap font-semibold text-indigo-600">
                    {ticket.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border 
                      ${ticket.status === 'Open' ? 'border-green-500 text-green-600' :
                        ticket.status === 'Closed' ? 'border-gray-400 text-gray-500' :
                        'border-yellow-500 text-yellow-600'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border 
                      ${ticket.priority === 'High' ? 'border-red-500 text-red-600' :
                        ticket.priority === 'Medium' ? 'border-yellow-500 text-yellow-600' :
                        'border-green-500 text-green-600'}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">{ticket.department}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">{ticket.assignee}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition" title="Edit">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 transition" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
