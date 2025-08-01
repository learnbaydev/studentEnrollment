import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../components/RegisterNewUser/RegisterNewUser.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
const confirmation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const handleIntersted = () => {
    router.push("/register?email=" + email);
    // router.push("/register");
  };
  const handleNotIntersted = () => {
    router.push("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

        <div style={{ textAlign: "center" }}>
          <h2
            className={styles.title}
            style={{ fontSize: "24px", margin: "5px" }}
          >
            Oops!
          </h2>
          <h3
            className={styles.title}
            style={{ fontSize: "18px", margin: "5px" }}
          >
            You are not registered with us.
          </h3>
          <p className={styles.subtitle} style={{ padding: isMobile? "0px 2.5rem" : "0px 5rem" }}>
            Do you want to create your application?
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className={styles.button}
            style={{ padding: "12px" }}
            onClick={handleIntersted}
          >
            Start Application
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default confirmation;
