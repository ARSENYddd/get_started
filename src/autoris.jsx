import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      
      // Здесь можно обработать ответ от сервера
      console.log(response.data);
      
      navigate('/');
      console.log('Successful login');
    } catch (error) {
      setError('Invalid username or password');
      console.error('Error:', error);
    }
  };
 
  return (
    <div>
      <h2>Login Page</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;