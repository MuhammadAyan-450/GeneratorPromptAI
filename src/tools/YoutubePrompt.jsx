// pages/YoutubePromptGenerator.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Star, Trash2, Video, Lightbulb, PenTool } from "lucide-react";

// High-quality, structured YouTube prompt templates (2025–2026 viral style)
const youtubeTemplates = [
  "Write a high-retention YouTube video script about {topic}. Start with a shocking/curiosity hook in first 5–8 seconds, use storytelling + pattern interrupts every 30–60s, include 5–8 clear value sections, b-roll & visual suggestions, end with very strong benefit-driven CTA (subscribe, like, comment, bell, share). Optimize for 10–18 min watch time.",
  "Create complete YouTube video including: click-worthy title (70 chars), attention-grabbing hook script, detailed outline (timestamps), full spoken script with natural language, b-roll/visual ideas, end-screen & cards suggestions for {topic}. Target 12–20 min length.",
  "Generate 10 high-CTR YouTube video ideas + titles + thumbnail concepts + 3-line hook scripts about {topic}. Focus on curiosity, emotion, controversy, transformation, secrets, lists, challenges — formats proven to go viral in 2025–2026.",
  "Write a fast-paced, vertical YouTube Shorts script (under 60 seconds) about {topic} — extremely strong 3-second hook, quick value delivery, text overlays suggestions, trending sound recommendation, powerful CTA in last 5 seconds.",
  "Create emotional storytelling YouTube script about {topic} — personal anecdote intro, problem-agitation-solution structure, cinematic descriptions, music & pacing cues, deep emotional connection, strong motivational CTA.",
  "Write step-by-step tutorial / how-to YouTube script for {topic} — beginner-friendly, clear timestamps every 30–60s, screen recording & voice-over instructions, pro tips & common mistakes section, final recap & CTA.",
  "Make entertaining reaction/commentary-style script reacting to {topic} — funny commentary, memes & jokes, genuine reactions, trending clips suggestions, community engagement questions, strong subscribe push.",
  "Generate top 10 / listicle video script about {topic} — suspenseful countdown format, surprising facts, visual countdown graphics, smooth transitions, cliffhanger between items, powerful outro CTA.",
  "Write brutally honest product review / comparison script for {topic} — pros/cons table, real usage footage ideas, alternatives comparison, personal verdict, affiliate disclaimer, strong buying CTA.",
  "Create vlog / day-in-the-life script featuring {topic} — casual talking-head style, natural storytelling, behind-the-scenes feel, daily routine integration, emotional/relatable moments, soft CTA.",
  "Write cinematic documentary-style narration script about {topic} — deep voice-over, historical context, expert quote style, b-roll & stock footage suggestions, dramatic music cues, thought-provoking ending.",
  "Generate high-energy challenge / experiment video script testing {topic} — clear rules, before/after footage plan, funny fails & wins, time-lapse ideas, shocking results reveal, viral share CTA.",
  "Create Q&A / myth-busting script answering top 10 viewer questions about {topic} — fast cuts, text overlays for questions, honest answers, myth vs fact graphics, community shoutout, strong subscribe CTA.",
  "Write motivational / self-improvement script about {topic} — emotional story arc, mindset shifts, actionable steps, inspiring quotes, cinematic visuals, very powerful life-changing CTA.",
  "Generate seasonal/trending video script connecting {topic} to current events/holidays/trends — timely hook, relevance explanation, viral angle, shareable moments, urgent CTA."
];

