// pages/UUIDGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy, RefreshCw, Download, Fingerprint, Home, ChevronDown,
  Hash, Type, Layers, Settings, Trash2
} from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
const UUIDGenerator = () => {
  const [uuids, setUuids] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Settings
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);

  // ── Logic ───────────────────────────────────────────────────────────────────
  const generateUUID = () => {
    const ids = [];
    for (let i = 0; i < quantity; i++) {
      let id = crypto.randomUUID();
      if (removeHyphens) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      ids.push(id);
    }
    setUuids(ids.join("\n"));
  };

  const copyText = () => {
    if (!uuids) return;
    navigator.clipboard.writeText(uuids);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!uuids) return;
    const blob = new Blob([uuids], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `uuids-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setUuids("");
    setCopied(false);
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const uuidList = uuids ? uuids.split("\n").filter(Boolean) : [];
  const uuidCount = uuidList.length;
  const charsPerUuid = uuidList[0] ? uuidList[0].length : 0;
  const totalChars = uuids.length;
  const hasResult = uuids.length > 0;

  const stats = hasResult
    ? [
        { icon: Hash, value: uuidCount, label: "UUIDs Generated" },
        { icon: Fingerprint, value: "v4", label: "Version" },
        { icon: Type, value: `${charsPerUuid} chars`, label: "Per UUID" },
        { icon: Layers, value: totalChars, label: "Total Characters" },
      ]
    : [];

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generate Random UUID v4 Online Free – Bulk Unique Identifier Maker No Hyphens",
    "url": "https://www.generatorpromptai.com/tools/uuid-generator",
    "applicationCategory": "DeveloperTools",
    "operatingSystem": "All",
    "description": "Free online UUID v4 generator. Create unique 128-bit identifiers instantly. Bulk generation up to 5000, uppercase, no-hyphen formats. Uses cryptographically secure crypto API. No signup.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "UUID Generator", "item": "https://www.generatorpromptai.com/tools/uuid-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to generate a random UUID v4 online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Set the quantity (default 1), optionally check Uppercase or Remove Hyphens, then click Generate UUID. The tool uses the browser's crypto.randomUUID() API for cryptographically secure random generation. Copy or download the result."
        }
      },
      {
        "@type": "Question",
        "name": "What is a UUID and is it truly unique?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A UUID (Universally Unique Identifier) is a 128-bit number. Version 4 UUIDs are randomly generated. While collisions are theoretically possible, the probability is so infinitesimally small (1 in 2^122) that they are considered practically unique."
        }
      },
      {
        "@type": "Question",
        "name": "Can I generate multiple UUIDs at once for database seeding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Set the quantity field to the number of UUIDs you need (up to 5000) and click Generate. All UUIDs will appear in the output block, one per line, ready to copy or download as a .txt file for database seeding."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between UUID and GUID?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Functionally they are the same. UUID is the standard term (RFC 4122), while GUID (Globally Unique Identifier) is Microsoft's term. Version 4 UUIDs and GUIDs have identical structure — 32 hex digits in 5 groups separated by hyphens."
        }
      },
      {
        "@type": "Question",
        "name": "Why would I remove hyphens from a UUID?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Some systems, APIs, and databases require IDs without hyphens — a continuous 32-character hex string (e.g. 550e8400e29b41d4a716446655440000). Our tool generates this format when 'Remove Hyphens' is checked."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Generate Random UUID v4 Online Free – Bulk Unique Identifier Maker No Hyphens</title>

        <meta
          name="description"
          content="Free online UUID v4 generator. Create unique 128-bit identifiers instantly. Bulk generation up to 5000, uppercase, no-hyphen formats. Uses cryptographically secure crypto API. No signup."
        />

        <meta
          name="keywords"
          content="how to generate random uuid v4 online free, bulk uuid generator 5000 ids at once free, create unique identifier for database keys free tool, uuid generator without hyphens 32 character hex string, generate uppercase uuid for api keys free online, free online guid generator for developers no signup, uuid v4 generator cryptographically secure random, generate multiple uuids for database seeding free, best free uuid generator with download txt format 2026, random unique id maker for session tokens primary keys free"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/uuid-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate Random UUID v4 Free – Bulk Unique ID Maker | No Hyphens" />
        <meta property="og:description" content="Generate unique UUID v4 identifiers instantly. Bulk up to 5000, uppercase, no-hyphen. Cryptographically secure. Free." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/uuid-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free UUID v4 Generator – Bulk Unique Identifiers" />
        <meta name="twitter:description" content="Generate random UUIDs instantly. Bulk generation, uppercase, no-hyphens. Free developer tool." />

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
              <li><span className="text-gray-900 font-semibold">UUID Generator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Fingerprint className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Generate Random UUID v4 Online Free –{" "}
              <span className="text-sky-600">Bulk Unique Identifier Maker No Hyphens</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Create cryptographically secure UUID v4 identifiers. Bulk generation, uppercase, no-hyphen formats. Perfect for database keys.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Settings */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="text-gray-600" size={18} />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Generation Settings</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className={labelCls}>Quantity</label>
                  <input
                    type="number"
                    min="1" max="5000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(5000, parseInt(e.target.value) || 1)))}
                    className={inputCls}
                  />
                  <p className="text-xs text-gray-400 mt-1">1 to 5,000</p>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 pb-3">
                    <input
                      type="checkbox"
                      checked={uppercase}
                      onChange={(e) => setUppercase(e.target.checked)}
                      className="h-4 w-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                    />
                    Uppercase
                  </label>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 pb-3">
                    <input
                      type="checkbox"
                      checked={removeHyphens}
                      onChange={(e) => setRemoveHyphens(e.target.checked)}
                      className="h-4 w-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                    />
                    Remove Hyphens
                  </label>
                </div>
              </div>
            </div>

            {/* Generate + Reset */}
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button
                onClick={generateUUID}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Hash size={18} /> Generate {quantity > 1 ? `${quantity} UUIDs` : "UUID"}
              </button>
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
                      <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Dark Output Block */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6 overflow-x-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
                    Generated UUID{uuidCount !== 1 ? "s" : ""} — Version 4
                  </p>
                  <pre className="text-sm font-mono leading-relaxed text-gray-200 max-h-72 overflow-y-auto whitespace-pre-wrap">
                    {uuids}
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
                <Fingerprint size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Click <strong className="text-gray-500">Generate UUID</strong> to create unique identifiers</p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online UUID v4 Generator — Cryptographically Secure Random IDs
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              A <strong>UUID (Universally Unique Identifier)</strong> is a 128-bit label used to uniquely identify information in computer systems. The term <strong>GUID (Globally Unique Identifier)</strong> is used interchangeably in Microsoft ecosystems. Our generator creates <strong>Version 4 UUIDs</strong>, which are randomly generated using the browser's native <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">crypto.randomUUID()</code> API — far more secure than Math.random().
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The probability of generating two identical v4 UUIDs is approximately <strong>1 in 5.3 × 10^36</strong> — so small that collisions are considered impossible in practice. This makes UUIDs ideal for database primary keys, session tokens, API request IDs, and distributed system identifiers where uniqueness across servers is critical.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Generate Random UUID v4 Online Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Set the <strong>quantity</strong> — 1 for a single UUID, or up to 5,000 for bulk generation.</li>
              <li>Optionally check <strong>Uppercase</strong> for all-caps hex characters (e.g. for specific API requirements).</li>
              <li>Check <strong>Remove Hyphens</strong> if you need a continuous 32-character hex string without dashes.</li>
              <li>Click <strong>"Generate UUID"</strong> — the results appear in the dark output block with stats.</li>
              <li><strong>Copy</strong> individual UUIDs or the full list, or <strong>download as .txt</strong> for database seeding.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bulk UUID Maker for Database Keys – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Bulk Generation (Up to 5,000)", desc: "Generate a single UUID or thousands at once. Perfect for database seeding, test data generation, or creating batch session tokens. All IDs appear one per line for easy parsing." },
                { title: "Cryptographically Secure (crypto API)", desc: "Uses the browser's native crypto.randomUUID() which produces cryptographically secure random numbers — not Math.random() which is predictable and unsafe for security purposes." },
                { title: "Uppercase & No-Hyphen Formats", desc: "Toggle uppercase for APIs that require capital hex (e.g. AWS, Firebase). Remove hyphens to get a continuous 32-character string for systems that don't accept dashes." },
                { title: "Copy & Download as .txt", desc: "One-click copy to clipboard for pasting into code, SQL inserts, or Postman. Download the full list as a .txt file for offline use in scripts, seeders, or documentation." }
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
              UUID Generator – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to generate a random UUID v4 online free?",
                  a: "Set the quantity (default 1), optionally check Uppercase or Remove Hyphens, then click Generate UUID. The tool uses the browser's crypto.randomUUID() API for cryptographically secure random generation. Copy or download the result."
                },
                {
                  q: "What is a UUID and is it truly unique?",
                  a: "A UUID (Universally Unique Identifier) is a 128-bit number. Version 4 UUIDs are randomly generated. While collisions are theoretically possible, the probability is so infinitesimally small (1 in 2^122) that they are considered practically unique for all real-world use cases."
                },
                {
                  q: "Can I generate multiple UUIDs at once for database seeding?",
                  a: "Yes. Set the quantity field to the number you need (up to 5000) and click Generate. All UUIDs appear one per line, ready to copy or download as a .txt file for direct use in SQL INSERT statements or seed scripts."
                },
                {
                  q: "What is the difference between UUID and GUID?",
                  a: "Functionally they are the same. UUID is the standard term (RFC 4122), while GUID (Globally Unique Identifier) is Microsoft's terminology. Version 4 UUIDs and GUIDs have identical structure — 32 hex digits in 5 groups separated by hyphens."
                },
                {
                  q: "Why would I remove hyphens from a UUID?",
                  a: "Some systems, APIs, and databases require IDs without hyphens — a continuous 32-character hex string (e.g. 550e8400e29b41d4a716446655440000). Check 'Remove Hyphens' to generate this compact format."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Developer &amp; ID Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/unix-timestamp", title: "Unix Timestamp Converter", desc: "Convert epoch seconds to human-readable dates and vice versa." },
                { to: "/tools/base64-encode", title: "Base64 Encoder / Decoder", desc: "Encode and decode text to Base64 format for data transmission." },
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

export default UUIDGenerator;