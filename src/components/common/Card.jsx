import React, { useState } from "react";

function Card({ ticket, type }) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg border shadow bg-white">
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
        🧾 Ticket Details
      </h2>

      <div className="text-sm text-gray-700 space-y-2">
        {"id" in ticket && (
          <div>
            <strong>ID:</strong> {ticket.id}
          </div>
        )}

        {"status" in ticket && (
          <div>
            <strong>Status:</strong> {ticket.status}
          </div>
        )}

        {"department" in ticket && (
          <div>
            <strong>Department:</strong> {ticket.department}
          </div>
        )}

        {"description" in ticket && (
          <div>
            <strong>Description:</strong> {ticket.description}
          </div>
        )}

        {type === "assigned" && ticket.createdAt && (
          <div>
            <strong>Created At:</strong> {ticket.createdAt}
          </div>
        )}

        {type === "assigned" && ticket.createdBy && (
          <div>
            <strong>Created By:</strong> {ticket.createdBy}
          </div>
        )}

        {type === "deleted" && ticket.deletedOn && (
          <div>
            <strong>Deleted On:</strong> {ticket.deletedOn}
          </div>
        )}

        {type === "raised" && ticket.createdAt && (
          <div>
            <strong>Created At:</strong> {ticket.createdAt}
          </div>
        )}

        {type === "raised" && ticket.assignee && (
          <div>
            <strong>Assignee:</strong> {ticket.assignee}
          </div>
        )}
      </div>

      {/* Message section shown only if type !== 'deleted' */}
      {type !== "deleted" && (
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">💬 Message Box</label>
          <textarea
            rows="3"
            placeholder="Type your message..."
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={handleSendMessage}
            className="mt-2 w-full sm:w-auto bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default Card;
