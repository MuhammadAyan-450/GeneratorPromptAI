// src/pages/AIAgent.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Send, RefreshCw, Copy, Star, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AIAgent = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("aiAgentChatHistory");
    return saved
      ? JSON.parse(saved)
      : [{
          role: "assistant",
          content: "Hello! I'm your AI Agent powered by Claude (Sonnet 4.6).\n\nI can help with creative writing, coding, prompt engineering, deep explanations, brainstorming, and much more.\n\nWhat would you like to discuss today?"
        }];
  });

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("aiAgentFavorites");
    return saved ? JSON.parse(saved) : [];
  });

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinkingSteps]);

  // Save chat history
  useEffect(() => {
    localStorage.setItem("aiAgentChatHistory", JSON.stringify(messages));
  }, [messages]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("aiAgentFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const simulateThinking = async () => {
    setIsThinking(true);
    setThinkingSteps([]);

    const steps = [
      "Understanding your query...",
      "Recalling conversation context...",
      "Reasoning through the best approach...",
      "Crafting a clear and detailed response..."
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 700));
      setThinkingSteps(prev => [...prev, step]);
    }
    setIsThinking(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    await simulateThinking();

    try {
      // Using Puter.ai Claude integration
      const response = await puter.ai.chat(input.trim(), {
        model: 'claude-sonnet-4-6',   // You can change to 'claude-opus-4-6' if available
        stream: false
      });

      const aiReply = {
        role: "assistant",
        content: response?.text || "Sorry, I couldn't generate a response."
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (error) {
      console.error("Claude API error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm sorry, I couldn't connect to Claude right now. Please try again in a moment."
      }]);
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const toggleFavorite = (msg) => {
    if (favorites.some(f => f.content === msg.content)) {
      setFavorites(favorites.filter(f => f.content !== msg.content));
    } else {
      setFavorites([...favorites, msg]);
    }
  };

  const clearChat = () => {
    if (window.confirm("Start a new chat? This will clear the current conversation.")) {
      setMessages([{
        role: "assistant",
        content: "New chat started. How can I help you today?"
      }]);
      localStorage.removeItem("aiAgentChatHistory");
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Agent • Claude Sonnet 4.6 — GeneratorPromptAI</title>
        <meta name="description" content="Chat with a powerful AI Agent powered by Claude Sonnet 4.6. Get thoughtful, detailed, and helpful responses instantly." />
        <link rel="canonical" href="https://generatorpromptai.com/ai-agent" />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-zinc-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center gap-3 text-gray-600 hover:text-indigo-600">
              <ArrowLeft size={24} /> Back to Home
            </Link>

            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
            >
              <Trash2 size={20} /> New Chat
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden h-[78vh] flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-zinc-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] px-7 py-5 rounded-3xl text-[17px] leading-relaxed shadow-sm ${msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"}`}>
                    {msg.content}

                    {msg.role === "assistant" && (
                      <div className="flex gap-4 mt-5 text-gray-400">
                        <button onClick={() => copyMessage(msg.content)} className="hover:text-gray-600 transition">
                          <Copy size={19} />
                        </button>
                        <button onClick={() => toggleFavorite(msg)} className="hover:text-amber-500 transition">
                          <Star size={19} className={favorites.some(f => f.content === msg.content) ? "fill-amber-500 text-amber-500" : ""} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-7 py-5 rounded-3xl max-w-[75%] shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium text-gray-700">Claude is thinking...</span>
                    </div>
                    <div className="pl-8 space-y-2 text-sm text-gray-600">
                      {thinkingSteps.map((step, i) => (
                        <div key={i}>• {step}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t bg-white">
              <div className="flex gap-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Ask me anything... (I remember our full conversation)"
                  className="flex-1 px-6 py-5 bg-zinc-100 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg placeholder-gray-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={isThinking || !input.trim()}
                  className={`px-8 py-5 rounded-3xl flex items-center justify-center transition-all ${isThinking || !input.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"}`}
                >
                  {isThinking ? <RefreshCw size={26} className="animate-spin" /> : <Send size={26} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AIAgent;