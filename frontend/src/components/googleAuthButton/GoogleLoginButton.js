import axios from "axios";
import styles from "./GoogleAuthLogin.module.css";
import { useEffect } from "react";

const GoogleLoginButton = () => {
  useEffect(() => {
    // Check for error messages in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      const decodedError = decodeURIComponent(error);
      alert(decodedError);
      // Remove error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const responseGoogle = async (response) => {
    if (response.error) {
      alert("Google login failed!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          token: response.credential,
        }
      );

      if (data.success) {
        alert("Login successful!");
        window.location.href = "/";
      } else {
        const errorMessage =
          data.message || "Invalid credentials or user not found!";
        // alert(errorMessage);
      }
    } catch (error) {
      console.error("Error during login", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error during login. Please try again.";
      // alert(errorMessage);
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <button className={styles.googleButton} onClick={handleLoginRedirect}>
      <img src="/google-icon.svg" alt="Google icon" className={styles.icon} />

      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
