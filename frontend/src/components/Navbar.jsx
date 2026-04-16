import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  // Updated to Render backend URL
  const profilePicUrl = user?.profilePic 
    ? `https://gamefolio-7i5e.onrender.com/uploads/${user.profilePic}`
    : null;

  const getUserInitials = () => {
    if (!user?.name) return '👤';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <Link to="/home" onClick={() => setMobileMenuOpen(false)}>
            🎮 Gaming Passion
          </Link>
        </div>

        <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksActive : ''}`}>
          <Link to="/home" className={isActive('/home')} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className={isActive('/about')} onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className={isActive('/contact')} onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          
          {user ? (
            <>
              <Link to="/create-post" className={isActive('/create-post')} onClick={() => setMobileMenuOpen(false)}>
                Write Post
              </Link>
              <Link to="/profile" className={isActive('/profile')} onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={isActive('/admin')} onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')} onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className={isActive('/register')} onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
          
          <button onClick={toggleTheme} className={styles.themeToggleBtn}>
            <span className={styles.themeIcon}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {user && (
            <Link to="/profile" className={styles.profileLink}>
              {profilePicUrl ? (
                <img 
                  src={profilePicUrl} 
                  alt={user.name} 
                  className={styles.profileAvatar}
                  title={user.name}
                />
              ) : (
                <div className={styles.profileInitials} title={user.name}>
                  {getUserInitials()}
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;