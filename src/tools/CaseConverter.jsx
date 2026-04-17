import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Type, FileText, Hash, AlignLeft } from "lucide-react";

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Calculate stats whenever text changes
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

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Case Converter",
    url: "https://www.generatorpromptai.com/tools/case-converter",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online case converter tool. Convert text to Uppercase, Lowercase, Title Case, Sentence Case, and more instantly.",
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
        name: "How do I use the Case Converter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply type or paste your text into the box and click the button for the style you want (e.g., Uppercase, Lowercase, Title Case). The text will convert instantly."
        }
      },
      {
        "@type": "Question",
        name: "Is the Case Converter free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our case converter is 100% free to use with no sign-up or limits."
        }
      },
      {
        "@type": "Question",
        name: "What is Title Case?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Title Case capitalizes the first letter of every word, often used for headlines or book titles."
        }
      },
      {
        "@type": "Question",
        name: "Can I download the converted text?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can copy the text to your clipboard or download it as a .txt file using the buttons provided."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Case Converter Online Free | Change Text to Upper Lower</title>
        <meta
          name="description"
          content="Free case converter! Instantly change text to UPPERCASE, lowercase, Title Case, Sentence case & more. Copy-paste ready. No signup required! ✍️"
        />
        <meta
          name="keywords"
          content="case converter, uppercase to lowercase converter, text case converter, convert to uppercase, convert to lowercase, title case converter online, sentence case converter, change text case, caps converter, lowercase to uppercase, text transformer tool"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/case-converter" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Case Converter Tool ✍️ Change Text Case Instantly - Free" />
        <meta
          property="og:description"
          content="Convert text to UPPERCASE, lowercase, Title Case, or Sentence case in 1 click! Free online tool. Perfect for writers & editors! 📝"
        />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/case-converter" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-case-converter.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Case Converter - Transform Text Case Online ✍️" />
        <meta
          name="twitter:description"
          content="Change text to uppercase, lowercase, title case & more instantly! Free tool for writers, students & professionals. 📝"
        />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-case-converter.png" />

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
              <Type className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Free Case Converter - Change Text to Uppercase, Lowercase & Title Case
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Easily convert text to Uppercase, Lowercase, Title Case, and more. Fast, free, and works instantly in your browser.
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

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Case Converter — Transform Text Instantly
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our <strong>Case Converter</strong> tool is designed for anyone who needs to quickly change the formatting of text. Whether you have accidentally left your caps lock on or need to format a headline for a blog post, this tool handles it all instantly in your browser.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Use it to convert standard text to <strong>UPPERCASE</strong> for emphasis, <strong>lowercase</strong> for email addresses, or <strong>Title Case</strong> for headings. It’s completely free, requires no sign-up, and works on all devices.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Conversions:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li><strong>Sentence Case:</strong> Capitalizes only the first letter of the sentence.</li>
              <li><strong>Title Case:</strong> Capitalizes the first letter of every word (great for headers).</li>
              <li><strong>Uppercase:</strong> Converts all letters to capitals.</li>
              <li><strong>Lowercase:</strong> Converts all letters to small letters.</li>
              <li><strong>Inverse Case:</strong> Swaps the case of every letter (e.g., "Hello" becomes "hELLO").</li>
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
                  q: "How do I convert text to Title Case?",
                  a: "Simply paste your text into the box and click the 'Title Case' button. Our tool will automatically capitalize the first letter of every word."
                },
                {
                  q: "Is my text saved on your servers?",
                  a: "No. All text processing happens locally in your browser using JavaScript. We do not store or transmit your data."
                },
                {
                  q: "Can I use this on mobile?",
                  a: "Yes, our case converter is fully responsive and works perfectly on smartphones, tablets, and desktops."
                },
                {
                  q: "What is camelCase used for?",
                  a: "camelCase is a common naming convention in programming (e.g., `myVariableName`). Our tool helps you format text into this style easily."
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
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters, and sentences in your text." },
                { to: "/tools/lorem-ipsum-generator", title: "Lorem Ipsum Generator", desc: "Generate placeholder text for your designs and layouts." },
                { to: "/tools/remove-duplicate-lines", title: "Remove Duplicate Lines", desc: "Clean up lists by removing duplicate entries instantly." },
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