// src/components/comments/CommentForm.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/Config";

export default function CommentForm({ postId }) {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await addDoc(collection(db, "comments"), {
        postId,
        text: commentText,
        author: currentUser.displayName || currentUser.email,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setCommentText("");
    } catch (err) {
      setError("Failed to post comment: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Add a comment</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Write your comment here..."
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
