import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Copy, RefreshCw, Upload, Download, Crop as CropIcon, RotateCcw, RotateCw, Image as ImageIcon, Home, ChevronDown, Ruler, FileImage, RotateCwIcon } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth, mediaHeight
  );
}

// ─── Presets ──────────────────────────────────────────────────────────────────
const SOCIAL_PRESETS = [
  { label: "Free",            aspect: null,     },
  { label: "Square 1:1",      aspect: 1,        },
  { label: "Instagram Post",  aspect: 1,        },
  { label: "Instagram Story", aspect: 9 / 16,   },
  { label: "TikTok",          aspect: 9 / 16,   },
  { label: "YouTube Thumb",   aspect: 16 / 9,   },
  { label: "Twitter Header",  aspect: 3 / 1,    },
  { label: "Facebook Cover",  aspect: 205 / 78, },
  { label: "WhatsApp DP",     aspect: 1,        },
  { label: "Landscape 16:9",  aspect: 16 / 9,   },
  { label: "Classic 4:3",     aspect: 4 / 3,    },
  { label: "Photo 3:2",       aspect: 3 / 2,    },
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
  const [openFaq, setOpenFaq]             = useState(null);

  const imgRef           = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileInputRef     = useRef(null);

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

    const image  = imgRef.current;
    const canvas = previewCanvasRef.current;
    const scaleX = image.naturalWidth  / image.width;
    const scaleY = image.naturalHeight / image.height;

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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Crop Image to 1:1 for Instagram Profile Picture Online – Free Aspect Ratio Tool",
    "url": "https://www.generatorpromptai.com/tools/image-cropper",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online image cropper with social media presets. Crop to 1:1 for Instagram, 9:16 for TikTok, 16:9 for YouTube thumbnails. Rotate, preview and download as JPG, PNG or WebP. No server upload.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Image Cropper", "item": "https://www.generatorpromptai.com/tools/image-cropper" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to crop image to 1:1 for Instagram profile picture online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your photo, click the Instagram Post or Square 1:1 preset, then drag to adjust the crop area. The tool locks the 1:1 aspect ratio automatically so your profile picture fits perfectly. Download as JPG, PNG or WebP."
        }
      },
      {
        "@type": "Question",
        "name": "What aspect ratio for YouTube thumbnail 1280x720?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "YouTube thumbnails use 16:9 aspect ratio at 1280x720 pixels. Select the YouTube Thumb preset in our tool and it automatically sets the correct 16:9 crop ratio."
        }
      },
      {
        "@type": "Question",
        "name": "How to crop image to 9:16 for TikTok video cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your image, click the TikTok preset (9:16), and drag to position the crop area. The 9:16 vertical ratio matches TikTok's full-screen format perfectly."
        }
      },
      {
        "@type": "Question",
        "name": "Can I crop and rotate image at the same time online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Use the rotate buttons to turn your image 90 degrees left or right, then drag the crop handles to select the area. Both rotation and cropping happen in real-time with a live preview."
        }
      },
      {
        "@type": "Question",
        "name": "Does this image cropper upload my photos to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All cropping and rotation happens entirely in your browser using JavaScript and the HTML5 Canvas API. Your images are never uploaded, stored, or sent to any server."
        }
      },
      {
        "@type": "Question",
        "name": "How to crop WhatsApp profile picture to square without cutting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your photo and select the WhatsApp DP preset (1:1 square). Position the crop box over the area you want to keep — the face should be centered. Download and set as your WhatsApp profile picture."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Crop Image to 1:1 for Instagram Profile Picture Online – Free Aspect Ratio Tool</title>

        <meta
          name="description"
          content="Free online image cropper with social media presets. Crop to 1:1 for Instagram, 9:16 for TikTok, 16:9 for YouTube thumbnails. Rotate, preview and download as JPG, PNG or WebP. No server upload."
        />

        <meta
          name="keywords"
          content="how to crop image to 1 1 for instagram profile picture online, what aspect ratio for youtube thumbnail 1280x720, crop image to 9 16 for tiktok video cover free, crop whatsapp profile picture to square online, free image cropper with custom aspect ratio no upload, crop photo for instagram story without app, online image cropper with rotate and preview, crop image for facebook cover photo size, crop to specific aspect ratio online free tool, best free online image cropper for social media 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/image-cropper" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Crop Image to 1:1 for Instagram Profile Picture Online – Free Tool" />
        <meta property="og:description" content="Free image cropper with Instagram, TikTok, YouTube presets. Crop, rotate, preview and download. No server upload." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/image-cropper" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Cropper – 1:1 Instagram, 9:16 TikTok, 16:9 YouTube" />
        <meta name="twitter:description" content="Crop images online with social media aspect ratio presets. Rotate, preview, download. No server upload." />

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
              <li><span className="text-gray-900 font-semibold">Image Cropper</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <CropIcon className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Crop Image to 1:1 for Instagram Profile Picture Online –{" "}
              <span className="text-sky-600">Free Aspect Ratio Tool</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Crop photos to any aspect ratio with social media presets for Instagram, TikTok, YouTube and more. Rotate, preview and download as JPG, PNG or WebP.
            </p>
          </div>

          {/* ── Upload State ── */}
          {!imgSrc ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
              <div
                className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
                  isDragging ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-sky-50/30"
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
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-sky-600" size={28} />
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">Drop image here or click to upload</p>
                <p className="text-gray-400 text-sm">JPG, PNG, WebP supported</p>
                {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-5">

              {/* ── Social Media Presets ── */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Social Media Presets</label>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                        activePreset === preset.label
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Crop + Preview Grid ── */}
              <div className="grid lg:grid-cols-2 gap-5">

                {/* Left: Crop Canvas */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                      <CropIcon size={16} className="text-sky-600" /> Drag to crop
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rotate(-90)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Rotate 90 degrees left"
                      >
                        <RotateCcw size={15} />
                      </button>
                      <span className="text-xs text-gray-400">{rotation}deg</span>
                      <button
                        onClick={() => rotate(90)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Rotate 90 degrees right"
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

                  {completedCrop && (
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Selection: <strong className="text-gray-600">{cropPxW} x {cropPxH} px</strong>
                      {activePreset !== "Free" && <span className="ml-2 text-sky-500">({activePreset})</span>}
                    </p>
                  )}
                </div>

                {/* Right: Preview + Settings */}
                <div className="space-y-4">

                  {/* Preview */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                      <ImageIcon size={15} className="text-sky-600" /> Preview
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

                  {/* Stats Grid */}
                  {completedCrop && (
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                        <div className="flex justify-center text-sky-500 mb-1"><Ruler size={16} /></div>
                        <p className="text-sm font-bold text-gray-800">{cropPxW}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Width</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                        <div className="flex justify-center text-sky-500 mb-1"><Ruler size={16} /></div>
                        <p className="text-sm font-bold text-gray-800">{cropPxH}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Height</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                        <div className="flex justify-center text-sky-500 mb-1"><FileImage size={16} /></div>
                        <p className="text-sm font-bold text-gray-800">{FORMAT_OPTIONS.find((f) => f.value === outputFormat)?.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Format</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                        <div className="flex justify-center text-sky-500 mb-1"><RotateCwIcon size={16} /></div>
                        <p className="text-sm font-bold text-gray-800">{rotation}deg</p>
                        <p className="text-xs text-gray-500 mt-0.5">Rotation</p>
                      </div>
                    </div>
                  )}

                  {/* Output Settings */}
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Output Settings</label>

                    {/* Format */}
                    <div className="mb-4">
                      <div className="flex gap-2">
                        {FORMAT_OPTIONS.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => setOutputFormat(f.value)}
                            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                              outputFormat === f.value
                                ? "bg-sky-600 text-white border-sky-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality */}
                    {outputFormat !== "image/png" && (
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

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleDownload}
                        disabled={!completedCrop}
                        className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        <Download size={17} /> Crop and Download
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                        >
                          <Upload size={14} /> New Image
                        </button>
                        <button
                          onClick={reset}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
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

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Image Cropper for Social Media – No App or Software Needed
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Cropping photos for social media should not require downloading an app or learning Photoshop. Our free image cropper works directly in your browser — upload a photo, pick a preset like Instagram Post (1:1) or TikTok (9:16), drag to adjust the crop area, and download. The rule-of-thirds grid overlay helps you compose visually balanced images.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Everything runs locally in your browser using the HTML5 Canvas API. Your images are <strong>never uploaded to any server</strong>, making this tool safe for private photos, client work, and confidential business images.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Aspect ratios for every platform</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>Instagram Post / WhatsApp DP:</strong> 1:1 square</li>
              <li><strong>Instagram Story / TikTok / Reels:</strong> 9:16 vertical</li>
              <li><strong>YouTube Thumbnail:</strong> 16:9 landscape (1280x720px)</li>
              <li><strong>Twitter / X Header:</strong> 3:1 wide banner</li>
              <li><strong>Facebook Cover:</strong> approximately 2.6:1</li>
              <li><strong>Classic Photo / Landscape:</strong> 3:2 and 4:3</li>
            </ul>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Crop WhatsApp Profile Picture to Square Online
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Click <strong>Upload</strong> or drag and drop your photo into the tool.</li>
              <li>Click the <strong>WhatsApp DP</strong> or <strong>Square 1:1</strong> preset to lock the aspect ratio.</li>
              <li>Drag the crop handles to center your face in the square area.</li>
              <li>Use the <strong>rotate buttons</strong> if your photo is sideways.</li>
              <li>Choose output format (JPG recommended for profile pictures) and click <strong>Crop and Download</strong>.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Crop Photo for Instagram Story Without App – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "12 Social Media Presets", desc: "One-click presets for Instagram Post, Instagram Story, TikTok, YouTube Thumbnail, Twitter Header, Facebook Cover, WhatsApp DP, and common photo ratios." },
                { title: "Live Crop Preview", desc: "See a real-time preview of your cropped image as you drag the crop handles. No guessing — what you see is exactly what you download." },
                { title: "Rotate and Crop Together", desc: "Rotate your image 90 degrees left or right and then crop. Both operations work together with instant visual feedback." },
                { title: "100% Private — No Upload", desc: "All cropping and rotation uses the HTML5 Canvas API in your browser. Your images are never sent to any server, ever." }
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
              Image Cropper – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to crop image to 1:1 for Instagram profile picture online?",
                  a: "Upload your photo, click the Instagram Post or Square 1:1 preset, then drag to adjust the crop area. The tool locks the 1:1 aspect ratio automatically so your profile picture fits perfectly. Download as JPG, PNG or WebP."
                },
                {
                  q: "What aspect ratio for YouTube thumbnail 1280x720?",
                  a: "YouTube thumbnails use 16:9 aspect ratio at 1280x720 pixels. Select the YouTube Thumb preset in our tool and it automatically sets the correct 16:9 crop ratio."
                },
                {
                  q: "How to crop image to 9:16 for TikTok video cover?",
                  a: "Upload your image, click the TikTok preset (9:16), and drag to position the crop area. The 9:16 vertical ratio matches TikTok's full-screen format perfectly."
                },
                {
                  q: "Can I crop and rotate image at the same time online?",
                  a: "Yes. Use the rotate buttons to turn your image 90 degrees left or right, then drag the crop handles to select the area. Both rotation and cropping happen in real-time with a live preview."
                },
                {
                  q: "Does this image cropper upload my photos to a server?",
                  a: "No. All cropping and rotation happens entirely in your browser using JavaScript and the HTML5 Canvas API. Your images are never uploaded, stored, or sent to any server."
                },
                {
                  q: "How to crop WhatsApp profile picture to square without cutting?",
                  a: "Upload your photo and select the WhatsApp DP preset (1:1 square). Position the crop box over the area you want to keep — the face should be centered. Download and set as your WhatsApp profile picture."
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
                { to: "/tools/image-resizer",    title: "Image Resizer",    desc: "Resize images to exact pixel dimensions for any platform." },
                { to: "/tools/image-converter",  title: "Image Converter",  desc: "Convert between JPG, PNG and WebP formats instantly." }
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

export default ImageCropper;