// pages/MidjourneyPromptGenerator.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Star, Trash2 } from "lucide-react";

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

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem("favoriteMidjourneyPrompts");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favoriteMidjourneyPrompts", JSON.stringify(favorites));
    }
  }, [favorites]);

  const generatePrompt = () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter an image idea or topic first");
      return;
    }

    let base = "";

    if (realisticArtistic === "realistic") {
      base = "Ultra-realistic photograph of {topic}, photorealistic, shot on Canon EOS R5, 85mm lens, shallow depth of field, cinematic color grading, 8k resolution, hyper detailed, masterpiece, best quality";
    } else {
      base = "Highly detailed digital art of {topic}, concept art, intricate details, vibrant colors, epic composition, trending on ArtStation, masterpiece, 8k";
    }

    let prompt = base.replace("{topic}", topic.trim());

    // Mood
    if (mood !== "neutral") prompt += `, ${mood} mood, ${mood} atmosphere`;

    // Lighting
    if (lighting !== "neutral") prompt += `, ${lighting} lighting, ${lighting === "dramatic" ? "strong shadows and highlights" : lighting + " tones"}`;

    // Camera angle
    if (cameraAngle !== "eye level") prompt += `, ${cameraAngle} angle shot`;

    // Detail level
    if (detailLevel === "ultra") {
      prompt += ", ultra detailed, extremely intricate, razor sharp focus, 8k resolution, cinematic lighting, professional photography quality";
    } else if (detailLevel === "high") {
      prompt += ", highly detailed, sharp focus, 4k quality, professional rendering";
    } else if (detailLevel === "medium") {
      prompt += ", detailed, good composition, sharp";
    }

    // Aspect ratio & Midjourney params
    prompt += ` ${aspectRatio} --v 6 --stylize 750 --q 2 --chaos 15`;

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

        <meta property="og:title" content="Midjourney Prompt Generator – Free AI Art Prompts 2026" />
        <meta property="og:description" content="Create stunning Midjourney prompts in seconds – realistic, fantasy, cyberpunk, anime & more." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Midjourney Prompt Generator" />
        <meta name="twitter:description" content="Instant AI art prompts for Midjourney – save your favorites." />

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

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Midjourney Prompt Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Create stunning AI art prompts • Realistic • Fantasy • Anime • 2026 optimized
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left – Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Image Idea / Subject
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. cyberpunk samurai in rainy neon city, floating crystal castle at sunset, vintage astronaut on Mars..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  {error && <p className="mt-2 text-red-600 text-sm font-medium">{error}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Realism vs Artistic
                    </label>
                    <select
                      value={realisticArtistic}
                      onChange={(e) => setRealisticArtistic(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="realistic">Realistic / Photorealistic</option>
                      <option value="artistic">Artistic / Illustrated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mood / Atmosphere
                    </label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="dramatic">Dramatic / Epic</option>
                      <option value="peaceful">Peaceful / Serene</option>
                      <option value="dark">Dark / Moody</option>
                      <option value="vibrant">Vibrant / Colorful</option>
                      <option value="mysterious">Mysterious / Ethereal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Lighting
                    </label>
                    <select
                      value={lighting}
                      onChange={(e) => setLighting(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="dramatic">Dramatic</option>
                      <option value="golden hour">Golden Hour</option>
                      <option value="neon">Neon / Cyber</option>
                      <option value="soft">Soft / Diffused</option>
                      <option value="backlit">Backlit / Silhouette</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Camera Angle
                    </label>
                    <select
                      value={cameraAngle}
                      onChange={(e) => setCameraAngle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="eye level">Eye Level</option>
                      <option value="low angle">Low Angle (heroic)</option>
                      <option value="high angle">High Angle (vulnerable)</option>
                      <option value="aerial">Aerial / Drone</option>
                      <option value="close-up">Close-up / Macro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Detail Level
                    </label>
                    <select
                      value={detailLevel}
                      onChange={(e) => setDetailLevel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="medium">Medium Detail</option>
                      <option value="high">High Detail</option>
                      <option value="ultra">Ultra Detailed / Cinematic</option>
                      <option value="masterpiece">Masterpiece / 8k</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="--ar 3:2">3:2 (classic photo)</option>
                      <option value="--ar 16:9">16:9 (cinematic / landscape)</option>
                      <option value="--ar 9:16">9:16 (vertical / stories)</option>
                      <option value="--ar 1:1">1:1 (square / Instagram)</option>
                      <option value="--ar 2:3">2:3 (portrait)</option>
                      <option value="--ar 4:5">4:5 (mobile portrait)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={generatePrompt}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <RefreshCw size={18} />
                    Generate Midjourney Prompt
                  </button>

                  <button
                    onClick={clearAll}
                    className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Clear
                  </button>
                </div>
              </div>

              {/* Right – Result & Favorites */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg text-gray-900">
                  Generated Midjourney Prompt
                </h3>

                {result ? (
                  <div className="bg-gray-50 p-5 rounded-xl border min-h-[300px] flex flex-col">
                    <pre className="whitespace-pre-wrap font-mono text-base leading-relaxed flex-1 max-h-96 overflow-y-auto">
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
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border text-gray-500">
                    Your optimized Midjourney prompt will appear here
                  </div>
                )}

                {/* Favorites */}
                {favorites.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="text-yellow-500" size={20} fill="currentColor" />
                      Saved Prompts
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {favorites.map((fav, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start p-3 bg-gray-50 rounded-lg text-sm border border-gray-200"
                        >
                          <pre className="flex-1 whitespace-pre-wrap font-mono text-xs leading-relaxed pr-3">
                            {fav.substring(0, 120)}...
                          </pre>
                          <button
                            onClick={() => removeFavorite(fav)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove from favorites"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Midjourney Prompt Generator – AI Art & Images
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Make strong, ready-to-use prompts for Midjourney in just a few seconds. Choose between realism and artistic style, mood, lighting, camera angle, detail level, and aspect ratio. You can get cinematic, fantasy, cyberpunk, anime, or hyper-realistic results that work best with Midjourney v6. Great for digital illustrations, concept art, NFTs, wallpapers, product mockups, and more.              </p>
              <p>
                Made in Karachi, this service is completely free and doesn't require you to sign up. Your prompts are saved in your browser. Great for Pakistani AI artists, designers, content creators, marketers, and anyone else who is interested in generative AI art.              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Midjourney Prompt Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Describe your image idea/subject (e.g. "cyberpunk samurai girl in rainy neon Tokyo", "floating crystal castle at golden hour").</li>
                <li>Select realism vs artistic style, mood, lighting, camera angle, detail level & aspect ratio.</li>
                <li>Click <strong>Generate Midjourney Prompt</strong> — optimized prompt appears.</li>
                <li>Click <strong>Copy Prompt</strong> and paste into Midjourney Discord (/imagine prompt: [your prompt]).</li>
                <li>Save favorite prompts with the star icon (stored locally in browser).</li>
                <li>Use <strong>Clear</strong> to start a new idea.</li>
                <li>Tip: Experiment with --stylize 250–1000, --chaos 0–100, --q 2 for quality. Already included best defaults.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related AI & Image Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/chatgpt-prompt-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  ChatGPT Prompt Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create powerful text prompts for ChatGPT.
                </p>
              </Link>

              <Link
                to="/tools/claude-prompt-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Claude Prompt Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Optimized prompts for Claude AI models.
                </p>
              </Link>

              <Link
                to="/tools/image-to-text"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image to Text (OCR)
                </h3>
                <p className="text-gray-600 text-sm">
                  Extract text from images & photos.
                </p>
              </Link>

              <Link
                to="/tools/qr-code-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  QR Code Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create custom QR codes instantly.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MidjourneyPromptGenerator;