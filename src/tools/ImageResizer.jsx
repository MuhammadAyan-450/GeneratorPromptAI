// pages/ImageResizer.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, Upload, Download, Image as ImageIcon,
  Lock, Unlock, RefreshCw, Shield, Maximize2
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const k = 1024, sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// ─── Platform Presets ─────────────────────────────────────────────────────────
const PRESETS = [
  { label: "Instagram Post",    w: 1080, h: 1080 },
  { label: "Instagram Story",   w: 1080, h: 1920 },
  { label: "Facebook Cover",    w: 820,  h: 312  },
  { label: "Twitter Header",    w: 1500, h: 500  },
  { label: "YouTube Thumb",     w: 1280, h: 720  },
  { label: "WhatsApp DP",       w: 500,  h: 500  },
  { label: "LinkedIn Banner",   w: 1584, h: 396  },
  { label: "HD Wallpaper",      w: 1920, h: 1080 },
];

const FORMAT_OPTIONS = [
  { value: "image/jpeg", label: "JPG",  ext: "jpg",  hasQuality: true  },
  { value: "image/png",  label: "PNG",  ext: "png",  hasQuality: false },
  { value: "image/webp", label: "WebP", ext: "webp", hasQuality: true  },
];

const QUICK_SCALES = [25, 50, 75, 100, 150, 200];

