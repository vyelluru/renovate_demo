import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
  return (
    <div>
      <h3>Welcome {user.displayName}</h3>
    </div>
  )
}

export default Home
