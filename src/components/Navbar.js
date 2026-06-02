import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Sun, Moon, LayoutDashboard, Home } from "lucide-react";

const socket = io("https://swiggyclone-backend-1.onrender.com");

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadAdminOrders, setUnreadAdminOrders] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      socket.on("newOrderReceived", () => {
        setUnreadAdminOrders((prev) => prev + 1);
      });
      return () => socket.off("newOrderReceived");
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname === "/admin") {
      setUnreadAdminOrders(0);
    }
  }, [location.pathname]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { path: "/", name: "Home", icon: <Home size={18} /> },
  ];

  if (user?.role === "admin") {
    navLinks.push({ path: "/admin", name: "Dashboard", icon: <LayoutDashboard size={18} /> });
  }

  return (
    <motion.header 
      className={`swiggy-navbar ${isScrolled ? 'glass-panel' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ 
        position: 'sticky', top: 0, zIndex: 1000, 
        background: isScrolled ? (theme === 'dark' ? 'rgba(20,20,30,0.8)' : 'rgba(255,255,255,0.8)') : 'var(--bg-main)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-color)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="nav-container">
        
        {/* LOGO */}
        <motion.div 
          className="nav-brand" 
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <h2 style={{ margin: 0, background: 'linear-gradient(90deg, var(--swiggy-orange), #ff5a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MAD FOOD ZONE
          </h2>
        </motion.div>
        
        {/* RIGHT SIDE NAVIGATION */}
        <nav className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              style={{ position: 'relative', textDecoration: 'none', color: location.pathname === link.path ? "var(--swiggy-orange)" : "var(--text-main)", fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => link.path === "/admin" && setUnreadAdminOrders(0)}
            >
              {link.icon}
              {link.name}
              
              {link.path === "/admin" && unreadAdminOrders > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ background: '#ff3b3b', color: '#fff', borderRadius: '50px', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}
                >
                  {unreadAdminOrders}
                </motion.span>
              )}

              {/* Animated Hover Indicator */}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  style={{
                    position: 'absolute', bottom: '-25px', left: 0, right: 0, height: '3px', background: 'var(--swiggy-orange)', borderRadius: '3px 3px 0 0'
                  }}
                />
              )}
            </Link>
          ))}

          {/* THEME TOGGLE */}
          <motion.button 
            className="theme-toggle" 
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', padding: 0 }}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* CART: Hidden for Admins */}
          {(!user || user.role !== "admin") && (
            <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                style={{ color: location.pathname === "/cart" ? "var(--swiggy-orange)" : "var(--text-main)", display: 'flex', alignItems: 'center' }}
              >
                <ShoppingCart size={24} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      key={totalItems}
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      style={{ 
                        position: 'absolute', top: '-8px', right: '-12px',
                        background: 'var(--swiggy-orange)', color: 'white', 
                        borderRadius: '50%', width: '20px', height: '20px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(252, 128, 25, 0.4)'
                      }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )}
          
          {/* PROFILE / SIGN IN */}
          {user ? (
            <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: location.pathname === "/profile" ? "var(--swiggy-orange)" : "var(--text-main)", fontWeight: 600 }}>
              <motion.div whileHover={{ scale: 1.1 }} style={{ background: 'var(--bg-secondary)', padding: '8px', borderRadius: '50%' }}>
                <User size={18} />
              </motion.div>
              {user.name.split(" ")[0].toUpperCase()}
            </Link>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ background: 'var(--swiggy-orange)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <User size={18} /> SIGN IN
              </motion.button>
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}