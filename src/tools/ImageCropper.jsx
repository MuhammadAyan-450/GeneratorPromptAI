// pages/ImageCropper.jsx
import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  ArrowLeft, Upload, Download, Crop as CropIcon,
  RefreshCw, RotateCcw, RotateCw, Shield, Image as ImageIcon
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth, mediaHeight
  );
}

// ─── Presets ──────────────────────────────────────────────────────────────────
const SOCIAL_PRESETS = [
  { label: "Free",              aspect: null,        icon: "✂️" },
  { label: "Square 1:1",        aspect: 1,           icon: "⬜" },
  { label: "Instagram Post",    aspect: 1,           icon: "📸" },
  { label: "Instagram Story",   aspect: 9 / 16,      icon: "📱" },
  { label: "TikTok",            aspect: 9 / 16,      icon: "🎵" },
  { label: "YouTube Thumb",     aspect: 16 / 9,      icon: "▶️" },
  { label: "Twitter Header",    aspect: 3 / 1,       icon: "𝕏" },
  { label: "Facebook Cover",    aspect: 205 / 78,    icon: "👤" },
  { label: "WhatsApp DP",       aspect: 1,           icon: "💬" },
  { label: "Landscape 16:9",    aspect: 16 / 9,      icon: "🖥️" },
  { label: "Classic 4:3",       aspect: 4 / 3,       icon: "📷" },
  { label: "Photo 3:2",         aspect: 3 / 2,       icon: "🖼️" },
];

