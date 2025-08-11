import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { ticketAPI } from "../../api/ticketAPI";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

function CommentsSection({ 
  comments, 
  onUpdateComments, 
  ticketId, 
  currentUser, 
  isAdmin 
}) {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData = {
        message: newComment,
        ticketId: ticketId,
      };

      const newCommentResponse = await ticketAPI.addComment(ticketId, commentData);
      
      if (newCommentResponse) {
        onUpdateComments([...comments, newCommentResponse]);
      } else {
        const comment = {
          id: Date.now(),
          author: currentUser?.name || "Current User",
          message: newComment,
          timestamp: new Date().toISOString(),
          isAdmin: isAdmin,
        };
        onUpdateComments([...comments, comment]);
      }
      
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
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
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>

      <CommentForm
        newComment={newComment}
        onCommentChange={setNewComment}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
}

export default CommentsSection;