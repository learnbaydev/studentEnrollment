// pages/login.js
import styles from '../styles/Login.module.css';
import GoogleLoginButton from '@/components/googleAuthButton/GoogleLoginButton';

const Login = () => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.leftPanel}>
            <div>
              <div className={styles.logoDiv}>
                <img src="/learnbaylogos.webp" alt="Learnbay Logo" className={styles.logo} />
                <h2>Launch Your Tech. Master In-Demand Skills</h2>
              </div>
           <div className={styles.mobileonly}>

               
              {/* Mobile-only Google login button */}
              <h2>Your Personalised <span className={styles.highlight}>Admission</span></h2>
            <p className={styles.smallhead}>Access your Learnbay dashboard, course materials, and career support</p>
            
              <div className={styles.mobileGoogleButton}>
                <div className={styles.googleBox}>
                  <p className={styles.sinHead}>Sign in to continue</p>
                  <GoogleLoginButton />
                  <div className={styles.notediv}>
                    <img src="/secure-icon.svg" alt="Secure" />
                    <p className={styles.note}>Your information is securely encrypted</p>
                  </div>
                </div>
              </div>
           </div>
              
              <h3 className={styles.h3}>Why Top Professional Choose Us</h3>
            </div>
            <div className={styles.featuresMain}>
              <div className={styles.features}>
                <div className={styles.featureBox}>
                  <img src="/icons/icon-01.webp" alt="GenAI" />
                  <p>Learn GenAI and AgenticAI</p>
                  <span>Build AI Apps using Langchain and OpenAI</span>
                </div>
                <div className={styles.featureBox}>
                  <img src="/icons/icon-02.webp" alt="1:1 Mentorship" />
                  <p>1:1 Mentorship</p>
                  <span>Personalized guidance from industry experts</span>
                </div>
                <div className={styles.featureBox}>
                  <img src="/icons/icon-03.webp" alt="Live Classes" />
                  <p>Live Classes</p>
                  <span>Interactive sessions with real-time doubt clearing</span>
                </div>
                <div className={styles.featureBox}>
                  <img src="/icons/icon-04.webp" alt="Job Assistance" />
                  <p>Job Assistance</p>
                  <span>Placement support for Data Science & Software Dev roles.</span>
                </div>
              </div>
            </div>
            <div className={styles.certificationBoxMain}>
              <div className={styles.certificationBox}>
                <div><img src="/icons/icon-5.webp" alt="" /></div>
                <div>
                  <p><strong>Domain Specialised Project Certification</strong></p>
                  <span>Program Specially Designed for Professionals from BFSI, Retail, Healthcare, Automotive domains to transition in data science. Work on real industry project and get project certification.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.rightPanel}>
            <h2 className={styles.desktophighlets}>Your Personalised <span className={` ${styles.highlight}`}>Admission</span></h2>
            <p className={ `${styles.smallhead} ${styles.paras}` }>Access your Learnbay dashboard, course materials, and career support</p>
            
            {/* This will be hidden on mobile */}
            <div className={styles.googleBox}>
              <p className={styles.sinHead}>Sign in to continue</p>
              <GoogleLoginButton />
              <div className={styles.notediv}>
                <img src="/secure-icon.svg" alt="Secure" />
                <p className={styles.note}>Your information is securely encrypted</p>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <img src="/rahul.webp" alt="Rahul" className={styles.userImg} />
              <p className={styles.testper}><strong>Rahul S.</strong><br />Data Science Graduate</p>
              <p>⭐⭐⭐⭐⭐</p>
              <p className={styles.quote}>
                "The mentorship and job support were fantastic. Landed a role at Amazon after just 6 months!"
              </p>
            </div>
            <p className={styles.terms}>By signing in, you agree to Learnbay's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;