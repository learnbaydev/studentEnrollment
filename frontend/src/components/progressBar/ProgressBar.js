// components/ProgressBar.js
import styles from './ProgressBar.module.css';

const ProgressBar = ({ step }) => {
  const steps = ["Personal", "Professional", "Skills"];

  return (
    <div className={styles.progressContainer}>
      {steps.map((label, index) => (
        <div key={index} className={styles.stepItem}>
          <div className={`${styles.circle} ${step > index ? styles.active : ''}`}>
            {index + 1}
          </div>
          <span className={`${styles.label} ${step > index ? styles.activeLabel : ''}`}>
            {label}
          </span>
          {index < steps.length - 1 && <div className={styles.line}></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
