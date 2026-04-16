import { useState } from 'react';
import image4 from '../assets/image4.jpg';
import styles from '../styles/ContactPage.module.css';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <main className={styles.contactPage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1>🎮 Gaming Training Centers</h1>
          <p>Find the nearest gaming hub to level up your skills</p>
        </section>

        {/* Contact Form Section - FIRST */}
        <section className={styles.contactSection}>
          <div className={styles.formHeader}>
            <h2>📧 Send Us a Message</h2>
            <p>Have questions about our training programs? Reach out to us!</p>
          </div>
          
          {submitted ? (
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✅</span>
              <p>Thank you {formData.name}!</p>
              <p>We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="your@email.com"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  placeholder="Tell us about your gaming interests or questions..."
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                Send Message ✨
              </button>
            </form>
          )}
        </section>

        {/* Small Map Image with Border - SECOND */}
        <section className={styles.mapSection}>
          <h2 className={styles.mapTitle}>📍 Our Training Locations</h2>
          <div className={styles.mapContainer}>
            <img 
              src={image4} 
              alt="Gaming Training Locations Map" 
              className={styles.mapImage}
            />
            <div className={styles.mapOverlay}>
              <div className={styles.locationsList}>
                <span>🇵🇭 Manila</span>
                <span>🏝️ Cebu</span>
                <span>🌴 Davao</span>
                <span>🏔️ Baguio</span>
                <span>🎮 Iloilo</span>
                <span>⚡ Pampanga</span>
              </div>
            </div>
          </div>
        </section>

        {/* Training Locations Grid */}
        <section className={styles.locationsGrid}>
          <h2>🏫 Our Training Centers</h2>
          <div className={styles.gridContainer}>
            <div className={styles.locationCard}>
              <span className={styles.locationIcon}>🇵🇭</span>
              <h3>Manila Gaming Hub</h3>
              <p>123 Cyber Street, Manila</p>
              <p>⏰ Mon-Sun: 10AM - 10PM</p>
              <p>📞 +63 2 8123 4567</p>
              <span className={styles.badge}>PC Gaming</span>
              <span className={styles.badge}>Console Lounge</span>
            </div>
            <div className={styles.locationCard}>
              <span className={styles.locationIcon}>🏝️</span>
              <h3>Cebu Esports Center</h3>
              <p>456 Tech Avenue, Cebu City</p>
              <p>⏰ Mon-Sun: 9AM - 9PM</p>
              <p>📞 +63 32 8765 4321</p>
              <span className={styles.badge}>VR Arena</span>
              <span className={styles.badge}>Streaming Studio</span>
            </div>
            <div className={styles.locationCard}>
              <span className={styles.locationIcon}>🌴</span>
              <h3>Davao Gaming Academy</h3>
              <p>789 Digital Road, Davao City</p>
              <p>⏰ Tue-Sun: 11AM - 8PM</p>
              <p>📞 +63 82 9876 5432</p>
              <span className={styles.badge}>Pro Courses</span>
              <span className={styles.badge}>Mentorship</span>
            </div>
            <div className={styles.locationCard}>
              <span className={styles.locationIcon}>🏔️</span>
              <h3>Baguio Gaming Camp</h3>
              <p>456 Mountain View, Baguio</p>
              <p>⏰ Coming Soon</p>
              <p>📞 +63 74 1234 567</p>
              <span className={styles.badge}>Coming Soon</span>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>📧 Email: gaming@email.com | 📞 Hotline: +63 2 8123 4567</p>
          <p>© 2026 Gaming Passion - Level Up Your Skills</p>
        </footer>
      </div>
    </main>
  );
}

export default ContactPage;