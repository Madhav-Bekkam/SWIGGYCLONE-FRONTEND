import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 👈 Don't forget to import axios!

export default function Cart() {
  const { cart, increaseQty, decreaseQty, cartTotal } = useContext(CartContext);
  const nav = useNavigate();

  // 🚀 NEW STATES FOR DISCOUNTS
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Cart is empty!</h2>
        <p>Go grab some delicious food!</p>
        <button className="swiggy-pay-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => nav("/")}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  // 🧠 DYNAMIC MATH CALCULATIONS
  const itemTotal = cartTotal; // Pulled directly from your CartContext
  const deliveryFee = itemTotal > 500 ? 0 : 40; // Free delivery over ₹500!
  const finalTotal = (itemTotal + deliveryFee) - discountApplied;

  // 🎟️ PROMO VALIDATION API CALL
  const handleApplyPromo = async () => {
    if (!promoCode) return;
    
    try {
      const res = await axios.post("https://swiggyclone-backend-4av6.onrender.com/api/promo/validate", {
        code: promoCode,
        cartTotal: itemTotal
      });
      
      setDiscountApplied(res.data.discountAmount);
      setPromoMessage(res.data.message);
      
    } catch (err) {
      setDiscountApplied(0);
      setPromoMessage(`❌ ${err.response?.data?.message || "Invalid Promo Code"}`);
    }
  };

  return (
    <div className="swiggy-cart-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="section-title">Secure Checkout</h2>
      <hr className="title-underline" style={{ marginBottom: '30px' }} />

      {/* CART ITEMS LIST */}
      <div className="cart-items-container" style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
        {cart.map(i => (
          <div key={i._id} className="cart-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed var(--border-color)' }}>
            <span style={{ fontWeight: "bold", flex: 1, color: 'var(--text-main)' }}>{i.name}</span>
            
            <div className="swiggy-qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--bg-secondary)', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button onClick={() => decreaseQty(i._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-main)' }}>-</button>
              <span style={{ fontWeight: 'bold', color: 'var(--swiggy-green)' }}>{i.quantity}</span>
              <button onClick={() => increaseQty(i._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-main)' }}>+</button>
            </div>
            
            <span style={{ width: '80px', textAlign: 'right', fontWeight: 'bold', color: 'var(--text-main)' }}>
              ₹{i.price * i.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* 🚀 THE PROMO CODE UI */}
      <div className="promo-section" style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Offers & Benefits</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Enter Promo Code (Try MAD50)" 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="swiggy-input"
            style={{ marginBottom: 0, border: '1px dashed var(--text-muted)' }}
          />
          <button onClick={handleApplyPromo} className="swiggy-pay-btn" style={{ padding: '12px 25px', width: 'auto', margin: 0 }}>
            Apply
          </button>
        </div>
        {promoMessage && (
          <p style={{ color: promoMessage.includes("✅") ? 'var(--swiggy-green)' : '#ff3b3b', fontSize: '14px', marginTop: '10px', fontWeight: 'bold' }}>
            {promoMessage}
          </p>
        )}
      </div>

      {/* 🚀 THE DYNAMIC BILL SUMMARY */}
      <div className="bill-details" style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-main)' }}>Bill Details</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-muted)' }}>
          <span>Item Total</span>
          <span>₹{itemTotal}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-muted)' }}>
          <span>Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span style={{ color: 'var(--swiggy-green)', fontWeight: 'bold' }}>FREE</span>
          ) : (
            <span>₹{deliveryFee}</span>
          )}
        </div>

        {discountApplied > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--swiggy-green)', fontWeight: 'bold' }}>
            <span>Item Discount</span>
            <span>- ₹{discountApplied}</span>
          </div>
        )}

        <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--text-main)' }}>TO PAY</span>
          <span style={{ fontWeight: 'bold', fontSize: '22px', color: 'var(--text-main)' }}>₹{finalTotal}</span>
        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      <div style={{ marginTop: '30px' }}>
        <button 
          className="swiggy-pay-btn" 
          onClick={() => nav("/checkout", { state: { finalTotal, discountApplied, deliveryFee } })}
        >
          Proceed to Pay ₹{finalTotal}
        </button>
      </div>

    </div>
  );
}