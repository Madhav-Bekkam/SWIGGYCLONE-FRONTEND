import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    { id: 1, name: "Rahul S.", role: "Food Blogger", text: "The best Biryani I've ever had! The spices are perfectly balanced, and the meat is incredibly tender. 10/10 would recommend.", rating: 5, avatar: "https://i.pravatar.cc/150?img=11" },
    { id: 2, name: "Priya M.", role: "Regular Customer", text: "Lightning fast delivery! The food arrived piping hot, and the packaging was premium. My go-to app for late night cravings.", rating: 5, avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 3, name: "Vikram K.", role: "Local Guide", text: "A fantastic collection of local restaurants. The interface is buttery smooth and finding exactly what I want takes seconds.", rating: 4.5, avatar: "https://i.pravatar.cc/150?img=8" }
  ];

  return (
    <div style={{ padding: "80px 20px", position: "relative", zIndex: 10, background: "var(--bg-secondary)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="section-title">Wall of Love</h2>
          <hr className="title-underline" />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginTop: "40px" }}>
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
              className="glass-panel"
              style={{ padding: "30px", borderRadius: "20px", position: "relative", overflow: "hidden" }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "120px", opacity: 0.05, fontWeight: "900", fontFamily: "serif" }}>
                "
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                <img src={review.avatar} alt={review.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--swiggy-orange)" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", color: "var(--text-main)" }}>{review.name}</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>{review.role}</p>
                  <div style={{ display: "flex", gap: "2px", marginTop: "5px" }}>
                    {[...Array(Math.floor(review.rating))].map((_, idx) => (
                      <Star key={idx} size={14} color="#ffd700" fill="#ffd700" />
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.6", color: "var(--text-main)", fontStyle: "italic" }}>
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
