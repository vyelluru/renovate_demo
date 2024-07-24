import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import { GoogleButton } from 'react-google-button';
import { auth, googleAuthProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleGoogleSignIn = async () =>  {
        const result = await signInWithPopup(auth, googleAuthProvider)
        localStorage.setItem('token', result.user.accessToken)
        localStorage.setItem('user', JSON.stringify(result.user))
        navigate("/")
    }   
  return (
    <div>
         <GoogleButton onClick={handleGoogleSignIn}/>
    </div>
  )
}

export default Login