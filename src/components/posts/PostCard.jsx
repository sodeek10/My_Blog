// src/components/PostCard.jsx
import { Link } from "react-router-dom";
import { format } from "date-fns";
// import { useAuth } from "../../context/AuthContext";
// import DeletePostButton from "./deletePostButton";

export default function PostCard({ post }) {
  // const { currentUser } = useAuth();
  // const isAuthor = currentUser?.uid === post.authorId;
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="p-6">
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>By {post.author}</span>
          <span>
            {post.createdAt?.toDate
              ? format(post.createdAt.toDate(), "MMM d, yyyy")
              : "Unknown date"}
          </span>
        </div>
      </div>
      {/* <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            {isAuthor && (
              <div className="flex space-x-3">
                <DeletePostButton
                  postId={post.id}
                  onSuccess={() => window.location.reload()} // Or use a state update
                />
              </div>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}
