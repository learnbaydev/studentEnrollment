// app/invalid/page.tsx
import styles from '../components/Invalid/Invalid.module.css';
import { useRouter } from 'next/navigation';

export default function InvalidPage() {
  const router = useRouter();

  const handleEnroll = () => {
    router.push('/courses'); // Replace with your actual route
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src="/unauthorized.svg"
          alt="Unauthorized Access"
          className={styles.image}
        />
        <h2 className={styles.title}>Invalid User</h2>
        <p className={styles.message}>
          You are not authorized to access this page. Please enroll to continue.
        </p>
        <button className={styles.button} onClick={handleEnroll}>
          Enroll Now
        </button>

        <div className={styles.contact}>
          <p>Need help? <a href="https://www.learnbay.co/contact-us" target="_blank" rel="noopener noreferrer">Contact Us</a></p>
        </div>
      </div>
    </div>
  );
}
