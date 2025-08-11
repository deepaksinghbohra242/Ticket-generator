import React, { useState, useEffect } from "react";
import { User, Edit3, CheckCircle, AlertCircle } from "lucide-react";
import { adminAPI } from "../../api/adminAPI";
import { ticketAPI } from "../../api/ticketAPI";


const statusOptions = [
  { value: "OPEN", label: "Open" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "FIXED", label: "Fixed" },
  { value: "CLOSED", label: "Closed" },
];

function TicketManagement({ 
  ticket, 
  onUpdateTicket, 
  currentUser, 
  isAdmin, 
  ticketId 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedAssigneeEmpId, setSelectedAssigneeEmpId] = useState("");
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Determine user permissions and ticket state
  const isAssignedToCurrentUser = currentUser && ticket && (
    currentUser.empId === ticket.assigneeEmpId || 
    currentUser.name === ticket.assignee
  );
  const isTicketCreatedByCurrentUser = currentUser && ticket && (
    currentUser.empId === ticket.employeeEmpId || 
    currentUser.empId === ticket.raisedByEmpId
  );
  const canAssignToSelf = !isAdmin && !isTicketCreatedByCurrentUser && !isAssignedToCurrentUser;
  const canModifyStatus = isAssignedToCurrentUser || isAdmin;

  useEffect(() => {
    if (isAdmin) {
      fetchDepartmentEmployees();
    }
  }, [isAdmin, ticket]);

  const fetchDepartmentEmployees = async () => {
    try {
      setLoading(true);
      const employees = await adminAPI.getEmployees();
      
      // Filter employees by department if ticket has department info
      const filteredEmployees = ticket?.department 
        ? employees.filter(emp => emp.department === ticket.department)
        : employees;
      
      setDepartmentEmployees(filteredEmployees || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async () => {
    try {
      setLoading(true);
      setError("");

      if (isAdmin) {
        // Admin assigning to themselves
        await ticketAPI.updateTicketAssignee(ticketId, currentUser.empId);
      } else {
        // Employee assigning to themselves
        await ticketAPI.assignToMe(ticket.ticketNo || ticketId);
      }

      // Update local state
      const updatedTicket = {
        ...ticket,
        assignee: currentUser.name,
        assigneeEmpId: currentUser.empId,
        status: "ASSIGNED",
      };

      onUpdateTicket(updatedTicket);
    } catch (error) {
      console.error("Failed to assign ticket:", error);
      setError("Failed to assign ticket to yourself");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAssignment = async () => {
    try {
      setLoading(true);
      setError("");

      await ticketAPI.updateTicketAssignee(ticketId, selectedAssigneeEmpId);

      // Find the selected employee details
      const selectedEmployee = departmentEmployees.find(emp => emp.empId === selectedAssigneeEmpId);
      
      const updatedTicket = {
        ...ticket,
        assignee: selectedEmployee?.name || "",
        assigneeEmpId: selectedAssigneeEmpId,
        status: selectedAssigneeEmpId ? "ASSIGNED" : "OPEN",
      };

      onUpdateTicket(updatedTicket);
      setIsEditing(false);
      setSelectedAssignee("");
      setSelectedAssigneeEmpId("");
    } catch (error) {
      console.error("Failed to assign ticket:", error);
      setError("Failed to assign ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      setError("");

      if (newStatus === "FIXED" && isAssignedToCurrentUser && !isAdmin) {
        // Employee marking ticket as fixed
        await ticketAPI.markAsFixed(ticket.ticketNo || ticketId);
      } else if (newStatus === "CLOSED" && isAdmin && ticket.status === "FIXED") {
        // Admin closing a fixed ticket
        await ticketAPI.closeFixedTicket(ticket.ticketNo || ticketId);
      } else if (newStatus === "OPEN" && ticket.status === "CLOSED") {
        // Reopening a closed ticket
        await ticketAPI.reopenTicket(ticket.ticketNo || ticketId);
      } else {
        // For other status changes, we might need a general update API
        // This might require additional API endpoint
        console.warn("Status change not supported by current API");
        return;
      }

      const updatedTicket = {
        ...ticket,
        status: newStatus,
      };

      onUpdateTicket(updatedTicket);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update ticket status");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedAssignee("");
    setSelectedAssigneeEmpId("");
    setError("");
  };

  const getAvailableStatusOptions = () => {
    const currentStatus = ticket?.status || "OPEN";
    
    if (!isAdmin && isAssignedToCurrentUser) {
      // Employee can only mark as fixed if assigned to them
      return statusOptions.filter(option => 
        option.value === currentStatus || option.value === "FIXED"
      );
    } else if (isAdmin) {
      // Admin can change to any appropriate status
      if (currentStatus === "FIXED") {
        return statusOptions.filter(option => 
          option.value === currentStatus || option.value === "CLOSED"
        );
      }
      return statusOptions;
    }
    
    return statusOptions.filter(option => option.value === currentStatus);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Ticket Management
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!isEditing ? (
        <div className="grid gap-4">
          {/* For employees - Assign to Me button */}
          {canAssignToSelf && (
            <button
              onClick={handleAssignToMe}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              {loading ? "Assigning..." : "Assign to Me"}
            </button>
          )}

          {/* Show assigned status for current user */}
          {isAssignedToCurrentUser && (
            <div className="px-4 py-2 bg-green-100 text-green-700 border-2 border-green-300 rounded-lg flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Assigned
            </div>
          )}

          {/* Warning for ticket creator */}
          {isTicketCreatedByCurrentUser && !isAdmin && !isAssignedToCurrentUser && (
            <div className="px-4 py-2 bg-yellow-100 text-yellow-700 border-2 border-yellow-300 rounded-lg text-center text-sm">
              You cannot assign tickets created by you
            </div>
          )}

          {/* Admin controls - only show if not assigned to current user */}
          {isAdmin && !isAssignedToCurrentUser && (
            <div className="grid gap-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {loading ? "Loading..." : "Assign Ticket"}
              </button>
            </div>
          )}

          {/* Status management for assigned users - always show if user can modify */}
          {canModifyStatus && (
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Update Status
            </button>
          )}

          {/* Current Assignment Status */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">Current Status:</div>
            <div className="font-medium text-gray-800">
              {ticket?.assignee ? `Assigned to ${ticket.assignee}` : "Unassigned"}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Status: <span className="font-medium capitalize">
                {ticket?.status?.toLowerCase().replace("_", " ") || "Open"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Admin Assignment Dropdown */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to (Department: {ticket?.department || "All"}):
              </label>
              <select
                value={selectedAssigneeEmpId}
                onChange={(e) => {
                  setSelectedAssigneeEmpId(e.target.value);
                  const selectedEmp = departmentEmployees.find(emp => emp.empId === e.target.value);
                  setSelectedAssignee(selectedEmp?.name || "");
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Select Employee</option>
                <option value={currentUser?.empId}>
                  {currentUser?.name} (Myself)
                </option>
                {departmentEmployees
                  .filter(emp => emp.empId !== currentUser?.empId)
                  .map((employee) => (
                    <option key={employee.empId} value={employee.empId}>
                      {employee.name} ({employee.empId})
                    </option>
                  ))
                }
              </select>
            </div>
          )}

          {/* Status Update Options */}
          {canModifyStatus && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status:
              </label>
              <div className="grid gap-2">
                {getAvailableStatusOptions().map((statusOption) => (
                  <button
                    key={statusOption.value}
                    onClick={() => handleStatusUpdate(statusOption.value)}
                    disabled={loading || statusOption.value === ticket?.status}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      statusOption.value === ticket?.status
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {loading ? "Updating..." : `Mark as ${statusOption.label}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid gap-2">
            {isAdmin && selectedAssigneeEmpId && (
              <button
                onClick={handleAdminAssignment}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? "Assigning..." : "Assign"}
              </button>
            )}
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketManagement;