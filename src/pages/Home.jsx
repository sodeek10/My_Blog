// src/pages/Home.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useBlog } from "../context/BlogContext";
// import PostCard from "../components/posts/PostCard";
import { Link, useNavigate } from "react-router-dom";
import {
  PostCategorySelector,
  PostCategoriesDisplay,
} from "../components/PostCategories";

export default function Home() {
  const { currentUser } = useAuth();
  const { posts, loading, error } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  // Filter posts based on search and categories
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategories =
      selectedCategories.length === 0 ||
      (post.categories &&
        selectedCategories.some((cat) => post.categories.includes(cat)));
    return matchesSearch && matchesCategories;
  });

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">MS BLOG</h1>
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
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold">Recent Posts</h2>

              <div className="flex gap-4 w-full sm:w-auto">
                {/* Search Input */}
                <div className="relative flex-grow sm:w-64">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2 text-gray-700">
                Filter by categories:
              </h3>
              <PostCategorySelector
                selected={selectedCategories}
                onChange={handleCategoryToggle}
              />
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post.id)}
                >
                  <h3 className="font-medium text-xl mb-2 hover:text-blue-600">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  {post.categories && post.categories.length > 0 && (
                    <PostCategoriesDisplay categories={post.categories} />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {posts.length === 0
                  ? "No posts yet. Be the first to share!"
                  : "No posts match your search criteria."}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - 30% width on large screens */}
        <div className="lg:w-1/4">
          {!currentUser ? (
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
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <Link
                to="/dashboard"
                className="block w-full bg-blue-600 text-white py-2 rounded text-center hover:bg-blue-700 transition mb-4"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium mb-2">Community Stats</h4>
            <p className="text-sm text-gray-600">
              {posts.length} {posts.length === 1 ? "post" : "posts"} published
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