const YoutubePromptGenerator = () => {
  const [topic, setTopic] = useState("");
  const [videoType, setVideoType] = useState("random");
  const [lengthFormat, setLengthFormat] = useState("medium");
  const [tone, setTone] = useState("energetic");
  const [ctaStrength, setCtaStrength] = useState("strong");
  const [includeTitlesThumbs, setIncludeTitlesThumbs] = useState(false);
  const [result, setResult] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favoriteYoutubePrompts");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favoriteYoutubePrompts", JSON.stringify(favorites));
    }
  }, [favorites]);

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter a video topic first");
      return;
    }

    let templatePool = youtubeTemplates;

    if (videoType !== "random") {
      templatePool = youtubeTemplates.filter(t => t.toLowerCase().includes(videoType.toLowerCase()));
      if (templatePool.length === 0) templatePool = youtubeTemplates;
    }

    const chosenTemplate = templatePool[Math.floor(Math.random() * templatePool.length)];

    let prompt = chosenTemplate.replaceAll("{topic}", topic.trim());

    // Length / format injection
    if (lengthFormat === "shorts") {
      prompt += " Format strictly as vertical YouTube Shorts (under 60 seconds), extremely fast-paced, strong 3-second hook, big text overlays, trending sound suggestion.";
    } else if (lengthFormat === "short") {
      prompt += " Target 4–8 minute length — punchy, high-energy, minimal fluff.";
    } else if (lengthFormat === "medium") {
      prompt += " Aim for 10–18 minute sweet spot — perfect pacing, chapters/timestamps, high retention structure.";
    } else if (lengthFormat === "long") {
      prompt += " Write detailed long-form 18–30 minute script — deep dive, storytelling, multiple examples, chapters.";
    }

    // Tone injection
    if (tone !== "energetic") {
      prompt += ` Use ${tone} tone throughout — make it feel ${tone === "casual" ? "like talking to a friend" : tone === "professional" ? "polished and authoritative" : tone === "storytelling" ? "deeply emotional and cinematic" : "funny and entertaining with jokes"}.`;
    }

    // CTA strength
    if (ctaStrength === "soft") {
      prompt += " End with gentle, natural call-to-action.";
    } else if (ctaStrength === "strong") {
      prompt += " Finish with strong, benefit-focused CTA — ask to like, subscribe, comment specific question, turn on notifications.";
    } else if (ctaStrength === "very-strong") {
      prompt += " End with extremely powerful, urgent, emotion-driven CTA — push hard for subscribe, bell, comment, share, join community.";
    }

    // Titles & thumbnails
    if (includeTitlesThumbs) {
      prompt += " Also generate: 8 high-CTR title variations (curiosity, number, how-to, emotional), 5 thumbnail concepts (text overlay ideas, color scheme, emotion/face), and 3 hook lines for first 5 seconds.";
    }

    setResult(prompt);
  };

  const copyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const addToFavorites = () => {
    if (!result || favorites.includes(result)) return;
    setFavorites([...favorites, result]);
  };

  const removeFavorite = (promptToRemove) => {
    setFavorites(favorites.filter(p => p !== promptToRemove));
  };

  const clearAll = () => {
    setTopic("");
    setResult("");
    setError("");
    setCopied(false);
  };

  return (
    <>
      <Helmet>
        <title>Viral YouTube Script Generator – Viral Video Ideas & Scripts</title>
        <meta
          name="description"
          content="Generate powerful YouTube video scripts, titles, hooks & thumbnail ideas instantly. Choose format (Shorts, long-form), tone, CTA strength. Perfect for Pakistani & global creators. Free, no signup, browser-based – built in Karachi."
        />
        <meta
          name="keywords"
          content="youtube script generator, youtube video prompt, viral youtube ideas, youtube titles generator, youtube shorts script, free youtube tool 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/youtube-prompt-generator" />

        <meta property="og:title" content="YouTube Script & Prompt Generator – Viral Content 2026" />
        <meta property="og:description" content="Create high-retention scripts, titles & ideas for YouTube long-form & Shorts." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free YouTube Script Generator" />
        <meta name="twitter:description" content="Viral scripts, titles, hooks & Shorts prompts – instant & free." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "YouTube Prompt Generator",
            url: "https://generatorpromptai.com/tools/youtube-prompt-generator",
            description: "Free tool to generate YouTube video scripts, titles, hooks and ideas for viral content.",
            applicationCategory: "ContentCreation",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            YouTube Script & Prompt Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Viral scripts • titles • hooks • Shorts & long-form • 2026 style
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left – Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Video Topic / Keyword
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. how to earn money online in Pakistan 2026, best biryani in Karachi, React 19 new features..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    {topic.trim().length > 0 && topic.trim().length < 8 && (
                      <p className="mt-2 text-amber-600 text-sm">
                        Tip: Use 8+ words for more specific & viral results
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Video Format
                      </label>
                      <select
                        value={videoType}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="random">Random / Mix</option>
                        <option value="explainer">Explainer / Educational</option>
                        <option value="tutorial">Tutorial / How-to</option>
                        <option value="story">Storytelling / Vlog</option>
                        <option value="list">Top 10 / Listicle</option>
                        <option value="review">Review / Comparison</option>
                        <option value="shorts">YouTube Shorts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Target Length
                      </label>
                      <select
                        value={lengthFormat}
                        onChange={(e) => setLengthFormat(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="shorts">Shorts (60s)</option>
                        <option value="short">Short (4–8 min)</option>
                        <option value="medium">Medium (10–18 min)</option>
                        <option value="long">Long-form (18–30+ min)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tone / Style
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="energetic">Energetic & Viral</option>
                        <option value="casual">Casual / Gen-Z</option>
                        <option value="professional">Professional / Authority</option>
                        <option value="storytelling">Emotional Storytelling</option>
                        <option value="funny">Funny / Entertaining</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        CTA Strength
                      </label>
                      <select
                        value={ctaStrength}
                        onChange={(e) => setCtaStrength(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="soft">Soft / Natural</option>
                        <option value="strong">Strong</option>
                        <option value="very-strong">Very Strong / Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeTitlesThumbs}
                      onChange={(e) => setIncludeTitlesThumbs(e.target.checked)}
                      className="h-5 w-5 text-sky-600 rounded"
                    />
                    <label className="text-gray-700 cursor-pointer">
                      Also generate viral titles + thumbnail ideas
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={generatePrompt}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <RefreshCw size={20} />
                      Generate YouTube Prompt
                    </button>

                    <button
                      onClick={clearAll}
                      className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Clear
                    </button>
                  </div>

                  {error && <p className="text-red-600 text-center font-medium mt-4">{error}</p>}
                </div>

                {/* Right – Result & Favorites */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Generated YouTube Prompt
                  </h3>

                  {result ? (
                    <div className="bg-gray-50 p-5 rounded-xl border min-h-[340px] flex flex-col">
                      <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed flex-1 max-h-96 overflow-y-auto">
                        {result}
                      </pre>

                      <div className="flex flex-wrap gap-3 mt-6">
                        <button
                          onClick={copyPrompt}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Copy size={18} />
                          {copied ? "Copied!" : "Copy Prompt"}
                        </button>

                        <button
                          onClick={addToFavorites}
                          className="px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition flex items-center gap-2"
                        >
                          <Star size={18} fill={favorites.includes(result) ? "currentColor" : "none"} />
                          {favorites.includes(result) ? "Favorited" : "Favorite"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border text-gray-500 text-center px-6">
                      Enter topic & settings → click Generate to create viral YouTube prompt
                    </div>
                  )}

                  {favorites.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="text-yellow-500" size={20} fill="currentColor" />
                        Saved Prompts ({favorites.length})
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {favorites.map((fav, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-start p-3 bg-gray-50 rounded-lg text-sm border border-gray-200 group"
                          >
                            <pre className="flex-1 whitespace-pre-wrap font-sans text-xs leading-relaxed pr-3">
                              {fav.substring(0, 120)}...
                            </pre>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => navigator.clipboard.writeText(fav)}
                                className="text-sky-600 hover:text-sky-800"
                                title="Copy this prompt"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => removeFavorite(fav)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove from favorites"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
             Viral YouTube Prompt Generator – Viral Scripts, Titles & Ideas
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Generate high-retention YouTube video scripts, titles, hooks, thumbnail ideas, and full outlines instantly. Choose format (Shorts, tutorial, vlog, list, review…), length, tone, and CTA strength — get optimized, viral-ready content prompts for ChatGPT/Claude/Gemini. Perfect for Pakistani & global creators, vloggers, educators, reviewers, and Shorts makers.
              </p>
              <p>
                Built in Karachi – 100% free, no signup, prompts saved locally. Ideal for faster scripting, better watch time, higher CTR, and explosive channel growth in 2026.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the YouTube Prompt Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Enter your video topic/keyword (specific = better results).</li>
                <li>Choose video format (Shorts, tutorial, storytelling, list…).</li>
                <li>Select target length (Shorts 60s, short 4–8 min, medium 10–18 min, long-form 18+ min).</li>
                <li>Pick tone (energetic, casual, professional, funny…).</li>
                <li>Choose CTA strength (how hard to push for likes/subscribes/comments).</li>
                <li>Optional: turn on titles + thumbnail ideas for extra viral boost.</li>
                <li>Click <strong>Generate YouTube Prompt</strong> — ready-to-use prompt appears.</li>
                <li>Copy & paste into ChatGPT/Claude/Gemini to get full script.</li>
                <li>Save great prompts with star icon (stored in browser).</li>
                <li>Tip: For maximum virality use "Storytelling" tone + "Medium/Long" length + "Very Strong CTA".</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Content Creation Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/midjourney-prompt-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Midjourney Prompt Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create stunning thumbnails & video visuals.
                </p>
              </Link>

              <Link
                to="/tools/word-counter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Word Counter
                </h3>
                <p className="text-gray-600 text-sm">
                  Count script length & reading time.
                </p>
              </Link>

              <Link
                to="/tools/chatgpt-prompt-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  ChatGPT Prompt Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate better scripts from these prompts.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default YoutubePromptGenerator;