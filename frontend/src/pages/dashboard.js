import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // ✅ added
import useAuth from '../hooks/hooks'; // ✅ updated hook path
import Sidebar from '../components/sidebar/SideBar';
import Navbar from '@/components/Navbar/Navbar';
import Modal from '../components/Model/Model';
import EnrollmentForm from '../components/EnrollmentForm/EnrollmentForm';
import Steps from '../components/Steps/Steps';
import styles from '../styles/Dashboard.module.css';
import axios from 'axios';
import UserInfo from '@/components/UserInfo/UserInfo';
import SuccessStories from '@/components/SuccessStories/SuccessStories';
import DownloadOfferLetter from '@/components/DownloadOfferLetter/DownloadOfferLetter';
import CourseBrochures from '@/components/CourseBrochures/CourseBrochures';
import ThemeToggle from '@/components/ThemeToggle';
import FeaturesSection from '@/components/Features/Features';
import DemoVideoSection from '@/components/DevVideoSection/DemoVideoSection';
import Head from 'next/head';

export default function Dashboard() {
  const { loading, user } = useAuth();
  const router = useRouter(); // ✅ required for redirect

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [step1Completed, setStep1Completed] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const fetchEnrollmentStatus = async () => {
    if (!user?.email) return;
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll/check?email=${user.email}`);
      const status = response.data?.status;
      setEnrollmentStatus(status);
      setCurrentStep(status === 'approved' ? 2 : 1);
    } catch (err) {
      console.error("Failed to fetch enrollment status", err);
    }
  };

  const handleEnrollmentComplete = async () => {
    await fetchEnrollmentStatus();
    setStep1Completed(true);
    closeModal();
  };

  useEffect(() => {
    if (user?.email) fetchEnrollmentStatus();
  }, [user]);

  // ✅ client-side redirect if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // ✅ show spinner while loading or waiting to redirect
  if (loading || (!user && typeof window !== 'undefined')) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar 
        user={user} 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
      />
      <div className={styles.mainContent}>
        <Sidebar 
          selected={activeSection} 
          onSelect={setActiveSection} 
          user={user}
          isOpen={isSidebarOpen}
        />

        <div className={`${styles.contentArea} ${isSidebarOpen ? styles.withSidebar : ''}`}>
          {activeSection === 'dashboard' && (
            <>
              <Steps
                currentStep={currentStep}
                enrollmentStatus={enrollmentStatus}
                userEmail={user?.email}
                onStepChange={setCurrentStep}
                user={user}
              />
              <UserInfo user={user} />
            </>
          )}

          {activeSection === 'testimonials' && (
            <div className={styles.tesimonals}>
              <SuccessStories />
            </div>
          )}

          {activeSection === 'brochure' && (
            <div className={styles.sectionContainer}>
              <CourseBrochures />
              <ThemeToggle />
            </div>
          )}

          {activeSection === 'demo' && (
            <div className={styles.sectionContainer}>
              <DemoVideoSection />
            </div>
          )}

          {activeSection === 'features' && (
            <div className={styles.sectionContainer}>
              <FeaturesSection />
            </div>
          )}

          {activeSection === 'support' && (
            <div className={styles.sectionContainer}>
              <h3>Help & Support</h3>
              <div className={styles.supportCard}>
                <p>Need help? Our support team is available 24/7</p>
                <div className={styles.contactMethods}>
                  <a href="mailto:support@example.com" className={styles.contactLink}>
                    support@example.com
                  </a>
                  <a href="tel:+1234567890" className={styles.contactLink}>
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <EnrollmentForm
          onClose={closeModal}
          onComplete={handleEnrollmentComplete}
          user={user}
          enrollmentStatus={enrollmentStatus}
        />
      </Modal>
    </div>
  );
}

// ✅ server-side protection
export async function getServerSideProps(context) {
  const cookie = context.req.headers.cookie || '';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`, {
    headers: {
      cookie,
    },
  });

  const data = await res.json();

  if (!data.isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
