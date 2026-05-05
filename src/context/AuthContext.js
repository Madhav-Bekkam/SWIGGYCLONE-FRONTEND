import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("swiggyUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    localStorage.setItem("swiggyUser", JSON.stringify(userData.user));
    localStorage.setItem("swiggyToken", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("swiggyUser");
    localStorage.removeItem("swiggyToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};