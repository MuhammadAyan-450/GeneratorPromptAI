import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, ArrowDown, ArrowUp, Shuffle } from "lucide-react";

const UppercaseToLowercase = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
  }, [text]);

  // --- Actions ---

  const toLowerCase = () => {
    setText(text.toLowerCase());
  };

  const toUpperCase = () => {
    setText(text.toUpperCase());
  };

  const toToggleCase = () => {
    const toggled = text
      .split("")
      .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
      .join("");
    setText(toggled);
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
    element.download = "converted-case.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Uppercase to Lowercase Converter",
    url: "https://www.generatorpromptai.com/tools/uppercase-to-lowercase",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online Uppercase to Lowercase converter. Instantly convert text case, fix caps lock, and swap letters.",
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
        name: "How do I convert uppercase to lowercase?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply paste your text into the box and click the 'Convert to Lowercase' button. Your text will change instantly."
        }
      },
      {
        "@type": "Question",
        name: "Can I convert lowercase to uppercase too?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our tool supports both directions. You can convert to lowercase, uppercase, or toggle the case of every letter."
        }
      },
      {
        "@type": "Question",
        name: "Why is my text stuck in uppercase?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You likely have Caps Lock on. Paste the text here and click 'Convert to Lowercase' to fix it quickly."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Uppercase to Lowercase Converter - Convert Text Case Instantly</title>
        <meta
          name="description"
          content="Free online Uppercase to Lowercase converter. Easily change text to lowercase, uppercase, or swap case. Fix caps lock errors instantly."
        />
        <meta
          name="keywords"
          content="uppercase to lowercase converter, convert to lowercase, fix caps lock, uppercase lowercase, swap case, text converter"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/uppercase-to-lowercase" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Uppercase to Lowercase Converter" />
        <meta property="og:description" content="Convert text between Uppercase and Lowercase instantly. Free and easy to use." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/uppercase-to-lowercase" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-uppercase-lowercase.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Uppercase to Lowercase Converter" />
        <meta name="twitter:description" content="Change text case instantly. Fix caps lock and format text easily." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-uppercase-lowercase.png" />

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
              <Shuffle className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Uppercase to Lowercase Converter
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Quickly change text to Uppercase, Lowercase, or swap the case of every letter. The fastest way to fix caps lock errors.
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
                placeholder="Type or paste text here to convert..."
              ></textarea>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="text-xs text-sky-500 uppercase font-bold tracking-wider">Words</p>
                  <p className="text-2xl font-bold text-sky-700">{wordCount}</p>
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">🔢</span>
                <div>
                  <p className="text-xs text-sky-500 uppercase font-bold tracking-wider">Characters</p>
                  <p className="text-2xl font-bold text-sky-700">{charCount}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button 
                onClick={toLowerCase} 
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <ArrowDown size={18} /> To Lowercase
              </button>
              <button 
                onClick={toUpperCase} 
                className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ArrowUp size={18} /> To Uppercase
              </button>
              <button 
                onClick={toToggleCase} 
                className="bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Shuffle size={18} /> Swap Case
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
              Uppercase to Lowercase Converter
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you have accidentally left your <strong>Caps Lock</strong> on and typed an entire paragraph in uppercase, our tool is the fastest way to fix it. Simply paste the text and click <strong>To Lowercase</strong>.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We also provide the reverse option (<strong>To Uppercase</strong>) for when you need to emphasize text or format headers. The <strong>Swap Case</strong> feature is handy if you want to invert the case of every letter in a specific string.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">When to use this tool?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Fixing accidental CAPS LOCK text.</li>
              <li>Formatting email subjects to standard sentence case.</li>
              <li>Converting code variables to specific casing styles (e.g., constants to UPPERCASE).</li>
              <li>Cleaning up data imported from other systems.</li>
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
                  q: "Does this tool remove formatting?",
                  a: "No, it only changes the case (uppercase/lowercase). It does not remove bold, italics, or other styling if you are pasting rich text."
                },
                {
                  q: "What is Swap Case?",
                  a: "Swap Case inverts the letter. If a letter is uppercase, it becomes lowercase, and vice versa. (e.g., 'Hello' becomes 'hELLO')."
                },
                {
                  q: "Is there a limit to how much text I can convert?",
                  a: "No, you can convert as much text as you like. It all happens in your browser, so it's fast and free."
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
                { to: "/tools/case-converter", title: "Case Converter", desc: "Convert text to Title Case, Sentence Case and more." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters, and sentences in your text." },
                { to: "/tools/remove-duplicate-lines", title: "Remove Duplicate Lines", desc: "Clean up lists by removing duplicate entries." },
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

export default UppercaseToLowercase;