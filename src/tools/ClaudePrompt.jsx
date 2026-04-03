// pages/ClaudePromptGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Star, Trash2, Sparkles, ExternalLink } from "lucide-react";
import claudePrompts from "../data/prompts/claude";

const USE_CASES = [
  { value: "general", label: "🧠 General", hint: "Any topic or task" },
  { value: "coding", label: "💻 Coding", hint: "Debug, write, explain code" },
  { value: "writing", label: "✍️ Writing", hint: "Blog, email, copy, scripts" },
  { value: "analysis", label: "📊 Analysis", hint: "Research, summarize, evaluate" },
  { value: "creative", label: "🎨 Creative", hint: "Ideas, stories, brainstorming" },
  { value: "business", label: "💼 Business", hint: "Strategy, reports, proposals" },
];

const DEPTH_OPTIONS = [
  { value: "detailed", label: "Detailed", desc: "Clear & well-structured" },
  { value: "comprehensive", label: "Comprehensive", desc: "In-depth with examples" },
  { value: "expert", label: "Expert", desc: "PhD-level advanced insights" },
];

const TONE_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "academic", label: "Academic" },
];

const FORMAT_OPTIONS = [
  { value: "default", label: "Default", desc: "Let Claude decide" },
  { value: "bullets", label: "Bullet Points", desc: "Quick scannable lists" },
  { value: "steps", label: "Step-by-Step", desc: "Numbered instructions" },
  { value: "table", label: "Table", desc: "Structured comparison" },
  { value: "xml", label: "XML Tags", desc: "Claude's native format" },
  { value: "markdown", label: "Markdown", desc: "Headers & formatting" },
];

const ClaudePromptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [useCase, setUseCase] = useState("general");
  const [depth, setDepth] = useState("detailed");
  const [tone, setTone] = useState("neutral");
  const [format, setFormat] = useState("default");
  const [result, setResult] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [favCopied, setFavCopied] = useState(-1);
  const [error, setError] = useState("");

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter a topic or task first.");
      return;
    }

    let base = claudePrompts[Math.floor(Math.random() * claudePrompts.length)];
    let prompt = base.replaceAll("{topic}", topic.trim());

    // Use case context
    const useCaseMap = {
      coding: " You are an expert software engineer. Focus on clean, efficient, well-commented code with error handling and best practices.",
      writing: " You are a skilled writer and editor. Focus on clarity, engagement, strong structure, and compelling language.",
      analysis: " You are a rigorous analyst. Focus on evidence-based reasoning, key insights, data interpretation, and clear conclusions.",
      creative: " You are a creative director with a bold imagination. Focus on original ideas, unexpected angles, and creative depth.",
      business: " You are a senior business consultant. Focus on strategic thinking, ROI, actionable recommendations, and professional framing.",
    };
    if (useCaseMap[useCase]) prompt += useCaseMap[useCase];

    // Depth
    const depthMap = {
      detailed: " Provide a clear, well-structured, detailed response. Use headings and bullet points where helpful. Be thorough but concise.",
      comprehensive: " Deliver a comprehensive, in-depth answer with step-by-step reasoning, real-world examples, pros/cons, edge cases, and practical applications.",
      expert: " Act as a world-class domain expert. Provide advanced, nuanced insights including relevant frameworks, case studies, potential pitfalls, and actionable strategies. Use precise, professional language.",
    };
    prompt += depthMap[depth] || "";

    // Tone
    const toneMap = {
      friendly: " Use a warm, friendly, conversational tone — like explaining to a trusted colleague.",
      professional: " Use a polished, professional, confident tone suitable for business or technical contexts.",
      academic: " Use a formal, academic tone with precise terminology and logical structure.",
      neutral: " Maintain an objective, neutral, and factual tone throughout.",
    };
    prompt += toneMap[tone] || "";

    // Output format
    const formatMap = {
      bullets: " Format your entire response using bullet points and concise sub-bullets for clarity.",
      steps: " Format your response as clearly numbered steps. Start each step on a new line.",
      table: " Where possible, present information in a well-structured markdown table with clear column headers.",
      xml: " Structure your response using Claude's native XML tags. Use <thinking> for your reasoning process and <output> for the final answer.",
      markdown: " Format your response using rich markdown: use ## headings, **bold** for key terms, bullet lists, and code blocks where relevant.",
    };
    if (formatMap[format]) prompt += " " + formatMap[format];

    setResult(prompt);
    setCopied(false);
  };

  const copyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInClaude = () => {
    if (!result) return;
    const url = `https://claude.ai/new?q=${encodeURIComponent(result)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const addToFavorites = () => {
    if (!result || favorites.some((f) => f.text === result)) return;
    setFavorites([{ text: result, useCase, tone, depth, format, topic }, ...favorites]);
  };

  const removeFavorite = (index) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  const copyFavorite = (text, index) => {
    navigator.clipboard.writeText(text);
    setFavCopied(index);
    setTimeout(() => setFavCopied(-1), 2000);
  };

  const clearAll = () => {
    setTopic(""); setUseCase("general"); setDepth("detailed");
    setTone("neutral"); setFormat("default");
    setResult(""); setError(""); setCopied(false);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Claude Prompt Generator",
    url: "https://generatorpromptai.com/tools/claude-prompt-generator",
    applicationCategory: "AIApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free tool to generate optimized prompts for Anthropic's Claude AI. Customize use case, depth, tone and output format.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Claude prompt generator?",
        acceptedAnswer: { "@type": "Answer", text: "A Claude prompt generator helps you create optimized prompts specifically designed for Anthropic's Claude AI models, including Claude 3 Sonnet, Opus, and Haiku." },
      },
      {
        "@type": "Question",
        name: "Is this Claude prompt generator free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. No sign-up, no account, no payment required." },
      },
      {
        "@type": "Question",
        name: "What makes a good Claude prompt?",
        acceptedAnswer: { "@type": "Answer", text: "Claude responds best to clear instructions with explicit context, a defined role or persona, specified output format (Claude loves XML tags), and well-defined goals. Our generator builds all of this automatically." },
      },
      {
        "@type": "Question",
        name: "Can I use these prompts with Claude 3 Opus and Sonnet?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. All prompts work with all Claude models including Claude 3 Haiku, Sonnet, Opus, and Claude 3.5 Sonnet." },
      },
      {
        "@type": "Question",
        name: "What is the XML tags format option?",
        acceptedAnswer: { "@type": "Answer", text: "Claude natively understands XML-style tags like <thinking> and <output>. Using these in your prompt helps Claude organize complex reasoning and separate its thought process from its final answer, leading to better results." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Claude Prompt Generator - Free Tool for Better Claude AI Prompts | GeneratorPromptAI</title>
        <meta
          name="description"
          content="Free Claude prompt generator — create optimized prompts for Anthropic's Claude AI instantly. Choose use case, depth, tone and output format. Works with Claude 3 Sonnet, Opus & Haiku. No sign-up."
        />
        <meta
          name="keywords"
          content="claude prompt generator, claude ai prompts, anthropic claude prompts, claude 3 prompt builder, best claude prompts 2026, claude prompt engineering, claude sonnet prompts, claude opus prompts"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/claude-prompt-generator" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Claude Prompt Generator - Better Prompts for Claude AI Free" />
        <meta property="og:description" content="Generate optimized prompts for Anthropic's Claude AI. Choose use case, depth, tone and output format. Free, no sign-up needed." />
        <meta property="og:url" content="https://generatorpromptai.com/tools/claude-prompt-generator" />
        <meta property="og:image" content="https://generatorpromptai.com/og-claude-prompt-generator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Claude Prompt Generator - Optimized for Claude AI" />
        <meta name="twitter:description" content="Create powerful Claude AI prompts instantly. Choose use case, tone, depth and output format. Free tool." />
        <meta name="twitter:image" content="https://generatorpromptai.com/og-claude-prompt-generator.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Back Nav */}
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 mb-4">
              <Sparkles className="text-orange-500" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Claude Prompt Generator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Generate powerful, optimized prompts for Anthropic's Claude AI. Choose your use case, tone, depth and output format.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Topic */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Topic / Task
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generatePrompt()}
                placeholder="e.g., Analyze this business strategy, Write a Python script, Explain quantum computing..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-800"
              />
            </div>

            {/* Use Case — NEW FEATURE */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Use Case
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.value}
                    onClick={() => setUseCase(uc.value)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${useCase === uc.value
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                  >
                    <span className="text-sm font-medium">{uc.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{uc.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Depth + Tone */}
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Depth / Detail</label>
                <div className="space-y-2">
                  {DEPTH_OPTIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDepth(d.value)}
                      className={`w-full flex justify-between items-center px-4 py-2.5 rounded-xl border text-sm transition-all ${depth === d.value
                          ? "border-orange-400 bg-orange-50 text-orange-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                    >
                      <span className="font-medium">{d.label}</span>
                      <span className="text-xs text-gray-400">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tone</label>
                <div className="space-y-2">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${tone === t.value
                          ? "border-orange-400 bg-orange-50 text-orange-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Format — NEW FEATURE */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Output Format
                <span className="ml-2 text-xs font-normal text-gray-400">Claude responds best with explicit format instructions</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FORMAT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${format === f.value
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                  >
                    <span className="text-sm font-medium">{f.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={generatePrompt}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 flex-1"
              >
                <Sparkles size={17} /> Generate Claude Prompt
              </button>
              <button
                onClick={clearAll}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

            {/* Result */}
            {result && (
              <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">
                    Generated Claude Prompt
                  </p>
                  <span className="text-xs text-gray-400">
                    {result.length} characters
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm md:text-base">
                  {result}
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={copyPrompt}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Copy size={15} />
                    {copied ? "Copied!" : "Copy Prompt"}
                  </button>
                  {/* NEW: Open directly in Claude.ai */}
                  <button
                    onClick={openInClaude}
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <ExternalLink size={15} /> Open in Claude.ai
                  </button>
                  <button
                    onClick={addToFavorites}
                    className="inline-flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Star size={15} fill="currentColor" /> Save
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
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{fav.useCase}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{fav.depth}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{fav.tone}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{fav.format}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{fav.text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyFavorite(fav.text, index)}
                        className="text-xs text-gray-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
                      >
                        <Copy size={13} /> {favCopied === index ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => removeFavorite(index)}
                        className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Claude Prompt Generator — Optimized for Anthropic's Claude AI
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Claude AI responds differently to prompts than other AI models. It works best with clear role definitions, explicit output format instructions, structured context, and specific goals. Our Claude prompt generator is built specifically around these principles to help you get dramatically better results.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Whether you're using Claude for coding, writing, analysis, research, or creative work — our tool builds the right prompt structure automatically. Just choose your use case, pick your depth and tone, select an output format, and generate a ready-to-use Claude prompt in seconds.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What's unique about prompting Claude?</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li>Claude excels with XML tags like <code className="bg-gray-100 px-1 rounded">&lt;thinking&gt;</code> and <code className="bg-gray-100 px-1 rounded">&lt;output&gt;</code> for structured reasoning</li>
              <li>Explicit role definitions dramatically improve Claude's responses</li>
              <li>Claude handles long, complex prompts better than most AI models</li>
              <li>Specifying output format upfront leads to cleaner, more usable results</li>
              <li>Works with Claude 3 Haiku, Sonnet, Opus, and Claude 3.5 Sonnet</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "What is a Claude prompt generator?", a: "A Claude prompt generator helps you create optimized prompts specifically designed for Anthropic's Claude AI models, including Claude 3 Sonnet, Opus, and Haiku." },
                { q: "Is this tool free?", a: "Yes, completely free. No sign-up, no account, no payment required." },
                { q: "What makes a good Claude prompt?", a: "Claude responds best to clear instructions with explicit context, a defined role, a specified output format (Claude loves XML tags), and well-defined goals. Our generator builds all of this automatically." },
                { q: "What is the XML tags output format?", a: "Claude natively understands XML-style tags like <thinking> and <output>. Using these helps Claude separate its reasoning from its final answer, leading to significantly better results on complex tasks." },
                { q: "Can I use these prompts with Claude 3.5 Sonnet?", a: "Yes. All prompts work with every Claude model — Claude 3 Haiku, Sonnet, Opus, Claude 3.5 Sonnet, and future Claude versions." },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related AI Prompt Tools</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { to: "/tools/chatgpt-prompt-generator", title: "ChatGPT Prompt Generator", desc: "Optimized prompts for OpenAI's ChatGPT, GPT-4 and GPT-4o." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count characters for Instagram captions and TikTok bios." },
                { to: "/tools/midjourney-prompt-generator", title: "Midjourney Prompt Generator", desc: "Create detailed prompts for stunning AI-generated images." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-orange-300 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-orange-500 transition-colors">{tool.title}</h3>
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

export default ClaudePromptGenerator;