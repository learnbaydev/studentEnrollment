import { GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

// Dynamically import the skeleton to avoid SSR
const Skeleton = dynamic(() => import('../components/Skeleton/Skeleton'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', background: '#f5f5f5' }} />
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStart = () => setIsLoading(true);
      const handleComplete = () => setIsLoading(false);

      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleComplete);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleComplete);
        clearTimeout(timer);
      };
    }
  }, [router]);

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <div style={{ 
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 300ms ease-in-out'
        }}>
          <Component {...pageProps} />
        </div>
        
        {isLoading && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 1000,
            background: 'var(--background)'
          }}>
            <Skeleton />
          </div>
        )}
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;