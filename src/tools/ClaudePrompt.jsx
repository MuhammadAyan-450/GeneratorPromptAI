import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Star, Trash2, Sparkles, ExternalLink, Home, ChevronDown } from "lucide-react";
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
  const [openFaq, setOpenFaq] = useState(null);

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter a topic or task first.");
      return;
    }

    let base = claudePrompts[Math.floor(Math.random() * claudePrompts.length)];
    let prompt = base.replaceAll("{topic}", topic.trim());

    const useCaseMap = {
      coding: " You are an expert software engineer. Focus on clean, efficient, well-commented code with error handling and best practices.",
      writing: " You are a skilled writer and editor. Focus on clarity, engagement, strong structure, and compelling language.",
      analysis: " You are a rigorous analyst. Focus on evidence-based reasoning, key insights, data interpretation, and clear conclusions.",
      creative: " You are a creative director with a bold imagination. Focus on original ideas, unexpected angles, and creative depth.",
      business: " You are a senior business consultant. Focus on strategic thinking, ROI, actionable recommendations, and professional framing.",
    };
    if (useCaseMap[useCase]) prompt += useCaseMap[useCase];

    const depthMap = {
      detailed: " Provide a clear, well-structured, detailed response. Use headings and bullet points where helpful. Be thorough but concise.",
      comprehensive: " Deliver a comprehensive, in-depth answer with step-by-step reasoning, real-world examples, pros/cons, edge cases, and practical applications.",
      expert: " Act as a world-class domain expert. Provide advanced, nuanced insights including relevant frameworks, case studies, potential pitfalls, and actionable strategies. Use precise, professional language.",
    };
    prompt += depthMap[depth] || "";

    const toneMap = {
      friendly: " Use a warm, friendly, conversational tone — like explaining to a trusted colleague.",
      professional: " Use a polished, professional, confident tone suitable for business or technical contexts.",
      academic: " Use a formal, academic tone with precise terminology and logical structure.",
      neutral: " Maintain an objective, neutral, and factual tone throughout.",
    };
    prompt += toneMap[tone] || "";

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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Custom Claude AI Prompt Builder with XML Tags",
    "url": "https://www.generatorpromptai.com/tools/claude-prompt-generator",
    "applicationCategory": "AIApplication",
    "operatingSystem": "All",
    "description": "Free tool to generate custom Claude prompts with XML tags, tone, and depth settings. Optimized for Claude 3.5 Sonnet, Opus, and Haiku.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Claude Prompt Builder", "item": "https://www.generatorpromptai.com/tools/claude-prompt-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to write prompts for Claude 3.5 Sonnet and Opus?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To write effective prompts for Claude 3.5 Sonnet or Opus, clearly define a role, provide context, specify the output format (like XML tags), and state your goal. Our tool automatically structures these elements for you."
        }
      },
      {
        "@type": "Question",
        "name": "What are XML tags in Claude prompts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "XML tags like <thinking> and <output> are Claude's native way of organizing information. Prompting Claude to use <thinking> for its reasoning process and <output> for the final answer dramatically improves accuracy on complex tasks."
        }
      },
      {
        "@type": "Question",
        "name": "Can I generate Claude prompts for coding and data analysis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Select the 'Coding' or 'Analysis' use case in our tool. It will automatically assign an expert software engineer or rigorous analyst role to the prompt to get the best results from Claude."
        }
      },
      {
        "@type": "Question",
        "name": "Is this Claude prompt format builder free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% free. No signup, no account, no limits. Generate unlimited custom Claude prompts with specific tones, depths, and formats."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Title targeting low-comp long-tails */}
        <title>Generate Claude Prompts for Claude 3.5 Sonnet & Opus – XML Tags Builder</title>

        <meta
          name="description"
          content="Free Claude AI prompt builder with XML tags support. Generate custom Claude prompts for Claude 3.5 Sonnet, Opus, and Haiku. Set tone, depth, and format (XML, Markdown) for better AI results."
        />

        {/* Low comp keywords */}
        <meta
          name="keywords"
          content="how to write prompts for claude 3.5 sonnet, claude ai prompt builder with xml tags, claude prompt format with thinking and output tags, generate claude prompts for coding and analysis, custom claude prompt template generator free, claude 3 opus sonnet prompt engineering tool, claude xml tags format prompt"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/claude-prompt-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (No emojis) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate Claude Prompts for Claude 3.5 Sonnet & Opus – XML Tags Builder" />
        <meta property="og:description" content="Build custom Claude prompts with XML tags, tone, and depth settings. Optimized for Claude 3.5 Sonnet, Opus, and Haiku." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/claude-prompt-generator" />

        {/* Twitter Card (No emojis) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Claude AI Prompt Builder with XML Tags Support" />
        <meta name="twitter:description" content="Generate structured Claude prompts with thinking/output tags, tone, and depth. Free online tool." />

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
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                  <Home size={14} /> Home
                </Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li>
                <Link to="/pages/all-tools" className="hover:text-orange-500 transition-colors">All Tools</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">Claude Prompt Builder</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 mb-4">
              <Sparkles className="text-orange-500" size={26} />
            </div>
            {/* H1 targeting long-tails */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Custom Claude AI Prompt Builder –{" "}
              <span className="text-orange-500">XML Tags & Tone Settings</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Generate Claude prompts for <strong>Claude 3.5 Sonnet & Opus</strong>. Use XML tags, set depth, tone, and format to get significantly better AI responses.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Topic */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Topic / Task</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generatePrompt()}
                placeholder="e.g., Analyze this business strategy, Write a Python script, Explain quantum computing..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-800"
              />
            </div>

            {/* Use Case */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Use Case</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.value}
                    onClick={() => setUseCase(uc.value)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${useCase === uc.value ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
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
                    <button key={d.value} onClick={() => setDepth(d.value)} className={`w-full flex justify-between items-center px-4 py-2.5 rounded-xl border text-sm transition-all ${depth === d.value ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}>
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
                    <button key={t.value} onClick={() => setTone(t.value)} className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${tone === t.value ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Format */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Output Format
                <span className="ml-2 text-xs font-normal text-gray-400">Claude responds best with explicit format instructions</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FORMAT_OPTIONS.map((f) => (
                  <button key={f.value} onClick={() => setFormat(f.value)} className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${format === f.value ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}>
                    <span className="text-sm font-medium">{f.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={generatePrompt} className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 flex-1">
                <Sparkles size={17} /> Generate Claude Prompt
              </button>
              <button onClick={clearAll} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors">Clear All</button>
            </div>

            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

            {/* Result */}
            {result && (
              <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Generated Claude Prompt</p>
                  <span className="text-xs text-gray-400">{result.length} characters</span>
                </div>
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm md:text-base">{result}</p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <button onClick={copyPrompt} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    <Copy size={15} /> {copied ? "Copied!" : "Copy Prompt"}
                  </button>
                  <button onClick={openInClaude} className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    <ExternalLink size={15} /> Open in Claude.ai
                  </button>
                  <button onClick={addToFavorites} className="inline-flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    <Star size={15} fill="currentColor" /> Save
                  </button>
                  <button onClick={generatePrompt} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
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
                <Star size={18} className="text-yellow-400" fill="currentColor" /> Saved Prompts ({favorites.length})
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
                      <button onClick={() => copyFavorite(fav.text, index)} className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors">
                        <Copy size={13} /> {favCopied === index ? "Copied!" : "Copy"}
                      </button>
                      <button onClick={() => removeFavorite(index)} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "claude ai prompt builder with xml tags" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Claude AI Prompt Builder with XML Tags Support
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Claude AI responds differently than other models. It thrives on structured instructions, explicit role definitions, and native formatting cues. Our <strong>Claude AI prompt builder</strong> is designed specifically around these principles, allowing you to generate prompts that yield dramatically better results.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Whether you are using <strong>Claude 3.5 Sonnet</strong> for coding, <strong>Claude 3 Opus</strong> for deep analysis, or <strong>Haiku</strong> for fast tasks — this tool formats the instructions perfectly so Claude knows exactly how to think and respond.
            </p>
          </div>

          {/* ── Features Section ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "claude prompt format with thinking and output tags" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Claude Prompt Format with Thinking and Output Tags
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Native XML Tags", desc: "Automatically adds Claude's native <thinking> and <output> XML tags to separate reasoning from the final answer." },
                { title: "6 Use Cases", desc: "Assign specific roles like 'Expert Software Engineer' for coding or 'Senior Business Consultant' for strategy." },
                { title: "3 Depth Levels", desc: "Choose Detailed (structured), Comprehensive (with examples), or Expert (PhD-level frameworks)." },
                { title: "Direct Integration", desc: "One-click 'Open in Claude.ai' button sends your prompt directly to Anthropic's interface." }
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
              Claude Prompt Builder – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to write prompts for Claude 3.5 Sonnet and Opus?",
                  a: "To write effective prompts for Claude 3.5 Sonnet or Opus, clearly define a role, provide context, specify the output format (like XML tags), and state your goal. Our tool automatically structures these elements for you."
                },
                {
                  q: "What are XML tags in Claude prompts?",
                  a: "XML tags like <thinking> and <output> are Claude's native way of organizing information. Prompting Claude to use <thinking> for its reasoning process and <output> for the final answer dramatically improves accuracy on complex tasks."
                },
                {
                  q: "Can I generate Claude prompts for coding and data analysis?",
                  a: "Yes. Select the 'Coding' or 'Analysis' use case in our tool. It will automatically assign an expert software engineer or rigorous analyst role to the prompt to get the best results from Claude."
                },
                {
                  q: "Is this Claude prompt format builder free?",
                  a: "Yes, 100% free. No signup, no account, no limits. Generate unlimited custom Claude prompts with specific tones, depths, and formats."
                }
              ].map((item, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-orange-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={22} className={`text-orange-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools (Fixed) ── */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related AI Prompt Building Tools</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { to: "/tools/chatgpt-prompt-generator", title: "ChatGPT Prompt Generator", desc: "Build optimized prompts specifically tuned for OpenAI's GPT-4 and GPT-4o models." },
                { to: "/tools/midjourney-prompt-generator", title: "Midjourney Prompt Builder", desc: "Craft detailed image prompts with art styles, lighting, and camera angles." },
                { to: "/tools/youtube-script-prompt-generator", title: "YouTube Script Prompt Builder", desc: "Generate structured prompts to create video scripts, hooks, and outlines." }
              ].map((tool) => (
                <Link key={tool.to} to={tool.to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-orange-300 transition-all">
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