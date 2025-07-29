import React, { useState } from "react";
import { MessageCircle, Calendar, User, Tag, Clock, Trash2, CheckCircle } from "lucide-react";
import ChatPage from "./ChatPage";

function Card({ ticket, type }) {
  const [showChat, setShowChat] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assigned': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'deleted': return <Trash2 className="w-5 h-5 text-red-600" />;
      case 'raised': return <Tag className="w-5 h-5 text-green-600" />;
      default: return <Tag className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeTitle = (type) => {
    switch (type) {
      case 'assigned': return 'Assigned Ticket';
      case 'deleted': return 'Deleted Ticket';
      case 'raised': return 'Raised Ticket';
      default: return 'Ticket';
    }
  };

  if (showChat) {
    return <ChatPage ticket={ticket} onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getTypeIcon(type)}
            <h3 className="font-semibold text-gray-800">{getTypeTitle(type)}</h3>
          </div>
          <span className="text-lg font-bold text-indigo-600">{ticket.id}</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
          {ticket.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority} Priority
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Tag className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Department</span>
            <p className="font-medium text-gray-800">{ticket.department}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Description</span>
          <p className="text-gray-700 text-sm leading-relaxed">{ticket.description}</p>
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-100">
          {type === "assigned" && (
            <>
              {ticket.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {ticket.createdBy && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Created by: {ticket.createdBy}</span>
                </div>
              )}
            </>
          )}

          {type === "deleted" && (
            <>
              {ticket.deletedOn && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Deleted: {new Date(ticket.deletedOn).toLocaleDateString()}</span>
                </div>
              )}
              {ticket.deletedBy && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Deleted by: {ticket.deletedBy}</span>
                </div>
              )}
            </>
          )}

          {type === "raised" && (
            <>
              {ticket.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {ticket.assignee && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Assigned to: {ticket.assignee}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {type !== "deleted" && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setShowChat(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            Open Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default Card;
