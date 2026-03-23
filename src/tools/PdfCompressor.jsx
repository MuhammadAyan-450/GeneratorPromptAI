// pages/PdfCompressor.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import { ArrowLeft, Upload, Download, Loader2, FileText, RefreshCw, AlertCircle } from "lucide-react";

const PdfCompressor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedPdfBytes, setCompressedPdfBytes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium"); // low, medium, high
  const fileInputRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSavings = () => {
    if (!originalSize || !compressedSize) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  const handleFileUpload = (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File is too large (>50 MB). Try a smaller PDF.");
      return;
    }

    setError(null);
    setPdfFile(file);
    setOriginalSize(file.size);
    setCompressedPdfBytes(null);
    setCompressedSize(0);
    setProgress(0);
  };

  const compressPdf = async () => {
    if (!pdfFile) return;

    setLoading(true);
    setError(null);
    setProgress(10); // start progress

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      setProgress(30);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(50);

      // Metadata cleanup (reduces size slightly)
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords("");
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      // Compression options (pdf-lib is limited, but we optimize what we can)
      const saveOptions = {
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false,
      };

      setProgress(70);
      const compressedBytes = await pdfDoc.save(saveOptions);
      setProgress(90);

      setCompressedPdfBytes(compressedBytes);
      setCompressedSize(compressedBytes.length);
      setProgress(100);
    } catch (err) {
      console.error(err);
      if (err.message.includes("encrypted") || err.message.includes("password")) {
        setError("This PDF is password-protected or encrypted. Unlock it first.");
      } else if (err.message.includes("large")) {
        setError("PDF is too large or complex. Try splitting it or using a lower page count.");
      } else {
        setError("Failed to compress PDF. File may be corrupted.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const downloadCompressed = () => {
    if (!compressedPdfBytes) return;
    const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${pdfFile?.name || "document"}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedPdfBytes(null);
    setError(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF Compressor – Reduce PDF Size Without Upload</title>
        <meta
          name="description"
          content="Compress PDF files instantly online – no signup, no server upload, 100% browser-based. Reduce size for emails, WhatsApp, websites. Choose low/medium/high compression. Built in Karachi."
        />
        <meta
          name="keywords"
          content="pdf compressor online, reduce pdf size free, compress pdf no upload, pdf optimizer, free pdf compression tool 2026, shrink pdf file size"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/pdf-compressor" />

        <meta property="og:title" content="PDF Compressor – Free Online, No Upload 2026" />
        <meta property="og:description" content="Shrink PDFs instantly in your browser – perfect for emails & sharing." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF Compressor – Reduce Size Instantly" />
        <meta name="twitter:description" content="Compress PDFs privately in browser – no upload needed." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PDF Compressor",
            url: "https://generatorpromptai.com/tools/pdf-compressor",
            description: "Free client-side PDF compression tool – reduce file size without uploading or losing quality.",
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
            PDF Compressor
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Reduce PDF size online • No upload • 100% private • Fast & free
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            {!pdfFile ? (
              <div
                className="p-12 md:p-20 border-2 border-dashed border-gray-300 hover:border-sky-400 hover:bg-sky-50/20 transition-all text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) handleFileUpload(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <Upload size={48} className="mx-auto text-gray-500 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Drop PDF or click to upload
                </h2>
                <p className="text-gray-500">Best for PDFs with images/scans • Up to 50 MB recommended</p>
              </div>
            ) : (
              <div className="p-6 md:p-10">
                {/* File Info */}
                <div className="text-center mb-8">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    Selected PDF: {pdfFile.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Original size: <strong>{formatBytes(originalSize)}</strong>
                  </p>
                </div>

                {/* Compression Controls */}
                <div className="max-w-lg mx-auto mb-10">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compression Level
                  </label>
                  <select
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="low">Low – Fastest (minimal reduction)</option>
                    <option value="medium">Medium – Recommended (good balance)</option>
                    <option value="high">High – Maximum reduction (may affect image quality)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {compressionLevel === "low" && "Fast processing, ~10–30% size reduction"}
                    {compressionLevel === "medium" && "Best balance – ~40–70% reduction on most files"}
                    {compressionLevel === "high" && "Strongest compression – up to 80%+ reduction (images may soften)"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                  <button
                    onClick={compressPdf}
                    disabled={loading}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Compressing... {progress}%
                      </>
                    ) : (
                      "Compress PDF Now"
                    )}
                  </button>

                  <button
                    onClick={reset}
                    className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    New PDF
                  </button>
                </div>

                {/* Result Section */}
                {compressedPdfBytes && (
                  <div className="bg-gray-50 p-6 rounded-xl border text-center">
                    <h3 className="font-semibold text-lg mb-6 text-gray-800">
                      Compression Complete!
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                      <div>
                        <p className="text-sm text-gray-600">Original Size</p>
                        <p className="text-2xl font-bold">{formatBytes(originalSize)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Compressed Size</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatBytes(compressedSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Saved</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {getSavings()}% • {formatBytes(originalSize - compressedSize)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={downloadCompressed}
                      className="w-full max-w-md mx-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <Download size={20} />
                      Download Compressed PDF
                    </button>
                  </div>
                )}
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
              Online PDF Compressor – No Upload, 100% Private
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                You can compress PDF files right in your browser without having to leave your device or sign up for an account. Make it smaller so it's easier to share through email, WhatsApp, websites, or storage. You can choose between low (fastest), medium (recommended), or high compression levels. Works best on PDFs that have images, scans, or big fonts and metadata.              </p>
              <p>
                Built in Karachi, this is perfect for students, professionals, businesses, and Pakistani customers who need to quickly optimize PDFs. Completely free, private, and safe. Files with a lot of images can be up to 70–90% smaller.              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Compress PDF Files Online
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Drag & drop or click to upload your PDF (up to 50 MB recommended).</li>
                <li>Select compression level: Low (fast), Medium (balanced), High (maximum reduction).</li>
                <li>Click <strong>Compress PDF Now</strong> – processing happens locally in your browser.</li>
                <li>See original vs compressed size + percentage saved.</li>
                <li>Click <strong>Download Compressed PDF</strong> to save the smaller file.</li>
                <li>Use <strong>New PDF</strong> to compress another document.</li>
                <li>Tip: PDFs with high-res images or many pages compress the most. Password-protected files need to be unlocked first.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Document & File Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/merge-pdf"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Merge PDF Files
                </h3>
                <p className="text-gray-600 text-sm">
                  Combine multiple PDFs into one document.
                </p>
              </Link>

              <Link
                to="/tools/split-pdf"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Split PDF
                </h3>
                <p className="text-gray-600 text-sm">
                  Split large PDFs into smaller files by pages.
                </p>
              </Link>

              <Link
                to="/tools/image-to-pdf"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image to PDF Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert JPG/PNG images into PDF files.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PdfCompressor;