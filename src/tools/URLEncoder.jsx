import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Link as LinkIcon, Lock, Unlock, Globe } from "lucide-react";

const URLEncoder = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  // --- Actions ---

  const encodeURL = () => {
    try {
      // encodeURIComponent converts everything (like ?, =, &) to be safe for query params
      const encoded = encodeURIComponent(text);
      setText(encoded);
    } catch (e) {
      setText("Error: Could not encode URL.");
    }
  };

  const decodeURL = () => {
    try {
      const decoded = decodeURIComponent(text);
      setText(decoded);
    } catch (e) {
      setText("Error: Invalid URL string.");
    }
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
    element.download = "url-result.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "URL Encoder",
    url: "https://www.generatorpromptai.com/tools/url-encoder",
    applicationCategory: "DeveloperTools",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online URL Encoder and Decoder. Convert URLs into percent-encoded format and back. Safe and fast.",
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
        name: "What is URL Encoding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "URL encoding (also known as percent-encoding) converts characters into a format that can be transmitted over the Internet. For example, a space becomes '%20' or '+'."
        }
      },
      {
        "@type": "Question",
        name: "Why do I need to encode a URL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Browsers can get confused by special characters like spaces or question marks in a URL. Encoding ensures the browser interprets the URL correctly."
        }
      },
      {
        "@type": "Question",
        name: "Does this tool work for full links?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can paste a full URL, a query parameter, or just a string of text to encode it safely."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>URL Encoder & Decoder - Percent-Encode URLs Online</title>
        <meta
          name="description"
          content="Free online URL Encoder and Decoder. Convert special characters to percent-encoded format for safe web transmission."
        />
        <meta
          name="keywords"
          content="url encoder, url decoder, percent encoding, encode url, decode url, online url tool"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/url-encoder" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="URL Encoder & Decoder" />
        <meta property="og:description" content="Convert URLs to percent-encoded format and back. Free and secure." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/url-encoder" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-url-encoder.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="URL Encoder & Decoder" />
        <meta name="twitter:description" content="Convert URLs to percent-encoded format and back instantly." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-url-encoder.png" />

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
              <Globe className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              URL Encoder & Decoder
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Convert special characters into percent-encoded format for safe transmission. Encode and decode URLs instantly.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter URL or Text
            </label>

            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none font-mono text-sm"
                placeholder="Paste your URL or text here..."
              ></textarea>
            </div>

            {/* Stats Bar */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-6 flex items-center gap-3">
              <LinkIcon className="text-sky-600" size={20} />
              <div>
                <p className="text-xs text-sky-500 uppercase font-bold tracking-wider">Total Characters</p>
                <p className="text-2xl font-bold text-sky-700">{charCount}</p>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button 
                onClick={encodeURL} 
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <Lock size={18} /> Encode URL
              </button>
              <button 
                onClick={decodeURL} 
                className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Unlock size={18} /> Decode URL
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
              Free URL Encoder & Decoder
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              URLs can only be sent over the Internet using the <strong>ASCII character-set</strong>. Since URLs often contain characters outside this set (like spaces, Chinese characters, or emojis), they must be converted into a valid ASCII format. This process is called <strong>URL Encoding</strong> (or Percent-Encoding).
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our tool replaces unsafe ASCII characters with a `%` followed by two hexadecimal digits. For example, a space is replaced by `%20`, and an exclamation mark `!` is replaced by `%21`.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Common Encoded Characters:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 font-mono text-sm">
              <li>Space: <code>%20</code></li>
              <li>Question Mark (?): <code>%3F</code></li>
              <li>Ampersand (&): <code>%26</code></li>
              <li>Equals (=): <code>%3D</code></li>
              <li>Slash (/): <code>%2F</code></li>
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
                  q: "What is the difference between encoding and decoding?",
                  a: "Encoding converts plain text into a safe URL format (e.g., 'hello world' to 'hello%20world'). Decoding does the reverse, converting the encoded text back to its original form."
                },
                {
                  q: "When should I use URL encoding?",
                  a: "Use it whenever you are passing user input (like search queries) as part of a URL. This prevents the browser from misinterpreting special characters."
                },
                {
                  q: "Is my data secure?",
                  a: "Yes. All processing happens locally in your browser. We do not store or transmit the URLs you enter."
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
                { to: "/tools/base64-encode", title: "Base64 Encoder", desc: "Encode and decode text to Base64 format." },
                { to: "/tools/html-entity-encoder", title: "HTML Entity Encoder", desc: "Convert special characters to HTML entities." },
                { to: "/tools/json-formatter", title: "JSON Formatter", desc: "Beautify and validate JSON data instantly." },
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

export default URLEncoder;