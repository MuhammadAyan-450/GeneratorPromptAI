// pages/JsonFormatter.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Download, AlertCircle } from "lucide-react";

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState(null);
  const [isMinified, setIsMinified] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const formatAndValidate = (jsonStr, minify = isMinified) => {
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
      // Try to make error more helpful
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
      formatAndValidate(inputJson);
    }
  }, [inputJson, isMinified, autoFormat]);

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

  const clearAll = () => {
    setInputJson("");
    setFormattedJson("");
    setError(null);
  };

  return (
    <>
      <Helmet>
        <title>JSON Formatter & Validator Online Editor</title>
        <meta
          name="description"
          content="Format, beautify, minify and validate JSON instantly online. Real-time error detection with line/column info. Perfect for developers, APIs, debugging. No signup, 100% browser-based – built in Karachi."
        />
        <meta
          name="keywords"
          content="json formatter online, json beautifier, json minifier, json validator, pretty print json, json error checker, free json tool 2026, debug json"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/json-formatter" />

        <meta property="og:title" content="JSON Formatter & Validator – Free Online 2026" />
        <meta property="og:description" content="Beautify, minify, validate JSON with real-time errors – fast & private." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free JSON Formatter & Validator" />
        <meta name="twitter:description" content="Format & debug JSON instantly – line-by-line errors included." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "JSON Formatter & Validator",
            url: "https://generatorpromptai.com/tools/json-formatter",
            description: "Free online tool to format, minify, beautify and validate JSON with detailed error messages.",
            applicationCategory: "DeveloperApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            JSON Formatter & Validator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Beautify • Minify • Validate • Real-time errors • Free & private
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Input Editor */}
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                  <h3 className="font-semibold text-xl text-gray-900 flex items-center gap-2">
                    Input JSON
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsMinified(!isMinified)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition ${
                        isMinified
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                      }`}
                    >
                      {isMinified ? "Minified" : "Pretty Print"}
                    </button>

                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={autoFormat}
                        onChange={(e) => setAutoFormat(e.target.checked)}
                        className="h-4 w-4 text-sky-600 rounded"
                      />
                      Auto-format
                    </label>

                    <button
                      onClick={clearAll}
                      className="px-4 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  placeholder='Paste or type JSON here...&#10;e.g. {"name":"Ayan","city":"Karachi","skills":["React","Next.js"]}'
                  className="w-full h-[500px] px-4 py-4 font-mono text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-900 shadow-inner"
                  spellCheck="false"
                  aria-label="JSON input editor"
                />

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Validation Error:</strong>
                        <p className="mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Output Editor */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                  <h3 className="font-semibold text-xl text-gray-900 flex items-center gap-2">
                    Formatted JSON
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopy}
                      disabled={!formattedJson}
                      className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition disabled:opacity-50"
                    >
                      <Copy size={16} />
                      {copied ? "Copied!" : "Copy"}
                    </button>

                    <button
                      onClick={handleDownload}
                      disabled={!formattedJson}
                      className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition disabled:opacity-50 shadow-sm"
                    >
                      <Download size={16} />
                      Download .json
                    </button>
                  </div>
                </div>

                <pre className="flex-1 p-4 rounded-xl font-mono text-sm overflow-auto bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {formattedJson || (error ? "" : "// Paste JSON on the left to format & validate")}
                </pre>
              </div>
            </div>

            <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-200">
              Tip: Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + Enter</kbd> to format instantly • All processing is 100% in-browser & private
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
               JSON Formatter, Validator & Minifier
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Instantly format, beautify, minify, and validate any JSON code online. See readable indented output or compact single-line version with real-time syntax error detection (line + column). Perfect for API debugging, config files, data sharing, or cleaning messy JSON from logs/tools.
              </p>
              <p>
                Built in Karachi – no signup, no server upload, 100% private. Handles large JSON payloads smoothly. Great for Pakistani developers, students, freelancers, and anyone working with modern web APIs daily.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the JSON Formatter & Validator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Paste or type your JSON into the left editor box.</li>
                <li>Formatting happens automatically (or toggle off with "Auto-format").</li>
                <li>Switch between <strong>Pretty Print</strong> (readable) and <strong>Minified</strong> (compact) using the button.</li>
                <li>If there’s an error (missing comma, bracket, quote…), it shows detailed message with line/column.</li>
                <li>Right side shows the clean formatted result instantly.</li>
                <li>Click <strong>Copy</strong> to copy to clipboard or <strong>Download .json</strong> to save file.</li>
                <li>Use <strong>Clear</strong> to start fresh with new JSON.</li>
                <li>Tip: Works great with API responses, config files, or large datasets.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Developer Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/fake-data-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Fake Data Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate realistic dummy JSON data for testing.
                </p>
              </Link>

              <Link
                to="/tools/word-counter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Word Counter
                </h3>
                <p className="text-gray-600 text-sm">
                  Count characters/words in JSON strings or docs.
                </p>
              </Link>

              <Link
                to="/tools/lorem-ipsum-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Lorem Ipsum Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate placeholder text for mockups & testing.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default JsonFormatter;