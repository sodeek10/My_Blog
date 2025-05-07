// src/pages/Home.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useBlog } from "../context/BlogContext";
import PostEditor from "../components/editor/PostEditor";
import PostCard from "../components/posts/PostCard";
import { Link } from "react-router-dom";

export default function Home() {
  const { currentUser } = useAuth();
  const { posts, loading, error } = useBlog();
  const [showEditor, setShowEditor] = useState(false);

  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Midel Solutions Blog
        </h1>
        <p className="text-xl text-gray-600">
          {currentUser
            ? `Welcome back, ${currentUser.email}!`
            : "Join our writing community"}
        </p>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Posts Room - 70% width on large screens */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recent Posts</h2>
            {currentUser && (
              <button
                onClick={() => setShowEditor(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Create Post
              </button>
            )}
          </div>

          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12 text-gray-500">
                No posts yet. Be the first to share!
              </div>
            )}
          </div>
        </div>

        {/* Editor/Sidebar - 30% width on large screens */}
        <div className="lg:w-1/4">
          {showEditor && currentUser ? (
            <div className="sticky top-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <PostEditor onClose={() => setShowEditor(false)} />
              <button
                onClick={() => setShowEditor(false)}
                className="mt-4 w-full text-gray-500 hover:text-gray-700"
              >
                Close Editor
              </button>
            </div>
          ) : (
            <div className="sticky top-4 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              {currentUser ? (
                <button
                  onClick={() => setShowEditor(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Write New Post
                </button>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="block w-full bg-blue-600 text-white py-2 rounded text-center hover:bg-blue-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full bg-gray-200 text-gray-800 py-2 rounded text-center hover:bg-gray-300 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-2">Community Stats</h4>
                <p className="text-sm text-gray-600">
                  {posts.length} {posts.length === 1 ? "post" : "posts"}{" "}
                  published
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
