import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 Imported useLocation

export default function Checkout() {
  const { cart, clearCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("online");
  
  const nav = useNavigate();
  const location = useLocation(); // 👈 This catches the data passed from Cart.js

  // 🚀 GRAB THE MATH FROM THE CART (Or provide fallbacks if they refreshed the page)
  const delivery = location.state?.deliveryFee ?? (cartTotal > 500 ? 0 : 40);
  const discount = location.state?.discountApplied ?? 0;
  const final = location.state?.finalTotal ?? (cartTotal + delivery - discount);

  useEffect(() => {
    if (!user) {
      alert("Please login to proceed to checkout!");
      nav("/login");
    }
    // We removed the settings fetch here because we are using the new Promo System math!
  }, [user, nav]);

  // 🚀 Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (paymentMethod === "cod") {
      saveOrderToDatabase("Cash on Delivery");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // 1. Create order on our backend using the PROPER final amount
      const result = await axios.post("https://swiggyclone-backend-1.onrender.com/api/payment/create", { amount: final });
      const { amount, id: order_id, currency } = result.data;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: "rzp_test_YourTestKeyHere", // Replace with your Test Key
        amount: amount.toString(),
        currency: currency,
        name: "MAD FOOD ZONE",
        description: "Food Delivery Transaction",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        order_id: order_id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyRes = await axios.post("https://swiggyclone-backend-1.onrender.com/api/payment/verify", verifyData);
          if (verifyRes.data.message === "Payment verified successfully") {
            saveOrderToDatabase("Online Paid");
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
          contact: "9999999999", 
        },
        theme: {
          color: "#fc8019", // Swiggy Orange
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the payment gateway.");
    }
  };

  const saveOrderToDatabase = async (statusMsg) => {
    await axios.post("https://swiggyclone-backend-1.onrender.com/api/orders", {
      items: cart,
      totalAmount: cartTotal,
      discount: discount, // 👈 Ensures the backend saves the promo discount!
      finalAmount: final, // 👈 Ensures the backend saves the discounted total!
      customer: user,
      status: statusMsg
    });
    clearCart();
    alert(`🎉 Order placed successfully via ${statusMsg}!`);
    nav("/orders"); // 👈 Changed this so they go straight to their order history to track it!
  };

  if (cart.length === 0) return <div className="empty-state"><h2>Cart is empty!</h2></div>;

  return (
    <div className="swiggy-checkout-page checkout-layout">
      
      {/* LEFT COLUMN: PAYMENT OPTIONS */}
      <div className="checkout-left">
        <div className="checkout-section-box">
          <div className="section-title-wrap">
            <span className="step-number">1</span>
            <h3>Delivery Address</h3>
          </div>
          <div className="address-card">
            <p className="font-bold">{user?.name}</p>
            <p className="text-muted">Gachibowli, Hyderabad, Telangana, 500032</p>
            <p className="text-muted">30 MINS DELIVERY</p>
          </div>
        </div>

        <div className="checkout-section-box active-step">
          <div className="section-title-wrap">
            <span className="step-number">2</span>
            <h3>Choose Payment Method</h3>
          </div>
          
          <div className="payment-options">
            <label className={`payment-card ${paymentMethod === 'online' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'online'} 
                onChange={() => setPaymentMethod('online')} 
              />
              <div className="payment-info">
                <h4>Pay via UPI / Cards</h4>
                <p>Google Pay, PhonePe, Credit & Debit Cards</p>
                <div className="payment-icons">
                  <span className="mock-icon">UPI</span>
                  <span className="mock-icon">VISA</span>
                </div>
              </div>
            </label>

            <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'cod'} 
                onChange={() => setPaymentMethod('cod')} 
              />
              <div className="payment-info">
                <h4>Pay on Delivery</h4>
                <p>Pay in cash or UPI when your order arrives</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: BILL DETAILS */}
      <div className="checkout-right">
        <div className="bill-details-card">
          <h3>Order Summary</h3>
          <div className="mini-cart-items">
            {cart.map(item => (
              <div key={item._id} className="mini-cart-row">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <hr className="divider" />
          <div className="bill-row"><span>Item Total</span><span>₹{cartTotal}</span></div>
          <div className="bill-row">
            <span>Delivery Fee</span>
            <span>{delivery === 0 ? <span className="text-green" style={{color: 'green', fontWeight: 'bold'}}>FREE</span> : `₹${delivery}`}</span>
          </div>
          {discount > 0 && (
            <div className="bill-row text-green" style={{color: 'green', fontWeight: 'bold'}}>
              <span>Promo Applied</span>
              <span>- ₹{discount}</span>
            </div>
          )}
          <hr className="divider" />
          <div className="bill-row final-total" style={{fontWeight: 'bold', fontSize: '18px', marginTop: '10px'}}>
            <span>TO PAY</span>
            <span>₹{final}</span>
          </div>
          
          <button className="swiggy-pay-btn full-width" onClick={handlePayment} style={{marginTop: '20px'}}>
            {paymentMethod === 'online' ? `PROCEED TO PAY ₹${final}` : `PLACE ORDER`}
          </button>
        </div>
      </div>
    </div>
  );
}