import React, { useState, useEffect } from "react";
import { User, Edit3, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { adminAPI } from "../../api/adminAPI";
import { ticketAPI } from "../../api/ticketAPI";

const statusOptions = [
  { value: "OPEN", label: "Open" },
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

  console.log(ticket, currentUser);

  // Fixed: Check if current user is assigned to the ticket using assignee field
  const isAssignedToCurrentUser = currentUser && ticket && (
    currentUser.empId === ticket.assignee
  );

  // Check if current user created the ticket
  const isTicketCreatedByCurrentUser = currentUser && ticket && (
    currentUser.empId === ticket.empId 
  );
  
  // Users can only assign to themselves if ticket is unassigned and they didn't create it
  const canAssignToSelf = !isAdmin && !isTicketCreatedByCurrentUser && !ticket?.assignee;
  
  // Admins can modify status of any ticket, regular users only if assigned
  const canModifyStatus = isAdmin || isAssignedToCurrentUser;
  
  // Check if ticket is assigned
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
        assignee: currentUser.empId, // Store empId as assignee
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

      const updatedTicket = {
        ...ticket,
        assignee: selectedAssigneeEmpId, // Store empId as assignee
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

      // Use specific API endpoints based on status change
      if (newStatus === "FIXED") {
        await ticketAPI.fixedTicket(ticket.ticketNo || ticketId);
      } else if (newStatus === "CLOSED") {
        await ticketAPI.closedTickets(ticket.ticketNo || ticketId);
      } else if (newStatus === "OPEN" && ticket.status === "CLOSED") {
        await ticketAPI.reopenTicket(ticket.ticketNo || ticketId);
      } else {
        // For other status changes, try a generic update method if available
        if (ticketAPI.updateTicketStatus) {
          await ticketAPI.updateTicketStatus(ticket.ticketNo || ticketId, newStatus);
        } else {
          throw new Error(`Status change to ${newStatus} is not supported`);
        }
      }

      const updatedTicket = {
        ...ticket,
        status: newStatus,
      };

      onUpdateTicket(updatedTicket);
      setShowStatusDropdown(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      setError(`Failed to update ticket status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStatusOptions = () => {
    const currentStatus = ticket?.status || "OPEN";
    
    // Admins can change status of any ticket, regular users only if assigned
    if (!isAdmin && !isAssignedToCurrentUser) {
      return [];
    }
    
    // Define valid status transitions
    const validTransitions = {
      "OPEN": ["ASSIGNED", "IN_PROGRESS", "FIXED"],
      "ASSIGNED": ["IN_PROGRESS", "FIXED", "CLOSED"],
      "IN_PROGRESS": ["FIXED", "ASSIGNED", "CLOSED"],  
      "FIXED": ["IN_PROGRESS", "CLOSED"],
      "CLOSED": ["OPEN"] // Allow reopening for assigned users
    };

    // Admins get full control over all status transitions
    if (isAdmin) {
      const adminTransitions = {
        "OPEN": ["ASSIGNED", "IN_PROGRESS", "FIXED", "CLOSED"],
        "ASSIGNED": ["OPEN", "IN_PROGRESS", "FIXED", "CLOSED"],
        "IN_PROGRESS": ["OPEN", "ASSIGNED", "FIXED", "CLOSED"],
        "FIXED": ["OPEN", "ASSIGNED", "IN_PROGRESS", "CLOSED"],
        "CLOSED": ["OPEN", "ASSIGNED", "IN_PROGRESS", "FIXED"]
      };
      const allowedTransitions = adminTransitions[currentStatus] || [];
      return statusOptions.filter(option => 
        option.value !== currentStatus && 
        allowedTransitions.includes(option.value)
      );
    }

    // Regular assigned users have limited transitions
    const allowedTransitions = validTransitions[currentStatus] || [];
    return statusOptions.filter(option => 
      option.value !== currentStatus && 
      allowedTransitions.includes(option.value)
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      "OPEN": "bg-red-100 text-red-700 border-red-300",
      "ASSIGNED": "bg-blue-100 text-blue-700 border-blue-300",
      "IN_PROGRESS": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "FIXED": "bg-green-100 text-green-700 border-green-300",
      "CLOSED": "bg-gray-100 text-gray-700 border-gray-300"
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  // Get assignee name for display
  const getAssigneeName = () => {
    if (!ticket?.assignee) return null;
    
    // If admin, try to find the name from department employees
    if (isAdmin && departmentEmployees.length > 0) {
      const assignedEmployee = departmentEmployees.find(emp => emp.empId === ticket.assignee);
      return assignedEmployee?.name || ticket.assignee;
    }
    
    // If current user is assigned
    if (ticket.assignee === currentUser?.empId) {
      return currentUser.name;
    }
    
    // Fallback to empId if name not found
    return ticket.assignee;
  };

  const renderAssignmentSection = () => {
    // Case 1: Ticket is already assigned
    if (isTicketAssigned) {
      const assigneeName = getAssigneeName();
      
      if (isAssignedToCurrentUser) {
        // If assigned to current user, show their name with emphasis
        return (
          <div className="px-4 py-2 bg-blue-100 text-blue-700 border-2 border-blue-300 rounded-lg flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Assigned to You ({assigneeName})
          </div>
        );
      } else {
        // If assigned to someone else, just show the assignee name
        return (
          <div className="px-4 py-2 bg-green-100 text-green-700 border-2 border-green-300 rounded-lg flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Assigned to {assigneeName}
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
    // Only show status section if user can modify status
    if (!canModifyStatus) return null;

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

          {/* Status Management Section - Only for assigned user */}
          {renderStatusSection()}

          {/* Current Status Display */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">Current Status:</div>
            <div className="font-medium text-gray-800">
              {ticket?.assignee ? `Assigned to ${getAssigneeName()}` : "Unassigned"}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Status: <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket?.status)}`}>
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