import React from 'react';
import styles from './ContactSupport.module.css';
import { Mail, PhoneCall, MessageSquare } from 'lucide-react';
// import helpImage from './assets/help.svg';

const ContactSupport = () => {
  return (
    <section className={styles.supportSection}>
      <div className={styles.wrapper}>
        <div className={styles.textSection}>
          <h2>Need Help? We're Just a Message Away</h2>
          <p>
            Our dedicated support team is always available to assist you. Choose your preferred way to reach out.
          </p>
          <div className={styles.cards}>
            <div className={styles.card}>
              <Mail className={styles.icon} />
              <h3>Email</h3>
              <p>Quick response within 24 hours</p>
              <a href="mailto:support@learnbay.com">support@learnbay.com</a>
            </div>
            <div className={styles.card}>
              <PhoneCall className={styles.icon} />
              <h3>Phone</h3>
              <p>Mon–Fri, 9 AM to 6 PM</p>
              <a href="tel:+918001234567">+91 80012 34567</a>
            </div>
            <div className={styles.card}>
              <MessageSquare className={styles.icon} />
              <h3>Live Chat</h3>
              <p>Get instant help from our team</p>
              <button className={styles.chatBtn}>Chat Now</button>
            </div>
          </div>
        </div>
        <div className={styles.imageSection}>
          {/* <img src={helpImage} alt="Support Illustration" /> */}
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;
