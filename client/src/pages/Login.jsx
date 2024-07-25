import { signInWithPopup } from 'firebase/auth';
import React from 'react';
import { GoogleButton } from 'react-google-button';
import { auth, googleAuthProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../Login.css'; // Import your CSS file for styling

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () =>  {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            localStorage.setItem('token', result.user.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate("/");
        } catch (error) {
            console.error('Error signing in with Google:', error.message);
        }
    }   

    return (
        <div className="login-container">
          <h2 className="login-title">Renovate AI</h2>
          <p className="subtitle">The only tool you need to redesign your house</p>
          <h2>Sign in to Your Account</h2>
          <div className="google-button-container">
              <GoogleButton onClick={handleGoogleSignIn}/>
          </div>
        </div>
    );
}

export default Login;
