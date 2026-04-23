// pages/WordCounter.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy, RefreshCw, FileText, Clock, Hash, AlignLeft, BookOpen,
  Home, ChevronDown, Layers, Type, AlertCircle, BarChart3
} from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
const WordCounter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Real-time calculations
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim()).length;
  const readingTimeMinutes = Math.ceil(words / 225);
  const readingTime =
    readingTimeMinutes > 1
      ? `${readingTimeMinutes} minutes`
      : readingTimeMinutes === 1
      ? "1 minute"
      : "less than a minute";

  // Top keywords (density)
  const getKeywordDensity = () => {
    if (words < 10) return [];
    const wordsArr = text.toLowerCase().match(/\b\w+\b/g) || [];
    const freqMap = {};
    wordsArr.forEach((w) => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });
    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / words) * 100).toFixed(1),
      }));
  };

  const keywords = getKeywordDensity();

  const copyStats = () => {
    const stats = [
      `Words: ${words}`,
      `Characters (with spaces): ${charsWithSpaces}`,
      `Characters (no spaces): ${charsWithoutSpaces}`,
      `Sentences: ${sentences}`,
      `Paragraphs: ${paragraphs}`,
      `Reading Time: ${readingTime}`,
      keywords.length > 0 ? "\nTop Keywords:" : "",
      ...keywords.map((kw) => `${kw.word}: ${kw.count} (${kw.percentage}%)`),
    ].join("\n");
    navigator.clipboard.writeText(stats);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const reset = () => {
    setText("");
    setCopied(false);
  };

  const statsString = [
    `${words} words`,
    `${charsWithSpaces} chars`,
    `${sentences} sentences`,
    `${paragraphs} paragraphs`,
    readingTime,
  ].join(" • ");

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Count Words Characters and Reading Time Online Free – Keyword Density Checker Tool",
    "url": "https://www.generatorpromptai.com/tools/word-counter",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online word counter. Instantly count words, characters (with/without spaces), sentences, paragraphs, reading time and top keyword density. No signup required. 100% private.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Word Counter", "item": "https://www.generatorpromptai.com/tools/word-counter" },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to count words and characters in text online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste or type your text into the word counter tool. Words, characters (with and without spaces), sentences, paragraphs, and reading time are calculated instantly in real-time as you type.",
        },
      },
      {
        "@type": "Question",
        "name": "How is reading time calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Reading time is estimated at an average speed of 225 words per minute, which is the standard reading speed for adults. This is the same formula used by Medium and most publishing platforms.",
        },
      },
      {
        "@type": "Question",
        "name:": "What is keyword density and why does it matter for SEO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Keyword density is the percentage of times a word appears compared to the total word count. For SEO, a primary keyword density of 1-2% is generally recommended. Our tool shows your top 5 keywords with their density percentage.",
        },
      },
      {
        "@type": "Question",
        "name": "Does this tool count characters with or without spaces?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Both. The tool shows characters with spaces (total length) and characters without spaces (letters, numbers, and symbols only). This covers the two most common character count formats used by different platforms.",
        },
      },
      {
        "@type": "Question",
        "name": "Is my text data private when using this word counter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All counting happens entirely in your browser using JavaScript. Your text is never sent to any server. The tool is 100% private and secure.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Count Words Characters and Reading Time Online Free – Keyword Density Checker Tool</title>

        <meta
          name="description"
          content="Free online word counter. Instantly count words, characters (with/without spaces), sentences, paragraphs, reading time and top keyword density. No signup required. 100% private."
        />

        <meta
          name="keywords"
          content="how to count words and characters in text online free, free online word counter with keyword density checker, count characters with and without spaces online tool, calculate reading time for blog post free online, sentence and paragraph counter free no signup, seo keyword density checker top words tool, free online word count tool for writers and students, check word limit for essay assignment free online, real time word character counter no upload, best free word counter with reading time estimate 2026, online text analysis tool count words sentences paragraphs"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/word-counter" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Count Words, Characters & Reading Time Free – Keyword Density Checker" />
        <meta property="og:description" content="Real-time word count, character count, reading time and keyword density. Free, private, no signup." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/word-counter" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Word Counter – Words, Characters, Reading Time, Keywords" />
        <meta name="twitter:description" content="Real-time word count, keyword density & reading time estimate. Free online tool." />

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
              <li><span className="text-gray-900 font-semibold">Word Counter</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <FileText className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Count Words Characters and Reading Time Online Free –{" "}
              <span className="text-sky-600">Keyword Density Checker Tool</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Real-time word count, character count, sentences, paragraphs, reading time estimate, and top keyword density analysis.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Paste or Type Your Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your text here..."
                className="w-full h-56 md:h-72 px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 resize-none text-base"
                spellCheck="false"
                aria-label="Text input for word counting"
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { icon: FileText, value: words.toLocaleString(), label: "Words" },
                { icon: AlignLeft, value: charsWithSpaces.toLocaleString(), label: "Chars (w/ spaces)" },
                { icon: Hash, value: charsWithoutSpaces.toLocaleString(), label: "Chars (no spaces)" },
                { icon: BookOpen, value: sentences.toLocaleString(), label: "Sentences" },
                { icon: Layers, value: paragraphs.toLocaleString(), label: "Paragraphs" },
                { icon: Clock, value: readingTime, label: "Reading Time" },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <div className="flex justify-center text-sky-500 mb-1">
                    <stat.icon size={20} />
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Summary Bar */}
            {words > 0 && (
              <div className="bg-gray-100 rounded-xl px-4 py-2.5 mb-6 text-center">
                <p className="text-sm text-gray-600 font-medium">{statsString}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-2 justify-center">
              <button
                onClick={copyStats}
                disabled={!text.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <Copy size={15} />
                {copied ? "Copied!" : "Copy All Stats"}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>
          </div>

          {/* ── Keyword Density (Dark Output Block) ── */}
          {keywords.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-sky-600" /> Top 5 Keywords & Density
              </h2>
              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">Keyword Analysis ({words.toLocaleString()} words total)</p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {keywords.map((kw, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg font-bold text-sky-400 font-mono">{kw.word}</p>
                      <p className="text-sm text-gray-400 mt-1">{kw.count} times</p>
                      <p className="text-xs font-semibold text-green-400 mt-1">{kw.percentage}%</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  SEO tip: Primary keyword density of 1–2% is generally recommended
                </p>
              </div>
            </div>
          )}

          {/* ── Empty State for Keywords ── */}
          {keywords.length === 0 && text.trim().length > 0 && text.trim().split(/\s+/).length < 10 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
              <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <BarChart3 size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Type at least <strong className="text-gray-500">10 words</strong> to see keyword density analysis</p>
              </div>
            </div>
          )}

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Word Counter — Words, Characters, Reading Time &amp; Keyword Density
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free word counter instantly calculates <strong>words, characters (with and without spaces), sentences, paragraphs</strong>, and <strong>estimated reading time</strong> as you type. The built-in keyword density analyzer shows your <strong>top 5 most-used words</strong> with their frequency and percentage — essential for SEO optimization, content analysis, and academic writing.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Reading time is calculated at <strong>225 words per minute</strong>, the standard average adult reading speed used by Medium and most publishing platforms. All processing happens <strong>100% in your browser</strong> — your text is never sent to any server, making it completely private and secure for confidential documents.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Count Words and Characters in Text Online Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li><strong>Type or paste</strong> your text into the textarea above — essays, blog posts, tweets, emails, or any content.</li>
              <li>All <strong>6 stats</strong> (words, characters, sentences, paragraphs, reading time) update <strong>instantly in real-time</strong>.</li>
              <li>Once you have 10+ words, the <strong>keyword density section</strong> appears showing your top 5 keywords with percentage.</li>
              <li>Click <strong>"Copy All Stats"</strong> to copy the complete analysis to your clipboard.</li>
              <li>Use it to <strong>check word limits</strong> for essays, assignments, social media posts, or SEO content.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Word Count Tool with Keyword Density – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "6 Real-Time Metrics", desc: "Words, characters with spaces, characters without spaces, sentences, paragraphs, and estimated reading time — all update instantly as you type with zero delay." },
                { title: "Top 5 Keyword Density Analysis", desc: "Automatically identifies your most-used words and calculates their density percentage — essential for SEO optimization and avoiding keyword stuffing in content." },
                { title: "Copy All Stats to Clipboard", desc: "One-click copy outputs all 6 metrics plus the full keyword analysis in a clean text format — ready to paste into reports, spreadsheets, or SEO documents." },
                { title: "100% Private & Browser-Based", desc: "All counting happens locally using JavaScript. Your text is never uploaded to any server. Safe for confidential documents, legal text, or unpublished writing." }
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
              Word Counter – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to count words and characters in text online free?",
                  a: "Paste or type your text into the word counter. Words, characters (with and without spaces), sentences, paragraphs, and reading time are calculated instantly in real-time as you type.",
                },
                {
                  q: "How is reading time calculated?",
                  a: "Reading time is estimated at 225 words per minute — the standard average adult reading speed used by Medium and most publishing platforms. This gives a reliable estimate for most English text.",
                },
                {
                  q: "What is keyword density and why does it matter for SEO?",
                  a: "Keyword density is the percentage of times a word appears compared to total word count. For SEO, a primary keyword density of 1–2% is generally recommended. Our tool shows your top 5 keywords with their density percentage automatically.",
                },
                {
                  q: "Does this tool count characters with or without spaces?",
                  a: "Both. Characters with spaces is the total string length. Characters without spaces counts only letters, numbers, and symbols — excluding all whitespace. This covers the two most common character count formats used by different platforms.",
                },
                {
                  q: "Is my text data private when using this word counter?",
                  a: "Yes. All counting happens entirely in your browser using JavaScript. Your text is never sent to any server. The tool is 100% private and secure — safe for confidential documents.",
                },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Text &amp; Writing Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/lorem-ipsum-generator", title: "Lorem Ipsum Generator", desc: "Generate placeholder text for wireframes, mockups and design prototypes." },
                { to: "/tools/case-converter", title: "Case Converter", desc: "Convert text to Uppercase, Lowercase, Title Case and more formats." },
                { to: "/tools/remove-duplicate-lines", title: "Remove Duplicate Lines", desc: "Clean up lists by removing repeated and blank entries instantly." },
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

export default WordCounter;