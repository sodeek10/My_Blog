// src/components/PostEditor.jsx
import { useState } from "react";
import { useBlog } from "../../context/BlogContext";

export default function PostEditor({ onClose }) {
  const { createPost } = useBlog();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost({
        title,
        content,
        status: "published",
      });
      setTitle("");
      setContent("");
      onClose();
    } catch (err) {
      setError("Failed to create post: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Create New Post</h3>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div
      // className={`sticky top-4 bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ${
      //   showEditor ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      // }`}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Post title"
          required
        />
      </div>

      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[150px]"
          placeholder="Write your post here..."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publishing..." : "Publish Post"}
      </button>
    </form>
  );
}
