import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download, RefreshCw, Video, AlertCircle, Loader2, Instagram, Home, Layers } from "lucide-react";

const API_URL = "https://api.saveig.app/api/v1/media";

const InstagramVideoDownloader = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaData, setMediaData] = useState(null);
  const [error, setError] = useState("");
  const [downloadLoadingIndex, setDownloadLoadingIndex] = useState(null);

  const isValidInstagramUrl = (link) => {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|reels|tv)\/.+$/i;
    return regex.test(link);
  };

  const fetchMedia = async () => {
    if (!url.trim()) {
      setError("Please paste an Instagram video or reel link");
      return;
    }

    if (!isValidInstagramUrl(url.trim())) {
      setError("Please enter a valid Instagram URL (e.g., https://www.instagram.com/reel/...)");
      return;
    }

    setLoading(true);
    setError("");
    setMediaData(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `url=${encodeURIComponent(url.trim())}`,
      });

      const data = await response.json();

      if (data.status === 200 && data.result && data.result.length > 0) {
        setMediaData(data.result);
      } else {
        setError(data.error || "Failed to fetch media. The post might be private or the link is invalid.");
      }
    } catch (err) {
      setError("Network error or API limit reached. Please try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl, index) => {
    setDownloadLoadingIndex(index);
    try {
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setTimeout(() => setDownloadLoadingIndex(null), 2000);
    }
  };

  const reset = () => {
    setUrl("");
    setMediaData(null);
    setError("");
    setLoading(false);
    setDownloadLoadingIndex(null);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Instagram Video Downloader",
    url: "https://www.generatorpromptai.com/tools/instagram-video-downloader",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com",
    },
    description: "Free online Instagram video and reel downloader. Save Instagram videos in HD quality without login. No software install required.",
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
        name: "How to download Instagram reels and videos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open the Instagram reel or video, tap the three dots (or copy link), paste the URL into our tool, and click Download. Then select your desired quality.",
        },
      },
      {
        "@type": "Question",
        name: "Is this Instagram video downloader free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 100% free. There are no hidden fees, no sign-ups, and no limits on how many videos you can download.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download from private accounts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, our tool can only download content from public Instagram profiles. Private account content cannot be accessed by third-party tools.",
        },
      },
      {
        "@type": "Question",
        name: "Does it work on mobile phones?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Our website is fully responsive and works perfectly on Android and iOS browsers.",
        },
      },
    ],
  };

  // ADDED: Breadcrumb Schema for Structure
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
        name: "Instagram Video Downloader"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Instagram Video Downloader - Save Reels & Videos in HD Free</title>
        <meta
          name="description"
          content="Free online Instagram video downloader. Save Instagram Reels, videos, and carousel posts in HD quality instantly. No login, no software install required."
        />
        <meta
          name="keywords"
          content="Instagram video downloader, download Instagram reels, save Instagram video, Instagram reel saver, IG video download, Instagram to mp4"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/instagram-video-downloader" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Instagram Video & Reel Downloader - HD Free" />
        <meta property="og:description" content="Download Instagram Reels and videos in HD quality. 100% free online tool, no login needed." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/instagram-video-downloader" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-insta-downloader.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Instagram Video & Reel Downloader" />
        <meta name="twitter:description" content="Save Instagram videos and reels without watermarks in HD. Free and instant." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-insta-downloader.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script> {/* Added Breadcrumb */}
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 mb-4">
              <Instagram className="text-white" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Instagram Video Downloader
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Save Instagram Reels, videos, and carousel posts in HD quality. Completely free, no login required.
            </p>
          </div>

          {/* Downloader Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instagram Post / Reel URL
            </label>

            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/ABC123..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
                onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
              />
              <button
                onClick={fetchMedia}
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
            {mediaData && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  {mediaData.length > 1 ? `${mediaData.length} Media Files Found` : "Media Ready to Download"}
                </h3>

                <div className="grid sm:grid-cols-2 gap-5 mb-8">
                  {mediaData.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                      {/* Thumbnail */}
                      <div className="w-full aspect-video bg-gray-100 relative">
                        <img
                          src={item.thumbnail || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20' rx='5'/%3E%3C/svg%3E"}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {item.isVideo && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Video size={12} /> Video
                          </div>
                        )}
                      </div>

                      {/* Info & Action */}
                      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-grow">
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-gray-800">
                            {item.isVideo ? `Video ${index + 1}` : `Image ${index + 1}`}
                          </p>
                          {item.quality && (
                            <p className="text-xs text-gray-500">{item.quality}</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleDownload(item.url, index)}
                          disabled={downloadLoadingIndex === index}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all disabled:opacity-70"
                        >
                          {downloadLoadingIndex === index ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Download size={16} />
                          )}
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reset Action */}
                <div className="flex justify-center">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <RefreshCw size={15} />
                    Download Another Post
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Instagram Video & Reel Downloader — Fast & HD
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Save your favorite Instagram Reels and videos directly to your phone or computer in high definition. Our tool requires no login, no app installation, and works seamlessly on any browser. 
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Whether it's a trending Reel, a tutorial, or a carousel post you want to keep offline, our downloader extracts the original file directly from Instagram's servers to ensure you get the best possible quality.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How to download Instagram Reels and Videos</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
              <li>Open the Instagram app or website and navigate to the Reel or Video.</li>
              <li>Tap the three dots (<strong>...</strong>) in the top right corner and select <strong>Copy Link</strong>.</li>
              <li>Paste the link into the input box above and click <strong>Download</strong>.</li>
              <li>Click the <strong>Save</strong> button on the media file you want to download.</li>
            </ol>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why use our Instagram downloader?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>100% free — no hidden charges or premium plans</li>
              <li>No account or sign-up required</li>
              <li>Supports Reels, standard videos, and carousel posts</li>
              <li>Fetches the highest available HD quality</li>
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
                  q: "Can I download Instagram Reels?",
                  a: "Yes, our tool is fully optimized for Instagram Reels. Just paste the Reel link, and it will extract the video in HD quality."
                },
                {
                  q: "Can I download carousel posts (multiple images/videos)?",
                  a: "Yes! If the link points to a carousel post, our tool will detect all the images and videos inside it and let you save them individually."
                },
                {
                  q: "Can I download videos from private accounts?",
                  a: "No. For privacy and security reasons, our tool can only download content from public Instagram accounts. Private content cannot be accessed."
                },
                {
                  q: "Why is my download not starting on iPhone?",
                  a: "When you click 'Save', the video opens in a new tab. Long-press the playing video and select 'Download to Files' or 'Save Video' from the menu."
                },
                {
                  q: "Do you store my data or the downloaded videos?",
                  a: "No. We do not store your URLs, personal data, or the media files you download. Everything happens securely in real-time."
                }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools & Breadcrumbs for Internal Linking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Online Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/tiktok-video-downloader", title: "TikTok Video Downloader", desc: "Download TikTok videos without watermark in HD quality." },
                { to: "/tools/youtube-thumbnail-downloader", title: "YouTube Thumbnail Downloader", desc: "Download HD thumbnails from any YouTube video instantly." },
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Reduce image file size without losing visible quality." },
                { to: "/pages/all-tools", title: "All Tools", desc: "Browse our complete collection of 30+ free AI tools and converters." } // Added Link to All Tools
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

export default InstagramVideoDownloader;