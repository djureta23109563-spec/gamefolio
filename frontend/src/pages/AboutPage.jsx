import image3 from '../assets/image3.jpg';
import imageesport from '../assets/imageesport.jpg';
import imageccs from '../assets/imageccs.jpg';
import styles from '../styles/AboutPage.module.css';

function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1>🎮 About My Gaming Journey</h1>
          <p>From casual gaming to competitive esports - my story</p>
        </section>

        {/* Profile / Intro Section */}
        <section className={styles.introSection}>
          <div className={styles.introCard}>
            <div className={styles.introImage}>
              <img src={image3} alt="Game controller" />
            </div>
            <div className={styles.introContent}>
              <h2>What I Love About Gaming</h2>
              <p>
                Gaming allows me to escape into creative worlds, challenge my skills, 
                and connect with other players across the globe. It's not just a hobby - 
                it's a passion that has shaped who I am today.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>5000+</span>
                  <span className={styles.statLabel}>Hours Played</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>50+</span>
                  <span className={styles.statLabel}>Games Completed</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>15+</span>
                  <span className={styles.statLabel}>Tournaments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gaming Journey Section */}
        <section className={styles.journeySection}>
          <h2>📖 My Gaming Journey</h2>
          <div className={styles.journeyGrid}>
            <div className={styles.journeyCard}>
              <div className={styles.journeyImage}>
                <img src={imageesport} alt="Esports competition" />
              </div>
              <div className={styles.journeyContent}>
                <h3>Competitive Gaming</h3>
                <p>
                  My gaming journey is more than just a series of matches, it is a testament 
                  to the teamwork and community built through local competition in La Union.
                </p>
              </div>
            </div>
            <div className={styles.journeyCard}>
              <div className={styles.journeyImage}>
                <img src={imageccs} alt="Gaming setup" />
              </div>
              <div className={styles.journeyContent}>
                <h3>Gaming Setup Evolution</h3>
                <p>
                  From a simple laptop to a full gaming rig - every upgrade brought new 
                  possibilities and better gaming experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Progression Timeline */}
        <section className={styles.timelineSection}>
          <h2>📈 My Gaming Progression</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>🎮</div>
              <div className={styles.timelineContent}>
                <h3>Casual Mobile Games</h3>
                <p>Started with simple mobile games during free time</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>💻</div>
              <div className={styles.timelineContent}>
                <h3>PC & Console Gaming</h3>
                <p>Discovered the world of PC and console gaming</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>🌐</div>
              <div className={styles.timelineContent}>
                <h3>Online Communities</h3>
                <p>Joined multiplayer communities and made gaming friends</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>🏆</div>
              <div className={styles.timelineContent}>
                <h3>Competitive Tournaments</h3>
                <p>Entered local and online gaming tournaments</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>📺</div>
              <div className={styles.timelineContent}>
                <h3>Content Creation</h3>
                <p>Explored game streaming and content creation</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}>🚀</div>
              <div className={styles.timelineContent}>
                <h3>Continuous Growth</h3>
                <p>Continually improving skills and strategies</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className={styles.quoteSection}>
          <blockquote>
            <span className={styles.quoteIcon}>"</span>
            Gaming is not just entertainment — it is a way to learn, compete, and grow.
            <span className={styles.quoteIcon}>"</span>
          </blockquote>
          <p className={styles.quoteAuthor}>- Gaming Passion</p>
        </section>

        <footer className={styles.footer}>
          <p>📧 Contact: gaming@email.com</p>
          <p>© 2026 Gaming Passion - Level Up Your Skills</p>
        </footer>
      </div>
    </main>
  );
}

export default AboutPage;