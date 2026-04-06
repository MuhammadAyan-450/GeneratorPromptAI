// pages/TikTokVideoDownloader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download, RefreshCw, Video, AlertCircle, Loader2 } from "lucide-react";

const API_URL = "https://www.tikwm.com/api/";

const TikTokVideoDownloader = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState("");
  const [noWatermarkLoading, setNoWatermarkLoading] = useState(false);

  const isValidTikTokUrl = (link) => {
    const regex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com)\/.+$/i;
    return regex.test(link);
  };

  const fetchVideo = async () => {
    if (!url.trim()) {
      setError("Please paste a TikTok video link");
      return;
    }

    if (!isValidTikTokUrl(url.trim())) {
      setError("Please enter a valid TikTok URL (e.g., https://www.tiktok.com/...)");
      return;
    }

    setLoading(true);
    setError("");
    setVideoData(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `url=${encodeURIComponent(url.trim())}&hd=1`,
      });

      const data = await response.json();

      if (data.code === 0 && data.data) {
        setVideoData(data.data);
      } else {
        setError(data.msg || "Failed to fetch video. Please check the link and try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl, isNoWatermark = false) => {
    if (isNoWatermark) setNoWatermarkLoading(true);

    try {
      // For browsers that block cross-origin downloads directly, 
      // we open in a new tab. Tikwm handles the download via their CDN.
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      if (isNoWatermark) setNoWatermarkLoading(false);
    }
  };

  const reset = () => {
    setUrl("");
    setVideoData(null);
    setError("");
    setLoading(false);
    setNoWatermarkLoading(false);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TikTok Video Downloader",
    url: "https://generatorpromptai.com/tools/tiktok-video-downloader",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://generatorpromptai.com",
    },
    description: "Free online TikTok video downloader. Download TikTok videos without watermark in HD quality. No login required.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How to download TikTok videos without watermark?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply paste the TikTok video link into our tool, click 'Download', and then click 'Download No Watermark (HD)'. The video will be saved to your device without the TikTok logo.",
        },
      },
      {
        "@type": "Question",
        name: "Is this TikTok downloader free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our TikTok video downloader is 100% free to use. There are no hidden fees, no sign-ups, and no limits on how many videos you can download.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download TikTok videos in HD quality?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our tool automatically fetches the highest available quality (HD) for the no-watermark version of the video.",
        },
      },
      {
        "@type": "Question",
        name: "Does it work on mobile phones?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Our website and TikTok downloader are fully optimized and work perfectly on Android and iOS browsers.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>TikTok Video Downloader - Save Videos Without Watermark (HD)</title>
        <meta
          name="description"
          content="Free online TikTok video downloader. Save TikTok videos without watermark in HD quality instantly. No login, no software install required."
        />
        <meta
          name="keywords"
          content="TikTok video downloader, download TikTok without watermark, save TikTok HD, TikTok saver, TikTok to mp4"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/tiktok-video-downloader" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="TikTok Video Downloader - No Watermark HD" />
        <meta property="og:description" content="Download TikTok videos without watermark in HD quality. 100% free online tool." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/tiktok-video-downloader" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-tiktok-downloader.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TikTok Video Downloader - No Watermark" />
        <meta name="twitter:description" content="Save TikTok videos without watermark in HD. Free and instant." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-tiktok-downloader.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Back Nav */}
        <div className="max-w-4xl mx-auto w-full px-4 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 mb-4">
              <Video className="text-white" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              TikTok Video Downloader
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Save any TikTok video in HD quality without the watermark. Completely free, no login required.
            </p>
          </div>

          {/* Downloader Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              TikTok Video URL
            </label>

            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/1234567890"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-800"
                onKeyDown={(e) => e.key === "Enter" && fetchVideo()}
              />
              <button
                onClick={fetchVideo}
                disabled={loading}
                className="bg-gray-900 hover:bg-gray-800 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Download"
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-3 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Result UI */}
            {videoData && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  {/* Video Cover */}
                  <div className="flex-shrink-0 w-full md:w-64 aspect-[9/16] max-h-[400px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mx-auto md:mx-0">
                    <img
                      src={videoData.cover || videoData.origin_cover}
                      alt="TikTok Video Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Video Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <span className="font-semibold text-gray-800">
                          @{videoData.author?.unique_id || "user"}
                        </span>
                        <span>·</span>
                        <span>{videoData.duration ? `${Math.floor(videoData.duration / 60)}:${String(videoData.duration % 60).padStart(2, '0')}` : "0:00"}</span>
                      </div>
                      
                      {videoData.title && (
                        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                          {videoData.title}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex gap-4 text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                          ❤️ {videoData.statistics?.digg_count?.toLocaleString() || "0"}
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {videoData.statistics?.comment_count?.toLocaleString() || "0"}
                        </span>
                        <span className="flex items-center gap-1">
                          🔁 {videoData.statistics?.share_count?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* No Watermark HD */}
                      {videoData.play && (
                        <button
                          onClick={() => handleDownload(videoData.play, true)}
                          disabled={noWatermarkLoading}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-all disabled:opacity-70"
                        >
                          {noWatermarkLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Download size={18} />
                          )}
                          No Watermark (HD)
                        </button>
                      )}

                      {/* With Watermark */}
                      {videoData.origin_cover && (
                        <button
                          onClick={() => handleDownload(videoData.origin_cover, false)}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-800 font-semibold px-6 py-3.5 rounded-xl transition-all"
                        >
                          <Download size={18} />
                          With Watermark
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audio Download (If available) */}
                {videoData.music && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg">🎵</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-xs sm:max-w-md">
                          {videoData.music?.title || "Original Audio"}
                        </p>
                        <p className="text-xs text-gray-500">Audio Track</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(videoData.music)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Download size={15} />
                      MP3
                    </button>
                  </div>
                )}

                {/* Reset Action */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <RefreshCw size={15} />
                    Download Another Video
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free TikTok Video Downloader — No Watermark, HD Quality
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Save your favorite TikTok videos directly to your device in high definition without the annoying watermark. Our tool is completely free, requires no login, and works directly in your browser on both mobile and desktop.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Whether you want to back up your own content, save a tutorial for offline viewing, or share a clip on other platforms, our downloader gets the job done in seconds. We fetch the original server file, ensuring you get the absolute highest quality available.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How to download TikTok videos without watermark</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
              <li>Open TikTok and tap the "Share" arrow on the video you want to save.</li>
              <li>Tap "Copy Link" to copy the video URL to your clipboard.</li>
              <li>Paste the link into the input box above and click <strong>Download</strong>.</li>
              <li>Click <strong>No Watermark (HD)</strong> to save the clean video to your device.</li>
            </ol>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why use our TikTok downloader?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>100% free — no hidden fees, no premium tiers</li>
              <li>No account or sign-up required</li>
              <li>Downloads the highest available HD quality</li>
              <li>Removes the TikTok watermark completely</li>
              <li>Option to extract the audio track (MP3)</li>
              <li>Works on iPhone, Android, PC, and Mac</li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How do I remove the watermark from a TikTok video?",
                  a: "Simply paste the TikTok link into our tool. When the video loads, click the 'No Watermark (HD)' button. Our tool fetches the raw original file from the server before the watermark is added."
                },
                {
                  q: "Is it legal to download TikTok videos?",
                  a: "Downloading videos for personal offline viewing is generally accepted. However, re-uploading someone else's content without permission may violate copyright laws and TikTok's Terms of Service. Always respect creators' rights."
                },
                {
                  q: "Can I download TikTok videos on my iPhone?",
                  a: "Yes. Our website is fully optimized for mobile Safari. When you click download, the video will open in a new tab. Long-press the video and select 'Download to Files' or 'Save Video'."
                },
                {
                  q: "Why is my video downloading with a watermark?",
                  a: "Make sure you clicked the specific 'No Watermark (HD)' button. If that button doesn't appear, the video might be restricted or the API might be temporarily blocked by TikTok."
                },
                {
                  q: "Do you store the videos I download?",
                  a: "No. We do not host, store, or cache any videos. The download happens directly from the content delivery network to your device."
                }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Online Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/youtube-thumbnail-downloader", title: "YouTube Thumbnail Downloader", desc: "Download HD thumbnails from any YouTube video instantly." },
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Reduce image file size without losing visible quality." },
                { to: "/tools/mp4-to-mp3", title: "MP4 to MP3 Converter", desc: "Extract audio from video files quickly and easily." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-gray-900 transition-colors">
                    {tool.title}
                  </h3>
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