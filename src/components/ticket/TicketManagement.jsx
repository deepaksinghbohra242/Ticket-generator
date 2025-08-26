import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Edit3,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  UserMinus,
  X,
} from "lucide-react";
import { adminAPI } from "../../api/adminAPI";
import { ticketAPI } from "../../api/ticketAPI";

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "FIXED", label: "Fixed" },
  { value: "CLOSED", label: "Closed" },
];

const STATUS_COLORS = {
  OPEN: "bg-red-100 text-red-700 border-red-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700 border-yellow-300",
  FIXED: "bg-green-100 text-green-700 border-green-300",
  CLOSED: "bg-gray-100 text-gray-700 border-gray-300",
};

const STATUS_TRANSITIONS = {
  OPEN: ["IN_PROGRESS", "FIXED", "CLOSED"],
  IN_PROGRESS: ["OPEN", "FIXED", "CLOSED"],
  FIXED: ["IN_PROGRESS", "CLOSED", "OPEN"],
  CLOSED: ["OPEN", "IN_PROGRESS"],
};

const ADMIN_STATUS_TRANSITIONS = {
  OPEN: ["IN_PROGRESS", "FIXED", "CLOSED"],
  IN_PROGRESS: ["OPEN", "FIXED", "CLOSED"],
  FIXED: ["OPEN", "IN_PROGRESS", "CLOSED"],
  CLOSED: ["OPEN", "IN_PROGRESS", "FIXED"],
};

