import React, { useState } from "react";
import "./DoctorBot.css";

const DoctorBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const getReply = (text) => {
    const msg = text.toLowerCase();

    if (msg.includes("fever")) {
      return "Fever may indicate an infection. Rest well, drink plenty of fluids, and consult a doctor if it persists.";
    }
    if (msg.includes("cold")) {
      return "Common cold usually improves with rest, warm fluids, and steam inhalation.";
    }
    if (msg.includes("headache")) {
      return "Headaches can be caused by stress or dehydration. Rest and hydration may help.";
    }
    if (msg.includes("cough")) {
      return "Cough can be due to irritation or infection. Stay hydrated and consult a doctor if it worsens.";
    }
    if (msg.includes("pain")) {
      return "Body pain can be caused by fatigue or strain. Proper rest is recommended.";
    }

    return "Please describe your symptoms clearly for better guidance.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: "user" }]);

    const botReply = getReply(input);
    setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);

    setInput("");
  };

  return (
    <div className="doctorbot">
      <h2>DoctorBot - Health Assistant</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <p key={i} className={msg.sender}>
            <b>{msg.sender === "user" ? "You" : "DoctorBot"}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Describe your symptoms..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSend}>Ask</button>
    </div>
  );
};

export default DoctorBot;
