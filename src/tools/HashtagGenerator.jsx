import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Hash, Home, ChevronDown, Zap, BarChart2, Target, Clock } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { value: "instagram", label: "Instagram", maxTags: 30, tip: "Use 20-30 hashtags in first comment for best reach" },
  { value: "tiktok",    label: "TikTok",    maxTags: 10, tip: "5-10 hashtags work best on TikTok" },
  { value: "youtube",   label: "YouTube",   maxTags: 15, tip: "Use 3-5 relevant tags in description" },
  { value: "twitter",   label: "Twitter/X", maxTags: 3,  tip: "1-3 hashtags get the most engagement" },
  { value: "linkedin",  label: "LinkedIn",  maxTags: 10, tip: "3-10 professional hashtags work best" },
];

const CATEGORIES = [
  { label: "Food",           keywords: "food, foodie, karachi food, street food, recipe, cooking, iftar, biryani, desi food" },
  { label: "Travel",         keywords: "travel, wanderlust, pakistan travel, lahore, karachi, islamabad, hunza, explore" },
  { label: "Fashion",        keywords: "fashion, style, ootd, outfit, clothing, streetstyle, trending fashion, desi fashion" },
  { label: "Fitness",        keywords: "fitness, workout, gym, motivation, health, exercise, bodybuilding, fit lifestyle" },
  { label: "Tech",           keywords: "tech, programming, coding, software, AI, developer, javascript, python, startup" },
  { label: "Business",       keywords: "business, entrepreneur, startup, money, success, hustle, marketing, growth" },
  { label: "Ramadan",        keywords: "ramadan, iftar, sehri, ramadan mubarak, ramadan2026, fasting, dua, quran" },
  { label: "Eid",            keywords: "eid, eid mubarak, eid2026, celebration, eid ul fitr, eid outfit, eid vibes" },
  { label: "Photography",    keywords: "photography, photo, portrait, landscape, camera, photographer, shotoniphone" },
  { label: "Gaming",         keywords: "gaming, gamer, esports, pubg, freefire, valorant, minecraft, twitch, stream" },
];

const MODIFIERS = {
  trending: ["2026", "trending", "viral", "fyp", "explorepage", "trendingnow", "reels", "viralvideo", "instareels", "tiktokpakistan"],
  common:   ["love", "daily", "best", "pro", "tips", "life", "style", "vibes", "goals", "inspiration", "motivation", "beautiful", "happy", "fun", "instagood", "photooftheday", "follow"],
  desi:     ["dil", "pyar", "zindagi", "khushi", "desi", "pakistani", "subhanallah", "alhamdulillah", "mashallah", "dua", "sukoon", "junoon", "yaar", "maza", "swag"],
  niche:    ["official", "community", "creator", "content", "network", "hub", "world", "nation", "lovers", "addicts", "fanatics", "culture", "squad"],
};

function buildHashtags(words, language, maxLength) {
  const generated = new Set();

  words.forEach((w) => {
    generated.add(`#${w}`);
    generated.add(`#${w.charAt(0).toUpperCase()}${w.slice(1)}`);
  });

  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const a = words[i], b = words[j];
      generated.add(`#${a}${b.charAt(0).toUpperCase()}${b.slice(1)}`);
      generated.add(`#${b}${a.charAt(0).toUpperCase()}${a.slice(1)}`);
    }
  }

  const mods = language === "urdu-roman"
    ? [...MODIFIERS.trending, ...MODIFIERS.desi]
    : language === "mixed"
      ? [...MODIFIERS.trending, ...MODIFIERS.common, ...MODIFIERS.desi, ...MODIFIERS.niche]
      : [...MODIFIERS.trending, ...MODIFIERS.common, ...MODIFIERS.niche];

  mods.forEach((mod) => {
    words.forEach((word) => {
      const M = mod.charAt(0).toUpperCase() + mod.slice(1);
      const W = word.charAt(0).toUpperCase() + word.slice(1);
      generated.add(`#${word}${M}`);
      generated.add(`#${M}${W}`);
      generated.add(`#${mod}${word}`);
    });
  });

  let list = Array.from(generated).sort(() => Math.random() - 0.5);

  if (maxLength !== "all") {
    list = list.filter((tag) => {
      const len = tag.length - 1;
      if (maxLength === "short")  return len <= 12;
      if (maxLength === "medium") return len > 12 && len <= 20;
      if (maxLength === "long")   return len > 20;
      return true;
    });
  }

  return list;
}

