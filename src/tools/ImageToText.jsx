// pages/ImageToText.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Tesseract from "tesseract.js";
import { ArrowLeft, Upload, Copy, Download, RefreshCw, Loader2, AlertCircle } from "lucide-react";

const ImageToText = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState("eng+urd"); // default: English + Urdu
  const fileInputRef = useRef(null);

  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, etc.)");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setExtractedText("");
    setProgress(0);

    // Optional: auto-run OCR after upload
    // runOCR();
  };

  const runOCR = async () => {
    if (!imageSrc) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setExtractedText("");

    try {
      const { data } = await Tesseract.recognize(
        imageSrc,
        language,
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          },
        }
      );

      const text = data.text.trim();
      setExtractedText(text || "No readable text was detected in the image.");
    } catch (err) {
      console.error(err);
      setError("Text extraction failed. Try a clearer image with high contrast.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadText = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `extracted-text-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setExtractedText("");
    setError(null);
    setProgress(0);
    setCopied(false);
  };

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  return (
    <>
      <Helmet>
        <title>Image to Text – Extract Text from Photos</title>
        <meta
          name="description"
          content="Extract text from images, scanned documents, screenshots & handwritten notes online – supports English + Urdu. Free OCR tool, no signup, 100% browser-based. Ideal for Pakistani students, professionals & Urdu users."
        />
        <meta
          name="keywords"
          content="image to text, ocr online free, extract text from image, urdu ocr, english urdu ocr, scanned document text extractor, free ocr tool 2026, photo to text converter"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/image-to-text" />

        <meta property="og:title" content="Image to Text (OCR) – Free Online Extractor 2026" />
        <meta property="og:description" content="Convert images & scanned pages to editable text – English + Urdu support, perfect for Pakistan." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free OCR – Image to Text Converter" />
        <meta name="twitter:description" content="Extract text from photos & documents instantly – supports Urdu." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Image to Text (OCR)",
            url: "https://generatorpromptai.com/tools/image-to-text",
            description: "Free browser-based OCR tool to extract text from images and scanned documents – English & Urdu support.",
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
            Image to Text (OCR)
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Extract text from photos, scans & documents • English + Urdu • Free & private
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            {!imageSrc ? (
              <div
                className="p-12 md:p-20 border-2 border-dashed border-gray-300 hover:border-sky-400 hover:bg-sky-50/20 transition-all text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) handleImageUpload(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
                <Upload size={48} className="mx-auto text-gray-500 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Drop image or click to upload
                </h2>
                <p className="text-gray-500">Best with clear, high-contrast text</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                {/* Image Preview */}
                <div className="space-y-5">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <ImageIcon size={20} /> Uploaded Image
                  </h3>
                  <div className="border rounded-xl overflow-hidden bg-gray-50 shadow-sm">
                    <img
                      src={imageSrc}
                      alt="Uploaded image for OCR text extraction"
                      className="w-full max-h-[500px] object-contain mx-auto"
                    />
                  </div>
                </div>

                {/* Controls & Result */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">
                      OCR Settings
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          disabled={loading}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="eng">English</option>
                          <option value="urd">Urdu</option>
                          <option value="eng+urd">English + Urdu (recommended)</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={runOCR}
                          disabled={loading}
                          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Extracting… {progress}%
                            </>
                          ) : (
                            "Extract Text"
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={reset}
                      className="w-full py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      New Image
                    </button>
                  </div>

                  {extractedText && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Extracted Text
                        </h3>
                        <div className="flex gap-3">
                          <button
                            onClick={copyText}
                            className="flex items-center gap-2 px-4 py-2 bg-white border hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                          >
                            <Copy size={16} />
                            {copied ? "Copied!" : "Copy"}
                          </button>

                          <button
                            onClick={downloadText}
                            className="flex items-center gap-2 px-4 py-2 bg-white border hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                          >
                            <Download size={16} />
                            .txt
                          </button>
                        </div>
                      </div>

                      <div className="p-5 bg-gray-50 border rounded-xl max-h-80 overflow-y-auto whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        {extractedText}
                      </div>
                    </div>
                  )}

                  {!extractedText && !loading && imageSrc && (
                    <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                      <p className="mb-2">Click "Extract Text" to recognize text</p>
                      <p className="text-xs">Tip: Clear, straight, high-contrast images work best</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free Online OCR – Image to Editable Text
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Transform images of text - photos, scans, screenshots, or documents into editable text in any language.

                Build in Karachi for entirely web-based processing. Users do not have to sign up, or circumvent the mad-designed server upload process. Ninety-nine per cent suitable for treating all Urdu/English documents, immersed-books, IDs, or any other manuscripts. Available for free.

              </p>
              <p>
                Turn Phone Cameras & Digital Cameras into Universal Text Scanners. Simply take a picture of the text you would like to extract and OcrTest.com will take care of the rest_.              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Image to Text (OCR) Tool
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Drag & drop or click to upload your image (photo, scan, screenshot, receipt, etc.).</li>
                <li>Select language: English, Urdu, or both (English+Urdu recommended for Pakistan).</li>
                <li>Click <strong>Extract Text</strong> – processing usually takes 5–30 seconds.</li>
                <li>Extracted text appears in the box on the right.</li>
                <li>Click <strong>Copy</strong> to copy to clipboard or <strong>.txt</strong> to download as file.</li>
                <li>Use <strong>New Image</strong> to process another photo.</li>
                <li>Tip: Best results with straight, well-lit, high-contrast text. Avoid heavy shadows or angles.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Tools
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
                  Reduce image size before OCR for faster processing.
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
                  Convert to JPG/PNG/WebP for better OCR compatibility.
                </p>
              </Link>

              <Link
                to="/tools/word-counter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Word Counter
                </h3>
                <p className="text-gray-600 text-sm">
                  Count words & characters in extracted text.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ImageToText;