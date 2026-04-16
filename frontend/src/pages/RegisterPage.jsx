import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import styles from '../styles/RegisterPage.module.css';

function RegisterPage() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    birthday: '',
    skillLevel: '',
    agreeToPolicy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    setError('');
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
    } else if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  };

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Age validation
    if (!form.birthday) {
      setError('Please enter your birthday');
      return;
    }

    const age = calculateAge(form.birthday);
    if (age < 13) {
      setError('You must be at least 13 years old to register');
      return;
    }

    // Skill level validation
    if (!form.skillLevel) {
      setError('Please select your gaming experience level');
      return;
    }

    // Policy agreement validation
    if (!form.agreeToPolicy) {
      setError('You must agree to the terms and policy');
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setLoading(false);
    }
  };

  const hasMinLength = form.password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>
              Join the <span>Gaming</span>
            </h2>
            <p>Become part of our gaming community</p>
            <div className={styles.gameEmoji}>🎮 🕹️ 👾</div>
          </div>

          <div className={styles.formContainer}>
            {error && (
              <div className={styles.errorMsg}>
                <span>❌</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  name='name'
                  type='text'
                  placeholder='Full name'
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}>📧</span>
                <input
                  name='email'
                  type='email'
                  placeholder='Email address'
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}>🎂</span>
                <input
                  name='birthday'
                  type='date'
                  value={form.birthday}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.dateInput}`}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}>🔒</span>
                <div className={styles.passwordWrapper}>
                  <input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password (min 6 characters)'
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.passwordInput}`}
                  />
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility} 
                    className={styles.eyeButton}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {form.password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBar}>
                    <div 
                      className={`${styles.strengthFill} ${styles[passwordStrength]}`}
                    ></div>
                  </div>
                  <span className={styles.strengthText}>
                    {getStrengthText()}
                  </span>
                </div>
              )}

              {form.password && (
                <ul className={styles.passwordRequirements}>
                  <li className={hasMinLength ? styles.valid : styles.invalid}>
                    <span className={styles.requirementIcon}>
                      {hasMinLength ? '✅' : '○'}
                    </span>
                    At least 6 characters
                  </li>
                  <li className={hasLetter ? styles.valid : styles.invalid}>
                    <span className={styles.requirementIcon}>
                      {hasLetter ? '✅' : '○'}
                    </span>
                    Contains a letter
                  </li>
                  <li className={hasNumber ? styles.valid : styles.invalid}>
                    <span className={styles.requirementIcon}>
                      {hasNumber ? '✅' : '○'}
                    </span>
                    Contains a number
                  </li>
                </ul>
              )}

              {/* Gaming Skill Level Selection */}
              <div className={styles.skillSection}>
                <label className={styles.skillLabel}>
                  <span className={styles.skillIcon}>🎮</span>
                  Gaming Experience Level
                </label>
                <div className={styles.skillOptions}>
                  <label className={`${styles.skillOption} ${form.skillLevel === 'beginner' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="skillLevel"
                      value="beginner"
                      checked={form.skillLevel === 'beginner'}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioEmoji}>🐣</span>
                    <span className={styles.radioLabel}>Beginner</span>
                    <span className={styles.radioDesc}>New to gaming</span>
                  </label>

                  <label className={`${styles.skillOption} ${form.skillLevel === 'intermediate' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="skillLevel"
                      value="intermediate"
                      checked={form.skillLevel === 'intermediate'}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioEmoji}>🎮</span>
                    <span className={styles.radioLabel}>Intermediate</span>
                    <span className={styles.radioDesc}>Experienced gamer</span>
                  </label>

                  <label className={`${styles.skillOption} ${form.skillLevel === 'expert' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="skillLevel"
                      value="expert"
                      checked={form.skillLevel === 'expert'}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioEmoji}>🏆</span>
                    <span className={styles.radioLabel}>Expert</span>
                    <span className={styles.radioDesc}>Pro/Competitive</span>
                  </label>
                </div>
              </div>

              {/* Policy Agreement */}
              <label className={styles.policyCheckbox}>
                <input
                  type="checkbox"
                  name="agreeToPolicy"
                  checked={form.agreeToPolicy}
                  onChange={handleChange}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxEmoji}>
                  {form.agreeToPolicy ? '✅' : '📜'}
                </span>
                <span className={styles.checkboxText}>
                  I agree to the <Link to="/terms" className={styles.policyLink}>Terms of Service</Link> and <Link to="/privacy" className={styles.policyLink}>Privacy Policy</Link>
                </span>
              </label>

              <button 
                type='submit' 
                className={styles.button}
                disabled={loading}
              >
                {loading ? (
                  <div className={styles.buttonContent}>
                    <div className={styles.spinner}></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className={styles.buttonContent}>
                    <span>Join the Gaming Community</span>
                    <span className={styles.buttonIcon}>🎮</span>
                  </div>
                )}
              </button>
            </form>

            <p className={styles.loginText}>
              Already have an account?
              <Link to='/login'> Sign in</Link>
            </p>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span>🎮</span> Create Posts
          </div>
          <div className={styles.feature}>
            <span>👥</span> Join Discussions
          </div>
          <div className={styles.feature}>
            <span>✨</span> Share Your Gaming Stories
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;