import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const [storeData, setStoreData] = useState({
    contactNumber: "+91 98765 43210",
    supportEmail: "support@madfoodzone.com",
    storeAddress: "Gachibowli, Hyderabad"
  });

  const location = useLocation();

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`https://swiggyclone-backend-1.onrender.com/api/settings?t=${Date.now()}`);
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
    window.addEventListener("settingsUpdated", fetchSettings);
    return () => window.removeEventListener("settingsUpdated", fetchSettings);
  }, [location]);  return (
    <footer style={{ 
      background: 'var(--bg-main)', 
      position: 'relative',
      overflow: 'hidden',
      padding: '80px 20px 20px 20px', 
      marginTop: '50px',
      borderTop: '1px solid var(--border-color)' 
    }}>
      {/* Background Gradient Orbs */}
      <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "300px", height: "300px", borderRadius: "50%", background: "var(--swiggy-orange)", opacity: 0.05, filter: "blur(50px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-100px", right: "-100px", width: "300px", height: "300px", borderRadius: "50%", background: "var(--swiggy-green)", opacity: 0.05, filter: "blur(50px)", zIndex: 0 }} />

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '50px',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Brand Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ color: 'var(--swiggy-orange)', margin: '0 0 15px 0', fontSize: '28px' }}>🍔 MAD FOOD ZONE</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
            Bringing the best flavors of Hyderabad right to your doorstep. Lightning fast delivery, every time.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '18px' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {['Home', 'Help & Support', 'My Account'].map((link, i) => (
              <motion.li key={i} whileHover={{ x: 5, color: "var(--swiggy-orange)" }} style={{ display: "inline-block" }}>
                <Link 
                  to={link === 'Home' ? '/' : link === 'My Account' ? '/profile' : '/faq'} 
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
                  onClick={() => link === 'Home' && window.location.pathname === "/" && window.location.reload()}
                >
                  {link}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '18px' }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <motion.div whileHover={{ scale: 1.05, color: "var(--swiggy-orange)" }} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)' }}>
              <MapPin size={20} color="var(--swiggy-orange)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '15px', lineHeight: 1.4 }}>{storeData.storeAddress}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, color: "var(--swiggy-green)" }} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <Phone size={20} color="var(--swiggy-green)" />
              <span style={{ fontSize: '15px' }}>{storeData.contactNumber}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, color: "#1DA1F2" }} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <Mail size={20} color="#1DA1F2" />
              <span style={{ fontSize: '15px' }}>{storeData.supportEmail}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        style={{ 
          maxWidth: '1200px', 
          margin: '60px auto 0 auto', 
          paddingTop: '25px', 
          borderTop: '1px solid var(--border-color)', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          © {new Date().getFullYear()} Mad Food Zone. Made with ❤️ in Hyderabad.
        </p>
      </motion.div>
    </footer>
  );
}