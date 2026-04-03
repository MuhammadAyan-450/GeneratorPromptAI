// pages/HashtagGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Hash, Zap, TrendingUp, BarChart2 } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { value: "instagram", label: "📸 Instagram", maxTags: 30, tip: "Use 20–30 hashtags in first comment" },
  { value: "tiktok", label: "🎵 TikTok", maxTags: 10, tip: "5–10 hashtags work best on TikTok" },
  { value: "youtube", label: "▶️ YouTube", maxTags: 15, tip: "Use 3–5 relevant tags in description" },
  { value: "twitter", label: "𝕏 Twitter/X", maxTags: 3, tip: "1–3 hashtags get the most engagement" },
  { value: "linkedin", label: "💼 LinkedIn", maxTags: 10, tip: "3–10 professional hashtags work best" },
];

const CATEGORIES = [
  { label: "🍕 Food", keywords: "food, foodie, karachi food, street food, recipe, cooking, iftar, biryani, desi food" },
  { label: "✈️ Travel", keywords: "travel, wanderlust, pakistan travel, lahore, karachi, islamabad, hunza, explore" },
  { label: "👗 Fashion", keywords: "fashion, style, ootd, outfit, clothing, streetstyle, trending fashion, desi fashion" },
  { label: "💪 Fitness", keywords: "fitness, workout, gym, motivation, health, exercise, bodybuilding, fit lifestyle" },
  { label: "💻 Tech", keywords: "tech, programming, coding, software, AI, developer, javascript, python, startup" },
  { label: "💼 Business", keywords: "business, entrepreneur, startup, money, success, hustle, marketing, growth" },
  { label: "🌙 Ramadan", keywords: "ramadan, iftar, sehri, ramadan mubarak, ramadan2026, fasting, dua, quran" },
  { label: "🎉 Eid", keywords: "eid, eid mubarak, eid2026, celebration, eid ul fitr, eid outfit, eid vibes" },
  { label: "📸 Photography", keywords: "photography, photo, portrait, landscape, camera, photographer, shotoniphone" },
  { label: "🎮 Gaming", keywords: "gaming, gamer, esports, pubg, freefire, valorant, minecraft, twitch, stream" },
];

const MODIFIERS = {
  trending: ["2026", "trending", "viral", "fyp", "explorepage", "trendingnow", "reels", "viralvideo", "instareels", "tiktokpakistan"],
  common: ["love", "daily", "best", "pro", "tips", "life", "style", "vibes", "goals", "inspiration", "motivation", "beautiful", "happy", "fun", "instagood", "photooftheday", "follow"],
  desi: ["dil", "pyar", "zindagi", "khushi", "desi", "pakistani", "subhanallah", "alhamdulillah", "mashallah", "dua", "sukoon", "junoon", "yaar", "maza", "swag"],
  niche: ["official", "community", "creator", "content", "network", "hub", "world", "nation", "lovers", "addicts", "fanatics", "culture", "squad"],
};

function buildHashtags(words, language, maxLength) {
  const generated = new Set();

  // Single word tags
  words.forEach((w) => {
    generated.add(`#${w}`);
    generated.add(`#${w.charAt(0).toUpperCase()}${w.slice(1)}`);
  });

  // Two-word combos (camelCase)
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const a = words[i], b = words[j];
      generated.add(`#${a}${b.charAt(0).toUpperCase()}${b.slice(1)}`);
      generated.add(`#${b}${a.charAt(0).toUpperCase()}${a.slice(1)}`);
    }
  }

  // Modifier combos
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
      if (maxLength === "short") return len <= 12;
      if (maxLength === "medium") return len > 12 && len <= 20;
      if (maxLength === "long") return len > 20;
      return true;
    });
  }

  return list;
}

function getTier(tag) {
  const t = tag.toLowerCase().replace("#", "");
  const isTrending = MODIFIERS.trending.some((m) => t.includes(m));
  const isCommon = MODIFIERS.common.some((m) => t.includes(m));
  const isShort = t.length <= 8;
  if (isTrending || isShort) return "high";
  if (isCommon) return "medium";
  return "low";
}

// ─── Component ────────────────────────────────────────────────────────────────

