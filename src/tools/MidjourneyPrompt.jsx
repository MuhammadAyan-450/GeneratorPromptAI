// pages/MidjourneyPromptGenerator.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Star, Trash2 } from "lucide-react";

// --- Configuration Constants ---
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
    { value: "--ar 16:9", label: "16:9 (cinematic / landscape)" },
    { value: "--ar 9:16", label: "9:16 (vertical / stories)" },
    { value: "--ar 1:1", label: "1:1 (square / Instagram)" },
    { value: "--ar 2:3", label: "2:3 (portrait)" },
    { value: "--ar 4:5", label: "4:5 (mobile portrait)" },
  ],
};

const MidjourneyPromptGenerator = () => {
  // --- State ---
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

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem("favoriteMidjourneyPrompts");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favoriteMidjourneyPrompts", JSON.stringify(favorites));
    }
  }, [favorites]);

  // --- Helpers ---
  const buildPromptString = (topic, config) => {
    let parts = [];

    // 1. Base Template
    if (config.realisticArtistic === "realistic") {
      parts.push(
        `Ultra-realistic photograph of ${topic}, photorealistic, shot on Canon EOS R5, 85mm lens, shallow depth of field, cinematic color grading, 8k resolution, hyper detailed, masterpiece, best quality`
      );
    } else {
      parts.push(
        `Highly detailed digital art of ${topic}, concept art, intricate details, vibrant colors, epic composition, trending on ArtStation, masterpiece, 8k`
      );
    }

    // 2. Mood
    if (config.mood !== "neutral") {
      parts.push(`${config.mood} mood`, `${config.mood} atmosphere`);
    }

    // 3. Lighting
    if (config.lighting !== "neutral") {
      parts.push(`${config.lighting} lighting`);
      if (config.lighting === "dramatic") {
        parts.push("strong shadows and highlights");
      } else {
        parts.push(`${config.lighting} tones`);
      }
    }

    // 4. Camera Angle
    if (config.cameraAngle !== "eye level") {
      parts.push(`${config.cameraAngle} angle shot`);
    }

    // 5. Detail Level
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
      case "medium":
      default:
        parts.push("detailed", "good composition", "sharp");
        break;
    }

    // 6. Parameters
    parts.push(`${config.aspectRatio} --v 6 --stylize 750 --q 2 --chaos 15`);

    return parts.join(", ");
  };

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter an image idea or topic first");
      return;
    }

    setIsGenerating(true);
    
    // Simulate a tiny delay for better UX feeling
    setTimeout(() => {
      const config = {
        realisticArtistic,
        mood,
        lighting,
        cameraAngle,
        detailLevel,
        aspectRatio,
      };
      const newPrompt = buildPromptString(topic.trim(), config);
      setResult(newPrompt);
      setIsGenerating(false);
    }, 300);
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

  // --- Render Helpers ---
  const SelectInput = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-0 transition-shadow bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Midjourney Prompt Generator – AI Art Prompt Builder</title>
        <meta
          name="description"
          content="Generate powerful, optimized Midjourney prompts instantly – realistic, cinematic, anime, fantasy styles with mood, lighting, detail level & aspect ratio. Free, no signup, save favorites. Built in Karachi."
        />
        <meta
          name="keywords"
          content="midjourney prompt generator, midjourney prompts free, ai art prompt builder, midjourney realistic prompts, cinematic midjourney prompts, best midjourney prompts 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/midjourney-prompt-generator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Midjourney Prompt Generator – Free AI Art Prompts 2026" />
        <meta property="og:description" content="Create stunning Midjourney prompts in seconds – realistic, fantasy, cyberpunk, anime & more." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Midjourney Prompt Generator" />
        <meta name="twitter:description" content="Instant AI art prompts for Midjourney – save your favorites." />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Midjourney Prompt Generator",
            url: "https://generatorpromptai.com/tools/midjourney-prompt-generator",
            description: "Free tool to generate high-quality, optimized prompts for Midjourney AI image generation.",
            applicationCategory: "AI Tool",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors font-medium">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Midjourney Prompt Generator
            </h1>
            <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
              Create stunning AI art prompts • Realistic • Fantasy • Anime • 2026 optimized
            </p>
          </header>

          <main className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column: Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Image Idea / Subject
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. cyberpunk samurai in rainy neon city..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                  />
                  {error && <p className="mt-2 text-red-600 text-sm font-medium flex items-center gap-1">
                    <span className="text-red-500">⚠</span> {error}
                  </p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SelectInput
                    label="Realism vs Artistic"
                    value={realisticArtistic}
                    onChange={setRealisticArtistic}
                    options={OPTIONS.realism}
                  />
                  <SelectInput
                    label="Mood / Atmosphere"
                    value={mood}
                    onChange={setMood}
                    options={OPTIONS.moods}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SelectInput
                    label="Lighting"
                    value={lighting}
                    onChange={setLighting}
                    options={OPTIONS.lighting}
                  />
                  <SelectInput
                    label="Camera Angle"
                    value={cameraAngle}
                    onChange={setCameraAngle}
                    options={OPTIONS.angles}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SelectInput
                    label="Detail Level"
                    value={detailLevel}
                    onChange={setDetailLevel}
                    options={OPTIONS.details}
                  />
                  <SelectInput
                    label="Aspect Ratio"
                    value={aspectRatio}
                    onChange={setAspectRatio}
                    options={OPTIONS.ratios}
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={generatePrompt}
                    disabled={isGenerating}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <RefreshCw size={18} />
                    )}
                    {isGenerating ? "Generating..." : "Generate Prompt"}
                  </button>

                  <button
                    onClick={clearAll}
                    className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center justify-center gap-2 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Right Column: Result & Favorites */}
              <div className="space-y-6 flex flex-col">
                <h3 className="font-semibold text-lg text-gray-900">
                  Generated Midjourney Prompt
                </h3>

                <div className="flex-1 flex flex-col min-h-[300px]">
                  {result ? (
                    <div className="bg-gray-900 text-green-400 p-5 rounded-xl shadow-inner flex flex-col flex-1 border border-gray-800">
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed font-mono">
                          {result}
                        </pre>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-800">
                        <button
                          onClick={copyPrompt}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                        >
                          <Copy size={16} />
                          {copied ? "Copied to Clipboard!" : "Copy Prompt"}
                        </button>

                        <button
                          onClick={addToFavorites}
                          disabled={favorites.includes(result)}
                          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 text-sm font-medium"
                        >
                          <Star size={16} fill={favorites.includes(result) ? "currentColor" : "none"} />
                          {favorites.includes(result) ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[250px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                      <div className="bg-gray-200 p-3 rounded-full mb-3">
                        <RefreshCw size={24} className="text-gray-400" />
                      </div>
                      <p>Configure settings and hit Generate</p>
                    </div>
                  )}

                  {/* Favorites List */}
                  {favorites.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="text-yellow-500" size={18} fill="currentColor" />
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                          Saved Prompts ({favorites.length})
                        </h4>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {favorites.map((fav, i) => (
                          <div
                            key={i}
                            className="group flex justify-between items-start p-3 bg-white border border-gray-200 rounded-lg text-sm hover:border-sky-300 hover:shadow-sm transition-all cursor-default"
                          >
                            <div 
                              className="flex-1 whitespace-pre-wrap font-mono text-xs text-gray-600 pr-3 line-clamp-2"
                              title={fav}
                            >
                              {fav}
                            </div>
                            <button
                              onClick={() => removeFavorite(fav)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove from favorites"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Description Section */}
          <section className="prose prose-lg prose-sky max-w-none text-gray-600 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Midjourney Prompt Generator – AI Art & Images
            </h2>
            <p className="mb-4">
              Make strong, ready-to-use prompts for Midjourney in just a few seconds. Choose between realism and artistic style, mood, lighting, camera angle, detail level, and aspect ratio. You can get cinematic, fantasy, cyberpunk, anime, or hyper-realistic results that work best with Midjourney v6.
            </p>
            <p>
              Great for digital illustrations, concept art, NFTs, wallpapers, product mockups, and more. Made in Karachi, this service is completely free and doesn't require you to sign up. Your prompts are saved locally in your browser.
            </p>
          </section>

          {/* How to Use */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Use</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-lg">
                <li>Describe your image idea (e.g. "cyberpunk samurai girl in rainy neon Tokyo").</li>
                <li>Select style, mood, lighting, and detail preferences.</li>
                <li>Click <strong>Generate Prompt</strong>.</li>
                <li>Click <strong>Copy</strong> and paste into Midjourney Discord.</li>
                <li>Save favorites for later use.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Related AI Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "ChatGPT Generator", desc: "Create powerful text prompts for ChatGPT.", link: "/tools/chatgpt-prompt-generator" },
                { title: "Claude Generator", desc: "Optimized prompts for Claude AI models.", link: "/tools/claude-prompt-generator" },
                { title: "Image to Text", desc: "Extract text from images & photos.", link: "/tools/image-to-text" },
                { title: "QR Code Generator", desc: "Create custom QR codes instantly.", link: "/tools/qr-code-generator" },
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  to={tool.link}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-sky-400 transition-all duration-300"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-sky-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {tool.desc}
                  </p>
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