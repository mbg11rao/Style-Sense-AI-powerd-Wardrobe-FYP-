// In AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check local storage for user info on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user)); // Save to local storage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Clear from local storage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
