import React, { useContext, useState, useEffect } from "react"; // 🚀 ADDED: useState, useEffect
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client"; // 🚀 ADDED: Socket import

const socket = io("https://swiggyclone-backend-4av6.onrender.com"); // 🚀 ADDED: Socket connection

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Tracks current page

  // 🚀 ADDED: State to track unread orders for the Admin bubble
  const [unreadAdminOrders, setUnreadAdminOrders] = useState(0);

  // 🚀 ADDED: Listen for new orders if user is an admin
  useEffect(() => {
    if (user?.role === "admin") {
      socket.on("newOrderReceived", () => {
        setUnreadAdminOrders((prev) => prev + 1);
      });
      return () => socket.off("newOrderReceived");
    }
  }, [user]);

  // 🚀 ADDED: Clear the bubble if the admin visits the Dashboard page
  useEffect(() => {
    if (location.pathname === "/admin") {
      setUnreadAdminOrders(0);
    }
  }, [location.pathname]);

  // Calculate total items in the cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🎨 Determines if the link should be orange
  const getLinkStyle = (path) => ({
    color: location.pathname === path ? "var(--swiggy-orange)" : "var(--text-main)",
    fontWeight: location.pathname === path ? "bold" : "normal"
  });

  return (
    <header className="swiggy-navbar">
      <div className="nav-container">
        
        {/* LOGO */}
        <div className="nav-brand" onClick={() => navigate("/")}>
          <h2>🍔 MAD FOOD ZONE</h2>
        </div>
        
        {/* RIGHT SIDE NAVIGATION */}
        <nav className="nav-actions">
          <Link to="/" className="nav-link" style={getLinkStyle("/")}>
            Home
          </Link>
          
          {/* 👑 VIP ACCESS: Hidden for non-admins */}
          {user?.role === "admin" && (
            <Link 
              to="/admin" 
              className="nav-link" 
              style={getLinkStyle("/admin")}
              onClick={() => setUnreadAdminOrders(0)} // 🚀 ADDED: Clears on click
            >
              Dashboard
              {/* 🚀 ADDED: The Notification Bubble */}
              {unreadAdminOrders > 0 && (
                <span style={{ 
                  background: '#ff3b3b', 
                  color: '#fff', 
                  borderRadius: '50px', 
                  padding: '2px 6px',
                  marginLeft: '5px',
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  boxShadow: '0 0 5px rgba(255,59,59,0.5)'
                }}>
                  {unreadAdminOrders}
                </span>
              )}
            </Link>
          )}

          {/* THEME TOGGLE */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* CART: Hidden for Admins */}
          {(!user || user.role !== "admin") && (
            <Link to="/cart" className="nav-cart" style={getLinkStyle("/cart")}>
              Cart 
              {totalItems > 0 && (
                <span style={{ color: "var(--swiggy-orange)", marginLeft: "5px" }}>
                  ({totalItems})
                </span>
              )}
            </Link>
          )}
          
          {/* 🚀 THE SMART PROFILE/SIGN IN BUTTON */}
          {user ? (
            <Link to="/profile" className="nav-link" style={getLinkStyle("/profile")}>
              👤 {user.name.split(" ")[0].toUpperCase()}
            </Link>
          ) : (
            <Link to="/login" className="nav-link" style={getLinkStyle("/login")}>
              👤 SIGN IN
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}