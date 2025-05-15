import React, { useState } from "react";
import axios from "axios";
import "./DoctorBot.css";

import { GoogleGenAI } from "@google/genai";

// Use an environment variable for the API key to avoid hardcoding sensitive information
const ai = new GoogleGenAI({ apiKey: "AIzaSyCNvIDv1gnItGsH0b5PBN183h5Vc4kQbb8" });

const DoctorBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) {
      alert("Please enter a valid message.");
      return;
    }

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send the user's input to the AI model
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: input, // Use the user's input
      });

      const botText = response.text || "Sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctorbot">
      <h2>DoctorBot - Gemini AI Assistant</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <p key={idx} className={msg.sender}>
            <strong>{msg.sender === "user" ? "You" : "DoctorBot"}:</strong> {msg.text}
          </p>
        ))}
        {loading && <p className="bot">DoctorBot is thinking...</p>}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
};

export default DoctorBot;