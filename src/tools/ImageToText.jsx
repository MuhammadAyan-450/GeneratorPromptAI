// pages/ImageToText.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Tesseract from "tesseract.js";
import {
  ArrowLeft, Upload, Copy, Download, RefreshCw,
  Loader2, AlertCircle, Image as ImageIcon, FileText,
  Shield, CheckCircle
} from "lucide-react";

// ─── Language Options ─────────────────────────────────────────────────────────
const LANGUAGES = [
  { value: "eng",         label: "English" },
  { value: "urd",         label: "Urdu (اردو)" },
  { value: "eng+urd",     label: "English + Urdu ★ Recommended" },
  { value: "ara",         label: "Arabic (عربي)" },
  { value: "hin",         label: "Hindi (हिन्दी)" },
  { value: "fra",         label: "French" },
  { value: "deu",         label: "German" },
  { value: "spa",         label: "Spanish" },
  { value: "zho_sim",     label: "Chinese (Simplified)" },
  { value: "rus",         label: "Russian" },
];

const OCR_TIPS = [
  "Use high-resolution images (300 DPI or above for scans)",
  "Ensure text has high contrast against background",
  "Keep text straight — avoid tilted or skewed images",
  "Avoid heavy shadows, glare, or blurry photos",
  "Screenshots and typed text extract better than handwriting",
];

