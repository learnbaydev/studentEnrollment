import React, { useState } from "react";
import styles from "./RegisterNewUser.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaWhatsappSquare } from "react-icons/fa";
import Image from "next/image";

const RegisterNewUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    mobile: "",
    program: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatusError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        formData
      );
      setIsSuccess(data?.data?.success);
      setLoading(false);
    } catch (error) {
      setError(
        error?.response?.data?.error ||
          "Something went wrong! Please try again."
      );
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

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

  const programs = [
    {
      Course_ID: "1",
      Course_Name: "Advanced Data Science and Gen AI",
      Course_Code: "DS",
    },
    {
      Course_ID: "2",
      Course_Name: "Data Science and Gen AI for BFSI",
      Course_Code: "DS",
    },
    {
      Course_ID: "4",
      Course_Name: "Advanced ML & Gen AI Program",
      Course_Code: "DS",
    },
    {
      Course_ID: "5",
      Course_Name: "DS & Gen AI for Manager's and Leader's",
      Course_Code: "DS",
    },
    {
      Course_ID: "6",
      Course_Name: "DS & Gen AI Master's certification Program",
      Course_Code: "DS",
    },
    {
      Course_ID: "7",
      Course_Name: "Data Analytics & Business Analytics with Gen AI",
      Course_Code: "BA",
    },
    { Course_ID: "8", Course_Name: "HR Analytics", Course_Code: "BA" },
    {
      Course_ID: "9",
      Course_Name: "Marketing Analytics",
      Course_Code: "BA",
    },
    {
      Course_ID: "10",
      Course_Name: "Advanced Cloud and Devops",
      Course_Code: "Cloud",
    },
    {
      Course_ID: "11",
      Course_Name: "Software Development (DSA & SD)",
      Course_Code: "DSA&SD",
    },
    {
      Course_ID: "12",
      Course_Name: "IIT Guwahati Data Science",
      Course_Code: "DS",
    },
    {
      Course_ID: "13",
      Course_Name: "IIT Guwahati Data Analytics",
      Course_Code: "BA",
    },
    {
      Course_ID: "14",
      Course_Name: "Woolf Master Degree",
      Course_Code: "Woolf",
    },
    {
      Course_ID: "43989",
      Course_Name: "Data Structures and Algorithms",
      Course_Code: "DSA&SD",
    },
    {
      Course_ID: "852369",
      Course_Name: "AWS Cloud Computing & Devops",
      Course_Code: "Cloud",
    },
    {
      Course_ID: "852370",
      Course_Name: "Data Structure Algorithms & System Design",
      Course_Code: "DSA&SD",
    },
    {
      Course_ID: "1520136",
      Course_Name: "Cybersecurity Executive - IIT",
      Course_Code: "IIT",
    },
    {
      Course_ID: "1520185",
      Course_Name: "Cybersecurity Advance - IIT",
      Course_Code: "IIT",
    },
    {
      Course_ID: "1528533",
      Course_Name: "IIT Executive Certification in Cloud & Devops",
      Course_Code: "Cloud",
    },
    {
      Course_ID: "1528900",
      Course_Name: "Gen AI Developer Certification for Professionals",
      Course_Code: "Gen-AI",
    },
    {
      Course_ID: "1528901",
      Course_Name: "Gen AI Certification for Managers and Leaders",
      Course_Code: "Gen-AI",
    },
  ];

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
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

        <>
          {!isSuccess ? (
            <motion.div>
              <motion.div className={styles.stepContent}>
                <motion.form onSubmit={handleSubmit}>
                  <motion.div>
                    {error && <p className={styles.error}>{error}</p>}
                  </motion.div>
                  <motion.h2 className={styles.title} variants={itemVariants}>
                    Start Your Application{" "}
                  </motion.h2>
                  <motion.div className={styles.labelInput}>
                    <motion.label htmlFor="name">Full Name *</motion.label>
                    <motion.input
                      type="text"
                      name="full_name"
                      placeholder="Your Name"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </motion.div>

                  <motion.div className={styles.labelInput}>
                    <motion.label htmlFor="email">Email *</motion.label>
                    <motion.input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </motion.div>

                  <motion.div className={styles.labelInput}>
                    <motion.label htmlFor="mobile">Mobile *</motion.label>
                    <motion.input
                      type="number"
                      name="mobile"
                      placeholder="Your Mobile"
                      value={formData?.mobile}
                      onChange={handleChange}
                    />
                  </motion.div>

                  <motion.div className={styles.labelInput}>
                    <motion.label htmlFor="program">Program *</motion.label>
                    <motion.select
                      name="program"
                      placeholder="Select Program"
                      value={formData.program}
                      onChange={handleChange}
                    >
                      <motion.option value="">
                        Select your program
                      </motion.option>
                      {programs?.map((course) => (
                        <motion.option
                          value={course.Course_Name}
                          key={course.Course_ID}
                        >
                          {course.Course_Name}
                        </motion.option>
                      ))}
                    </motion.select>
                  </motion.div>
                  <motion.div className={styles.center}>
                    <motion.button
                      type="submit"
                      className={styles.button}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                      disabled={loading}
                    >
                      Submit
                    </motion.button>
                  </motion.div>
                </motion.form>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className={styles.formContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div className={styles.stepContent}>
                <motion.h2 className={styles.step}>
                  Your Registration successful please login
                </motion.h2>
                <motion.div className={styles.center}>
                  <motion.button
                    className={styles.button}
                    onClick={handleLogin}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                  >
                    Login Now
                  </motion.button>
                </motion.div>
                <motion.p className={styles.features} variants={itemVariants}>
                  Unlock your Personalized Dashboard, Evaluation Form, Screening
                  Access, and Program details
                </motion.p>

                <motion.div className={styles.contact} variants={itemVariants}>
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
          )}
        </>
      </motion.div>
    </div>
  );
};

export default RegisterNewUser;
