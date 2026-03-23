// pages/ClaudePromptGenerator.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Star, Trash2 } from "lucide-react";
import claudePrompts from "../data/prompts/claude";

const ClaudePromptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("random");
  const [depth, setDepth] = useState("detailed");
  const [tone, setTone] = useState("neutral");
  const [result, setResult] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("favoriteClaudePrompts");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favoriteClaudePrompts", JSON.stringify(favorites));
    }
  }, [favorites]);

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter a topic or task first.");
      return;
    }

    // Pick a strong base template optimized for Claude
    let base = claudePrompts[Math.floor(Math.random() * claudePrompts.length)];
    let prompt = base.replaceAll("{topic}", topic.trim());

    // Claude excels with clear instructions, structure, and explicit output rules
    if (depth === "detailed") {
      prompt +=
        " Provide a clear, well-structured, detailed response. Use headings, bullet points, and numbered lists where appropriate. Be thorough but concise.";
    }

    if (depth === "comprehensive") {
      prompt +=
        " Deliver a comprehensive, in-depth answer. Include step-by-step reasoning, real-world examples, pros/cons, edge cases, and practical applications. Use clear sections and formatting.";
    }

    if (depth === "expert") {
      prompt +=
        " Act as a world-class domain expert. Give advanced, nuanced insights, include relevant frameworks/theories, case studies, potential pitfalls, and actionable strategies. Use precise, professional language.";
    }

    if (tone === "friendly") {
      prompt += " Use a warm, friendly, conversational tone — like explaining to a smart colleague.";
    }
    if (tone === "professional") {
      prompt += " Use a polished, professional, confident tone suitable for business or technical contexts.";
    }
    if (tone === "academic") {
      prompt += " Use a formal, academic tone with precise terminology, citations where relevant, and logical structure.";
    }
    if (tone === "neutral") {
      prompt += " Maintain an objective, neutral, and factual tone.";
    }

    // Optional: Claude loves XML tags for structure — hint at it
    prompt +=
      " Structure your output using clear markdown or simple XML tags (e.g. <thinking>, <output>) if it helps organize complex reasoning.";

    setResult(prompt);
  };

  const copyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addToFavorites = () => {
    if (!result || favorites.includes(result)) return;
    setFavorites([...favorites, result]);
  };

  const removeFavorite = (promptToRemove) => {
    setFavorites(favorites.filter((p) => p !== promptToRemove));
  };

  const clearAll = () => {
    setTopic("");
    setStyle("random");
    setDepth("detailed");
    setTone("neutral");
    setResult("");
    setError("");
    setCopied(false);
  };

  return (
    <>
      <Helmet>
        <title>Claude Prompt Generator | GeneratorPromptAI</title>
        <meta
          name="description"
          content="Create powerful, optimized prompts for Claude AI Anthropic instantly. Customize depth, tone & style for better writing, coding, research & analysis results. Free tool — no sign-up."
        />
        <meta
          name="keywords"
          content="claude prompt generator, claude ai prompts, anthropic claude prompt builder, best claude prompts 2026, claude prompt engineering tool, generatepromptai"
        />
        <link
          rel="canonical"
          href="https://generatorpromptai.com/tools/claude-prompt-generator"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Claude Prompt Generator | GeneratorPromptAI" />
        <meta
          property="og:description"
          content="Generate high-quality prompts tailored for Claude AI in seconds. Perfect for developers, writers, researchers & professionals."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/tools/claude-prompt-generator" />
        <meta property="og:site_name" content="GeneratorPromptAI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Claude Prompt Generator" />
        <meta
          name="twitter:description"
          content="Build better Claude AI prompts instantly — free & optimized."
        />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Claude Prompt Generator",
            url: "https://generatorpromptai.com/tools/claude-prompt-generator",
            description:
              "Free tool to create optimized, high-performance prompts for Anthropic's Claude AI models.",
            applicationCategory: "AI Tool",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "GeneratorPromptAI",
              url: "https://generatorpromptai.com",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Claude Prompt Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Generate powerful, optimized prompts for Anthropic's Claude AI instantly.
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic / Task
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Analyze this business strategy, Write a Python script for..., Explain quantum entanglement..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depth / Detail
                  </label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="detailed">Detailed</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="expert">Expert / Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Style (coming soon)
                  </label>
                  <select
                    value={style}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed"
                  >
                    <option value="random">Random (placeholder)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={generatePrompt}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 flex-1"
                >
                  <RefreshCw size={18} /> Generate Prompt
                </button>

                <button
                  onClick={clearAll}
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>

            {result && (
              <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">
                  {result}
                </pre>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={copyPrompt}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Copy size={18} />
                    {copied ? "Copied!" : "Copy Prompt"}
                  </button>

                  <button
                    onClick={addToFavorites}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Star size={18} fill="currentColor" />
                    Add to Favorites
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Favorite Claude Prompts
              </h2>
              <div className="space-y-4">
                {favorites.map((fav, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-xl p-5 flex justify-between items-start gap-4"
                  >
                    <pre className="whitespace-pre-wrap text-gray-700 flex-1 text-sm leading-relaxed">
                      {fav}
                    </pre>
                    <button
                      onClick={() => removeFavorite(fav)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove from favorites"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Free Claude Prompt Generator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <p>Craft high-quality prompts for Claude AI. This includes models like Sonnet, Opus, and Haiku.</p><p>Choose the depth and tone you want. This will help you get better results in many areas.</p><p>You don't need to log in. It's completely free.</p>            </p>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">How to Use</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Describe your topic or task clearly.</li>
              <li>Select depth level and desired tone.</li>
              <li>Click "Generate Prompt".</li>
              <li>Copy and paste directly into Claude.ai or the API.</li>
              <li>Save excellent prompts to your favorites list.</li>
            </ol>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related AI Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/tools/chatgpt-prompt-generator"
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">ChatGPT Prompt Generator</h3>
                <p className="text-gray-600 text-sm">
                  Optimized prompts for OpenAI's ChatGPT models.
                </p>
              </Link>

              <Link
                to="/tools/gemini-prompt-generator"
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">Gemini Prompt Generator</h3>
                <p className="text-gray-600 text-sm">
                  Tailored prompts for Google's Gemini AI.
                </p>
              </Link>

              <Link
                to="/tools/midjourney-prompt-generator"
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">
                  Midjourney Prompt Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create stunning image generation prompts.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ClaudePromptGenerator;