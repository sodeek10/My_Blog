// Post.jsx
import { useParams } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";

export default function Post() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { getPost } = useBlog();
  const post = getPost(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <section className="mt-12">
        <h2>Comments ({post.comments?.length || 0})</h2>
        {currentUser && <CommentForm postId={id} />}
        <CommentList comments={post.comments} />
      </section>
    </article>
  );
}
