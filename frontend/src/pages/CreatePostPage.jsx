import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import styles from '../styles/CreatePostPage.module.css';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) formData.append('image', image);

    try {
      const { data } = await API.post('/posts', formData);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>✍️ Write a New Post</h2>
      <p className={styles.subtitle}>Share your gaming adventures with the community</p>
      
      {error && <p className={styles.errorMsg}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an attention-grabbing title..."
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Post Content</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post content here..."
            rows="10"
            required
          />
        </div>
        
        {user?.role === 'admin' && (
          <div className={styles.formGroup}>
            <label>Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        )}
        
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Publishing...' : '🚀 Publish Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;