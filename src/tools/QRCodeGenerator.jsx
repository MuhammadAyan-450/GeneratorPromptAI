// pages/QRCodeGenerator.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { QRCodeSVG } from "qrcode.react";
import {
  Download, Copy, RefreshCw, QrCode, Home, ChevronDown,
  Hash, Type, Layers, Palette, AlertTriangle, CheckCircle2, FileText
} from "lucide-react";

// ─── Content type presets ─────────────────────────────────────────────────────
const PRESETS = [
  { label: "🔗 URL",        template: "https://",                                       hint: "Paste your full URL" },
  { label: "📶 WiFi",       template: "WIFI:T:WPA;S:NetworkName;P:Password;;",          hint: "Replace NetworkName and Password" },
  { label: "👤 vCard",      template: "BEGIN:VCARD\nVERSION:3.0\nFN:Full Name\nTEL:+923001234567\nEMAIL:email@example.com\nEND:VCARD", hint: "Edit name, phone and email" },
  { label: "📧 Email",      template: "mailto:email@example.com?subject=Hello&body=Hi", hint: "Replace email and subject" },
  { label: "💬 WhatsApp",   template: "https://wa.me/923001234567?text=Hello",          hint: "Replace phone number (with country code)" },
  { label: "📱 Phone",      template: "tel:+923001234567",                              hint: "Replace with phone number" },
  { label: "💬 SMS",        template: "smsto:+923001234567:Hello there!",               hint: "Replace phone and message" },
  { label: "📝 Plain Text", template: "",                                               hint: "Type any text" },
];

const SIZE_OPTIONS = [
  { value: 128, label: "128px — thumbnail" },
  { value: 256, label: "256px — screen use" },
  { value: 512, label: "512px — print small" },
  { value: 1024, label: "1024px — print large" },
];

const ERROR_LEVELS = [
  { value: "L", label: "Low — 7%",     desc: "Digital use only" },
  { value: "M", label: "Medium — 15%", desc: "Recommended default" },
  { value: "Q", label: "High — 25%",   desc: "With logo overlay" },
  { value: "H", label: "Max — 30%",    desc: "Print & curved surfaces" },
];

