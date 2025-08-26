import React, { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { ticketAPI } from "../../api/ticketAPI";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

function CommentsSection({ 
  ticketId, 
  currentUser, 
  isAdmin,
  ticketDetails,
}) {
  const assignedUser = ticketDetails?.assignee || null;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canComment = isAdmin || (ticketDetails?.empId === currentUser?.empId) || (assignedUser === currentUser?.empId);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await ticketAPI.getCommentForTicket(ticketId);
        
        const sortedComments = (fetchedComments || []).sort((a, b) => {
          const timeA = new Date(a.sentAt || a.timestamp);
          const timeB = new Date(b.sentAt || b.timestamp);
          return timeA - timeB;
        });
        
        setComments(sortedComments);
        setError(null);
      } catch (err) {
        setError("Failed to load comments");
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  const handleCommentSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const message = newComment;

      const response = await ticketAPI.sendTicket(ticketId, message);
      
      if (response) {
        const updatedComments = await ticketAPI.getCommentForTicket(ticketId);
        const sortedComments = (updatedComments || []).sort((a, b) => {
          const timeA = new Date(a.sentAt || a.timestamp);
          const timeB = new Date(b.sentAt || b.timestamp);
          return timeA - timeB;
        });
        setComments(sortedComments);
      } else {
        const fallbackComment = {
          id: Date.now(),
          senderName: currentUser?.name || "Current User",
          senderId: currentUser?.empId || currentUser?.id,
          message: newComment,
          sentAt: new Date().toISOString(),
          isAdmin: isAdmin,
          ticketNo: ticketId,
        };
        setComments(prev => [...prev, fallbackComment]);
      }
      
      setNewComment("");
    } catch (error) {
      setError("Failed to send comment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Comments ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-gray-400 text-sm">Be the first to add a comment!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <CommentItem key={comment.id || index} comment={comment} />
          ))
        )}
      </div>

      {canComment ? (
        <CommentForm
          newComment={newComment}
          onCommentChange={setNewComment}
          onSubmit={handleCommentSubmit}
        />
      ) : (
        <div className="border-t pt-4">
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Comments are restricted</p>
            <p className="text-gray-400 text-sm">
              Only admins and assigned users can add comments
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentsSection