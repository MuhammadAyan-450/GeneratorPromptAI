// pages/JsonValidator.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, AlertCircle, CheckCircle, Eraser, FileJson } from "lucide-react";

const sampleJson = JSON.stringify({
  "apiStatus": "success",
  "user": { "id": 847, "role": "admin", "verified": true },
  "data": ["item1", "item2"]
}, null, 2);

const JsonValidator = () => {
  const [inputJson, setInputJson] = useState("");
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [autoValidate, setAutoValidate] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      validate(inputJson);
    }
  };

  const handleCopy = () => {
    if (!inputJson.trim()) return;
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const loadSample = () => setInputJson(sampleJson);

  const clearAll = () => {
    setInputJson("");
    setError(null);
    setIsValid(null);
    setCopied(false);
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JSON Validator",
    url: "https://www.generatorpromptai.com/tools/json-validator",
    description: "Free browser-based JSON validation tool with real-time error reporting and line/column details.",
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
      { "@type": "ListItem", position: 3, name: "JSON Validator", item: "https://www.generatorpromptai.com/tools/json-validator" }
    ]
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Validate JSON Online",
    description: "Step-by-step guide to checking JSON for syntax errors.",
    step: [
      { "@type": "HowToStep", name: "Paste JSON", text: "Paste your raw JSON data into the text editor." },
      { "@type": "HowToStep", name: "Real-time Check", text: "The tool automatically validates the syntax as you type." },
      { "@type": "HowToStep", name: "Review Result", text: "See a green checkmark for valid JSON, or an exact red error message with line/column for invalid JSON." }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does 'Invalid JSON' mean?",
        acceptedAnswer: { "@type": "Answer", text: "It means your JSON has a syntax error, such as a missing comma, an extra comma at the end of a list, mismatched brackets, or using single quotes instead of double quotes." }
      },
      {
        "@type": "Question",
        name: "Is my JSON data sent to a server to be validated?",
        acceptedAnswer: { "@type": "Answer", text: "No. The validation happens entirely inside your web browser. Your data never leaves your device, ensuring complete privacy." }
      },
      {
        "@type": "Question",
        name: "What is the difference between JSON Validator and JSON Formatter?",
        acceptedAnswer: { "@type": "Answer", text: "A JSON Validator only checks if the syntax is correct. A JSON Formatter also corrects the spacing and indentation to make it easily readable by humans." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>JSON Validator Online - Instant Syntax Error Checker</title>
        <meta name="description" content="Validate JSON instantly online – check syntax, get detailed line/column errors. 100% browser-based, free & private." />
        <meta name="keywords" content="json validator online, validate json free, json syntax checker, json error finder, json lint tool, check json validity, debug json" />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/json-validator" />

        <meta property="og:title" content="JSON Validator – Free Online Syntax Checker" />
        <meta property="og:description" content="Instantly validate JSON with precise error locations – no upload, fully private." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/json-validator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free JSON Validator – Instant Error Detection" />
        <meta name="twitter:description" content="Check JSON syntax with line & column details – perfect for developers." />

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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 mb-4">
              <CheckCircle className="text-green-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              JSON Validator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Instant syntax check • Detailed line/column errors • Free & private
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-8">
              {/* Improved Grid: Input takes more space than the status box */}
              <div className="grid lg:grid-cols-5 gap-8">
                
                {/* Input & Controls (Takes 3/5 space) */}
                <div className="lg:col-span-3 flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">Paste or Type JSON</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={loadSample}
                        className="px-3 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-lg transition"
                      >
                        Load Sample
                      </button>
                      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoValidate}
                          onChange={(e) => setAutoValidate(e.target.checked)}
                          className="h-3.5 w-3.5 text-sky-600 rounded border-gray-300"
                        />
                        Auto
                      </label>
                      <button
                        onClick={handleCopy}
                        disabled={!inputJson.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition disabled:opacity-40 text-gray-700"
                      >
                        <Copy size={14} />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={clearAll}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition text-gray-700"
                      >
                        <Eraser size={14} />
                        Clear
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={inputJson}
                    onChange={(e) => setInputJson(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Paste your JSON here...&#10;e.g. {"name":"John","active":true}'
                    className="flex-1 w-full min-h-[450px] px-4 py-4 font-mono text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-900 shadow-inner"
                    spellCheck="false"
                    aria-label="JSON input for validation"
                  />

                  {!autoValidate && (
                    <button
                      onClick={() => validate(inputJson)}
                      className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      Validate JSON Now
                    </button>
                  )}
                </div>

                {/* Result Area (Takes 2/5 space) */}
                <div className="lg:col-span-2 flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Validation Result</h3>

                  <div className="flex-1 flex items-center">
                    {isValid === null && !error ? (
                      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                        <AlertCircle size={48} className="mb-4 opacity-30" />
                        <p className="text-sm">Waiting for JSON input...</p>
                        <p className="text-xs mt-1 text-gray-400">Enable "Auto" for real-time checking</p>
                      </div>
                    ) : isValid ? (
                      <div className="w-full p-8 bg-green-50 border border-green-200 rounded-xl flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle size={36} className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-green-800">
                            Valid JSON!
                          </h3>
                          <p className="text-green-700 text-sm mt-2">
                            Syntactically correct. Ready for use.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <AlertCircle size={22} className="text-red-600" />
                          </div>
                          <h3 className="text-xl font-bold text-red-800">
                            Invalid JSON
                          </h3>
                        </div>
                        <div className="bg-white/60 rounded-lg p-4 border border-red-100 mb-4">
                          <p className="text-red-700 font-mono text-sm break-words">{error}</p>
                        </div>
                        <p className="text-xs text-red-600">
                          <strong>Common fixes:</strong> Missing commas, unmatched brackets, single quotes instead of double quotes, or trailing commas.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border-t border-gray-200">
                Tip: Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono font-bold shadow-sm">Ctrl + Enter</kbd> to validate manually • 100% in-browser & private
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online JSON Validator – Instant Syntax Checker
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>
                Validate any JSON string instantly and catch hidden syntax errors before they break your application. Our tool provides precise line and column numbers for errors, making it incredibly easy to fix missing commas, unmatched brackets, invalid quotes, and trailing commas.
              </p>
              <p>
                Built for developers, API testers, and students. The validator runs 100% in your browser, meaning your sensitive API payloads and data structures are never uploaded to any external server.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the JSON Validator</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base">
              <li>Paste or type your raw JSON into the text editor (or click <strong>Load Sample</strong>).</li>
              <li>Validation happens automatically if <strong>Auto</strong> is checked (or press <strong>Ctrl + Enter</strong>).</li>
              <li>If valid, a green success message will appear on the right panel.</li>
              <li>If invalid, a red error message will highlight the exact issue and location.</li>
            </ol>
          </section>

          {/* FAQ Section for SEO */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "What does 'Invalid JSON' mean?",
                  a: "It means your text does not follow strict JSON syntax rules. This is usually caused by missing commas, extra trailing commas, single quotes instead of double quotes, or unmatched curly braces."
                },
                {
                  q: "Is my JSON data sent to a server to be validated?",
                  a: "No. The validation happens entirely inside your web browser using native JavaScript. Your data never leaves your device, ensuring complete privacy and security."
                },
                {
                  q: "What is the difference between JSON Validator and JSON Formatter?",
                  a: "A JSON Validator only checks if the structure is syntactically correct. A JSON Formatter goes a step further by fixing the indentation and spacing to make the text easily readable by humans."
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
                { to: "/tools/json-formatter", title: "JSON Formatter", desc: "Beautify, minify & validate JSON in one place." },
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Generate realistic dummy JSON for testing." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count characters/words in JSON or any text." },
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

export default JsonValidator;