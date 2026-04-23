import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, AlertCircle, CheckCircle, Eraser, FileJson, Home, ChevronDown, Hash, Layers, Code, FileText } from "lucide-react";

const sampleJson = JSON.stringify({
  "apiStatus": "success",
  "user": { "id": 847, "role": "admin", "verified": true },
  "data": ["item1", "item2"]
}, null, 2);

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

const JsonValidator = () => {
  const [inputJson, setInputJson] = useState("");
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [autoValidate, setAutoValidate] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => setInputJson(sampleJson);

  const clearAll = () => {
    setInputJson("");
    setError(null);
    setIsValid(null);
    setCopied(false);
  };

  const stats = isValid ? getJsonStats(inputJson) : null;

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Check If JSON Is Valid Online with Line and Column Number – Free Syntax Checker",
    "url": "https://www.generatorpromptai.com/tools/json-validator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Free online JSON validator to check syntax correctness with exact line and column error positions. Real-time validation runs entirely in your browser — no data sent to any server.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "JSON Validator", "item": "https://www.generatorpromptai.com/tools/json-validator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to check if JSON is valid online with line and column number?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste your JSON into our validator and it automatically checks syntax in real-time. If the JSON is invalid, the tool shows the exact error message along with the precise line and column number where the problem occurs."
        }
      },
      {
        "@type": "Question",
        "name": "What does Invalid JSON mean and how to fix it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Invalid JSON means the text does not follow strict JSON syntax rules. Common causes include missing commas between key-value pairs, extra trailing commas at the end of arrays or objects, single quotes instead of double quotes, and unmatched curly braces or square brackets."
        }
      },
      {
        "@type": "Question",
        "name": "Is my JSON data sent to a server when I validate it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The validation runs entirely inside your web browser using native JavaScript. Your data never leaves your device, making it completely safe for validating API responses that contain sensitive information like tokens and keys."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between JSON Validator and JSON Formatter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A JSON Validator only checks whether the syntax is correct or not. A JSON Formatter does the same check but also re-indents and spaces the JSON to make it easily readable by humans."
        }
      },
      {
        "@type": "Question",
        "name": "Can I validate large JSON files online for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Since the validation runs in your browser without server limits, it can handle large JSON payloads. Performance depends on your device, but most files validate instantly."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Check If JSON Is Valid Online with Line and Column Number – Free Syntax Checker</title>

        <meta
          name="description"
          content="Free online JSON validator to check syntax correctness with exact line and column error positions. Real-time validation. 100% browser-based, no data sent to server. No signup."
        />

        <meta
          name="keywords"
          content="how to check if json is valid online free, validate json with line and column number online, json syntax error checker with exact position, check json validity without uploading to server, free online json lint tool no sign up, debug json syntax errors free tool, find missing comma in json online, json validation tool for api responses, check if api response is valid json free, online json validator for large files free"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/json-validator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Check If JSON Is Valid Online – Free JSON Syntax Checker" />
        <meta property="og:description" content="Validate JSON with exact line/column error positions. Real-time checking. Free, private, no signup." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/json-validator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free JSON Validator – Check Syntax with Line & Column" />
        <meta name="twitter:description" content="Validate JSON instantly with exact error positions. Free and private." />

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
              <li><span className="text-gray-900 font-semibold">JSON Validator</span></li>
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
              Check If JSON Is Valid Online –{" "}
              <span className="text-sky-600">Free Syntax Checker with Line Number</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Validate JSON syntax instantly with exact line and column error positions. Real-time checking. No data sent to server.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <div className="grid lg:grid-cols-5 gap-8">

                {/* Input & Controls */}
                <div className="lg:col-span-3 flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <label className="font-semibold text-gray-700 text-sm">Paste or type JSON here</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={loadSample}
                        className="px-3 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-xl transition"
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors disabled:opacity-40"
                      >
                        <Copy size={13} /> {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={clearAll}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-700 transition-colors"
                      >
                        <Eraser size={13} /> Clear
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={inputJson}
                    onChange={(e) => setInputJson(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={'Paste your JSON here...\ne.g. {"name":"John","active":true}'}
                    rows={16}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 font-mono text-sm resize-y"
                    spellCheck={false}
                    aria-label="JSON input for validation"
                  />

                  {!autoValidate && (
                    <button
                      onClick={() => validate(inputJson)}
                      className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl mt-4"
                    >
                      Validate JSON
                    </button>
                  )}
                </div>

                {/* Result Area */}
                <div className="lg:col-span-2 flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Validation Result</span>

                  <div className="flex-1 flex items-center">
                    {isValid === null && !error ? (
                      <div className="w-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                        <AlertCircle size={36} className="mb-3 text-gray-300" />
                        <p className="text-sm">Paste JSON to validate</p>
                        <p className="text-xs mt-1 text-gray-300">Enable Auto for real-time checking</p>
                      </div>
                    ) : isValid ? (
                      <div className="w-full p-8 bg-green-50 border border-green-200 rounded-2xl flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle size={36} className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-green-800">Valid JSON</h3>
                          <p className="text-green-700 text-sm mt-2">Syntactically correct. Ready for use.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-2xl">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <AlertCircle size={22} className="text-red-600" />
                          </div>
                          <h3 className="text-xl font-bold text-red-800">Invalid JSON</h3>
                        </div>
                        <div className="bg-white/60 rounded-xl p-4 border border-red-100 mb-4">
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

              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
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
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online JSON Validator with Line and Column Error Detection
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Validate any JSON string instantly and catch hidden syntax errors before they break your application. Our tool provides <strong>precise line and column numbers</strong> for errors, making it easy to fix missing commas, unmatched brackets, invalid quotes, and trailing commas — the most common JSON mistakes.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Built for developers, API testers, and students who need a quick JSON check without pasting data into external servers. The validator runs <strong>100% in your browser</strong>, so your sensitive API payloads, authentication tokens, and data structures remain completely private.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Check JSON Validity Without Uploading to Server
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Paste or type your raw JSON into the <strong>left editor</strong> (or click <strong>Load Sample</strong>).</li>
              <li>Validation happens <strong>automatically</strong> if Auto is checked (or press <strong>Ctrl + Enter</strong>).</li>
              <li>If valid, a <strong>green success</strong> message appears with JSON structure stats.</li>
              <li>If invalid, a <strong>red error</strong> shows the exact issue with <strong>line and column number</strong>.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Find Missing Comma in JSON Online – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Exact Error Position", desc: "When JSON is invalid, the tool calculates and displays the precise line and column number where the syntax error occurs — not just a generic error message." },
                { title: "Real-Time Validation", desc: "With Auto mode enabled, JSON is validated as you type. See the result update instantly with every keystroke, no need to click a button." },
                { title: "Structure Stats", desc: "When JSON is valid, see the total key count, maximum nesting depth, character count, and line count — useful for understanding complexity at a glance." },
                { title: "100% Private — No Server", desc: "All validation runs locally in your browser using native JavaScript. Your data is never uploaded, stored, or transmitted to any server." }
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
              JSON Validator – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to check if JSON is valid online with line and column number?",
                  a: "Paste your JSON into our validator and it automatically checks syntax in real-time. If the JSON is invalid, the tool shows the exact error message along with the precise line and column number where the problem occurs."
                },
                {
                  q: "What does Invalid JSON mean and how to fix it?",
                  a: "Invalid JSON means the text does not follow strict JSON syntax rules. Common causes include missing commas between key-value pairs, extra trailing commas at the end of arrays or objects, single quotes instead of double quotes, and unmatched curly braces or square brackets."
                },
                {
                  q: "Is my JSON data sent to a server when I validate it?",
                  a: "No. The validation runs entirely inside your web browser using native JavaScript. Your data never leaves your device, making it completely safe for validating API responses that contain sensitive information like tokens and keys."
                },
                {
                  q: "What is the difference between JSON Validator and JSON Formatter?",
                  a: "A JSON Validator only checks whether the syntax is correct or not. A JSON Formatter does the same check but also re-indents and spaces the JSON to make it easily readable by humans."
                },
                {
                  q: "Can I validate large JSON files online for free?",
                  a: "Yes. Since the validation runs in your browser without server limits, it can handle large JSON payloads. Performance depends on your device, but most files validate instantly."
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
                { to: "/tools/json-formatter",          title: "JSON Formatter & Validator", desc: "Beautify, minify and validate JSON with syntax highlighting." },
                { to: "/tools/fake-data-generator",       title: "Fake Data Generator",        desc: "Generate realistic dummy JSON data for testing." },
                { to: "/tools/excel-formula-beautifier", title: "Excel Formula Beautifier",   desc: "Format messy Excel formulas for readability." }
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

export default JsonValidator;