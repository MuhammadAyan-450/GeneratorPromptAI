// src/pages/AIAgent.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, RefreshCw, Copy, Star, Brain } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const AIAgent = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("aiAgentChatHistory");
    return saved
      ? JSON.parse(saved)
      : [{ role: "assistant", content: "Hello! 👋 I'm your AI Agent powered by Groq + Llama 3.3. Ask me anything!" }];
  });

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFav = localStorage.getItem("aiAgentFavorites");
    return savedFav ? JSON.parse(savedFav) : [];
  });
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinkingSteps]);

  useEffect(() => localStorage.setItem("aiAgentChatHistory", JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem("aiAgentFavorites", JSON.stringify(favorites)), [favorites]);

  const simulateThinking = async () => {
    setIsThinking(true);
    setThinkingSteps([]);
    const steps = ["Reading your message...", "Understanding context...", "Planning best response...", "Generating detailed answer..."];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      setThinkingSteps(prev => [...prev, step]);
    }
    setIsThinking(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const userMsg = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    await simulateThinking();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Server error");
      }

      const data = await res.json();
      if (!data?.role || !data?.content) throw new Error("Invalid response from Groq API");
      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Couldn't connect right now. Possible reasons: Internet, rate limit, or API key issue." }]);
    }
  };

  const copyMsg = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(-1), 2000);
  };

  const favoriteMsg = (msg) => {
    if (favorites.some(f => f.content === msg.content)) return;
    setFavorites([...favorites, msg]);
  };

  const newChat = () => {
    setMessages([{ role: "assistant", content: "New chat started! 👋 Ask me anything." }]);
    localStorage.removeItem("aiAgentChatHistory");
  };

  return (
    <>
      <Helmet>
        <title>AI Chatbot – GeneratorPromptAI | Groq + Llama 3.3</title>
        <meta
          name="description"
          content="Chat with the AI Agent at GeneratorPromptAI, powered by Groq and Llama 3.3. Get instant answers, creative prompts, and content ideas for ChatGPT, MidJourney, and more."
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="AI Chatbot – GeneratorPromptAI | Groq + Llama 3.3" />
        <meta
          property="og:description"
          content="Chat with the AI Agent at GeneratorPromptAI, powered by Groq and Llama 3.3. Get instant answers, creative prompts, and content ideas for ChatGPT, MidJourney, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/ai-agent" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Chatbot – GeneratorPromptAI | Groq + Llama 3.3" />
        <meta
          name="twitter:description"
          content="Chat with the AI Agent at GeneratorPromptAI, powered by Groq and Llama 3.3. Get instant answers, creative prompts, and content ideas for ChatGPT, MidJourney, and more."
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://generatorpromptai.com/ai-agent" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors duration-200">
            <ArrowLeft size={24} /> Back to Home
          </Link>
          <button onClick={newChat} className="px-5 py-2.5 bg-white shadow-md hover:shadow-lg rounded-xl flex items-center gap-2 transition-all duration-200">
            <RefreshCw size={18} /> New Chat
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-white/95 rounded-3xl shadow-2xl border overflow-hidden h-[80vh] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-6 py-4 rounded-3xl relative break-words shadow ${msg.role === "user" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transform transition" : "bg-white text-gray-900 border border-gray-200 hover:scale-105 transform transition"}`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && (
                      <div className="absolute -bottom-8 right-2 flex gap-2">
                        <button onClick={() => copyMsg(msg.content, i)} title="Copy">
                          <Copy size={16} className="text-gray-500 hover:text-gray-700 transition-colors" />
                        </button>
                        <button onClick={() => favoriteMsg(msg)} title="Add to Favorites">
                          <Star size={16} className="text-yellow-400 hover:text-yellow-500 transition-colors" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-indigo-50 px-7 py-5 rounded-3xl max-w-[80%] shadow-md animate-pulse">
                    <div className="flex items-center gap-4 mb-2">
                      <Brain size={28} className="text-indigo-600 animate-pulse" /> Thinking...
                    </div>
                    <div className="space-y-2 pl-4">
                      {thinkingSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> {step}
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
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Type your message..."
                className="flex-1 px-6 py-5 bg-gray-100/80 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
              <button
                onClick={sendMessage}
                disabled={isThinking || !input.trim()}
                className={`px-8 py-5 rounded-3xl flex items-center justify-center ${isThinking || !input.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transform transition"}`}
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
