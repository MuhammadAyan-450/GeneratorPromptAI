// pages/HashtagGenerator.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Hash, X } from "lucide-react";

const HashtagGenerator = () => {
  const [keywords, setKeywords] = useState("");
  const [excludeWords, setExcludeWords] = useState("");
  const [numHashtags, setNumHashtags] = useState(30);
  const [maxLength, setMaxLength] = useState("all"); // all, short, medium, long
  const [language, setLanguage] = useState("english"); // english, urdu-roman, mixed
  const [hashtags, setHashtags] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // 2025–2026 trending / seasonal / viral modifiers
  const trendingModifiers = [
    "2025", "2026", "trending", "viral", "fyp", "reels", "explorepage", "trendingnow",
    "viralvideo", "instareels", "tiktokpakistan", "pakistanitrends", "ramadan2025",
    "eid2025", "iftar", "seher", "pakistanistreetfood", "karachifood", "lahorefoodie"
  ];

  const commonModifiers = [
    "official", "love", "daily", "best", "pro", "tips", "life", "style", "vibes", "goals",
    "inspiration", "motivation", "beautiful", "happy", "fun", "travel", "foodie", "fashion",
    "photography", "instagood", "photooftheday", "follow", "like", "share", "comment"
  ];

  const urduRomanModifiers = [
    "dil", "pyar", "zindagi", "khushi", "dost", "yaar", "maza", "swag", "desi", "pakistani",
    "subhanallah", "alhamdulillah", "mashallah", "inshallah", "dua", "sukoon", "junoon"
  ];

  const generateHashtags = () => {
    if (!keywords.trim()) {
      setError("Please enter some keywords or topic");
      setHashtags([]);
      return;
    }

    setError("");

    const exclude = excludeWords
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(w => w.trim());

    const words = keywords
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(w => w.trim().length > 2 && !exclude.includes(w))
      .map(w => w.trim());

    if (words.length === 0) {
      setError("No valid keywords after filtering");
      return;
    }

    const generated = new Set();

    // 1. Core / single-word hashtags (capitalized & lowercase)
    words.forEach(word => {
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      generated.add(`#${capitalized}`);
      generated.add(`#${word}`);
    });

    // 2. Two-word combinations (camelCase style)
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j < words.length; j++) {
        const w1 = words[i];
        const w2 = words[j];
        generated.add(`#${w1}${w2.charAt(0).toUpperCase() + w2.slice(1)}`);
        generated.add(`#${w2}${w1.charAt(0).toUpperCase() + w1.slice(1)}`);
      }
    }

    // 3. Add trending + common modifiers
    const modifiers =
      language === "urdu-roman"
        ? [...trendingModifiers, ...urduRomanModifiers]
        : language === "mixed"
          ? [...trendingModifiers, ...commonModifiers, ...urduRomanModifiers]
          : [...trendingModifiers, ...commonModifiers];

    modifiers.forEach(mod => {
      words.forEach(word => {
        if (generated.size < numHashtags * 3) {
          const capitalizedMod = mod.charAt(0).toUpperCase() + mod.slice(1);
          const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

          generated.add(`#${word}${capitalizedMod}`);
          generated.add(`#${capitalizedMod}${capitalizedWord}`);
          generated.add(`#${mod}${word}`);
          generated.add(`#${word}${mod}`);
        }
      });
    });

    // 4. Shuffle & filter by length
    let finalList = Array.from(generated).sort(() => Math.random() - 0.5);

    if (maxLength !== "all") {
      finalList = finalList.filter(tag => {
        const len = tag.length - 1; // without #
        if (maxLength === "short") return len <= 12;
        if (maxLength === "medium") return len > 12 && len <= 20;
        if (maxLength === "long") return len > 20;
        return true;
      });
    }

    // 5. Limit to requested number
    setHashtags(finalList.slice(0, numHashtags));
  };

  const copyAll = () => {
    if (hashtags.length === 0) return;
    navigator.clipboard.writeText(hashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const copySingle = (tag) => {
    navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const reset = () => {
    setKeywords("");
    setExcludeWords("");
    setHashtags([]);
    setError("");
    setCopied(false);
  };

  // Simple heuristic popularity color
  const getPopularityColor = (tag) => {
    const t = tag.toLowerCase();
    if (trendingModifiers.some(m => t.includes(m))) return "text-pink-600 bg-pink-50";
    if (t.length < 10 || t.includes("love") || t.includes("best")) return "text-sky-600 bg-sky-50";
    return "text-gray-700 bg-gray-50";
  };

  return (
    <>
      <Helmet>
        <title>Hashtag Generator – Trending Hashtag Generator | GeneratorPromptAI</title>
        <meta
          name="description"
          content="Generate trending & viral hashtags for Instagram, TikTok, YouTube Shorts & X in 2025–2026. Ramadan, food, travel, fashion & more. Free and fast, no signup."
        />
        <meta
          name="keywords"
          content="hashtag generator, instagram hashtags generator, tiktok hashtags generator, reels hashtags generator, trending hashtags generator, free hashtags generator, viral hashtags generator, free hashtag tool"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/hashtag-generator" />

        <meta property="og:title" content="Hashtag Generator – Trending Hashtags 2026" />
        <meta property="og:description" content="Create perfect hashtags for Instagram Reels, TikTok & more – Pakistani trends included." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Hashtag Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Trending & viral hashtags generator for Instagram • TikTok • Reels • Youtube (2026)
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            {/* Main input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords / Topic
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. karachi food, street eats, pakistani cuisine, iftar ideas, travel vlog, fitness motivation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[110px] resize-y font-medium"
              />
              {error && <p className="mt-2 text-red-600 text-sm font-medium">{error}</p>}
            </div>

            {/* Advanced options */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Number of Hashtags
                </label>
                <select
                  value={numHashtags}
                  onChange={(e) => setNumHashtags(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={35}>35</option>
                  <option value={50}>50</option>
                  <option value={70}>70</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Max Length
                </label>
                <select
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">All lengths</option>
                  <option value="short">Short (≤12 chars)</option>
                  <option value="medium">Medium (13–20)</option>
                  <option value="long">Long (21+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Language Style
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="english">English</option>
                  <option value="urdu-roman">Urdu Romanized</option>
                  <option value="mixed">Mixed (English + Desi)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Exclude words
                </label>
                <input
                  type="text"
                  value={excludeWords}
                  onChange={(e) => setExcludeWords(e.target.value)}
                  placeholder="e.g. nsfw, spam, old"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={generateHashtags}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Hash size={20} />
                Generate Hashtags
              </button>

              <button
                onClick={reset}
                className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Reset
              </button>
            </div>

            {/* Results */}
            {hashtags.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Generated Hashtags ({hashtags.length})
                  </h3>
                  <button
                    onClick={copyAll}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition font-medium"
                  >
                    <Copy size={18} />
                    {copied ? "Copied!" : "Copy All"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {hashtags.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => copySingle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition hover:scale-105 active:scale-95 border ${getPopularityColor(
                        tag
                      )}`}
                      title="Click to copy single hashtag"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hashtags.length === 0 && !error && (
              <div className="text-center py-16 text-gray-500 text-lg">
                Enter keywords and generate trending hashtags
              </div>
            )}
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              High-Performing Hashtags for Social Media
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                Want to make your social media posts stand out? We've got you covered with high-performing hashtags for Instagram Reels, TikTok FYP, YouTube Shorts, and X posts. Our team is all about keeping up with Pakistani trends and creating content for Ramadan and Eid.

                We also focus on hashtags that capture the desi vibe and use viral modifiers to make your posts go viral. Plus, we make sure to exclude unwanted tags and filter by length. And, we mix English and Roman Urdu hashtags to reach a wider audience.

                Our goal is to help you create engaging content that resonates with your audience. With our expertise in creating high-performing hashtags, you can increase your visibility and reach a larger audience.

                Ready to take your social media game to the next level? Let's get started on creating high-performing hashtags for your Instagram Reels, TikTok FYP, YouTube Shorts, and X posts.

                Benefits of Using High-Performing Hashtags
                Using high-performing hashtags for your social media posts offers several benefits:

                Increased visibility: High-performing hashtags help your content reach a wider audience, increasing your chances of being seen and engaged with.
                Improved discoverability: By using relevant and popular hashtags, you make it easier for users to find your content when they search for topics related to your posts.
                Enhanced engagement: High-performing hashtags attract more likes, comments, and shares, boosting your engagement rates and helping you build a loyal following.
                Brand recognition: Consistently using high-performing hashtags associated with your brand helps establish your identity and increases brand recognition.
                By incorporating high-performing hashtags into your social media strategy, you can maximize your reach, engagement, and overall impact on your audience.              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use
            </h2>
            <div className="bg-white border rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>Enter your topic / keywords (comma or space separated)</li>
                <li>(Optional) Add words to exclude (e.g. old, spam)</li>
                <li>Choose number, length preference and language style</li>
                <li>Click <strong>Generate Hashtags</strong></li>
                <li>Click any tag to copy single • Click "Copy All" for full list</li>
                <li>Use trending ones first for maximum reach</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Social Media Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/tools/emoji-picker" className="group border rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">Emoji Picker</h3>
                <p className="text-gray-600 text-sm">Search & copy emojis for captions & stories</p>
              </Link>

              <Link to="/tools/word-counter" className="group border rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">Word Counter</h3>
                <p className="text-gray-600 text-sm">Count characters for Instagram captions & TikTok</p>
              </Link>

              <Link to="/tools/json-formatter" className="group border rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">JSON Formatter</h3>
                <p className="text-gray-600 text-sm">Useful when working with social media APIs</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HashtagGenerator;