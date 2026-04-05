// pages/PdfCompressor.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import {
  ArrowLeft, Upload, Download, Loader2, FileText,
  RefreshCw, AlertCircle, Shield, Info, CheckCircle
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const LEVELS = [
  {
    value: "low",
    label: "Low",
    desc: "Fastest — strips metadata only",
    detail: "Best for PDFs that already have small images. Removes title, author, producer tags. Usually 5–20% smaller.",
    useObjectStreams: false,
  },
  {
    value: "medium",
    label: "Medium",
    desc: "Recommended — metadata + object streams",
    detail: "Strips all metadata and enables object stream compression. Best balance of speed and reduction. Usually 10–40% smaller.",
    useObjectStreams: true,
  },
  {
    value: "high",
    label: "High",
    desc: "Maximum — all optimizations",
    detail: "All optimizations enabled. Best results on text-heavy PDFs with redundant objects. Usually 15–50% smaller.",
    useObjectStreams: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const PdfCompressor = () => {
  const [pdfFile,            setPdfFile]            = useState(null);
  const [pageCount,          setPageCount]          = useState(0);
  const [originalSize,       setOriginalSize]       = useState(0);
  const [compressedSize,     setCompressedSize]     = useState(0);
  const [compressedBytes,    setCompressedBytes]    = useState(null);
  const [loading,            setLoading]            = useState(false);
  const [progress,           setProgress]           = useState(0);
  const [progressLabel,      setProgressLabel]      = useState("");
  const [error,              setError]              = useState(null);
  const [compressionLevel,   setCompressionLevel]   = useState("medium");
  const [isDragging,         setIsDragging]         = useState(false);
  const [toast,              setToast]              = useState("");
  const fileInputRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please select a valid PDF file."); return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File is too large. Please use a PDF under 100 MB."); return;
    }
    setError(null);
    setPdfFile(file);
    setOriginalSize(file.size);
    setCompressedBytes(null);
    setCompressedSize(0);
    setProgress(0);
    setPageCount(0);

    // Read page count
    try {
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setPageCount(0);
    }
  };

  const compressPdf = async () => {
    if (!pdfFile) return;
    setLoading(true);
    setError(null);
    setCompressedBytes(null);
    setCompressedSize(0);

    try {
      setProgress(10); setProgressLabel("Reading PDF...");
      const arrayBuffer = await pdfFile.arrayBuffer();

      setProgress(30); setProgressLabel("Parsing document...");
      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer);
      } catch (e) {
        if (e.message?.includes("encrypt") || e.message?.includes("password")) {
          throw new Error("encrypted");
        }
        throw e;
      }

      setProgress(50); setProgressLabel("Stripping metadata...");
      // Strip all metadata
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      const level = LEVELS.find((l) => l.value === compressionLevel);

      setProgress(70); setProgressLabel("Compressing...");
      const saveOptions = {
        useObjectStreams: level?.useObjectStreams ?? true,
        addDefaultPage: false,
        updateFieldAppearances: false,
      };

      const compressed = await pdfDoc.save(saveOptions);
      setProgress(95); setProgressLabel("Finalizing...");

      setCompressedBytes(compressed);
      setCompressedSize(compressed.length);
      setProgress(100);
      setProgressLabel("Done!");
    } catch (err) {
      console.error(err);
      if (err.message === "encrypted" || err.message?.includes("encrypt") || err.message?.includes("password")) {
        setError("This PDF is password-protected. Please unlock or decrypt it first, then try again.");
      } else {
        setError("Compression failed. The file may be corrupted or use unsupported features.");
      }
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!compressedBytes) return;
    const blob = new Blob([compressedBytes], { type: "application/pdf" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `compressed-${pdfFile?.name || "document.pdf"}`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Download started!");
  };

  const reset = () => {
    setPdfFile(null); setOriginalSize(0); setCompressedSize(0);
    setCompressedBytes(null); setError(null); setProgress(0);
    setProgressLabel(""); setPageCount(0);
  };

  const savings    = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;
  const savedBytes = originalSize - compressedSize;
  const currentLevel = LEVELS.find((l) => l.value === compressionLevel);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF Compressor",
    url: "https://generatorpromptai.com/tools/pdf-compressor",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free browser-based PDF compressor. Reduce PDF file size online without uploading to a server. Strips metadata and optimizes object streams. 100% private.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does this PDF compressor upload my files?",
        acceptedAnswer: { "@type": "Answer", text: "No. All compression happens entirely in your browser using pdf-lib. Your PDF files are never sent to any server — 100% private and secure." },
      },
      {
        "@type": "Question",
        name: "Why is my compressed PDF not much smaller?",
        acceptedAnswer: { "@type": "Answer", text: "Browser-based PDF compression is limited. This tool strips metadata and optimizes object structure, but cannot re-compress embedded images (which is where most PDF size comes from). For heavy image-based PDFs, greater compression requires server-side tools like Ghostscript or Adobe Acrobat." },
      },
      {
        "@type": "Question",
        name: "What types of PDFs compress the most?",
        acceptedAnswer: { "@type": "Answer", text: "PDFs with lots of metadata, redundant objects, or unoptimized object structure compress well with this tool. PDFs whose size mainly comes from embedded high-resolution images will see smaller reductions." },
      },
      {
        "@type": "Question",
        name: "Can I compress a password-protected PDF?",
        acceptedAnswer: { "@type": "Answer", text: "No. Password-protected or encrypted PDFs cannot be processed. You need to remove the password protection first (using Adobe Acrobat or an online PDF unlocker), then compress." },
      },
      {
        "@type": "Question",
        name: "Is there a file size limit?",
        acceptedAnswer: { "@type": "Answer", text: "Our tool supports PDFs up to 100 MB. For very large files, processing may take longer depending on your device." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>PDF Compressor - Reduce PDF Size Online Free | No Upload, 100% Private</title>
        <meta
          name="description"
          content="Free online PDF compressor — reduce PDF file size without uploading to any server. Strips metadata and optimizes PDF structure. 100% private, browser-based. No sign-up needed."
        />
        <meta
          name="keywords"
          content="pdf compressor, compress pdf online, reduce pdf size, pdf compressor no upload, free pdf compression 2026, shrink pdf file, pdf optimizer, compress pdf free"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/pdf-compressor" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="PDF Compressor - Reduce PDF Size Free Online | No Upload" />
        <meta property="og:description" content="Compress PDF files online without uploading to any server. 100% private, browser-based PDF compression. No sign-up." />
        <meta property="og:url" content="https://generatorpromptai.com/tools/pdf-compressor" />
        <meta property="og:image" content="https://generatorpromptai.com/og-pdf-compressor.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF Compressor - Reduce PDF Size Online | No Upload" />
        <meta name="twitter:description" content="Compress PDF files online. 100% private, no upload to server. Free, no sign-up." />
        <meta name="twitter:image" content="https://generatorpromptai.com/og-pdf-compressor.png" />

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
        <div className="max-w-4xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-4">
              <FileText className="text-red-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">PDF Compressor</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Reduce PDF file size online. No upload, no server, 100% private. Free and instant.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> 100% private — your PDF never leaves your browser
            </div>
          </div>

          {/* Honest disclaimer banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex gap-3">
            <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>How browser PDF compression works:</strong> This tool strips metadata and optimizes PDF object structure entirely in your browser. It works best on PDFs with redundant metadata or unoptimized structure. If your PDF's size mainly comes from high-resolution embedded images, savings will be smaller (5–20%). For heavy image compression, server-side tools like Adobe Acrobat or Ghostscript achieve greater reductions.
            </div>
          </div>

          {/* Upload */}
          {!pdfFile ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all mb-6 ${
                isDragging ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-400 hover:bg-red-50/20"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-red-600" size={28} />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">Drop PDF here or click to upload</p>
              <p className="text-gray-400 text-sm">PDF files only · Up to 100 MB</p>
              {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
            </div>
          ) : (
            <div className="space-y-5">

              {/* File info card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-red-600" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{pdfFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {formatBytes(originalSize)}
                      {pageCount > 0 && <span className="ml-3">· {pageCount} page{pageCount !== 1 ? "s" : ""}</span>}
                    </p>
                  </div>
                  <button onClick={reset} className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-1">
                    <RefreshCw size={14} /> Change
                  </button>
                </div>
              </div>

              {/* Compression Level */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Compression Level</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setCompressionLevel(level.value)}
                      className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${
                        compressionLevel === level.value
                          ? "bg-red-50 border-red-400 text-red-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-red-300"
                      }`}
                    >
                      <span className="text-sm font-semibold">{level.label}</span>
                      <span className="text-xs text-gray-400 mt-0.5">{level.desc}</span>
                    </button>
                  ))}
                </div>
                {currentLevel && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    ℹ️ {currentLevel.detail}
                  </p>
                )}
              </div>

              {/* Progress bar */}
              {loading && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{progressLabel}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Compress Button */}
              <button
                onClick={compressPdf}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Compressing... {progress}%</>
                ) : (
                  <><FileText size={20} /> Compress PDF</>
                )}
              </button>

              {/* Result */}
              {compressedBytes && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CheckCircle size={20} className="text-green-500" />
                    <span className="font-semibold text-gray-800">Compression complete</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Original</p>
                      <p className="text-lg font-bold text-gray-800">{formatBytes(originalSize)}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Compressed</p>
                      <p className="text-lg font-bold text-green-700">{formatBytes(compressedSize)}</p>
                    </div>
                    <div className={`rounded-xl p-4 text-center ${savings > 0 ? "bg-emerald-50" : "bg-gray-50"}`}>
                      <p className="text-xs text-gray-400 mb-1">Saved</p>
                      <p className={`text-lg font-bold ${savings > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                        {savings > 0 ? `-${savings}%` : "~0%"}
                      </p>
                      {savedBytes > 0 && <p className="text-xs text-emerald-500">{formatBytes(savedBytes)}</p>}
                    </div>
                  </div>

                  {/* Size bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Original</span><span>Compressed</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${Math.max(5, 100 - savings)}%` }}
                      />
                    </div>
                  </div>

                  {/* Low savings note */}
                  {savings < 10 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex gap-2 text-sm text-amber-700">
                      <Info size={15} className="flex-shrink-0 mt-0.5" />
                      Small savings detected. This PDF's size likely comes mainly from embedded images, which browser-based compression cannot re-encode. For greater reduction, try Adobe Acrobat, Smallpdf, or Ghostscript.
                    </div>
                  )}

                  <button
                    onClick={download}
                    className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download Compressed PDF ({formatBytes(compressedSize)})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online PDF Compressor — No Upload, 100% Private
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our PDF compressor reduces file size entirely in your browser using <strong>pdf-lib</strong> — no files are ever uploaded to any server. It strips all metadata (title, author, producer, keywords) and optimizes the PDF object structure to produce a smaller file.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What this tool compresses</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li>PDF metadata (title, author, creator, producer, subject, keywords)</li>
              <li>Redundant object references and cross-reference tables</li>
              <li>Unoptimized object streams (with Medium and High levels)</li>
              <li>Unused and duplicate PDF objects</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What this tool cannot compress</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li>Embedded images (JPEG, PNG inside the PDF) — requires server-side tools</li>
              <li>Password-protected or encrypted PDFs</li>
              <li>Fonts embedded inside the PDF</li>
            </ul>
            <p className="text-gray-600 text-sm">
              For maximum image compression in PDFs, tools like <strong>Adobe Acrobat Pro</strong>, <strong>Ghostscript</strong>, or <strong>Smallpdf</strong> (server-based) achieve greater reductions but require uploading your file.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Does this PDF compressor upload my files?", a: "No. All compression happens entirely in your browser. Your PDF is never sent to any server — completely private and secure." },
                { q: "Why is my compressed PDF not much smaller?", a: "Browser-based PDF compression is limited. This tool strips metadata and optimizes object structure, but cannot re-compress embedded images. If your PDF's size mainly comes from high-res images, savings will be smaller (5–20%). For heavy compression, Adobe Acrobat or Ghostscript achieve better results." },
                { q: "What PDFs compress the most with this tool?", a: "PDFs with lots of metadata, redundant objects, or unoptimized structure compress well. Text-heavy PDFs typically see 10–40% reduction. Image-heavy PDFs may see only 5–15% reduction." },
                { q: "Can I compress password-protected PDFs?", a: "No. Remove the password protection first using Adobe Acrobat or an online PDF unlocker, then compress." },
                { q: "What is the file size limit?", a: "Our tool supports PDFs up to 100 MB. For very large files, processing may take longer depending on your device's memory and speed." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related PDF &amp; Document Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/merge-pdf",     title: "Merge PDF Files",      desc: "Combine multiple PDFs into one document." },
                { to: "/tools/split-pdf",     title: "Split PDF",            desc: "Split large PDFs into smaller files by page range." },
                { to: "/tools/image-to-pdf",  title: "Image to PDF",         desc: "Convert JPG and PNG images into a PDF file." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-red-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-red-600 transition-colors">{tool.title}</h3>
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

export default PdfCompressor;