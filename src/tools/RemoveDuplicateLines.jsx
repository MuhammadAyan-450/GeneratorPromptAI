// pages/RemoveDuplicateLines.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy, RefreshCw, Download, List, Home, ChevronDown,
  Hash, Type, Layers, Trash2, ArrowUp, ArrowDown, FileText
} from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
const RemoveDuplicateLines = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeAction, setActiveAction] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const removeDuplicates = () => {
    const lines = inputText.split("\n");
    const unique = [...new Set(lines)];
    setOutputText(unique.join("\n"));
    setActiveAction("duplicates");
  };

  const removeDuplicatesAndEmpty = () => {
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");
    const unique = [...new Set(lines)];
    setOutputText(unique.join("\n"));
    setActiveAction("duplicates-empty");
  };

  const removeEmptyLines = () => {
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");
    setOutputText(lines.join("\n"));
    setActiveAction("empty");
  };

  const sortLinesAsc = () => {
    const lines = inputText.split("\n");
    lines.sort((a, b) => a.localeCompare(b));
    setOutputText(lines.join("\n"));
    setActiveAction("sort-asc");
  };

  const sortLinesDesc = () => {
    const lines = inputText.split("\n");
    lines.sort((a, b) => b.localeCompare(a));
    setOutputText(lines.join("\n"));
    setActiveAction("sort-desc");
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
    link.download = `cleaned-list-${Date.now()}.txt`;
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
  const inputLines = inputText ? inputText.split("\n") : [];
  const outputLines = outputText ? outputText.split("\n") : [];
  const totalInput = inputLines.length;
  const totalOutput = outputLines.length;
  const duplicatesRemoved = totalInput - new Set(inputLines).size;
  const emptyRemoved = inputLines.filter((l) => l.trim() === "").length - outputLines.filter((l) => l.trim() === "").length;

  const hasResult = outputText.length > 0;

  const stats = hasResult
    ? [
        { icon: List, value: totalInput, label: "Input Lines" },
        { icon: Layers, value: totalOutput, label: "Output Lines", color: "text-green-600" },
        { icon: Trash2, value: Math.max(0, duplicatesRemoved), label: "Duplicates Removed", color: "text-orange-500" },
        { icon: Hash, value: Math.max(0, emptyRemoved), label: "Empty Lines Removed", color: "text-sky-600" },
      ]
    : [];

  const actionLabels = {
    "duplicates": "Remove Duplicates Only",
    "duplicates-empty": "Remove Duplicates & Empty Lines",
    "empty": "Remove Empty Lines Only",
    "sort-asc": "Sort A-Z (Ascending)",
    "sort-desc": "Sort Z-A (Descending)",
  };

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Remove Duplicate Lines from Text List Online Free – Sort and Clean Data Instantly",
    "url": "https://www.generatorpromptai.com/tools/remove-duplicate-lines",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online tool to remove duplicate lines from text lists. Sort alphabetically, remove empty lines, and clean up data instantly. Download result as .txt. No signup required.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Remove Duplicate Lines", "item": "https://www.generatorpromptai.com/tools/remove-duplicate-lines" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to remove duplicate lines from a text list online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste your list into the text area and click 'Remove Duplicates Only'. The tool instantly scans every line, keeps the first occurrence, and deletes all repeated lines. Copy or download the cleaned result."
        }
      },
      {
        "@type": "Question",
        "name": "Can I remove duplicate lines and empty lines at the same time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Click 'Remove Duplicates & Empty Lines' to perform both actions in one step. This removes all repeated entries and all blank lines, giving you a completely clean list."
        }
      },
      {
        "@type": "Question",
        "name:": "How to sort lines alphabetically after removing duplicates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "First click 'Remove Duplicates' to clean the list, then click 'Sort A-Z' to alphabetize. The result in the output block will be both deduplicated and sorted."
        }
      },
      {
        "@type": "Question",
        "name": "Is my text data safe when using this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All processing happens entirely in your browser using JavaScript. No text is ever sent to any server. Your data remains 100% private."
        }
      },
      {
        "@type": "Question",
        "name": "Can I remove duplicates from a large list with thousands of lines?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The tool handles large lists efficiently. For extremely large files (multiple megabytes), there is no strict limit, though very large inputs may cause a slight delay depending on your device."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Remove Duplicate Lines from Text List Online Free – Sort and Clean Data Instantly</title>

        <meta
          name="description"
          content="Free online tool to remove duplicate lines from text lists. Sort alphabetically, remove empty lines, and clean up data instantly. Download result as .txt. No signup required."
        />

        <meta
          name="keywords"
          content="how to remove duplicate lines from text list online free, delete repeated lines from large list instantly, remove blank empty lines from text file online, sort lines alphabetically after removing duplicates free, clean up email list remove duplicates online tool, text deduplication tool no signup free download, remove duplicate entries from csv data free online, free online list cleaner remove duplicates sort download, deduplicate text lines keep first occurrence free tool, best free duplicate line remover with sort and download 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/remove-duplicate-lines" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Remove Duplicate Lines Free – Sort & Clean Text Lists Instantly" />
        <meta property="og:description" content="Remove duplicate lines, sort alphabetically, delete blank lines. Download cleaned list as .txt. Free, private, no signup." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/remove-duplicate-lines" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Duplicate Line Remover – Sort & Clean Text Lists" />
        <meta name="twitter:description" content="Instantly remove duplicate lines and clean up text lists. Free online tool, no signup." />

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
              <li><span className="text-gray-900 font-semibold">Remove Duplicate Lines</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <List className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Remove Duplicate Lines from Text List Online Free –{" "}
              <span className="text-sky-600">Sort and Clean Data Instantly</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Clean up text lists by removing repeated entries, blank lines, and sorting alphabetically. Download the result as .txt.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Text Input */}
            <div className="mb-6">
              <label className={labelCls}>Paste Your List</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-52 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none font-mono text-sm"
                placeholder={"apple\nbanana\napple\norange\nbanana\ngrape\n\norange"}
              />
              <p className="text-xs text-gray-400 mt-1">
                {inputLines.length} line{inputLines.length !== 1 ? "s" : ""} in input
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <button
                onClick={removeDuplicates}
                disabled={!inputText.trim()}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-40 transition-all text-white font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={16} /> Remove Duplicates
              </button>
              <button
                onClick={removeDuplicatesAndEmpty}
                disabled={!inputText.trim()}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-40 transition-all text-white font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={16} /> Duplicates + Empty
              </button>
              <button
                onClick={removeEmptyLines}
                disabled={!inputText.trim()}
                className="bg-white border-2 border-sky-100 hover:bg-sky-50 disabled:opacity-40 text-sky-700 font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                <FileText size={16} /> Remove Empty
              </button>
              <button
                onClick={sortLinesAsc}
                disabled={!inputText.trim()}
                className="bg-white border-2 border-sky-100 hover:bg-sky-50 disabled:opacity-40 text-sky-700 font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                <ArrowUp size={16} /> Sort A-Z
              </button>
              <button
                onClick={sortLinesDesc}
                disabled={!inputText.trim()}
                className="bg-white border-2 border-sky-100 hover:bg-sky-50 disabled:opacity-40 text-sky-700 font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                <ArrowDown size={16} /> Sort Z-A
              </button>
              <button
                onClick={reset}
                className="bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-2 px-4 py-3"
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
                  <pre className="text-sm font-mono leading-relaxed text-gray-200 max-h-72 overflow-y-auto whitespace-pre-wrap">
                    {outputText}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={copyText}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Copy size={15} />
                    {copied ? "Copied!" : "Copy Result"}
                  </button>
                  <button
                    onClick={downloadText}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Download size={15} /> Download .txt
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasResult && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <List size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Paste a list and click <strong className="text-gray-500">Remove Duplicates</strong> to clean it up</p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Duplicate Line Remover — Clean Text Lists Instantly
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you have a messy list with repeated entries, our <strong>Remove Duplicate Lines</strong> tool is the fastest way to clean it up. Whether you're deduplicating email lists, cleaning SEO keywords, removing repeated entries from CSV data, or organizing a list of names — this tool handles it all <strong>instantly in your browser</strong>.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Unlike spreadsheet software that requires formulas and manual steps, our tool works with a single click. Paste your list, choose an action, and get a clean result. The built-in sort feature lets you alphabetize your list in A-Z or Z-A order after cleaning. No data is ever sent to any server — your text remains 100% private.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Remove Duplicate Lines from Text List Online Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li><strong>Paste your list</strong> into the text area — one item per line.</li>
              <li>Click <strong>"Remove Duplicates"</strong> to delete repeated lines while keeping the first occurrence of each.</li>
              <li>For a complete cleanup, click <strong>"Duplicates + Empty"</strong> to remove both duplicates and blank lines in one step.</li>
              <li>Optionally click <strong>"Sort A-Z"</strong> or <strong>"Sort Z-A"</strong> to alphabetize the cleaned list.</li>
              <li><strong>Copy</strong> the result to your clipboard or <strong>download as .txt</strong> for offline use.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Text Deduplication Tool with Sort – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "5 Cleaning Actions in One Tool", desc: "Remove duplicates only, remove duplicates plus empty lines, remove empty lines only, sort A-Z, or sort Z-A — every list cleanup operation you need in a single page." },
                { title: "Real-time Stats Comparison", desc: "See exactly how many lines were in your input, how many remain in output, how many duplicates were removed, and how many empty lines were cleaned — all in a 4-stat dashboard." },
                { title: "100% Browser-Based Processing", desc: "All text processing happens locally in your browser using JavaScript. No data is ever uploaded to any server, making it completely safe for sensitive lists like emails or contacts." },
                { title: "Copy & Download Cleaned List", desc: "One-click copy to clipboard for pasting back into your document, or download the cleaned list as a .txt file for offline use in spreadsheets, databases, or other tools." }
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
              Remove Duplicate Lines – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to remove duplicate lines from a text list online free?",
                  a: "Paste your list into the text area and click 'Remove Duplicates Only'. The tool instantly scans every line, keeps the first occurrence, and deletes all repeated lines. Copy or download the cleaned result."
                },
                {
                  q: "Can I remove duplicate lines and empty lines at the same time?",
                  a: "Yes. Click 'Remove Duplicates & Empty Lines' to perform both actions in one step. This removes all repeated entries and all blank lines, giving you a completely clean list."
                },
                {
                  q: "How to sort lines alphabetically after removing duplicates?",
                  a: "First click 'Remove Duplicates' to clean the list, then click 'Sort A-Z' to alphabetize. The result in the output block will be both deduplicated and sorted in ascending order."
                },
                {
                  q: "Is my text data safe when using this tool?",
                  a: "Yes. All processing happens entirely in your browser using JavaScript. No text is ever sent to any server. Your data remains 100% private at all times."
                },
                {
                  q: "Can I remove duplicates from a large list with thousands of lines?",
                  a: "Yes. The tool handles large lists efficiently using JavaScript Set operations. For extremely large files (multiple megabytes), there is no strict limit, though very large inputs may cause a slight delay depending on your device."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Text &amp; Data Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/case-converter", title: "Case Converter", desc: "Convert text to Uppercase, Lowercase, Title Case and more formats." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters, sentences and lines in your text instantly." },
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

export default RemoveDuplicateLines;