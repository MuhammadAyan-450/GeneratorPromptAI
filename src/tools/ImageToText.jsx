import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Tesseract from "tesseract.js";
import {
  Copy, RefreshCw, Upload, Download, Loader2,
  Image as ImageIcon, FileText, Home, ChevronDown,
  Hash, Type, Percent, Globe, CheckCircle
} from "lucide-react";

// ─── Language Options ─────────────────────────────────────────────────────────
const LANGUAGES = [
  { value: "eng", label: "English" },
  { value: "urd", label: "Urdu" },
  { value: "eng+urd", label: "English + Urdu (Recommended)" },
  { value: "ara", label: "Arabic" },
  { value: "hin", label: "Hindi" },
  { value: "fra", label: "French" },
  { value: "deu", label: "German" },
  { value: "spa", label: "Spanish" },
  { value: "zho_sim", label: "Chinese (Simplified)" },
  { value: "rus", label: "Russian" },
];

const OCR_TIPS = [
  "Use high-resolution images (300 DPI or above for scans)",
  "Ensure text has high contrast against background",
  "Keep text straight — avoid tilted or skewed images",
  "Avoid heavy shadows, glare, or blurry photos",
  "Screenshots and typed text extract better than handwriting",
];

const ImageToText = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [editableText, setEditableText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState("eng+urd");
  const [autoRun, setAutoRun] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const fileInputRef = useRef(null);
  const imgUrlRef = useRef(null);

  useEffect(() => () => { if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current); }, []);

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
          if (m.status === "loading tesseract core") { setProgressLabel("Loading OCR engine..."); setProgress(10); }
          if (m.status === "initializing tesseract") { setProgressLabel("Initializing..."); setProgress(20); }
          if (m.status === "loading language traineddata") { setProgressLabel("Loading language..."); setProgress(35); }
          if (m.status === "initializing api") { setProgressLabel("Starting recognition..."); setProgress(50); }
          if (m.status === "recognizing text") {
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
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!editableText) return;
    const blob = new Blob([editableText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `ocr-text-${Date.now()}.txt`; link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setImageSrc(null); setExtractedText(""); setEditableText("");
    setError(null); setProgress(0); setCopied(false); setConfidence(null);
    setProgressLabel("");
  };

  const wordCount = editableText.trim() ? editableText.trim().split(/\s+/).length : 0;
  const charCount = editableText.length;

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Extract Urdu Text from Image Online Free – OCR Tool for English and Urdu Documents",
    "url": "https://www.generatorpromptai.com/tools/image-to-text",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online OCR tool to extract Urdu and English text from images, scanned documents and screenshots. Edit, copy or download extracted text. 100% browser-based, no upload to server.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Image to Text", "item": "https://www.generatorpromptai.com/tools/image-to-text" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to extract Urdu text from image online for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your image containing Urdu text, select 'English + Urdu' as the language, and click Extract Text. Our OCR tool uses Tesseract.js to recognize Urdu characters directly in your browser without uploading to any server."
        }
      },
      {
        "@type": "Question",
        "name": "Can I extract text from scanned document without uploading?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our OCR tool runs entirely in your browser. Take a photo or scan of your document, upload it, and the text extraction happens locally. The image is never sent to any server."
        }
      },
      {
        "@type": "Question",
        "name": "Does this OCR tool support Arabic and Hindi text?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our tool supports Arabic, Hindi, Urdu, English, French, German, Spanish, Chinese (Simplified), and Russian. Select the appropriate language from the dropdown before extracting text."
        }
      },
      {
        "@type": "Question",
        "name": "How to convert screenshot to text online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Take a screenshot, upload it to our tool, and click Extract Text. Screenshots with clear, typed text give the best OCR results. You can then edit, copy, or download the extracted text as a .txt file."
        }
      },
      {
        "@type": "Question",
        "name": "What is OCR and how accurate is it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OCR (Optical Character Recognition) reads text from images by analyzing pixel patterns. Accuracy depends on image quality — clear, high-resolution, high-contrast images with printed text typically achieve 80–95% accuracy. Our tool shows the confidence score after extraction."
        }
      },
      {
        "@type": "Question",
        "name": "Can I edit the extracted text before downloading?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The extracted text appears in an editable text area. You can correct any OCR errors manually before copying to clipboard or downloading as a .txt file."
        }
      }
    ]
  };
  return (
    <>
      <Helmet>
        <title>Extract Urdu Text from Image Online Free – OCR Tool for English & Urdu Documents</title>

        <meta
          name="description"
          content="Free online OCR tool — extract Urdu and English text from images, scanned documents and screenshots. Supports 10+ languages. Edit, copy or download extracted text. 100% browser-based, no server upload."
        />

        <meta
          name="keywords"
          content="how to extract urdu text from image online free, extract text from scanned document without uploading, urdu ocr online free no server upload, convert screenshot to text online free tool, arabic ocr online free browser based, hindi text extraction from image free, photo to text converter for pakistani documents, extract text from image without losing formatting free, free online ocr tool for multiple languages, best free ocr for urdu and english mixed documents"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/image-to-text" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Extract Urdu Text from Image Online Free – OCR Tool" />
        <meta property="og:description" content="Extract Urdu, English, Arabic, Hindi text from images. Edit, copy, download. 100% browser-based, no server upload." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/image-to-text" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free OCR – Extract Urdu & English Text from Image Online" />
        <meta name="twitter:description" content="Extract text from images in 10+ languages. Urdu, Arabic, Hindi supported. Edit, copy, download. No server upload." />

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
              <li><span className="text-gray-900 font-semibold">Image to Text</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <FileText className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Extract Urdu Text from Image Online Free –{" "}
              <span className="text-sky-600">OCR Tool for English & Urdu</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Extract text from images, scanned documents and screenshots in 10+ languages. Edit, copy or download the result. No server upload.
            </p>
          </div>

          {/* ── Upload State ── */}
          {!imageSrc ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
              <div
                className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${isDragging ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-sky-50/30"
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
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-sky-600" size={28} />
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">Drop image here or click to upload</p>
                <p className="text-gray-400 text-sm">JPG, PNG, WebP, BMP, TIFF — any image with text</p>
                {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
              </div>

              {/* Tips */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle size={15} className="text-sky-500" /> Tips for best OCR results
                </p>
                <ul className="space-y-1.5">
                  {OCR_TIPS.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-sky-400 mt-0.5 flex-shrink-0">-</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-5">

              {/* Left: Image + Settings */}
              <div className="space-y-4">

                {/* Image Preview */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <ImageIcon size={15} className="text-sky-600" /> Uploaded Image
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-sky-600 hover:underline"
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
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">OCR Settings</label>

                  {/* Language */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-gray-800"
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
                      className={`w-10 h-5 rounded-full transition-colors relative ${autoRun ? "bg-sky-500" : "bg-gray-300"}`}
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
                          className="h-full bg-sky-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => runOCR()}
                      disabled={loading}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 size={17} className="animate-spin" /> Extracting {progress}%</>
                      ) : (
                        <><FileText size={17} /> Extract Text</>
                      )}
                    </button>
                    <button
                      onClick={reset}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                    >
                      <RefreshCw size={15} /> Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Extracted Text */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Extracted Text</span>
                  {editableText && (
                    <div className="flex items-center gap-2">
                      <button onClick={copyText} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors">
                        <Copy size={13} /> {copied ? "Copied!" : "Copy"}
                      </button>
                      <button onClick={downloadText} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors">
                        <Download size={13} /> .txt
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                {editableText && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><Hash size={16} /></div>
                      <p className="text-sm font-bold text-gray-800">{wordCount}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Words</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><Type size={16} /></div>
                      <p className="text-sm font-bold text-gray-800">{charCount}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Characters</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><Percent size={16} /></div>
                      <p className="text-sm font-bold text-gray-800">{confidence !== null ? `${confidence}%` : "—"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Confidence</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><Globe size={16} /></div>
                      <p className="text-sm font-bold text-gray-800">{LANGUAGES.find((l) => l.value === language)?.label.split(" ")[0] || "—"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Language</p>
                    </div>
                  </div>
                )}

                {/* Confidence Badge */}
                {confidence !== null && editableText && (
                  <div className="mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${confidence >= 80 ? "bg-green-100 text-green-700" :
                        confidence >= 50 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-600"
                      }`}>
                      {confidence >= 80 ? "High" : confidence >= 50 ? "Medium" : "Low"} accuracy ({confidence}%)
                    </span>
                  </div>
                )}

                {editableText ? (
                  <>
                    <textarea
                      value={editableText}
                      onChange={(e) => setEditableText(e.target.value)}
                      className="flex-1 w-full p-4 bg-gray-900 rounded-2xl text-sm leading-relaxed font-mono text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none min-h-[320px]"
                      placeholder="Extracted text will appear here..."
                      spellCheck={false}
                    />
                    <p className="text-xs text-gray-400 mt-2">You can edit the text above before copying or downloading.</p>
                  </>
                ) : loading ? (
                  <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-400 min-h-[320px]">
                    <Loader2 size={32} className="animate-spin text-sky-500 mb-3" />
                    <p className="text-sm">{progressLabel || "Processing..."}</p>
                    <p className="text-xs mt-1">{progress}% complete</p>
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 min-h-[320px]">
                    <FileText size={36} className="mb-2" />
                    <p className="text-sm text-gray-400">Click Extract Text to begin</p>
                    <p className="text-xs text-gray-300 mt-1">Clear, straight, high-contrast text works best</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online OCR Tool for Urdu & English Documents — No Upload Required
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free Image to Text tool uses OCR (Optical Character Recognition) powered by <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">Tesseract.js</code> to extract editable text from photos, scanned documents, screenshots, receipts, and more. All processing happens entirely in your browser — images are never uploaded to any server.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Especially useful for Pakistani students, professionals, and researchers who need to extract text from <strong>Urdu and English documents</strong>, books, ID cards, and receipts. The "English + Urdu" language option is recommended for documents containing both languages, which is extremely common in Pakistan.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What can you use OCR for?</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Extract text from scanned books, documents, and PDFs saved as images</li>
              <li>Convert receipts and invoices to editable text for accounting</li>
              <li>Extract text from screenshots for quick copy-paste</li>
              <li>Digitize printed notes and handouts for study purposes</li>
              <li>Convert ID card and passport information to text for forms</li>
              <li>Extract text from whiteboard photos and presentation slides</li>
            </ul>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Extract Text from Scanned Document Without Uploading
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Click <strong>Upload</strong> or drag and drop your image (photo, scan, or screenshot).</li>
              <li>Select the correct <strong>language</strong> — use "English + Urdu" for Pakistani documents.</li>
              <li>Click <strong>"Extract Text"</strong> and wait for the OCR engine to process the image.</li>
              <li>Review the extracted text in the editable text area and <strong>correct any errors</strong>.</li>
              <li><strong>Copy to clipboard</strong> or <strong>download as .txt file</strong>.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Convert Screenshot to Text Online Free – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Urdu + English OCR", desc: "Specially optimized for Pakistani documents with mixed Urdu and English text. Select 'English + Urdu' for the best results on bilingual content." },
                { title: "10+ Language Support", desc: "Extract text in English, Urdu, Arabic, Hindi, French, German, Spanish, Chinese (Simplified), and Russian — all processed locally in your browser." },
                { title: "Editable Output", desc: "The extracted text appears in an editable area so you can fix OCR errors before copying or downloading. Word and character counts are shown in real-time." },
                { title: "100% Private — No Upload", desc: "All OCR processing uses Tesseract.js running in your browser. Images are never uploaded, stored, or sent to any server. Safe for confidential documents." }
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
              Image to Text OCR – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to extract Urdu text from image online for free?",
                  a: "Upload your image containing Urdu text, select 'English + Urdu' as the language, and click Extract Text. Our OCR tool uses Tesseract.js to recognize Urdu characters directly in your browser without uploading to any server."
                },
                {
                  q: "Can I extract text from scanned document without uploading?",
                  a: "Yes. Our OCR tool runs entirely in your browser. Take a photo or scan of your document, upload it, and the text extraction happens locally. The image is never sent to any server."
                },
                {
                  q: "Does this OCR tool support Arabic and Hindi text?",
                  a: "Yes. Our tool supports Arabic, Hindi, Urdu, English, French, German, Spanish, Chinese (Simplified), and Russian. Select the appropriate language from the dropdown before extracting text."
                },
                {
                  q: "How to convert screenshot to text online free?",
                  a: "Take a screenshot, upload it to our tool, and click Extract Text. Screenshots with clear, typed text give the best OCR results. You can then edit, copy, or download the extracted text as a .txt file."
                },
                {
                  q: "What is OCR and how accurate is it?",
                  a: "OCR (Optical Character Recognition) reads text from images by analyzing pixel patterns. Accuracy depends on image quality — clear, high-resolution, high-contrast images with printed text typically achieve 80-95% accuracy. Our tool shows the confidence score after extraction."
                },
                {
                  q: "Can I edit the extracted text before downloading?",
                  a: "Yes. The extracted text appears in an editable text area. You can correct any OCR errors manually before copying to clipboard or downloading as a .txt file."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/image-compressor", title: "Image Compressor", desc: "Compress images before OCR for faster processing." },
                { to: "/tools/image-converter", title: "Image Converter", desc: "Convert image formats for better OCR compatibility." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words and characters in your extracted text." }
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

export default ImageToText;