import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("https://swiggyclone-backend-1.onrender.com");

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // 🚀 ADDED: State to remember user's ratings
  const [userRatings, setUserRatings] = useState(() => {
    const saved = localStorage.getItem("swiggyUserRatings");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    fetchMyOrders();

    socket.on("orderStatusChanged", (updatedOrder) => {
      setMyOrders((prevOrders) => 
        prevOrders.map((order) => 
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
    });

    return () => socket.off("orderStatusChanged");
  }, [user, nav]);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`https://swiggyclone-backend-1.onrender.com/api/orders/user/${user.email}`);
      setMyOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders");
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.put(`https://swiggyclone-backend-1.onrender.com/api/orders/${orderId}/cancel`);
        alert("✅ Order cancelled successfully. Refund will be initiated if paid online.");
        fetchMyOrders(); 
      } catch (err) {
        alert(err.response?.data?.message || "Could not cancel order.");
      }
    }
  };

  // 🚀 MODIFIED: Saves rating state and locks the stars
  const submitRating = async (foodId, foodName, rating) => {
    if (userRatings[foodId]) return; // Prevent double rating

    try {
      await axios.post(`https://swiggyclone-backend-1.onrender.com/api/foods/${foodId}/reviews`, {
        rating: rating,
        userName: user.name
      });
      alert(`⭐ Thank you for rating ${foodName} ${rating} stars!`);
      
      const newRatings = { ...userRatings, [foodId]: rating };
      setUserRatings(newRatings);
      localStorage.setItem("swiggyUserRatings", JSON.stringify(newRatings));
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting rating.");
    }
  };

  if (loading) return <div className="loading-pulse">Loading your food journey...</div>;

  return (
    <div className="swiggy-cart-page" style={{ maxWidth: '900px' }}>
      <h2 className="section-title">My Orders</h2>
      <hr className="title-underline" style={{ marginBottom: '30px' }} />

      {myOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧾</div>
          <h2>No orders yet!</h2>
          <p>You haven't placed any orders. Go grab some Biryani!</p>
          <button className="swiggy-pay-btn" onClick={() => nav("/")}>Browse Restaurants</button>
        </div>
      ) : (
        <div className="orders-list">
          {myOrders.map((order) => (
            <div key={order._id} className="order-history-card">
              
              <div className="order-card-header">
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Order #{order._id.substring(order._id.length - 6)}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className={`status-pill ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <hr className="divider" style={{ margin: '15px 0' }} />

              <div className="order-items-preview">
                {order.items.map((item, index) => {
                  const myRating = userRatings[item._id] || 0; // 🚀 Check if rated
                  return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>
                      {item.quantity} x {item.name}
                    </p>

                    {order.status === "Delivered" && (
                      <div className="star-rating-controls" style={{ display: 'flex', gap: '5px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star}
                            onClick={() => submitRating(item._id, item.name, star)}
                            style={{ 
                              cursor: myRating ? 'default' : 'pointer', 
                              color: star <= myRating ? 'var(--swiggy-orange)' : '#ccc', 
                              fontSize: '18px', 
                              transition: '0.2s' 
                            }}
                            onMouseOver={(e) => { if (!myRating) e.target.style.color = 'var(--swiggy-orange)' }}
                            onMouseOut={(e) => { if (!myRating) e.target.style.color = '#ccc' }}
                            title={myRating ? `You rated ${myRating} stars` : `Rate ${star} Stars`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )})} 
              </div>

              <div className="order-card-footer">
                <span className="font-bold" style={{ fontSize: '18px' }}>Total: ₹{order.finalAmount}</span>
                
                {(order.status === "Order Received" || order.status === "Cash on Delivery" || order.status === "Online Paid") && (
                  <button 
                    onClick={() => handleCancelOrder(order._id)}
                    style={{ background: 'transparent', color: '#ff3b3b', border: '1px solid #ff3b3b', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                    onMouseOver={(e) => { e.target.style.background = '#ff3b3b'; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ff3b3b'; }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}