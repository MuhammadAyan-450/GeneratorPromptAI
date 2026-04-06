// pages/PdfToWord.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import {
  ArrowLeft, Upload, Download, Loader2, FileText,
  RefreshCw, AlertCircle, Copy, CheckCircle, Shield, Info
} from "lucide-react";

// ─── PDF.js worker ────────────────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const k = 1024, sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// ─── Component ────────────────────────────────────────────────────────────────
const PdfToWord = () => {
  const [pdfFile,       setPdfFile]       = useState(null);
  const [pageCount,     setPageCount]     = useState(0);
  const [fullText,      setFullText]      = useState("");
  const [editableText,  setEditableText]  = useState("");
  const [loading,       setLoading]       = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [error,         setError]         = useState(null);
  const [copied,        setCopied]        = useState(false);
  const [isDragging,    setIsDragging]    = useState(false);
  const [toast,         setToast]         = useState("");
  const fileInputRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleFile = (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please select a valid PDF file (.pdf)"); return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Please use a PDF under 50 MB."); return;
    }
    setError(null);
    setPdfFile(file);
    setFullText(""); setEditableText(""); setProgress(0); setPageCount(0);
  };

  const convertToWord = async () => {
    if (!pdfFile) return;
    setLoading(true); setError(null);
    setProgress(5); setProgressLabel("Reading PDF...");

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      setProgress(15); setProgressLabel("Loading PDF engine...");

      let pdf;
      try {
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      } catch (e) {
        if (e.message?.toLowerCase().includes("password") || e.message?.toLowerCase().includes("encrypt")) {
          throw new Error("encrypted");
        }
        throw e;
      }

      const numPages = pdf.numPages;
      setPageCount(numPages);
      setProgress(25); setProgressLabel(`Extracting text from ${numPages} pages...`);

      const paragraphs = [];
      let allText = "";

      for (let p = 1; p <= numPages; p++) {
        const page    = await pdf.getPage(p);
        const content = await page.getTextContent();

        // Group items into lines by vertical position
        const lineMap = {};
        content.items.forEach((item) => {
          const y = Math.round(item.transform[5]);
          if (!lineMap[y]) lineMap[y] = [];
          lineMap[y].push(item.str);
        });

        const lines = Object.keys(lineMap)
          .sort((a, b) => b - a) // top to bottom
          .map((y) => lineMap[y].join(" ").trim())
          .filter(Boolean);

        // Group lines into paragraphs (blank line = new paragraph)
        let currentPara = [];
        lines.forEach((line) => {
          if (line.length === 0) {
            if (currentPara.length) { paragraphs.push(currentPara.join(" ")); currentPara = []; }
          } else {
            currentPara.push(line);
          }
        });
        if (currentPara.length) paragraphs.push(currentPara.join(" "));

        // Page separator
        if (p < numPages) paragraphs.push(`--- Page ${p} ---`);
        allText += lines.join("\n") + "\n\n";

        setProgress(25 + Math.round((p / numPages) * 55));
        setProgressLabel(`Extracting page ${p} of ${numPages}...`);
      }

      const cleanText = allText.trim();
      if (!cleanText) throw new Error("empty");

      setFullText(cleanText);
      setEditableText(cleanText);
      setProgress(85); setProgressLabel("Building Word document...");

      // Build DOCX
      const docxParagraphs = paragraphs
        .filter((p) => p.trim())
        .map((para) => {
          const isPageSep = para.startsWith("--- Page");
          return new Paragraph({
            children: [new TextRun({
              text: isPageSep ? para : para.trim(),
              size: isPageSep ? 18 : 24,
              color: isPageSep ? "888888" : "000000",
              font: "Calibri",
              italics: isPageSep,
            })],
            spacing: { after: isPageSep ? 120 : 200 },
          });
        });

      const doc = new Document({
        creator: "GeneratorPromptAI",
        title:   pdfFile.name.replace(/\.pdf$/i, ""),
        sections: [{ children: docxParagraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const filename = pdfFile.name.replace(/\.pdf$/i, "") || "converted";
      saveAs(blob, `${filename}.docx`);

      setProgress(100); setProgressLabel("Done!");
      showToast("Word document downloaded!");
    } catch (err) {
      console.error(err);
      if (err.message === "encrypted" || err.message?.toLowerCase().includes("password")) {
        setError("This PDF is password-protected. Remove the password first, then convert.");
      } else if (err.message === "empty") {
        setError("No readable text found. This PDF may be scanned or image-based. Use our Image to Text (OCR) tool instead.");
      } else {
        setError("Conversion failed. The file may be corrupted or use unsupported features.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadWord = async () => {
    if (!editableText) return;
    setProgressLabel("Rebuilding document with your edits...");

    const paragraphs = editableText
      .split("\n")
      .filter((p) => p.trim())
      .map((para) => new Paragraph({
        children: [new TextRun({ text: para.trim(), size: 24, font: "Calibri" })],
        spacing: { after: 200 },
      }));

    const doc  = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const name = pdfFile?.name.replace(/\.pdf$/i, "") || "converted";
    saveAs(blob, `${name}.docx`);
    showToast("Updated Word document downloaded!");
  };

  const copyText = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true); showToast("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setPdfFile(null); setFullText(""); setEditableText(""); setError(null);
    setProgress(0); setProgressLabel(""); setPageCount(0); setCopied(false);
  };

  const wordCount = editableText.trim() ? editableText.trim().split(/\s+/).length : 0;
  const charCount = editableText.length;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF to Word Converter",
    url: "https://www.generatorpromptai.com/tools/pdf-to-word",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free online PDF to Word converter. Extract text from PDF and download as editable .docx file. 100% browser-based, no upload to server.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does this PDF to Word converter upload my files?",
        acceptedAnswer: { "@type": "Answer", text: "No. All conversion happens entirely in your browser. Your PDF is never uploaded to any server — 100% private and secure." },
      },
      {
        "@type": "Question",
        name: "Will the Word document look exactly like the PDF?",
        acceptedAnswer: { "@type": "Answer", text: "No. Browser-based PDF to Word conversion extracts plain text only. Complex formatting like tables, columns, images, and special layouts are not preserved. For perfect formatting preservation, use Adobe Acrobat or Microsoft Word's built-in PDF import." },
      },
      {
        "@type": "Question",
        name: "Why is my PDF showing no text?",
        acceptedAnswer: { "@type": "Answer", text: "Your PDF is likely scanned or image-based — the text is stored as an image, not selectable text. Use our Image to Text (OCR) tool to extract text from image-based PDFs." },
      },
      {
        "@type": "Question",
        name: "What types of PDFs work best?",
        acceptedAnswer: { "@type": "Answer", text: "Text-based PDFs (articles, resumes, reports, ebooks) where you can select and copy text in your PDF viewer work best. Scanned documents, image PDFs, and PDFs with complex tables will give limited results." },
      },
      {
        "@type": "Question",
        name: "Can I edit the extracted text before downloading?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. After conversion, the extracted text appears in an editable text area. Make any corrections you need, then click Download Word Doc to save your edited version." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>PDF to Word Converter - Free Online PDF to DOCX | No Upload, 100% Private</title>
        <meta
          name="description"
          content="Free online PDF to Word converter — extract text from PDF and download as editable .docx file. Edit extracted text before downloading. 100% browser-based, no upload. No sign-up needed."
        />
        <meta
          name="keywords"
          content="pdf to word converter, pdf to docx, convert pdf to word free, pdf to word online, extract text from pdf, pdf to editable word, free pdf converter 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/pdf-to-word" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="PDF to Word Converter - Free Online PDF to DOCX | No Upload" />
        <meta property="og:description" content="Convert PDF to editable Word document online. Extract text, edit it, then download as .docx. 100% private, no upload." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/pdf-to-word" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-pdf-to-word.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF to Word Converter - PDF to DOCX Online" />
        <meta name="twitter:description" content="Convert PDF to editable Word doc online. Edit extracted text before downloading. Free, private, no upload." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-pdf-to-word.png" />

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
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mb-4">
              <FileText className="text-blue-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">PDF to Word Converter</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Extract text from PDF and download as editable .docx. Edit before downloading. Free and private.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield size={13} /> 100% private — your PDF never leaves your browser
            </div>
          </div>

          {/* Honest disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex gap-3">
            <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 leading-relaxed">
              <strong>What to expect:</strong> This tool extracts plain text from your PDF and saves it as a .docx file. Complex formatting — tables, multi-column layouts, images, and special fonts — are <strong>not preserved</strong>. For perfect layout preservation, use Microsoft Word's built-in "Open PDF" feature or Adobe Acrobat Pro. This tool is best for articles, resumes, ebooks, and reports where the text content matters more than the layout.
            </div>
          </div>

          {/* Upload */}
          {!pdfFile ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all mb-6 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/20"
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-blue-600" size={28} />
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">Drop PDF here or click to upload</p>
              <p className="text-gray-400 text-sm">Best for text-based PDFs · Up to 50 MB</p>
              {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
            </div>
          ) : (
            <div className="space-y-5">

              {/* File info */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-blue-600" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{pdfFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {formatBytes(pdfFile.size)}
                      {pageCount > 0 && <span className="ml-3">· {pageCount} page{pageCount !== 1 ? "s" : ""}</span>}
                    </p>
                  </div>
                  <button onClick={reset} className="text-gray-400 hover:text-blue-500 transition-colors text-sm flex items-center gap-1">
                    <RefreshCw size={14} /> Change
                  </button>
                </div>
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
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 text-sm">{error}</p>
                    {error.includes("scanned") && (
                      <Link to="/tools/image-to-text" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                        → Try our Image to Text (OCR) tool instead
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Convert Button */}
              {!editableText && (
                <button
                  onClick={convertToWord}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> Converting... {progress}%</>
                  ) : (
                    <><FileText size={20} /> Convert to Word (.docx)</>
                  )}
                </button>
              )}

              {/* Extracted text editor */}
              {editableText && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="font-semibold text-gray-800">Text extracted — edit before downloading</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyText}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        {copied ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
                        {copied ? "Copied!" : "Copy text"}
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-gray-400 mb-3">
                    <span><strong className="text-gray-600">{wordCount.toLocaleString()}</strong> words</span>
                    <span><strong className="text-gray-600">{charCount.toLocaleString()}</strong> characters</span>
                    {pageCount > 0 && <span><strong className="text-gray-600">{pageCount}</strong> pages processed</span>}
                  </div>

                  {/* Editable textarea */}
                  <textarea
                    value={editableText}
                    onChange={(e) => setEditableText(e.target.value)}
                    className="w-full h-72 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    spellCheck={false}
                  />
                  <p className="text-xs text-gray-400 mt-2">Edit the text above if needed, then download.</p>

                  {/* Download buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={downloadWord}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={17} /> Download Word Doc (.docx)
                    </button>
                    <button
                      onClick={reset}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <RefreshCw size={15} /> New PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free PDF to Word Converter — Extract &amp; Edit PDF Text
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our PDF to Word converter extracts all text from your PDF and creates a downloadable .docx file — entirely in your browser. No files are uploaded to any server. Open the downloaded file in Microsoft Word, Google Docs, or LibreOffice to continue editing.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What works well</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li>Articles, blog posts, and news documents</li>
              <li>Resumes and CVs where layout is simple</li>
              <li>Ebooks and research papers (text content)</li>
              <li>Reports and plain text documents</li>
              <li>Contracts and agreements with paragraph text</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Limitations to know</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li>Tables and multi-column layouts become plain text</li>
              <li>Images embedded in PDFs are not extracted</li>
              <li>Scanned/image-based PDFs have no selectable text — use our <Link to="/tools/image-to-text" className="text-blue-600 hover:underline">Image to Text OCR tool</Link> instead</li>
              <li>Password-protected PDFs need to be unlocked first</li>
            </ul>
            <p className="text-gray-500 text-sm">
              For perfect formatting preservation, use Microsoft Word's built-in "Open PDF" feature (File → Open → your PDF) or Adobe Acrobat Pro.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Does this PDF to Word converter upload my files?", a: "No. All conversion happens entirely in your browser. Your PDF is never sent to any server — completely private and secure." },
                { q: "Will the Word document look exactly like the PDF?", a: "No. This tool extracts plain text only. Tables, columns, images, and complex layouts are not preserved. For perfect layout preservation, use Microsoft Word's built-in PDF import or Adobe Acrobat Pro." },
                { q: "Why does my PDF show no text after conversion?", a: "Your PDF is likely scanned or image-based — the content is stored as images, not selectable text. Use our Image to Text (OCR) tool to extract text from image-based PDFs." },
                { q: "Can I edit the extracted text before downloading?", a: "Yes. After conversion, the text appears in an editable text area. Make corrections or edits, then click Download Word Doc to save your modified version." },
                { q: "What is the file size limit?", a: "Our tool supports PDFs up to 50 MB. For very large files, processing may take longer depending on your device." },
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
                { to: "/tools/pdf-compressor",  title: "PDF Compressor",       desc: "Reduce PDF file size without uploading to server." },
                { to: "/tools/image-to-text",   title: "Image to Text (OCR)",  desc: "Extract text from scanned and image-based PDFs." },
                { to: "/tools/image-to-pdf",    title: "Image to PDF",         desc: "Convert JPG and PNG images into a PDF file." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
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

export default PdfToWord;