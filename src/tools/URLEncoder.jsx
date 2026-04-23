// pages/URLEncoder.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy, RefreshCw, Download, Globe, Home, ChevronDown,
  Hash, Type, Layers, Lock, Unlock, Link as LinkIcon
} from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
const URLEncoder = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeAction, setActiveAction] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const encodeURL = () => {
    if (!inputText.trim()) return;
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
      setActiveAction("encode");
    } catch {
      setOutputText("Error: Could not encode the provided text.");
      setActiveAction("encode");
    }
  };

  const decodeURL = () => {
    if (!inputText.trim()) return;
    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
      setActiveAction("decode");
    } catch {
      setOutputText("Error: Invalid percent-encoded string. Check for malformed % sequences.");
      setActiveAction("decode");
    }
  };

  const copyText = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `url-${activeAction}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
    setActiveAction("");
    setCopied(false);
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const inputChars = inputText.length;
  const outputChars = outputText.length;
  const encodedChars = outputChars - inputChars; // difference shows how many %XX were added
  const hasResult = outputText.length > 0;
  const isError = outputText.startsWith("Error:");

  const stats = hasResult
    ? [
        { icon: Type, value: inputChars, label: "Input Characters" },
        { icon: Hash, value: outputChars, label: "Output Characters" },
        { icon: Layers, value: Math.abs(encodedChars), label: encodedChars >= 0 ? "Chars Added" : "Chars Removed", color: encodedChars >= 0 ? "text-orange-500" : "text-green-600" },
        { icon: activeAction === "encode" ? Lock : Unlock, value: activeAction === "encode" ? "Encoded" : "Decoded", label: "Status", color: "text-sky-600" },
      ]
    : [];

  const actionLabels = {
    "encode": "Percent-Encoded Output",
    "decode": "Decoded Output",
  };

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Encode URL Special Characters Online Free – Percent Encoding Decoder Tool",
    "url": "https://www.generatorpromptai.com/tools/url-encoder",
    "applicationCategory": "DeveloperTools",
    "operatingSystem": "All",
    "description": "Free online URL encoder and decoder. Convert special characters to percent-encoded format and back. Safe for query params, APIs, and web transmission. No signup required.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "URL Encoder / Decoder", "item": "https://www.generatorpromptai.com/tools/url-encoder" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to encode URL special characters online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste your URL or text into the input area and click 'Encode URL'. The tool converts all unsafe characters (spaces, ?, &, =, etc.) into percent-encoded format (e.g. space becomes %20). Copy or download the result."
        }
      },
      {
        "@type": "Question",
        "name": "What is URL encoding or percent encoding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "URL encoding (percent encoding) converts unsafe ASCII characters into a % followed by two hexadecimal digits so they can be safely transmitted over the Internet. For example, a space becomes %20, ? becomes %3F, and & becomes %26."
        }
      },
      {
        "@type": "Question",
        "name": "When should I URL-encode a string?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use URL encoding whenever you pass user input as part of a URL query parameter — like search queries, form data, or API request parameters. This prevents browsers from misinterpreting special characters."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between encodeURI and encodeURIComponent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "encodeURI() encodes characters that are not allowed in a full URL but leaves URL structure characters like /, :, ?, &, = intact. encodeURIComponent() encodes ALL special characters including these — making it safe for query parameter values. Our tool uses encodeURIComponent for maximum safety."
        }
      },
      {
        "@type": "Question",
        "name": "How to decode a percent-encoded URL back to readable text?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste the encoded URL (e.g. 'hello%20world%3F') into the input area and click 'Decode URL'. The tool converts all %XX sequences back to their original characters (e.g. 'hello world?')."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Encode URL Special Characters Online Free – Percent Encoding Decoder Tool</title>

        <meta
          name="description"
          content="Free online URL encoder and decoder. Convert special characters to percent-encoded format and back. Safe for query params, APIs, and web transmission. No signup required."
        />

        <meta
          name="keywords"
          content="how to encode url special characters online free, percent encoding decoder tool free no signup, encode decode url query parameters online, convert space to percent twenty in url free tool, url encode decode for api requests free online, what is url encoding percent encoding explained, free online urlencode urldecode javascript tool, encode special characters in url for seo free, fix malformed url encoded characters online free, best free url encoder decoder with copy download 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/url-encoder" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Encode URL Special Characters Free – Percent Encoding & Decoder" />
        <meta property="og:description" content="Convert URLs to percent-encoded format and back. Safe for query params and APIs. Free, no signup." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/url-encoder" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free URL Encoder / Decoder – Percent Encoding Tool" />
        <meta name="twitter:description" content="Encode and decode URLs instantly. Percent-encode special characters. Free online developer tool." />

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
              <li><span className="text-gray-900 font-semibold">URL Encoder / Decoder</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Globe className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Encode URL Special Characters Online Free –{" "}
              <span className="text-sky-600">Percent Encoding Decoder Tool</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Convert special characters to percent-encoded format and back. Safe for query params, APIs, and web transmission.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Input */}
            <div className="mb-6">
              <label className={labelCls}>Enter URL or Text</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none font-mono text-sm"
                placeholder={"https://example.com/search?q=hello world&lang=en\n\nOr any text with special chars: hello@world! #tag & more"}
              />
              <p className="text-xs text-gray-400 mt-1">
                {inputChars} character{inputChars !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={encodeURL}
                disabled={!inputText.trim()}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-40 transition-all text-white font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <Lock size={16} /> Encode URL
              </button>
              <button
                onClick={decodeURL}
                disabled={!inputText.trim()}
                className="bg-white border-2 border-sky-100 hover:bg-sky-50 disabled:opacity-40 text-sky-700 font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Unlock size={16} /> Decode URL
              </button>
            </div>

            {/* Reset */}
            <div className="mb-2">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>

            {/* ── Result Section ── */}
            {hasResult && (
              <div className="mt-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <div className="flex justify-center text-sky-500 mb-1">
                        <stat.icon size={20} />
                      </div>
                      <p className={`text-lg font-bold ${stat.color || "text-gray-800"}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Dark Output Block */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6 overflow-x-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
                    {actionLabels[activeAction] || "Result"}
                  </p>
                  <pre className={`text-sm font-mono leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap break-all ${
                    isError ? "text-red-400" : "text-sky-400"
                  }`}>
                    {outputText}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={copyText}
                    disabled={isError}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Copy size={15} />
                    {copied ? "Copied!" : "Copy Result"}
                  </button>
                  <button
                    onClick={downloadText}
                    disabled={isError}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Download size={15} /> Download .txt
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasResult && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <Globe size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Paste a URL or text and click <strong className="text-gray-500">Encode URL</strong> or <strong className="text-gray-500">Decode URL</strong></p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free URL Encoder &amp; Decoder — Percent-Encoding for Safe Web Transmission
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              URLs can only be sent over the Internet using the <strong>ASCII character-set</strong>. Since URLs often contain characters outside this set — spaces, non-Latin characters, emojis, or symbols like <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">?</code> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">&amp;</code> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">=</code> — they must be converted into a valid ASCII format. This process is called <strong>URL Encoding</strong> or <strong>Percent-Encoding</strong>.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our tool uses <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">encodeURIComponent()</code> which encodes all special characters for maximum safety — ideal for query parameter values in API requests. The decode function reverses the process, converting all <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">%XX</code> sequences back to their original characters.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Common percent-encoded characters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { char: "Space", code: "%20" },
                { char: "?", code: "%3F" },
                { char: "&", code: "%26" },
                { char: "=", code: "%3D" },
                { char: "/", code: "%2F" },
                { char: "#", code: "%23" },
                { char: "!", code: "%21" },
                { char: "@", code: "%40" },
              ].map((item) => (
                <div key={item.char} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-center">
                  <p className="font-mono text-sm text-gray-800">{item.char}</p>
                  <p className="text-xs text-sky-600 font-mono">{item.code}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Encode URL Special Characters Online Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li><strong>Paste your URL or text</strong> into the input area — full URLs, query strings, or any text with special characters.</li>
              <li>Click <strong>"Encode URL"</strong> to convert all unsafe characters to percent-encoded format (<code className="bg-gray-100 px-1 rounded text-sm">%XX</code>).</li>
              <li>Or click <strong>"Decode URL"</strong> to reverse the process — converting <code className="bg-gray-100 px-1 rounded text-sm">%XX</code> sequences back to readable characters.</li>
              <li>Review the <strong>stats grid</strong> showing input/output character counts and how many characters were added or removed.</li>
              <li><strong>Copy</strong> the result to clipboard or <strong>download as .txt</strong> for use in your code or API requests.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Percent Encoding Tool for API Requests – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "encodeURIComponent for Maximum Safety", desc: "Uses JavaScript's encodeURIComponent() which encodes ALL special characters including ?, &, =, /, and #. This makes it safe for query parameter values in API requests and form submissions." },
                { title: "Bidirectional Encode & Decode", desc: "Encode any text to percent-encoded format, or decode an encoded URL back to readable text. Error handling catches malformed % sequences and shows clear error messages." },
                { title: "Character Difference Stats", desc: "The stats grid shows input characters, output characters, and the exact difference — so you know how many %XX sequences were added during encoding or removed during decoding." },
                { title: "Copy & Download Results", desc: "One-click copy to clipboard for pasting into code, Postman, or browser address bars. Download as .txt for documentation, testing notes, or sharing with team members." }
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
              URL Encoder / Decoder – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to encode URL special characters online free?",
                  a: "Paste your URL or text into the input area and click 'Encode URL'. The tool converts all unsafe characters (spaces, ?, &, =, etc.) into percent-encoded format (e.g. space becomes %20). Copy or download the result."
                },
                {
                  q: "What is URL encoding or percent encoding?",
                  a: "URL encoding (percent encoding) converts unsafe ASCII characters into a % followed by two hexadecimal digits so they can be safely transmitted over the Internet. For example, a space becomes %20, ? becomes %3F, and & becomes %26."
                },
                {
                  q: "When should I URL-encode a string?",
                  a: "Use URL encoding whenever you pass user input as part of a URL query parameter — like search queries, form data, or API request parameters. This prevents browsers from misinterpreting special characters."
                },
                {
                  q: "What is the difference between encodeURI and encodeURIComponent?",
                  a: "encodeURI() encodes characters not allowed in a full URL but leaves URL structure characters like /, :, ?, &, = intact. encodeURIComponent() encodes ALL special characters including these — making it safe for query parameter values. Our tool uses encodeURIComponent for maximum safety."
                },
                {
                  q: "How to decode a percent-encoded URL back to readable text?",
                  a: "Paste the encoded URL (e.g. 'hello%20world%3F') into the input area and click 'Decode URL'. The tool converts all %XX sequences back to their original characters (e.g. 'hello world?')."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Developer &amp; Encoding Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/base64-encode", title: "Base64 Encoder / Decoder", desc: "Encode and decode text to Base64 format for data transmission." },
                { to: "/tools/uuid-generator", title: "UUID Generator", desc: "Generate unique UUID v4 identifiers for API keys and tokens." },
                { to: "/tools/json-formatter", title: "JSON Formatter", desc: "Beautify, minify and validate JSON data with syntax highlighting." }
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

export default URLEncoder;