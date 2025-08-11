import React from "react";

function CommentItem({ comment }) {
  return (
    <div
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
  );
}

export default CommentItem;
