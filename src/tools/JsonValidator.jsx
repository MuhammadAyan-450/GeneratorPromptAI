// pages/JsonValidator.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

const JsonValidator = () => {
  const [inputJson, setInputJson] = useState("");
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [autoValidate, setAutoValidate] = useState(true);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const validate = (jsonStr = inputJson) => {
    setError(null);
    setIsValid(null);

    if (!jsonStr.trim()) {
      setIsValid(null);
      return;
    }

    try {
      JSON.parse(jsonStr);
      setIsValid(true);
      setError(null);
    } catch (err) {
      let message = err.message || "Invalid JSON syntax";

      // Try to improve error location
      const match = message.match(/position (\d+)/);
      if (match) {
        const pos = parseInt(match[1], 10);
        const lines = jsonStr.split("\n");
        let lineNum = 1;
        let charCount = 0;
        for (const line of lines) {
          if (charCount + line.length >= pos) {
            const col = pos - charCount + 1;
            message = `${message} (line ${lineNum}, column ${col})`;
            break;
          }
          charCount += line.length + 1;
          lineNum++;
        }
      }

      setIsValid(false);
      setError(message);
    }
  };

  useEffect(() => {
    if (autoValidate) {
      validate();
    }
  }, [inputJson, autoValidate]);

  const handleCopy = () => {
    if (!inputJson.trim()) return;
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const clearAll = () => {
    setInputJson("");
    setError(null);
    setIsValid(null);
    setCopied(false);
  };

  return (
    <>
      <Helmet>
        <title>JSON Validator – Instant Syntax Check & Error Detection</title>
        <meta
          name="description"
          content="Validate JSON instantly online – check syntax, get detailed line/column errors. Perfect for API debugging, config files, data validation. No signup, 100% browser-based – built in Karachi."
        />
        <meta
          name="keywords"
          content="json validator online, validate json free, json syntax checker, json error finder, json lint tool, check json validity 2026, debug json"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/json-validator" />

        <meta property="og:title" content="JSON Validator – Free Online Syntax Checker 2026" />
        <meta property="og:description" content="Instantly validate JSON with precise error locations – no upload, fully private." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free JSON Validator – Instant Error Detection" />
        <meta name="twitter:description" content="Check JSON syntax with line & column details – perfect for developers." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "JSON Validator",
            url: "https://generatorpromptai.com/tools/json-validator",
            description: "Free browser-based JSON validation tool with real-time error reporting and line/column details.",
            applicationCategory: "DeveloperApplication",
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
            JSON Validator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Instant syntax check • Detailed line/column errors • Free & private
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Input & Controls */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="font-semibold text-xl text-gray-900">
                      Paste or Type JSON
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoValidate}
                          onChange={(e) => setAutoValidate(e.target.checked)}
                          className="h-4 w-4 text-sky-600 rounded"
                        />
                        Auto-validate
                      </label>

                      <button
                        onClick={handleCopy}
                        disabled={!inputJson.trim()}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition disabled:opacity-50"
                      >
                        <Copy size={16} />
                        {copied ? "Copied!" : "Copy Input"}
                      </button>

                      <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition"
                      >
                        <RefreshCw size={16} />
                        Clear
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={inputRef}
                    value={inputJson}
                    onChange={(e) => setInputJson(e.target.value)}
                    placeholder='Paste your JSON here...&#10;e.g. {"name":"Ayan","city":"Karachi","active":true}'
                    className="w-full h-[500px] px-4 py-4 font-mono text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-900 shadow-inner"
                    spellCheck="false"
                    aria-label="JSON input for validation"
                  />

                  {!autoValidate && (
                    <button
                      onClick={() => validate()}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      Validate JSON Now
                    </button>
                  )}
                </div>

                {/* Result Area */}
                <div className="flex-1 space-y-6">
                  <h3 className="font-semibold text-xl text-gray-900">
                    Validation Result
                  </h3>

                  {isValid === null && !error ? (
                    <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                      <AlertCircle size={48} className="mb-4 opacity-40" />
                      <p>Paste JSON and validation will appear here</p>
                      <p className="text-xs mt-2">Or enable Auto-validate for real-time checking</p>
                    </div>
                  ) : isValid ? (
                    <div className="p-8 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={28} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                          Valid JSON!
                        </h3>
                        <p className="text-green-700">
                          Your JSON is syntactically correct. No errors detected.
                        </p>
                        <p className="text-sm text-green-600 mt-3">
                          Ready to use in APIs, configs, or data processing.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle size={28} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-red-800 mb-2">
                          Invalid JSON
                        </h3>
                        <p className="text-red-700 font-medium">{error}</p>
                        <p className="text-sm text-red-600 mt-3">
                          Common fixes: missing commas, unmatched brackets, single quotes instead of double, trailing commas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 text-sm text-center text-gray-500 bg-gray-50 p-4 rounded-lg border-t border-gray-200">
                Tip: Paste JSON → it validates automatically (or click "Validate JSON Now") • All checks are 100% in-browser & private
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
               JSON Validator – Instant Syntax Check
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Validate any JSON string instantly — check for syntax errors with precise line and column details. Catch missing commas, unmatched brackets, invalid quotes, trailing commas, and more before they break your code or API. No signup, no server upload — everything happens 100% in your browser.
              </p>
              <p>
                Built in Karachi – perfect for Pakistani developers, students, and freelancers working with APIs, config files, mock data, or JSON exports daily. Fast, accurate, private, and completely free.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the JSON Validator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Paste or type your JSON into the input box on the left.</li>
                <li>Enable/disable <strong>Auto-validate</strong> (on by default) for real-time checking.</li>
                <li>If valid → green success message appears on the right.</li>
                <li>If invalid → red error card shows exact issue + line/column location.</li>
                <li>Click <strong>Copy Input</strong> to copy your JSON quickly.</li>
                <li>Click <strong>Clear</strong> to reset and validate new code.</li>
                <li>Tip: Fix one error at a time — the message usually points exactly where to look.</li>
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
                to="/tools/json-formatter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  JSON Formatter & Validator
                </h3>
                <p className="text-gray-600 text-sm">
                  Beautify, minify & validate JSON in one place.
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
                  Generate realistic dummy JSON for testing.
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
                  Count characters/words in JSON or any text.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default JsonValidator;