import { useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";

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
];

function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter((ticket) =>
    [ticket.ticketNumber, ticket.department, ticket.createdBy]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* 🔍 Search Bar */}
      <form
        className="flex items-center max-w-xl mx-auto mb-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search ticket number, department, or created..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Search
        </button>
      </form>

      {/* 📋 Ticket Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-sm text-left text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">Ticket Number</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Created By</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3 text-center">View</th>
              <th className="px-6 py-3 text-center">Fixed</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {ticket.ticketNumber}
                  </td>
                  <td className="px-6 py-4">{ticket.department}</td>
                  <td className="px-6 py-4">{ticket.createdBy}</td>
                  <td className="px-6 py-4">{ticket.createdAt}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      title="View Ticket"
                      className="text-blue-600 hover:text-green-600 text-xl transition duration-200"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center text-lg">
                    {ticket.isFixed ? (
                      <span className="text-green-600">✔️</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center px-6 py-6 text-gray-500 dark:text-gray-400"
                >
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tickets;
