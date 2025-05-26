// pages/login.js
import { useEffect, useState } from 'react';
import styles from '../styles/Login.module.css';
import GoogleLoginButton from '@/components/googleAuthButton/GoogleLoginButton';


const testimonials = [
  // {
  //   id: 1,
  //   name: "Priya Patel",
  //   role: "Data Analyst",
  //   rating: "⭐⭐⭐⭐⭐",
  //   quote: "As a fresher, I was struggling to get my first break. The course gave me practical skills and confidence.",
  //   image: "/testimonials/priya.webp"
  // },
  {
    id: 2,
    name: "Shravanthi A",
    role: "Data Scientist",
    rating: "⭐⭐⭐⭐",
    quote: "LearnBay has helped me a lot to learn data science applications in the e-commerce industry. The live class concept was really helpful in receiving proper DS training.",
    image: "/Testimoals/testin_1.webp"
  },
  {
    id: 3,
    name: "Preksha Mishra",
    role: "Lead Data Scientist",
    rating: "⭐⭐⭐⭐⭐",
    quote: "The course structure is excellent with emphasis on concept building and tools & software at the same time.",
    image: "/Testimoals/test_2.webp"
  },
  {
    id: 4,
    name: "Mohamod Israr",
    role: "Data Scientist",
    rating: "⭐⭐⭐⭐",
    quote: "Thanks to the LearnBay data science course & excellent guidance. I was able to crack the TCS interview and secure a job with a 397% pay raise.",
    image: "/Testimoals/test_3.webp"
  },
  {
    id: 5,
    name: "Rahul Sharma",
    role: "Machine Learning Engineer",
    rating: "⭐⭐⭐⭐⭐",
    quote: "The hands-on projects and industry-relevant curriculum helped me transition from a software developer to ML engineer.",
    image: "/Testimoals/test_4.webp"
  }
];
const Login = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, []);


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
            
       {/* Testimonial Slider */}
       <div className={styles.testimonialContainer}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`${styles.testimonial} ${index === currentTestimonial ? styles.active : ''}`}
              >
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className={styles.userImg} 
                />
                <p className={styles.testper}>
                  <strong>{testimonial.name}</strong><br />{testimonial.role}
                </p>
                <p>{testimonial.rating}</p>
                <p className={styles.quote}>"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
            <p className={styles.terms}>By signing in, you agree to Learnbay's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;