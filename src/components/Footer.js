import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // 🚀 ADDED: useLocation
import axios from "axios";

export default function Footer() {
  // 1. State to hold dynamic business info
  const [storeData, setStoreData] = useState({
    contactNumber: "+91 98765 43210",
    supportEmail: "support@madfoodzone.com",
    storeAddress: "Gachibowli, Hyderabad"
  });

  // 🚀 ADDED: Track the current page route
  const location = useLocation();

  // 2. Function to fetch data from your existing settings API
  const fetchSettings = async () => {
    try {
      // Added a timestamp to prevent the browser from showing old cached data
      const res = await axios.get(`https://swiggyclone-backend-4av6.onrender.com/api/settings?t=${Date.now()}`);
      if (res.data) {
        setStoreData({
          contactNumber: res.data.contactNumber || "+91 9898989898",
          supportEmail: res.data.supportEmail || "support@madfoodzone.com",
          storeAddress: res.data.storeAddress || "Gachibowli, Hyderabad"
        });
      }
    } catch (err) {
      console.log("Using default footer info");
    }
  };

  useEffect(() => {
    fetchSettings();

    // 3. Listen for the "settingsUpdated" event from Profile.js for instant updates
    window.addEventListener("settingsUpdated", fetchSettings);
    
    return () => window.removeEventListener("settingsUpdated", fetchSettings);
  }, [location]); // 🚀 FIXED: Added 'location' here so it refetches on every page change!

  return (
    <footer style={{ 
      background: 'var(--bg-secondary)', 
      padding: '50px 20px 20px 20px', 
      marginTop: '50px',
      borderTop: '1px solid var(--border-color)' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '40px' 
      }}>
        
        {/* Brand Section */}
        <div>
          <h2 style={{ color: 'var(--swiggy-orange)', marginBottom: '15px' }}>🍔 MAD FOOD ZONE</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
            Bringing the best flavors of Hyderabad right to your doorstep. Lightning fast delivery, every time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '20px' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link 
                to="/" 
                style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                onClick={() => {
                  // 4. Force a reset if already on home page to clear category views
                  if (window.location.pathname === "/") {
                    window.location.reload(); 
                  }
                }}
              >
                Home
              </Link>
            </li>
            <li><Link to="/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Help & Support</Link></li>
            <li><Link to="/profile" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>My Account</Link></li>
          </ul>
        </div>

        {/* Contact Details - Now Dynamic! */}
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '20px' }}>Contact Us</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>📍 {storeData.storeAddress}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>📞 {storeData.contactNumber}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>📧 {storeData.supportEmail}</p>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '40px auto 0 auto', 
        paddingTop: '20px', 
        borderTop: '1px solid var(--border-color)', 
        textAlign: 'center' 
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          © {new Date().getFullYear()} Mad Food Zone. Made with ❤️ in Hyderabad.
        </p>
      </div>
    </footer>
  );
}