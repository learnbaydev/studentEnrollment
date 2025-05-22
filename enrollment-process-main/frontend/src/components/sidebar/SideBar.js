// components/Sidebar/Sidebar.js
import styles from './SideBar.module.css';
import { 
  Home, 
  Star, 
  Download, 
  PlayCircle, 
  Layers, 
  HelpCircle, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Sidebar({user, selected, onSelect }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 868);
      if (window.innerWidth >= 868) {
        setSidebarOpen(true);
      }
    };

    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  const menuItems = [
    {
      items: [
        { id: 'dashboard', icon: <Home size={18} />, label: 'Dashboard' },
        { id: 'testimonials', icon: <Star size={18} />, label: 'Student Testimonials' }
      ]
    },
    {
      title: 'RESOURCES',
      items: [
        { id: 'brochure', icon: <Download size={18} />, label: 'Download Brochure' }
      ]
    },
    {
      title: 'LEARNING',
      items: [
        { id: 'demo', icon: <PlayCircle size={18} />, label: 'Demo Lectures' },
        { id: 'features', icon: <Layers size={18} />, label: 'Program Features' }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'support', icon: <HelpCircle size={18} />, label: 'Help & Support' }
      ]
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSection = (title) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button 
          className={styles.mobileToggle}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X size={24} className={styles.toggleIcon} />
          ) : (
            <Menu size={24} className={styles.toggleIcon} />
          )}
        </button>
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''} ${isMobile ? styles.mobile : ''}`}
      >
        <div className={styles.sidebarHeader}>
          {isMobile && (
            <button 
              className={styles.closeButton}
              onClick={toggleSidebar}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          )}
          <div className={styles.logo}>
        <Image src="/learnbaylogos.webp" alt="Logo" width={140} height={40} />
          </div>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((section, index) => (
            <div key={index} className={styles.sectionContainer}>
              {section.title && (
                <div 
                  className={styles.sectionTitle}
                  onClick={() => toggleSection(section.title)}
                >
                  <span>{section.title}</span>
                  {expandedSections[section.title] !== false ? (
                    <ChevronDown size={16} className={styles.chevron} />
                  ) : (
                    <ChevronRight size={16} className={styles.chevron} />
                  )}
                </div>
              )}
              <ul 
                className={styles.section}
                style={{
                  display: section.title && expandedSections[section.title] === false ? 'none' : 'block'
                }}
              >
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className={`${styles.menuItem} ${selected === item.id ? styles.active : ''}`}
                    onClick={() => {
                      onSelect(item.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <span className={styles.menuLabel}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>LB</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}