// components/Layout/Layout.js
import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../sidebar/SideBar';
import styles from './Layout.module.css';

export default function Layout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <Navbar 
        user={user} 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      <main className={`${styles.mainContent} ${sidebarOpen ? styles.shifted : ''}`}>
        {children}
      </main>
    </div>
  );
}