function TicketManagement({
  ticket,
  onUpdateTicket,
  currentUser,
  isAdmin,
  ticketId,
}) {
  const [state, setState] = useState({
    isEditing: false,
    selectedAssignee: "",
    selectedAssigneeEmpId: "",
    departmentEmployees: [],
    loading: false,
    error: "",
    showStatusDropdown: false,
  });

  // Derived state for better readability
  const isAssignedToCurrentUser = 
    currentUser?.empId && ticket?.assignee === currentUser.empId;
  
  const isTicketCreatedByCurrentUser = 
    currentUser?.empId && ticket?.empId === currentUser.empId;
  
  const canAssignToSelf = 
    !isAdmin && 
    !isTicketCreatedByCurrentUser && 
    !ticket?.assignee;
  
  const canModifyStatus = isAdmin || isAssignedToCurrentUser;
  const isTicketAssigned = Boolean(ticket?.assignee);

  // Memoized update function to prevent unnecessary re-renders
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setError = useCallback((error) => {
    updateState({ error: typeof error === 'string' ? error : error.message || 'An error occurred' });
  }, [updateState]);

  const setLoading = useCallback((loading) => {
    updateState({ loading });
  }, [updateState]);

  useEffect(() => {
    if (isAdmin && ticket?.department) {
      fetchDepartmentEmployees();
    }
  }, [isAdmin, ticket?.department]);

  const fetchDepartmentEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      
      const employees = await adminAPI.getEmployees();
      
      const filteredEmployees = ticket?.department
        ? employees.filter(emp => emp.department === ticket.department)
        : employees;

      updateState({ 
        departmentEmployees: filteredEmployees || [],
        error: ""
      });
    } catch (error) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const updateTicketState = (updates) => {
    const updatedTicket = { ...ticket, ...updates };
    onUpdateTicket(updatedTicket);
  };

  const handleAssignToMe = async () => {
    if (!currentUser?.empId) {
      setError("User information not available");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const apiCall = isAdmin 
        ? () => ticketAPI.updateTicketAssignee(ticketId, currentUser.empId)
        : () => ticketAPI.assignToMe(ticket.ticketNo || ticketId);

      await apiCall();

      updateTicketState({
        assignee: currentUser.empId,
        status: "IN_PROGRESS",
      });

    } catch (error) {
      setError("Failed to assign ticket to yourself");
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    if (!isAdmin && !isAssignedToCurrentUser) {
      setError("You don't have permission to unassign this ticket");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (ticketAPI.unassignTicket) {
        await ticketAPI.unassignTicket(ticket.ticketNo || ticketId);
      } else {
        await ticketAPI.updateTicketAssignee(ticketId, null);
      }

      updateTicketState({
        assignee: null,
        status: "OPEN",
      });

    } catch (error) {
      setError("Failed to unassign ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAssignment = async () => {
    if (!state.selectedAssigneeEmpId) {
      setError("Please select an employee");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await ticketAPI.updateTicketAssignee(ticketId, state.selectedAssigneeEmpId);

      updateTicketState({
        assignee: state.selectedAssigneeEmpId,
        status: "IN_PROGRESS",
      });

      // Reset form
      updateState({
        isEditing: false,
        selectedAssignee: "",
        selectedAssigneeEmpId: "",
      });

    } catch (error) {
      setError("Failed to assign ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      setError("");

      await ticketAPI.updateTicketStatus(
        ticket.ticketNo || ticketId,
        newStatus
      );

      updateTicketState({ status: newStatus });
      updateState({ showStatusDropdown: false });

    } catch (error) {
      setError(`Failed to update ticket status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStatusOptions = () => {
    if (!canModifyStatus || !ticket?.status) return [];

    const currentStatus = ticket.status;
    const transitions = isAdmin 
      ? ADMIN_STATUS_TRANSITIONS[currentStatus] 
      : STATUS_TRANSITIONS[currentStatus];

    if (!transitions) return [];

    return STATUS_OPTIONS.filter(option => 
      transitions.includes(option.value) && option.value !== currentStatus
    );
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.OPEN;
  };

  const getAssigneeName = () => {
    if (!ticket?.assignee) return null;

    if (isAdmin && state.departmentEmployees.length > 0) {
      const assignedEmployee = state.departmentEmployees.find(
        emp => emp.empId === ticket.assignee
      );
      if (assignedEmployee) return assignedEmployee.name;
    }

    if (ticket.assignee === currentUser?.empId && currentUser?.name) {
      return currentUser.name;
    }

    return ticket.assignee;
  };

  const renderAssignmentSection = () => {
    if (isTicketAssigned) {
      const assigneeName = getAssigneeName();
      const canUnassign = isAdmin || isAssignedToCurrentUser;

      return (
        <div className="flex items-center gap-2">
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 flex-1 ${
            isAssignedToCurrentUser 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              : 'bg-green-100 text-green-700 border-2 border-green-300'
          }`}>
            <CheckCircle className="w-4 h-4" />
            <span>
              {isAssignedToCurrentUser 
                ? `Assigned to you (${assigneeName})`
                : `Assigned to ${assigneeName}`
              }
            </span>
          </div>
          
          {canUnassign && (
            <button
              onClick={handleUnassign}
              disabled={state.loading}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-300 disabled:opacity-50 transition-colors"
              title="Unassign ticket"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    if (isAdmin) {
      return (
        <div className="grid gap-3">
          <button
            onClick={handleAssignToMe}
            disabled={state.loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            {state.loading ? "Assigning..." : "Assign to Myself"}
          </button>

          <button
            onClick={() => updateState({ isEditing: true })}
            disabled={state.loading}
            className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Assign to Employee
          </button>
        </div>
      );
    }

    if (isTicketCreatedByCurrentUser) {
      return (
        <div className="px-4 py-2 bg-yellow-100 text-yellow-700 border-2 border-yellow-300 rounded-lg text-center text-sm">
          You cannot assign tickets created by you
        </div>
      );
    }

    if (canAssignToSelf) {
      return (
        <button
          onClick={handleAssignToMe}
          disabled={state.loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4" />
          {state.loading ? "Assigning..." : "Assign to Me"}
        </button>
      );
    }

    return (
      <div className="px-4 py-2 bg-gray-100 text-gray-600 border-2 border-gray-300 rounded-lg text-center text-sm">
        Ticket is unassigned
      </div>
    );
  };

  const renderStatusSection = () => {
    const availableOptions = getAvailableStatusOptions();
    if (!canModifyStatus || availableOptions.length === 0) return null;

    return (
      <div className="relative">
        <button
          onClick={() => updateState({ showStatusDropdown: !state.showStatusDropdown })}
          disabled={state.loading}
          className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 transition-colors flex items-center justify-between gap-2"
        >
          <span className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Update Status
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              state.showStatusDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {state.showStatusDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => updateState({ showStatusDropdown: false })}
            />
            
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
              {availableOptions.map((statusOption) => (
                <button
                  key={statusOption.value}
                  onClick={() => handleStatusUpdate(statusOption.value)}
                  disabled={state.loading}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:bg-gray-50 transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  {state.loading ? "Updating..." : `Mark as ${statusOption.label}`}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const handleCancelEdit = () => {
    updateState({
      isEditing: false,
      selectedAssignee: "",
      selectedAssigneeEmpId: "",
      error: "",
    });
  };

  const handleEmployeeSelect = (empId) => {
    const selectedEmployee = state.departmentEmployees.find(emp => emp.empId === empId);
    updateState({
      selectedAssigneeEmpId: empId,
      selectedAssignee: selectedEmployee?.name || "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Ticket Management
      </h3>

      {state.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-sm">{state.error}</span>
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {!state.isEditing ? (
        <div className="grid gap-4">
          {renderAssignmentSection()}
          {renderStatusSection()}

          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="grid gap-2">
              <div>
                <span className="text-sm text-gray-600">Assignment: </span>
                <span className="font-medium text-gray-800">
                  {ticket?.assignee ? `${getAssigneeName()}` : "Unassigned"}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status: </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket?.status)}`}>
                  {ticket?.status?.toLowerCase().replace("_", " ") || "Open"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Employee 
              {ticket?.department && (
                <span className="text-gray-500"> (Department: {ticket.department})</span>
              )}:
            </label>
            <select
              value={state.selectedAssigneeEmpId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={state.loading}
            >
              <option value="">Select Employee</option>
              {state.departmentEmployees.map((employee) => (
                <option key={employee.empId} value={employee.empId}>
                  {employee.name} ({employee.empId})
                  {employee.empId === currentUser?.empId ? " - Me" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdminAssignment}
              disabled={state.loading || !state.selectedAssigneeEmpId}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {state.loading ? "Assigning..." : "Assign"}
            </button>
            
            <button
              onClick={handleCancelEdit}
              disabled={state.loading}
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