const FORMAT_OPTIONS = [
  { value: "image/jpeg", label: "JPG",  ext: "jpg"  },
  { value: "image/png",  label: "PNG",  ext: "png"  },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const ImageCropper = () => {
  const [imgSrc, setImgSrc]               = useState("");
  const [crop, setCrop]                   = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [activePreset, setActivePreset]   = useState("Free");
  const [aspectRatio, setAspectRatio]     = useState(null);
  const [rotation, setRotation]           = useState(0);
  const [outputFormat, setOutputFormat]   = useState("image/jpeg");
  const [quality, setQuality]             = useState(0.92);
  const [isDragging, setIsDragging]       = useState(false);
  const [error, setError]                 = useState(null);

  const imgRef          = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef    = useRef(null);

  const onSelectFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
    reader.readAsDataURL(file);
    setCompletedCrop(null);
    setRotation(0);
  };

  const onImageLoad = useCallback((e) => {
    if (aspectRatio) {
      const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
      setCrop(centerAspectCrop(w, h, aspectRatio));
    }
  }, [aspectRatio]);

  const applyPreset = (preset) => {
    setActivePreset(preset.label);
    setAspectRatio(preset.aspect);
    if (imgRef.current && preset.aspect) {
      const { naturalWidth: w, naturalHeight: h } = imgRef.current;
      setCrop(centerAspectCrop(w, h, preset.aspect));
    }
  };

  const rotate = (deg) => setRotation((r) => (r + deg + 360) % 360);

  const getCroppedDataUrl = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return null;

    const image   = imgRef.current;
    const canvas  = previewCanvasRef.current;
    const scaleX  = image.naturalWidth  / image.width;
    const scaleY  = image.naturalHeight / image.height;

    // Rotation support
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));

    const srcW = completedCrop.width  * scaleX;
    const srcH = completedCrop.height * scaleY;

    canvas.width  = srcW * cos + srcH * sin;
    canvas.height = srcW * sin + srcH * cos;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      srcW, srcH,
      -srcW / 2, -srcH / 2,
      srcW, srcH
    );

    return canvas.toDataURL(outputFormat, quality);
  }, [completedCrop, rotation, outputFormat, quality]);

  const handleDownload = () => {
    const dataUrl = getCroppedDataUrl();
    if (!dataUrl) return;
    const ext  = FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.ext || "jpg";
    const link = document.createElement("a");
    link.download = `cropped-${Date.now()}.${ext}`;
    link.href = dataUrl;
    link.click();
  };

  const reset = () => {
    setImgSrc(""); setCrop(undefined); setCompletedCrop(null);
    setError(null); setAspectRatio(null); setActivePreset("Free"); setRotation(0);
  };

  // Live preview update
  const onCropComplete = (c) => {
    setCompletedCrop(c);
    setTimeout(() => getCroppedDataUrl(), 0);
  };

  const cropPxW = completedCrop && imgRef.current
    ? Math.round(completedCrop.width  * (imgRef.current.naturalWidth  / imgRef.current.width))
    : 0;
  const cropPxH = completedCrop && imgRef.current
    ? Math.round(completedCrop.height * (imgRef.current.naturalHeight / imgRef.current.height))
    : 0;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Cropper",
    url: "https://www.generatorpromptai.com/tools/image-cropper",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free online image cropper with social media presets for Instagram, TikTok, YouTube, Twitter and more. Crop JPG, PNG and WebP images with custom aspect ratios.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What aspect ratio should I use for Instagram posts?",
        acceptedAnswer: { "@type": "Answer", text: "Use 1:1 (square) for standard Instagram posts. For portrait posts that take up more screen space, use 4:5. For Instagram Stories and Reels, use 9:16." },
      },
      {
        "@type": "Question",
        name: "What size should a YouTube thumbnail be?",
        acceptedAnswer: { "@type": "Answer", text: "YouTube thumbnails should be 16:9 aspect ratio, ideally 1280x720 pixels. Our YouTube Thumbnail preset sets the 16:9 ratio automatically." },
      },
      {
        "@type": "Question",
        name: "Does this image cropper upload my photos?",
        acceptedAnswer: { "@type": "Answer", text: "No. All cropping happens entirely in your browser. Your images are never uploaded to any server — 100% private." },
      },
      {
        "@type": "Question",
        name: "Can I crop and rotate at the same time?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Use the rotation buttons to rotate your image 90 degrees left or right, then use the crop tool to select the area you want." },
      },
      {
        "@type": "Question",
        name: "What image formats are supported?",
        acceptedAnswer: { "@type": "Answer", text: "Our image cropper supports JPG, PNG and WebP as input formats. You can also choose to download the cropped image as JPG, PNG or WebP." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Image Cropper - Free Online Crop Tool with Instagram, TikTok & YouTube Presets</title>
        <meta
          name="description"
          content="Free online image cropper with social media presets for Instagram, TikTok, YouTube, Twitter and WhatsApp. Crop JPG, PNG and WebP images with custom aspect ratios. 100% private, no upload."
        />
        <meta
          name="keywords"
          content="image cropper, crop image online, instagram image cropper, tiktok crop tool, youtube thumbnail crop, custom aspect ratio crop, free image cropper, profile picture cropper, crop photo free 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/image-cropper" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Image Cropper - Crop Photos for Instagram, TikTok & YouTube Free" />
        <meta property="og:description" content="Crop images online with social media presets. Instagram, TikTok, YouTube, Twitter, WhatsApp. Download as JPG, PNG or WebP. 100% private." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/image-cropper" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-image-cropper.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Cropper - Instagram, TikTok, YouTube Presets" />
        <meta name="twitter:description" content="Crop photos online with social media aspect ratio presets. Free, private, no sign-up." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-image-cropper.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 mb-4">
              <CropIcon className="text-purple-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Image Cropper</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Crop photos for Instagram, TikTok, YouTube, Twitter and more. Custom aspect ratios. Download as JPG, PNG or WebP.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> 100% private — images never leave your browser
            </div>
          </div>

          {/* Upload State */}
          {!imgSrc ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all mb-8 ${
                isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/20"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); onSelectFile(e.dataTransfer.files?.[0]); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onSelectFile(e.target.files?.[0])}
                className="hidden"
              />
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-purple-600" size={28} />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">Drop image here or click to upload</p>
              <p className="text-gray-400 text-sm">JPG, PNG, WebP supported</p>
              {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
            </div>
          ) : (
            <div className="space-y-5">

              {/* Social Media Presets */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Social Media Presets</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                        activePreset === preset.label
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
                      }`}
                    >
                      {preset.icon} {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop + Preview */}
              <div className="grid lg:grid-cols-2 gap-5">

                {/* Left: Crop canvas */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                      <CropIcon size={16} className="text-purple-600" /> Drag to crop
                    </h3>
                    {/* Rotation */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rotate(-90)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Rotate 90° left"
                      >
                        <RotateCcw size={15} />
                      </button>
                      <span className="text-xs text-gray-400">{rotation}°</span>
                      <button
                        onClick={() => rotate(90)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Rotate 90° right"
                      >
                        <RotateCw size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <div style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.3s" }}>
                      <ReactCrop
                        crop={crop}
                        onChange={(_, pct) => setCrop(pct)}
                        onComplete={onCropComplete}
                        ruleOfThirds
                        aspect={aspectRatio ?? undefined}
                        minWidth={40}
                        minHeight={40}
                      >
                        <img
                          ref={imgRef}
                          src={imgSrc}
                          onLoad={onImageLoad}
                          alt="Image to crop"
                          className="w-full max-h-[480px] object-contain"
                        />
                      </ReactCrop>
                    </div>
                  </div>

                  {/* Crop size info */}
                  {completedCrop && (
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Selection: <strong className="text-gray-600">{cropPxW} × {cropPxH} px</strong>
                      {activePreset !== "Free" && <span className="ml-2 text-purple-500">({activePreset})</span>}
                    </p>
                  )}
                </div>

                {/* Right: Preview + Settings */}
                <div className="space-y-4">

                  {/* Preview */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                      <ImageIcon size={15} className="text-purple-600" /> Preview
                    </h3>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 min-h-[200px] flex items-center justify-center p-3">
                      {completedCrop ? (
                        <canvas
                          ref={previewCanvasRef}
                          className="max-w-full max-h-[280px] object-contain rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="text-center text-gray-300">
                          <CropIcon size={36} className="mx-auto mb-2" />
                          <p className="text-sm">Crop box preview appears here</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Output Settings */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-800 text-sm mb-3">Output Settings</h3>

                    {/* Format */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Format</label>
                      <div className="flex gap-2">
                        {FORMAT_OPTIONS.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => setOutputFormat(f.value)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                              outputFormat === f.value
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality (only for JPG/WebP) */}
                    {outputFormat !== "image/png" && (
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Quality — <span className="text-purple-600">{Math.round(quality * 100)}%</span>
                        </label>
                        <input
                          type="range" min="0.5" max="1.0" step="0.01"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full accent-purple-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Smaller file</span><span>Best quality</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleDownload}
                        disabled={!completedCrop}
                        className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        <Download size={17} /> Crop &amp; Download
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                        >
                          <Upload size={14} /> New Image
                        </button>
                        <button
                          onClick={reset}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                        >
                          <RefreshCw size={14} /> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Image Cropper — Social Media Presets &amp; Custom Ratios
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free image cropper lets you crop photos to any aspect ratio instantly — no software needed. Choose from 12 social media presets including Instagram Post (1:1), Instagram Story (9:16), TikTok (9:16), YouTube Thumbnail (16:9), Twitter Header (3:1), and WhatsApp DP (1:1).
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              All cropping happens in your browser — images are never uploaded to any server. Download your cropped image as JPG, PNG, or WebP with adjustable quality. The rule-of-thirds grid helps you compose better photos.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect aspect ratios for every platform</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>Instagram Post:</strong> 1:1 square or 4:5 portrait</li>
              <li><strong>Instagram Story / TikTok / Reels:</strong> 9:16 vertical</li>
              <li><strong>YouTube Thumbnail:</strong> 16:9 landscape (1280×720px)</li>
              <li><strong>Twitter / X Header:</strong> 3:1 wide banner</li>
              <li><strong>Facebook Cover:</strong> ~2.6:1 wide</li>
              <li><strong>WhatsApp / Profile picture:</strong> 1:1 square</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "What aspect ratio should I use for Instagram posts?", a: "Use 1:1 (square) for standard Instagram posts. For Stories and Reels, use 9:16 vertical. Our Instagram presets set these ratios automatically." },
                { q: "What size should a YouTube thumbnail be?", a: "YouTube thumbnails use a 16:9 aspect ratio, ideally 1280×720 pixels. Select the YouTube Thumbnail preset and our tool sets the correct ratio automatically." },
                { q: "Does this tool upload my images?", a: "No. All cropping happens entirely in your browser using JavaScript. Your images are never sent to any server — 100% private and secure." },
                { q: "Can I rotate and crop at the same time?", a: "Yes. Use the rotation buttons (↺ ↻) to rotate 90° left or right, then drag the crop box to select the area you want." },
                { q: "What output formats are available?", a: "You can download the cropped image as JPG (smallest file, best for photos), PNG (lossless, best for graphics), or WebP (best compression, modern browsers)." },
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
                { to: "/tools/image-resizer",    title: "Image Resizer",    desc: "Resize images to exact pixel dimensions for any platform." },
                { to: "/tools/image-converter",  title: "Image Converter",  desc: "Convert between JPG, PNG and WebP formats instantly." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-purple-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-purple-600 transition-colors">{tool.title}</h3>
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

export default ImageCropper;