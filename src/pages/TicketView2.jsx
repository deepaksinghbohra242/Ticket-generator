import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MessageCircle,
  Send,
  Edit3,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ticketAPI } from "../api/ticketAPI";
import { adminAPI } from "../api/adminAPI";

function TicketView() {
  const { user, isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = user;
  
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [departmentUsers, setDepartmentUsers] = useState([]);
  
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: "OPEN", label: "Open" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch ticket data
        let ticketData;
        if (isAdmin) {
          ticketData = await ticketAPI.getTicket(id);
        } else {
          ticketData = await ticketAPI.getUserTicket(id);
        }

        if (ticketData) {
          setTicket(ticketData);
          setSelectedAssignee(ticketData.assignee || "");
          setSelectedStatus(ticketData.status || "OPEN");
          
          // Fetch comments if available
          if (ticketData.comments) {
            setComments(ticketData.comments);
          }
        }

        // Fetch users list for admin assignment
        if (isAdmin) {
          try {
            const usersData = await adminAPI.getEmployees();
            setUsers(usersData || []);
            
            if (ticketData?.department && usersData) {
              const filteredUsers = usersData.filter(user => 
                user.department === ticketData.department
              );
              setDepartmentUsers(filteredUsers);
            } else {
              setDepartmentUsers(usersData || []);
            }
          } catch (usersError) {
            console.warn("Failed to fetch users:", usersError);
          }
        }

      } catch (error) {
        console.error("Failed to fetch ticket data:", error);
        setError("Failed to load ticket details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAdmin]);

  const handleCommentSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData = {
        message: newComment,
        ticketId: id,
      };

      const newCommentResponse = await ticketAPI.addComment(id, commentData);
      
      if (newCommentResponse) {
        setComments([...comments, newCommentResponse]);
      } else {
        const comment = {
          id: Date.now(),
          author: currentUser?.name || "Current User",
          message: newComment,
          timestamp: new Date().toISOString(),
          isAdmin: isAdmin,
        };
        setComments([...comments, comment]);
      }
      
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleAssignToMe = async () => {
    try {
      const updatedTicket = {
        ...ticket,
        assignee: currentUser?.name || "Current User",
        status: "ASSIGNED", // Update status to ASSIGNED
      };

      await ticketAPI.updateTicket(id, updatedTicket);
      setTicket(updatedTicket);
      setSelectedAssignee(currentUser?.name || "Current User");
      setSelectedStatus("ASSIGNED");
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    }
  };

  const handleAdminAssignment = async () => {
    try {
      const updatedTicket = {
        ...ticket,
        assignee: selectedAssignee,
        status: selectedAssignee ? "ASSIGNED" : "OPEN", // Set to ASSIGNED if assignee selected, OPEN if unassigned
      };

      await ticketAPI.updateTicket(id, updatedTicket);
      setTicket(updatedTicket);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedTicket = {
        ...ticket,
        assignee: selectedAssignee,
        status: selectedStatus,
      };

      await ticketAPI.updateTicket(id, updatedTicket);
      setTicket(updatedTicket);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const canModifyTicket = isAdmin || (currentUser && ticket && currentUser.name === ticket.assignee);
  const isAssignedToCurrentUser = currentUser && ticket && currentUser.name === ticket.assignee;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ticket not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b p-2">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Ticket #{ticket.ticketNo?.toString().padStart(5, "0") || "N/A"}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Ticket Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Ticket Information Card */}
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

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Comments ({comments.length})
                </h3>
              </div>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        comment.isAdmin
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {comment.author}
                          </span>
                          {comment.isAdmin && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : ""}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <div className="border-t pt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows="3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                          handleCommentSubmit(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="self-end px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Management */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Ticket Management
              </h3>

              {!isEditing ? (
                <div className="grid gap-4">
                  {/* For regular users - Assign to Me button */}
                  {!isAdmin && (
                    <button
                      onClick={handleAssignToMe}
                      disabled={isAssignedToCurrentUser}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        isAssignedToCurrentUser
                          ? "bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      {isAssignedToCurrentUser ? "Assigned" : "Assign to Me"}
                    </button>
                  )}

                  {/* For admin - Assignment and editing options */}
                  {isAdmin && (
                    <div className="grid gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Assign Ticket
                      </button>
                      {canModifyTicket && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Status
                        </button>
                      )}
                    </div>
                  )}

                  {/* Current Assignment Status */}
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Current Status:</div>
                    <div className="font-medium text-gray-800">
                      {ticket.assignee ? `Assigned to ${ticket.assignee}` : "Unassigned"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Status: <span className="font-medium">{ticket.status?.replace("_", " ") || "Open"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {/* Admin Assignment Dropdown */}
                  {isAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign to (Department: {ticket.department || "All"}):
                      </label>
                      <select
                        value={selectedAssignee}
                        onChange={(e) => setSelectedAssignee(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Unassigned</option>
                        {departmentUsers.map((user) => (
                          <option key={user.id} value={user.name}>
                            {user.name} {user.empId && `(${user.empId})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Status Dropdown - only for assigned tickets or admin */}
                  {(canModifyTicket || isAdmin) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status:
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={isAdmin && !canModifyTicket ? handleAdminAssignment : handleSaveChanges}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedAssignee(ticket.assignee || "");
                        setSelectedStatus(ticket.status || "OPEN");
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketView;