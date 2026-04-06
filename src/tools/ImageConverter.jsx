// pages/ImageConverter.jsx
import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Upload, Download, Image as ImageIcon, RefreshCw, Shield, X, Zap } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getExt = (mime) => ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[mime] || "jpg");

const FORMATS = [
  { mime: "image/jpeg", label: "JPG",  desc: "Best for photos, small size" },
  { mime: "image/png",  label: "PNG",  desc: "Lossless, supports transparency" },
  { mime: "image/webp", label: "WebP", desc: "Smallest size, modern browsers" },
];

const QUICK_CONVERSIONS = [
  { label: "JPG → PNG",  from: "JPG/PNG/WebP", to: "image/png"  },
  { label: "JPG → WebP", from: "JPG/PNG/WebP", to: "image/webp" },
  { label: "PNG → JPG",  from: "JPG/PNG/WebP", to: "image/jpeg" },
  { label: "PNG → WebP", from: "JPG/PNG/WebP", to: "image/webp" },
  { label: "WebP → JPG", from: "JPG/PNG/WebP", to: "image/jpeg" },
  { label: "WebP → PNG", from: "JPG/PNG/WebP", to: "image/png"  },
];

// ─── Convert a single file using canvas ──────────────────────────────────────
function convertFile(file, toMime, quality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      // Fill white background for JPG (no transparency)
      if (toMime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const qual = toMime === "image/png" ? undefined : quality;
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Conversion failed")); return; }
        resolve({ blob, width: img.naturalWidth, height: img.naturalHeight });
      }, toMime, qual);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

