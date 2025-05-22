import React from "react";
import { FiBook, FiUsers, FiAward, FiCode, FiBriefcase, FiLayers, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import styles from "./FeaturesSection.module.css";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FiBook size={24} />,
      title: "Cutting-Edge Curriculum",
      description: "Our courses are continuously updated to reflect the latest industry trends and technologies.",
      iconClass: styles.iconGradient1
    },
    {
      icon: <FiUsers size={24} />,
      title: "World-Class Mentors",
      description: "Learn from industry veterans with proven track records in top tech companies.",
      iconClass: styles.iconGradient2
    },
    {
      icon: <FiCode size={24} />,
      title: "Real-World Projects",
      description: "Build portfolio-worthy projects that solve actual business problems.",
      iconClass: styles.iconGradient3
    },
    {
      icon: <FiBriefcase size={24} />,
      title: "Career Acceleration",
      description: "Get personalized career coaching and interview preparation from our experts.",
      iconClass: styles.iconGradient4
    },
    {
      icon: <FiLayers size={24} />,
      title: "Collaborative Learning",
      description: "Join an exclusive community of ambitious professionals and grow together.",
      iconClass: styles.iconGradient5
    },
    {
      icon: <FiAward size={24} />,
      title: "Prestigious Certification",
      description: "Earn industry-recognized credentials that boost your professional credibility.",
      iconClass: styles.iconGradient6
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className={styles.container}>
      <div className={`${styles.decorativeElement} ${styles.decor1}`}></div>
      <div className={`${styles.decorativeElement} ${styles.decor2}`}></div>
      <div className={`${styles.decorativeElement} ${styles.decor3}`}></div>
      
      <div className={styles.content}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <span className={styles.tag}>Premium Education</span>
          <h1 className={styles.title}>Transformative Learning Experience</h1>
          <p className={styles.subtitle}>
            Our elite programs combine cutting-edge technology with proven pedagogical approaches to deliver unmatched learning outcomes.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={styles.featuresGrid}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className={`${styles.featureCard} ${styles.glassPanel}`}
            >
              <div className={`${styles.featureIcon} ${feature.iconClass}`}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <a href="#" className={styles.learnMore}>
                Learn more <FiArrowRight />
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className={styles.ctaContainer}
        >
          <button className={styles.ctaButton}>
            <span>Begin Your Transformation Journey</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;