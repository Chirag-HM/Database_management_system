import { createContext, useState, useEffect, useContext } from "react";
import {
  getToken,
  isTokenExpired,
  getCurrentUser,
  removeToken,
  loginUser,
  signupUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token && !isTokenExpired(token)) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user session", error);
          removeToken();
          setUser(null);
        }
      } else {
        removeToken(); // Clear invalid/expired token
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
  };

  const signup = async (name, email, password) => {
    const userData = await signupUser(name, email, password);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
