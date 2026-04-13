import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Code, FileCode, ShieldCheck, ArrowRight } from "lucide-react";

const HTMLEntityEncoder = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  // --- Actions ---

  const encodeHTML = () => {
    // Map of characters to entities
    const htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    const encoded = text.replace(/[&<>"']/g, function(m) {
      return htmlEntities[m];
    });
    setText(encoded);
  };

  const decodeHTML = () => {
    // Using a textarea to safely decode HTML entities
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    setText(txt.value);
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
    const file = new Blob([text], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "encoded-text.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HTML Entity Encoder",
    url: "https://www.generatorpromptai.com/tools/html-entity-encoder",
    applicationCategory: "DeveloperTools",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online HTML Entity Encoder/Decoder. Convert special characters to HTML entities and back. Essential for web developers.",
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
        name: "What is HTML Entity Encoding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HTML Entity encoding converts special characters (like < and >) into their corresponding HTML codes (like &lt; and &gt;). This is necessary to display these characters as text in web browsers."
        }
      },
      {
        "@type": "Question",
        name: "Why do I need to encode HTML?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you want to display code snippets or special characters on a webpage without the browser interpreting them as HTML tags, you must encode them first."
        }
      },
      {
        "@type": "Question",
        name: "Is this tool secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The conversion happens entirely in your browser using JavaScript. Your data is never sent to a server."
        }
      },
      {
        "@type": "Question",
        name: "Does it support all characters?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It supports the most common special characters required for HTML ( &, <, >, \", ')."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>HTML Entity Encoder - Encode & Decode Special Characters</title>
        <meta
          name="description"
          content="Free online HTML Entity Encoder and Decoder. Easily convert characters like <, >, and & into HTML entities for safe web display."
        />
        <meta
          name="keywords"
          content="html entity encoder, html decoder, escape html, unescape html, html converter, web developer tools"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/html-entity-encoder" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="HTML Entity Encoder - Developer Tool" />
        <meta property="og:description" content="Convert special characters to HTML entities instantly. Free tool for developers." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/html-entity-encoder" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-html-entity-encoder.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HTML Entity Encoder - Free Developer Tool" />
        <meta name="twitter:description" content="Encode and decode HTML special characters safely and instantly." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-html-entity-encoder.png" />

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
              <Code className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              HTML Entity Encoder
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Convert special characters to HTML entities and back. Essential for displaying code safely in web browsers.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Input Text
            </label>

            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none font-mono text-sm"
                placeholder="Paste your HTML code or text here..."
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
                onClick={encodeHTML} 
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <ArrowRight size={18} /> Encode to HTML
              </button>
              <button 
                onClick={decodeHTML} 
                className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} /> Decode to Text
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
                Download .html
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
              Free HTML Entity Encoder & Decoder
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Web developers often need to display code snippets or special characters (like `&lt;div&gt;`) on a webpage. If you write them directly, the browser interprets them as HTML tags. Our <strong>HTML Entity Encoder</strong> solves this by converting characters into their safe entity codes (e.g., `&amp;lt;div&amp;gt;`).
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Use the <strong>Encode</strong> button to prepare text for HTML source code. Use the <strong>Decode</strong> button if you have a string of entities and want to read the plain text. It works entirely in your browser for maximum speed and security.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Common Uses:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Displaying code snippets in blog posts.</li>
              <li>Embedding special characters in XML or JSON strings.</li>
              <li>Sanitizing user input to prevent basic HTML injection.</li>
              <li>Fixing broken text encoding.</li>
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
                  q: "What characters does this encoder support?",
                  a: "It supports the five essential XML/HTML characters: ampersand (&), less-than (<), greater-than (>), double quote (\") and single quote (')."
                },
                {
                  q: "Why does my code break when I paste it?",
                  a: "If you don't encode your HTML, the browser tries to render it as a website element instead of text. Use our encoder to turn it into text."
                },
                {
                  q: "Can I use this for JSON data?",
                  a: "Yes. JSON strings often require escaping quotes and backslashes. While this tool focuses on HTML entities, the principle is similar."
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
                { to: "/tools/url-encoder", title: "URL Encoder", desc: "Encode and decode URLs safely for web requests." },
                { to: "/tools/base64-encode", title: "Base64 Encoder", desc: "Convert text to Base64 strings and back." },
                { to: "/tools/json-formatter", title: "JSON Formatter", desc: "Beautify and validate your JSON data." },
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

export default HTMLEntityEncoder;