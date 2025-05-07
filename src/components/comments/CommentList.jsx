// CommentList.jsx
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
    });

    return unsubscribe;
  }, [postId]);

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border p-4 rounded-lg">
          <p>{comment.text}</p>
          <span className="text-sm text-gray-500">
            By {comment.author} •{" "}
            {new Date(comment.createdAt?.toDate()).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