const HashtagGenerator = () => {
  const [keywords, setKeywords] = useState("");
  const [excludeWords, setExcludeWords] = useState("");
  const [numHashtags, setNumHashtags] = useState(30);
  const [maxLength, setMaxLength] = useState("all");
  const [language, setLanguage] = useState("english");
  const [platform, setPlatform] = useState("instagram");
  const [hashtags, setHashtags] = useState([]);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

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
    showToast(`${group.charAt(0).toUpperCase() + group.slice(1)} hashtags copied!`);
    setTimeout(() => setCopied(""), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(" "));
    setCopied("all");
    showToast(`All ${hashtags.length} hashtags copied!`);
    setTimeout(() => setCopied(""), 2000);
  };

  const copySingle = (tag) => {
    navigator.clipboard.writeText(tag);
    showToast(`${tag} copied!`);
  };

  const charCount = hashtags.join(" ").length;

  const highTags = hashtags.filter((t) => getTier(t) === "high");
  const medTags = hashtags.filter((t) => getTier(t) === "medium");
  const lowTags = hashtags.filter((t) => getTier(t) === "low");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hashtag Generator",
    url: "https://generatorpromptai.com/tools/hashtag-generator",
    applicationCategory: "SocialMediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free hashtag generator for Instagram, TikTok, YouTube, Twitter/X and LinkedIn. Generate trending viral hashtags with Pakistani and English modifiers.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many hashtags should I use on Instagram?",
        acceptedAnswer: { "@type": "Answer", text: "Instagram allows up to 30 hashtags per post. Using 20–30 relevant hashtags in your first comment (not the caption) is the current best practice for maximum reach." },
      },
      {
        "@type": "Question",
        name: "How many hashtags work best on TikTok?",
        acceptedAnswer: { "@type": "Answer", text: "5–10 hashtags work best on TikTok. Always include #fyp and 2–3 niche-specific hashtags relevant to your content." },
      },
      {
        "@type": "Question",
        name: "Is this hashtag generator free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. No sign-up, no account, no payment required." },
      },
      {
        "@type": "Question",
        name: "What does high, medium, low competition mean?",
        acceptedAnswer: { "@type": "Answer", text: "High competition hashtags (#trending, #fyp) have millions of posts — hard to rank but huge reach. Medium competition hashtags are easier to rank for. Low competition (niche) hashtags have smaller audiences but your post is more likely to be discovered." },
      },
      {
        "@type": "Question",
        name: "Can I generate Urdu or desi hashtags?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Select 'Urdu Romanized' or 'Mixed' language style to include desi modifiers like #desi, #pakistani, #subhanallah, #zindagi and more in your generated hashtags." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Hashtag Generator - Free Trending Hashtags for Instagram, TikTok & YouTube 2026</title>
        <meta
          name="description"
          content="Free hashtag generator for Instagram, TikTok, YouTube Shorts and Twitter/X. Generate trending viral hashtags with Pakistani and English styles. Filter by platform, competition tier and length. No sign-up."
        />
        <meta
          name="keywords"
          content="hashtag generator, instagram hashtag generator, tiktok hashtag generator, trending hashtags 2026, viral hashtags, free hashtag tool, reels hashtags, youtube hashtags, pakistan hashtags"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/hashtag-generator" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Free Hashtag Generator - Trending Hashtags for Instagram & TikTok" />
        <meta property="og:description" content="Generate trending hashtags for Instagram, TikTok, YouTube and Twitter. Pakistani and English styles. Free, no sign-up." />
        <meta property="og:url" content="https://generatorpromptai.com/tools/hashtag-generator" />
        <meta property="og:image" content="https://generatorpromptai.com/og-hashtag-generator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Hashtag Generator - Instagram, TikTok, YouTube 2026" />
        <meta name="twitter:description" content="Generate trending viral hashtags for any platform. Pakistani and English styles. Free online tool." />
        <meta name="twitter:image" content="https://generatorpromptai.com/og-hashtag-generator.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-100 mb-4">
              <Hash className="text-pink-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Hashtag Generator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Generate trending hashtags for Instagram, TikTok, YouTube and Twitter. Pakistani &amp; English styles.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Platform Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => { setPlatform(p.value); setNumHashtags(Math.min(numHashtags, p.maxTags)); }}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${platform === p.value
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {currentPlatform && (
                <p className="text-xs text-gray-400 mt-2">💡 {currentPlatform.tip}</p>
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
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent min-h-[100px] resize-y text-gray-800"
              />
              {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </div>

            {/* Options Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Hashtags</label>
                <select
                  value={numHashtags}
                  onChange={(e) => setNumHashtags(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800"
                >
                  <option value="all">All lengths</option>
                  <option value="short">Short (≤12 chars)</option>
                  <option value="medium">Medium (13–20)</option>
                  <option value="long">Long (21+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Language Style</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={generateHashtags}
                className="flex-1 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Hash size={18} /> Generate Hashtags
              </button>
              <button
                onClick={() => { setKeywords(""); setExcludeWords(""); setHashtags([]); setError(""); }}
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>

            {/* Results */}
            {hashtags.length > 0 && (
              <div>
                {/* Stats Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span><strong className="text-gray-800">{hashtags.length}</strong> hashtags</span>
                    <span><strong className={charCount > 2200 ? "text-red-500" : "text-gray-800"}>{charCount}</strong> / 2,200 chars
                      {charCount > 2200 && <span className="text-red-500 ml-1">(Instagram limit!)</span>}
                    </span>
                  </div>
                  <button
                    onClick={copyAll}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Copy size={14} />
                    {copied === "all" ? "Copied!" : `Copy All ${hashtags.length}`}
                  </button>
                </div>

                {/* Tiered Groups */}
                {[
                  { id: "high", label: "🔥 High Competition (Viral Reach)", tags: highTags, color: "border-pink-200 bg-pink-50", badge: "bg-pink-100 text-pink-700", copyColor: "bg-pink-500 hover:bg-pink-600 text-white" },
                  { id: "medium", label: "📈 Medium Competition (Sweet Spot)", tags: medTags, color: "border-sky-200 bg-sky-50", badge: "bg-sky-100 text-sky-700", copyColor: "bg-sky-500 hover:bg-sky-600 text-white" },
                  { id: "low", label: "🎯 Low Competition (Niche Reach)", tags: lowTags, color: "border-gray-200 bg-gray-50", badge: "bg-gray-100 text-gray-700", copyColor: "bg-gray-600 hover:bg-gray-700 text-white" },
                ].map(({ id, label, tags, color, badge, copyColor }) => tags.length > 0 && (
                  <div key={id} className={`border rounded-2xl p-5 mb-4 ${color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-800">{label}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>{tags.length} tags</span>
                      </div>
                      <button
                        onClick={() => copyGroup(id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${copyColor}`}
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
                          className="px-3 py-1.5 bg-white border border-gray-200 hover:border-pink-400 rounded-full text-sm text-gray-700 hover:text-pink-600 transition-all hover:scale-105 active:scale-95"
                          title="Click to copy"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!hashtags.length && !error && (
              <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <Hash size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Enter keywords or pick a category preset above, then click Generate</p>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Hashtag Generator — Trending Hashtags for Instagram, TikTok &amp; More
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free hashtag generator creates platform-specific hashtags for Instagram, TikTok, YouTube Shorts, Twitter/X, and LinkedIn. Enter your keywords, pick your platform, and get dozens of relevant hashtags instantly — sorted into high, medium, and low competition tiers so you know exactly how to use them.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Perfect for Pakistani creators with dedicated category presets for Ramadan, Eid, Pakistani food, Karachi/Lahore travel, and desi content. Switch to <strong>Mixed</strong> or <strong>Urdu Romanized</strong> language style to include desi hashtags like #desi, #pakistani, #subhanallah, and #zindagi in your set.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Understanding hashtag competition tiers</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li><strong>High competition</strong> (#trending, #fyp, #viral) — Millions of posts. Huge reach but hard to rank. Use 3–5 of these.</li>
              <li><strong>Medium competition</strong> — Balanced. Easier to appear in search. Use 10–15 of these as your core set.</li>
              <li><strong>Low competition (niche)</strong> — Small audience but your post is highly discoverable. Use 5–10 niche tags per post.</li>
            </ul>
            <p className="text-gray-600 text-sm">The best strategy is to mix all three tiers in every post for maximum reach and discoverability.</p>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How many hashtags should I use on Instagram?", a: "Instagram allows up to 30 hashtags per post. Using 20–30 relevant hashtags in your first comment is the current best practice. Our generator is capped at 30 when Instagram is selected." },
                { q: "How many hashtags work best on TikTok?", a: "5–10 hashtags work best on TikTok. Always include #fyp and 2–3 niche-specific hashtags. Our tool limits TikTok suggestions accordingly." },
                { q: "What does high, medium, low competition mean?", a: "High competition hashtags have millions of posts — great reach but hard to rank in. Low competition (niche) hashtags have smaller audiences but your post is much more discoverable. A mix of all three tiers works best." },
                { q: "Can I generate Urdu or desi hashtags?", a: "Yes. Select 'Urdu Romanized' or 'Mixed' language style to include desi modifiers like #desi, #pakistani, #subhanallah, #zindagi and more in your set." },
                { q: "Is this hashtag generator free?", a: "Yes, completely free. No sign-up, no account, no payment required. Generate as many hashtag sets as you need." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Social Media Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/emoji-picker", title: "Emoji Picker", desc: "Search and copy emojis for captions, stories and posts." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count characters for Instagram captions and TikTok bios." },
                { to: "/tools/midjourney-prompt-generator", title: "Midjourney Prompt Generator", desc: "Create detailed prompts for stunning AI-generated images." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-pink-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-pink-500 transition-colors">{tool.title}</h3>
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