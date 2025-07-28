import React, { useState } from "react";
import styles from "./RegisterNewUser.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterNewUser = ({ user = "" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSecuss, setIsSecuss] = useState(false);
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
    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        formData
      );
    } catch (error) {}
    setIsSecuss(true);
  };

  const handleLogin = () => {
    router.push("/login");
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
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.step}>Start Your Application</h2>
        <div className={styles.labelInput}>
          <label>Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.labelInput}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.labelInput}>
          <label>Mobile *</label>
          <input
            type="number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        <div className={styles.labelInput}>
          <label>Program *</label>
          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
          >
            <option value="">Select your program</option>
            {programs?.map((course) => {
              return (
                <option value={course.Course_Name} key={course.Course_ID}>
                  {course.Course_Name}
                </option>
              );
            })}
          </select>
        </div>
        <button type="submit" className={styles.nextBtn}>
          Submit
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {isSecuss && (
        <motion.button
          className={styles.button}
          onClick={handleLogin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          variants={itemVariants}
        >
          Login Now
        </motion.button>
      )}
    </div>
  );
};

export default RegisterNewUser;
