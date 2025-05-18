// src/components/comments/CommentList.jsx
import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/Config";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [postId]);

  if (loading)
    return <div className="text-center py-4">Loading comments...</div>;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="border p-4 rounded-lg">
            <p className="text-gray-800">{comment.text}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span>By {comment.author}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(comment.createdAt?.toDate()).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
