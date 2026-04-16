import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styles from '../styles/SplashPage.module.css';

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <div className={styles.splashContent}>
        <div className={styles.splashLogo}>🎮</div>
        <h1>Gaming Passion</h1>
        <div className={styles.splashSpinner}></div>
        <button className={styles.splashButton} onClick={() => navigate('/home')}>
          Enter Now
        </button>
      </div>
    </div>
  );
}

export default SplashPage;