function getTier(tag) {
  const t = tag.toLowerCase().replace("#", "");
  const isTrending = MODIFIERS.trending.some((m) => t.includes(m));
  const isCommon   = MODIFIERS.common.some((m) => t.includes(m));
  const isShort    = t.length <= 8;
  if (isTrending || isShort) return "high";
  if (isCommon) return "medium";
  return "low";
}

// ─── Component ────────────────────────────────────────────────────────────────

const HashtagGenerator = () => {
  const [keywords, setKeywords]       = useState("");
  const [excludeWords, setExcludeWords] = useState("");
  const [numHashtags, setNumHashtags] = useState(30);
  const [maxLength, setMaxLength]     = useState("all");
  const [language, setLanguage]       = useState("english");
  const [platform, setPlatform]       = useState("instagram");
  const [hashtags, setHashtags]       = useState([]);
  const [copied, setCopied]           = useState("");
  const [error, setError]             = useState("");
  const [openFaq, setOpenFaq]         = useState(null);

  const currentPlatform = PLATFORMS.find((p) => p.value === platform);

  const generateHashtags = () => {
    setError("");
    if (!keywords.trim()) { setError("Please enter some keywords or a topic."); return; }

    const exclude = excludeWords.toLowerCase().split(/[\s,]+/).filter(Boolean);
    const words = keywords.toLowerCase().split(/[\s,]+/)
      .map((w) => w.trim().replace(/[^a-z0-9]/g, ""))
      .filter((w) => w.length > 2 && !exclude.includes(w));

    if (!words.length) { setError("No valid keywords found. Try different words."); return; }

    const limit = Math.min(numHashtags, currentPlatform.maxTags * 2);
    const list = buildHashtags(words, language, maxLength).slice(0, limit);
    setHashtags(list);
  };

  const copyGroup = (group) => {
    const tags = hashtags.filter((t) => getTier(t) === group).join(" ");
    navigator.clipboard.writeText(tags);
    setCopied(group);
    setTimeout(() => setCopied(""), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    setCopied("all");
    setTimeout(() => setCopied(""), 2000);
  };

  const copySingle = (tag) => {
    navigator.clipboard.writeText(tag);
  };

  const charCount = hashtags.join(" ").length;

  const highTags = hashtags.filter((t) => getTier(t) === "high");
  const medTags  = hashtags.filter((t) => getTier(t) === "medium");
  const lowTags  = hashtags.filter((t) => getTier(t) === "low");

  const reset = () => {
    setKeywords("");
    setExcludeWords("");
    setHashtags([]);
    setError("");
    setCopied("");
    setNumHashtags(30);
    setMaxLength("all");
    setLanguage("english");
    setPlatform("instagram");
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generate Low Competition Hashtags for Instagram Reels – Free Viral Hashtag Tool",
    "url": "https://www.generatorpromptai.com/tools/hashtag-generator",
    "applicationCategory": "SocialMediaApplication",
    "operatingSystem": "All",
    "description": "Free hashtag generator for Instagram, TikTok, YouTube and Twitter/X. Generate trending and low competition hashtags sorted by tier. Pakistani and English styles. Copy all with one click.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Hashtag Generator", "item": "https://www.generatorpromptai.com/tools/hashtag-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to get more impressions on Instagram reels with hashtags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use a mix of 5 high-competition viral hashtags, 15 medium-competition relevant hashtags, and 5-10 low-competition niche hashtags. Place them in the first comment, not the caption. Our tool automatically sorts your hashtags into these three tiers."
        }
      },
      {
        "@type": "Question",
        "name": "How many hashtags for Instagram reels to go viral in 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Instagram allows up to 30 hashtags per post. The best strategy in 2026 is using 25-30 hashtags with a mix of all three competition tiers. Avoid using only viral hashtags — niche tags help the algorithm understand your content."
        }
      },
      {
        "@type": "Question",
        "name": "What are low competition hashtags and why do they matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Low competition hashtags have fewer posts but a highly targeted audience. When you use them, your post is much more likely to appear on the Explore page for that specific tag. They matter because they bring in views from people actually interested in your niche."
        }
      },
      {
        "@type": "Question",
        "name": "How to find trending hashtags for TikTok Pakistan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enter your topic keywords in our tool, select TikTok as the platform, and choose Mixed or Urdu Romanized language style. The tool will generate hashtags including Pakistani trending tags like #tiktokpakistan, #desi, and niche-specific tags for your content."
        }
      },
      {
        "@type": "Question",
        "name": "Best hashtag strategy for small Instagram accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Small accounts should focus heavily on low and medium competition hashtags. Use only 3-5 high-competition tags and fill the rest with niche-specific tags under 50k posts. This maximizes the chance of appearing in search results for your specific niche."
        }
      },
      {
        "@type": "Question",
        "name": "Can I generate Urdu or Romanized Pakistani hashtags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Select Urdu Romanized or Mixed language style to include desi modifiers like #desi, #pakistani, #subhanallah, #zindagi, #pyar, #dil and more. These work well for Pakistani audience content on Instagram and TikTok."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Generate Low Competition Hashtags for Instagram Reels – Free Viral Hashtag Tool</title>

        <meta
          name="description"
          content="Free hashtag generator for Instagram reels, TikTok, YouTube and Twitter. Get trending and low competition hashtags sorted by tier. Pakistani and English styles. Copy all with one click – no signup."
        />

        <meta
          name="keywords"
          content="how to get more impressions on instagram reels with hashtags, best hashtags for instagram reels to go viral 2026, low competition hashtags for instagram growth, instagram hashtag strategy for small accounts, free instagram hashtag generator with copy button, tiktok hashtag generator for more views, how many hashtags for instagram reels 2026, trending hashtags for tiktok pakistan, urdu hashtags for instagram reels pakistan, desi hashtags for tiktok viral videos, niche hashtags generator for small accounts, hashtag competition checker free online"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/hashtag-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate Low Competition Hashtags for Instagram Reels – Free Tool" />
        <meta property="og:description" content="Get trending and low competition hashtags sorted by tier for Instagram, TikTok, YouTube. Copy all with one click." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/hashtag-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Hashtag Generator – Low Competition Hashtags for Instagram Reels" />
        <meta name="twitter:description" content="Generate trending and niche hashtags for Instagram, TikTok, YouTube. Sorted by competition tier. Copy all instantly." />

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
              <li><span className="text-gray-900 font-semibold">Hashtag Generator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Hash className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Generate Low Competition Hashtags for Instagram Reels –{" "}
              <span className="text-sky-600">Free Viral Hashtag Tool</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Get trending and niche hashtags sorted by competition tier. Built for Instagram, TikTok, YouTube and Twitter. Copy all with one click.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Platform Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => { setPlatform(p.value); setNumHashtags(Math.min(numHashtags, p.maxTags)); }}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      platform === p.value
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {currentPlatform && (
                <p className="text-xs text-gray-400 mt-2">{currentPlatform.tip}</p>
              )}
            </div>

            {/* Category Presets */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quick Category Presets
                <span className="ml-2 text-xs font-normal text-gray-400">Click to auto-fill keywords</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setKeywords(cat.keywords)}
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keywords / Topic
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. karachi food, street eats, pakistani cuisine, iftar ideas, travel vlog, fitness motivation"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 text-sm resize-y"
              />
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Hashtags</label>
                <select
                  value={numHashtags}
                  onChange={(e) => setNumHashtags(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-800"
                >
                  {[10, 15, 20, 25, 30, 50].filter((n) => n <= currentPlatform.maxTags * 2).map((n) => (
                    <option key={n} value={n}>{n} hashtags</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Length Filter</label>
                <select
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-800"
                >
                  <option value="all">All lengths</option>
                  <option value="short">Short (12 chars or less)</option>
                  <option value="medium">Medium (13-20)</option>
                  <option value="long">Long (21+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Language Style</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-800"
                >
                  <option value="english">English</option>
                  <option value="urdu-roman">Urdu Romanized</option>
                  <option value="mixed">Mixed (English + Desi)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exclude Words</label>
                <input
                  type="text"
                  value={excludeWords}
                  onChange={(e) => setExcludeWords(e.target.value)}
                  placeholder="e.g. spam, nsfw"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 text-sm"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button
                onClick={generateHashtags}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Hash size={18} /> Generate Hashtags
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>

            {/* ── Results ── */}
            {hashtags.length > 0 && (
              <div className="mt-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Hash size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{hashtags.length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Total Tags</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Zap size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{highTags.length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">High Comp</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><BarChart2 size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{medTags.length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Medium Comp</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Target size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{lowTags.length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Low Comp</p>
                  </div>
                </div>

                {/* Copy All + Char Count */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span><strong className="text-gray-800">{charCount}</strong> / 2,200 chars
                      {charCount > 2200 && <span className="text-red-500 ml-1">(over Instagram limit)</span>}
                    </span>
                  </div>
                  <button
                    onClick={copyAll}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Copy size={14} />
                    {copied === "all" ? "Copied!" : `Copy All ${hashtags.length}`}
                  </button>
                </div>

                {/* Tiered Groups */}
                {[
                  { id: "high",   label: "High Competition (Viral Reach)",       tags: highTags, borderColor: "border-sky-200", bgColor: "bg-sky-50", badgeBg: "bg-sky-100 text-sky-700", copyBg: "bg-sky-600 hover:bg-sky-700 text-white" },
                  { id: "medium", label: "Medium Competition (Sweet Spot)",       tags: medTags,  borderColor: "border-amber-200", bgColor: "bg-amber-50", badgeBg: "bg-amber-100 text-amber-700", copyBg: "bg-amber-600 hover:bg-amber-700 text-white" },
                  { id: "low",    label: "Low Competition (Niche Reach)",         tags: lowTags,  borderColor: "border-green-200", bgColor: "bg-green-50", badgeBg: "bg-green-100 text-green-700", copyBg: "bg-green-600 hover:bg-green-700 text-white" },
                ].map(({ id, label, tags, borderColor, bgColor, badgeBg, copyBg }) => tags.length > 0 && (
                  <div key={id} className={`border rounded-2xl p-5 mb-4 ${borderColor} ${bgColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-800">{label}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${badgeBg}`}>{tags.length} tags</span>
                      </div>
                      <button
                        onClick={() => copyGroup(id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${copyBg}`}
                      >
                        <Copy size={12} />
                        {copied === id ? "Copied!" : "Copy Group"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <button
                          key={i}
                          onClick={() => copySingle(tag)}
                          className="px-3 py-1.5 bg-white border border-gray-200 hover:border-sky-400 rounded-full text-sm text-gray-700 hover:text-sky-600 transition-all hover:scale-105 active:scale-95"
                          title="Click to copy"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Character Warning */}
                {charCount > 2200 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-2">
                    <p className="text-sm text-red-600">
                      <strong>Instagram character limit exceeded.</strong> Your hashtags total {charCount} characters but Instagram caps at 2,200. Reduce the count or remove some long tags.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!hashtags.length && !error && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <Hash size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Enter keywords or pick a category preset, then click <strong className="text-gray-500">Generate Hashtags</strong></p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Hashtag Generator for Instagram Reels, TikTok & YouTube – Sorted by Competition Tier
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Most hashtag tools dump a random list of tags and leave you guessing which ones will actually get views. Our free hashtag generator is different — it automatically sorts every hashtag into <strong>high</strong>, <strong>medium</strong>, and <strong>low competition</strong> tiers so you know exactly which tags will bring viral reach and which ones will help you get discovered in your niche.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Whether you are posting Instagram reels, TikTok videos, YouTube Shorts, or Twitter threads, the strategy is the same: mix a few viral hashtags with targeted niche tags. Our tool makes this easy by giving you copy buttons for each tier separately.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Built with Pakistani creators in mind — choose <strong>Urdu Romanized</strong> or <strong>Mixed</strong> language style to get desi hashtags like <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">#desi</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">#zindagi</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">#subhanallah</code> alongside trending English tags.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Get More Impressions on Instagram Reels with Hashtags
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Select your <strong>platform</strong> (Instagram, TikTok, YouTube, Twitter, or LinkedIn).</li>
              <li>Enter your <strong>keywords</strong> or click a category preset (Food, Travel, Fitness, etc.).</li>
              <li>Choose language style — English, Urdu Romanized, or Mixed for Pakistani audiences.</li>
              <li>Click <strong>"Generate Hashtags"</strong> and get tags sorted into high, medium, and low competition tiers.</li>
              <li><strong>Copy each tier separately</strong> — use 3-5 high, 10-15 medium, and 5-10 low competition tags per post.</li>
              <li>Paste them in your first comment (not caption) for best Instagram reach.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Best Hashtag Strategy for Small Instagram Accounts – Tool Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Competition Tier Sorting", desc: "Every hashtag is classified as high, medium, or low competition so you can build a balanced mix instead of guessing. Small accounts should focus on medium and low tiers." },
                { title: "Platform-Specific Limits", desc: "Automatically adjusts the max hashtag count for each platform — 30 for Instagram, 10 for TikTok, 3 for Twitter — so you never exceed limits." },
                { title: "Pakistani & Desi Hashtags", desc: "Switch to Urdu Romanized or Mixed mode to get desi modifiers like #desi, #pakistani, #subhanallah, #pyar, #zindagi alongside trending tags." },
                { title: "One-Click Copy by Tier", desc: "Copy all hashtags at once or copy each competition tier separately. Paste directly into your first comment for the best Instagram reel strategy." }
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
              Hashtag Generator – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to get more impressions on Instagram reels with hashtags?",
                  a: "Use a mix of 5 high-competition viral hashtags, 15 medium-competition relevant hashtags, and 5-10 low-competition niche hashtags. Place them in the first comment, not the caption. Our tool automatically sorts your hashtags into these three tiers."
                },
                {
                  q: "How many hashtags for Instagram reels to go viral in 2026?",
                  a: "Instagram allows up to 30 hashtags per post. The best strategy in 2026 is using 25-30 hashtags with a mix of all three competition tiers. Avoid using only viral hashtags — niche tags help the algorithm understand your content."
                },
                {
                  q: "What are low competition hashtags and why do they matter?",
                  a: "Low competition hashtags have fewer posts but a highly targeted audience. When you use them, your post is much more likely to appear on the Explore page for that specific tag. They matter because they bring in views from people actually interested in your niche."
                },
                {
                  q: "How to find trending hashtags for TikTok Pakistan?",
                  a: "Enter your topic keywords in our tool, select TikTok as the platform, and choose Mixed or Urdu Romanized language style. The tool will generate hashtags including Pakistani trending tags like #tiktokpakistan, #desi, and niche-specific tags for your content."
                },
                {
                  q: "Best hashtag strategy for small Instagram accounts?",
                  a: "Small accounts should focus heavily on low and medium competition hashtags. Use only 3-5 high-competition tags and fill the rest with niche-specific tags. This maximizes the chance of appearing in search results for your specific niche."
                },
                {
                  q: "Can I generate Urdu or Romanized Pakistani hashtags?",
                  a: "Yes. Select Urdu Romanized or Mixed language style to include desi modifiers like #desi, #pakistani, #subhanallah, #zindagi, #pyar, #dil and more. These work well for Pakistani audience content on Instagram and TikTok."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Social Media Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/emoji-picker",                title: "Emoji Picker",                desc: "Search and copy emojis for captions, stories and posts." },
                { to: "/tools/word-counter",                title: "Word Counter",                desc: "Count characters for Instagram captions and TikTok bios." },
                { to: "/tools/midjourney-prompt-generator", title: "Midjourney Prompt Generator",  desc: "Create detailed prompts for stunning AI-generated images." }
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

export default HashtagGenerator;