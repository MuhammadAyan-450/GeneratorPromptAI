// pages/QRCodeGenerator.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, Copy, RefreshCw, CheckCircle2, QrCode } from "lucide-react";

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
  const [text,        setText]        = useState("https://generatorpromptai.com");
  const [size,        setSize]        = useState(256);
  const [fgColor,     setFgColor]     = useState("#000000");
  const [bgColor,     setBgColor]     = useState("#ffffff");
  const [level,       setLevel]       = useState("M");
  const [activePreset,setActivePreset]= useState("🔗 URL");
  const [copied,      setCopied]      = useState(false);
  const [copiedImg,   setCopiedImg]   = useState(false);
  const [toast,       setToast]       = useState("");
  const qrRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const applyPreset = (preset) => {
    setActivePreset(preset.label);
    setText(preset.template);
  };

  const charCount   = text.length;
  const contrast    = fgColor.length === 7 && bgColor.length === 7 ? contrastRatio(fgColor, bgColor) : 21;
  const lowContrast = contrast < 3;

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
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `qr-${Date.now()}.svg`; a.click();
      URL.revokeObjectURL(url);
      showToast("SVG downloaded!");
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
      showToast("PNG downloaded!");
    };
    img.src = getSVGString(svg);
  };

  const copyText = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopied(true); showToast("Text copied!");
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
        setCopiedImg(true); showToast("QR image copied to clipboard!");
        setTimeout(() => setCopiedImg(false), 2000);
      } catch {
        showToast("Copy failed — try Download PNG instead.");
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

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QR Code Generator",
    url: "https://www.generatorpromptai.com/tools/qr-code-generator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free online QR code generator. Create custom QR codes for URLs, WiFi, vCard contacts, WhatsApp, email, SMS and more. Download as PNG or SVG. 100% private.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I create a QR code for a website?",
        acceptedAnswer: { "@type": "Answer", text: "Select the URL preset, paste your website link in the input box, and your QR code generates instantly. Download as PNG or SVG to use it anywhere." },
      },
      {
        "@type": "Question",
        name: "How do I make a WiFi QR code?",
        acceptedAnswer: { "@type": "Answer", text: "Select the WiFi preset, replace 'NetworkName' with your WiFi SSID and 'Password' with your WiFi password. The QR code lets anyone scan it to connect automatically." },
      },
      {
        "@type": "Question",
        name: "What error correction level should I use?",
        acceptedAnswer: { "@type": "Answer", text: "Use Medium (15%) for digital use on screens. Use High (25%) if adding a logo overlay. Use Max (30%) for printed QR codes on curved surfaces like cups, bottles, or labels." },
      },
      {
        "@type": "Question",
        name: "Can I add a logo to my QR code?",
        acceptedAnswer: { "@type": "Answer", text: "Set error correction to High (25%) or Max (30%), download the QR PNG, then overlay your logo using any image editor. Higher error correction means the QR can still scan even with part of it covered." },
      },
      {
        "@type": "Question",
        name: "What is the best size for a QR code?",
        acceptedAnswer: { "@type": "Answer", text: "256px for screens and social media. 512px for small print items like business cards. 1024px for large print like posters and banners. Always download the largest size you need." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>QR Code Generator - Free Custom QR Codes for URL, WiFi, WhatsApp & More</title>
        <meta
          name="description"
          content="Free online QR code generator — create custom QR codes for URLs, WiFi, WhatsApp, vCard contacts, email and SMS. Custom colors, sizes, error correction. Download PNG or SVG. No sign-up."
        />
        <meta
          name="keywords"
          content="qr code generator, custom qr code, qr code for website, wifi qr code, whatsapp qr code, vcard qr code, free qr code maker 2026, qr code download png svg"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/qr-code-generator" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="QR Code Generator - Free Custom QR Codes | URL, WiFi, WhatsApp" />
        <meta property="og:description" content="Create custom QR codes for URLs, WiFi, WhatsApp, contacts and more. Download PNG or SVG. Free, no sign-up." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/qr-code-generator" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-qr-code-generator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free QR Code Generator - URL, WiFi, WhatsApp, vCard" />
        <meta name="twitter:description" content="Create custom QR codes instantly. Download as PNG or SVG. Free online tool, no sign-up." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-qr-code-generator.png" />

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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 mb-4">
              <QrCode className="text-white" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">QR Code Generator</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Create custom QR codes for URLs, WiFi, WhatsApp, vCard contacts, email and more. Download PNG or SVG instantly.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Content Type Presets */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                      activePreset === p.label
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
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

            <div className="grid md:grid-cols-2 gap-8">

              {/* Left: Controls */}
              <div className="space-y-5">

                {/* Text input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Content</label>
                    <span className={`text-xs ${charCount > 900 ? "text-red-500 font-medium" : "text-gray-400"}`}>
                      {charCount} chars {charCount > 900 && "— QR may become complex"}
                    </span>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter URL, WiFi details, contact info..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-[130px] resize-y font-mono text-sm text-gray-800"
                  />
                </div>

                {/* Size + Error level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-sm text-gray-800"
                    >
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Error Correction</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-sm text-gray-800"
                    >
                      {ERROR_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label} — {l.desc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Colors</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1.5">Foreground (dots)</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0" />
                        <input type="text" value={fgColor} onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setFgColor(e.target.value); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono" maxLength={7} />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1.5">Background</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0" />
                        <input type="text" value={bgColor} onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBgColor(e.target.value); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono" maxLength={7} />
                      </div>
                    </div>
                  </div>
                  {/* Contrast feedback */}
                  <div className={`mt-2 text-xs px-3 py-2 rounded-xl ${
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

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button onClick={copyText} disabled={!text.trim()} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-sm font-medium transition-colors">
                    {copied ? <CheckCircle2 size={15} className="text-green-500" /> : <Copy size={15} />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                  <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
                    <RefreshCw size={15} /> Reset
                  </button>
                </div>
              </div>

              {/* Right: QR Preview + Downloads */}
              <div className="flex flex-col items-center gap-5">
                <p className="text-sm font-semibold text-gray-700 self-start">Live Preview</p>

                <div
                  ref={qrRef}
                  className="p-6 rounded-2xl shadow-md border border-gray-200"
                  style={{ backgroundColor: bgColor }}
                >
                  <QRCodeSVG
                    value={text || "https://generatorpromptai.com"}
                    size={Math.min(size, 260)}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={level}
                  />
                </div>

                <p className="text-xs text-gray-400">
                  Preview at {Math.min(size, 260)}px · Downloads at {size}px
                </p>

                {/* Download buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => downloadQR("png")}
                    disabled={!text.trim()}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={15} /> Download PNG
                  </button>
                  <button
                    onClick={() => downloadQR("svg")}
                    disabled={!text.trim()}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={15} /> SVG
                  </button>
                </div>

                <button
                  onClick={copyQRImage}
                  disabled={!text.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-sm font-medium transition-colors"
                >
                  {copiedImg ? <CheckCircle2 size={15} className="text-green-500" /> : <Copy size={15} />}
                  {copiedImg ? "QR Image Copied!" : "Copy QR as Image"}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Tip: Right-click the QR above → "Save image as…" for a quick save
                </p>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free QR Code Generator — URL, WiFi, WhatsApp, vCard &amp; More
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free QR code generator creates custom, high-quality QR codes for any use case. Generate QR codes for website URLs, WiFi credentials, WhatsApp messages, vCard contacts, email addresses, phone numbers, and plain text — all instantly and privately in your browser.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">QR code use cases</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li><strong>Business:</strong> Share your website, portfolio, or contact card via QR on business cards</li>
              <li><strong>Restaurants:</strong> Digital menus via QR code — no printing needed</li>
              <li><strong>WiFi sharing:</strong> Let guests connect to WiFi by scanning instead of typing the password</li>
              <li><strong>Events:</strong> Link to registration forms, tickets, or event pages</li>
              <li><strong>Marketing:</strong> Link print ads and flyers to landing pages</li>
              <li><strong>WhatsApp:</strong> Create a scannable QR that opens a WhatsApp chat with a pre-filled message</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Which error correction level to use</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>Low (7%)</strong> — Digital screens only, clean conditions</li>
              <li><strong>Medium (15%)</strong> — General purpose, recommended default</li>
              <li><strong>High (25%)</strong> — If adding a logo over the center of the QR</li>
              <li><strong>Max (30%)</strong> — Printed materials, curved surfaces, outdoor signage</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How do I create a QR code for my website?", a: "Select the URL preset, paste your website URL in the input box, and your QR code generates instantly. Download as PNG or SVG to use on business cards, flyers, or social media." },
                { q: "How do I make a WiFi QR code?", a: "Select the WiFi preset, replace 'NetworkName' with your WiFi name (SSID) and 'Password' with your WiFi password. Anyone who scans the QR will connect automatically without typing the password." },
                { q: "What error correction level should I use?", a: "Use Medium (15%) for screens and digital use. Use High (25%) if you plan to add a logo overlay in the center. Use Max (30%) for printed QR codes on curved or outdoor surfaces." },
                { q: "Can I add a logo to my QR code?", a: "Set error correction to High or Max, download the PNG, then add your logo in the center using any image editor (Canva, Photoshop, etc.). The higher error correction ensures the QR still scans with part covered." },
                { q: "What is the best QR code size for printing?", a: "512px for business cards and small print. 1024px for A5–A4 sized prints. For large banners and posters, download at 1024px and scale up — SVG format scales infinitely without quality loss." },
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
                { to: "/tools/image-to-text",    title: "Image to Text (OCR)", desc: "Extract text from images to use as QR code content." },
                { to: "/tools/fake-data-generator",title: "Fake Data Generator", desc: "Generate test vCard data for QR code testing." },
                { to: "/tools/password-generator", title: "Password Generator",  desc: "Generate secure WiFi passwords before making a QR." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-gray-600 transition-colors">{tool.title}</h3>
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