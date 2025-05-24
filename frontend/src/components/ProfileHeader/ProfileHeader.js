import { useState } from 'react';
import styles from './ProfileHeader.module.css';
import { LogOut, UserCircle2 } from 'lucide-react'; // Optional: using lucide-react icons
import LogoutButton from '../LogoutButton/LogoutButton';

export default function ProfileHeader({ user }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsProfileOpen(false);
  };


  return (
    <>
      <div className={styles.profileHeader} onClick={toggleProfileModal}>
        <div className={styles.profilePic}>
          <img src="/icons/3d-avater.webp" alt="Profile" />
        </div>
        <span className={styles.profileName}>{user?.name || 'Guest'}</span>
      </div>

      {isProfileOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.profileModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.profileModalHeader}>
              <h2>My Profile</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className={styles.profileModalContent}>
              <div className={styles.profilePicLarge}>
                <img src="/icons/3d-avater.webp" alt="Profile" />
              </div>
              <div className={styles.profileDetails}>
                <p>
                  <strong>Name:</strong> {user?.name || 'No name'}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email || 'No email'}
                </p>
                <p>
                  {/* <strong>Joined:</strong> {user?.joinedDate || 'N/A'} */}
                </p>
              </div>
              <div className={styles.profileActions}>
                <button >
                  <LogoutButton size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
