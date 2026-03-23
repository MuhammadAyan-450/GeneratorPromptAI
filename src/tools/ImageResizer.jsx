// pages/ImageResizer.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Upload, Download, Image as ImageIcon, Lock, Unlock, RefreshCw, AlertCircle } from "lucide-react";

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
  const [quality, setQuality] = useState(0.92);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const formatBytes = (bytes) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savingsPercent = originalSize > 0 && resizedSize > 0
    ? Math.round(((originalSize - resizedSize) / originalSize) * 100)
    : 0;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP, etc.)");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setOriginalSize(file.size);
    setResizedImage(null);
    setResizedSize(0);
    setWidth("");
    setHeight("");
    setPercent(100);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setWidth(img.width.toString());
      setHeight(img.height.toString());
      imgRef.current = img;
    };
  };

  const resize = () => {
    if (!imgRef.current) return;

    let targetW = parseInt(width, 10);
    let targetH = parseInt(height, 10);

    if (usePercent) {
      const scale = percent / 100;
      targetW = Math.round(origWidth * scale);
      targetH = Math.round(origHeight * scale);
      setWidth(targetW.toString());
      setHeight(targetH.toString());
    }

    if (isNaN(targetW) || isNaN(targetH) || targetW <= 0 || targetH <= 0) {
      setError("Please enter valid positive dimensions");
      return;
    }

    setLoading(true);
    setError(null);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgRef.current, 0, 0, targetW, targetH);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Resize failed – try again");
          setLoading(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        setResizedImage(url);
        setResizedSize(blob.size);
        setLoading(false);
      },
      "image/jpeg",
      quality
    );
  };

  const handleWidthChange = (e) => {
    const val = e.target.value;
    setWidth(val);
    if (aspectLocked && origWidth && origHeight && val) {
      const ratio = origHeight / origWidth;
      setHeight(Math.round(parseInt(val, 10) * ratio).toString());
    }
  };

  const handleHeightChange = (e) => {
    const val = e.target.value;
    setHeight(val);
    if (aspectLocked && origWidth && origHeight && val) {
      const ratio = origWidth / origHeight;
      setWidth(Math.round(parseInt(val, 10) * ratio).toString());
    }
  };

  const handlePercentChange = (e) => {
    const val = Math.max(1, Math.min(200, parseInt(e.target.value) || 100));
    setPercent(val);
    if (usePercent) {
      const scale = val / 100;
      setWidth(Math.round(origWidth * scale).toString());
      setHeight(Math.round(origHeight * scale).toString());
    }
  };

  const togglePercentMode = () => {
    const newMode = !usePercent;
    setUsePercent(newMode);
    if (newMode) {
      setPercent(100);
      setWidth(origWidth.toString());
      setHeight(origHeight.toString());
    }
  };

  const reset = () => {
    if (originalImage) URL.revokeObjectURL(originalImage);
    if (resizedImage) URL.revokeObjectURL(resizedImage);
    setOriginalImage(null);
    setResizedImage(null);
    setOriginalSize(0);
    setResizedSize(0);
    setWidth("");
    setHeight("");
    setPercent(100);
    setUsePercent(false);
    setError(null);
    setLoading(false);
    imgRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (resizedImage) URL.revokeObjectURL(resizedImage);
    };
  }, [originalImage, resizedImage]);

  return (
    <>
      <Helmet>
        <title>Image Resizer – Resize Photos & Maintain Quality | GeneratorPromptAI</title>
        <meta
          name="description"
          content="Resize images online free – set custom pixels or percentage, lock aspect ratio, adjust JPEG quality. Perfect for Instagram, WhatsApp, websites, thumbnails. No signup, 100% browser-based – made in Karachi."
        />
        <meta
          name="keywords"
          content="image resizer online, resize photo free, resize image pixels, percentage image resize, instagram resize tool, profile picture resizer, free image resizer 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/image-resizer" />

        <meta property="og:title" content="Image Resizer – Free Online Tool" />
        <meta property="og:description" content="Resize photos to any size or percentage – keep quality high, lock aspect ratio." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Resizer – Custom Dimensions" />
        <meta name="twitter:description" content="Resize images for social media, web & print – aspect ratio lock included." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Image Resizer",
            url: "https://generatorpromptai.com/tools/image-resizer",
            description: "Free browser-based image resizing tool with aspect ratio lock and quality control.",
            applicationCategory: "UtilityApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Image Resizer
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Resize photos to any size • Pixel or percentage • Aspect ratio lock
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            {/* Upload Area */}
            {!originalImage && (
              <div
                className="p-12 md:p-20 border-2 border-dashed border-gray-300 hover:border-sky-400 hover:bg-sky-50/20 transition-all text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) handleFile(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFile(e.target.files[0])}
                  className="hidden"
                />
                <Upload size={48} className="mx-auto text-gray-500 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Drop image or click to upload
                </h2>
                <p className="text-gray-500">JPG, PNG, WebP – any size</p>
              </div>
            )}

            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {originalImage && (
              <div className="p-6 md:p-10">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Original */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                        <ImageIcon size={20} /> Original
                      </h3>
                      <span className="text-sm text-gray-600 font-medium">
                        {formatBytes(originalSize)} – {origWidth} × {origHeight} px
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                      <img
                        src={originalImage}
                        alt="Original image before resizing"
                        className="w-full max-h-[420px] object-contain mx-auto"
                      />
                    </div>
                  </div>

                  {/* Resize Controls + Result */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Resize Settings
                        </h3>
                        <button
                          onClick={() => setAspectLocked(!aspectLocked)}
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-sky-600 transition"
                          title={aspectLocked ? "Unlock aspect ratio" : "Lock aspect ratio"}
                        >
                          {aspectLocked ? <Lock size={16} /> : <Unlock size={16} />}
                          {aspectLocked ? "Locked" : "Unlocked"}
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {usePercent ? "Scale (%)" : "Width (px)"}
                          </label>
                          {usePercent ? (
                            <input
                              type="number"
                              value={percent}
                              onChange={handlePercentChange}
                              min="1"
                              max="200"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                          ) : (
                            <input
                              type="number"
                              value={width}
                              onChange={handleWidthChange}
                              min="1"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {usePercent ? "Result" : "Height (px)"}
                          </label>
                          {usePercent ? (
                            <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                              {width} × {height} px
                            </div>
                          ) : (
                            <input
                              type="number"
                              value={height}
                              onChange={handleHeightChange}
                              min="1"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-6">
                        <button
                          onClick={togglePercentMode}
                          className={`px-4 py-2 text-sm rounded-lg border transition ${
                            usePercent
                              ? "bg-sky-100 border-sky-400 text-sky-700"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {usePercent ? "Switch to Pixels" : "Use Percentage"}
                        </button>

                        {(format === "image/jpeg" || format === "image/webp") && (
                          <div className="flex-1 min-w-[180px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              JPEG/WebP Quality: {Math.round(quality * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0.6"
                              max="0.98"
                              step="0.02"
                              value={quality}
                              onChange={(e) => setQuality(Number(e.target.value))}
                              className="w-full accent-sky-600"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={resize}
                          disabled={loading || !width || !height}
                          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CropIcon size={18} />
                          {loading ? "Resizing..." : "Resize Image"}
                        </button>

                        <button
                          onClick={reset}
                          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium flex items-center justify-center gap-2"
                        >
                          <RefreshCw size={18} />
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Resized Preview */}
                    {resizedImage && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                            <ImageIcon size={20} /> Resized
                          </h3>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">
                              {formatBytes(resizedSize)}
                            </div>
                            {savingsPercent > 0 && (
                              <div className="text-sm text-green-600">
                                Saved {savingsPercent}%
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                          <img
                            src={resizedImage}
                            alt="Resized image preview"
                            className="w-full max-h-[420px] object-contain mx-auto"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = resizedImage;
                            link.download = `resized-${Date.now()}.jpg`;
                            link.click();
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-md"
                        >
                          <Download size={18} />
                          Download Resized Image
                        </button>
                      </div>
                    )}

                    {!resizedImage && !loading && (
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                        Resized preview will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free Online Image Resizer – Pixel & Percentage Resize
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Resize images to any pixel dimensions or percentage scale without quality loss. Lock aspect ratio to prevent stretching or unlock for free resizing. Adjust JPEG/WebP quality for smaller files. Perfect for profile pictures, social media posts, website banners, thumbnails, or e-commerce product images.
              </p>
              <p>
                Built in Karachi – 100% browser-based, no upload to servers, private & secure. Ideal for Pakistani creators, bloggers, online sellers and designers who need fast resizing for Instagram, Facebook, WhatsApp or websites.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Image Resizer
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Drag & drop or click to upload your image (JPG, PNG, WebP).</li>
                <li>Original dimensions appear automatically.</li>
                <li>Enter new width or height (aspect ratio stays locked by default).</li>
                <li>Click lock icon to resize non-proportionally if needed.</li>
                <li>Use percentage mode to scale by % (50%, 75%, 150%, etc.).</li>
                <li>Adjust quality slider for JPEG/WebP output if file size matters.</li>
                <li>Click <strong>Resize Image</strong> → preview appears.</li>
                <li>Click <strong>Download Resized Image</strong> to save.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Image Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/image-compressor"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Compressor
                </h3>
                <p className="text-gray-600 text-sm">
                  Reduce file size without visible quality loss.
                </p>
              </Link>

              <Link
                to="/tools/image-cropper"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Cropper
                </h3>
                <p className="text-gray-600 text-sm">
                  Crop images with custom aspect ratios.
                </p>
              </Link>

              <Link
                to="/tools/image-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert JPG ↔ PNG ↔ WebP instantly.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ImageResizer;