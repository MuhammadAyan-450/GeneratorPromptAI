import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import imageCompression from "browser-image-compression";
import { Copy, RefreshCw, Upload, Download, Image as ImageIcon, Shield, Zap, X, Home, ChevronDown, HardDrive, Percent, Layers } from "lucide-react";

const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const QUALITY_PRESETS = [
  { label: "Maximum", value: 0.92, desc: "Best quality, larger file" },
  { label: "Balanced", value: 0.80, desc: "Great quality, good savings" },
  { label: "Aggressive", value: 0.65, desc: "Smaller file, slight loss" },
  { label: "Minimum", value: 0.50, desc: "Smallest size, visible loss" },
];

const DIMENSION_OPTIONS = [
  { label: "1200px (Social media)", value: 1200 },
  { label: "1600px", value: 1600 },
  { label: "1920px (Full HD)", value: 1920 },
  { label: "2560px (2K)", value: 2560 },
  { label: "3840px (4K)", value: 3840 },
  { label: "Original size", value: 9999 },
];

const FORMAT_OPTIONS = [
  { label: "Keep original", value: "original" },
  { label: "Convert to WebP (best compression)", value: "image/webp" },
  { label: "Convert to JPEG", value: "image/jpeg" },
  { label: "Convert to PNG", value: "image/png" },
];

