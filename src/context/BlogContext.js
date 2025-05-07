// src/context/BlogContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/Config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  getDocs,
  where,
} from "firebase/firestore";

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts initially and set up real-time listener
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Query for published posts ordered by creation date
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(postsData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Create a new post
  const createPost = async (postData) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        ...postData,
        createdAt: new Date(),
        author: postData.author || "Anonymous",
        likes: 0,
        comments: [],
        status: "published", // can be 'draft' or 'published'
      });
      return docRef.id;
    } catch (err) {
      throw new Error("Failed to create post: " + err.message);
    }
  };
  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      //  Also delete associated comments
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      commentsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      throw new Error("Failed to delete post: " + error.message);
    }
  };

  const value = {
    posts,
    loading,
    error,
    createPost,
    deletePost,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
