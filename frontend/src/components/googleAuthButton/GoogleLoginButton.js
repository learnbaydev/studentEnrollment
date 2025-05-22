import axios from 'axios';
import styles from './GoogleAuthLogin.module.css';

const GoogleLoginButton = () => {
  const responseGoogle = async (response) => {
    if (response.error) {
      alert('Google login failed!');
      return;
    }

    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        token: response.credential,
      });

      if (data.success) {
        alert('Login successful!');
        window.location.href = '/';
      } else {
        alert('Invalid credentials or user not found!');
      }
    } catch (error) {
      console.error('Error during login', error);
      alert('Error during login');
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <button className={styles.googleButton} onClick={handleLoginRedirect}>
      <img
        src="/google-icon.svg"
        alt="Google icon"
        className={styles.icon}
      />
     
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
