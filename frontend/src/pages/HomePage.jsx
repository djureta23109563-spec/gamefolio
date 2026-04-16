import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading posts...</div>;
  }

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h2>Welcome to My Gaming World{user ? `, ${user.name}!` : '!'}</h2>
        <p>Gaming Passion is a personal portfolio showcasing my journey from casual gaming to competitive play and esports enthusiasm.</p>
      </section>

      <section className={styles.features}>
        <h3>Latest Blog Posts</h3>
        {posts.length === 0 ? (
          <div className={styles.noPosts}>
            <p>No posts yet. Be the first to write one!</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map(post => (
              <div key={post._id} className={styles.postCard}>
                {post.image && (
                  <img 
                    src={`https://gamefolio-7i5e.onrender.com/uploads/${post.image}`}
                    alt={post.title}
                    className={styles.postCardImage}
                  />
                )}
                <h3>{post.title}</h3>
                <p className={styles.postExcerpt}>
                  {post.body.substring(0, 150)}...
                </p>
                <div className={styles.postMeta}>
                  By {post.author?.name} on {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <Link to={`/posts/${post._id}`}>Read More →</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.previews}>
        <div className={styles.previewBox}>
          <h3>Explore My Journey</h3>
          <p>Discover how gaming became my passion and shaped my skills.</p>
        </div>
        <div className={styles.previewBox}>
          <h3>Join the Community</h3>
          <p>Register to get gaming updates, tips, and exclusive content.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Contact: gaming@email.com</p>
        <p>© 2026 Gaming Passion</p>
      </footer>
    </main>
  );
}

export default HomePage;