// src/pages/AIAgent.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, RefreshCw, Copy, Star, Brain } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AIAgent = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("aiAgentChatHistory");
    return saved
      ? JSON.parse(saved)
      : [
        {
          role: "assistant",
          content:
            "Hello! 👋 I'm your AI Agent powered by Groq + Llama 3.1. Ask me anything!",
        },
      ];
  });

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinkingSteps]);

  useEffect(() => {
    localStorage.setItem("aiAgentChatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const savedFav = localStorage.getItem("aiAgentFavorites");
    if (savedFav) setFavorites(JSON.parse(savedFav));
  }, []);

  useEffect(() => {
    if (favorites.length) localStorage.setItem("aiAgentFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const simulateThinking = async () => {
    setIsThinking(true);
    setThinkingSteps([]);

    const steps = [
      "Reading your message...",
      "Understanding context...",
      "Planning best response...",
      "Generating detailed answer...",
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 600));
      setThinkingSteps((prev) => [...prev, step]);
    }

    setIsThinking(false);
  };
  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    await simulateThinking();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Server error");
      }

      const data = await res.json();
      setMessages(prev => [...prev, data]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Couldn't connect right now. Possible reasons:\n1. Internet issue\n2. Groq rate limit (wait 1 min)\n3. API key problem"
        }
      ]);
      console.error("Chat error:", err);
    }
  };

  const copyMsg = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(-1), 2000);
  };

  const favoriteMsg = (msg) => {
    if (favorites.some((f) => f.content === msg.content)) return;
    setFavorites([...favorites, msg]);
  };

  const removeFavorite = (index) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  const newChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "New chat started! 👋 Ask me anything.",
      },
    ]);
    localStorage.removeItem("aiAgentChatHistory");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600">
            <ArrowLeft size={24} />
            Back to Home
          </Link>
          <button
            onClick={newChat}
            className="px-5 py-2.5 bg-white/90 border border-gray-200 rounded-xl flex items-center gap-2"
          >
            <RefreshCw size={18} />
            New Chat
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white/90 rounded-3xl shadow-2xl border overflow-hidden h-[80vh] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-6 py-4 rounded-3xl relative ${msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white/90 text-gray-900 border border-gray-200"
                      }`}
                  >
                    {msg.content}

                    {msg.role === "assistant" && (
                      <div className="absolute -bottom-8 right-2 flex gap-2">
                        <button onClick={() => copyMsg(msg.content, i)}>
                          <Copy size={16} />
                        </button>
                        <button onClick={() => favoriteMsg(msg)}>
                          <Star size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-indigo-50 px-7 py-5 rounded-3xl max-w-[85%] shadow-md">
                    <div className="flex items-center gap-4 mb-2">
                      <Brain size={28} className="text-indigo-600 animate-pulse" />
                      Thinking...
                    </div>
                    <div className="space-y-2 pl-4">
                      {thinkingSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-gray-200 bg-white/80 flex gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Type your message..."
                className="flex-1 px-6 py-5 bg-gray-100/80 border border-gray-300 rounded-3xl"
              />
              <button
                onClick={sendMessage}
                disabled={isThinking || !input.trim()}
                className={`px-8 py-5 rounded-3xl flex items-center justify-center ${isThinking || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  }`}
              >
                {isThinking ? <RefreshCw size={22} className="animate-spin" /> : <Send size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AIAgent;