import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download, RefreshCw, Video, AlertCircle, Loader2, Music } from "lucide-react";

const API_URL = "https://www.tikwm.com/api/";

const TikTokVideoDownloader = () => {
  const [url,                 setUrl]                 = useState("");
  const [loading,             setLoading]             = useState(false);
  const [videoData,           setVideoData]           = useState(null);
  const [error,               setError]               = useState("");
  const [noWatermarkLoading,  setNoWatermarkLoading]  = useState(false);
  const [toast,               setToast]               = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const isValidTikTokUrl = (link) =>
    /^(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)\/.+$/i.test(link);

  const fetchVideo = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Please paste a TikTok video link."); return; }
    if (!isValidTikTokUrl(trimmed)) {
      setError("Please enter a valid TikTok URL (e.g., https://www.tiktok.com/@user/video/...)");
      return;
    }

    setLoading(true); setError(""); setVideoData(null);

    try {
      const res  = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    `url=${encodeURIComponent(trimmed)}&hd=1`,
      });
      const data = await res.json();

      if (data.code === 0 && data.data) {
        setVideoData(data.data);
      } else {
        setError(data.msg || "Could not fetch video. The link may be private or expired.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (downloadUrl, label = "") => {
    if (!downloadUrl) return;
    if (label === "nowm") setNoWatermarkLoading(true);
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
    showToast(label === "audio" ? "Opening audio track..." : "Opening video for download...");
    setTimeout(() => setNoWatermarkLoading(false), 1500);
  };

  const reset = () => {
    setUrl(""); setVideoData(null); setError("");
    setLoading(false); setNoWatermarkLoading(false);
  };

  const formatDuration = (sec) => {
    if (!sec) return "0:00";
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TikTok Video Downloader",
    url: "https://www.generatorpromptai.com/tools/tiktok-video-downloader",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free TikTok video downloader. Save TikTok videos without watermark in HD quality. No login required. Works on iPhone, Android, PC and Mac.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
    featureList: "Download without watermark, HD quality, MP3 audio extraction, Mobile friendly",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How to download TikTok videos without watermark?",
        acceptedAnswer: { "@type": "Answer", text: "Open TikTok, tap Share on the video, then tap Copy Link. Paste the link into our tool above and click Download. Then click the 'No Watermark (HD)' button to save the clean video without the TikTok logo." },
      },
      {
        "@type": "Question",
        name: "Is this TikTok downloader free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free with no hidden fees, no sign-up, and no limits on how many videos you can download." },
      },
      {
        "@type": "Question",
        name: "Can I download TikTok videos on iPhone?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our tool works on iPhone Safari. After clicking the download button, the video opens in a new tab. Long-press the video and tap 'Download to Files' or 'Save to Camera Roll' (requires Files or Photos app access)." },
      },
      {
        "@type": "Question",
        name: "Can I download TikTok audio as MP3?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. After fetching a video, the audio track appears below the video with an MP3 download button. Click it to save the audio separately." },
      },
      {
        "@type": "Question",
        name: "Is it legal to download TikTok videos?",
        acceptedAnswer: { "@type": "Answer", text: "Downloading for personal offline viewing is generally accepted. Re-uploading someone else's content without permission may violate copyright laws and TikTok's Terms of Service. Always respect creators' rights." },
      },
      {
        "@type": "Question",
        name: "Do you store the videos I download?",
        acceptedAnswer: { "@type": "Answer", text: "No. We do not host, store, or cache any videos. Downloads happen directly from the content delivery network to your device." },
      },
    ],
  };

  // ADDED: Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.generatorpromptai.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Tools",
        item: "https://www.generatorpromptai.com/pages/all-tools"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "TikTok Video Downloader"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>TikTok Video Downloader - Download TikTok Without Watermark HD | Free</title>
        <meta
          name="description"
          content="Free TikTok video downloader — save TikTok videos without watermark in HD quality instantly. No login, no app install. Also download TikTok audio as MP3. Works on iPhone, Android, PC and Mac."
        />
        <meta
          name="keywords"
          content="tiktok video downloader, download tiktok without watermark, tiktok saver, save tiktok hd, tiktok to mp4, tiktok mp3 downloader, download tiktok video online free 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/tiktok-video-downloader" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="TikTok Video Downloader - No Watermark HD | Free" />
        <meta property="og:description" content="Download TikTok videos without watermark in HD. Also extract MP3 audio. Free, no login, works on all devices." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/tiktok-video-downloader" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-tiktok-downloader.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TikTok Video Downloader - No Watermark HD" />
        <meta name="twitter:description" content="Save TikTok videos without watermark in HD. Download MP3 audio too. Free online tool." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-tiktok-downloader.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script> {/* Added Breadcrumb */}
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 mb-4">
              <Video className="text-white" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              TikTok Video Downloader
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Save TikTok videos without watermark in HD quality. Also download audio as MP3. Free, no login required.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-6">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paste TikTok Video Link
            </label>

            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchVideo()}
                placeholder="https://www.tiktok.com/@username/video/1234567890"
                className="flex-1 px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-800"
              />
              <button
                onClick={fetchVideo}
                disabled={loading}
                className="bg-gray-900 hover:bg-gray-800 active:scale-95 transition-all text-white font-semibold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Fetching...</> : "Get Video"}
              </button>
            </div>

            {/* How to copy link tip */}
            <p className="text-xs text-gray-400 mt-2">
              💡 On TikTok app: tap <strong>Share</strong> → <strong>Copy Link</strong>, then paste here
            </p>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-4 bg-red-50 border border-red-200 p-3.5 rounded-xl">
                <AlertCircle size={15} className="flex-shrink-0" /> {error}
              </div>
            )}

            {/* Result */}
            {videoData && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <div className="flex flex-col md:flex-row gap-6 mb-6">

                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-40 mx-auto md:mx-0">
                    <div className="aspect-[9/16] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={videoData.cover || videoData.origin_cover}
                        alt={`TikTok video by @${videoData.author?.unique_id || "user"}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Details + Download */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">@{videoData.author?.unique_id || "user"}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {formatDuration(videoData.duration)}
                        </span>
                      </div>
                      {videoData.title && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">{videoData.title}</p>
                      )}
                      {/* Stats */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>❤️ {(videoData.statistics?.digg_count || 0).toLocaleString()}</span>
                        <span>💬 {(videoData.statistics?.comment_count || 0).toLocaleString()}</span>
                        <span>🔁 {(videoData.statistics?.share_count || 0).toLocaleString()}</span>
                        <span>▶️ {(videoData.statistics?.play_count || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {videoData.play && (
                        <button
                          onClick={() => handleDownload(videoData.play, "nowm")}
                          disabled={noWatermarkLoading}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-semibold px-5 py-3.5 rounded-xl transition-all disabled:opacity-60"
                        >
                          {noWatermarkLoading ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />}
                          No Watermark (HD)
                        </button>
                      )}
                      {videoData.origin_cover && (
                        <button
                          onClick={() => handleDownload(videoData.wmplay || videoData.origin_cover)}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-700 font-semibold px-5 py-3.5 rounded-xl transition-all"
                        >
                          <Download size={17} /> With Watermark
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audio Track */}
                {videoData.music && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music size={18} className="text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{videoData.music?.title || "Original Audio"}</p>
                        <p className="text-xs text-gray-400">Audio Track · MP3</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(videoData.music, "audio")}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition-colors whitespace-nowrap"
                    >
                      <Download size={14} /> Download MP3
                    </button>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <RefreshCw size={14} /> Download Another Video
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free TikTok Video Downloader — No Watermark, HD Quality
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free TikTok video downloader lets you save any TikTok video in HD quality without the watermark, directly in your browser — no app install, no login, no fees. Works on iPhone, Android, Windows, and Mac.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Whether you want to save your own TikTok videos as a backup, keep a tutorial for offline viewing, extract audio as an MP3, or share a clip on another platform — our tool fetches the original server file to give you the highest quality possible.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How to download TikTok videos without watermark</h3>
            <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1.5 mb-4">
              <li>Open TikTok on your phone or browser and find the video you want to download.</li>
              <li>Tap the <strong>Share</strong> button (arrow icon) on the right side of the video.</li>
              <li>Tap <strong>Copy Link</strong> to copy the video URL to your clipboard.</li>
              <li>Paste the link into the input box above and click <strong>Get Video</strong>.</li>
              <li>Click <strong>No Watermark (HD)</strong> to download the clean, high-quality video.</li>
              <li>Optionally, click <strong>Download MP3</strong> to save just the audio track.</li>
            </ol>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why use our TikTok downloader?</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>100% free — no hidden fees, no premium tiers, no daily limits</li>
              <li>No account or sign-up required</li>
              <li>Downloads highest available HD quality without watermark</li>
              <li>Extract TikTok audio as MP3 with one click</li>
              <li>Shows video stats: likes, comments, shares, and views</li>
              <li>Works on iPhone (Safari), Android (Chrome), PC and Mac</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How do I download TikTok videos without the watermark?", a: "Open TikTok, tap Share → Copy Link on any video. Paste the link into our tool and click Get Video. Then click 'No Watermark (HD)' to save the clean version without the TikTok logo." },
                { q: "Is this TikTok downloader completely free?", a: "Yes, 100% free. No sign-up, no hidden fees, no daily download limits." },
                { q: "How do I download TikTok videos on iPhone?", a: "Paste the TikTok link and click Get Video, then No Watermark (HD). The video opens in a new tab in Safari. Long-press the video and tap 'Download to Files' or 'Save to Camera Roll'." },
                { q: "Can I download TikTok audio as MP3?", a: "Yes. After fetching the video, an audio track section appears below the video. Click 'Download MP3' to save just the audio." },
                { q: "Is it legal to download TikTok videos?", a: "Downloading for personal offline viewing is generally accepted. Re-uploading someone else's content without permission may violate copyright laws and TikTok's Terms of Service. Always respect creators' rights." },
                { q: "Do you store or keep the videos?", a: "No. We do not host, store, or cache any videos. The download link goes directly from TikTok's CDN to your device." },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Free Online Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/youtube-thumbnail-downloader", title: "YouTube Thumbnail Downloader", desc: "Download HD thumbnails from any YouTube video instantly." },
                { to: "/tools/image-compressor",             title: "Image Compressor",             desc: "Compress images before sharing on social media." },
                { to: "/tools/hashtag-generator",            title: "Hashtag Generator",            desc: "Generate trending TikTok and Instagram hashtags." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-gray-900 transition-colors">{tool.title}</h3>
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

export default TikTokVideoDownloader;