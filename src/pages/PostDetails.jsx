// src/pages/PostDetails.jsx
import { useParams } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import { PostCategoriesDisplay } from "../components/PostCategories";
import { Link } from "react-router-dom";
import CommentForm from "../components/comments/CommentForm";
import { useEffect, useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/Config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export default function PostDetails() {
  const { postId } = useParams();
  const { posts, loading, error } = useBlog();
  const { currentUser } = useAuth();
  const [commentCount, setCommentCount] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [comments, setComments] = useState([]);

  const post = posts.find((p) => p.id === postId);

  useEffect(() => {
    if (!postId) return;

    const postRef = doc(db, "posts", postId);
    const unsubscribe = onSnapshot(postRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const postData = docSnapshot.data();
        setCommentCount(postData.commentCount || 0);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [postId]);

  // Replace your current fetchComments useEffect with this:
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        setCommentsError("");

        console.log("Fetching comments for postId:", postId); // Debug log

        const commentsRef = collection(db, "comments");
        const q = query(
          commentsRef,
          where("postId", "==", postId),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        console.log("Found comments:", querySnapshot.size); // Debug log

        const commentsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Raw comment data:", data); // Debug log

          // Convert Firestore Timestamp to Date
          let createdAtDate;
          try {
            createdAtDate = data.createdAt?.toDate();
          } catch (e) {
            console.warn("Invalid timestamp, using current date");
            createdAtDate = new Date();
          }

          return {
            id: doc.id,
            content: data.text || data.content || "", // Handle both field names
            author: data.author || "Anonymous",
            authorPhotoURL:
              data.authorPhotoURL || "https://via.placeholder.com/40",
            createdAt: createdAtDate,
            userId: data.userId,
          };
        });

        setComments(commentsData);
      } catch (err) {
        console.error("Detailed fetch error:", err); // More detailed error log
        setCommentsError("Failed to load comments. Please refresh the page.");
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    } else {
      setCommentsError("Missing post ID");
    }
  }, [postId]);
  const handleCommentAdded = async (newComment) => {
    try {
      // Update comment count in the post document
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentCount: increment(1),
      });
      setCommentCount((prev) => prev - 1);
      // Add the new comment to local state
      setComments((prev) => [
        newComment,
        ...prev,
        {
          ...newComment,
          id: Date.now().toString(), // temporary ID
          createdAt: new Date(),
          author: currentUser.displayName || "Anonymous",
          authorPhotoURL:
            currentUser.photoURL || "https://via.placeholder.com/40",
        },
      ]);
    } catch (err) {
      console.error("Error updating comment count:", err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading post...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!post) return <div className="text-center py-8">Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          &larr; Back to all posts
        </Link>

        <article className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Posted by {post.author || "Anonymous"}</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(post.createdAt?.toDate()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="mb-6">
              <PostCategoriesDisplay categories={post.categories} />
            </div>
          )}

          <div className="prose max-w-none text-gray-700">
            {post.content.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">
            Comments ({commentCount})
          </h2>
          {/* Comment List Section */}
          {commentsLoading ? (
            <div className="text-center py-4">Loading comments...</div>
          ) : commentsError ? (
            <div className="text-red-500 text-center py-4">{commentsError}</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.authorPhotoURL}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-700">
                          {comment.author}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {/* Use both text and content for compatibility */}
                      <p className="mt-1 text-gray-600">
                        {comment.text || comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Comment Form - Only show if user is logged in */}
          {currentUser ? (
            <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
          ) : (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">
                Please{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  log in
                </Link>{" "}
                to post a comment
              </p>
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
