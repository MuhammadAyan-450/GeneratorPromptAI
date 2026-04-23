import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Download, AlertCircle, FileJson, Home, ChevronDown, Hash, Layers, Code, FileText } from "lucide-react";

const sampleJson = JSON.stringify({
  "name": "Generator Prompt AI",
  "version": "2.0",
  "isFree": true,
  "features": ["AI Prompts", "Calculators", "Converters", "Formatters"],
  "author": {
    "name": "Developer",
    "tools_built": 30
  }
}, null, 2);

// ─── JSON Syntax Highlighting ───────────────────────────────────────────────────
function HighlightedJson({ json }) {
  const regex = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+\.?\d*(?:[eE][+-]?\d+)?)|(true|false|null)|([{}[\],])/g;
  let match;
  let lastIndex = 0;
  const parts = [];
  let keyIdx = 0;

  while ((match = regex.exec(json)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`w${lastIndex}`} className="text-gray-400">{json.slice(lastIndex, match.index)}</span>);
    }
    const k = keyIdx++;
    if (match[1] && match[2]) {
      parts.push(<span key={k} className="text-sky-400">{match[1]}</span>);
      parts.push(<span key={`${k}c`} className="text-gray-500">{match[2]}</span>);
    } else if (match[1]) {
      parts.push(<span key={k} className="text-green-400">{match[1]}</span>);
    } else if (match[3]) {
      parts.push(<span key={k} className="text-orange-400">{match[3]}</span>);
    } else if (match[4]) {
      parts.push(<span key={k} className="text-purple-400">{match[4]}</span>);
    } else if (match[5]) {
      parts.push(<span key={k} className="text-gray-500">{match[5]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < json.length) {
    parts.push(<span key={`e${lastIndex}`} className="text-gray-400">{json.slice(lastIndex)}</span>);
  }
  return <>{parts}</>;
}

// ─── Stats Calculator ──────────────────────────────────────────────────────────
function getJsonStats(jsonStr) {
  if (!jsonStr) return null;
  try {
    const parsed = JSON.parse(jsonStr);
    let keyCount = 0;
    let maxDepth = 0;
    function traverse(obj, depth) {
      if (depth > maxDepth) maxDepth = depth;
      if (Array.isArray(obj)) {
        obj.forEach((item) => traverse(item, depth + 1));
      } else if (obj && typeof obj === "object") {
        const keys = Object.keys(obj);
        keyCount += keys.length;
        keys.forEach((k) => traverse(obj[k], depth + 1));
      }
    }
    traverse(parsed, 0);
    return {
      keys: keyCount,
      depth: maxDepth,
      chars: jsonStr.length,
      lines: jsonStr.split("\n").length,
    };
  } catch {
    return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState(null);
  const [isMinified, setIsMinified] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const formatAndValidate = (jsonStr = inputJson, minify = isMinified) => {
    if (!jsonStr.trim()) {
      setFormattedJson("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(jsonStr);
      const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError(null);
    } catch (err) {
      let message = err.message;
      if (err instanceof SyntaxError) {
        const match = err.message.match(/position (\d+)/);
        if (match) {
          const pos = parseInt(match[1], 10);
          const lines = jsonStr.split("\n");
          let lineNum = 1;
          let charCount = 0;
          for (const line of lines) {
            if (charCount + line.length >= pos) {
              const col = pos - charCount + 1;
              message = `${err.message} (line ${lineNum}, column ${col})`;
              break;
            }
            charCount += line.length + 1;
            lineNum++;
          }
        }
      }
      setFormattedJson("");
      setError(message || "Invalid JSON");
    }
  };

  useEffect(() => {
    if (autoFormat) {
      formatAndValidate(inputJson, isMinified);
    }
  }, [inputJson, isMinified, autoFormat]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      formatAndValidate(inputJson, isMinified);
    }
  };

  const handleCopy = () => {
    if (!formattedJson) return;
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!formattedJson) return;
    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formatted-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => setInputJson(sampleJson);

  const clearAll = () => {
    setInputJson("");
    setFormattedJson("");
    setError(null);
  };

  const reset = () => {
    clearAll();
    setIsMinified(false);
    setAutoFormat(true);
  };

  const stats = getJsonStats(formattedJson);

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Fix JSON Formatting Errors Online – Free Beautify Minify Validate Tool",
    "url": "https://www.generatorpromptai.com/tools/json-formatter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Free online JSON formatter to beautify, minify and validate JSON with real-time error detection showing exact line and column. Syntax highlighted output, copy and download.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "JSON Formatter", "item": "https://www.generatorpromptai.com/tools/json-formatter" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to fix JSON formatting errors online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste your broken JSON into our formatter. If there is a syntax error, the tool will show the exact issue with the line and column number where it is invalid, such as a missing comma, extra comma, or unclosed quote. Fix the error in the input editor and the output updates in real-time."
        }
      },
      {
        "@type": "Question",
        "name": "How to minify JSON for production API?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste your JSON, click the Minified toggle, and the tool removes all unnecessary whitespace and line breaks to produce the smallest possible file size. Copy or download the minified JSON for use in production APIs and web applications."
        }
      },
      {
        "@type": "Question",
        "name": "Is my JSON data safe in this formatter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% safe. Our JSON formatter runs entirely in your browser using JavaScript. Your data is never sent to any server, making it completely private and secure. This is important when formatting JSON that contains API keys, tokens, or sensitive data."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between pretty print and minified JSON?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pretty Print adds indentation and line breaks to make JSON readable for humans. Minified JSON removes all unnecessary whitespace to produce the smallest possible file size, which is ideal for production APIs, reducing bandwidth and improving load times."
        }
      },
      {
        "@type": "Question",
        "name": "Can I format very large JSON files online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Because the tool runs entirely in your browser without server-side processing limits, it can handle large JSON arrays and nested objects smoothly without timing out. Very large files may be slightly slower depending on your device."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Fix JSON Formatting Errors Online – Free Beautify Minify Validate Tool</title>

        <meta
          name="description"
          content="Free online JSON formatter to beautify, minify and validate JSON with real-time error detection showing exact line and column. Syntax highlighted output. Copy and download. No signup."
        />

        <meta
          name="keywords"
          content="how to fix json formatting errors online, fix json syntax error with line and column number, minify json for production api free online, beautify json with syntax highlighting free tool, validate json online without uploading to server, pretty print json for readability free, json error checker with exact position free online, format large json files online free, free json formatter no sign up required, online json validator with line number"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/json-formatter" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Fix JSON Formatting Errors Online – Free Beautify Minify Validate Tool" />
        <meta property="og:description" content="Beautify, minify, validate JSON with real-time line/column error detection. Syntax highlighted output. Free, private, no signup." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/json-formatter" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free JSON Formatter – Fix Errors, Beautify, Minify Online" />
        <meta name="twitter:description" content="Format and debug JSON with exact error positions. Syntax highlighted output. Free and private." />

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
              <li><span className="text-gray-900 font-semibold">JSON Formatter</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <FileJson className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Fix JSON Formatting Errors Online –{" "}
              <span className="text-sky-600">Free Beautify Minify Validate Tool</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Format, beautify, minify and validate JSON with real-time error detection showing exact line and column. Syntax highlighted output.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">

            <div className="grid lg:grid-cols-2 gap-0">

              {/* Input Editor */}
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <label className="font-semibold text-gray-700 text-sm">Paste your JSON here</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={loadSample}
                      className="px-3 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-xl transition"
                    >
                      Load Sample
                    </button>
                    <button
                      onClick={() => setIsMinified(!isMinified)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                        isMinified
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
                      }`}
                    >
                      {isMinified ? "Minified" : "Pretty Print"}
                    </button>
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoFormat}
                        onChange={(e) => setAutoFormat(e.target.checked)}
                        className="h-3.5 w-3.5 text-sky-600 rounded border-gray-300"
                      />
                      Auto
                    </label>
                  </div>
                </div>

                <textarea
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={'Paste or type JSON here...\ne.g. {"name":"John","skills":["React","Node"]}'}
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 font-mono text-sm resize-y"
                  spellCheck={false}
                  aria-label="JSON input editor"
                />

                {error && (
                  <div className="mt-3 flex items-start gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="font-semibold">Validation Error:</strong>
                      <p className="mt-0.5 font-mono text-xs">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => formatAndValidate(inputJson, isMinified)}
                    className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl"
                  >
                    Format JSON
                  </button>
                  <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <RefreshCw size={15} /> Reset
                  </button>
                </div>
              </div>

              {/* Output Panel */}
              <div className="p-6 md:p-8 flex flex-col bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Formatted Output</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      disabled={!formattedJson}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors disabled:opacity-40"
                    >
                      <Copy size={13} /> {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={!formattedJson}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-40"
                    >
                      <Download size={13} /> Download .json
                    </button>
                  </div>
                </div>

                {formattedJson ? (
                  <div className="bg-gray-900 rounded-2xl p-6 flex-1 overflow-auto min-h-[420px]">
                    <pre className="text-sm font-mono leading-relaxed">
                      <HighlightedJson json={formattedJson} />
                    </pre>
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-900 rounded-2xl p-6 flex items-center justify-center min-h-[420px]">
                    <p className="text-gray-500 text-sm font-mono">
                      {error ? "" : "// Paste JSON on the left to format and validate"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-t border-gray-200">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Code size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{stats.keys}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Keys</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Layers size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{stats.depth}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Max Depth</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><Hash size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{stats.chars}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Characters</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1"><FileText size={20} /></div>
                  <p className="text-lg font-bold text-gray-800">{stats.lines}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Lines</p>
                </div>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online JSON Formatter with Line and Column Error Detection
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free JSON formatter instantly beautifies, minifies, and validates any JSON code in your browser. When there is a syntax error, the tool shows the <strong>exact line and column number</strong> where the problem occurs — whether it is a missing comma, trailing comma, unclosed string, or mismatched bracket. This makes debugging API responses and config files significantly faster.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All processing happens locally in your browser. Your JSON data is <strong>never sent to any server</strong>, making this tool safe for formatting sensitive data like API keys, authentication tokens, and database exports. The syntax-highlighted output uses color coding for keys, strings, numbers, and booleans so you can visually parse the structure at a glance.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Minify JSON for Production API Online
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Paste or type your raw JSON into the <strong>left editor</strong> (or click <strong>Load Sample</strong>).</li>
              <li>Formatting happens <strong>automatically</strong> if Auto is checked (or press <strong>Ctrl + Enter</strong>).</li>
              <li>Switch to <strong>Minified</strong> view to remove all whitespace for production use.</li>
              <li>If there is an error, the exact <strong>line and column number</strong> appears in red below the input.</li>
              <li>Click <strong>Copy</strong> to copy to clipboard or <strong>Download .json</strong> to save the file.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Validate JSON with Exact Error Position – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Exact Error Position", desc: "When JSON is invalid, the tool calculates and displays the precise line and column number where the syntax error occurs — not just a generic error message." },
                { title: "Syntax Highlighted Output", desc: "Color-coded output distinguishes keys (blue), strings (green), numbers (orange), booleans (purple), and brackets (gray) so you can read the structure instantly." },
                { title: "Pretty Print and Minify", desc: "Toggle between readable indented format for debugging and compact single-line format for production APIs and web performance optimization." },
                { title: "100% Private — No Server", desc: "All JSON parsing and formatting runs locally in your browser using JavaScript. Your data is never uploaded, stored, or transmitted to any server." }
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
              JSON Formatter – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to fix JSON formatting errors online?",
                  a: "Paste your broken JSON into our formatter. If there is a syntax error, the tool will show the exact issue with the line and column number where it is invalid, such as a missing comma, extra comma, or unclosed quote. Fix the error in the input editor and the output updates in real-time."
                },
                {
                  q: "How to minify JSON for production API?",
                  a: "Paste your JSON, click the Minified toggle, and the tool removes all unnecessary whitespace and line breaks to produce the smallest possible file size. Copy or download the minified JSON for use in production APIs and web applications."
                },
                {
                  q: "Is my JSON data safe in this formatter?",
                  a: "Yes, 100% safe. Our JSON formatter runs entirely in your browser using JavaScript. Your data is never sent to any server, making it completely private and secure. This is important when formatting JSON that contains API keys, tokens, or sensitive data."
                },
                {
                  q: "What is the difference between pretty print and minified JSON?",
                  a: "Pretty Print adds indentation and line breaks to make JSON readable for humans. Minified JSON removes all unnecessary whitespace to produce the smallest possible file size, which is ideal for production APIs, reducing bandwidth and improving load times."
                },
                {
                  q: "Can I format very large JSON files online?",
                  a: "Yes. Because the tool runs entirely in your browser without server-side processing limits, it can handle large JSON arrays and nested objects smoothly without timing out. Very large files may be slightly slower depending on your device."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Developer Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/fake-data-generator",  title: "Fake Data Generator",  desc: "Generate realistic dummy JSON data for testing." },
                { to: "/tools/word-counter",         title: "Word Counter",          desc: "Count characters and words in JSON strings." },
                { to: "/tools/excel-formula-beautifier", title: "Excel Formula Beautifier", desc: "Format messy Excel formulas for readability." }
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

export default JsonFormatter;