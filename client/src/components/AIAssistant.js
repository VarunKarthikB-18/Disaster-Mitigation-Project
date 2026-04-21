'use client';

import { useState, useRef, useEffect } from 'react';

const RULES = [
  { keywords: ['flood', 'water', 'drowning'], response: "Move to higher ground immediately. Do not walk or drive through flood waters. Turn off utilities at main switches if instructed." },
  { keywords: ['earthquake', 'shake', 'tremor'], response: "Drop, Cover, and Hold On! Stay away from windows. If outdoors, move to an open area away from trees and buildings." },
  { keywords: ['fire', 'smoke', 'burn'], response: "Evacuate immediately. Stay low to the ground to avoid smoke. Cover your mouth. Do not use elevators." },
  { keywords: ['evacuate', 'shelter', 'route'], response: "Use the 'Shelters' tab to find the nearest safe haven, then use the 'Route' tab to compute a safe path avoiding disaster zones." },
  { keywords: ['bleeding', 'cut', 'wound', 'injury'], response: "Apply firm, direct pressure to the wound with a clean cloth. Elevate the injured area if possible. Send an SOS if critical." },
  { keywords: ['hello', 'hi', 'help'], response: "Hello. I am the DisasterShield AI Assistant. Describe your situation or ask about disaster mitigation protocols." }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello. I am your AI Emergency Guide. How can I assist you right now? You can ask about floods, earthquakes, first aid, or evacuation." }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim().toLowerCase();
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');

    // Process Basic NLP / Rules Engine
    setTimeout(() => {
      let matchedResponse = "I recommend using the SOS tab if you are in immediate danger. Stay calm and await instructions from local authorities.";
      
      for (let rule of RULES) {
        if (rule.keywords.some(kw => userMsg.includes(kw))) {
          matchedResponse = rule.response;
          break;
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: matchedResponse }]);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      <div>
        <h3 className="section-title">🤖 AI Emergency Guide</h3>
        <p className="section-desc">Offline-capable conversational assistant for immediate triage and mitigation protocols.</p>
      </div>

      <div 
        ref={chatRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: msg.sender === 'user' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
            border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'var(--text-primary)'
          }}>
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Type your emergency query..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>Send</button>
      </form>
    </div>
  );
}
