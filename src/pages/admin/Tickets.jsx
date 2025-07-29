import { useState } from "react";
import { Eye, Search } from "lucide-react";

const tickets = [
  {
    ticketNumber: "#12345",
    department: "IT",
    createdBy: "John Doe",
    createdAt: "2025-07-27",
    isFixed: false,
  },
  {
    ticketNumber: "#12346",
    department: "HR",
    createdBy: "Jane Smith",
    createdAt: "2025-07-26",
    isFixed: true,
  },
  {
    ticketNumber: "#12347",
    department: "Finance",
    createdBy: "Alice Green",
    createdAt: "2025-07-25",
    isFixed: false,
  },
  {
    ticketNumber: "#12348",
    department: "Marketing",
    createdBy: "Mike Johnson",
    createdAt: "2025-07-24",
    isFixed: false,
  },
  {
    ticketNumber: "#12349",
    department: "Operations",
    createdBy: "Sarah Wilson",
    createdAt: "2025-07-23",
    isFixed: true,
  },
];

function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality is handled by the filter below
  };

  const filteredTickets = tickets.filter((ticket) =>
    [ticket.ticketNumber, ticket.department, ticket.createdBy]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by ticket number, department, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-l-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-r-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex items-center gap-2">
                <Search size={18} />
                Search
              </div>
            </button>
          </form>
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Ticket Number
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Department
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Created By
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Created At
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    View
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold text-gray-900 text-lg">
                          {ticket.ticketNumber}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {ticket.department}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {ticket.createdBy.charAt(0)}
                          </div>
                          <span className="text-gray-900 font-medium">{ticket.createdBy}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-600 font-medium">{ticket.createdAt}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button
                          title="View Ticket Details"
                          className="p-3 text-blue-600 hover:text-white hover:bg-blue-600 rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-110"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {ticket.isFixed ? (
                          <div className="inline-flex items-center px-3 py-2 rounded-full bg-green-100 text-green-800 border border-green-200">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span className="font-semibold text-sm">Fixed</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-2 rounded-full bg-red-100 text-red-800 border border-red-200">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                            <span className="font-semibold text-sm">Open</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Search size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tickets found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tickets;