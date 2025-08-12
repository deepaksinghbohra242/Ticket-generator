import React, { useState, useEffect } from "react";
import { User, Edit3, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Determine user permissions and ticket state
  const isAssignedToCurrentUser = currentUser && ticket && (
    currentUser.empId === ticket.assignee
  );

  const isTicketCreatedByCurrentUser = currentUser && ticket && (
    currentUser.empId === ticket.empId 
  );
  
  const canAssignToSelf = !isAdmin && !isTicketCreatedByCurrentUser && !isAssignedToCurrentUser;
  const canModifyStatus = isAssignedToCurrentUser || isAdmin;
  const isTicketAssigned = ticket?.assignee;

  useEffect(() => {
    if (isAdmin) {
      fetchDepartmentEmployees();
    }
  }, [isAdmin, ticket]);

  const fetchDepartmentEmployees = async () => {
    try {
      setLoading(true);
      const employees = await adminAPI.getEmployees();
      
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
        await ticketAPI.updateTicketAssignee(ticketId, currentUser.empId);
      } else {
        await ticketAPI.assignToMe(ticket.ticketNo || ticketId);
      }

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
        await ticketAPI.fixedTicket(ticket.ticketNo || ticketId);
      } else if (newStatus === "CLOSED" && isAdmin && ticket.status === "FIXED") {
        await ticketAPI.closedTickets(ticket.ticketNo || ticketId);
      } else if (newStatus === "OPEN" && ticket.status === "CLOSED") {
        await ticketAPI.reopenTicket(ticket.ticketNo || ticketId);
      } else {
        console.warn("Status change not supported by current API");
        return;
      }

      const updatedTicket = {
        ...ticket,
        status: newStatus,
      };

      onUpdateTicket(updatedTicket);
      setShowStatusDropdown(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update ticket status");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStatusOptions = () => {
    const currentStatus = ticket?.status || "OPEN";
    
    if (!isAdmin && isAssignedToCurrentUser) {
      return statusOptions.filter(option => 
        option.value !== currentStatus && 
        (option.value === "FIXED" || option.value === "IN_PROGRESS")
      );
    } else if (isAdmin) {
      if (currentStatus === "FIXED") {
        return statusOptions.filter(option => 
          option.value === "CLOSED" || option.value === "OPEN"
        );
      }
      return statusOptions.filter(option => option.value !== currentStatus);
    }
    
    return [];
  };

  const renderAssignmentSection = () => {
    // Case 1: Ticket is already assigned
    if (isTicketAssigned) {
      if (isAssignedToCurrentUser) {
        // If assigned to current user, show their name with emphasis
        return (
          <div className="px-4 py-2 bg-blue-100 text-blue-700 border-2 border-blue-300 rounded-lg flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Assigned to You ({ticket.assignee})
          </div>
        );
      } else {
        // If assigned to someone else, just show the assignee name
        return (
          <div className="px-4 py-2 bg-green-100 text-green-700 border-2 border-green-300 rounded-lg flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Assigned to {ticket.assignee}
          </div>
        );
      }
    }

    // Case 2: Admin - can assign to anyone or self (only if unassigned)
    if (isAdmin && !isTicketAssigned) {
      return (
        <div className="grid gap-4">
          <button
            onClick={handleAssignToMe}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            {loading ? "Assigning..." : "Assign to Myself"}
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Assign to Employee
          </button>
        </div>
      );
    }

    // Case 3: Ticket creator - can only view assignment status (only if unassigned)
    if (isTicketCreatedByCurrentUser && !isAdmin && !isTicketAssigned) {
      return (
        <div className="px-4 py-2 bg-yellow-100 text-yellow-700 border-2 border-yellow-300 rounded-lg text-center text-sm">
          You cannot assign tickets created by you
        </div>
      );
    }

    // Case 4: Other users - can assign to themselves if ticket is unassigned
    if (canAssignToSelf && !isTicketAssigned) {
      return (
        <button
          onClick={handleAssignToMe}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4" />
          {loading ? "Assigning..." : "Assign to Me"}
        </button>
      );
    }

    return null;
  };

  const renderStatusSection = () => {
    if (!canModifyStatus || !isTicketAssigned) return null;

    const availableOptions = getAvailableStatusOptions();
    if (availableOptions.length === 0) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          disabled={loading}
          className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 transition-colors flex items-center justify-between gap-2"
        >
          <span className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Update Status
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showStatusDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {availableOptions.map((statusOption) => (
              <button
                key={statusOption.value}
                onClick={() => handleStatusUpdate(statusOption.value)}
                disabled={loading}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:bg-gray-50 transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? "Updating..." : `Mark as ${statusOption.label}`}
              </button>
            ))}
          </div>
        )}
      </div>
    );
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
          {/* Assignment Section */}
          {renderAssignmentSection()}

          {/* Status Management Section */}
          {renderStatusSection()}

          {/* Current Status Display */}
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
          {/* Admin Employee Selection */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Employee (Department: {ticket?.department || "All"}):
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
                {departmentEmployees.map((employee) => (
                  <option key={employee.empId} value={employee.empId}>
                    {employee.name} ({employee.empId})
                    {employee.empId === currentUser?.empId ? " - Me" : ""}
                  </option>
                ))}
              </select>
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
              onClick={() => {
                setIsEditing(false);
                setSelectedAssignee("");
                setSelectedAssigneeEmpId("");
                setError("");
              }}
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