import React from "react";
import { User, Calendar, Clock } from "lucide-react";

const priorityColors = {
  HIGH: "border-red-500 text-red-600 bg-red-50",
  MEDIUM: "border-yellow-500 text-yellow-600 bg-yellow-50",
  LOW: "border-green-500 text-green-600 bg-green-50",
};

const statusColors = {
  OPEN: "border-blue-500 text-blue-600 bg-blue-50",
  ASSIGNED: "border-purple-500 text-purple-600 bg-purple-50",
  IN_PROGRESS: "border-yellow-500 text-yellow-600 bg-yellow-50",
  RESOLVED: "border-green-500 text-green-600 bg-green-50",
  CLOSED: "border-gray-500 text-gray-600 bg-gray-50",
};

function TicketDetails({ ticket }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {ticket.subject || "No Subject"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {ticket.priority && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                priorityColors[ticket.priority] || priorityColors.MEDIUM
              }`}
            >
              {ticket.priority}
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              statusColors[ticket.status] || statusColors.OPEN
            }`}
          >
            {ticket.status?.replace("_", " ") || "Open"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Employee:</span>
          <span className="font-medium">
            {ticket.employeeName || "N/A"} {ticket.empId && `(${ticket.empId})`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Department:</span>
          <span className="font-medium">{ticket.department || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Created:</span>
          <span className="font-medium">
            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600">Assigned to:</span>
          <span className="font-medium">
            {ticket.assignee || "Unassigned"}
          </span>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-800 mb-3">Description</h3>
        <p className="text-gray-600 leading-relaxed">
          {ticket.detailedMessage || "No description provided"}
        </p>
      </div>
    </div>
  );
}

export default TicketDetails;