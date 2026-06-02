import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"; 
import FoodCard from "../components/FoodCard";
import Hero3D from "../components/Hero3D";
import ChefSpecial from "../components/ChefSpecial";
import Statistics from "../components/Statistics";
import Testimonials from "../components/Testimonials";
import { motion } from "framer-motion";

const socket = io("https://swiggyclone-backend-1.onrender.com");

const promoGradients = [
  "linear-gradient(135deg, #ff7e5f, #feb47b)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #ff0844, #ffb199)"
];

// Stagger variants for framer motion
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isNonVegOnly, setIsNonVegOnly] = useState(false);
  const [activePromos, setActivePromos] = useState([]);
  
  useEffect(() => {
    socket.on("orderStatusChanged", (updatedOrder) => {
      const orderId = updatedOrder._id.substring(updatedOrder._id.length - 6);
      alert(`🔔 Live Update! Order #${orderId} status changed to: ${updatedOrder.status}`);
    });

    const fetchActivePromos = async () => {
      try {
        const res = await axios.get("https://swiggyclone-backend-1.onrender.com/api/promos/active");
        setActivePromos(res.data);
      } catch (err) {
        console.error("Error fetching promos", err);
      }
    };
    fetchActivePromos();

    return () => socket.off("orderStatusChanged");
  }, []);

  const categories = [
    { name: "Biryani", image: "https://i.ibb.co/VXhfsQZ/CHICKEN-DUM-BIRYANI.jpg" },
    { name: "Tiffins", image: "https://i.ibb.co/JWx1F7p7/IDLY.jpg" },
    { name: "Meals", image: "https://i.ibb.co/0RdHDjpW/FULL-MEALS-NONVEG.jpg" },
    { name: "Fried Rice", image: "https://i.ibb.co/7Jtv5MtX/VEG-FRIED-RICE.jpg" },
    { name: "Snacks", image: "https://i.ibb.co/2159f6qZ/FRENCH-FRIES.jpg" },
    { name: "Ice Creams", image: "https://i.ibb.co/Rkyv0qYv/BUTTERSCOTCH.jpg" },
    { name: "Tea & Coffee", image: "https://i.ibb.co/3y93KXfr/TEA.jpg" },
    { name: "Burger", image: "https://i.ibb.co/Nn3j9Xgs/VEG-CRISPY-BURGER.jpg" },
    { name: "Pizza", image: "https://i.ibb.co/vNdhm3x/PANEER-TIKKA-PIZZA.jpg" },
    { name: "Beverages", image: "https://i.ibb.co/Pzh8qmzk/COKE.jpg" },
    { name: "Cakes", image: "https://i.ibb.co/Jw8Dg66J/CHOCOLATE-CAKE.jpg" }
  ];

  const fetchFoods = async (cat) => {
    setLoading(true);
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const res = await axios.get(`https://swiggyclone-backend-1.onrender.com/api/foods/${cat}`);
      setFoods(res.data);
    } catch (err) {
      console.log("Error fetching foods", err);
    }
    setLoading(false);
  };

  const resetView = () => {
    setSelectedCategory("");
    setFoods([]);
    setSearchTerm(""); 
    setIsVegOnly(false); 
    setIsNonVegOnly(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (isVegOnly && food.isVeg === false) return false;
    if (isNonVegOnly && food.isVeg === true) return false;
    return matchesSearch;
  });

  return (
    <div className="home-wrapper">
      <div className="scrolling-banner">
        <div className="marquee-content">
          <span>🔥 MEGA SAVINGS: Get 50% OFF up to ₹100 on your first order!</span>
          <span>🚀 Lightning Fast 30-Minute Delivery across Hyderabad!</span>
          <span>🍰 Satisfy your sweet tooth with our new Dessert partners!</span>
          <span>✨ Fresh Ingredients, Authentic Taste!</span>
          <span>🔥 MEGA SAVINGS: Get 50% OFF up to ₹100 on your first order!</span>
          <span>🚀 Lightning Fast 30-Minute Delivery across Hyderabad!</span>
        </div>
      </div>

      {!selectedCategory && (
        <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'var(--bg-main)' }}>
          <Hero3D />
          
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 20px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="glass-panel"
              style={{ padding: '40px', borderRadius: '24px', maxWidth: '550px', backdropFilter: 'blur(20px)' }}
            >
              <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.1 }}>
                Discover Extraordinary <br/> <span style={{ color: 'var(--swiggy-orange)' }}>Food Experiences</span>
              </h1>
              <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '30px' }}>
                Fresh, Delicious, Delivered Fast.
              </p>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <motion.button 
                  className="btn-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'var(--swiggy-orange)', color: '#fff', border: 'none', padding: '15px 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(252, 128, 25, 0.3)' }}
                >
                  Order Now
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'transparent', color: 'var(--text-main)', border: '2px solid var(--border-color)', padding: '15px 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer' }}
                >
                  Explore Menu
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="swiggy-home" style={{ position: 'relative', zIndex: 20 }}>
        {!selectedCategory ? (
          <>
            <motion.div 
              className="section-header" 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ marginTop: '40px' }}
            >
              <h2 className="section-title">What's on your mind?</h2>
              <hr className="title-underline" />
            </motion.div>

            <motion.div 
              className="visual-category-grid perspective-container"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {categories.map((cat, index) => (
                <motion.div 
                  key={cat.name} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, rotateY: 10, rotateX: 10, y: -10 }}
                  className="visual-category-card" 
                  onClick={() => fetchFoods(cat.name)}
                  style={{ transformStyle: 'preserve-3d', cursor: 'pointer' }}
                >
                  <div className="img-overlay-wrapper" style={{ transform: 'translateZ(30px)' }}>
                    <img src={cat.image} alt={cat.name} />
                  </div>
                  <h3 style={{ transform: 'translateZ(20px)' }}>{cat.name}</h3>
                </motion.div>
              ))}
            </motion.div>

            {activePromos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="section-header" style={{ marginTop: '60px' }}>
                  <h2 className="section-title">Today's Special Offers</h2>
                  <hr className="title-underline" />
                </div>
                
                <div className="offers-banner hide-scrollbar" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', paddingTop: '10px' }}>
                   {activePromos.map((promo, index) => (
                     <motion.div 
                       key={promo._id} 
                       whileHover={{ scale: 1.05, y: -5 }}
                       style={{ 
                         flex: '0 0 auto', 
                         minWidth: '280px', 
                         background: promoGradients[index % promoGradients.length], 
                         borderRadius: '12px', padding: '20px', color: '#fff', 
                         boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' 
                       }}>
                       <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '800', color: '#fff' }}>
                         {promo.discountType === 'FLAT' ? `Flat ₹${promo.discountValue} OFF` : `${promo.discountValue}% OFF`}
                       </h3>
                       <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.9 }}>
                         {promo.minOrderAmount > 0 ? `On orders above ₹${promo.minOrderAmount}` : 'Valid on any order amount!'}
                       </p>
                       <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '8px', display: 'inline-block', border: '1px dashed #fff', fontWeight: 'bold', letterSpacing: '2px', color: '#fff' }}>
                         {promo.code}
                       </div>
                     </motion.div>
                   ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="category-view-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="category-header-sticky glass-panel" style={{ borderRadius: '0 0 20px 20px', padding: '20px', margin: '-20px -20px 30px -20px' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="back-btn" 
                onClick={resetView}
              >
                <span className="back-arrow">←</span> Back to all categories
              </motion.button>
              <h2 className="section-title" style={{ margin: 0, marginLeft: '20px' }}>Explore Best {selectedCategory}s</h2>
            </div>

            <div className="filter-bar glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', alignItems: 'center', padding: '15px', borderRadius: '12px' }}>
              <input 
                type="text" 
                placeholder={`Search in ${selectedCategory}...`} 
                className="swiggy-input"
                style={{ flex: 1, minWidth: '250px', marginBottom: 0, border: 'none', background: 'var(--bg-secondary)', borderRadius: '8px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: 'var(--text-main)' }}>
                <input 
                  type="checkbox" 
                  checked={isVegOnly}
                  onChange={(e) => {
                    setIsVegOnly(e.target.checked);
                    if (e.target.checked) setIsNonVegOnly(false);
                  }}
                  style={{ accentColor: 'var(--swiggy-green)', transform: 'scale(1.3)', cursor: 'pointer' }}
                />
                Pure Veg Only <span style={{ color: 'var(--swiggy-green)' }}>🟩</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: 'var(--text-main)' }}>
                <input 
                  type="checkbox" 
                  checked={isNonVegOnly}
                  onChange={(e) => {
                    setIsNonVegOnly(e.target.checked);
                    if (e.target.checked) setIsVegOnly(false);
                  }}
                  style={{ accentColor: '#db7c38', transform: 'scale(1.3)', cursor: 'pointer' }}
                />
                Non-Veg Only <span style={{ color: '#db7c38' }}>🟥</span>
              </label>
            </div>

            {loading ? (
              <div className="loading-pulse">
                <div className="spinner"></div>
                <p>Cooking up results...</p>
              </div>
            ) : filteredFoods.length > 0 ? (
              <motion.div 
                className="food-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredFoods.map((food, index) => (
                  <motion.div key={food._id} variants={itemVariants}>
                    <FoodCard food={food} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="empty-state glass-panel"
              >
                <div className="empty-state-icon">🍽️</div>
                <h2>Nothing found!</h2>
                <p>Try adjusting your search or modifying your filters.</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="swiggy-pay-btn" 
                  onClick={() => { setSearchTerm(""); setIsVegOnly(false); setIsNonVegOnly(false); }}
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* 🌟 NEW PREMIUM SECTIONS 🌟 */}
      {!selectedCategory && (
        <>
          <ChefSpecial />
          <Statistics />
          <Testimonials />
        </>
      )}

    </div>
  );
}