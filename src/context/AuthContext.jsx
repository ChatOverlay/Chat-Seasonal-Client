// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isTokenValid = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verifyToken`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      console.log("Verification result:", result);
      return result.success;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // const isAuthenticated = token && isTokenValid(token);
    const isAuthenticated = token;
    setAuthenticated(isAuthenticated);

    if (!isAuthenticated && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
