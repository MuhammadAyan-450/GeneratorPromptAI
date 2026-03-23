// pages/ImageConverter.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Upload, Download, Image as ImageIcon, RefreshCw, AlertCircle } from "lucide-react";

const ImageConverter = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [format, setFormat] = useState("image/png");
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

  const getExtension = (mime) => {
    if (mime === "image/png") return "png";
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/webp") return "webp";
    return "jpg";
  };

  const savingsPercent = originalSize > 0 && convertedSize > 0
    ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
    : 0;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image (JPG, PNG, WebP, etc.)");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setOriginalSize(file.size);
    setConvertedImage(null);
    setConvertedSize(0);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;
      convert(); // auto convert on upload
    };
  };

  const convert = () => {
    if (!imgRef.current) return;

    setLoading(true);
    setError(null);

    const canvas = document.createElement("canvas");
    canvas.width = imgRef.current.width;
    canvas.height = imgRef.current.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgRef.current, 0, 0);

    const mime = format;
    const qual = mime === "image/png" ? undefined : quality;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Conversion failed – try another image or format");
          setLoading(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        setConvertedImage(url);
        setConvertedSize(blob.size);
        setLoading(false);
      },
      mime,
      qual
    );
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = `converted-${Date.now()}.${getExtension(format)}`;
    link.click();
  };

  const reset = () => {
    if (originalImage) URL.revokeObjectURL(originalImage);
    if (convertedImage) URL.revokeObjectURL(convertedImage);
    setOriginalImage(null);
    setConvertedImage(null);
    setOriginalSize(0);
    setConvertedSize(0);
    setError(null);
    setLoading(false);
    imgRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (convertedImage) URL.revokeObjectURL(convertedImage);
    };
  }, [originalImage, convertedImage]);

  return (
    <>
      <Helmet>
        <title>Image Converter – Convert images between JPG, PNG, WebP</title>
        <meta
          name="description"
          content="Convert images to JPG, PNG, WebP instantly online – free, no signup, no upload to servers. Perfect for WhatsApp, Instagram, websites. Change format & adjust quality in browser."
        />
        <meta
          name="keywords"
          content="image converter online, jpg to png, png to jpg, webp converter, convert image format free, jpg to webp, image format changer 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/image-converter" />

        <meta property="og:title" content="Image Converter – JPG, PNG, WebP Online" />
        <meta property="og:description" content="Instantly convert image formats in your browser – preserve quality, reduce size if needed." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Format Converter – JPG PNG WebP" />
        <meta name="twitter:description" content="Change image formats instantly – no quality loss, 100% private." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Image Converter",
            url: "https://generatorpromptai.com/tools/image-converter",
            description: "Free browser-based tool to convert JPG, PNG, WebP images instantly.",
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
            Image Converter
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            JPG ↔ PNG ↔ WebP • Free • No quality loss • Browser-based
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
                  handleFile(e.dataTransfer.files[0]);
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
                  Drop image here or click to upload
                </h2>
                <p className="text-gray-500">JPG, PNG, WebP supported</p>
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
                  {/* Original Image */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                        <ImageIcon size={20} /> Original
                      </h3>
                      <span className="text-sm text-gray-600 font-medium">
                        {formatBytes(originalSize)}
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                      <img
                        src={originalImage}
                        alt="Original image"
                        className="w-full max-h-[420px] object-contain mx-auto"
                      />
                    </div>
                  </div>

                  {/* Conversion Controls + Result */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="font-semibold text-lg mb-5 text-gray-800">
                        Conversion Settings
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Output Format
                          </label>
                          <select
                            value={format}
                            onChange={(e) => {
                              setFormat(e.target.value);
                              convert();
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          >
                            <option value="image/png">PNG (lossless, supports transparency)</option>
                            <option value="image/jpeg">JPG / JPEG (good for photos)</option>
                            <option value="image/webp">WebP (best for web, small size)</option>
                          </select>
                        </div>

                        {(format === "image/jpeg" || format === "image/webp") && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Quality: {Math.round(quality * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0.5"
                              max="0.98"
                              step="0.02"
                              value={quality}
                              onChange={(e) => {
                                setQuality(Number(e.target.value));
                                convert();
                              }}
                              className="w-full accent-sky-600"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                          onClick={convert}
                          disabled={loading}
                          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                          {loading ? "Converting..." : "Convert"}
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

                    {/* Converted Preview */}
                    {convertedImage && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                            <ImageIcon size={20} /> Converted
                          </h3>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">
                              {formatBytes(convertedSize)}
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
                            src={convertedImage}
                            alt="Converted image"
                            className="w-full max-h-[420px] object-contain mx-auto"
                          />
                        </div>

                        <button
                          onClick={handleDownload}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-md"
                        >
                          <Download size={18} />
                          Download Converted Image
                        </button>
                      </div>
                    )}

                    {!convertedImage && !loading && (
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                        Converted image will appear here
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
              Free Image Converter – JPG, PNG, WebP
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                <p>Convert images between JPG, PNG, and WebP formats instantly – right in your browser. No software install, no files uploaded, no account needed. Adjust quality for JPG/WebP to balance size vs clarity.Great for preparing images for WhatsApp, Instagram, websites, or email.</p>              </p>
              <p>
                Image Compresser – supports transparency (PNG/WebP), works offline after load. Ideal for Worldwide bloggers, designers, social media users, and developers who need fast format changes.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Image Converter
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Drag & drop or click to upload your image (JPG, PNG, WebP, etc.).</li>
                <li>Select desired output format (PNG for transparency, JPG/WebP for smaller size).</li>
                <li>Adjust quality if converting to JPG or WebP (higher = better quality).</li>
                <li>Conversion starts automatically – see result on the right.</li>
                <li>Compare sizes & savings percentage.</li>
                <li>Click <strong>Download Converted Image</strong> to save.</li>
                <li>Use <strong>Reset</strong> to clear and try another image.</li>
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
                  Reduce image size while keeping quality high.
                </p>
              </Link>

              <Link
                to="/tools/image-resizer"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image Resizer
                </h3>
                <p className="text-gray-600 text-sm">
                  Resize photos to exact dimensions.
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
                  Crop images with custom ratios.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ImageConverter;