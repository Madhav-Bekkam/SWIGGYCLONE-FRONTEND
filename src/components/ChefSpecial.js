import React from "react";
import { motion } from "framer-motion";

export default function ChefSpecial() {
  return (
    <div style={{ padding: "80px 20px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px" }}>
        
        <motion.div 
          style={{ flex: "1 1 500px", position: "relative" }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "var(--swiggy-orange)", opacity: 0.2, filter: "blur(20px)", zIndex: -1 }}></div>
          <h2 style={{ fontSize: "40px", fontWeight: "900", margin: "0 0 20px 0", color: "var(--text-main)", lineHeight: 1.2 }}>
            The Chef's <span style={{ color: "var(--swiggy-orange)" }}>Signature</span> Collection
          </h2>
          <p style={{ fontSize: "18px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "30px" }}>
            Experience culinary perfection with our head chef's hand-picked selection. Curated with the finest ingredients and authentic recipes passed down through generations.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-glow"
            style={{ 
              background: "var(--swiggy-orange)", color: "#fff", border: "none", 
              padding: "15px 35px", fontSize: "16px", fontWeight: "bold", 
              borderRadius: "12px", cursor: "pointer", 
              boxShadow: "0 10px 20px rgba(252, 128, 25, 0.3)" 
            }}
          >
            Taste the Magic
          </motion.button>
        </motion.div>

        <motion.div 
          style={{ flex: "1 1 500px", position: "relative", height: "400px" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Main Dish */}
          <motion.img 
            src="https://i.ibb.co/VXhfsQZ/CHICKEN-DUM-BIRYANI.jpg" 
            alt="Chef Special Biryani"
            className="floating-slow deep-shadow"
            style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: "8px solid var(--bg-main)", zIndex: 2 }}
          />
          {/* Floating Accents */}
          <motion.div className="floating-fast glass-panel" style={{ position: "absolute", top: "20%", right: "10%", padding: "15px 20px", borderRadius: "12px", zIndex: 3, fontWeight: "bold", color: "var(--swiggy-orange)" }}>
            ⭐ 4.9 Top Rated
          </motion.div>
          <motion.div className="floating-slow glass-panel" style={{ position: "absolute", bottom: "15%", left: "5%", padding: "15px 20px", borderRadius: "12px", zIndex: 3, fontWeight: "bold", color: "var(--swiggy-green)" }}>
            🌿 Fresh Spices
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
