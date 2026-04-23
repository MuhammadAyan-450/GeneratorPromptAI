import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Star, Trash2, Home, ChevronDown, Hash, Type, Code, Layers, Settings } from "lucide-react";

// ─── Configuration Constants ──────────────────────────────────────────────────────
const OPTIONS = {
  realism: [
    { value: "realistic", label: "Realistic / Photorealistic" },
    { value: "artistic", label: "Artistic / Illustrated" },
  ],
  moods: [
    { value: "neutral", label: "Neutral" },
    { value: "dramatic", label: "Dramatic / Epic" },
    { value: "peaceful", label: "Peaceful / Serene" },
    { value: "dark", label: "Dark / Moody" },
    { value: "vibrant", label: "Vibrant / Colorful" },
    { value: "mysterious", label: "Mysterious / Ethereal" },
  ],
  lighting: [
    { value: "neutral", label: "Neutral" },
    { value: "dramatic", label: "Dramatic" },
    { value: "golden hour", label: "Golden Hour" },
    { value: "neon", label: "Neon / Cyber" },
    { value: "soft", label: "Soft / Diffused" },
    { value: "backlit", label: "Backlit / Silhouette" },
  ],
  angles: [
    { value: "eye level", label: "Eye Level" },
    { value: "low angle", label: "Low Angle (heroic)" },
    { value: "high angle", label: "High Angle (vulnerable)" },
    { value: "aerial", label: "Aerial / Drone" },
    { value: "close-up", label: "Close-up / Macro" },
  ],
  details: [
    { value: "medium", label: "Medium Detail" },
    { value: "high", label: "High Detail" },
    { value: "ultra", label: "Ultra Detailed / Cinematic" },
    { value: "masterpiece", label: "Masterpiece / 8k" },
  ],
  ratios: [
    { value: "--ar 3:2", label: "3:2 (classic photo)" },
    { value: "--ar 16:9", label: "16:9 (cinematic)" },
    { value: "--ar 9:16", label: "9:16 (vertical)" },
    { value: "--ar 1:1", label: "1:1 (square)" },
    { value: "--ar 2:3", label: "2:3 (portrait)" },
    { value: "--ar 4:5", label: "4:5 (mobile portrait)" },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────
const MidjourneyPromptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [mood, setMood] = useState("dramatic");
  const [detailLevel, setDetailLevel] = useState("ultra");
  const [realisticArtistic, setRealisticArtistic] = useState("realistic");
  const [lighting, setLighting] = useState("dramatic");
  const [cameraAngle, setCameraAngle] = useState("eye level");
  const [aspectRatio, setAspectRatio] = useState("--ar 3:2");
  const [result, setResult] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteMidjourneyPrompts");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favoriteMidjourneyPrompts", JSON.stringify(favorites));
    }
  }, [favorites]);

  const buildPrompt = (topicStr, config) => {
    const parts = [];

    if (config.realisticArtistic === "realistic") {
      parts.push(
        `Ultra-realistic photograph of ${topicStr}, photorealistic, shot on Canon EOS R5, 85mm lens, shallow depth of field, cinematic color grading, 8k resolution, hyper detailed, masterpiece, best quality`
      );
    } else {
      parts.push(
        `Highly detailed digital art of ${topicStr}, concept art, intricate details, vibrant colors, epic composition, trending on ArtStation, masterpiece, 8k`
      );
    }

    if (config.mood !== "neutral") {
      parts.push(`${config.mood} mood`, `${config.mood} atmosphere`);
    }

    if (config.lighting !== "neutral") {
      parts.push(`${config.lighting} lighting`);
      if (config.lighting === "dramatic") parts.push("strong shadows and highlights");
      else parts.push(`${config.lighting} tones`);
    }

    if (config.cameraAngle !== "eye level") {
      parts.push(`${config.cameraAngle} angle shot`);
    }

    switch (config.detailLevel) {
      case "ultra":
        parts.push("ultra detailed", "extremely intricate", "razor sharp focus", "8k resolution", "cinematic lighting", "professional photography quality");
        break;
      case "high":
        parts.push("highly detailed", "sharp focus", "4k quality", "professional rendering");
        break;
      case "masterpiece":
        parts.push("masterpiece", "best quality", "ultra-detailed", "8k", "HDR");
        break;
      default:
        parts.push("detailed", "good composition", "sharp");
        break;
    }

    parts.push(`${config.aspectRatio} --v 6 --stylize 750 --q 2 --chaos 15`);

    return parts.join(", ");
  };

  const getActiveParams = () => {
    let count = 0;
    if (mood !== "neutral") count++;
    if (lighting !== "neutral") count++;
    if (cameraAngle !== "eye level") count++;
    if (detailLevel !== "medium") count++;
    return count;
  };

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter an image idea or topic first.");
      setResult("");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setResult(buildPrompt(topic.trim(), { realisticArtistic, mood, lighting, cameraAngle, detailLevel, aspectRatio }));
      setIsGenerating(false);
    }, 300);
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
    setFavorites((prev) => prev.filter((p) => p !== promptToRemove));
  };

  const clearAll = () => {
    setTopic("");
    setResult("");
    setError("");
    setCopied(false);
  };

  const wordCount = result.trim() ? result.trim().split(/\s+/).length : 0;
  const charCount = result.length;

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generate Realistic Midjourney Prompts for Cinematic Photos – Free AI Art Prompt Builder",
    "url": "https://www.generatorpromptai.com/tools/midjourney-prompt-generator",
    "applicationCategory": "AIApplication",
    "operatingSystem": "All",
    "description": "Free Midjourney prompt generator with mood, lighting, camera angle, detail level and aspect ratio controls. Create realistic, cinematic, fantasy and artistic AI art prompts instantly.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Midjourney Prompt Generator", "item": "https://www.generatorpromptai.com/tools/midjourney-prompt-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to write a good Midjourney prompt for realistic photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Describe your subject clearly, select Realistic mode, choose Dramatic or Golden Hour lighting, set detail to Ultra or Masterpiece, and pick a cinematic aspect ratio like 16:9. Our prompt builder combines all these automatically into an optimized prompt string."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best detail level for Midjourney v6?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For Midjourney v6, Ultra Detailed or Masterpiece detail level produces the best results. These settings add keywords like '8k resolution', 'razor sharp focus', and 'HDR' that help the AI render maximum detail and quality."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save and organize my Midjourney prompts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our tool saves your favorite prompts in your browser's local storage. You can save as many as you want and remove them anytime. No account or signup required."
        }
      },
      {
        "@type": "Question",
        "name": "What aspect ratio should I use for Midjourney?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use 16:9 for cinematic landscapes, 3:2 for classic photos, 1:1 for Instagram posts, 9:16 for vertical stories, and 2:3 or 4:5 for portrait images. Our tool adds the --ar parameter automatically."
        }
      },
      {
        "@type": "Question",
        "name": "What lighting works best for cinematic Midjourney images?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dramatic lighting with strong shadows and highlights creates the most cinematic look. Golden Hour lighting gives warm, natural-looking results. Backlit creates striking silhouettes. Soft or Neutral lighting works best for product photos and portraits."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Generate Realistic Midjourney Prompts for Cinematic Photos – Free AI Art Prompt Builder</title>

        <meta
          name="description"
          content="Free Midjourney prompt generator with mood, lighting, camera angle, detail level and aspect ratio controls. Create realistic, cinematic, fantasy and artistic AI art prompts instantly. Save favorites. No signup required."
        />

        <meta
          name="keywords"
          content="how to write good midjourney prompt for realistic photos, best detail level for midjourney v6 free, generate cinematic midjourney prompts with lighting and mood, midjourney prompt generator with aspect ratio free, create midjourney prompts for fantasy art free online, best lighting settings for cinematic midjourney images, free midjourney prompt builder no sign up, midjourney prompt generator with save favorites feature, ai art prompt generator for beginners free"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/midjourney-prompt-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate Realistic Midjourney Prompts – Free AI Art Prompt Builder" />
        <meta property="og:description" content="Create cinematic, realistic, fantasy Midjourney prompts with mood, lighting, angle & detail controls. Save favorites." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/midjourney-prompt-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Midjourney Prompt Generator – Cinematic, Realistic, Fantasy" />
        <meta name="twitter:description" content="Build optimized Midjourney prompts with lighting, mood & detail controls. Save favorites." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb ── */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-6">
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
              <li><span className="text-gray-900 font-semibold">Midjourney Prompt Generator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Settings className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Generate Realistic Midjourney Prompts for Cinematic Photos –{" "}
              <span className="text-sky-600">Free AI Art Prompt Builder</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Create optimized prompts with mood, lighting, camera angle, detail level and aspect ratio. Save your favorites for later.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* 2-Col Grid: Controls + Output */}
            <div className="grid lg:grid-cols-2 gap-8">

              {/* Left: Controls */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image Idea / Subject</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. cyberpunk samurai in rainy neon city at night..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 text-sm resize-y"
                  />
                  {error && (
                    <p className="mt-2 text-red-500 text-sm">{error}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Style</label>
                    <select
                      value={realisticArtistic}
                      onChange={(e) => setRealisticArtistic(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800 text-sm"
                    >
                      {OPTIONS.realism.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mood</label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800 text-sm"
                    >
                      {OPTIONS.moods.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lighting</label>
                    <select
                      value={lighting}
                      onChange={(e) => setLighting(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800 text-sm"
                    >
                      {OPTIONS.lighting.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Camera Angle</label>
                    <select
                      value={cameraAngle}
                      onChange={(e) => setCameraAngle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800 text-sm"
                    >
                      {OPTIONS.angles.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Detail Level</label>
                    <select
                      value={detailLevel}
                      onChange={(e) => setDetailLevel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800 text-sm"
                    >
                      {OPTIONS.details.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800 text-sm"
                    >
                      {OPTIONS.ratios.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-2">
                  <button
                    onClick={generatePrompt}
                    disabled={isGenerating}
                    className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Settings size={18} />}
                    {isGenerating ? "Generating..." : "Generate Prompt"}
                  </button>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <RefreshCw size={15} /> Reset
                  </button>
                </div>
              </div>

              {/* Right: Output + Favorites */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Generated Prompt</span>

                {result ? (
                  <>
                    <div className="bg-gray-900 rounded-2xl p-5 mb-4 flex-1 overflow-x-auto">
                      <pre className="text-sm font-mono leading-relaxed text-green-400 whitespace-pre-wrap">{result}</pre>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={copyPrompt}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        <Copy size={14} />
                        {copied ? "Copied!" : "Copy Prompt"}
                      </button>
                      <button
                        onClick={addToFavorites}
                        disabled={favorites.includes(result)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors disabled:opacity-40"
                      >
                        <Star size={14} fill={favorites.includes(result) ? "currentColor" : "none"} className="text-yellow-500" />
                        {favorites.includes(result) ? "Saved" : "Save"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 min-h-[280px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Settings size={32} className="mb-3 text-gray-300" />
                    <p className="text-sm">Describe your image idea and click Generate</p>
                  </div>
                )}

                {/* Favorites */}
                {favorites.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Star size={16} className="text-yellow-500" fill="currentColor" />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Saved Prompts ({favorites.length})</span>
                    </div>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {favorites.map((fav, i) => (
                        <div key={i} className="group flex justify-between items-start gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm hover:border-sky-200 transition-colors">
                          <p className="flex-1 whitespace-pre-wrap font-mono text-xs text-gray-600 pr-3 line-clamp-2" title={fav}>{fav}</p>
                          <button
                            onClick={() => removeFavorite(fav)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            {result && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Type size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{wordCount}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Words</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Hash size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{charCount}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Characters</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Layers size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{getActiveParams()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Parameters</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Code size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{aspectRatio.replace("--ar ", "")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Ratio</p>
                </div>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Midjourney Prompt Builder with Lighting, Mood & Camera Angle Controls
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Writing effective Midjourney prompts is all about combining the right descriptors. Our free prompt generator lets you control every important variable — <strong>realism vs artistic style</strong>, <strong>mood and atmosphere</strong>, <strong>lighting direction</strong>, <strong>camera angle</strong>, <strong>detail level</strong>, and <strong>aspect ratio</strong>. The tool automatically combines your selections into an optimized prompt string ready to paste into Discord.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Each parameter is based on what actually works best in Midjourney v6. For example, <strong>Dramatic lighting</strong> with a <strong>Low Angle</strong> creates epic, cinematic results. <strong>Golden Hour lighting</strong> gives warm, natural-looking photos. <strong>Masterpiece detail</strong> adds keywords like "8k" and "HDR" that push quality to the maximum.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Write a Good Midjourney Prompt for Realistic Photos
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Describe your subject clearly — be specific (e.g., "cyberpunk samurai in rainy neon city at night").</li>
              <li>Select <strong>Realistic</strong> mode and a <strong>mood</strong> that matches your vision.</li>
              <li>Choose <strong>lighting</strong> — Dramatic for cinematic, Golden Hour for natural warmth.</li>
              <li>Pick a <strong>camera angle</strong> — Low Angle for epic, Close-up for detail.</li>
              <li>Set detail to <strong>Ultra Detailed</strong> or <strong>Masterpiece</strong> for best quality.</li>
              <li>Click <strong>"Generate Prompt"</strong>, then <strong>copy</strong> and paste into Midjourney Discord.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Best Lighting Settings for Cinematic Midjourney Images – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "6 Lighting Presets", desc: "Choose from Dramatic, Golden Hour, Neon, Soft, Backlit, or Neutral lighting. Each preset adds the right keywords to match that lighting style in Midjourney." },
                { title: "Cinematic Camera Angles", desc: "Low Angle for epic hero shots, High Angle for vulnerability, Aerial for sweeping landscapes, and Close-up for detailed subjects." },
                { title: "Realistic vs Artistic Mode", desc: "Realistic mode uses photography terminology (Canon EOS R5, 85mm lens). Artistic mode uses concept art keywords (ArtStation, vibrant colors, 8k)." },
                { title: "Save Favorite Prompts", desc: "Save your best prompts to your browser's local storage for quick reuse later. Remove any you no longer need with one click." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Accordion ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Midjourney Prompt Generator – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to write a good Midjourney prompt for realistic photos?",
                  a: "Describe your subject clearly, select Realistic mode, choose Dramatic or Golden Hour lighting, set detail to Ultra or Masterpiece, and pick a cinematic aspect ratio like 16:9. Our prompt builder combines all these automatically into an optimized prompt string."
                },
                {
                  q: "What is the best detail level for Midjourney v6?",
                  a: "For Midjourney v6, Ultra Detailed or Masterpiece detail level produces the best results. These settings add keywords like '8k resolution', 'razor sharp focus', and 'HDR' that help the AI render maximum detail and quality."
                },
                {
                  q: "Can I save and organize my Midjourney prompts?",
                  a: "Yes. Our tool saves your favorite prompts in your browser's local storage. You can save as many as you want and remove them anytime. No account or signup required."
                },
                {
                  q: "What aspect ratio should I use for Midjourney?",
                  a: "Use 16:9 for cinematic landscapes, 3:2 for classic photos, 1:1 for Instagram posts, 9:16 for vertical stories, and 2:3 or 4:5 for portrait images. Our tool adds the --ar parameter automatically."
                },
                {
                  q: "What lighting works best for cinematic Midjourney images?",
                  a: "Dramatic lighting with strong shadows and highlights creates the most cinematic look. Golden Hour lighting gives warm, natural-looking results. Backlit creates striking silhouettes. Soft or Neutral lighting works best for product photos and portraits."
                }
              ].map((item, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={22} className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related AI Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/chatgpt-prompt-generator", title: "ChatGPT Prompt Generator", desc: "Create powerful text prompts for ChatGPT and Claude AI models." },
                { to: "/tools/claude-prompt-generator", title: "Claude Prompt Generator", desc: "Optimized prompts specifically for Claude AI models." },
                { to: "/tools/image-to-text", title: "Image to Text", desc: "Extract text from images and screenshots using OCR." }
              ].map((tool) => (
                <Link key={tool.to} to={tool.to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">{tool.title}</h3>
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

export default MidjourneyPromptGenerator;