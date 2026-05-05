import React, { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ 
      borderBottom: '1px solid var(--border-color)', 
      padding: '20px 0', 
      cursor: 'pointer' 
    }} onClick={() => setIsOpen(!isOpen)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: 'var(--text-main)', margin: 0 }}>{question}</h4>
        <span style={{ color: 'var(--swiggy-orange)', fontSize: '20px' }}>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <p style={{ color: 'var(--text-muted)', marginTop: '15px', lineHeight: '1.6' }}>{answer}</p>
      )}
    </div>
  );
};

export default function FAQ() {
  const faqs = [
    { question: "How long does delivery take?", answer: "We aim to deliver within 30-45 minutes depending on your location in Hyderabad." },
    { question: "Is there a minimum order value?", answer: "No, there is no minimum order value, but a delivery fee may apply for smaller orders." },
    { question: "How can I track my order?", answer: "Go to your Profile > Orders & Tracking to see live updates on your food status." },
    { question: "Can I cancel my order?", answer: "Orders can only be cancelled within 2 minutes of placing them. After that, the restaurant starts preparing your food!" },
    { question: "What payment methods are supported?", answer: "We currently support Cash on Delivery and all major UPI/Card payments." }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
      <h1 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Help & Support</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Find answers to common questions below.</p>
      
      <div style={{ background: 'var(--bg-main)', padding: '0 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        {faqs.map((faq, index) => <FAQItem key={index} {...faq} />)}
      </div>
    </div>
  );
}