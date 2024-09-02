import React, { useContext, useState } from 'react';
import '../styles/LoginRegister.css';
import { Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To handle errors
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    const inputs = { username, email, password };

    try {
      await register(inputs);
    } catch (err) {
      setError('Registration failed. Please try again.'); // Handle registration errors
    }
  };

  return (
    <div className='formContainer'>
      <div className="smart-header">
        <div className="smart-logo">
          <h2><Link id='smart-logo-h2' to={'/'}>Smart Meet</Link></h2>
        </div>
      </div>

      <div className="formWrapper">
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="mb-3">
            <label htmlFor="exampleInputName" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p>Already registered? <Link to={'/login'}>Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