// ─── Component ────────────────────────────────────────────────────────────────
const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage,  setResizedImage]  = useState(null);
  const [originalSize,  setOriginalSize]  = useState(0);
  const [resizedSize,   setResizedSize]   = useState(0);
  const [origWidth,     setOrigWidth]     = useState(0);
  const [origHeight,    setOrigHeight]    = useState(0);
  const [width,         setWidth]         = useState("");
  const [height,        setHeight]        = useState("");
  const [aspectLocked,  setAspectLocked]  = useState(true);
  const [usePercent,    setUsePercent]    = useState(false);
  const [percent,       setPercent]       = useState(100);
  const [outputFormat,  setOutputFormat]  = useState("image/jpeg");
  const [quality,       setQuality]       = useState(0.92);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [isDragging,    setIsDragging]    = useState(false);
  const [activePreset,  setActivePreset]  = useState("");

  const fileInputRef = useRef(null);
  const imgRef       = useRef(null);
  const origUrlRef   = useRef(null);
  const resizedUrlRef = useRef(null);

  // Cleanup object URLs
  useEffect(() => () => {
    if (origUrlRef.current)   URL.revokeObjectURL(origUrlRef.current);
    if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current);
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image (JPG, PNG, WebP).");
      return;
    }
    setError(null);
    if (origUrlRef.current) URL.revokeObjectURL(origUrlRef.current);
    const url = URL.createObjectURL(file);
    origUrlRef.current = url;
    setOriginalImage(url);
    setOriginalSize(file.size);
    setResizedImage(null);
    setResizedSize(0);
    setActivePreset("");

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setWidth(String(img.width));
      setHeight(String(img.height));
      setPercent(100);
      imgRef.current = img;
    };
  };

  const handleWidthChange = (val) => {
    setWidth(val);
    setActivePreset("");
    if (aspectLocked && origWidth && origHeight && val) {
      const ratio = origHeight / origWidth;
      setHeight(String(Math.round(parseInt(val, 10) * ratio) || ""));
    }
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    setActivePreset("");
    if (aspectLocked && origWidth && origHeight && val) {
      const ratio = origWidth / origHeight;
      setWidth(String(Math.round(parseInt(val, 10) * ratio) || ""));
    }
  };

  const applyScale = (pct) => {
    setPercent(pct);
    setUsePercent(true);
    setActivePreset("");
    const scale = pct / 100;
    setWidth(String(Math.round(origWidth * scale)));
    setHeight(String(Math.round(origHeight * scale)));
  };

  const applyPreset = (preset) => {
    setActivePreset(preset.label);
    setUsePercent(false);
    setAspectLocked(false);
    setWidth(String(preset.w));
    setHeight(String(preset.h));
  };

  const resize = () => {
    if (!imgRef.current) return;
    let tw = parseInt(width, 10);
    let th = parseInt(height, 10);

    if (usePercent) {
      const scale = percent / 100;
      tw = Math.round(origWidth  * scale);
      th = Math.round(origHeight * scale);
      setWidth(String(tw));
      setHeight(String(th));
    }

    if (!tw || !th || tw <= 0 || th <= 0) {
      setError("Please enter valid positive dimensions.");
      return;
    }
    if (tw > 8000 || th > 8000) {
      setError("Max dimension is 8000px to prevent browser crashes.");
      return;
    }

    setLoading(true);
    setError(null);

    const canvas = document.createElement("canvas");
    canvas.width  = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgRef.current, 0, 0, tw, th);

    const fmt  = outputFormat;
    const qual = FORMAT_OPTIONS.find((f) => f.value === fmt)?.hasQuality ? quality : undefined;

    canvas.toBlob(
      (blob) => {
        if (!blob) { setError("Resize failed. Please try again."); setLoading(false); return; }
        if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current);
        const url = URL.createObjectURL(blob);
        resizedUrlRef.current = url;
        setResizedImage(url);
        setResizedSize(blob.size);
        setLoading(false);
      },
      fmt, qual
    );
  };

  const downloadResized = () => {
    if (!resizedImage) return;
    const ext  = FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.ext || "jpg";
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = `resized-${width}x${height}-${Date.now()}.${ext}`;
    link.click();
  };

  const reset = () => {
    setOriginalImage(null); setResizedImage(null);
    setOriginalSize(0);     setResizedSize(0);
    setWidth("");           setHeight("");
    setPercent(100);        setUsePercent(false);
    setError(null);         setLoading(false);
    setActivePreset("");    setAspectLocked(true);
    imgRef.current = null;
  };

  const savingsPct = originalSize > 0 && resizedSize > 0
    ? Math.round(((originalSize - resizedSize) / originalSize) * 100)
    : 0;

  const currentFormat = FORMAT_OPTIONS.find((f) => f.value === outputFormat);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Resizer",
    url: "https://generatorpromptai.com/tools/image-resizer",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free online image resizer. Resize JPG, PNG and WebP images to any pixel dimension or percentage. Aspect ratio lock, platform presets, quality control. 100% private.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What size should an Instagram post image be?",
        acceptedAnswer: { "@type": "Answer", text: "Instagram post images should be 1080×1080px for square posts. Use our Instagram Post preset to resize automatically." },
      },
      {
        "@type": "Question",
        name: "Can I resize an image without losing quality?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Resizing down (making an image smaller) preserves quality well, especially with high quality settings. Resizing up (enlarging) can cause some blurriness as pixels are interpolated." },
      },
      {
        "@type": "Question",
        name: "Does this image resizer upload my photos to a server?",
        acceptedAnswer: { "@type": "Answer", text: "No. Everything happens entirely in your browser. Your images are never uploaded to any server — 100% private and secure." },
      },
      {
        "@type": "Question",
        name: "How do I resize an image to a specific percentage?",
        acceptedAnswer: { "@type": "Answer", text: "Use the quick scale buttons (25%, 50%, 75% etc.) or toggle Percentage mode and enter any value from 1% to 200%." },
      },
      {
        "@type": "Question",
        name: "What output formats are available?",
        acceptedAnswer: { "@type": "Answer", text: "You can download resized images as JPG (smallest file size), PNG (lossless), or WebP (best compression for web)." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Image Resizer - Resize Images Online Free | Pixel & Percentage | Platform Presets</title>
        <meta
          name="description"
          content="Free online image resizer — resize JPG, PNG and WebP images to any pixel dimension or percentage. Platform presets for Instagram, YouTube, Twitter, Facebook. Aspect ratio lock. 100% private, no upload."
        />
        <meta
          name="keywords"
          content="image resizer, resize image online, resize photo free, resize image pixels, percentage image resize, instagram image resize, youtube thumbnail resize, free image resizer 2026, aspect ratio lock"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/image-resizer" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Image Resizer - Resize Images Free Online | Platform Presets" />
        <meta property="og:description" content="Resize images to any size online. Platform presets for Instagram, YouTube, Twitter, Facebook. Download as JPG, PNG or WebP. 100% private." />
        <meta property="og:url" content="https://generatorpromptai.com/tools/image-resizer" />
        <meta property="og:image" content="https://generatorpromptai.com/og-image-resizer.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Resizer - Resize Photos Online with Platform Presets" />
        <meta name="twitter:description" content="Resize images for Instagram, YouTube, Facebook and more. Custom pixel dimensions or percentage. Free, private, no upload." />
        <meta name="twitter:image" content="https://generatorpromptai.com/og-image-resizer.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mb-4">
              <Maximize2 className="text-blue-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Image Resizer</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Resize photos to any dimension or percentage. Platform presets for Instagram, YouTube, Twitter and more.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> 100% private — images never leave your browser
            </div>
          </div>

          {/* Upload */}
          {!originalImage && (
            <div
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all mb-8 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/20"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-blue-600" size={28} />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">Drop image here or click to upload</p>
              <p className="text-gray-400 text-sm">JPG, PNG, WebP — any size</p>
              {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
            </div>
          )}

          {originalImage && (
            <div className="space-y-5">

              {/* Platform Presets */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Platform Size Presets</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                        activePreset === p.label
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      {p.label}
                      <span className="ml-1 text-xs opacity-60">{p.w}×{p.h}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls + Preview grid */}
              <div className="grid lg:grid-cols-2 gap-5">

                {/* Left: Settings */}
                <div className="space-y-4">

                  {/* Original preview */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">Original</span>
                      <span className="text-xs text-gray-400">{formatBytes(originalSize)} · {origWidth}×{origHeight}px</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                      <img src={originalImage} alt="Original" className="w-full max-h-52 object-contain" />
                    </div>
                  </div>

                  {/* Resize Settings */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-gray-700">Resize Settings</p>
                      <button
                        onClick={() => setAspectLocked(!aspectLocked)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                          aspectLocked
                            ? "bg-blue-50 border-blue-300 text-blue-600"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}
                      >
                        {aspectLocked ? <Lock size={13} /> : <Unlock size={13} />}
                        {aspectLocked ? "Ratio locked" : "Ratio unlocked"}
                      </button>
                    </div>

                    {/* Quick Scale Buttons */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Scale</p>
                      <div className="flex gap-2 flex-wrap">
                        {QUICK_SCALES.map((s) => (
                          <button
                            key={s}
                            onClick={() => applyScale(s)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                              usePercent && percent === s
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-400"
                            }`}
                          >
                            {s}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Width / Height inputs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Width (px)</label>
                        <input
                          type="number" min="1" max="8000"
                          value={width}
                          onChange={(e) => { setUsePercent(false); handleWidthChange(e.target.value); }}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Height (px)</label>
                        <input
                          type="number" min="1" max="8000"
                          value={height}
                          onChange={(e) => { setUsePercent(false); handleHeightChange(e.target.value); }}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                      </div>
                    </div>

                    {/* Output format */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Output Format</label>
                      <div className="flex gap-2">
                        {FORMAT_OPTIONS.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => setOutputFormat(f.value)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                              outputFormat === f.value
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality slider — only for JPG/WebP */}
                    {currentFormat?.hasQuality && (
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Quality — <span className="text-blue-600">{Math.round(quality * 100)}%</span>
                        </label>
                        <input
                          type="range" min="0.5" max="1.0" step="0.01"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Smaller file</span><span>Best quality</span>
                        </div>
                      </div>
                    )}

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={resize}
                        disabled={loading || !width || !height}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        <Maximize2 size={17} />
                        {loading ? "Resizing..." : "Resize Image"}
                      </button>
                      <button
                        onClick={reset}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center gap-2"
                      >
                        <RefreshCw size={15} /> Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Resized output */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700">Resized Output</span>
                    {resizedSize > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatBytes(resizedSize)}</span>
                        {savingsPct > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">-{savingsPct}%</span>
                        )}
                        {savingsPct < 0 && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">+{Math.abs(savingsPct)}% (enlarged)</span>
                        )}
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="h-64 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
                      <p className="text-sm text-blue-600">Resizing...</p>
                    </div>
                  ) : resizedImage ? (
                    <>
                      {/* Size comparison bar */}
                      {resizedSize > 0 && (
                        <div className="mb-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>Original: {formatBytes(originalSize)} ({origWidth}×{origHeight}px)</span>
                            <span>New: {formatBytes(resizedSize)} ({width}×{height}px)</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${savingsPct >= 0 ? "bg-green-500" : "bg-orange-400"}`}
                              style={{ width: `${Math.min(100, Math.max(5, 100 - Math.abs(savingsPct)))}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden mb-4">
                        <img src={resizedImage} alt="Resized" className="w-full max-h-80 object-contain" />
                      </div>
                      <button
                        onClick={downloadResized}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={17} /> Download {currentFormat?.label}
                      </button>
                    </>
                  ) : (
                    <div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon size={36} className="mb-2" />
                      <p className="text-sm">Resized image appears here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Image Resizer — Pixel &amp; Percentage, Platform Presets
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free image resizer lets you resize JPG, PNG, and WebP images to any exact pixel dimension or percentage scale — all inside your browser. No uploads, no server, 100% private. Download resized images as JPG, PNG, or WebP with adjustable quality.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Choose from 8 platform presets including Instagram Post (1080×1080), Instagram Story (1080×1920), YouTube Thumbnail (1280×720), Twitter Header (1500×500), and more. Or enter any custom width and height with aspect ratio lock to prevent stretching.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Standard image sizes for social media</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>Instagram Post:</strong> 1080×1080px (square)</li>
              <li><strong>Instagram Story / Reels:</strong> 1080×1920px</li>
              <li><strong>YouTube Thumbnail:</strong> 1280×720px (16:9)</li>
              <li><strong>Twitter / X Header:</strong> 1500×500px</li>
              <li><strong>Facebook Cover:</strong> 820×312px</li>
              <li><strong>LinkedIn Banner:</strong> 1584×396px</li>
              <li><strong>WhatsApp Profile Picture:</strong> 500×500px</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "What size should an Instagram post image be?", a: "Instagram post images should be 1080×1080px for square posts. Use our Instagram Post preset to resize automatically to the correct dimensions." },
                { q: "Can I resize without losing quality?", a: "Resizing down (making smaller) preserves quality very well with high quality settings. Resizing up (enlarging) will cause some blurriness as pixels are interpolated — this is a limitation of all image resizers." },
                { q: "Does this tool upload my images?", a: "No. All resizing happens entirely in your browser. Your images are never uploaded to any server — completely private and secure." },
                { q: "How do I resize by percentage?", a: "Click any quick scale button (25%, 50%, 75%, 100%, 150%, 200%) to resize proportionally. The pixel dimensions update automatically." },
                { q: "What output formats are available?", a: "JPG (smallest file, best for photos), PNG (lossless, best for graphics and transparency), or WebP (best compression for web use)." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Image Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Reduce image file size by up to 90% without quality loss." },
                { to: "/tools/image-cropper",    title: "Image Cropper",    desc: "Crop images with social media presets and custom ratios." },
                { to: "/tools/image-converter",  title: "Image Converter",  desc: "Convert between JPG, PNG and WebP formats instantly." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
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

export default ImageResizer;