// ─── Single Image Item ────────────────────────────────────────────────────────
const ImageItem = ({ item, onRemove }) => {
  const savings = item.originalSize > 0 && item.compressedSize > 0
    ? Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{item.name}</span>
        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Original */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Original</span>
            <span className="text-sm font-medium text-gray-700">{formatBytes(item.originalSize)}</span>
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <img src={item.originalUrl} alt="Original" className="w-full h-48 object-contain" />
          </div>
        </div>

        {/* Compressed */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Compressed</span>
            {item.compressedSize > 0 && (
              <span className="text-sm font-medium text-green-600">
                {formatBytes(item.compressedSize)}
                {savings > 0 && <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">-{savings}%</span>}
              </span>
            )}
          </div>

          {item.loading ? (
            <div className="h-48 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-2" style={{ borderWidth: 3 }} />
              <p className="text-xs text-sky-600">Compressing...</p>
            </div>
          ) : item.compressedUrl ? (
            <>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <img src={item.compressedUrl} alt="Compressed" className="w-full h-48 object-contain" />
              </div>
              {savings > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Size saved</span><span>{savings}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${savings}%` }} />
                  </div>
                </div>
              )}
              <a
                href={item.compressedUrl}
                download={`compressed-${item.name}`}
                className="mt-3 w-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={15} /> Download
              </a>
            </>
          ) : item.error ? (
            <div className="h-48 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center p-4">
              <p className="text-red-500 text-sm text-center">{item.error}</p>
            </div>
          ) : (
            <div className="h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 text-xs">
              Waiting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ImageCompressor = () => {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(0.80);
  const [maxDimension, setMaxDimension] = useState(1920);
  const [outputFormat, setOutputFormat] = useState("original");
  const [isDragging, setIsDragging] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const fileInputRef = useRef(null);

  const compressFile = useCallback(async (file, id) => {
    if (!file.type.startsWith("image/")) {
      setImages((prev) => prev.map((img) => img.id === id ? { ...img, loading: false, error: "Not a valid image file" } : img));
      return;
    }

    const fileType = outputFormat === "original" ? file.type : outputFormat;
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: maxDimension === 9999 ? undefined : maxDimension,
      initialQuality: quality,
      useWebWorker: true,
      fileType,
    };

    try {
      const compressed = await imageCompression(file, options);
      const ext = fileType === "image/webp" ? "webp" : fileType === "image/png" ? "png" : "jpg";
      const compressedUrl = URL.createObjectURL(compressed);
      setImages((prev) => prev.map((img) => img.id === id
        ? { ...img, loading: false, compressedUrl, compressedSize: compressed.size, downloadName: `compressed-${img.name.replace(/\.[^.]+$/, "")}.${ext}` }
        : img
      ));
    } catch (err) {
      setImages((prev) => prev.map((img) => img.id === id ? { ...img, loading: false, error: "Compression failed. Try a different file." } : img));
    }
  }, [quality, maxDimension, outputFormat]);

  const addFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 10);
    if (!validFiles.length) return;

    const newImages = validFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      compressedUrl: null,
      compressedSize: 0,
      loading: true,
      error: null,
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img) => compressFile(img.file, img.id));
  }, [compressFile]);

  const recompressAll = () => {
    setImages((prev) => prev.map((img) => ({ ...img, loading: true, compressedUrl: null, compressedSize: 0, error: null })));
    images.forEach((img) => compressFile(img.file, img.id));
  };

  const removeImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const clearAll = () => {
    setImages([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const totalOriginal = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalCompressed = images.reduce((acc, img) => acc + img.compressedSize, 0);
  const totalSaved = Math.max(0, totalOriginal - totalCompressed);
  const avgSavings = images.length > 0 && allDone
    ? Math.round(images.reduce((acc, img) => {
      const s = img.originalSize > 0 ? Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100) : 0;
      return acc + s;
    }, 0) / images.filter((img) => !img.loading).length)
    : 0;
  const allDone = images.length > 0 && images.every((img) => !img.loading);

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compress Images Without Losing Quality Online – Free JPG PNG WebP Compressor",
    "url": "https://www.generatorpromptai.com/tools/image-compressor",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online image compressor that works entirely in your browser. Compress JPG, PNG and WebP images without uploading to any server. Reduce file size by up to 90% with no quality loss.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Image Compressor", "item": "https://www.generatorpromptai.com/tools/image-compressor" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to compress image without losing quality online for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your image to our tool and select the Maximum (92%) or Balanced (80%) quality preset. The tool compresses the image in your browser without uploading to any server, preserving visual quality while reducing file size significantly."
        }
      },
      {
        "@type": "Question",
        "name": "Does this image compressor upload my photos to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Our tool works 100% in your browser using JavaScript. Your images never leave your device. No data is uploaded, stored, or sent to any server."
        }
      },
      {
        "@type": "Question",
        "name": "How to reduce JPG file size for WhatsApp without losing quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your JPG photo, select Balanced (80%) quality and 1200px max dimension, then compress and download. The result will be a much smaller file that WhatsApp sends instantly without visible quality loss."
        }
      },
      {
        "@type": "Question",
        "name": "Can I batch compress multiple images at once for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can upload up to 10 images at once and they will all be compressed simultaneously with the same quality and dimension settings. Use the Download All button to save them all at once."
        }
      },
      {
        "@type": "Question",
        "name": "How to compress PNG to WebP for faster website loading?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your PNG images, select WebP as the output format, choose Balanced or Aggressive quality, and compress. WebP produces files 25-35% smaller than PNG at the same visual quality and is supported by all modern browsers."
        }
      },
      {
        "@type": "Question",
        "name": "How much can I reduce image file size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Depending on the original image and settings, you can reduce file size by 50-90%. Most photos compress 60-80% with the Balanced (80%) preset while maintaining excellent visual quality."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Compress Images Without Losing Quality Online – Free JPG PNG WebP Compressor</title>

        <meta
          name="description"
          content="Free online image compressor — reduce JPG, PNG and WebP file size by up to 90% without losing quality. Works entirely in your browser, no upload to any server. Batch compress up to 10 images."
        />

        <meta
          name="keywords"
          content="how to compress image without losing quality online free, compress image for website without uploading to server, reduce jpg file size for whatsapp without losing quality, batch compress images online free no upload, compress png to webp for faster website loading, make image file smaller for email attachment free, compress photo for instagram without losing quality, free image compressor for website optimization, reduce image size for faster website loading free, compress high resolution photos for web free online tool"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/image-compressor" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Compress Images Without Losing Quality Online – Free JPG PNG WebP Compressor" />
        <meta property="og:description" content="Reduce image file size by up to 90% without quality loss. Works in your browser — no server upload. Batch compress up to 10 images." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/image-compressor" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Compressor – Compress JPG PNG WebP Without Losing Quality" />
        <meta name="twitter:description" content="Reduce image file size up to 90% in your browser. No upload to server. Batch compress up to 10 images free." />

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
              <li><span className="text-gray-900 font-semibold">Image Compressor</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <ImageIcon className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Compress Images Without Losing Quality Online –{" "}
              <span className="text-sky-600">Free JPG PNG WebP Compressor</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Reduce image file size by up to 90% in your browser. No upload to any server. Batch compress up to 10 images at once.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Quality Presets */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quality Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUALITY_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setQuality(preset.value)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${quality === preset.value
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-gray-200 text-gray-600 hover:border-sky-300"
                      }`}
                  >
                    <span className="text-sm font-medium">{preset.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{preset.desc}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-gray-400 w-16">Fine-tune</span>
                <input
                  type="range" min="0.40" max="0.95" step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="flex-1 accent-sky-600"
                />
                <span className="text-sm font-semibold text-sky-600 w-10 text-right">{Math.round(quality * 100)}%</span>
              </div>
            </div>

            {/* Dimension + Format */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Dimension</label>
                <select
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800"
                >
                  {DIMENSION_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Output Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800"
                >
                  {FORMAT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${isDragging ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-sky-50/30"
                }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => addFiles(e.target.files)}
                className="hidden"
              />
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-sky-600" size={28} />
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Drop images here or click to upload
              </p>
              <p className="text-gray-400 text-sm">JPG, PNG, WebP — Up to 10 images at once</p>
            </div>

            {/* Re-compress + Clear */}
            <div className="flex flex-wrap gap-3">
              {images.length > 0 && (
                <button
                  onClick={recompressAll}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  <RefreshCw size={15} /> Re-compress with new settings
                </button>
              )}
              {images.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  <X size={15} /> Clear all
                </button>
              )}
            </div>

            {/* ── Stats Grid ── */}
            {allDone && images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Layers size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{images.length}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Images</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><HardDrive size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{formatBytes(totalOriginal)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Original Size</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-green-500 mb-1"><Zap size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{formatBytes(totalSaved)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Total Saved</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Percent size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{avgSavings}%</p>
                  <p className="text-xs text-gray-500 mt-0.5">Avg Reduction</p>
                </div>
              </div>
            )}

            {/* Download All Bar */}
            {allDone && images.length > 1 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-green-700 font-medium">
                  {images.length} images compressed — Saved {formatBytes(totalSaved)} total
                </span>
                <button
                  onClick={() => {
                    images.forEach((img) => {
                      if (img.compressedUrl) {
                        const a = document.createElement("a");
                        a.href = img.compressedUrl;
                        a.download = img.downloadName || `compressed-${img.name}`;
                        a.click();
                      }
                    });
                  }}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <Download size={15} /> Download All
                </button>
              </div>
            )}
          </div>

          {/* ── Image List ── */}
          <div className="space-y-4 mb-8">
            {images.map((img) => (
              <ImageItem key={img.id} item={img} onRemove={removeImage} />
            ))}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Image Compressor for Website Optimization — No Server Upload
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Large images are the number one reason websites load slowly. A single 5MB photo can add several seconds to your page load time, especially on mobile. Our free image compressor solves this by reducing JPG, PNG, and WebP file sizes by up to <strong>90%</strong> — all inside your browser without uploading to any server.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Unlike other tools that upload your photos to a remote server for processing, our compressor uses the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">browser-image-compression</code> library to do everything locally. This means your images are <strong>100% private</strong> — they never leave your device. This is especially important for sensitive photos, client work, and confidential business images.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You can also convert between formats while compressing. Converting PNG to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">WebP</code> alone saves 25-35% on file size at identical visual quality, and WebP is now supported by Chrome, Firefox, Safari, and Edge.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Reduce Image File Size for Email Attachment Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Drag and drop your images into the upload area or click to browse files.</li>
              <li>Choose a quality preset — <strong>Balanced (80%)</strong> works best for most uses.</li>
              <li>Set max dimension (e.g., 1200px for email, 1920px for web) and output format.</li>
              <li>Wait for compression to finish — each image shows original vs compressed side by side.</li>
              <li>Click <strong>Download</strong> on each image or <strong>Download All</strong> to save everything at once.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Compress High Resolution Photos for Web — Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "100% Browser-Based Privacy", desc: "No images are uploaded to any server. All compression happens locally in your browser using JavaScript. Your photos stay on your device at all times." },
                { title: "Batch Compress Up to 10 Images", desc: "Upload multiple images at once and compress them all simultaneously with the same quality and dimension settings. Download individually or all at once." },
                { title: "Format Conversion While Compressing", desc: "Convert PNG to WebP, JPG to WebP, or any combination while compressing. WebP produces files 25-35% smaller than JPEG at the same visual quality." },
                { title: "Visual Before/After Comparison", desc: "See original and compressed images side by side with exact file sizes and percentage saved. Know exactly what you are getting before downloading." }
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
              Image Compressor – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to compress image without losing quality online for free?",
                  a: "Upload your image to our tool and select the Maximum (92%) or Balanced (80%) quality preset. The tool compresses the image in your browser without uploading to any server, preserving visual quality while reducing file size significantly."
                },
                {
                  q: "Does this image compressor upload my photos to a server?",
                  a: "No. Our tool works 100% in your browser using JavaScript. Your images never leave your device. No data is uploaded, stored, or sent to any server."
                },
                {
                  q: "How to reduce JPG file size for WhatsApp without losing quality?",
                  a: "Upload your JPG photo, select Balanced (80%) quality and 1200px max dimension, then compress and download. The result will be a much smaller file that WhatsApp sends instantly without visible quality loss."
                },
                {
                  q: "Can I batch compress multiple images at once for free?",
                  a: "Yes. You can upload up to 10 images at once and they will all be compressed simultaneously with the same quality and dimension settings. Use the Download All button to save them all at once."
                },
                {
                  q: "How to compress PNG to WebP for faster website loading?",
                  a: "Upload your PNG images, select WebP as the output format, choose Balanced or Aggressive quality, and compress. WebP produces files 25-35% smaller than PNG at the same visual quality and is supported by all modern browsers."
                },
                {
                  q: "How much can I reduce image file size?",
                  a: "Depending on the original image and settings, you can reduce file size by 50-90%. Most photos compress 60-80% with the Balanced (80%) preset while maintaining excellent visual quality."
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
                { to: "/tools/image-resizer", title: "Image Resizer", desc: "Resize photos to exact dimensions for any platform." },
                { to: "/tools/image-cropper", title: "Image Cropper", desc: "Crop images with custom aspect ratios for social media." },
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

export default ImageCompressor;