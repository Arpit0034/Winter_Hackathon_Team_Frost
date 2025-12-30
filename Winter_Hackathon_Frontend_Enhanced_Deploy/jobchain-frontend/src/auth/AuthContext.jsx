import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeJWT(storedToken);
      if (decoded) {
        setToken(storedToken);
        setUser(decoded.sub || decoded.username);
        setRole(decoded.role || decoded.authorities?.[0]?.authority);
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    const decoded = decodeJWT(newToken);
    if (decoded) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(decoded.sub || decoded.username);
      setRole(decoded.role || decoded.authorities?.[0]?.authority);
      return decoded.role || decoded.authorities?.[0]?.authority;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};