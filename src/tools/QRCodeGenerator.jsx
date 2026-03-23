// pages/QRCodeGenerator.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, Copy, RefreshCw, CheckCircle2 } from "lucide-react";

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://generatepromptai.com");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [level, setLevel] = useState("M"); // L, M, Q, H
  const [copied, setCopied] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const qrRef = useRef(null);

  const presets = [128, 256, 512, 1024];

  const downloadQR = (format = "png") => {
    if (!text.trim()) return;

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `qrcode-${Date.now()}.png`;
        link.href = pngUrl;
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))));
    }
  };

  const copyText = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const copyQRImage = async () => {
    if (!text.trim()) return;

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = async () => {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0);
      try {
        const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 1800);
      } catch (err) {
        console.error("Clipboard image copy failed", err);
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const reset = () => {
    setText("https://generatepromptai.com");
    setSize(256);
    setFgColor("#000000");
    setBgColor("#ffffff");
    setLevel("M");
    setCopied(false);
    setCopiedImage(false);
  };

  const lowContrast = (fgColor === "#000000" && bgColor === "#ffffff") || (fgColor === "#ffffff" && bgColor === "#000000");

  return (
    <>
      <Helmet>
        <title>QR Code Generator – Custom QR Codes for URLs, WiFi & More</title>
        <meta
          name="description"
          content="Create custom QR codes instantly – URLs, text, WiFi, vCard, payments. Customize size, colors, error correction. Download PNG/SVG, copy image. 100% browser-based, free & private. Built in Karachi."
        />
        <meta
          name="keywords"
          content="qr code generator online, custom qr code free, qr code for wifi, qr code for url, qr code maker 2026, free qr code tool"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/qr-code-generator" />

        <meta property="og:title" content="QR Code Generator – Free & Custom Online 2026" />
        <meta property="og:description" content="Instant QR codes for links, WiFi, contacts & more – download PNG/SVG." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free QR Code Generator" />
        <meta name="twitter:description" content="Create scannable QR codes instantly – custom colors & sizes." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "QR Code Generator",
            url: "https://generatorpromptai.com/tools/qr-code-generator",
            description: "Free online tool to generate customizable QR codes for URLs, text, WiFi, contacts and more.",
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
            QR Code Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Custom QR codes for URLs • WiFi • Text • Contacts • Free & instant
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Left – Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Content (URL, Text, WiFi, vCard, etc.)
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="https://generatorpromptai.com\nor WiFi: SSID:MyNetwork;TYPE:WPA;PSK:MyPass123;;"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[140px] resize-y font-mono text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Size (px)
                      </label>
                      <select
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        {presets.map(s => (
                          <option key={s} value={s}>{s}px</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Error Correction
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="L">Low – 7% recovery</option>
                        <option value="M">Medium – 15% (default)</option>
                        <option value="Q">Quartile – 25%</option>
                        <option value="H">High – 30% (best for print)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Foreground Color
                      </label>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-full h-12 border rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-12 border rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {lowContrast && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      Warning: Low contrast between colors may make QR hard to scan.
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={copyText}
                      disabled={!text.trim()}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Copy size={18} />
                      {copied ? "Text Copied!" : "Copy Text"}
                    </button>

                    <button
                      onClick={reset}
                      className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Right – Preview */}
                <div className="space-y-6 flex flex-col items-center justify-center">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Your Custom QR Code
                  </h3>

                  <div
                    ref={qrRef}
                    className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200"
                  >
                    <QRCodeSVG
                      value={text || "https://generatepromptai.com"}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={level}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button
                      onClick={() => downloadQR("png")}
                      disabled={!text.trim()}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Download size={18} />
                      Download PNG
                    </button>

                    <button
                      onClick={() => downloadQR("svg")}
                      disabled={!text.trim()}
                      className="flex-1 bg-sky-600/90 hover:bg-sky-700/90 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      SVG
                    </button>
                  </div>

                  <button
                    onClick={copyQRImage}
                    disabled={!text.trim()}
                    className="w-full max-w-sm bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {copiedImage ? (
                      <>
                        <CheckCircle2 size={18} />
                        QR Image Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy QR as Image
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Right-click QR → Save Image As… for quick SVG backup
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free QR Code Generator – Custom & High-Quality
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Create unlimited custom QR codes instantly – for URLs, plain text, WiFi credentials, vCard contacts, payment links, social media, or any data. Fully customizable: size, colors, error correction level. Instant preview, one-click PNG/SVG download, and copy QR as image. 100% browser-based — private, secure, no signup, no data leaves your device.
              </p>
              <p>
                Built in Karachi – perfect for Pakistani businesses, restaurants (contactless menus), event organizers, marketers, content creators, and everyday users. High-quality, scannable QR codes in seconds.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the QR Code Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Type or paste content (URL, text, WiFi details, vCard, etc.) into the input box.</li>
                <li>Customize size, error correction (Low/Medium/High), foreground & background colors.</li>
                <li>QR code updates live in the preview area on the right.</li>
                <li>Click <strong>Download PNG</strong> or <strong>SVG</strong> to save high-quality file.</li>
                <li>Use <strong>Copy QR as Image</strong> to paste directly into messages/docs.</li>
                <li>Click <strong>Copy Text</strong> to copy the original content quickly.</li>
                <li>Use <strong>Reset</strong> to start fresh.</li>
                <li>Tip: Use "High" error correction for printed materials or curved surfaces.</li>
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
                to="/tools/link-shortener"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Link Shortener
                </h3>
                <p className="text-gray-600 text-sm">
                  Shorten long URLs before making QR codes.
                </p>
              </Link>

              <Link
                to="/tools/image-to-text"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Image to Text (OCR)
                </h3>
                <p className="text-gray-600 text-sm">
                  Extract text from images for QR content.
                </p>
              </Link>

              <Link
                to="/tools/fake-data-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Fake Data Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate dummy data (e.g. vCards) for QR testing.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default QRCodeGenerator;