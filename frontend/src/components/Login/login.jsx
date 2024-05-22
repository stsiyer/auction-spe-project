import React, { useState } from 'react';
import axios from 'axios'; // Assuming you're using Axios for API calls
import './login.css'
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic form validation (you can improve this)
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://192.168.49.2:30002/user/signin', {
        email,
        password,
      });
      console.log(response);
      if (!response.status===200) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const token = response.data.token; // Extract token from response

      console.log('Login successful! Token:', token);
      // Store the token in local storage or state management (e.g., Redux)
      localStorage.setItem('jwtToken', token);

      // Redirect to a protected route or dashboard page after successful login
      window.location.href = '/browse'; // Replace with your desired redirect route

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-group">
        <label htmlFor="username">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;