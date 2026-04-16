import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import styles from '../styles/PostPage.module.css';

function PostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await API.get(`/comments/${id}`);
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments');
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      setComments([...comments, data]);
      setCommentBody('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        navigate('/home');
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMsg}>{error}</div>
        <button onClick={() => navigate('/home')} className={styles.backBtn}>
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!post) return null;

  const imageUrl = post.image ? `https://gamefolio-7i5e.onrender.com/uploads/${post.image}` : null;
  const canEdit = user && (user._id === post.author?._id || user.role === 'admin');
  const canDelete = user && (user._id === post.author?._id || user.role === 'admin');

  return (
    <div className={styles.postPage}>
      <div className={styles.container}>
        <div className={styles.postHeader}>
          <button onClick={() => navigate('/home')} className={styles.backButton}>
            ← Back to Posts
          </button>
        </div>

        {imageUrl && (
          <div className={styles.coverImageContainer}>
            <img src={imageUrl} alt={post.title} className={styles.coverImage} />
          </div>
        )}

        <h1 className={styles.postTitle}>{post.title}</h1>

        <div className={styles.postMeta}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              {post.author?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{post.author?.name || 'Unknown Author'}</span>
              <span className={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
          
          {(canEdit || canDelete) && (
            <div className={styles.actionButtons}>
              {canEdit && (
                <button onClick={() => navigate(`/edit-post/${id}`)} className={styles.editBtn}>
                  ✏️ Edit Post
                </button>
              )}
              {canDelete && (
                <button onClick={handleDeletePost} className={styles.deleteBtn}>
                  🗑️ Delete Post
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.postContent}>
          {post.body.split('\n').map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>
            💬 Comments ({comments.length})
          </h3>
          
          {user ? (
            <form onSubmit={handleAddComment} className={styles.commentForm}>
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Share your thoughts..."
                rows="4"
                required
                className={styles.commentInput}
              />
              <button type="submit" className={styles.submitCommentBtn}>
                Post Comment
              </button>
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <p>Login to join the conversation</p>
              <button onClick={() => navigate('/login')} className={styles.loginBtn}>
                Login Now
              </button>
            </div>
          )}

          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <div className={styles.noComments}>
                <span>💭</span>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAuthor}>
                      <div className={styles.commentAvatar}>
                        {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className={styles.commentAuthorName}>
                          {comment.author?.name || 'Unknown User'}
                        </div>
                        <div className={styles.commentDate}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {(user && (user._id === comment.author?._id || user.role === 'admin')) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className={styles.deleteCommentBtn}
                        title="Delete Comment"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <p className={styles.commentBody}>{comment.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;