import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

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

  return (
    <div className="swiggy-food-card">
      <div className="image-container">
        <img src={food.image} alt={food.name} />
        <div className="add-btn-wrapper">
          {!item ? (
            <button className="swiggy-add-btn" onClick={() => addToCart(food)}>ADD</button>
          ) : (
            <div className="swiggy-qty-controls">
              <button onClick={() => decreaseQty(food._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(food._id)}>+</button>
            </div>
          )}
        </div>
      </div>
      <div className="food-info">
        <h3>{food.name}</h3>
        
        <p style={{ fontWeight: "bold" }}>₹{food.price}</p>
      </div>

<div className="food-rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-muted)', marginTop: '8px' }}>
  
  <span style={{ 
    background: food.rating >= 4 ? 'var(--swiggy-green)' : food.rating > 0 ? '#db7c38' : '#e9e9eb', 
    color: food.rating > 0 ? 'white' : 'black', 
    padding: '2px 6px', 
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px'
  }}>
    ⭐ {food.rating > 0 ? food.rating.toFixed(1) : "NEW"}
  </span>

  <span>• {food.numReviews} {food.numReviews === 1 ? 'Rating' : 'Ratings'}</span>
  <span>• {getPrepTime(food.category)}</span>
  
</div>
    </div>
  );
}