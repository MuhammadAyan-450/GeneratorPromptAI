import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, Star, Trash2, RefreshCw, Sparkles, Home, ChevronDown } from "lucide-react";
import chatgptPrompts from "../data/prompts/chatgpt";

const ChatGptPromptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [tone, setTone] = useState("neutral");
  const [result, setResult] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [favCopied, setFavCopied] = useState(-1);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

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
      prompt += " Deliver a comprehensive, in-depth response: include step-by-step explanations, real-world examples, pros & cons, comparisons, and practical applications.";
    if (depth === "expert")
      prompt += " Respond as a world-class expert with PhD-level depth: include advanced concepts, case studies, cutting-edge techniques, potential pitfalls, and actionable insights.";

    if (tone === "friendly") prompt += " Use a warm, friendly, conversational tone like talking to a smart friend.";
    if (tone === "professional") prompt += " Use a polished, professional, business-like tone.";
    if (tone === "motivational") prompt += " Use an uplifting, motivational tone to inspire and energize the reader.";
    if (tone === "academic") prompt += " Use a formal, academic tone with precise language and proper structure.";
    if (tone === "humorous") prompt += " Incorporate light, clever humor where it fits naturally without forcing it.";

    setResult(prompt);
    setCopied(false);
  };

  const copyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyFavorite = (text, index) => {
    navigator.clipboard.writeText(text);
    setFavCopied(index);
    setTimeout(() => setFavCopied(-1), 2000);
  };

  const addToFavorites = () => {
    if (!result || favorites.includes(result)) return;
    setFavorites([result, ...favorites]);
  };

  const removeFavorite = (promptToRemove) => {
    setFavorites(favorites.filter((p) => p !== promptToRemove));
  };

  const clearAll = () => {
    setTopic("");
    setDepth("detailed");
    setTone("neutral");
    setResult("");
    setError("");
    setCopied(false);
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Custom ChatGPT Prompt Builder with Tone & Depth Settings",
    "url": "https://www.generatorpromptai.com/tools/chatgpt-prompt-generator",
    "applicationCategory": "AIApplication",
    "operatingSystem": "All",
    "description": "Free tool to generate custom ChatGPT prompts for coding, blog writing, and marketing. Set tone, depth, and style to write better prompts for GPT-4.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "ChatGPT Prompt Builder", "item": "https://www.generatorpromptai.com/tools/chatgpt-prompt-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to write better prompts for ChatGPT for coding and writing?",
        "acceptedAnswer": { "@type": "Answer", "text": "To write better prompts, be specific about your goal, provide context, and specify the output format. Use our tool to automatically add depth (Detailed, Comprehensive, Expert) and tone (Professional, Academic, Friendly) to your basic topic." }
      },
      {
        "@type": "Question",
        "name": "Can I generate ChatGPT prompts for blog writing with a specific tone?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Enter your blog topic, select 'Detailed' or 'Comprehensive' depth, and choose a tone like 'Professional' or 'Friendly'. The tool will generate a structured prompt tailored for blog writing." }
      },
      {
        "@type": "Question",
        "name": "Does this prompt builder work with GPT-4 and GPT-4o?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. The prompts generated are optimized for all OpenAI models including GPT-3.5, GPT-4, and GPT-4o. They also work well with Claude and Gemini." }
      },
      {
        "@type": "Question",
        "name": "What is the difference between Detailed, Comprehensive, and Expert depth?",
        "acceptedAnswer": { "@type": "Answer", "text": "Detailed gives a clear, structured answer. Comprehensive adds examples, pros/cons, and comparisons. Expert provides PhD-level analysis with case studies and advanced techniques." }
      },
      {
        "@type": "Question",
        "name": "Can I save and copy the generated prompts?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can copy any generated prompt to your clipboard with one click, or save it to your favorites list within the tool for quick access later." }
      }
    ]
  };

  const depthOptions = [
    { value: "detailed", label: "Detailed" },
    { value: "comprehensive", label: "Comprehensive" },
    { value: "expert", label: "Expert / Advanced" },
  ];

  const toneOptions = [
    { value: "neutral", label: "Neutral" },
    { value: "friendly", label: "Friendly" },
    { value: "professional", label: "Professional" },
    { value: "motivational", label: "Motivational" },
    { value: "academic", label: "Academic" },
    { value: "humorous", label: "Humorous" },
  ];

  return (
    <>
      <Helmet>
        {/* Title targeting long-tails */}
        <title>Generate ChatGPT Prompts for Coding & Writing – Custom Tone & Depth Builder</title>
        
        <meta
          name="description"
          content="Build custom ChatGPT prompts for coding, blog writing, and marketing instantly. Set depth (Detailed/Expert) and tone (Professional/Academic) to write better prompts for GPT-4. Free online tool."
        />
        
        {/* Low competition long-tail keywords */}
        <meta
          name="keywords"
          content="how to write better prompts for chatgpt for coding, generate chatgpt prompts for blog writing with tone, custom chatgpt prompt builder with depth and tone settings, prompt engineering template generator for gpt-4, create structured prompts for chatgpt free, chatgpt prompt ideas for content writing and marketing, best prompt format for chatgpt coding"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/chatgpt-prompt-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (No emojis) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate ChatGPT Prompts for Coding & Writing – Custom Tone Builder" />
        <meta property="og:description" content="Build custom prompts for ChatGPT with tone and depth settings. Get better results for coding, writing, and marketing tasks." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/chatgpt-prompt-generator" />

        {/* Twitter Card (No emojis) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom ChatGPT Prompt Builder with Tone & Depth Settings" />
        <meta name="twitter:description" content="Generate structured prompts for ChatGPT. Set tone, depth, and format for GPT-4. Free online tool." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb Only ── */}
        <div className="max-w-5xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-sky-600 transition-colors">
                  <Home size={14} /> Home
                </Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li>
                <Link to="/pages/all-tools" className="hover:text-sky-600 transition-colors">All Tools</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">ChatGPT Prompt Builder</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Sparkles className="text-sky-600" size={26} />
            </div>
            {/* H1 targeting exact match long-tails */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Custom ChatGPT Prompt Builder –{" "}
              <span className="text-sky-600">Set Tone & Depth</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Generate structured prompts for ChatGPT for <strong>coding, blog writing, and marketing</strong>. Customize depth and tone to write better prompts for GPT-4 instantly.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
            <div className="space-y-5">

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Topic / Task
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generatePrompt()}
                  placeholder="e.g., Write a blog post about sustainable fashion"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                />
              </div>

              {/* Options Grid */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Depth / Length
                  </label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800"
                  >
                    {depthOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800"
                  >
                    {toneOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={generatePrompt}
                  className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 flex-1"
                >
                  <RefreshCw size={17} /> Generate Prompt
                </button>
                <button
                  onClick={clearAll}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>

            {/* Result */}
            {result && (
              <div className="mt-8 bg-sky-50 border border-sky-100 rounded-2xl p-6">
                <p className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-3">
                  Generated Prompt
                </p>
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm md:text-base">
                  {result}
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={copyPrompt}
                    className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Copy size={15} />
                    {copied ? "Copied!" : "Copy Prompt"}
                  </button>
                  <button
                    onClick={addToFavorites}
                    className="inline-flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Star size={15} fill="currentColor" />
                    Save to Favorites
                  </button>
                  <button
                    onClick={generatePrompt}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <RefreshCw size={15} /> Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star size={18} className="text-yellow-400" fill="currentColor" />
                Saved Prompts ({favorites.length})
              </h2>
              <div className="space-y-3">
                {favorites.map((fav, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-start gap-4"
                  >
                    <p className="whitespace-pre-wrap text-gray-700 flex-1 text-sm leading-relaxed">
                      {fav}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyFavorite(fav, index)}
                        title="Copy"
                        className="text-gray-400 hover:text-sky-600 transition-colors p-1"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => removeFavorite(fav)}
                        title="Remove"
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {favCopied === index && (
                      <span className="text-xs text-green-600 font-medium">Copied!</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "generate chatgpt prompts for blog writing with tone" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Generate ChatGPT Prompts for Coding, Blog Writing & Marketing
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Getting great responses from ChatGPT starts with knowing <strong>how to write better prompts</strong>. Instead of guessing the right format, use our custom ChatGPT prompt builder to automatically structure your request. Simply enter your topic, choose your preferred depth, and set the tone.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Whether you need a prompt for <strong>coding help</strong>, a <strong>blog writing outline</strong>, or a <strong>marketing copy brief</strong>, this tool formats the instructions perfectly so GPT-4 knows exactly what to do, how deep to go, and what tone to use.
            </p>
          </div>

          {/* ── Features Section ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "prompt engineering template generator for gpt-4" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Prompt Engineering Template Generator – Depth & Tone Controls
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "3 Depth Levels", desc: "Choose Detailed (clear structure), Comprehensive (with examples and comparisons), or Expert (PhD-level analysis with case studies)." },
                { title: "6 Tone Options", desc: "Set the exact voice: Neutral, Friendly, Professional, Motivational, Academic, or Humorous to match your brand or audience." },
                { title: "Optimized for GPT-4", desc: "Prompts are structured using proven prompt engineering frameworks to get the maximum quality out of GPT-4 and GPT-4o." },
                { title: "Save & Organize", desc: "Save your best prompts to a local favorites list. Copy them anytime to paste into ChatGPT, Claude, or Gemini." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Section (Accordion) ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ChatGPT Prompt Builder – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to write better prompts for ChatGPT for coding and writing?",
                  a: "To write better prompts, be specific about your goal, provide context, and specify the output format. Use our tool to automatically add depth (Detailed, Comprehensive, Expert) and tone (Professional, Academic, Friendly) to your basic topic."
                },
                {
                  q: "Can I generate ChatGPT prompts for blog writing with a specific tone?",
                  a: "Yes. Enter your blog topic, select 'Detailed' or 'Comprehensive' depth, and choose a tone like 'Professional' or 'Friendly'. The tool will generate a structured prompt tailored for blog writing."
                },
                {
                  q: "Does this prompt builder work with GPT-4 and GPT-4o?",
                  a: "Yes. The prompts generated are optimized for all OpenAI models including GPT-3.5, GPT-4, and GPT-4o. They also work well with Claude and Gemini."
                },
                {
                  q: "What is the difference between Detailed, Comprehensive, and Expert depth?",
                  a: "Detailed gives a clear, structured answer. Comprehensive adds examples, pros/cons, and comparisons. Expert provides PhD-level analysis with case studies and advanced techniques."
                },
                {
                  q: "Can I save and copy the generated prompts?",
                  a: "Yes. You can copy any generated prompt to your clipboard with one click, or save it to your favorites list within the tool for quick access later."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300"
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
                      className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Related AI Prompt Building Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  to: "/tools/claude-prompt-generator",
                  title: "Claude Prompt Generator",
                  desc: "Build optimized prompts specifically tuned for Anthropic's Claude AI model.",
                },
                {
                  to: "/tools/midjourney-prompt-generator",
                  title: "Midjourney Prompt Builder",
                  desc: "Craft detailed image prompts with art styles, lighting, and camera angles.",
                },
                {
                  to: "/tools/youtube-script-prompt-generator",
                  title: "YouTube Script Prompt Builder",
                  desc: "Generate structured prompts to create video scripts, hooks, and outlines.",
                },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default ChatGptPromptGenerator;