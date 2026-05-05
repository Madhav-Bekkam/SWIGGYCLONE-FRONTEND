import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Orders from "./pages/Orders";
import Profile from './pages/Profile';

// Component Imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // 👈 1. Added ScrollToTop Import
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import "./styles/app.css";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AuthProvider> 
          <Router>
            {/* 👈 2. Place ScrollToTop here so it runs on every route change */}
            <ScrollToTop /> 

            <Navbar />
            
            <main style={{ minHeight: '80vh' }}> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/faq" element={<FAQ />} />
              </Routes>
            </main>

            <Footer /> 
          </Router>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;