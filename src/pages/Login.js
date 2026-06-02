import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
// Add this near your other state variables
const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN logic
        const res = await axios.post("https://swiggyclone-backend-1.onrender.com/api/login", { email, password });
        login(res.data);
        
        // Route based on role
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // REGISTER logic
        const res = await axios.post("https://swiggyclone-backend-1.onrender.com/api/register", { name, email, password });
        alert(res.data.message);
        setIsLogin(true); // Switch back to login view after successful registration
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="swiggy-auth-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div className="auth-card" style={{ background: 'var(--bg-main)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px' }}>
        <div className="auth-header">
          <h2 style={{ fontSize: '30px', margin: '0 0 10px 0' }}>{isLogin ? "Login" : "Sign Up"}</h2>
          <p style={{ cursor: 'pointer', margin: 0 }} onClick={() => setIsLogin(!isLogin)}>
            or <span style={{ color: 'var(--swiggy-orange)', fontWeight: 'bold' }}>
              {isLogin ? "create an account" : "log in to your account"}
            </span>
          </p>
          <hr className="divider" style={{ margin: '20px 0' }} />
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              className="swiggy-input"
              style={{ width: '100%', padding: '15px', marginBottom: '15px', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            className="swiggy-input"
            style={{ width: '100%', padding: '15px', marginBottom: '15px', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
  <input 
    type={showPassword ? "text" : "password"} 
    className="swiggy-input" 
    placeholder="Password" 
    required
    /* Keep your existing value and onChange props here! */
  />
  <button 
    type="button" 
    className="password-toggle-btn" 
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"} 
  </button>
</div>
          <button type="submit" className="swiggy-pay-btn" style={{ width: '100%' }}>
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}