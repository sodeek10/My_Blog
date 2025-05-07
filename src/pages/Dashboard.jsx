// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useBlog } from "../context/BlogContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import DeletePostButton from "../components/posts/deletePostButton";
// import { query, collection, where, onSnapshot } from "firebase/firestore";
// import { db } from "../firebase/Config";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { posts, loading, error, createPost } = useBlog();
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLogoutLoading(false);
      setIsLogoutOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        title: newPostTitle,
        content: newPostContent,
        author: currentUser.email,
        createdAt: new Date(),
      });
      setNewPostTitle("");
      setNewPostContent("");
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Title</label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Content</label>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create Post
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.id} className="border p-4 rounded">
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.content}</p>
                  {currentUser.email === post.author && (
                    <DeletePostButton postId={post.id} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md mx-auto p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Confirm Logout
            </Dialog.Title>

            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Are you sure you want to logout from your account?
            </Dialog.Description>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                    Logging out...
                  </span>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
