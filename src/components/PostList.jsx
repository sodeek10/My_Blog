// src/components/PostList.jsx
import { useEffect, useState } from "react";
import { useBlog } from "../context/BlogContext";
import PostCard from "./PostCard";
import LoadingSkeleton from "./LoadingSkeleton";

export default function PostList({ filter = "all" }) {
  const { posts, loading, error } = useBlog();
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Apply filter when posts or filter changes
  useEffect(() => {
    if (filter === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.status === filter));
    }
  }, [posts, filter]);

  if (loading) return <LoadingSkeleton count={3} />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-center py-12 text-gray-500">
          No posts found. {filter !== "all" && "Try changing your filters."}
        </div>
      )}
    </div>
  );
}
