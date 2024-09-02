import axios from "axios";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const handleApiError = (err) => {
    if (err.response) {
      // Server responded with a status other than 2xx
      return err.response.data.error || 'An unexpected error occurred. Please try again.';
    } else if (err.request) {
      // No response received from server
      return 'No response received from the server. Please check your internet connection.';
    } else {
      // Error setting up the request
      return err.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const login = async (inputs) => {
    try {
      const res = await axios.post('http://localhost:6001/auth/login', inputs);
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('userName', res.data.user.username);
      localStorage.setItem('userEmail', res.data.user.email);
      navigate('/');
    } catch (err) {
      console.error('Login error:', handleApiError(err));
      // Optionally: show an error notification to the user
    }
  };

  const register = async (inputs) => {
    try {
      const res = await axios.post('http://localhost:6001/auth/register', inputs);
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      localStorage.setItem('userName', res.data.user.username);
      localStorage.setItem('userEmail', res.data.user.email);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', handleApiError(err));
      // Optionally: show an error notification to the user
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err.message);
      // Optionally: show an error notification to the user
    }
  };

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
