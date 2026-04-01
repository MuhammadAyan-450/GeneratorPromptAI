// src/pages/AIAgent.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, RefreshCw, Copy, Star, Brain, Bot } from "lucide-react";
import { Helmet } from "react-helmet-async"; // ✅ Fixed: was react-helmet (wrong package)
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AIAgent = () => {
  // ✅ Fixed: removed localStorage (not supported in this environment, causes errors on some browsers)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! 👋 I'm your AI Agent powered by Groq + Llama 3.3. Ask me anything!" }
  ]);

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinkingSteps]);

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
      if (!data?.role || !data?.content) throw new Error("Invalid response from API");
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Couldn't connect right now. Please check your connection and try again.",
        },
      ]);
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

  const newChat = () => {
    setMessages([
      { role: "assistant", content: "New chat started! 👋 Ask me anything." },
    ]);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Agent Chatbot",
    url: "https://generatorpromptai.com/ai-agent",
    applicationCategory: "AIApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://generatorpromptai.com",
    },
    description:
      "Free AI chatbot powered by Groq and Llama 3.3. Ask questions, generate prompts, get content ideas instantly.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What AI model powers this chatbot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our AI Agent is powered by Groq and Llama 3.3, one of the fastest and most capable open-source large language models available.",
        },
      },
      {
        "@type": "Question",
        name: "Is this AI chatbot free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the AI Agent on GeneratorPromptAI is completely free to use with no sign-up required.",
        },
      },
      {
        "@type": "Question",
        name: "What can I use the AI Agent for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can use it to ask questions, generate AI prompts for ChatGPT or Midjourney, get content ideas, write code, summarize text, and much more.",
        },
      },
      {
        "@type": "Question",
        name: "How fast is the AI Agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our AI Agent uses Groq's ultra-fast inference engine, making responses significantly faster than most AI chatbots.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Free AI Chatbot Online - Chat with Llama 3.3 Powered by Groq | GeneratorPromptAI</title>
        <meta
          name="description"
          content="Chat with our free AI Agent powered by Groq and Llama 3.3. Ask questions, generate prompts for ChatGPT and Midjourney, get content ideas instantly. No sign-up needed."
        />
        <meta
          name="keywords"
          content="AI chatbot, free AI chat, Llama 3.3 chatbot, Groq AI, AI agent online, free AI assistant, ChatGPT alternative, AI prompt generator, free chat AI"
        />
        <link rel="canonical" href="https://generatorpromptai.com/ai-agent" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Free AI Chatbot - Chat with Llama 3.3 Powered by Groq" />
        <meta
          property="og:description"
          content="Free AI chatbot powered by Groq and Llama 3.3. Ask anything, generate prompts, get content ideas instantly. No sign-up needed."
        />
        <meta property="og:url" content="https://generatorpromptai.com/ai-agent" />
        <meta property="og:image" content="https://generatorpromptai.com/og-ai-agent.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Chatbot - Groq + Llama 3.3 | GeneratorPromptAI" />
        <meta
          name="twitter:description"
          content="Chat with our free AI Agent powered by Groq and Llama 3.3. No sign-up needed."
        />
        <meta name="twitter:image" content="https://generatorpromptai.com/og-ai-agent.png" />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

        {/* Top Nav */}
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <button
            onClick={newChat}
            className="px-4 py-2 bg-white shadow hover:shadow-md rounded-xl flex items-center gap-2 text-sm text-gray-700 transition-all"
          >
            <RefreshCw size={15} /> New Chat
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-10">

          {/* Page Title (for SEO — visible on page) */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 mb-3">
              <Bot className="text-indigo-600" size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              AI Agent Chatbot
            </h1>
            <p className="text-gray-500 text-sm">
              Powered by <strong>Groq + Llama 3.3</strong> — Ask anything, get instant answers
            </p>
          </div>

          {/* Chat Window */}
          <div className="bg-white/95 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden h-[72vh] flex flex-col">

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-4 rounded-3xl relative break-words shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {msg.role === "assistant" && (
                      <div className="absolute -bottom-7 right-2 flex gap-2">
                        <button
                          onClick={() => copyMsg(msg.content, i)}
                          title="Copy message"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => favoriteMsg(msg)}
                          title="Save to favorites"
                          className="text-yellow-400 hover:text-yellow-500 transition-colors"
                        >
                          <Star size={14} />
                        </button>
                      </div>
                    )}

                    {copiedIndex === i && (
                      <span className="absolute -top-6 right-0 text-xs text-green-600 font-medium">Copied!</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking Animation */}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-indigo-50 border border-indigo-100 px-6 py-4 rounded-3xl max-w-[80%] shadow-sm">
                    <div className="flex items-center gap-3 mb-3 text-indigo-600 font-medium text-sm">
                      <Brain size={18} className="animate-pulse" />
                      Thinking...
                    </div>
                    <div className="space-y-2 pl-2">
                      {thinkingSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-gray-100 bg-white/90 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
                }
                placeholder="Ask me anything..."
                className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={isThinking || !input.trim()}
                className={`px-6 py-3.5 rounded-2xl flex items-center justify-center transition-all ${
                  isThinking || !input.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 active:scale-95"
                }`}
              >
                {isThinking ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mt-6 bg-white border border-yellow-200 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Star size={15} className="text-yellow-400" /> Saved Responses
              </h2>
              <div className="space-y-2">
                {favorites.map((fav, i) => (
                  <p key={i} className="text-sm text-gray-600 bg-yellow-50 rounded-xl px-4 py-2 leading-relaxed">
                    {fav.content}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free AI Chatbot Powered by Groq &amp; Llama 3.3
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our AI Agent is a free online chatbot powered by Groq's ultra-fast inference engine and Meta's Llama 3.3 large language model. It delivers fast, intelligent responses to any question — no sign-up or payment required.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Use it to generate AI prompts for ChatGPT, Midjourney, or Claude, write content, answer questions, summarize text, debug code, or just have a conversation. It's one of the fastest free AI chatbots available online.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What can you do with the AI Agent?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm mb-4">
              <li>Generate prompts for ChatGPT, Midjourney, Claude, and more</li>
              <li>Get instant answers to any question</li>
              <li>Write blog posts, social media captions, and emails</li>
              <li>Debug and explain code in any programming language</li>
              <li>Summarize long articles or documents</li>
              <li>Brainstorm ideas and creative content</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "What AI model powers this chatbot?",
                  a: "Our AI Agent uses Groq's inference engine running Meta's Llama 3.3 — one of the fastest and most capable open-source AI models available today.",
                },
                {
                  q: "Is this AI chatbot completely free?",
                  a: "Yes, completely free. No account, no credit card, no limits. Just open the page and start chatting.",
                },
                {
                  q: "What can I use the AI Agent for?",
                  a: "You can use it to ask questions, generate prompts for other AI tools, write content, debug code, summarize text, brainstorm ideas, and much more.",
                },
                {
                  q: "How fast is the AI Agent?",
                  a: "Groq's inference engine is among the fastest in the world, making our AI Agent significantly faster than most AI chatbots including many paid alternatives.",
                },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default AIAgent;
