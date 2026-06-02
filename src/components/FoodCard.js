import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Dynamic preparation time helper function
const getPrepTime = (category) => {
  const cat = category?.toLowerCase() || '';
  
  if (cat.includes('beverage') || cat.includes('tea') || cat.includes('drinks') || cat.includes('juice') || cat.includes('ice cream')) {
    return '5-10 MINS';
  } else if (cat.includes('tiffin') || cat.includes('fast food') || cat.includes('snacks') || cat.includes('burger')) {
    return '15-20 MINS';
  } else if (cat.includes('biryani') || cat.includes('pizza') || cat.includes('meals') || cat.includes('main course')) {
    return '35-45 MINS';
  } else {
    return '25-30 MINS'; 
  }
};

export default function FoodCard({ food }) {
  const { cart, addToCart, increaseQty, decreaseQty } = useContext(CartContext);
  const item = cart.find(i => i._id === food._id);

  // Framer Motion 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div 
      className="swiggy-food-card glass-panel deep-shadow" 
      onMouseMove={handleMouse} 
      onMouseLeave={handleMouseLeave}
      style={{ 
        perspective: 1000,
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
        background: "var(--bg-main)",
        borderRadius: "16px",
        overflow: "hidden"
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div className="image-container" style={{ transform: "translateZ(50px)" }}>
        <img src={food.image} alt={food.name} />
        <div className="add-btn-wrapper">
          {!item ? (
            <motion.button 
              className="swiggy-add-btn btn-glow" 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addToCart(food)}
            >
              ADD
            </motion.button>
          ) : (
            <motion.div className="swiggy-qty-controls" whileHover={{ scale: 1.05 }}>
              <button onClick={() => decreaseQty(food._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(food._id)}>+</button>
            </motion.div>
          )}
        </div>
      </motion.div>
      <motion.div className="food-info" style={{ transform: "translateZ(30px)", padding: "25px 10px 10px 10px" }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {food.name}
        </h3>
        
        <p style={{ fontWeight: "bold", textShadow: "0 0 10px rgba(252,128,25,0.4)", color: "var(--swiggy-orange)" }}>
          ₹{food.price}
        </p>

        <div className="food-rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginTop: '8px' }}>
          <span style={{ 
            background: food.rating >= 4 ? 'var(--swiggy-green)' : food.rating > 0 ? '#db7c38' : '#e9e9eb', 
            color: food.rating > 0 ? 'white' : 'black', 
            padding: '2px 6px', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            ⭐ {food.rating > 0 ? food.rating.toFixed(1) : "NEW"}
          </span>

          <span>• {food.numReviews} {food.numReviews === 1 ? 'Rating' : 'Ratings'}</span>
          <span>• {getPrepTime(food.category)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}