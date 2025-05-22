// components/Navbar/Navbar.js
import styles from './Navbar.module.css';
import LogoutButton from '../LogoutButton/LogoutButton';
import { Bell, Menu, X } from 'lucide-react';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import Image from 'next/image';

export default function Navbar({ user, sidebarOpen, toggleSidebar }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <button 
          className={styles.menuButton} 
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={styles.logoContainer}>
          <Image 
            src="/learnbaylogos.webp" 
            alt="Logo" 
            width={140} 
            height={40} 
            className={styles.logo}
            priority
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.notificationButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.notificationBadge}>3</span>
        </button>
        <ProfileHeader user={user} />
        <div className={styles.logoutWrapper}>
          <LogoutButton className={styles.logoutButton} />
        </div>
      </div>
    </nav>
  );
}