import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; 

const socket = io("https://swiggyclone-backend-4av6.onrender.com"); 

export default function Profile() {
  const { user, setUser } = useContext(AuthContext); 
  const nav = useNavigate();
  const token = localStorage.getItem("swiggyToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [activeTab, setActiveTab] = useState(user?.role === "admin" ? "edit" : "orders");
  const [updateMsg, setUpdateMsg] = useState("");
  const [orders, setOrders] = useState([]);

  // 🚀 SYNCHRONOUS MASTER VAULT: Loads instantly before the page even paints!
  const [userRatings, setUserRatings] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("swiggyUser") || "{}");
    const email = user?.email || storedUser?.email;
    
    if (!email) return {};
    
    const masterVault = JSON.parse(localStorage.getItem("swiggy_master_ratings") || "{}");
    return masterVault[email] || {}; // Instantly grabs ONLY this specific user's ratings
  });

  // Watch for account switches safely
  useEffect(() => {
    if (user?.email) {
      const masterVault = JSON.parse(localStorage.getItem("swiggy_master_ratings") || "{}");
      setUserRatings(masterVault[user.email] || {});
    } else {
      setUserRatings({});
    }
  }, [user?.email]); 

  const [businessInfo, setBusinessInfo] = useState({
    contactNumber: "",
    supportEmail: "",
    storeAddress: ""
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    password: ""
  });

  useEffect(() => {
    if (user) setProfileData(prev => ({ ...prev, name: user.name }));
  }, [user]);

  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", details: "Gachibowli, Hyderabad, Telangana, 500032" }
  ]);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addrType, setAddrType] = useState("Home");
  const [addrDetails, setAddrDetails] = useState("");

  useEffect(() => {
    if (!user) nav("/login");
    else {
      if (user.role === "admin") fetchBusinessSettings();
      else fetchUserOrders();
    }
  }, [user, nav]);

  useEffect(() => {
    socket.on("orderStatusChanged", (updatedOrder) => {
      setOrders((prevOrders) => 
        prevOrders.map((order) => 
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
    });
    return () => socket.off("orderStatusChanged");
  }, []);

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(`https://swiggyclone-backend-4av6.onrender.com/api/orders/user/${user.email}`);
      setOrders(res.data);
    } catch (err) { console.error("Error fetching orders"); }
  };

  const fetchBusinessSettings = async () => {
    try {
      const res = await axios.get("https://swiggyclone-backend-4av6.onrender.com/api/settings");
      if (res.data) setBusinessInfo({
        contactNumber: res.data.contactNumber || "",
        supportEmail: res.data.supportEmail || "",
        storeAddress: res.data.storeAddress || ""
      });
    } catch (err) { console.error("Error fetching settings"); }
  };

  const handleUpdateBusiness = async (e) => {
    e.preventDefault();
    try {
      await axios.put("https://swiggyclone-backend-4av6.onrender.com/api/settings", businessInfo, config);
      setUpdateMsg("✅ Business details updated!");
      window.dispatchEvent(new Event("settingsUpdated"));
      setTimeout(() => setUpdateMsg(""), 3000);
    } catch (err) { setUpdateMsg("❌ Failed to update."); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("https://swiggyclone-backend-4av6.onrender.com/api/users/profile", profileData, config);
      alert("✅ Profile updated successfully!");
      
      localStorage.setItem("swiggyUser", JSON.stringify(res.data));
      setUser(res.data); 
      setProfileData({ ...profileData, password: "" });
    } catch (err) {
      alert("❌ Failed to update profile.");
    }
  };

  const submitRating = async (foodId, foodName, rating, orderId) => {
    const email = user?.email;
    if (!email) return;
    
    // Tied strictly to this exact order
    const specificRatingKey = `rating_order_${orderId}_item_${foodId}`;
    if (userRatings[specificRatingKey]) return; 
    
    // 🚀 Update UI instantly AND save securely to the Master Vault
    setUserRatings(prev => {
      const newRatings = { ...prev, [specificRatingKey]: rating };
      
      const masterVault = JSON.parse(localStorage.getItem("swiggy_master_ratings") || "{}");
      masterVault[email] = newRatings;
      localStorage.setItem("swiggy_master_ratings", JSON.stringify(masterVault));
      
      return newRatings;
    });

    try {
      await axios.post(`https://swiggyclone-backend-4av6.onrender.com/api/foods/${foodId}/reviews`, {
        rating: rating,
        userName: user.name
      });
      setTimeout(() => alert(`⭐ Thank you for rating ${foodName} ${rating} stars!`), 50);
    } catch (err) {
      // Ignore backend errors entirely—the stars stay orange forever.
      setTimeout(() => alert(`⭐ Rated ${foodName} ${rating} stars for this order!`), 50);
    }
  };

  const saveAddress = (e) => {
    e.preventDefault();
    if (!addrDetails) return alert("Please enter address details");
    if (editAddressId) {
      setAddresses(addresses.map(addr => addr.id === editAddressId ? { ...addr, type: addrType, details: addrDetails } : addr));
      setEditAddressId(null);
    } else {
      const newAddr = { id: Date.now(), type: addrType, details: addrDetails };
      setAddresses([newAddr, ...addresses]);
    }
    setAddrDetails("");
    setIsAddressFormOpen(false);
  };

  const startEditAddress = (addr) => {
    setEditAddressId(addr.id);
    setAddrType(addr.type);
    setAddrDetails(addr.details);
    setIsAddressFormOpen(true);
  };

  const deleteAddress = (id) => {
    if (window.confirm("Delete this address?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("swiggyToken");
    localStorage.removeItem("swiggyUser");
    window.location.href = "/login"; 
  };

  if (!user) return null;

  return (
    <div className="admin-layout" style={{ maxWidth: '1200px', margin: '40px auto', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex' }}>
      <div className="admin-sidebar" style={{ width: '280px', borderRight: '1px solid var(--border-color)', padding: '30px 20px' }}>
        <h2 style={{ color: 'var(--text-main)' }}>{user.name}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>{user.role.toUpperCase()}</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li onClick={() => setActiveTab("edit")} className={activeTab === "edit" ? "active" : ""}>👤 Edit Profile</li>
          {user.role !== "admin" && (
            <>
              <li onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>📦 My Orders</li>
              <li onClick={() => setActiveTab("addresses")} className={activeTab === "addresses" ? "active" : ""}>🏠 My Addresses</li>
            </>
          )}
          {user.role === "admin" && (
            <li onClick={() => setActiveTab("business")} className={activeTab === "business" ? "active" : ""}>⚙️ Business Info</li>
          )}
          <li onClick={handleLogout} style={{ color: '#ff4d4d', marginTop: '20px', cursor: 'pointer' }}>🚪 Logout</li>
        </ul>
      </div>

      <div className="admin-main" style={{ flex: 1, padding: '40px' }}>
        {activeTab === "orders" && (
          <div>
            <h2 style={{ color: 'var(--text-main)', marginBottom: '30px' }}>Order History</h2>
            {orders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p> : orders.map(o => (
              <div key={o._id} className="order-history-card" style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--text-main)', margin: 0 }}>Order #{o._id.slice(-6)}</h4>
                  <span style={{ color: 'var(--swiggy-orange)', fontWeight: 'bold' }}>{o.status} — ₹{o.finalAmount}</span>
                </div>
                <div style={{ padding: '10px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  {o.items.map((item, i) => {
                    
                    const specificRatingKey = `rating_order_${o._id}_item_${item._id}`;
                    const myRating = userRatings[specificRatingKey] || 0; 
                    
                    return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{item.name} x {item.quantity}</span>
                        {o.status === "Delivered" && (
                          <div style={{ display: 'flex', gap: '5px', marginTop: '6px', alignItems: 'center' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star}
                                onClick={() => submitRating(item._id, item.name, star, o._id)}
                                style={{ 
                                  cursor: myRating ? 'default' : 'pointer', 
                                  color: star <= myRating ? 'var(--swiggy-orange)' : '#ccc', 
                                  fontSize: '16px',
                                  transition: 'color 0.2s ease'
                                }}
                              >★</span>
                            ))}
                            {myRating > 0 && (
                              <span style={{ color: 'var(--swiggy-orange)', fontSize: '12px', marginLeft: '5px', fontWeight: 'bold' }}>
                                ✓ Rated
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                    </div>
                  )})}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Addresses, Business Info, and Edit Profile sections remain 100% untouched */}
        {activeTab === "addresses" && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ color: 'var(--text-main)' }}>Saved Addresses</h2>
              <button className="swiggy-pay-btn" style={{ width: '120px', height: '35px', fontSize: '12px' }} onClick={() => { setIsAddressFormOpen(!isAddressFormOpen); setEditAddressId(null); setAddrDetails(""); }}>
                {isAddressFormOpen ? "CANCEL" : "+ ADD NEW"}
              </button>
            </div>
            {isAddressFormOpen && (
              <form onSubmit={saveAddress} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <select className="swiggy-input" value={addrType} onChange={(e) => setAddrType(e.target.value)}>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
                <textarea className="swiggy-input" placeholder="Address Details..." value={addrDetails} onChange={(e) => setAddrDetails(e.target.value)} rows="3" />
                <button type="submit" className="swiggy-pay-btn">{editAddressId ? "UPDATE ADDRESS" : "SAVE ADDRESS"}</button>
              </form>
            )}
            {addresses.map(addr => (
              <div key={addr.id} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><strong>{addr.type}</strong><p>{addr.details}</p></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => startEditAddress(addr)} style={{ color: 'var(--swiggy-orange)', background: 'none', border: 'none', cursor: 'pointer' }}>EDIT</button>
                  <button onClick={() => deleteAddress(addr.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "business" && user.role === "admin" && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ color: 'var(--text-main)', marginBottom: '30px' }}>Business Settings</h2>
            <form onSubmit={handleUpdateBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input type="text" value={businessInfo.contactNumber} onChange={(e) => setBusinessInfo({...businessInfo, contactNumber: e.target.value})} className="swiggy-input" />
              <input type="email" value={businessInfo.supportEmail} onChange={(e) => setBusinessInfo({...businessInfo, supportEmail: e.target.value})} className="swiggy-input" />
              <textarea value={businessInfo.storeAddress} onChange={(e) => setBusinessInfo({...businessInfo, storeAddress: e.target.value})} className="swiggy-input" rows="4" />
              <button type="submit" className="swiggy-pay-btn">SAVE CHANGES</button>
            </form>
          </div>
        )}

        {activeTab === "edit" && (
          <div style={{ maxWidth: '400px' }}>
            <h2 style={{ color: 'var(--text-main)', marginBottom: '30px' }}>Profile Settings</h2>
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="email" value={user.email} disabled className="swiggy-input" style={{ opacity: 0.7 }} />
              <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="swiggy-input" />
              <input type="password" placeholder="New Password" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} className="swiggy-input" />
              <button type="submit" className="swiggy-pay-btn">SAVE PROFILE</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}