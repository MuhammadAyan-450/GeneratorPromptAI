// pages/ImageCompressor.jsx
import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Upload, Download, Image as ImageIcon, AlertCircle, RefreshCw, Shield, Zap, X } from "lucide-react";

const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const QUALITY_PRESETS = [
  { label: "Maximum",     value: 0.92, desc: "Best quality, larger file" },
  { label: "Balanced",    value: 0.80, desc: "Great quality, good savings" },
  { label: "Aggressive",  value: 0.65, desc: "Smaller file, slight loss" },
  { label: "Minimum",     value: 0.50, desc: "Smallest size, visible loss" },
];

const DIMENSION_OPTIONS = [
  { label: "1200px (Social media)",  value: 1200 },
  { label: "1600px",                 value: 1600 },
  { label: "1920px (Full HD)",       value: 1920 },
  { label: "2560px (2K)",            value: 2560 },
  { label: "3840px (4K)",            value: 3840 },
  { label: "Original size",          value: 9999 },
];

const FORMAT_OPTIONS = [
  { label: "Keep original",  value: "original" },
  { label: "Convert to WebP (best compression)", value: "image/webp" },
  { label: "Convert to JPEG",value: "image/jpeg" },
  { label: "Convert to PNG", value: "image/png"  },
];

// ─── Single Image Item ────────────────────────────────────────────────────────
const ImageItem = ({ item, onRemove }) => {
  const savings = item.originalSize > 0 && item.compressedSize > 0
    ? Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
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
              {/* Size bar */}
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
  const [images, setImages]           = useState([]);
  const [quality, setQuality]         = useState(0.80);
  const [maxDimension, setMaxDimension] = useState(1920);
  const [outputFormat, setOutputFormat] = useState("original");
  const [isDragging, setIsDragging]   = useState(false);
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
      id:            Math.random().toString(36).slice(2),
      name:          file.name,
      originalUrl:   URL.createObjectURL(file),
      originalSize:  file.size,
      compressedUrl: null,
      compressedSize: 0,
      loading:       true,
      error:         null,
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
  const clearAll    = () => setImages([]);

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const totalSaved = images.reduce((acc, img) => acc + Math.max(0, img.originalSize - img.compressedSize), 0);
  const allDone    = images.length > 0 && images.every((img) => !img.loading);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Compressor",
    url: "https://generatorpromptai.com/tools/image-compressor",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free browser-based image compressor. Compress JPG, PNG and WebP images online without uploading to any server. 100% private.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does this image compressor upload my images to a server?",
        acceptedAnswer: { "@type": "Answer", text: "No. Our image compressor works entirely in your browser. Your images are never uploaded to any server, making it 100% private and secure." },
      },
      {
        "@type": "Question",
        name: "What image formats are supported?",
        acceptedAnswer: { "@type": "Answer", text: "Our tool supports JPG, PNG, and WebP image formats. You can also convert between formats while compressing." },
      },
      {
        "@type": "Question",
        name: "Can I compress multiple images at once?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. You can upload up to 10 images at once and compress them all simultaneously with the same settings." },
      },
      {
        "@type": "Question",
        name: "How much can I reduce image file size?",
        acceptedAnswer: { "@type": "Answer", text: "Depending on the original image and quality settings, our tool can reduce file size by 50–90% while maintaining good visual quality." },
      },
      {
        "@type": "Question",
        name: "What quality setting should I use?",
        acceptedAnswer: { "@type": "Answer", text: "For most uses (social media, web, WhatsApp), the Balanced preset (80%) works great. For websites needing maximum performance, use Aggressive (65%). For professional use, use Maximum (92%)." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Image Compressor - Compress JPG PNG WebP Online Free | No Upload Needed</title>
        <meta
          name="description"
          content="Free online image compressor — compress JPG, PNG and WebP images instantly in your browser. Reduce image size by up to 90% with no quality loss. Batch compress up to 10 images. 100% private, no upload."
        />
        <meta
          name="keywords"
          content="image compressor, compress image online, compress jpg, compress png, compress webp, reduce image size, photo compressor, image optimizer, batch image compressor, free image compression 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/image-compressor" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Image Compressor - Compress JPG PNG WebP Free Online" />
        <meta property="og:description" content="Compress images online for free. Reduce size by up to 90%. Batch compress up to 10 images. 100% private — no upload to server." />
        <meta property="og:url" content="https://generatorpromptai.com/tools/image-compressor" />
        <meta property="og:image" content="https://generatorpromptai.com/og-image-compressor.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Compressor - Compress JPG PNG WebP Online" />
        <meta name="twitter:description" content="Compress images online. Reduce size up to 90%. Batch up to 10 images. 100% private, no server upload." />
        <meta name="twitter:image" content="https://generatorpromptai.com/og-image-compressor.png" />

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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <ImageIcon className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Image Compressor</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Compress JPG, PNG and WebP images online. Up to 90% smaller. Batch compress up to 10 images.
            </p>
            {/* Privacy Badge */}
            <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> 100% private — images never leave your browser
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-5">

            {/* Quality Presets */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quality Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUALITY_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setQuality(preset.value)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${
                      quality === preset.value
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 text-gray-600 hover:border-sky-300"
                    }`}
                  >
                    <span className="text-sm font-medium">{preset.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{preset.desc}</span>
                  </button>
                ))}
              </div>
              {/* Fine-tune slider */}
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
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Dimension</label>
                <select
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-800"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-800"
                >
                  {FORMAT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Re-compress button */}
            {images.length > 0 && (
              <button
                onClick={recompressAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                <RefreshCw size={15} /> Re-compress with new settings
              </button>
            )}
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
              isDragging ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-sky-50/30"
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
            <p className="text-gray-400 text-sm">JPG, PNG, WebP · Up to 10 images at once</p>
          </div>

          {/* Stats bar */}
          {allDone && images.length > 1 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 mb-5 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2 text-green-700">
                <Zap size={18} />
                <span className="font-semibold text-sm">{images.length} images compressed</span>
              </div>
              <div className="text-sm text-green-700">
                Total saved: <strong>{formatBytes(totalSaved)}</strong>
              </div>
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
                className="ml-auto inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Download size={15} /> Download All
              </button>
            </div>
          )}

          {/* Clear all */}
          {images.length > 0 && (
            <div className="flex justify-end mb-4">
              <button onClick={clearAll} className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                <X size={14} /> Clear all
              </button>
            </div>
          )}

          {/* Image List */}
          <div className="space-y-4">
            {images.map((img) => (
              <ImageItem key={img.id} item={img} onRemove={removeImage} />
            ))}
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Image Compressor — Fast, Private &amp; Powerful
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free image compressor reduces JPG, PNG, and WebP file sizes by up to 90% — all inside your browser. No files are ever uploaded to any server, making it completely private and secure. Adjust quality, max dimensions, and even convert to WebP (the most efficient format) while compressing.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Perfect for compressing images before uploading to websites, sending on WhatsApp, posting to Instagram, or attaching to emails. Smaller images load faster, use less mobile data, and improve website performance.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Which quality setting should I use?</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li><strong>Maximum (92%)</strong> — Professional use, printing, archiving. Best quality, larger file.</li>
              <li><strong>Balanced (80%)</strong> — Social media, WhatsApp, email. Great quality with good savings.</li>
              <li><strong>Aggressive (65%)</strong> — Websites, fast loading. Smaller file with minimal visible loss.</li>
              <li><strong>Minimum (50%)</strong> — Thumbnails, previews. Smallest possible size.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why convert to WebP?</h3>
            <p className="text-gray-600 text-sm">
              WebP is Google's modern image format and produces files 25–35% smaller than JPEG and PNG at the same visual quality. It's supported by all modern browsers. Use the Output Format selector to convert your images to WebP while compressing.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Does this image compressor upload my images?", a: "No. Everything happens entirely in your browser using JavaScript. Your images are never sent to any server. They're 100% private and secure." },
                { q: "What formats are supported?", a: "JPG, PNG, and WebP. You can also convert between formats using the Output Format selector — for example, convert PNG to WebP for the best compression." },
                { q: "Can I compress multiple images at once?", a: "Yes. Upload up to 10 images at once and they'll all be compressed simultaneously. Use Download All to save them in one click." },
                { q: "How much can I reduce image file size?", a: "Between 50–90% depending on the original image and quality setting. Most photos compress 60–80% with Balanced quality (80%)." },
                { q: "What quality setting should I use?", a: "For social media and WhatsApp, use Balanced (80%). For websites needing fast loading, use Aggressive (65%). For professional photos, use Maximum (92%)." },
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
                { to: "/tools/image-resizer",   title: "Image Resizer",   desc: "Resize photos to exact dimensions for any platform." },
                { to: "/tools/image-cropper",   title: "Image Cropper",   desc: "Crop images with custom ratios for social media." },
                { to: "/tools/image-converter", title: "Image Converter", desc: "Convert JPG, PNG and WebP between formats instantly." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
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