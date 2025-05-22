// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-auth`, {
      method: 'GET',
      credentials: 'include', 
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setAuthenticated(true);
          setUser(data.user);
        } else {
          router.replace('/login');
        }
      })
      .catch((err) => {
        console.error(err);
        router.replace('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  return { loading, authenticated, user };
}
