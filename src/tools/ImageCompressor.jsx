// pages/ImageCompressor.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Upload, Download, Image as ImageIcon, AlertCircle, Sliders } from "lucide-react";

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.8); // 0.6 = aggressive, 0.92 = high quality
  const [maxDimension, setMaxDimension] = useState(1920);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const formatBytes = (bytes) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  const compressImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP)");
      return;
    }

    setError(null);
    setOriginalImage(URL.createObjectURL(file));
    setOriginalSize(file.size);
    setCompressedImage(null);
    setCompressedSize(0);

    const options = {
      maxSizeMB: 2,               // safety cap
      maxWidthOrHeight: maxDimension,
      initialQuality: quality,
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      setLoading(true);
      const compressedFile = await imageCompression(file, options);

      const compressedUrl = URL.createObjectURL(compressedFile);
      setCompressedImage(compressedUrl);
      setCompressedSize(compressedFile.size);
    } catch (err) {
      console.error(err);
      setError("Compression failed. File may be too large or corrupted.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) compressImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) compressImage(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (compressedImage) URL.revokeObjectURL(compressedImage);
    };
  }, [originalImage, compressedImage]);

  return (
    <>
      <Helmet>
        <title>Image Compressor – Reduce Image Size Without Quality Loss</title>
        <meta
          name="description"
          content="Compress JPG, PNG, WebP images online for free. Reduce image size up to 90% with minimal quality loss – perfect for WhatsApp, Instagram, websites & email. No upload, 100% Free Tool."
        />
        <meta
          name="keywords"
          content="image compressor online, compress jpg png free, reduce image size, photo compressor no quality loss, webp compressor, image optimizer 2026, free image compression tool, jpg Image Compressor, png Image Compressor , webp Image Compressor , Photo Compressor , reduce image size , photo size reducer"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/image-compressor" />

        <meta property="og:title" content="Free Image Compressor – Reduce Image Size Online 2026" />
        <meta property="og:description" content="Compress images instantly in browser – up to 90% smaller, great for social media & websites." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Image Compressor – Free & No Quality Loss" />
        <meta name="twitter:description" content="Shrink photos for faster loading & sharing – 100% private." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Image Compressor",
            url: "https://generatorpromptai.com/tools/image-compressor",
            description: "Free browser-based image compression tool – JPG, PNG, WebP. Reduce size while preserving quality.",
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
            Image Compressor
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Reduce image size online • JPG, PNG, WebP • No quality loss • Free & private
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            {/* Upload / Drag Area */}
            <div
              className={`p-10 md:p-16 border-2 border-dashed transition-all text-center cursor-pointer ${loading
                ? "border-sky-400 bg-sky-50/40"
                : "border-gray-300 hover:border-sky-400 hover:bg-sky-50/20"
                }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
                <Upload size={32} className="text-gray-600" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {loading ? "Compressing..." : "Drop image here or click to upload"}
              </h2>
              <p className="text-gray-500 mb-4">
                Supports JPG, PNG, WebP • Recommended: under 10 MB
              </p>
            </div>

            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Settings */}
            {(originalImage || loading) && (
              <div className="p-6 md:p-10 border-t border-gray-100">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quality (higher = better quality, larger file)
                    </label>
                    <input
                      type="range"
                      min="0.6"
                      max="0.92"
                      step="0.02"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      disabled={loading}
                      className="w-full accent-sky-600"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      Current: {Math.round(quality * 100)}%
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Max Dimension (px)
                    </label>
                    <select
                      value={maxDimension}
                      onChange={(e) => setMaxDimension(Number(e.target.value))}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value={1200}>1200 px (social media)</option>
                      <option value={1600}>1600 px</option>
                      <option value={1920}>1920 px (Full HD)</option>
                      <option value={2560}>2560 px</option>
                      <option value={3840}>3840 px (4K)</option>
                    </select>
                  </div>
                </div>

                {/* Comparison */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Original */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <ImageIcon size={18} />
                        Original
                      </h3>
                      <span className="text-sm text-gray-600 font-medium">
                        {formatBytes(originalSize)}
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                      <img
                        src={originalImage}
                        alt="Original image"
                        className="w-full h-auto max-h-[420px] object-contain mx-auto"
                      />
                    </div>
                  </div>

                  {/* Compressed / Loading */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <ImageIcon size={18} />
                        Compressed
                      </h3>
                      {compressedSize > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          {formatBytes(compressedSize)}
                          {savingsPercent > 0 && (
                            <span className="ml-2">– Saved {savingsPercent}%</span>
                          )}
                        </span>
                      )}
                    </div>

                    {loading ? (
                      <div className="h-[420px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-14 h-14 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-sky-600 font-medium">Compressing...</p>
                        <p className="text-sm text-gray-500 mt-2">Usually takes 3–10 seconds</p>
                      </div>
                    ) : compressedImage ? (
                      <>
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                          <img
                            src={compressedImage}
                            alt="Compressed image"
                            className="w-full h-auto max-h-[420px] object-contain mx-auto"
                          />
                        </div>

                        <a
                          href={compressedImage}
                          download={`compressed-${Date.now()}.jpg`}
                          className="mt-5 w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-medium py-3.5 px-6 rounded-lg inline-flex items-center justify-center gap-2 transition shadow-md"
                        >
                          <Download size={18} />
                          Download Compressed Image
                        </a>
                      </>
                    ) : (
                      <div className="h-[420px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 text-gray-400">
                        Compressed version will appear here
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
              Free Online Image Compressor – Fast & Private
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                <p>Compress image size instantly without installing software.Our browser-based image compressor works with JPG image, PNG image, and WebP files. It's great for faster website loading, sharing on WhatsApp/Facebook/Instagram, email attachments, and saving mobile data.</p>              </p>
              <p>
                <p>Adjustable quality (60–92%) and max dimensions let you balance size vs clarity. Everything stays in your browser – no uploads, no data stored.</p>              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Image Compressor
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Drag & drop or click to upload your image (JPG image, PNG image, WebP files).</li>
                <li>Adjust quality slider and max dimension if needed.</li>
                <li>Wait a few seconds – compression happens automatically.</li>
                <li>Compare original vs compressed side-by-side with size savings.</li>
                <li>Click <strong>Download Compressed Image</strong> to save.</li>
                <li>Repeat as many times as you want – no limits, no signup.</li>
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
                to="/tools/image-resizer"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Resizer
                </h3>
                <p className="text-gray-600 text-sm">
                  Resize photos to exact dimensions without quality loss.
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
                  Crop images with custom ratios for social media.
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

export default ImageCompressor;