import Image from "next/image";
import styles from "../components/Invalid/Invalid.module.css";
import { useRouter } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { FaWhatsappSquare } from "react-icons/fa";
import { motion } from "framer-motion";
import RegisterNewUser from "@/components/RegisterNewUser/RegisterNewUser";
import { useSearchParams } from "next/navigation";

export default function InvalidPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const handleLogin = () => {
    router.push("/confirmation");
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

  return (
    <>
      <RegisterNewUser email={email} />
    </>
    // <div className={styles.container}>
    //   <motion.div
    //     className={styles.card}
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.5 }}
    //   >
    //     <motion.div className={styles.logo} whileHover={{ scale: 1.05 }}>
    //       <Image
    //         src="/learnbaylogos.webp"
    //         alt="LearnBay Logo"
    //         width={150}
    //         height={40}
    //         loading="lazy"
    //         priority={false}
    //       />
    //     </motion.div>

    //     <motion.h2 className={styles.title} variants={itemVariants}>
    //       User not found!
    //     </motion.h2>

    //     <motion.p className={styles.subtitle} variants={itemVariants}>
    //       Looks like you're trying to sneak in... but not so fast!
    //     </motion.p>

    //     <motion.div
    //       className={styles.checkpoints}
    //       variants={containerVariants}
    //       initial="hidden"
    //       animate="visible"
    //     >
    //       <motion.h3 variants={itemVariants}>
    //         Few check points to remember if you are seeing this page
    //       </motion.h3>

    //       <motion.ul className={styles.checklist}>
    //         <motion.li variants={itemVariants}>
    //           <span>
    //             <CheckSquare size={18} />
    //           </span>
    //           You've logged in with your registered email
    //         </motion.li>

    //         <motion.li variants={itemVariants}>
    //           <span>
    //             <CheckSquare size={18} />
    //           </span>
    //           Your evaluator has activated your profile
    //         </motion.li>

    //         <motion.li variants={itemVariants}>
    //           <span>
    //             <CheckSquare size={18} />
    //           </span>
    //           You are here within the account expiry time
    //         </motion.li>
    //       </motion.ul>
    //     </motion.div>

    //     <motion.button
    //       className={styles.button}
    //       onClick={handleLogin}
    //       whileHover={{ scale: 1.03 }}
    //       whileTap={{ scale: 0.98 }}
    //       variants={itemVariants}
    //     >
    //       Register Now
    //     </motion.button>

    //     <motion.p className={styles.features} variants={itemVariants}>
    //       Unlock your Personalized Dashboard, Evaluation Form, Screening Access,
    //       and Program details
    //     </motion.p>

    //     <motion.div className={styles.contact} variants={itemVariants}>
    //       <p>
    //         Still Need Help?{" "}
    //         <a
    //           href="https://api.whatsapp.com/send?phone=917349222263"
    //           onClick={(e) => {
    //             e.preventDefault();
    //             window.open(
    //               "https://api.whatsapp.com/send?phone=917349222263",
    //               "_blank"
    //             );
    //           }}
    //         >
    //           Connect now
    //         </a>
    //       </p>

    //       <div className={styles.contactOptions}>
    //         <motion.div
    //           className={styles.calendlyImage}
    //           whileHover={{ scale: 1.05 }}
    //         >
    //           <a href="https://calendly.com/" target="_blank">
    //             <Image
    //               src="/Calendly.png"
    //               alt="Calendly"
    //               width={130}
    //               height={60}
    //               loading="lazy"
    //             />
    //           </a>
    //         </motion.div>

    //         <motion.a
    //           href="https://api.whatsapp.com/send?phone=917349222263"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className={styles.whatsappLink}
    //           whileHover={{ scale: 1.1 }}
    //         >
    //           <FaWhatsappSquare className={styles.whatsappIcon} />
    //         </motion.a>
    //       </div>
    //     </motion.div>
    //   </motion.div>
    // </div>
  );
}
