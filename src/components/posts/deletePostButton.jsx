// src/components/posts/deletePostButton.js
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/Config";

export default function DeletePostButton({ postId }) {
  const handleDelete = async () => {
    try {
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
      alert("Post and related comments deleted successfully.");
    } catch (error) {
      console.error("Failed to delete post or comments:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
    >
      Delete
    </button>
  );
}
