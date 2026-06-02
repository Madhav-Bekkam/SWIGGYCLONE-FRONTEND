import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Users, Utensils, Star, Clock } from "lucide-react";

export default function Statistics() {
  const stats = [
    { id: 1, icon: <Users size={40} color="#fc8019" />, end: 50000, suffix: "+", title: "Happy Customers" },
    { id: 2, icon: <Utensils size={40} color="#48c479" />, end: 120, suffix: "+", title: "Dishes Served" },
    { id: 3, icon: <Star size={40} color="#ffd700" />, end: 4.8, suffix: "", decimals: 1, title: "Average Rating" },
    { id: 4, icon: <Clock size={40} color="#ff3b3b" />, end: 30, suffix: "m", title: "Avg Delivery Time" }
  ];

  return (
    <div style={{ padding: "80px 20px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Our Impact</h2>
          <hr className="title-underline" />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", marginTop: "40px" }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              className="glass-panel"
              style={{ padding: "40px 20px", borderRadius: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "50%", display: "inline-flex", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.05)" }}>
                {stat.icon}
              </div>
              <h3 style={{ fontSize: "42px", fontWeight: "900", margin: 0, color: "var(--text-main)", display: "flex", alignItems: "center" }}>
                <CountUp end={stat.end} decimals={stat.decimals || 0} duration={2.5} enableScrollSpy scrollSpyOnce />
                {stat.suffix}
              </h3>
              <p style={{ margin: 0, fontSize: "16px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
