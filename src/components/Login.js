import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api'; 
import '../styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [chats, setChats] = useState({});
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }
    
    const result = await loginUser(username, password);

    if (result.success) {
      const fetchedChats = result.chats || {}; 
      setChats(fetchedChats); 
      console.log(result.chats);
      navigate('/menu', { state: { username } });

    } else {
      alert(result.error || 'Invalid username or password.'); 
    }
  };

  return (
    <div className="login">
      <h2>Login Page</h2>
      <div className='login-username'>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
      <div className='login-password'>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      <div className='login-button'>
      <button onClick={handleLogin}>Login</button>
      </div>
      <div className='login-username'>
      <p>
        Don't have a username? <Link to="/signup">Sign Up</Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