// ─── Single Image Card ────────────────────────────────────────────────────────
const ImageCard = ({ item, onRemove }) => {
  const savings = item.originalSize > 0 && item.convertedSize > 0
    ? Math.round(((item.originalSize - item.convertedSize) / item.originalSize) * 100)
    : null;
  const bigger = savings !== null && savings < 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 min-w-0">
          <ImageIcon size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
          {item.width && <span className="text-xs text-gray-400 flex-shrink-0">{item.width}×{item.height}px</span>}
        </div>
        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors ml-3 flex-shrink-0">
          <X size={15} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Original */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original</span>
            <span className="text-xs font-medium text-gray-600">{formatBytes(item.originalSize)}</span>
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center h-44">
            <img src={item.originalUrl} alt="Original" className="max-h-44 max-w-full object-contain" />
          </div>
        </div>

        {/* Converted */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Converted → {getExt(item.toMime).toUpperCase()}
            </span>
            {item.convertedSize > 0 && (
              <span className={`text-xs font-medium ${bigger ? "text-orange-500" : "text-green-600"}`}>
                {formatBytes(item.convertedSize)}
                {savings !== null && savings !== 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${bigger ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                    {bigger ? `+${Math.abs(savings)}%` : `-${savings}%`}
                  </span>
                )}
              </span>
            )}
          </div>

          {item.loading ? (
            <div className="h-44 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-sky-200 border-t-sky-600 animate-spin mb-2" />
              <span className="text-xs text-sky-600">Converting...</span>
            </div>
          ) : item.error ? (
            <div className="h-44 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center p-4">
              <p className="text-red-500 text-xs text-center">{item.error}</p>
            </div>
          ) : item.convertedUrl ? (
            <>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center h-44">
                <img src={item.convertedUrl} alt="Converted" className="max-h-44 max-w-full object-contain" />
              </div>
              <a
                href={item.convertedUrl}
                download={`converted-${item.name.replace(/\.[^.]+$/, "")}.${getExt(item.toMime)}`}
                className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={14} /> Download {getExt(item.toMime).toUpperCase()}
              </a>
            </>
          ) : (
            <div className="h-44 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs">
              Waiting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ImageConverter = () => {
  const [images, setImages]         = useState([]);
  const [toFormat, setToFormat]     = useState("image/webp");
  const [quality, setQuality]       = useState(0.92);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Fixed: convert is now a stable function using latest state via params
  const runConvert = useCallback(async (id, file, mime, qual) => {
    try {
      const { blob, width, height } = await convertFile(file, mime, qual);
      const convertedUrl = URL.createObjectURL(blob);
      setImages((prev) => prev.map((img) => img.id === id
        ? { ...img, loading: false, convertedUrl, convertedSize: blob.size, width, height }
        : img
      ));
    } catch (err) {
      setImages((prev) => prev.map((img) => img.id === id
        ? { ...img, loading: false, error: err.message || "Conversion failed" }
        : img
      ));
    }
  }, []);

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 10);
    if (!valid.length) return;

    const newImages = valid.map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      convertedUrl: null,
      convertedSize: 0,
      toMime: toFormat,
      loading: true,
      error: null,
      width: null,
      height: null,
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img) => runConvert(img.id, img.file, toFormat, quality));
  };

  const reConvertAll = () => {
    setImages((prev) => prev.map((img) => ({ ...img, loading: true, convertedUrl: null, convertedSize: 0, error: null, toMime: toFormat })));
    images.forEach((img) => runConvert(img.id, img.file, toFormat, quality));
  };

  const removeImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));
  const clearAll    = () => setImages([]);

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const allDone     = images.length > 0 && images.every((img) => !img.loading);
  const totalSaved  = images.reduce((acc, img) => acc + Math.max(0, img.originalSize - img.convertedSize), 0);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Converter",
    url: "https://www.generatorpromptai.com/tools/image-converter",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free browser-based image converter. Convert JPG to PNG, PNG to WebP, WebP to JPG instantly. No upload, 100% private.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I convert JPG to PNG online?",
        acceptedAnswer: { "@type": "Answer", text: "Upload your JPG image, select PNG as the output format, and our tool instantly converts it in your browser. No upload to any server required." },
      },
      {
        "@type": "Question",
        name: "Does converting PNG to WebP reduce file size?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. WebP typically produces files 25–35% smaller than PNG and JPEG at equivalent visual quality, making it ideal for websites and apps." },
      },
      {
        "@type": "Question",
        name: "Will converting JPG to PNG improve image quality?",
        acceptedAnswer: { "@type": "Answer", text: "No. Converting JPG to PNG won't restore quality lost during JPEG compression. However, PNG will preserve the current quality without further loss and adds transparency support." },
      },
      {
        "@type": "Question",
        name: "Can I convert multiple images at once?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Upload up to 10 images at once and they'll all be converted to your chosen format simultaneously." },
      },
      {
        "@type": "Question",
        name: "Are my images uploaded to a server?",
        acceptedAnswer: { "@type": "Answer", text: "No. All conversion happens in your browser using the HTML5 Canvas API. Your images are never uploaded to any server." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Image Converter - Convert JPG to PNG, PNG to WebP, WebP to JPG Free Online</title>
        <meta
          name="description"
          content="Free online image converter — convert JPG to PNG, PNG to WebP, WebP to JPG instantly in your browser. Batch convert up to 10 images. 100% private, no server upload. No sign-up needed."
        />
        <meta
          name="keywords"
          content="image converter, jpg to png, png to jpg, jpg to webp, png to webp, webp to jpg, webp to png, convert image format online free, image format converter 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/image-converter" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Image Converter - JPG to PNG, PNG to WebP Free Online" />
        <meta property="og:description" content="Convert JPG, PNG and WebP images online for free. Batch convert up to 10 images. 100% private — no server upload." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/image-converter" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-image-converter.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Converter - JPG PNG WebP Online" />
        <meta name="twitter:description" content="Convert image formats online free. JPG to PNG, PNG to WebP, WebP to JPG. Batch up to 10. No server upload." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-image-converter.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100 mb-4">
              <ImageIcon className="text-teal-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Image Converter</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Convert JPG, PNG and WebP images instantly. Batch convert up to 10 images. Free &amp; private.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> 100% private — images never leave your browser
            </div>
          </div>

          {/* Quick Conversions */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">Quick Select</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_CONVERSIONS.map((qc) => (
                <button
                  key={qc.label}
                  onClick={() => setToFormat(qc.to)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    toFormat === qc.to
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"
                  }`}
                >
                  {qc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-5">

            {/* Format Buttons */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Output Format</label>
              <div className="grid grid-cols-3 gap-3">
                {FORMATS.map((f) => (
                  <button
                    key={f.mime}
                    onClick={() => setToFormat(f.mime)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${
                      toFormat === f.mime
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-gray-200 text-gray-600 hover:border-teal-300"
                    }`}
                  >
                    <span className="text-sm font-bold">{f.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality (only for JPG/WebP) */}
            {toFormat !== "image/png" && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-semibold text-gray-700 w-20 flex-shrink-0">Quality</span>
                <input
                  type="range" min="0.50" max="0.98" step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
                <span className="text-sm font-bold text-teal-600 w-10 text-right">{Math.round(quality * 100)}%</span>
              </div>
            )}

            {toFormat === "image/png" && (
              <p className="text-xs text-gray-400 mb-5">PNG is lossless — quality slider not applicable.</p>
            )}

            {/* Re-convert button */}
            {images.length > 0 && (
              <button
                onClick={reConvertAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                <RefreshCw size={15} /> Re-convert with new settings
              </button>
            )}
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
              isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400 hover:bg-teal-50/20"
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
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="text-teal-600" size={24} />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-1">Drop images here or click to upload</p>
            <p className="text-gray-400 text-sm">JPG, PNG, WebP · Up to 10 images</p>
          </div>

          {/* Batch Stats */}
          {allDone && images.length > 1 && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl px-6 py-4 mb-5 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-teal-700">
                <Zap size={16} />
                <span className="text-sm font-semibold">{images.length} images converted</span>
              </div>
              {totalSaved > 0 && (
                <span className="text-sm text-teal-700">Total saved: <strong>{formatBytes(totalSaved)}</strong></span>
              )}
              <button
                onClick={() => images.forEach((img) => {
                  if (!img.convertedUrl) return;
                  const a = document.createElement("a");
                  a.href = img.convertedUrl;
                  a.download = `converted-${img.name.replace(/\.[^.]+$/, "")}.${getExt(img.toMime)}`;
                  a.click();
                })}
                className="ml-auto inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Download size={14} /> Download All
              </button>
            </div>
          )}

          {/* Clear All */}
          {images.length > 0 && (
            <div className="flex justify-end mb-3">
              <button onClick={clearAll} className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                <X size={13} /> Clear all
              </button>
            </div>
          )}

          {/* Image Cards */}
          <div className="space-y-4">
            {images.map((img) => (
              <ImageCard key={img.id} item={img} onRemove={removeImage} />
            ))}
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Image Converter — JPG, PNG &amp; WebP Online
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free image converter lets you convert between JPG, PNG, and WebP formats instantly — all inside your browser. No files are ever uploaded to any server. Everything is processed locally using the HTML5 Canvas API, making it completely private and secure.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Upload up to 10 images at once for batch conversion. Adjust quality for JPG and WebP output. Re-convert with different settings without re-uploading. Download all converted images in one click.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">When to use each format</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li><strong>JPG</strong> — Best for photographs. Smaller size but lossy compression. No transparency support.</li>
              <li><strong>PNG</strong> — Lossless quality. Supports transparency (transparent backgrounds). Larger file size.</li>
              <li><strong>WebP</strong> — Google's modern format. 25–35% smaller than JPG/PNG at same quality. Best for websites.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Common conversions</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>JPG → PNG</strong> — Add transparency support or switch to lossless format</li>
              <li><strong>PNG → WebP</strong> — Reduce file size for faster website loading</li>
              <li><strong>JPG → WebP</strong> — Smaller photos for better web performance</li>
              <li><strong>WebP → JPG</strong> — Convert for older software or email attachments</li>
              <li><strong>WebP → PNG</strong> — Convert for editing in apps that don't support WebP</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How do I convert JPG to PNG online?", a: "Upload your JPG image, select PNG as the output format, and our tool converts it instantly in your browser. No server upload required." },
                { q: "Does converting PNG to WebP reduce file size?", a: "Yes. WebP produces files 25–35% smaller than PNG and JPEG at equivalent quality, making it ideal for websites and apps." },
                { q: "Will converting JPG to PNG improve quality?", a: "No. Converting JPG to PNG won't restore quality lost during JPEG compression. However, it will stop further quality loss and adds transparency support." },
                { q: "Can I convert multiple images at once?", a: "Yes. Upload up to 10 images at once and they'll all convert simultaneously. Use Download All to save them in one click." },
                { q: "Are my images uploaded to a server?", a: "No. All conversion happens in your browser using the HTML5 Canvas API. Your images never leave your device." },
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
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Reduce image size by up to 90% without quality loss." },
                { to: "/tools/image-resizer",    title: "Image Resizer",    desc: "Resize photos to exact pixel dimensions for any platform." },
                { to: "/tools/image-cropper",    title: "Image Cropper",    desc: "Crop images with custom aspect ratios for social media." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-teal-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-teal-600 transition-colors">{tool.title}</h3>
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

export default ImageConverter;