// ─── Contrast checker ─────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function relativeLuminance([r, g, b]) {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ─── Component ────────────────────────────────────────────────────────────────
const QRCodeGenerator = () => {
  const [text,         setText]         = useState("https://generatorpromptai.com");
  const [size,         setSize]         = useState(256);
  const [fgColor,      setFgColor]      = useState("#000000");
  const [bgColor,      setBgColor]      = useState("#ffffff");
  const [level,        setLevel]        = useState("M");
  const [activePreset, setActivePreset] = useState("🔗 URL");
  const [copied,       setCopied]       = useState(false);
  const [copiedImg,    setCopiedImg]    = useState(false);
  const [openFaq,      setOpenFaq]      = useState(null);
  const qrRef = useRef(null);

  const applyPreset = (preset) => {
    setActivePreset(preset.label);
    setText(preset.template);
  };

  const charCount = text.length;
  const contrast = fgColor.length === 7 && bgColor.length === 7 ? contrastRatio(fgColor, bgColor) : 21;
  const lowContrast = contrast < 3;

  const levelLabel = ERROR_LEVELS.find((l) => l.value === level)?.label.split(" — ")[0] || level;

  const getSVG = () => qrRef.current?.querySelector("svg");

  const getSVGString = (svg) =>
    "data:image/svg+xml;base64," +
    btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))));

  const downloadQR = (format = "png") => {
    if (!text.trim()) return;
    const svg = getSVG();
    if (!svg) return;

    if (format === "svg") {
      const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `qr-${Date.now()}.svg`; a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement("a");
      a.download = `qr-${Date.now()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = getSVGString(svg);
  };

  const copyText = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyQRImage = async () => {
    if (!text.trim()) return;
    const svg = getSVG();
    if (!svg) return;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = async () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      try {
        const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopiedImg(true);
        setTimeout(() => setCopiedImg(false), 2000);
      } catch {
        // fallback silent
      }
    };
    img.src = getSVGString(svg);
  };

  const reset = () => {
    setText("https://www.generatorpromptai.com");
    setSize(256); setFgColor("#000000"); setBgColor("#ffffff");
    setLevel("M"); setActivePreset("🔗 URL");
    setCopied(false); setCopiedImg(false);
  };

  const hasContent = text.trim().length > 0;

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Create Custom QR Code for WiFi URL WhatsApp Free Online – Download PNG SVG",
    "url": "https://www.generatorpromptai.com/tools/qr-code-generator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online QR code generator. Create custom QR codes for URLs, WiFi, vCard contacts, WhatsApp, email, SMS and more. Custom colors, sizes, error correction. Download as PNG or SVG. 100% private, no signup.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "QR Code Generator", "item": "https://www.generatorpromptai.com/tools/qr-code-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to create a QR code for a website URL free online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select the URL preset, paste your website link in the input box, and the QR code generates instantly. Choose your size and error correction level, then download as PNG or SVG. No signup required."
        }
      },
      {
        "@type": "Question",
        "name": "How to make a WiFi QR code for guests?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select the WiFi preset, replace 'NetworkName' with your WiFi SSID and 'Password' with your WiFi password. Guests can scan the QR to connect automatically without typing the password."
        }
      },
      {
        "@type": "Question",
        "name": "What error correction level should I use for QR code with logo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use High (25%) if adding a logo overlay in the center. Use Max (30%) for printed QR codes on curved surfaces like cups, bottles, or outdoor signage. Medium (15%) is fine for general digital use."
        }
      },
      {
        "@type": "Question",
        "name": "Can I create a WhatsApp chat QR code free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Select the WhatsApp preset, replace the phone number with your number including country code (e.g. 923001234567 for Pakistan), and optionally customize the pre-filled message. Download and share the QR."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best QR code size for printing on business cards?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Download at 512px for business cards and small print items. For A5-A4 prints use 1024px. For best quality on any size, download as SVG format which scales infinitely without quality loss."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Create Custom QR Code for WiFi URL WhatsApp Free Online – Download PNG SVG</title>

        <meta
          name="description"
          content="Free online QR code generator — create custom QR codes for URLs, WiFi, WhatsApp, vCard contacts, email and SMS. Custom colors, sizes, error correction. Download as PNG or SVG. No signup required."
        />

        <meta
          name="keywords"
          content="how to create a qr code for a website url free online, make wifi qr code for guests free no signup, custom qr code with logo and colors download free, whatsapp chat qr code generator with pre filled message, vcard contact qr code maker free online tool, create qr code for email and sms free download png, free qr code generator with error correction levels, best qr code size for printing business cards free, qr code generator download svg png high resolution, free online qr maker for restaurants menus and events 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/qr-code-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Create Custom QR Code Free – WiFi, URL, WhatsApp, vCard | Download PNG SVG" />
        <meta property="og:description" content="Generate custom QR codes for any purpose. URLs, WiFi, WhatsApp, contacts. Download PNG or SVG. Free, private, no signup." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/qr-code-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free QR Code Generator – URL, WiFi, WhatsApp, vCard" />
        <meta name="twitter:description" content="Create custom QR codes instantly. Download as PNG or SVG. Free online tool, no signup." />

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
              <li><span className="text-gray-900 font-semibold">QR Code Generator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <QrCode className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Create Custom QR Code for WiFi URL WhatsApp Free Online –{" "}
              <span className="text-sky-600">Download PNG SVG</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Generate custom QR codes for URLs, WiFi, WhatsApp, vCard, email and SMS. Custom colors, sizes, error correction. 100% private.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Content Type Presets */}
            <div className="mb-6">
              <label className={labelCls}>Content Type</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                      activePreset === p.label
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {PRESETS.find((p) => p.label === activePreset)?.hint && (
                <p className="text-xs text-gray-400 mt-2">
                  💡 {PRESETS.find((p) => p.label === activePreset).hint}
                </p>
              )}
            </div>

            {/* Text input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className={labelCls}>Content</label>
                <span className={`text-xs ${charCount > 900 ? "text-red-500 font-medium" : "text-gray-400"}`}>
                  {charCount} chars {charCount > 900 && "— QR may become complex"}
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL, WiFi details, contact info..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[130px] resize-y font-mono text-sm text-gray-800"
              />
            </div>

            {/* Size + Error level */}
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelCls}>Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className={inputCls}
                >
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Error Correction</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={inputCls}
                >
                  {ERROR_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label} — {l.desc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <label className={labelCls}>Colors</label>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Foreground (dots)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0" />
                    <input type="text" value={fgColor} onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setFgColor(e.target.value); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500" maxLength={7} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0" />
                    <input type="text" value={bgColor} onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBgColor(e.target.value); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500" maxLength={7} />
                  </div>
                </div>
              </div>
              {/* Contrast feedback */}
              <div className={`mt-3 text-xs px-3 py-2 rounded-xl ${
                lowContrast ? "bg-red-50 text-red-600 border border-red-200" :
                contrast < 4.5 ? "bg-amber-50 text-amber-600 border border-amber-200" :
                "bg-green-50 text-green-600 border border-green-200"
              }`}>
                Contrast ratio: <strong>{contrast.toFixed(1)}:1</strong> —{" "}
                {lowContrast ? "⚠️ Too low — QR may not scan" :
                 contrast < 4.5 ? "⚠️ Marginal — may struggle in low light" :
                 "✅ Good contrast — scannable"}
              </div>
            </div>

            {/* Copy Text + Reset */}
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button onClick={copyText} disabled={!text.trim()} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                {copied ? <CheckCircle2 size={15} className="text-green-500" /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                <RefreshCw size={15} /> Reset
              </button>
            </div>

            {/* ── Result Section ── */}
            {hasContent && (
              <div className="mt-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Hash size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{charCount}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Characters</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Layers size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{size}px</p>
                    <p className="text-xs text-gray-500 mt-0.5">Download Size</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><AlertTriangle size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{levelLabel}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Error Correction</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Palette size={20} /></div>
                    <p className={`text-lg font-bold ${
                      lowContrast ? "text-red-600" : contrast < 4.5 ? "text-amber-600" : "text-green-600"
                    }`}>{contrast.toFixed(1)}:1</p>
                    <p className="text-xs text-gray-500 mt-0.5">Contrast</p>
                  </div>
                </div>

                {/* Dark Output Block — QR Preview */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">Live QR Code Preview</p>
                  <div className="flex justify-center">
                    <div
                      ref={qrRef}
                      className="p-5 rounded-xl inline-block"
                      style={{ backgroundColor: bgColor }}
                    >
                      <QRCodeSVG
                        value={text || "https://generatorpromptai.com"}
                        size={Math.min(size, 240)}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level={level}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Preview at {Math.min(size, 240)}px · Downloads at {size}px
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => downloadQR("png")}
                    disabled={!text.trim()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40"
                  >
                    <Download size={15} /> Download PNG
                  </button>
                  <button
                    onClick={() => downloadQR("svg")}
                    disabled={!text.trim()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40"
                  >
                    <Download size={15} /> Download SVG
                  </button>
                  <button
                    onClick={copyQRImage}
                    disabled={!text.trim()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors disabled:opacity-40"
                  >
                    {copiedImg ? <CheckCircle2 size={15} className="text-green-500" /> : <Copy size={15} />}
                    {copiedImg ? "Copied!" : "Copy as Image"}
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasContent && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <QrCode size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Enter content above to <strong className="text-gray-500">generate a QR code</strong></p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free QR Code Generator — URL, WiFi, WhatsApp, vCard &amp; More
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free QR code generator creates custom, high-quality QR codes for any use case — all processed <strong>100% in your browser</strong>. No data is ever sent to any server, making it completely private. Generate QR codes for website URLs, WiFi credentials, WhatsApp messages, vCard contacts, email addresses, phone numbers, and plain text.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Customize foreground and background colors with a built-in contrast ratio checker to ensure your QR code remains scannable. Choose from 4 error correction levels depending on your use case — from digital-only to curved surface printing. Download in PNG for raster use or SVG for infinite scalability without quality loss.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Create a QR Code for WiFi URL WhatsApp Free Online
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Select the <strong>content type</strong> — URL, WiFi, WhatsApp, vCard, Email, Phone, SMS, or Plain Text.</li>
              <li><strong>Edit the content</strong> in the text area (replace placeholder values with your actual data).</li>
              <li>Choose <strong>size</strong> (128–1024px) and <strong>error correction level</strong> based on where you'll use the QR.</li>
              <li>Optionally customize <strong>foreground and background colors</strong> — the contrast checker warns you if scannability is at risk.</li>
              <li><strong>Download as PNG</strong> (for print/screen) or <strong>SVG</strong> (for infinite scaling), or <strong>copy as image</strong> to clipboard.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Custom QR Code Maker with Logo and Colors – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "8 Content Type Presets", desc: "One-click templates for URL, WiFi, vCard, WhatsApp, Email, Phone, SMS, and Plain Text. Each preset pre-fills the correct format so you just edit the values." },
                { title: "Built-in Contrast Ratio Checker", desc: "Real-time contrast analysis between foreground and background colors warns you if the QR may not scan — preventing unscannable codes from poor color choices." },
                { title: "4 Error Correction Levels", desc: "Low (7%) for digital use, Medium (15%) as default, High (25%) for logo overlays, and Max (30%) for printed materials on curved or outdoor surfaces." },
                { title: "PNG & SVG Download + Clipboard Copy", desc: "Download at sizes from 128px to 1024px. PNG for raster use, SVG for infinite scalability. Copy the QR image directly to clipboard for pasting into documents." }
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
              QR Code Generator – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to create a QR code for a website URL free online?",
                  a: "Select the URL preset, paste your website link in the input box, and the QR code generates instantly. Choose your size and error correction level, then download as PNG or SVG. No signup required."
                },
                {
                  q: "How to make a WiFi QR code for guests?",
                  a: "Select the WiFi preset, replace 'NetworkName' with your WiFi SSID and 'Password' with your WiFi password. Guests can scan the QR to connect automatically without typing the password."
                },
                {
                  q: "What error correction level should I use for QR code with logo?",
                  a: "Use High (25%) if adding a logo overlay in the center. Use Max (30%) for printed QR codes on curved surfaces like cups, bottles, or outdoor signage. Medium (15%) is fine for general digital use."
                },
                {
                  q: "Can I create a WhatsApp chat QR code free?",
                  a: "Yes. Select the WhatsApp preset, replace the phone number with your number including country code (e.g. 923001234567 for Pakistan), and optionally customize the pre-filled message. Download and share the QR."
                },
                {
                  q: "What is the best QR code size for printing on business cards?",
                  a: "Download at 512px for business cards and small print items. For A5-A4 prints use 1024px. For best quality on any size, download as SVG format which scales infinitely without quality loss."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Design &amp; Utility Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/image-to-text", title: "Image to Text (OCR)", desc: "Extract text from images to use as QR code content." },
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Generate test vCard data and contact info for QR testing." },
                { to: "/tools/password-generator", title: "Password Generator", desc: "Generate secure WiFi passwords before creating a QR code." }
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

export default QRCodeGenerator;