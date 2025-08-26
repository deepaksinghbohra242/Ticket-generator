import React from "react";

function CommentItem({ comment }) {
  const author = comment.senderName || comment.author || "Unknown User";
  const message = comment.message;
  const timestamp = comment.sentAt || comment.timestamp;
  const isAdmin = comment.isAdmin || (comment.senderName && comment.senderName.toLowerCase().includes('admin'));
  
  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${
        isAdmin
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">
            {author}
          </span>
          {isAdmin && (
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {timestamp ? new Date(timestamp).toLocaleString() : ""}
        </span>
      </div>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}

export default CommentItem;
