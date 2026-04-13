import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Fingerprint, Trash2, Settings, Hash } from "lucide-react";

const UUIDGenerator = () => {
  const [uuids, setUuids] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Settings
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);

  // --- Logic ---

  const generateUUID = () => {
    const ids = [];
    for (let i = 0; i < quantity; i++) {
      let id = crypto.randomUUID();
      
      if (removeHyphens) {
        id = id.replace(/-/g, "");
      }
      
      if (uppercase) {
        id = id.toUpperCase();
      }

      ids.push(id);
    }
    setUuids(ids.join("\n"));
  };

  const handleCopy = () => {
    if (!uuids) return;
    navigator.clipboard.writeText(uuids);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setUuids("");
    setCopied(false);
  };

  const handleDownload = () => {
    if (!uuids) return;
    const element = document.createElement("a");
    const file = new Blob([uuids], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "uuids.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UUID Generator",
    url: "https://www.generatorpromptai.com/tools/uuid-generator",
    applicationCategory: "DeveloperTools",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online UUID Generator. Generate version 4 UUIDs instantly. Supports bulk generation, uppercase, and no-hyphen formats.",
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
        name: "What is a UUID?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. Version 4 is randomly generated."
        }
      },
      {
        "@type": "Question",
        name: "Are these UUIDs truly unique?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "While theoretically there is a chance of collision, the mathematical probability of generating two identical v4 UUIDs is negligibly small."
        }
      },
      {
        "@type": "Question",
        name: "Can I generate multiple UUIDs at once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Use the 'Quantity' input in our tool to generate up to 5,000 UUIDs in a single click."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>UUID Generator - Create Random UUIDs Online</title>
        <meta
          name="description"
          content="Free online UUID v4 Generator. Create unique identifiers instantly. Supports bulk generation, uppercase, and no-hyphen formats."
        />
        <meta
          name="keywords"
          content="uuid generator, guid generator, random id generator, uuid v4, generate multiple uuids"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/uuid-generator" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="UUID Generator - Create Random IDs" />
        <meta property="og:description" content="Generate unique UUID v4 identifiers instantly. Free developer tool with bulk options." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/uuid-generator" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-uuid-generator.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UUID Generator" />
        <meta name="twitter:description" content="Generate random UUIDs v4 instantly. Bulk generation supported." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-uuid-generator.png" />

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
              <Fingerprint className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              UUID Generator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Generate unique Version 4 UUIDs instantly. Great for database keys, session IDs, and testing.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Settings Area */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="text-gray-600" size={18} />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Generation Settings</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="5000"
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Uppercase Toggle */}
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={uppercase} 
                      onChange={() => setUppercase(!uppercase)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">Uppercase</span>
                  </label>
                </div>

                {/* No Hyphens Toggle */}
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={removeHyphens} 
                      onChange={() => setRemoveHyphens(!removeHyphens)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">Remove Hyphens</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateUUID}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg mb-6 flex items-center justify-center gap-2"
            >
              <Hash size={20} />
              Generate {quantity > 1 ? `${quantity} UUIDs` : 'UUID'}
            </button>

            {/* Output Area */}
            <textarea
              value={uuids}
              readOnly
              className="w-full h-64 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none font-mono text-sm text-gray-700 resize-none mb-4"
              placeholder="Generated UUIDs will appear here..."
            ></textarea>

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
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online UUID Generator
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              A <strong>UUID (Universally Unique Identifier)</strong> is a 128-bit label used for information in computer systems. The term <strong>GUID (Globally Unique Identifier)</strong> is also used, mostly in Microsoft systems.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our generator creates <strong>Version 4 UUIDs</strong>, which are randomly generated. The probability of generating two identical v4 UUIDs is so low that it is considered safe for use as primary keys in databases or session tokens in web applications.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Bulk Generation:</strong> Generate up to 5,000 IDs at once.</li>
              <li><strong>Format Control:</strong> Toggle hyphens or uppercase as needed for your specific use case.</li>
              <li><strong>Cryptographically Secure:</strong> Uses the browser's native `crypto.randomUUID()` API.</li>
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
                  q: "What is the difference between UUID and GUID?",
                  a: "Functionally, they are almost identical. GUID is the term used by Microsoft, while UUID is the standard term. The structure is the same for Version 4."
                },
                {
                  q: "Can I use this for production databases?",
                  a: "Yes, Version 4 UUIDs are excellent for database primary keys because they are unique across tables and servers, preventing ID collisions."
                },
                {
                  q: "Why would I remove hyphens?",
                  a: "Some systems or APIs require IDs without hyphens (e.g., 32-character hex strings). Our tool handles this easily."
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
              Related Developer Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/unix-timestamp", title: "Unix Timestamp", desc: "Convert epoch seconds to human-readable dates." },
                { to: "/tools/base64-encode", title: "Base64 Encoder", desc: "Encode and decode text to Base64 format." },
                { to: "/tools/hash-generator", title: "Hash Generator", desc: "Generate MD5, SHA-1, and SHA-256 hashes." }, // Placeholder for future
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

export default UUIDGenerator;