const ImageToText = () => {
  const [imageSrc,      setImageSrc]      = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [editableText,  setEditableText]  = useState("");
  const [loading,       setLoading]       = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [confidence,    setConfidence]    = useState(null);
  const [error,         setError]         = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [language,      setLanguage]      = useState("eng+urd");
  const [autoRun,       setAutoRun]       = useState(false);
  const [isDragging,    setIsDragging]    = useState(false);
  const [toast,         setToast]         = useState("");

  const fileInputRef = useRef(null);
  const imgUrlRef    = useRef(null);

  useEffect(() => () => { if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP, etc.)");
      return;
    }
    setError(null);
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    const url = URL.createObjectURL(file);
    imgUrlRef.current = url;
    setImageSrc(url);
    setExtractedText("");
    setEditableText("");
    setProgress(0);
    setConfidence(null);
    if (autoRun) setTimeout(() => runOCR(url), 100);
  };

  const runOCR = async (src) => {
    const target = src || imageSrc;
    if (!target) { setError("Please upload an image first."); return; }

    setLoading(true);
    setError(null);
    setProgress(0);
    setProgressLabel("Initializing...");
    setExtractedText("");
    setEditableText("");
    setConfidence(null);

    try {
      const { data } = await Tesseract.recognize(target, language, {
        logger: (m) => {
          if (m.status === "loading tesseract core")   { setProgressLabel("Loading OCR engine..."); setProgress(10); }
          if (m.status === "initializing tesseract")   { setProgressLabel("Initializing..."); setProgress(20); }
          if (m.status === "loading language traineddata") { setProgressLabel("Loading language..."); setProgress(35); }
          if (m.status === "initializing api")         { setProgressLabel("Starting recognition..."); setProgress(50); }
          if (m.status === "recognizing text")         {
            setProgressLabel("Recognizing text...");
            setProgress(50 + Math.round(m.progress * 50));
          }
        },
      });

      const text = data.text.trim();
      const conf = data.confidence ? Math.round(data.confidence) : null;
      setExtractedText(text || "No readable text detected. Try a clearer image.");
      setEditableText(text || "");
      setConfidence(conf);
    } catch (err) {
      console.error(err);
      setError("Text extraction failed. Try a clearer, higher-contrast image.");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const copyText = () => {
    if (!editableText) return;
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    showToast("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!editableText) return;
    const blob = new Blob([editableText], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `ocr-text-${Date.now()}.txt`; link.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded as .txt file!");
  };

  const reset = () => {
    setImageSrc(null); setExtractedText(""); setEditableText("");
    setError(null); setProgress(0); setCopied(false); setConfidence(null);
    setProgressLabel("");
  };

  const wordCount = editableText.trim() ? editableText.trim().split(/\s+/).length : 0;
  const charCount = editableText.length;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image to Text (OCR)",
    url: "https://www.generatorpromptai.com/tools/image-to-text",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free online OCR tool to extract text from images, scanned documents and screenshots. Supports English, Urdu, Arabic, Hindi and 10+ languages. 100% browser-based, private.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is OCR and how does it work?",
        acceptedAnswer: { "@type": "Answer", text: "OCR (Optical Character Recognition) is technology that reads text from images. Our tool uses Tesseract.js, an open-source OCR engine, to analyze pixel patterns in your image and convert them to editable text." },
      },
      {
        "@type": "Question",
        name: "Does this OCR tool support Urdu text?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our OCR tool supports Urdu (اردو) text extraction. Select 'Urdu' or 'English + Urdu' language option for best results with Urdu documents." },
      },
      {
        "@type": "Question",
        name: "Does this tool upload my images to a server?",
        acceptedAnswer: { "@type": "Answer", text: "No. All OCR processing happens entirely in your browser using Tesseract.js. Your images are never uploaded to any server — 100% private and secure." },
      },
      {
        "@type": "Question",
        name: "What types of images work best for OCR?",
        acceptedAnswer: { "@type": "Answer", text: "High-resolution images with clear, high-contrast text work best. Screenshots, scanned documents, and well-lit photos of printed text give the best results. Handwriting, blurry photos, and low contrast images may give poor results." },
      },
      {
        "@type": "Question",
        name: "What languages are supported?",
        acceptedAnswer: { "@type": "Answer", text: "Our OCR tool supports English, Urdu, Arabic, Hindi, French, German, Spanish, Chinese (Simplified), and Russian." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Image to Text (OCR) - Extract Text from Images Free | English, Urdu & 10 Languages</title>
        <meta
          name="description"
          content="Free online OCR tool — extract text from images, scanned documents and screenshots. Supports English, Urdu, Arabic, Hindi and 10+ languages. Edit, copy or download extracted text. 100% private, no upload."
        />
        <meta
          name="keywords"
          content="image to text, ocr online free, extract text from image, urdu ocr, arabic ocr, hindi ocr, photo to text, scanned document to text, screenshot to text, free ocr tool 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/image-to-text" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Image to Text OCR - Extract Text Free | English, Urdu & More" />
        <meta property="og:description" content="Extract text from images and scanned documents. Supports English, Urdu, Arabic, Hindi and 10+ languages. Edit, copy or download. 100% private." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/image-to-text" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-image-to-text.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free OCR - Image to Text | English, Urdu, Arabic, Hindi" />
        <meta name="twitter:description" content="Extract text from images and documents. 10+ languages including Urdu and Arabic. Free, private, no upload." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-image-to-text.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-100 mb-4">
              <FileText className="text-teal-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Image to Text (OCR)
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Extract text from images, scans and screenshots. English, Urdu, Arabic, Hindi and 10+ languages.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> 100% private — images never leave your browser
            </div>
          </div>

          {/* Upload State */}
          {!imageSrc ? (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
                  isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400 hover:bg-teal-50/20"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e.dataTransfer.files?.[0]); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  className="hidden"
                />
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-teal-600" size={28} />
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">Drop image here or click to upload</p>
                <p className="text-gray-400 text-sm">JPG, PNG, WebP, BMP, TIFF — any image with text</p>
                {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
              </div>

              {/* OCR Tips */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle size={15} className="text-teal-500" /> Tips for best OCR results
                </p>
                <ul className="space-y-1.5">
                  {OCR_TIPS.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-5">

              {/* Left: Image + settings */}
              <div className="space-y-4">
                {/* Image preview */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <ImageIcon size={15} className="text-teal-600" /> Uploaded Image
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-teal-600 hover:underline"
                    >
                      Change image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files?.[0])}
                      className="hidden"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <img src={imageSrc} alt="Uploaded for OCR" className="w-full max-h-72 object-contain" />
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">OCR Settings</p>

                  {/* Language */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Auto-run toggle */}
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <div
                      onClick={() => setAutoRun(!autoRun)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${autoRun ? "bg-teal-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${autoRun ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-sm text-gray-600">Auto-extract on upload</span>
                  </label>

                  {/* Progress bar */}
                  {loading && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>{progressLabel}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle size={15} className="mt-0.5 flex-shrink-0" /> {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => runOCR()}
                      disabled={loading}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 size={17} className="animate-spin" /> Extracting {progress}%</>
                      ) : (
                        <><FileText size={17} /> Extract Text</>
                      )}
                    </button>
                    <button
                      onClick={reset}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <RefreshCw size={15} /> Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Extracted text */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Extracted Text</span>
                  {editableText && (
                    <div className="flex items-center gap-3">
                      {confidence !== null && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          confidence >= 80 ? "bg-green-100 text-green-700" :
                          confidence >= 50 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-600"
                        }`}>
                          {confidence}% confidence
                        </span>
                      )}
                      <button onClick={copyText} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors">
                        <Copy size={13} /> {copied ? "Copied!" : "Copy"}
                      </button>
                      <button onClick={downloadText} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors">
                        <Download size={13} /> .txt
                      </button>
                    </div>
                  )}
                </div>

                {editableText ? (
                  <>
                    {/* Word/char count */}
                    <div className="flex gap-4 text-xs text-gray-400 mb-3">
                      <span><strong className="text-gray-600">{wordCount}</strong> words</span>
                      <span><strong className="text-gray-600">{charCount}</strong> characters</span>
                    </div>
                    {/* Editable textarea */}
                    <textarea
                      value={editableText}
                      onChange={(e) => setEditableText(e.target.value)}
                      className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none min-h-[320px]"
                      placeholder="Extracted text will appear here..."
                      spellCheck={false}
                    />
                    <p className="text-xs text-gray-400 mt-2">You can edit the text above before copying or downloading.</p>
                  </>
                ) : loading ? (
                  <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-gray-400 min-h-[320px]">
                    <Loader2 size={32} className="animate-spin text-teal-500 mb-3" />
                    <p className="text-sm">{progressLabel || "Processing..."}</p>
                    <p className="text-xs mt-1">{progress}% complete</p>
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 min-h-[320px]">
                    <FileText size={36} className="mb-2" />
                    <p className="text-sm text-gray-400">Click Extract Text to begin</p>
                    <p className="text-xs text-gray-300 mt-1">Tip: clear, straight, high-contrast text works best</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online OCR — Extract Text from Images in 10+ Languages
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free Image to Text tool uses OCR (Optical Character Recognition) to extract editable text from photos, scanned documents, screenshots, receipts, and more. All processing happens entirely in your browser — images are never uploaded to any server.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Supports English, Urdu (اردو), Arabic, Hindi, French, German, Spanish, Chinese, and Russian. Especially useful for Pakistani students, professionals, and researchers who need to extract text from Urdu and English documents, books, ID cards, and receipts.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What can you use OCR for?</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Extract text from scanned books, documents, and PDFs converted to images</li>
              <li>Convert receipts and invoices to editable text for accounting</li>
              <li>Extract text from screenshots for quick copy-paste</li>
              <li>Digitize handwritten notes (typed text gives better results)</li>
              <li>Convert ID card information to text for forms</li>
              <li>Extract text from whiteboards and presentation photos</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "What is OCR and how does it work?", a: "OCR (Optical Character Recognition) reads text from images by analyzing pixel patterns. Our tool uses Tesseract.js, an open-source OCR engine, to recognize and extract text from your images directly in your browser." },
                { q: "Does this OCR tool support Urdu?", a: "Yes. Select 'Urdu' or 'English + Urdu' language option for Urdu documents. The 'English + Urdu' option is recommended for documents containing both languages." },
                { q: "Do my images get uploaded to a server?", a: "No. All OCR processing uses Tesseract.js running entirely in your browser. Your images never leave your device — 100% private and secure." },
                { q: "What images work best for OCR?", a: "High-resolution images with clear, high-contrast printed text work best. Screenshots and scanned documents give excellent results. Blurry, low-light, or skewed images may give poor accuracy." },
                { q: "Can I edit the extracted text?", a: "Yes. The extracted text appears in an editable text area where you can make corrections before copying or downloading as a .txt file." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Compress images before OCR for faster processing." },
                { to: "/tools/image-converter",  title: "Image Converter",  desc: "Convert image formats for better OCR compatibility." },
                { to: "/tools/word-counter",     title: "Word Counter",     desc: "Count words and characters in your extracted text." },
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

export default ImageToText;