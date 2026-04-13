import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, List, Trash2, ArrowUp, ArrowDown, Minus } from "lucide-react";

const RemoveDuplicateLines = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Stats
  const [totalLines, setTotalLines] = useState(0);
  const [uniqueLines, setUniqueLines] = useState(0);

  useEffect(() => {
    const lines = text.split("\n");
    setTotalLines(lines.length);
    const unique = new Set(lines);
    setUniqueLines(unique.size);
  }, [text]);

  // --- Actions ---

  const removeDuplicates = () => {
    // Split by new line, filter out empty ones if desired, or keep them, then Set to unique
    const lines = text.split("\n");
    const unique = [...new Set(lines)];
    setText(unique.join("\n"));
  };

  const removeDuplicatesAndEmpty = () => {
    const lines = text.split("\n").filter(line => line.trim() !== "");
    const unique = [...new Set(lines)];
    setText(unique.join("\n"));
  };

  const removeEmptyLines = () => {
    const lines = text.split("\n").filter(line => line.trim() !== "");
    setText(lines.join("\n"));
  };

  const sortLinesAsc = () => {
    const lines = text.split("\n");
    lines.sort((a, b) => a.localeCompare(b));
    setText(lines.join("\n"));
  };

  const sortLinesDesc = () => {
    const lines = text.split("\n");
    lines.sort((a, b) => b.localeCompare(a));
    setText(lines.join("\n"));
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
    setCopied(false);
  };

  const handleDownload = () => {
    if (!text) return;
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cleaned-list.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Remove Duplicate Lines",
    url: "https://www.generatorpromptai.com/tools/remove-duplicate-lines",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online tool to remove duplicate lines from text lists. Sort lines alphabetically and remove empty entries instantly.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I remove duplicate lines?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paste your list into the text area and click 'Remove Duplicates'. Our tool will instantly scan and delete any repeated lines."
        }
      },
      {
        "@type": "Question",
        name: "Does this tool remove empty lines?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we have a specific option to 'Remove Duplicates & Empty Lines' to clean up your list completely."
        }
      },
      {
        "@type": "Question",
        name: "Can I sort my list?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. You can sort lines in Ascending (A-Z) or Descending (Z-A) order with one click."
        }
      },
      {
        "@type": "Question",
        name: "Is my data safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All processing happens in your browser. No data is sent to our servers."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Remove Duplicate Lines Online - Clean Up Text Lists</title>
        <meta
          name="description"
          content="Free online tool to remove duplicate lines from a list. Also supports sorting A-Z, removing empty lines, and formatting text. Instant and secure."
        />
        <meta
          name="keywords"
          content="remove duplicate lines, delete duplicate lines, sort lines online, remove blank lines, list cleaner, text deduplication tool"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/remove-duplicate-lines" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Remove Duplicate Lines - Free Text Tool" />
        <meta property="og:description" content="Clean up your lists instantly. Remove duplicates, sort lines, and delete blank entries." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/remove-duplicate-lines" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-remove-duplicate-lines.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Remove Duplicate Lines - List Cleaner" />
        <meta name="twitter:description" content="Instantly remove duplicate lines and clean up your text lists for free." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-remove-duplicate-lines.png" />

        {/* Schema: WebApplication */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

        {/* Schema: FAQ */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Back Nav */}
        <div className="max-w-4xl mx-auto w-full px-4 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <List className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Remove Duplicate Lines
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Clean up your text lists instantly. Remove repeated entries, sort alphabetically, and delete blank lines.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paste Your List
            </label>

            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none font-mono text-sm"
                placeholder="Paste your list here... (one item per line)"
              ></textarea>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center gap-3">
                <List className="text-sky-600" size={20} />
                <div>
                  <p className="text-xs text-sky-500 uppercase font-bold tracking-wider">Total Lines</p>
                  <p className="text-2xl font-bold text-sky-700">{totalLines}</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                <Minus className="text-green-600" size={20} />
                <div>
                  <p className="text-xs text-green-600 uppercase font-bold tracking-wider">Unique Lines</p>
                  <p className="text-2xl font-bold text-green-700">{uniqueLines}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <button onClick={removeDuplicates} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <Trash2 size={18} /> Remove Duplicates Only
              </button>
              <button onClick={removeDuplicatesAndEmpty} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                <Trash2 size={18} /> Remove Duplicates & Empty
              </button>
              <button onClick={sortLinesAsc} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <ArrowUp size={18} /> Sort A-Z
              </button>
              <button onClick={sortLinesDesc} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <ArrowDown size={18} /> Sort Z-A
              </button>
            </div>

            {/* Utility Actions */}
            <div className="flex flex-wrap justify-center gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Copy size={16} />
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all"
              >
                Download .txt
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-red-600 rounded-xl text-sm font-semibold transition-all"
              >
                <RefreshCw size={16} />
                Clear
              </button>
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Duplicate Line Remover
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you have a messy list with repeated entries, our <strong>Remove Duplicate Lines</strong> tool is the perfect solution. Whether you are cleaning up email lists, keywords for SEO, or data for Excel, this tool makes the process instant.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Simply paste your text into the box and click the appropriate button. You can choose to keep the duplicates but remove blank lines, or scrub the list entirely. It works 100% in your browser, ensuring your data remains private.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Remove Duplicates:</strong> Keeps the first occurrence of every line and deletes the rest.</li>
              <li><strong>Remove Empty Lines:</strong> Cleans up lists that have gaps between items.</li>
              <li><strong>Sort Lines:</strong> Automatically alphabetizes your list A-Z or Z-A.</li>
              <li><strong>Download Result:</strong> Save your cleaned list directly to your computer as a text file.</li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How do I remove duplicate lines from a text file?",
                  a: "Open your text file, copy the content, paste it into our tool, and click 'Remove Duplicates'. Then copy the result back to your file."
                },
                {
                  q: "Does it matter if there are spaces at the end of lines?",
                  a: "Currently, lines with trailing spaces are treated as distinct. For best results, use 'Remove Empty Lines' first, or ensure your data is clean."
                },
                {
                  q: "Can I sort a list of numbers?",
                  a: "Yes, the Sort A-Z feature works for numbers as well (sorting them numerically or as text strings)."
                },
                {
                  q: "Is there a limit to the text size?",
                  a: "There is no strict limit, but for extremely large files (megabytes of text), your browser might slow down slightly."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Online Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/case-converter", title: "Case Converter", desc: "Convert text to Uppercase, Lowercase, Title Case and more." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters, and lines in your text." },
                { to: "/tools/text-to-slug", title: "Text to Slug", desc: "Convert titles into URL-friendly slugs." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {tool.title}
                  </h3>
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