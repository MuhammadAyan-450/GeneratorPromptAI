// pages/PdfToWord.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { ArrowLeft, Upload, Download, Loader2, FileText, RefreshCw, AlertCircle } from "lucide-react";

// Set worker source (reliable CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToWord = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [extractedTextPreview, setExtractedTextPreview] = useState(""); // short preview
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please select a valid PDF file (.pdf)");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError("File is too large (>30 MB). Try a smaller PDF or split it first.");
      return;
    }

    setError(null);
    setPdfFile(file);
    setExtractedTextPreview("");
    setProgress(0);
  };

  const convertPdfToWord = async () => {
    if (!pdfFile) return;

    setLoading(true);
    setError(null);
    setProgress(5);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      setProgress(20);

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setProgress(30);

      let fullText = "";
      const numPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        fullText += pageText + "\n\n";

        setProgress(30 + Math.round((pageNum / numPages) * 60));
      }

      setProgress(90);

      // Short preview (first ~800 chars or first 2 paragraphs)
      const previewLines = fullText.split("\n\n").slice(0, 2).join("\n\n");
      const preview = previewLines.substring(0, 800) + (previewLines.length > 800 ? "..." : "");
      setExtractedTextPreview(preview || "(No readable text detected – may be scanned/image-based PDF)");

      // Create clean DOCX
      const doc = new Document({
        creator: "GeneratePromptAI",
        title: pdfFile.name.replace(".pdf", ""),
        description: "Converted from PDF using GeneratePromptAI",
        sections: [{
          properties: {},
          children: fullText
            .split("\n\n")
            .filter(para => para.trim())
            .map(para => new Paragraph({
              children: [new TextRun({
                text: para.trim(),
                size: 24, // 12pt
                font: "Calibri"
              })]
            }))
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${pdfFile.name.replace(".pdf", "") || "converted"}.docx`);

      setProgress(100);
    } catch (err) {
      console.error(err);
      if (err.message.includes("password") || err.message.includes("encrypted")) {
        setError("This PDF is password-protected or encrypted. Unlock it first.");
      } else if (err.message.includes("large") || err.message.includes("memory")) {
        setError("PDF is too large or complex. Try a smaller file (<10 MB) or text-only PDF.");
      } else {
        setError("Conversion failed. File may be scanned (image-based) – try OCR tool instead.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setExtractedTextPreview("");
    setError(null);
    setProgress(0);
  };

  return (
    <>
      <Helmet>
        <title>PDF to Word Converter – Extract Text to Document</title>
        <meta
          name="description"
          content="Convert PDF to editable Word (.docx) instantly online – no signup, no upload to servers. Extract text from articles, resumes, books, reports. 100% browser-based, private & fast. Built in Karachi."
        />
        <meta
          name="keywords"
          content="pdf to word converter online, convert pdf to docx free, pdf to word no signup, extract text from pdf, pdf to editable word 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/pdf-to-word" />

        <meta property="og:title" content="PDF to Word Converter – Free Online 2026" />
        <meta property="og:description" content="Turn PDFs into editable Word documents instantly – no upload needed." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF to Word Converter" />
        <meta name="twitter:description" content="Extract & convert PDF text to editable .docx – private & instant." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PDF to Word Converter",
            url: "https://generatorpromptai.com/tools/pdf-to-word",
            description: "Free client-side tool to convert PDF files to editable Word (.docx) documents.",
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
            PDF to Word Converter
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Convert PDF → Editable .docx • Extract text • No upload • Free & private
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
                <p className="text-gray-500">Best for text-based PDFs (articles, resumes, reports)</p>
              </div>
            ) : (
              <div className="p-6 md:p-10">
                {/* File Info */}
                <div className="text-center mb-8">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    Selected PDF: {pdfFile.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Size: {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Progress & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                  <button
                    onClick={convertPdfToWord}
                    disabled={loading}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Converting... {progress}%
                      </>
                    ) : (
                      <>
                        <FileText size={20} />
                        Convert to Word (.docx)
                      </>
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

                {/* Text Preview */}
                {extractedTextPreview && (
                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                      Extracted Text Preview
                    </h3>
                    <div className="max-h-60 overflow-y-auto p-4 bg-white rounded-lg font-sans text-sm whitespace-pre-wrap leading-relaxed border">
                      {extractedTextPreview}
                    </div>
                    <p className="text-sm text-gray-500 mt-3 italic">
                      Full text is saved in the downloaded .docx file
                    </p>
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
              PDF to Word Converter – Extract & Edit Text
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                You can quickly change any PDF into a fully editable Word (.docx) document without having to sign up or upload it to a server. Everything stays in your browser. You can get text from reports, resumes, articles, books, invoices, research papers, or contracts. Great for quickly editing PDFs that have been scanned or typed.
              </p>
              <p>
                Built in Karachi, this is perfect for students, professionals, freelancers, and Pakistani users who need to quickly convert PDFs to Word. It's private, safe, and totally free. Works best with searchable/text PDFs. If you have scanned/image PDFs, try our Image-to-Text OCR tool first.              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Convert PDF to Word Online
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Drag & drop or click to upload your PDF (best for text-based files under 20 MB).</li>
                <li>Wait while text is extracted from every page (progress shown).</li>
                <li>See a short preview of extracted text below.</li>
                <li>Full converted .docx file auto-downloads when ready.</li>
                <li>Open in Microsoft Word, Google Docs, or LibreOffice to edit.</li>
                <li>Click <strong>New PDF</strong> to convert another file.</li>
                <li>Tip: For scanned/image-based PDFs, use our Image-to-Text (OCR) tool first to extract text.</li>
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
                to="/tools/pdf-compressor"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  PDF Compressor
                </h3>
                <p className="text-gray-600 text-sm">
                  Reduce PDF file size without quality loss.
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
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PdfToWord;