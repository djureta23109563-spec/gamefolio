import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import styles from '../styles/ProfilePage.module.css';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Updated to Render backend URL
  const picSrc = user?.profilePic
    ? `https://gamefolio-7i5e.onrender.com/uploads/${user.profilePic}`
    : null;

  const getUserInitials = () => {
    if (!user?.name) return '🎮';
    return user.name.charAt(0).toUpperCase();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, GIF, WEBP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Max size is 5MB');
        return;
      }
      
      setProfilePic(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const { data } = await API.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(data);
      setMessage('Profile updated successfully!');
      setImagePreview('');
      setProfilePic(null);
      
      // Refresh the page after 1 second to show new profile pic
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await API.put('/auth/change-password', { currentPassword, newPassword });
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h2>My Profile</h2>
      </div>
      
      {message && <div className={styles.successMsg}>{message}</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.avatarSection}>
        {imagePreview || picSrc ? (
          <img 
            src={imagePreview || picSrc} 
            alt="Profile" 
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <span className={styles.avatarEmoji}>{getUserInitials()}</span>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h3>✏️ Edit Profile</h3>
        <form onSubmit={handleProfileUpdate}>
          <div className={styles.formGroup}>
            <label>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            <small className={styles.hint}>Upload a JPG, PNG, or GIF image (max 5MB)</small>
            {imagePreview && (
              <div className={styles.previewHint}>
                <small>New image selected. Click Save to update.</small>
              </div>
            )}
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : '💾 Save Profile'}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h3>🔒 Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className={styles.formGroup}>
            <label>Current Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className={styles.passwordInput}
              />
              <button 
                type="button" 
                onClick={toggleCurrentPassword} 
                className={styles.eyeButton}
              >
                {showCurrentPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>New Password (min 6 chars)</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength="6"
                className={styles.passwordInput}
              />
              <button 
                type="button" 
                onClick={toggleNewPassword} 
                className={styles.eyeButton}
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Changing...' : '🔑 Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;