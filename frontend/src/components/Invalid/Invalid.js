import styles from './Invalid.module.css';
import { useRouter } from 'next/router';

export default function InvalidUser() {
  const router = useRouter();

  const handleEnroll = () => {
    router.push('/courses'); // Replace with your route
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src="/unauthorized.svg"
          alt="Unauthorized Access"
          className={styles.image}
        />
        <h2 className={styles.title}>Access Denied</h2>
        <p className={styles.message}>
          It looks like you&apos;re not enrolled. Please enroll to continue.
        </p>
        <button className={styles.button} onClick={handleEnroll}>
          Enroll Now
        </button>
      </div>
    </div>
  );
}
