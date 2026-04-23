import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Type, FileText, Hash, AlignLeft, Home, ChevronDown } from "lucide-react";

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
  }, [text]);

  // --- Actions ---
  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());

  const toTitleCase = () => {
    const titleCase = text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setText(titleCase);
  };

  const toSentenceCase = () => {
    const sentenceCase = text
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setText(sentenceCase);
  };

  const toInverseCase = () => {
    const inverse = text
      .split("")
      .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
      .join("");
    setText(inverse);
  };

  const toCamelCase = () => {
    const camel = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    setText(camel);
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
    element.download = "converted-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert Text to Uppercase Lowercase Title Case Online",
    "url": "https://www.generatorpromptai.com/tools/case-converter",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online tool to convert text to UPPERCASE, lowercase, Title Case, Sentence case, and camelCase instantly. Fix caps lock mistakes easily.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Case Converter", "item": "https://www.generatorpromptai.com/tools/case-converter" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to change text to Title Case online?",
        "acceptedAnswer": { "@type": "Answer", "text": "Paste your text into the tool above and click the 'Title Case' button. It will automatically capitalize the first letter of every word, which is perfect for headings and titles." }
      },
      {
        "@type": "Question",
        "name": "How to fix caps lock text online?",
        "acceptedAnswer": { "@type": "Answer", "text": "If you accidentally typed something with caps lock on, paste it into our tool and click 'lowercase' to instantly convert it back to normal text. You can also use 'Sentence case' to fix it properly." }
      },
      {
        "@type": "Question",
        "name": "How to convert text to camelCase for programming?",
        "acceptedAnswer": { "@type": "Answer", "text": "Paste your text with spaces or underscores into the tool and click 'camelCase'. It will remove spaces, lowercase the first word, and capitalize the first letter of each subsequent word (e.g., 'my variable name' becomes 'myVariableName')." }
      },
      {
        "@type": "Question",
        "name": "Is my text saved when I use this converter?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. All text conversion happens locally in your web browser using JavaScript. We do not store, save, or transmit your text to any server." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Title targeting long-tails */}
        <title>Convert Text to Uppercase, Lowercase, Title Case & camelCase Free</title>
        
        <meta
          name="description"
          content="Convert text to UPPERCASE, lowercase, Title Case, Sentence case, and camelCase instantly. Fix caps lock mistakes easily. Free online text case converter – no signup."
        />
        
        {/* Low comp keywords */}
        <meta
          name="keywords"
          content="convert text to uppercase lowercase title case online, change text case to sentence case free, camelcase text converter online free, fix caps lock text online tool, inverse case text converter, free online text case changer, uppercase to lowercase converter without paste"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/case-converter" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (No emojis) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Convert Text to Uppercase, Lowercase, Title Case & camelCase Free" />
        <meta property="og:description" content="Change text to UPPERCASE, lowercase, Title Case, Sentence case, or camelCase in 1 click. Free online tool for writers and developers." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/case-converter" />

        {/* Twitter Card (No emojis) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Text Case Converter – Uppercase, Lowercase, camelCase" />
        <meta name="twitter:description" content="Change text case instantly. Fix caps lock mistakes and convert to camelCase for coding. 100% free tool." />

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
              <li><span className="text-gray-900 font-semibold">Case Converter</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Type className="text-sky-600" size={28} />
            </div>
            {/* H1 targeting exact matches */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Convert Text to{" "}
              <span className="text-sky-600">Uppercase, Lowercase, Title Case & camelCase</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Change text formatting instantly. Fix caps lock mistakes, format headings, or convert to <strong>camelCase</strong> for programming. 100% free online tool.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Text
            </label>

            <div className="mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none"
                placeholder="Type or paste your content here to convert..."
              ></textarea>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center gap-3">
                <Hash className="text-sky-600" size={20} />
                <div>
                  <p className="text-xs text-sky-500 uppercase font-bold tracking-wider">Words</p>
                  <p className="text-2xl font-bold text-sky-700">{wordCount}</p>
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center gap-3">
                <FileText className="text-sky-600" size={20} />
                <div>
                  <p className="text-xs text-sky-500 uppercase font-bold tracking-wider">Characters</p>
                  <p className="text-2xl font-bold text-sky-700">{charCount}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <button onClick={toUpperCase} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all text-sm">UPPERCASE</button>
              <button onClick={toLowerCase} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all text-sm">lowercase</button>
              <button onClick={toTitleCase} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all text-sm">Title Case</button>
              <button onClick={toSentenceCase} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all text-sm">Sentence</button>
              <button onClick={toInverseCase} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all text-sm">iNVERSE</button>
              <button onClick={toCamelCase} className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all text-sm">camelCase</button>
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
                <AlignLeft size={16} />
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
            {/* H2 targeting: "change text case to sentence case free" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Text Case Changer – Fix Caps Lock & Format Headings
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free <strong>Case Converter</strong> tool is built for writers, students, and developers who need to quickly change text formatting. If you accidentally typed an entire paragraph with caps lock on, simply paste it here and click <strong>lowercase</strong> or <strong>Sentence case</strong> to fix it instantly without retyping.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You can also use it to format blog post titles using <strong>Title Case</strong>, emphasize specific text with <strong>UPPERCASE</strong>, or clean up variable names using <strong>camelCase</strong>. The tool processes everything locally in your browser.
            </p>
          </section>

          {/* ── Features Section ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "camelcase text converter online free" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              camelCase Text Converter & 6 Formatting Options
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Fix Caps Lock Mistakes", desc: "Accidentally typed in all caps? Convert it back to lowercase or Sentence case with one click." },
                { title: "camelCase for Developers", desc: "Convert standard text into camelCase formatting instantly for JavaScript variables and function names." },
                { title: "Title Case for Headings", desc: "Automatically capitalize the first letter of every word to create clean, professional-looking headings." },
                { title: "100% Private & Instant", desc: "Text conversion happens instantly in your browser. Your data is never uploaded to any server." }
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
              Text Case Converter – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to change text to Title Case online?",
                  a: "Paste your text into the tool above and click the 'Title Case' button. It will automatically capitalize the first letter of every word, which is perfect for headings and titles."
                },
                {
                  q: "How to fix caps lock text online?",
                  a: "If you accidentally typed something with caps lock on, paste it into our tool and click 'lowercase' to instantly convert it back to normal text. You can also use 'Sentence case' to fix it properly."
                },
                {
                  q: "How to convert text to camelCase for programming?",
                  a: "Paste your text with spaces or underscores into the tool and click 'camelCase'. It will remove spaces, lowercase the first word, and capitalize the first letter of each subsequent word (e.g., 'my variable name' becomes 'myVariableName')."
                },
                {
                  q: "Is my text saved when I use this converter?",
                  a: "No. All text conversion happens locally in your web browser using JavaScript. We do not store, save, or transmit your text to any server."
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

          {/* ── Related Tools ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Text & Code Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters, sentences, and get estimated reading time." },
                { to: "/tools/lorem-ipsum-generator", title: "Lorem Ipsum Generator", desc: "Generate placeholder dummy text for your designs and layouts." },
                { to: "/tools/remove-duplicate-lines", title: "Remove Duplicate Lines", desc: "Clean up lists by removing duplicate entries and sorting alphabetically." },
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

export default CaseConverter;