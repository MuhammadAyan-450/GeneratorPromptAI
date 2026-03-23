// pages/YoutubeThumbnailDownloader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download, Copy, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

const YoutubeThumbnailDownloader = () => {
  const [urlOrId, setUrlOrId] = useState("");
  const [videoId, setVideoId] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const qualities = [
    { label: "Default (120×90)", code: "default", width: 120, height: 90 },
    { label: "Medium (320×180)", code: "mqdefault", width: 320, height: 180 },
    { label: "High Quality (480×360)", code: "hqdefault", width: 480, height: 360 },
    { label: "Standard (640×480)", code: "sddefault", width: 640, height: 480 },
    { label: "Maximum (1280×720+)", code: "maxresdefault", width: 1280, height: 720 }
  ];

  const extractVideoId = (input) => {
    if (!input) return null;

    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
      return input.trim();
    }

    // YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /youtube\.com\/shorts\/([^"&?\/\s]{11})/i,
      /youtube\.com\/live\/([^"&?\/\s]{11})/i
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) return match[1];
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setCopied(false);
    setCopiedUrl(null);

    const id = extractVideoId(urlOrId.trim());
    if (!id) {
      setError("Invalid YouTube URL or Video ID. Please check and try again.");
      setVideoId("");
      return;
    }

    setVideoId(id);
  };

  const copyToClipboard = (text, type = "id") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } else {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 1800);
    }
  };

  const getThumbnailUrl = (code) => `https://img.youtube.com/vi/${videoId}/${code}.jpg`;

  const downloadThumbnail = (code, label) => {
    const link = document.createElement("a");
    link.href = getThumbnailUrl(code);
    link.download = `youtube-thumbnail-${videoId}-${label.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    link.click();
  };

  const reset = () => {
    setUrlOrId("");
    setVideoId("");
    setError("");
    setCopied(false);
    setCopiedUrl(null);
  };

  return (
    <>
      <Helmet>
        <title>YouTube Thumbnail Downloader – HD Video Thumbnails Download Online</title>
        <meta
          name="description"
          content="Download YouTube video thumbnails in all resolutions (default, mqdefault, hqdefault, sddefault, maxresdefault) instantly. Just paste URL or video ID. No signup, 100% browser-based, private & fast – built in Karachi."
        />
        <meta
          name="keywords"
          content="youtube thumbnail downloader, download youtube thumbnails hd, get youtube video thumbnail free, youtube thumbnail extractor, maxresdefault downloader 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/youtube-thumbnail-downloader" />

        <meta property="og:title" content="YouTube Thumbnail Downloader – Free HD Download 2026" />
        <meta property="og:description" content="Instantly download YouTube thumbnails in multiple qualities – no signup needed." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free YouTube Thumbnail Downloader" />
        <meta name="twitter:description" content="Get HD thumbnails from any YouTube video instantly – private & fast." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "YouTube Thumbnail Downloader",
            url: "https://generatorpromptai.com/tools/youtube-thumbnail-downloader",
            description: "Free online tool to download YouTube video thumbnails in all available resolutions.",
            applicationCategory: "UtilityApplication",
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
            YouTube Thumbnail Downloader
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Download HD thumbnails • All resolutions • No signup • Fast & private
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <form onSubmit={handleSubmit} className="mb-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL or Video ID
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={urlOrId}
                    onChange={(e) => setUrlOrId(e.target.value)}
                    placeholder="https://youtu.be/dQw4w9WgXcQ   or   dQw4w9WgXcQ"
                    className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white font-medium px-8 py-3 rounded-lg transition whitespace-nowrap shadow-sm"
                  >
                    Get Thumbnails
                  </button>
                </div>

                {error && (
                  <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </form>

              {videoId && (
                <>
                  <div className="mb-8 p-4 bg-gray-50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Video ID:</p>
                      <p className="font-mono font-medium break-all">{videoId}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => copyToClipboard(videoId, "id")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                      >
                        <Copy size={16} />
                        {copied ? "ID Copied!" : "Copy ID"}
                      </button>

                      <button
                        onClick={reset}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm font-medium"
                      >
                        <RefreshCw size={16} />
                        Reset
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-center mb-6">
                    Available Thumbnails
                  </h3>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {qualities.map((q) => (
                      <div
                        key={q.code}
                        className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition group"
                      >
                        <div className="relative">
                          <img
                            src={getThumbnailUrl(q.code)}
                            alt={`${q.label} for video ${videoId}`}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/640x360?text=Thumbnail+Not+Available";
                              e.target.alt = "Thumbnail not available";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => copyToClipboard(getThumbnailUrl(q.code), "url")}
                              className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                              <Copy size={16} />
                              {copiedUrl === getThumbnailUrl(q.code) ? "URL Copied!" : "Copy URL"}
                            </button>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="font-semibold text-center mb-3">{q.label}</h4>
                          <button
                            onClick={() => downloadThumbnail(q.code, q.label)}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!videoId && !error && (
                <div className="text-center py-16 text-gray-500 text-lg">
                  Paste a YouTube video URL or ID above to view & download thumbnails
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              YouTube Thumbnail Downloader – HD Thumbnails Download in Seconds
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Download YouTube video thumbnails in all available resolutions instantly — default (120×90), medium (320×180), high (480×360), standard (640×480), and maximum (1280×720 or higher). Just paste the video URL or 11-character video ID. No signup, no ads, no server upload — thumbnails come directly from YouTube. Perfect for content creators, marketers, bloggers, and thumbnail designers.
              </p>
              <p>
                Built in Karachi – ideal for Pakistani YouTubers, editors, social media managers, and anyone needing quick access to high-quality thumbnails for videos, presentations, articles, or redesigns. Fast, private, and 100% secure.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Download YouTube Thumbnails
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Copy any YouTube video URL (watch page, shorts, embed, share link) or just the 11-character video ID.</li>
                <li>Paste it into the input box above.</li>
                <li>Click <strong>Get Thumbnails</strong> — all available sizes load instantly.</li>
                <li>Hover over any thumbnail and click <strong>Copy URL</strong> or <strong>Download</strong>.</li>
                <li>Use <strong>Copy ID</strong> if you only need the video ID extracted.</li>
                <li>Click <strong>Reset</strong> to clear and try another video.</li>
                <li>Tip: maxresdefault gives the best quality but isn’t available on every video — fall back to hqdefault or sddefault if missing.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Video & Media Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/qr-code-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  QR Code Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create QR codes for your YouTube channel or videos.
                </p>
              </Link>

              <Link
                to="/tools/image-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert thumbnails between JPG, PNG, WebP.
                </p>
              </Link>

              <Link
                to="/tools/image-resizer"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Resizer
                </h3>
                <p className="text-gray-600 text-sm">
                  Resize thumbnails to any dimension.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default YoutubeThumbnailDownloader;