import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, FileCode, Lock, Unlock, Home, ChevronDown } from "lucide-react";

const Base64Encoder = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const encodeBase64 = () => {
    try {
      const encoded = window.btoa(unescape(encodeURIComponent(text)));
      setText(encoded);
    } catch (e) {
      setText("Error: Could not encode text.");
    }
  };

  const decodeBase64 = () => {
    try {
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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Encode Text to Base64 Online & Decode Base64 to UTF-8",
    "url": "https://www.generatorpromptai.com/tools/base64-encode",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Free online tool to encode text to Base64 and decode Base64 strings back to UTF-8 text. Supports emojis and special characters.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Base64 Encoder Decoder", "item": "https://www.generatorpromptai.com/tools/base64-encode" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to encode text to Base64 online?",
        "acceptedAnswer": { "@type": "Answer", "text": "Paste your plain text into the tool above and click 'Encode to Base64'. Your text will instantly be converted into a Base64 string that you can copy or download." }
      },
      {
        "@type": "Question",
        "name": "How to decode a Base64 string back to readable text?",
        "acceptedAnswer": { "@type": "Answer", "text": "Paste your Base64 encoded string into the tool and click 'Decode from Base64'. The tool will convert it back to readable plain text instantly." }
      },
      {
        "@type": "Question",
        "name": "Does this Base64 converter support emojis and UTF-8?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Unlike basic encoders that break on special characters, our tool uses advanced UTF-8 encoding logic. You can safely encode and decode emojis, non-English text, and special symbols without any corruption." }
      },
      {
        "@type": "Question",
        "name": "Is Base64 the same as encryption?",
        "acceptedAnswer": { "@type": "Answer", "text": "No, Base64 is an encoding format, not encryption. It simply converts data into a different format using a public algorithm. Anyone can easily decode a Base64 string, so never use it to hide sensitive data like passwords." }
      },
      {
        "@type": "Question",
        "name": "Can I encode special characters to Base64?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our tool handles all special characters, symbols, and unicode text properly. It converts them into Base64 format accurately and decodes them back without losing any data." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Title targeting: "encode text to base64 online", "decode base64 to utf-8" */}
        <title>Encode Text to Base64 Online Free – Decode Base64 to UTF-8 String</title>
        
        <meta
          name="description"
          content="Encode text to Base64 and decode Base64 strings back to UTF-8 text instantly. Supports emojis, special characters, and unicode. Free online Base64 converter – no signup."
        />
        
        {/* Low competition long-tail keywords */}
        <meta
          name="keywords"
          content="encode text to base64 online, decode base64 to utf-8 text, base64 string converter with emojis, how to convert text to base64 manually, base64 encoding for utf-8 special characters, decode base64 string to readable text, free base64 encoder decoder tool, base64 to text converter online"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/base64-encode" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Encode Text to Base64 Online Free – Decode Base64 to UTF-8" />
        <meta property="og:description" content="Convert text to Base64 and decode Base64 strings back to readable UTF-8 text. Supports emojis and special characters." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/base64-encode" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Encode Text to Base64 Online – UTF-8 & Emoji Support" />
        <meta name="twitter:description" content="Free Base64 encoder and decoder. Convert text to Base64 and back. Supports emojis and special characters." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb Only ── */}
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
              <li><span className="text-gray-900 font-semibold">Base64 Encoder Decoder</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <FileCode className="text-sky-600" size={28} />
            </div>
            {/* H1 targeting exact match long-tails */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Encode Text to Base64 Online –{" "}
              <span className="text-sky-600">Decode Base64 to UTF-8</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Convert plain text to Base64 strings and decode Base64 back to readable text. Fully supports <strong>UTF-8, emojis, and special characters</strong>.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Text or Base64 String
            </label>

            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none font-mono text-sm"
                placeholder="Paste your plain text or Base64 string here..."
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

          {/* ── SEO Content 1 ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "base64 string converter" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Base64 String Converter – Encode & Decode UTF-8 Text
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              <strong>Base64</strong> is a standard binary-to-text encoding scheme used to represent binary data in an ASCII string format. It is widely used in web development to embed images directly into HTML/CSS, transmit data safely over JSON APIs, or encode complex strings.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Unlike basic tools that break when dealing with non-English text, our <strong>Base64 encoder and decoder</strong> uses advanced UTF-8 handling. This means you can safely <strong>encode text to Base64 with emojis</strong> and special symbols, and decode them back without any data corruption or missing characters.
            </p>
          </section>

          {/* ── How to Use Section ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "how to convert text to base64 manually" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Encode Text to Base64 with Emojis & Special Characters
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Paste your plain text (including <strong>emojis or special characters</strong>) into the text area above.</li>
              <li>Click the <strong>"Encode to Base64"</strong> button.</li>
              <li>Your text will instantly convert into a Base64 string. Click <strong>"Copy Text"</strong> or <strong>"Download .txt"</strong> to save it.</li>
              <li>To reverse the process, paste a Base64 string and click <strong>"Decode from Base64"</strong>.</li>
            </ol>
          </section>

          {/* ── Features Section ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "base64 encoding for utf-8 special characters" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Base64 Encoding for UTF-8, Emojis & Special Characters
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Full UTF-8 Support", desc: "Encode and decode emojis, non-English alphabets, and special unicode characters without any corruption." },
                { title: "Instant Conversion", desc: "Convert text to Base64 and back instantly in your browser. No server upload, no waiting." },
                { title: "Copy & Download", desc: "One-click copy to clipboard or download the result as a .txt file for easy use in your code." },
                { title: "100% Private & Free", desc: "Your text never leaves your browser. No data is sent to any server, ensuring total privacy." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ Section (Accordion) ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Base64 Encoder & Decoder – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to encode text to Base64 online?",
                  a: "Paste your plain text into the tool above and click 'Encode to Base64'. Your text will instantly be converted into a Base64 string that you can copy or download."
                },
                {
                  q: "How to decode a Base64 string back to readable text?",
                  a: "Paste your Base64 encoded string into the tool and click 'Decode from Base64'. The tool will convert it back to readable plain text instantly."
                },
                {
                  q: "Does this Base64 converter support emojis and UTF-8?",
                  a: "Yes. Unlike basic encoders that break on special characters, our tool uses advanced UTF-8 encoding logic. You can safely encode and decode emojis, non-English text, and special symbols without any corruption."
                },
                {
                  q: "Is Base64 the same as encryption?",
                  a: "No, Base64 is an encoding format, not encryption. It simply converts data into a different format using a public algorithm. Anyone can easily decode a Base64 string, so never use it to hide sensitive data like passwords."
                },
                {
                  q: "Can I encode special characters to Base64?",
                  a: "Yes. Our tool handles all special characters, symbols, and unicode text properly. It converts them into Base64 format accurately and decodes them back without losing any data."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">
                      {item.q}
                    </h3>
                    <ChevronDown
                      size={22}
                      className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related Tools (Fixed broken links) ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Developer Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/url-encoder", title: "URL Encoder & Decoder", desc: "Encode and decode URLs into percent-encoded format for safe web transmission." },
                { to: "/tools/json-formatter", title: "JSON Formatter & Validator", desc: "Beautify, minify, and validate JSON data instantly with error highlighting." },
                { to: "/tools/unix-timestamp", title: "Unix Timestamp Converter", desc: "Convert Unix Epoch timestamps to human-readable dates and vice versa." }
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