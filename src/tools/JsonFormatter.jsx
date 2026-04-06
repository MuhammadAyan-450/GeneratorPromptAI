
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Download, AlertCircle, FileJson } from "lucide-react";

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

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState(null);
  const [isMinified, setIsMinified] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 1800);
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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JSON Formatter & Validator",
    url: "https://www.generatorpromptai.com/tools/json-formatter",
    description: "Free online tool to format, minify, beautify and validate JSON with detailed error messages.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI" }
  };

  const schemaBreadCrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", position: 2, name: "Text & Code Tools", item: "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", position: 3, name: "JSON Formatter", item: "https://www.generatorpromptai.com/tools/json-formatter" }
    ]
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Format and Validate JSON Online",
    description: "Step-by-step guide to beautifying and validating JSON code.",
    step: [
      { "@type": "HowToStep", name: "Paste JSON", text: "Paste or type your raw JSON data into the left input editor." },
      { "@type": "HowToStep", name: "Auto-Format", text: "The tool automatically validates and formats the code in real-time." },
      { "@type": "HowToStep", name: "Toggle View", text: "Switch between Pretty Print (indented) and Minified (single line) views." },
      { "@type": "HowToStep", name: "Copy or Download", text: "Copy the clean JSON to your clipboard or download it as a .json file." }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I fix JSON formatting errors?",
        acceptedAnswer: { "@type": "Answer", text: "Paste your broken JSON into our formatter. If there is an error, the tool will highlight the exact issue and tell you the line and column number where the syntax is invalid (e.g., missing comma or quote)." }
      },
      {
        "@type": "Question",
        name: "Is my JSON data safe?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our JSON formatter runs 100% in your browser. Your data is never sent to any server, making it completely safe and private." }
      },
      {
        "@type": "Question",
        name: "What is the difference between Pretty Print and Minified JSON?",
        acceptedAnswer: { "@type": "Answer", text: "Pretty Print adds spaces and line breaks to make JSON readable for humans. Minified JSON removes all unnecessary spaces to make the file size as small as possible, which is ideal for production APIs." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>JSON Formatter & Validator Online - Beautify & Minify Free</title>
        <meta name="description" content="Format, beautify, minify and validate JSON instantly online. Real-time error detection with exact line/column info. 100% browser-based, free & private." />
        <meta name="keywords" content="json formatter online, json beautifier, json minifier, json validator, pretty print json, json error checker, free developer tools" />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/json-formatter" />

        <meta property="og:title" content="JSON Formatter & Validator – Free Online Tool" />
        <meta property="og:description" content="Beautify, minify, validate JSON with real-time errors – fast & private." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/json-formatter" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free JSON Formatter & Validator" />
        <meta name="twitter:description" content="Format & debug JSON instantly – line-by-line errors included." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadCrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaHowTo)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <FileJson className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              JSON Formatter & Validator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Beautify • Minify • Validate • Real-time errors • Free & private
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Input Editor */}
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">Input JSON</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={loadSample}
                      className="px-3 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg transition"
                    >
                      Load Sample
                    </button>
                    <button
                      onClick={() => { setIsMinified(!isMinified); }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                        isMinified ? "bg-gray-900 text-white border-gray-900" : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
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
                    <button
                      onClick={clearAll}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Paste or type JSON here...&#10;e.g. {"name":"John","skills":["React","Node"]}'
                  className="flex-1 w-full min-h-[450px] px-4 py-4 font-mono text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-900 shadow-inner"
                  spellCheck="false"
                  aria-label="JSON input editor"
                />

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="font-semibold">Validation Error:</strong>
                        <p className="mt-1 font-mono text-xs">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Output Editor */}
              <div className="p-6 md:p-8 flex flex-col bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">Output</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      disabled={!formattedJson}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
                    >
                      <Copy size={14} />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={!formattedJson}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Download size={14} />
                      Download .json
                    </button>
                  </div>
                </div>

                <pre className="flex-1 p-4 rounded-xl font-mono text-sm overflow-auto bg-white border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[450px]">
                  {formattedJson || (error ? "" : "// Paste JSON on the left to format & validate")}
                </pre>
              </div>
            </div>

            <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-200">
              Tip: Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono font-bold shadow-sm">Ctrl + Enter</kbd> to format manually • 100% in-browser & private
            </div>
          </div>

          {/* SEO Content */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online JSON Formatter, Validator & Minifier
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>
                Instantly format, beautify, minify, and validate any JSON code online. See readable indented output or compact single-line version with real-time syntax error detection showing the exact line and column. Perfect for API debugging, cleaning up config files, data sharing, or parsing messy JSON from server logs.
              </p>
              <p>
                Our tool requires no sign-up and uploads no data to external servers. All text processing happens directly inside your browser, ensuring your sensitive API keys and data structures remain 100% private. It easily handles large JSON payloads without crashing.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the JSON Formatter</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base">
              <li>Paste or type your raw JSON into the left editor box (or click <strong>Load Sample</strong>).</li>
              <li>Formatting happens automatically if <strong>Auto</strong> is checked (or press <strong>Ctrl + Enter</strong>).</li>
              <li>Switch between <strong>Pretty Print</strong> (readable) and <strong>Minified</strong> (compact single-line) views.</li>
              <li>If there’s an error (missing comma, bracket, quote), a detailed message with line/column will appear in red.</li>
              <li>Click <strong>Copy</strong> to copy to your clipboard or <strong>Download .json</strong> to save the file locally.</li>
            </ol>
          </section>

          {/* FAQ Section for SEO */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "How do I fix JSON formatting errors?",
                  a: "Paste your broken JSON into our formatter. If there is an error, the tool will highlight the exact issue and tell you the line and column number where the syntax is invalid (e.g., missing comma or quote)."
                },
                {
                  q: "Is my JSON data safe?",
                  a: "Yes. Our JSON formatter runs 100% in your browser. Your data is never sent to any external server, making it completely secure and private."
                },
                {
                  q: "What is the difference between Pretty Print and Minified JSON?",
                  a: "Pretty Print adds spaces and line breaks to make JSON easy for humans to read. Minified JSON removes all unnecessary white space to make the file size as small as possible, which is ideal for production APIs and web performance."
                },
                {
                  q: "Can I format very large JSON files?",
                  a: "Yes. Because the tool runs entirely in your browser without server limits, it can handle large JSON arrays and objects smoothly without timing out."
                }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Related Developer Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Generate realistic dummy JSON data for testing." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count characters/words in JSON strings or docs." },
                { to: "/tools/json-validator", title: "JSON Validator", desc: "Strictly validate JSON schemas and structures." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-300 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">{tool.title}</h3>
                  <p className="text-gray-500 text-sm">{tool.desc}</p>
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