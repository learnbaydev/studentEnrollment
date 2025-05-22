// components/StepCard.js

import React from 'react';
import styles from './Steps.module.css';
import Image from 'next/image';

export default function StepCard({ number, title, description, isActive, isLocked, children, showTimer, icon }) {
  return (
    <div
      className={`${styles.stepCard} ${isActive ? styles.active : styles.inactive}`}
      style={{ cursor: isActive ? 'default' : 'not-allowed' }}
    >
      <div
        className={`${styles.stepCircle} ${isActive ? styles.activeCircle : styles.inactiveCircle}`}
        title="Complete the previous step to unlock"
      >
        Step {number} out of 4
      </div>

      <div className={styles.stepContent}>
        <div className={styles.iconDivs}>
          <Image src={icon} width={50} height={50} alt="icon" loading="lazy" />
          <h3>{title}</h3>
        </div>
        <p className={`${styles.desc} ${isActive ? styles.activeDesc : styles.inactiveDesc}`}>
          {description}
        </p>

        {children}

        {showTimer && (
          <div className={styles.timerSection}>
            <p className={styles.timerText}>
              <span>⏱</span> Expires in: 01h 59m 45s
            </p>
            <p className={styles.progressText}>0% completed</p>
          </div>
        )}
      </div>

      {showTimer && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarFill} style={{ width: '0%' }}></div>
        </div>
      )}
    </div>
  );
}
