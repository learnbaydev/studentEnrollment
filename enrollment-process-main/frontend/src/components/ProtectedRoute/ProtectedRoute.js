// components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-auth`, {
      credentials: "include",
    })
      .then(res => {
        if (res.status === 200) return res.json();
        else throw new Error("Not authenticated");
      })
      .then(data => {
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        navigate("/login"); 
      });
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!authenticated) return null;

  return children;
};

export default ProtectedRoute;
