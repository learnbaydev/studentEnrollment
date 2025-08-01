import React from "react";
import { FaWhatsappSquare } from "react-icons/fa";
import styles from "../components/RegisterNewUser/RegisterNewUser.module.css";
import Image from "next/image";
import GoogleLoginButton from "../components/googleAuthButton/GoogleLoginButton";
import { motion } from "framer-motion";

const SuccessFull = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <motion.div
          className={styles.formContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className={styles.logo} whileHover={{ scale: 1.05 }}>
            <Image
              src="/learnbaylogos.webp"
              alt="LearnBay Logo"
              width={150}
              height={40}
              loading="lazy"
              priority={false}
            />
          </motion.div>
          <motion.div className={styles.stepContent}>
            <motion.h2
              className={styles.step}
              style={{ textAlign: "center", fontSize: "22px" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 100,
              }}
            >
              Your account has been created successfully.
            </motion.h2>
            <motion.div className={styles.center}>
              <div className={styles.mobileGoogleButton}>
                <div className={styles.googleBox}>
                  <p className={styles.sinHead}>Proceed to login ...</p>
                  <GoogleLoginButton />
                  <div
                    className={styles.notediv}
                    style={{ textAlign: "center" }}
                  >
                    <Image
                      src="../secure-icon.svg"
                      alt="Secure"
                      width={16}
                      height={16}
                    />
                    <p className={styles.note}>
                      Your information is securely encrypted
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.p
              className={styles.features}
              variants={itemVariants}
              style={{ textAlign: "center" }}
            >
              Unlock your Personalized Dashboard, Evaluation Form, Screening
              Access, and Program details
            </motion.p>

            <motion.div
              className={styles.contact}
              variants={itemVariants}
              style={{ textAlign: "center" }}
            >
              <p>
                Still Need Help?{" "}
                <a
                  href="https://api.whatsapp.com/send?phone=917349222263"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      "https://api.whatsapp.com/send?phone=917349222263",
                      "_blank"
                    );
                  }}
                >
                  Connect now
                </a>
              </p>

              <div className={styles.contactOptions}>
                <motion.div
                  className={styles.calendlyImage}
                  whileHover={{ scale: 1.05 }}
                >
                  <a href="https://calendly.com/" target="_blank">
                    <Image
                      src="/Calendly.png"
                      alt="Calendly"
                      width={130}
                      height={60}
                      loading="lazy"
                    />
                  </a>
                </motion.div>

                <motion.a
                  href="https://api.whatsapp.com/send?phone=917349222263"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappLink}
                  whileHover={{ scale: 1.1 }}
                >
                  <FaWhatsappSquare className={styles.whatsappIcon} />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessFull;
