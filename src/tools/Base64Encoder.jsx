import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, FileCode, Lock, Unlock } from "lucide-react";

const Base64Encoder = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  // --- Actions ---

  const encodeBase64 = () => {
    try {
      // Handle UTF-8 characters (emojis, etc) correctly
      const encoded = window.btoa(unescape(encodeURIComponent(text)));
      setText(encoded);
    } catch (e) {
      setText("Error: Could not encode text.");
    }
  };

  const decodeBase64 = () => {
    try {
      // Handle UTF-8 characters correctly
      const decoded = decodeURIComponent(escape(window.atob(text)));
      setText(decoded);
    } catch (e) {
      setText("Error: Invalid Base64 string.");
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
    element.download = "base64-result.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Base64 Encoder",
    url: "https://www.generatorpromptai.com/tools/base64-encode",
    applicationCategory: "DeveloperTools",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online Base64 Encoder and Decoder. Convert text to Base64 and back. Supports UTF-8 and emojis.",
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
        name: "What is Base64 encoding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is commonly used to embed images in HTML or send data over JSON."
        }
      },
      {
        "@type": "Question",
        name: "Does this support Emojis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Unlike simple encoders, our tool supports UTF-8 encoding, so emojis and special characters are preserved correctly."
        }
      },
      {
        "@type": "Question",
        name: "Is Base64 encryption?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, Base64 is an encoding format, not encryption. Anyone can decode a Base64 string easily. Do not use it for passwords."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Base64 Encoder & Decoder - Convert Text Online</title>
        <meta
          name="description"
          content="Free online Base64 Encoder and Decoder. Convert plain text to Base64 and back. Supports UTF-8, emojis, and special characters."
        />
        <meta
          name="keywords"
          content="base64 encode, base64 decode, base64 converter, text to base64, base64 to text, online base64 tool"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/base64-encode" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Base64 Encoder & Decoder" />
        <meta property="og:description" content="Encode and decode Base64 strings instantly with our free online developer tool." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/base64-encode" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-base64-encode.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Base64 Encoder & Decoder" />
        <meta name="twitter:description" content="Convert text to Base64 and back. Supports emojis and special characters." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-base64-encode.png" />

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
              <FileCode className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Base64 Encoder & Decoder
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Convert text to Base64 and vice versa. Supports UTF-8, emojis, and special characters instantly.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Text or Base64
            </label>

            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none font-mono text-sm"
                placeholder="Paste your text or Base64 string here..."
              ></textarea>
            </div>

            {/* Stats Bar */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-6 flex items-center gap-3">
              <FileCode className="text-sky-600" size={20} />
              <div>
                <p className="text-xs text-sky-500 uppercase font-bold tracking-wider">Total Characters</p>
                <p className="text-2xl font-bold text-sky-700">{charCount}</p>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button 
                onClick={encodeBase64} 
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <Lock size={18} /> Encode to Base64
              </button>
              <button 
                onClick={decodeBase64} 
                className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Unlock size={18} /> Decode from Base64
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
              Free Base64 Encoder & Decoder
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              <strong>Base64</strong> is a standard encoding method used to represent binary data (like images or files) in an ASCII string format. It is commonly used in web development to embed images directly into HTML/CSS or to transmit data safely over networks that only support text.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our tool makes it easy to switch between plain text and Base64. Unlike basic tools, we support <strong>UTF-8 encoding</strong>, ensuring that emojis, special characters, and non-English text do not get corrupted during conversion.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why use Base64?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Data Transmission:</strong> Send binary data over email or JSON APIs safely.</li>
              <li><strong>Image Embedding:</strong> Reduce HTTP requests by embedding small images directly in code.</li>
              <li><strong>Obfuscation:</strong> While not encryption, it hides plain text from casual viewing.</li>
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
                  q: "Is Base64 secure for passwords?",
                  a: "No. Base64 is encoding, not encryption. Anyone can decode it. Never use Base64 to store sensitive data like passwords. Use hashing (bcrypt) instead."
                },
                {
                  q: "Why do I see weird characters after encoding?",
                  a: "Base64 uses characters A-Z, a-z, 0-9, +, and /. It often includes padding characters (=) at the end."
                },
                {
                  q: "Can I encode images?",
                  a: "This specific tool is for text. However, you can paste image data URIs to decode the headers, or use our dedicated 'Image to Base64' tool."
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
                { to: "/tools/html-entity-encoder", title: "HTML Entity Encoder", desc: "Convert special characters to HTML entities." },
                { to: "/tools/url-encoder", title: "URL Encoder", desc: "Encode and decode URLs for safe web requests." },
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

export default Base64Encoder;