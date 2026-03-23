import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, Star, Trash2, RefreshCw } from "lucide-react";
import chatgptPrompts from "../data/prompts/chatgpt";

const ChatGptPromptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("random"); // kept but not used yet – you can expand later
  const [depth, setDepth] = useState("detailed");
  const [tone, setTone] = useState("neutral");
  const [result, setResult] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("favoritePrompts");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favoritePrompts", JSON.stringify(favorites));
    }
  }, [favorites]);

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter a topic first.");
      return;
    }

    let base = chatgptPrompts[Math.floor(Math.random() * chatgptPrompts.length)];
    let prompt = base.replaceAll("{topic}", topic.trim());

    if (depth === "detailed")
      prompt += " Provide a detailed, well-structured answer with clear explanations, bullet points where helpful, and logical flow.";

    if (depth === "comprehensive")
      prompt +=
        " Deliver a comprehensive, in-depth response: include step-by-step explanations, real-world examples, pros & cons, comparisons, and practical applications.";

    if (depth === "expert")
      prompt +=
        " Respond as a world-class expert with PhD-level depth: include advanced concepts, case studies, cutting-edge techniques, potential pitfalls, and actionable insights.";

    if (tone === "friendly") prompt += " Use a warm, friendly, conversational tone like talking to a smart friend.";
    if (tone === "professional") prompt += " Use a polished, professional, business-like tone.";
    if (tone === "motivational") prompt += " Use an uplifting, motivational tone to inspire and energize the reader.";
    if (tone === "academic") prompt += " Use a formal, academic tone with precise language and proper structure.";
    if (tone === "humorous") prompt += " Incorporate light, clever humor where it fits naturally without forcing it.";

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
        <title>ChatGPT Prompt Generator | GeneratorPromptAI</title>
        <meta
          name="description"
          content="Create powerful, optimized ChatGPT prompts instantly. Customize tone, depth & style for better AI results. Free tool by GeneratorPromptAI."
        />
        <meta
          name="keywords"
          content="chatgpt prompt generator, free chatgpt prompts, ai prompt builder, best chatgpt prompts 2025, prompt engineering tool, generatepromptai"
        />
        <link
          rel="canonical"
          href="https://generatorpromptai.com/tools/chatgpt-prompt-generator"
        />

        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="ChatGPT Prompt Generator | GeneratorPromptAI" />
        <meta
          property="og:description"
          content="Instantly generate high-quality, customized prompts for ChatGPT. Perfect for writing, coding, learning, marketing & more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/tools/chatgpt-prompt-generator" />
        <meta property="og:site_name" content="GeneratorPromptAI" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free ChatGPT Prompt Generator" />
        <meta
          name="twitter:description"
          content="Build better ChatGPT prompts in seconds – free & no sign-up."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ChatGPT Prompt Generator",
            url: "https://generatorpromptai.com/tools/chatgpt-prompt-generator",
            description:
              "Free tool to generate optimized prompts for ChatGPT and other LLMs.",
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
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8">
            ChatGPT Prompt Generator
          </h1>

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
                  placeholder="e.g., Write a blog post about sustainable fashion"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* You can style these selects the same way – or use a UI lib like Headless UI later */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depth / Length
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
                    <option value="motivational">Motivational</option>
                    <option value="academic">Academic</option>
                    <option value="humorous">Humorous</option>
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

            {/* Result Area */}
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

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Favorite Prompts
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
                      title="Remove"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Free ChatGPT Prompt Generator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Create high-quality, ready-to-use prompts for ChatGPT in seconds. Choose your desired depth, tone, and style. It's perfect for content writing, coding help, learning, marketing copy, brainstorming, and more. No sign-up required.
            </p>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">How to Use</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Enter your topic or task (be as specific as possible).</li>
              <li>Select preferred depth and tone.</li>
              <li>Click "Generate Prompt".</li>
              <li>Copy the result and paste directly into ChatGPT.</li>
              <li>Save great prompts to favorites for later.</li>
            </ol>
          </section>

          {/* Related Tools – keep consistent style */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related AI Prompt Tools
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/tools/ai-prompt-generator"
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">AI Prompt Generator</h3>
                <p className="text-gray-600 text-sm">
                  Universal prompt builder for ChatGPT, Claude, Gemini & more.
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
                  Craft detailed prompts for stunning AI-generated images.
                </p>
              </Link>

              <Link
                to="/tools/claude-prompt-generator"
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">
                  Claude Prompt Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Optimized prompts for Anthropic’s Claude models.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ChatGptPromptGenerator;