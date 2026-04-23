import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Send, RefreshCw, Copy, Star, Brain, Bot, Home, ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AIAgent = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! 👋 I'm your free AI Agent. Ask me anything, generate prompts, or brainstorm ideas!" }
  ]);

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [openFaq, setOpenFaq] = useState(null);

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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free AI Agent for Prompt Generation & Brainstorming",
    "url": "https://www.generatorpromptai.com/tools/ai-agent",
    "applicationCategory": "ChatApplication",
    "operatingSystem": "Web",
    "description": "Free online AI Agent to generate prompts, brainstorm ideas, write content, and get instant answers. No signup or login required.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "AI Agent", "item": "https://www.generatorpromptai.com/tools/ai-agent" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I use this AI agent to generate prompts for ChatGPT and Midjourney?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, simply tell the AI agent what kind of prompt you need (e.g., 'Write a prompt for ChatGPT to write a blog post about SEO') and it will generate a structured, ready-to-use prompt for you." }
      },
      {
        "@type": "Question",
        "name": "Is this AI assistant free without signup?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, our AI agent is 100% free to use. You do not need to create an account, provide an email, or log in. Just open the page and start chatting immediately." }
      },
      {
        "@type": "Question",
        "name:": "How to brainstorm content ideas with AI for free?",
        "acceptedAnswer": { "@type": "Answer", "text": "Open our AI Agent and type your topic or niche. Ask it to 'Give me 10 YouTube video ideas about [topic]' or 'Brainstorm 5 blog post titles about [topic]'. It will generate creative ideas instantly." }
      },
      {
        "@type": "Question",
        "name": "Can I use the AI agent to write code and debug errors?",
        "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Our AI agent can write code snippets in various programming languages, explain complex code logic, and help you find and fix bugs in your code." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Free AI Agent for Prompt Generation & Brainstorming – No Signup</title>
        <meta
          name="description"
          content="Use our free AI Agent to generate prompts for ChatGPT & Midjourney, brainstorm content ideas, write code, and get instant answers. No login required – start chatting now."
        />
        <meta
          name="keywords"
          content="free AI agent for prompt generation, AI assistant without signup, brainstorm ideas with AI free, free AI chat for writing, ask AI questions online no login, AI agent to write code, free online chatbot for developers, generate AI prompts free, AI content brainstorming tool"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/ai-agent" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Free AI Agent for Prompt Generation & Brainstorming" />
        <meta property="og:description" content="Generate prompts, brainstorm ideas, write code, and get answers instantly with our free AI Agent. No signup needed." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/ai-agent" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Agent – Prompt Generator & Idea Brainstormer" />
        <meta name="twitter:description" content="Chat with AI to generate prompts, brainstorm content ideas, and write code. 100% free, no login." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

        {/* ── Top Nav (Breadcrumb + New Chat) ── */}
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <Home size={14} /> Home
                </Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li>
                <Link to="/pages/all-tools" className="hover:text-indigo-600 transition-colors">All Tools</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">AI Agent</span></li>
            </ol>
          </nav>
          <button
            onClick={newChat}
            className="px-4 py-2 bg-white shadow hover:shadow-md rounded-xl flex items-center gap-2 text-sm text-gray-700 transition-all"
          >
            <RefreshCw size={15} /> New Chat
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-10">

          {/* Page Title (SEO Optimized) */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 mb-3">
              <Bot className="text-indigo-600" size={24} />
            </div>
            {/* H1 Targeting Low Comp */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Free AI Agent – Generate Prompts & Brainstorm Ideas Instantly
            </h1>
            <p className="text-gray-500 text-sm">
              Ask questions, write content, or generate AI prompts. <strong>100% free, no signup required.</strong>
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
                placeholder="Ask me anything, or type 'generate a prompt for...'"
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

          {/* ── SEO Content 1 ── */}
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free AI Agent for Prompt Generation & Content Brainstorming
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free online AI Agent is designed to help you <strong>generate prompts for ChatGPT, Claude, and Midjourney</strong>, brainstorm content ideas, write emails, and get instant answers to complex questions. It acts as your personal AI assistant, running entirely in your browser with zero login required.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Whether you are a developer looking to debug code, a content creator needing fresh ideas, or a student wanting to summarize notes, this tool adapts to your needs instantly.
            </p>
          </div>

          {/* ── Features Section ── */}
          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What Can You Do With This AI Assistant?
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Generate AI Prompts", desc: "Create structured prompts for ChatGPT, Midjourney, Claude, and YouTube scripts in seconds." },
                { title: "Brainstorm Content Ideas", desc: "Get unlimited blog topics, YouTube video ideas, and social media captions tailored to your niche." },
                { title: "Write & Edit Code", desc: "Ask the AI to write code snippets, explain programming logic, or find bugs in your script." },
                { title: "Summarize & Explain Text", desc: "Paste long articles or documents and ask the AI to summarize them into bullet points or simple terms." },
                { title: "No Signup Required", desc: "Start chatting immediately. No account creation, no email, no credit card needed." },
                { title: "Fast & Private", desc: "Get responses instantly. Your chats are processed securely without being stored on external servers." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Section (Accordion) ── */}
          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              AI Agent – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "Can I use this AI agent to generate prompts for ChatGPT and Midjourney?",
                  a: "Yes, simply tell the AI agent what kind of prompt you need (e.g., 'Write a prompt for ChatGPT to write a blog post about SEO') and it will generate a structured, ready-to-use prompt for you."
                },
                {
                  q: "Is this AI assistant free without signup?",
                  a: "Yes, our AI agent is 100% free to use. You do not need to create an account, provide an email, or log in. Just open the page and start chatting immediately."
                },
                {
                  q: "How to brainstorm content ideas with AI for free?",
                  a: "Open our AI Agent and type your topic or niche. Ask it to 'Give me 10 YouTube video ideas about [topic]' or 'Brainstorm 5 blog post titles about [topic]'. It will generate creative ideas instantly."
                },
                {
                  q: "Can I use the AI agent to write code and debug errors?",
                  a: "Absolutely. Our AI agent can write code snippets in various programming languages, explain complex code logic, and help you find and fix bugs in your code."
                },
                {
                  q: "Are my chats saved or monitored?",
                  a: "No. Your conversations are not permanently stored or monitored. The AI processes your messages to provide real-time answers without saving your personal chat history."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-200 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">
                      {item.q}
                    </h3>
                    <ChevronDown
                      size={22}
                      className={`text-indigo-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free AI & Developer Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/chatgpt-prompt-generator", title: "ChatGPT Prompt Generator", desc: "Build structured prompts specifically optimized for ChatGPT responses." },
                { to: "/tools/midjourney-prompt-generator", title: "Midjourney Prompt Builder", desc: "Create detailed image prompts with art styles, lighting, and camera angles." },
                { to: "/tools/password-generator", title: "Password Generator", desc: "Generate strong, secure random passwords with custom length and symbols." }
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default AIAgent;