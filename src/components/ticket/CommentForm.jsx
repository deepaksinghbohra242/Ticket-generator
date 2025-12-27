import React from "react";
import { Send } from "lucide-react";

function CommentForm({ newComment, onCommentChange, onSubmit }) {
  return (
    <div className="border-t pt-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows="3"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                onSubmit(e);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Ctrl+Enter to send
          </p>
        </div>
        <button
          onClick={onSubmit}
          disabled={!newComment.trim()}
          className="self-end px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
