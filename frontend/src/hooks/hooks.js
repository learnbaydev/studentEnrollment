// hooks/useAuth.js
import { useEffect, useState } from 'react';

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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
          setAuthenticated(false);
          setUser(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setAuthenticated(false);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, authenticated, user };
}
