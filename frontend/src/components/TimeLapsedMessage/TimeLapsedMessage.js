import React from 'react';
import styles from './TimeLapsedMessage.module.css';

const TimeLapsedMessage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <div className={styles.icon}>⚠️</div>
        <h2>Time Lapsed</h2>
        <p>Your application time has expired.</p>
        <p>Please contact our Admission Team for assistance.</p>
        <a 
          href="mailto:admission@learnbay.co"
          target='_blank'
          className={styles.contactButton}
        >
          Contact Admission Team
        </a>
      </div>
    </div>
  );
};

export default TimeLapsedMessage; 