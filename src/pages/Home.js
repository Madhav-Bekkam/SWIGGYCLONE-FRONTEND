import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"; 
import FoodCard from "../components/FoodCard";

const socket = io("https://swiggyclone-backend-4av6.onrender.com");

// 🎨 Array of gradients to cycle through for dynamic promo cards
const promoGradients = [
  "linear-gradient(135deg, #ff7e5f, #feb47b)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #ff0844, #ffb199)"
];

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 🧠 State for Advanced Filters & Promos
  const [searchTerm, setSearchTerm] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [activePromos, setActivePromos] = useState([]); // 🚀 NEW: State for Promos
  
  // Dynamic Hero Text Animation
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = ["Biryani?", "a juicy Burger?", "hot Pizza?", "crispy Dosa?", "Ice Cream?", "a cold Drink?"];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  // 🔌 Real-Time Order Tracking & Promos Fetch
  useEffect(() => {
    socket.on("orderStatusChanged", (updatedOrder) => {
      const orderId = updatedOrder._id.substring(updatedOrder._id.length - 6);
      alert(`🔔 Live Update! Order #${orderId} status changed to: ${updatedOrder.status}`);
    });

    // 🚀 NEW: Fetch Active Promos on Load
    const fetchActivePromos = async () => {
      try {
        const res = await axios.get("https://swiggyclone-backend-4av6.onrender.com/api/promos/active");
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
      const res = await axios.get(`https://swiggyclone-backend-4av6.onrender.com/api/foods/${cat}`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVeg = isVegOnly ? food.isVeg === true : true;
    return matchesSearch && matchesVeg;
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

      <div className="swiggy-home">
        {!selectedCategory ? (
          <>
            <div className="premium-hero animate-fade-up">
              <h1>Craving <span className="animated-text">{phrases[phraseIndex]}</span></h1>
              <p className="hero-subtext">Tap. Order. Eat. Repeat.</p>
            </div>

            <div className="section-header animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="section-title">What's on your mind?</h2>
              <hr className="title-underline" />
            </div>

            <div className="visual-category-grid">
              {categories.map((cat, index) => (
                <div 
                  key={cat.name} 
                  className="visual-category-card" 
                  onClick={() => fetchFoods(cat.name)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="img-overlay-wrapper">
                    <img src={cat.image} alt={cat.name} />
                    <div className="overlay-gradient"></div>
                  </div>
                  <h3>{cat.name}</h3>
                </div>
              ))}
            </div>

            {/* 🚀 DYNAMIC: Only renders if there are active promos in the DB */}
            {activePromos.length > 0 && (
              <>
                <div className="section-header animate-fade-up" style={{ animationDelay: '0.6s', marginTop: '60px' }}>
                  <h2 className="section-title">Today's Special Offers</h2>
                  <hr className="title-underline" />
                </div>
                
                <div className="offers-banner animate-fade-up hide-scrollbar" style={{ 
                  animationDelay: '0.8s', display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', paddingTop: '10px'
                }}>
                   {activePromos.map((promo, index) => (
                     <div key={promo._id} style={{ 
                       flex: '0 0 auto', 
                       minWidth: '280px', 
                       // Uses modulo to cycle through the beautiful gradients endlessly
                       background: promoGradients[index % promoGradients.length], 
                       borderRadius: '12px', padding: '20px', color: '#fff', 
                       boxShadow: '0 4px 10px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' 
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
                     </div>
                   ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="category-view-container animate-fade-up">
            <div className="category-header-sticky">
              <button className="back-btn" onClick={resetView}>
                <span className="back-arrow">←</span> Back to all categories
              </button>
              <h2 className="section-title">Explore Best {selectedCategory}s</h2>
            </div>

            <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', alignItems: 'center', background: 'var(--bg-secondary)', padding: '15px', borderRadius: '12px' }}>
              <input 
                type="text" 
                placeholder={`Search in ${selectedCategory}...`} 
                className="swiggy-input"
                style={{ flex: 1, minWidth: '250px', marginBottom: 0, border: 'none', background: 'var(--bg-main)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: 'var(--text-main)' }}>
                <input 
                  type="checkbox" 
                  checked={isVegOnly}
                  onChange={(e) => setIsVegOnly(e.target.checked)}
                  style={{ accentColor: 'var(--swiggy-green)', transform: 'scale(1.3)', cursor: 'pointer' }}
                />
                Pure Veg Only <span style={{ color: 'var(--swiggy-green)' }}>🟩</span>
              </label>
            </div>

            {loading ? (
              <div className="loading-pulse">
                <div className="spinner"></div>
                <p>Cooking up results...</p>
              </div>
            ) : filteredFoods.length > 0 ? (
              <div className="food-grid">
                {filteredFoods.map((food, index) => (
                  <div key={food._id} className="staggered-food-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <FoodCard food={food} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🍽️</div>
                <h2>Nothing found!</h2>
                <p>Try adjusting your search or turning off the Veg filter.</p>
                <button className="swiggy-pay-btn" onClick={() => { setSearchTerm(""); setIsVegOnly(false); }}>Clear Filters</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}