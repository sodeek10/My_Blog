// src/components/posts/DeletePostButton.jsx
import { useState } from "react";
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/Config";

export default function DeletePostButton({ postId, isAnonymous }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isAnonymous) {
      // For anonymous posts, verify using localStorage token
      const token = localStorage.getItem(`post_${postId}_token`);
      if (!token) {
        alert(
          "You can only delete this post from the same browser it was created on."
        );
        return;
      }
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this post and all its comments?"
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      // Delete comments linked to this post
      const commentsRef = collection(db, "comments");
      const q = query(commentsRef, where("postId", "==", postId));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "comments", docSnap.id))
      );
      await Promise.all(deletePromises);

      // Delete the post itself
      await deleteDoc(doc(db, "posts", postId));

      // Remove the anonymous token if it exists
      if (isAnonymous) {
        localStorage.removeItem(`post_${postId}_token`);
      }

      alert("Post and related comments deleted successfully.");
    } catch (error) {
      console.error("Failed to delete post or comments:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-1 rounded-full ${
        isDeleting ? "text-gray-400" : "text-red-500 hover:bg-red-100"
      }`}
      title="Delete post"
    >
      {isDeleting ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  );
}
