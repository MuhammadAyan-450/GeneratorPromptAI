import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Upload, Download, Image as ImageIcon,
  Lock, Unlock, RefreshCw, Maximize2, Home,
  ChevronDown, Ruler, HardDrive, ArrowRightLeft, Percent
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
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "YouTube Thumb", w: 1280, h: 720 },
  { label: "WhatsApp DP", w: 500, h: 500 },
  { label: "LinkedIn Banner", w: 1584, h: 396 },
  { label: "HD Wallpaper", w: 1920, h: 1080 },
];

const FORMAT_OPTIONS = [
  { value: "image/jpeg", label: "JPG", ext: "jpg", hasQuality: true },
  { value: "image/png", label: "PNG", ext: "png", hasQuality: false },
  { value: "image/webp", label: "WebP", ext: "webp", hasQuality: true },
];

const QUICK_SCALES = [25, 50, 75, 100, 150, 200];

// ─── Component ────────────────────────────────────────────────────────────────
const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [resizedSize, setResizedSize] = useState(0);
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [aspectLocked, setAspectLocked] = useState(true);
  const [usePercent, setUsePercent] = useState(false);
  const [percent, setPercent] = useState(100);
  const [outputFormat, setOutputFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.92);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activePreset, setActivePreset] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const origUrlRef = useRef(null);
  const resizedUrlRef = useRef(null);

  useEffect(() => () => {
    if (origUrlRef.current) URL.revokeObjectURL(origUrlRef.current);
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
      tw = Math.round(origWidth * scale);
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
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgRef.current, 0, 0, tw, th);

    const fmt = outputFormat;
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
    const ext = FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.ext || "jpg";
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = `resized-${width}x${height}-${Date.now()}.${ext}`;
    link.click();
  };

  const reset = () => {
    setOriginalImage(null); setResizedImage(null);
    setOriginalSize(0); setResizedSize(0);
    setWidth(""); setHeight("");
    setPercent(100); setUsePercent(false);
    setError(null); setLoading(false);
    setActivePreset(""); setAspectLocked(true);
    imgRef.current = null;
  };

  const savingsPct = originalSize > 0 && resizedSize > 0
    ? Math.round(((originalSize - resizedSize) / originalSize) * 100)
    : 0;

  const currentFormat = FORMAT_OPTIONS.find((f) => f.value === outputFormat);

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Resize Image to 1080x1080 for Instagram Post Online – Free Pixel Dimension Tool",
    "url": "https://www.generatorpromptai.com/tools/image-resizer",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online image resizer to change JPG, PNG and WebP to any pixel dimension or percentage. Platform presets for Instagram 1080x1080, YouTube 1280x720, Twitter 1500x500. Aspect ratio lock, no upload.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Image Resizer", "item": "https://www.generatorpromptai.com/tools/image-resizer" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to resize image to 1080x1080 for Instagram post online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your photo, click the Instagram Post preset (1080x1080), then click Resize Image. The tool automatically sets the correct dimensions and you can download the resized image as JPG, PNG or WebP."
        }
      },
      {
        "@type": "Question",
        "name": "Can I resize an image without losing quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, when resizing down (making smaller) quality is preserved very well with high quality output settings. Resizing up (enlarging) will cause some blurriness because pixels are being interpolated — this is a fundamental limitation of all image resizers."
        }
      },
      {
        "@type": "Question",
        "name": "How to resize image to 50 percent online for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your image and click the 50% quick scale button. The width and height fields update automatically to half the original dimensions. Then click Resize Image to process and download."
        }
      },
      {
        "@type": "Question",
        "name": "What size for YouTube thumbnail 1280x720?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "YouTube thumbnails should be 1280x720 pixels in 16:9 aspect ratio. Select the YouTube Thumb preset in our tool and it sets 1280x720 automatically."
        }
      },
      {
        "@type": "Question",
        "name": "Does this image resizer upload my photos to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All resizing happens entirely in your browser using the HTML5 Canvas API. Your images are never uploaded, stored, or sent to any server."
        }
      },
      {
        "@type": "Question",
        "name": "How to resize photo for WhatsApp profile picture 500x500?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your photo, click the WhatsApp DP preset (500x500), then click Resize Image. Download the result and set it as your WhatsApp profile picture."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Resize Image to 1080x1080 for Instagram Post Online – Free Pixel Dimension Tool</title>

        <meta
          name="description"
          content="Free online image resizer — change JPG, PNG and WebP to any pixel dimension or percentage. Platform presets for Instagram 1080x1080, YouTube 1280x720, Twitter 1500x500. Aspect ratio lock. No upload to server."
        />

        <meta
          name="keywords"
          content="how to resize image to 1080x1080 for instagram post online, resize photo to specific pixel dimensions free no upload, resize image to 50 percent online free tool, resize image for youtube thumbnail 1280x720 free, change image dimensions without losing quality online, resize photo for whatsapp profile picture 500x500, free online image resizer with aspect ratio lock, resize image to exact pixels for website free, resize jpg png webp to custom dimensions free, best free image resizer for social media 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/image-resizer" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Resize Image to 1080x1080 for Instagram Post Online – Free Tool" />
        <meta property="og:description" content="Resize images to any pixel dimension or percentage. Instagram, YouTube, Twitter presets. Aspect ratio lock. No server upload." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/image-resizer" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Resizer – Resize to 1080x1080, 1280x720, Custom Pixels" />
        <meta name="twitter:description" content="Resize images online to any dimension. Instagram, YouTube, Twitter presets. Aspect ratio lock. Free, no upload." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb ── */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-sky-600 transition-colors">
                  <Home size={14} /> Home
                </Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li>
                <Link to="/pages/all-tools" className="hover:text-sky-600 transition-colors">All Tools</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">Image Resizer</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Maximize2 className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Resize Image to 1080x1080 for Instagram Post Online –{" "}
              <span className="text-sky-600">Free Pixel Dimension Tool</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Change JPG, PNG and WebP to any pixel dimension or percentage. Platform presets for Instagram, YouTube, Twitter and more. No upload to server.
            </p>
          </div>

          {/* ── Upload State ── */}
          {!originalImage && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
              <div
                className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${isDragging ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-sky-50/30"
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
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-sky-600" size={28} />
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">Drop image here or click to upload</p>
                <p className="text-gray-400 text-sm">JPG, PNG, WebP — any size</p>
                {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
              </div>
            </div>
          )}

          {originalImage && (
            <div className="space-y-5">

              {/* ── Platform Presets ── */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Platform Size Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p)}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${activePreset === p.label
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                        }`}
                    >
                      {p.label}
                      <span className="ml-1 text-xs opacity-60">{p.w}x{p.h}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Controls + Preview Grid ── */}
              <div className="grid lg:grid-cols-2 gap-5">

                {/* Left: Settings */}
                <div className="space-y-4">

                  {/* Original Preview */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">Original</span>
                      <span className="text-xs text-gray-400">{formatBytes(originalSize)} · {origWidth}x{origHeight}px</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                      <img src={originalImage} alt="Original" className="w-full max-h-52 object-contain" />
                    </div>
                  </div>

                  {/* Resize Settings */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-gray-700">Resize Settings</label>
                      <button
                        onClick={() => setAspectLocked(!aspectLocked)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${aspectLocked
                            ? "bg-sky-50 border-sky-300 text-sky-600"
                            : "bg-gray-50 border-gray-200 text-gray-500"
                          }`}
                      >
                        {aspectLocked ? <Lock size={13} /> : <Unlock size={13} />}
                        {aspectLocked ? "Ratio locked" : "Ratio unlocked"}
                      </button>
                    </div>

                    {/* Quick Scale */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Scale</label>
                      <div className="flex gap-2 flex-wrap">
                        {QUICK_SCALES.map((s) => (
                          <button
                            key={s}
                            onClick={() => applyScale(s)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${usePercent && percent === s
                                ? "bg-sky-600 text-white border-sky-600"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-sky-400"
                              }`}
                          >
                            {s}%
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Width / Height */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Width (px)</label>
                        <input
                          type="number" min="1" max="8000"
                          value={width}
                          onChange={(e) => { setUsePercent(false); handleWidthChange(e.target.value); }}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Height (px)</label>
                        <input
                          type="number" min="1" max="8000"
                          value={height}
                          onChange={(e) => { setUsePercent(false); handleHeightChange(e.target.value); }}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                        />
                      </div>
                    </div>

                    {/* Output Format */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Output Format</label>
                      <div className="flex gap-2">
                        {FORMAT_OPTIONS.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => setOutputFormat(f.value)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${outputFormat === f.value
                                ? "bg-sky-600 text-white border-sky-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                              }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality Slider */}
                    {currentFormat?.hasQuality && (
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Quality — <span className="text-sky-600">{Math.round(quality * 100)}%</span>
                        </label>
                        <input
                          type="range" min="0.5" max="1.0" step="0.01"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full accent-sky-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Smaller file</span><span>Best quality</span>
                        </div>
                      </div>
                    )}

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={resize}
                        disabled={loading || !width || !height}
                        className="flex-1 bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        <Maximize2 size={17} />
                        {loading ? "Resizing..." : "Resize Image"}
                      </button>
                      <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                      >
                        <RefreshCw size={15} /> Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Resized Output */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
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
                      <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-3" />
                      <p className="text-sm text-sky-600">Resizing...</p>
                    </div>
                  ) : resizedImage ? (
                    <>
                      {/* Size Comparison Bar */}
                      {resizedSize > 0 && (
                        <div className="mb-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>Original: {formatBytes(originalSize)} ({origWidth}x{origHeight}px)</span>
                            <span>New: {formatBytes(resizedSize)} ({width}x{height}px)</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${savingsPct >= 0 ? "bg-green-500" : "bg-orange-400"}`}
                              style={{ width: `${Math.min(100, Math.max(5, 100 - Math.abs(savingsPct)))}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                          <div className="flex justify-center text-sky-500 mb-1"><Ruler size={16} /></div>
                          <p className="text-sm font-bold text-gray-800">{origWidth}x{origHeight}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Original</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                          <div className="flex justify-center text-sky-500 mb-1"><ArrowRightLeft size={16} /></div>
                          <p className="text-sm font-bold text-gray-800">{width}x{height}</p>
                          <p className="text-xs text-gray-500 mt-0.5">New Size</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                          <div className="flex justify-center text-green-500 mb-1"><HardDrive size={16} /></div>
                          <p className="text-sm font-bold text-gray-800">{formatBytes(resizedSize)}</p>
                          <p className="text-xs text-gray-500 mt-0.5">File Size</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                          <div className="flex justify-center text-sky-500 mb-1"><Percent size={16} /></div>
                          <p className="text-sm font-bold text-gray-800">{savingsPct > 0 ? `-${savingsPct}%` : savingsPct < 0 ? `+${Math.abs(savingsPct)}%` : "0%"}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Change</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden mb-4">
                        <img src={resizedImage} alt="Resized" className="w-full max-h-64 object-contain" />
                      </div>
                      <button
                        onClick={downloadResized}
                        className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
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

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Image Resizer with Aspect Ratio Lock – No Software Needed
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Resizing images for social media, websites, or email should not require Photoshop or any downloaded software. Our free image resizer works entirely in your browser — upload a photo, pick a platform preset or enter custom dimensions, and download the resized image instantly.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The <strong>aspect ratio lock</strong> ensures your image never gets stretched or distorted. Change the width and the height adjusts automatically (and vice versa). Or unlock the ratio to set exact dimensions for non-proportional resizing like YouTube thumbnails or Facebook covers.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All processing uses the HTML5 Canvas API running locally in your browser. Your images are <strong>never uploaded to any server</strong>, making this tool safe for private photos, client work, and confidential business images.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Resize Image to Exact Pixels for Website Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Click <strong>Upload</strong> or drag and drop your image into the tool.</li>
              <li>Enter your target <strong>width and height in pixels</strong>, or click a platform preset.</li>
              <li>Keep <strong>aspect ratio locked</strong> to prevent distortion, or unlock for exact dimensions.</li>
              <li>Choose output format (JPG, PNG, WebP) and adjust quality if needed.</li>
              <li>Click <strong>"Resize Image"</strong> and download the result.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resize Photo to Specific Pixel Dimensions Without Losing Quality – Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "8 Platform Size Presets", desc: "One-click presets for Instagram Post (1080x1080), Instagram Story (1080x1920), YouTube Thumbnail (1280x720), Twitter Header (1500x500), Facebook Cover, LinkedIn Banner, WhatsApp DP, and HD Wallpaper." },
                { title: "Aspect Ratio Lock", desc: "Toggle the lock to keep width and height proportional. Change one dimension and the other adjusts automatically — prevents stretched or distorted images." },
                { title: "Quick Percentage Scale", desc: "Resize to 25%, 50%, 75%, 100%, 150%, or 200% of the original size with one click. Perfect for batch-like proportional resizing of single images." },
                { title: "100% Private — No Upload", desc: "All resizing runs in your browser using the HTML5 Canvas API. Your images are never uploaded, stored, or sent to any server. Works offline after page load." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Accordion ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Image Resizer – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to resize image to 1080x1080 for Instagram post online?",
                  a: "Upload your photo, click the Instagram Post preset (1080x1080), then click Resize Image. The tool automatically sets the correct dimensions and you can download the resized image as JPG, PNG or WebP."
                },
                {
                  q: "Can I resize an image without losing quality?",
                  a: "Yes, when resizing down (making smaller) quality is preserved very well with high quality output settings. Resizing up (enlarging) will cause some blurriness because pixels are being interpolated — this is a fundamental limitation of all image resizers."
                },
                {
                  q: "How to resize image to 50 percent online for free?",
                  a: "Upload your image and click the 50% quick scale button. The width and height fields update automatically to half the original dimensions. Then click Resize Image to process and download."
                },
                {
                  q: "What size for YouTube thumbnail 1280x720?",
                  a: "YouTube thumbnails should be 1280x720 pixels in 16:9 aspect ratio. Select the YouTube Thumb preset in our tool and it sets 1280x720 automatically."
                },
                {
                  q: "Does this image resizer upload my photos to a server?",
                  a: "No. All resizing happens entirely in your browser using the HTML5 Canvas API. Your images are never uploaded, stored, or sent to any server."
                },
                {
                  q: "How to resize photo for WhatsApp profile picture 500x500?",
                  a: "Upload your photo, click the WhatsApp DP preset (500x500), then click Resize Image. Download the result and set it as your WhatsApp profile picture."
                }
              ].map((item, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={22} className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Image Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Reduce image file size by up to 90% without quality loss." },
                { to: "/tools/image-cropper", title: "Image Cropper", desc: "Crop images with social media presets and custom ratios." },
                { to: "/tools/image-converter", title: "Image Converter", desc: "Convert between JPG, PNG and WebP formats instantly." }
              ].map((tool) => (
                <Link key={tool.to} to={tool.to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">{tool.title}</h3>
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