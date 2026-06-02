import React from 'react';
import { motion } from 'framer-motion';

export default function HeroPremium() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0 20px' }}>
      
      {/* Background Ambient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'var(--swiggy-orange)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, opacity: 0.3 }}
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '35vw', height: '35vw', background: 'var(--swiggy-green)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, opacity: 0.2 }}
      />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
        
        {/* Left Side: Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ flex: '1 1 500px', maxWidth: '600px' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(252, 128, 25, 0.1)', border: '1px solid rgba(252, 128, 25, 0.3)', borderRadius: '30px', color: 'var(--swiggy-orange)', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}
          >
            🚀 Lightning Fast Delivery
          </motion.div>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 65px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px 0', color: 'var(--text-main)', letterSpacing: '-1px' }}>
            Craving Something <br/>
            <span style={{ 
              background: 'linear-gradient(90deg, #ff7e5f, #feb47b)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Extraordinary?
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '500px' }}>
            Discover the best food and drinks in Hyderabad. Fresh ingredients, authentic flavors, and lightning-fast delivery directly to your door.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glow"
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
              style={{ 
                background: 'var(--swiggy-orange)', color: '#fff', border: 'none', 
                padding: '16px 36px', fontSize: '18px', fontWeight: 'bold', 
                borderRadius: '50px', cursor: 'pointer', 
                boxShadow: '0 10px 25px rgba(252, 128, 25, 0.4)',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              Order Now
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side: Floating Premium Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <motion.img 
            src="https://i.ibb.co/VXhfsQZ/CHICKEN-DUM-BIRYANI.jpg" 
            alt="Premium Biryani"
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ 
              width: '100%', maxWidth: '450px', height: 'auto', 
              borderRadius: '50%', objectFit: 'cover', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              border: '10px solid var(--bg-secondary)'
            }}
          />
          
          {/* Floating Badges */}
          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="glass-panel"
            style={{ position: 'absolute', top: '10%', right: '5%', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 12 }}
          >
             ⭐ 4.9 Rating
          </motion.div>
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="glass-panel"
            style={{ position: 'absolute', bottom: '15%', left: '0%', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 12 }}
          >
             🔥 Super Fast
          </motion.div>
        </motion.div>
        
      </div>
    </div>
  );
}
