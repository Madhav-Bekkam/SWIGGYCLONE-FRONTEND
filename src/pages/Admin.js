import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client"; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const socket = io("http://localhost:5000"); 

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dashboard State
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});
  const [chartData, setChartData] = useState([]);
  const [promos, setPromos] = useState([]);
  const [newPromoCode, setNewPromoCode] = useState({ code: '', discountType: 'FLAT', discountValue: '', minOrderAmount: '' });
  
  // State to track unseen orders
  const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);

  // State to track which new orders the admin has explicitly acknowledged
  const [acknowledgedOrders, setAcknowledgedOrders] = useState({});

  // Menu Management State
  const [menuItems, setMenuItems] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", price: "", category: "Biryani", image: "", isVeg: true });

  // 🛠️ Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFoodId, setEditFoodId] = useState(null);

  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("swiggyToken");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // 💰 Calculate Total Revenue dynamically from orders
  const totalRevenue = orders
    .filter(order => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + (order.finalAmount || 0), 0);

  useEffect(() => {
    fetchDashboardData();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    socket.on("orderStatusChanged", (updatedOrder) => {
      setOrders((prevOrders) => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
    });

    socket.on("newOrderReceived", (newOrder) => {
      alert(`🚨 NEW ORDER ALERT! Order #${newOrder._id.substring(newOrder._id.length - 6)} just arrived for ₹${newOrder.finalAmount}!`);
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      setUnreadOrdersCount((prev) => prev + 1);
    });

    return () => {
      socket.off("orderStatusChanged");
      socket.off("newOrderReceived");
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await axios.get("http://localhost:5000/api/orders", config);
      setOrders(ordersRes.data);
      
      const promosRes = await axios.get("http://localhost:5000/api/promos", config);
      setPromos(promosRes.data);
      
      const chartRes = await axios.get("http://localhost:5000/api/orders/analytics/revenue", config);
      setChartData(chartRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data");
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/foods");
      setMenuItems(res.data);
    } catch (err) { console.error("Error fetching menu"); }
  };

  const updateSettings = async () => {
    await axios.put("http://localhost:5000/api/settings", settings, config);
    alert("✅ Store Settings Updated!");
  };

  const handleSubmitFood = async (e) => {
    e.preventDefault();
    
    const freshToken = localStorage.getItem("swiggyToken");
    const freshConfig = { headers: { Authorization: `Bearer ${freshToken}` } };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/foods/${editFoodId}`, newFood, freshConfig);
        alert("📝 Food item updated successfully!");
        cancelEdit();
      } else {
        await axios.post("http://localhost:5000/api/foods", newFood, freshConfig);
        alert("🍔 Food item added to menu!");
        setNewFood({ name: "", price: "", category: "Biryani", image: "", isVeg: true });
      }
      fetchMenuItems();
    } catch (err) {
      const serverError = err.response?.data?.message || err.message;
      alert(`Error: ${serverError}. Check console for details.`);
      console.error("Backend Error Details:", err);
    }
  };

  const startEditMode = (item) => {
    setIsEditMode(true);
    setEditFoodId(item._id);
    setNewFood({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
      isVeg: item.isVeg !== undefined ? item.isVeg : true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditFoodId(null);
    setNewFood({ name: "", price: "", category: "Biryani", image: "", isVeg: true });
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      try {
        await axios.delete(`http://localhost:5000/api/foods/${id}`, config);
        fetchMenuItems();
      } catch (err) { alert("Error deleting food"); }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, config);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Error updating order status.");
    }
  };

  const handleTogglePromo = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/promos/${id}/toggle`, {}, config);
      setPromos(promos.map(p => p._id === id ? { ...p, isActive: res.data.isActive } : p));
    } catch (err) {
      alert("Error toggling promo code");
    }
  };

  const handleDeletePromo = async (id) => {
    if (window.confirm("Are you sure you want to delete this promo code? This cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/promos/${id}`, config);
        setPromos(promos.filter(p => p._id !== id));
      } catch (err) {
        alert("Error deleting promo code");
      }
    }
  };

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/promos", newPromoCode, config);
      setPromos([res.data, ...promos]);
      setNewPromoCode({ code: '', discountType: 'FLAT', discountValue: '', minOrderAmount: '' });
      alert("Promo code created successfully!");
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || "Check your fields!"}`);
    }
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "dashboard") {
      setUnreadOrdersCount(0); 
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => switchTab("dashboard")}>
            Dashboard
            {unreadOrdersCount > 0 && (
              <span style={{ 
                background: '#ff3b3b', 
                color: '#fff', 
                borderRadius: '50px', 
                padding: '2px 8px', 
                marginLeft: '10px', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                boxShadow: '0 0 8px rgba(255,59,59,0.6)' 
              }}>
                {unreadOrdersCount}
              </span>
            )}
          </li>
          <li className={activeTab === "menu" ? "active" : ""} onClick={() => switchTab("menu")}>Menu Items</li>
        </ul>
      </div>

      <div className="admin-main">
        {/* ================= DASHBOARD TAB ================= */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="admin-title">Restaurant Dashboard</h1>
            
            <div className="metrics-grid">
              <div className="metric-card"><h3>Total Orders</h3><p className="metric-value">{orders.length}</p></div>
              <div className="metric-card"><h3>Revenue</h3><p className="metric-value text-green">₹{totalRevenue}</p></div>
            </div>

            {/* ANALYTICS CHART */}
            <div className="analytics-section" style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)' }}>Revenue Over Time</h3>
              {chartData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                      <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--swiggy-orange)" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : <p style={{ textAlign: 'center', padding: '40px 0' }}>No data available.</p>}
            </div>

            {/* PROMO MANAGEMENT */}
            <div className="admin-section-card" style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '20px' }}>Manage Promo Codes</h3>
              <form onSubmit={handleCreatePromo} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input 
                  type="text" placeholder="CODE" required className="swiggy-input" value={newPromoCode.code} 
                  onChange={e => setNewPromoCode({...newPromoCode, code: e.target.value})} style={{width: '130px', height: '45px', marginBottom: 0}} 
                />
                <select className="swiggy-input" value={newPromoCode.discountType} 
                  onChange={e => setNewPromoCode({...newPromoCode, discountType: e.target.value})} style={{
    width: '135px', 
    height: '45px', 
    marginBottom: 0, 
    padding: '0 10px',     
    lineHeight: '45px',    
    display: 'inline-block'
  }}>
                  <option value="FLAT">Flat ₹</option>
                  <option value="PERCENTAGE">Percent %</option>
                </select>
                <input 
                  type="number" placeholder="Value" required className="swiggy-input" value={newPromoCode.discountValue} 
                  onChange={e => setNewPromoCode({...newPromoCode, discountValue: e.target.value})} style={{width: '110px', height: '45px', marginBottom: 0}} 
                />
                <input 
                  type="number" placeholder="Min Order ₹" required className="swiggy-input" value={newPromoCode.minOrderAmount} 
                  onChange={e => setNewPromoCode({...newPromoCode, minOrderAmount: e.target.value})} style={{width: '130px', height: '45px', marginBottom: 0}} 
                />
                <button type="submit" className="swiggy-pay-btn" style={{width: '100px', height: '45px', margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>ADD</button>
              </form>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '10px' }}>CODE</th>
                    <th>DISCOUNT</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px dashed var(--border-color)' }}>
                      <td style={{ padding: '15px 10px', fontWeight: 'bold', color: 'var(--swiggy-orange)' }}>{p.code}</td>
                      <td style={{ color: 'var(--text-main)' }}>{p.discountType === 'FLAT' ? `₹${p.discountValue}` : `${p.discountValue}%`}</td>
                      <td>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: p.isActive ? '#dcfce7' : '#fee2e2', color: p.isActive ? '#166534' : '#b91c1c' }}>
                          {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <button onClick={() => handleTogglePromo(p._id)} style={{ background: p.isActive ? '#fee2e2' : '#dcfce7', color: p.isActive ? '#b91c1c' : '#166534', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {p.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button onClick={() => handleDeletePromo(p._id)} style={{ background: '#ff3b3b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-content-grid">
              <div className="admin-card">
                <h3>Recent Orders</h3>
                
                <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Items (Qty)</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Amount</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td className="order-id" style={{ padding: '10px' }}>#{o._id.substring(o._id.length - 6)}</td>
                          
                          <td style={{ padding: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {new Date(o.createdAt).toLocaleString(undefined, { 
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                          </td>

                          <td style={{ padding: '10px', fontSize: '13px', color: 'var(--text-main)' }}>
                            {o.items?.map((item, i) => (
                              <div key={i}><strong>{item.quantity}x</strong> {item.name}</div>
                            ))}
                          </td>
                          
                          <td className="font-bold" style={{ padding: '10px', color: 'var(--text-main)' }}>₹{o.finalAmount}</td>
                          
                        <td style={{ padding: '10px' }}>
  <select 
    className={`status-badge ${o.status?.replace(/\s+/g, '-').toLowerCase()}`}
    
    // 🚀 FIXED: We now catch "Cash on Delivery" and force it to show "🚨 Confirm Order"
    value={
      (["Order Received", "Pending", "Placed", "New", "Cash on Delivery"].includes(o.status?.trim()) && !acknowledgedOrders[o._id]) 
      ? "ACTION_REQUIRED" 
      : o.status
    } 
    
    onChange={(e) => {
      if (e.target.value === "ACTION_REQUIRED") return;
      handleUpdateOrderStatus(o._id, e.target.value);
      setAcknowledgedOrders((prev) => ({ ...prev, [o._id]: true })); 
    }}
    disabled={o.status === 'Cancelled'}
  >
    
    {/* 🚀 Shows Confirm Order if the DB accidentally saved the status as Cash on Delivery */}
    {(["Order Received", "Pending", "Placed", "New", "Cash on Delivery"].includes(o.status?.trim()) && !acknowledgedOrders[o._id]) && (
      <option value="ACTION_REQUIRED">🚨 Confirm Order</option>
    )}
    
    {/* Failsafe */}
    {!["Order Received", "Preparing", "Out for Delivery", "Delivered", "Cancelled", "Cash on Delivery"].includes(o.status?.trim()) && (
      <option value={o.status} hidden>{o.status}</option>
    )}

    <option value="Order Received">Order Received</option>
    <option value="Preparing">Preparing Order</option>
    <option value="Out for Delivery">Out for Delivery</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled" disabled>Cancelled</option>
  </select>
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-card">
                <h3>Store Config</h3>
                <div className="settings-form">
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)' }}>Delivery Fee (₹)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="number" value={settings.deliveryFee || ''} 
                      onChange={e => setSettings({...settings, deliveryFee: Number(e.target.value)})} 
                      className="swiggy-input" style={{ flex: 1, marginBottom: 0 }} 
                    />
                    <button className="swiggy-pay-btn" onClick={updateSettings} style={{ width: 'auto', margin: 0, padding: '10px 20px' }}>SAVE</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= MENU ITEMS TAB ================= */}
        {activeTab === "menu" && (
          <>
            <h1 className="admin-title">Manage Menu</h1>
            <div className="admin-content-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className="admin-card">
                <h3>{isEditMode ? "Update Dish" : "Add New Dish"}</h3>
                <form onSubmit={handleSubmitFood} className="settings-form">
                  <input type="text" required value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} placeholder="Dish Name" className="swiggy-input"/>
                  <input type="number" required value={newFood.price} onChange={e => setNewFood({...newFood, price: Number(e.target.value)})} placeholder="Price" className="swiggy-input"/>
                  <select className="swiggy-input" value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})}>
                    <option value="Biryani">Biryani</option>
                    <option value="Burger">Burger</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Tiffins">Tiffins</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Ice Creams">Ice Creams</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Puffs">Puffs</option>
                    <option value="Meals">Meals</option>
                    <option value="Fried Rice">Fried Rice</option>
                    <option value="Tea & Coffee">Tea & Coffee</option>
                    <option value="Cakes">Cakes</option>
                  </select>
                  
                  <select 
                    className="swiggy-input" 
                    value={newFood.isVeg} 
                    onChange={e => setNewFood({...newFood, isVeg: e.target.value === 'true'})}
                  >
                    <option value="true">🟢 Pure Veg</option>
                    <option value="false">🔴 Non-Veg</option>
                  </select>

                  <input type="url" required value={newFood.image} onChange={e => setNewFood({...newFood, image: e.target.value})} placeholder="Image URL" className="swiggy-input"/>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="swiggy-pay-btn" style={{ flex: 1 }}>
                      {isEditMode ? "Update Dish" : "Add to Menu"}
                    </button>
                    {isEditMode && (
                      <button type="button" onClick={cancelEdit} className="swiggy-pay-btn" style={{ flex: 1, background: '#ccc', color: '#333' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-card">
                <h3>Current Live Menu</h3>
                
                <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
                      <tr style={{ color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td className="font-bold" style={{ color: 'var(--text-main)', padding: '10px' }}>{item.name}</td>
                          <td style={{ color: 'var(--text-main)', padding: '10px' }}>{item.category}</td>
                          <td style={{ color: 'var(--text-main)', padding: '10px' }}>₹{item.price}</td>
                          <td style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => startEditMode(item)} style={{background: 'var(--swiggy-orange)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                              <button onClick={() => handleDeleteFood(item._id)} style={{background: '#ff3b3b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}