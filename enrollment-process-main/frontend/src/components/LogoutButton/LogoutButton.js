import { useRouter } from "next/router";
import { useState } from "react";
import styles from './LogoutButton.module.css';

export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${styles.logoutButton} ${className}`}
      >
        Logout
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Are you sure you want to logout?</h3>
            <p>You'll need to sign in again to access your account.</p>
            <div className={styles.modalButtons}>
              <button 
                onClick={() => setShowModal(false)} 
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className={styles.confirmButton}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}