// pages/WordCounter.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, FileText, Clock, Hash, AlignLeft, BookOpen } from "lucide-react";

const WordCounter = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCharLimitWarning, setShowCharLimitWarning] = useState(false);

  // Real-time calculations
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n+/).filter(p => p.trim()).length;
  const readingTimeMinutes = Math.ceil(words / 225);
  const readingTime = readingTimeMinutes > 1
    ? `${readingTimeMinutes} minutes`
    : readingTimeMinutes === 1 ? "1 minute"
    : "less than a minute";

  // Top keywords (density)
  const getKeywordDensity = () => {
    if (words < 10) return [];
    const wordsArr = text.toLowerCase().match(/\b\w+\b/g) || [];
    const freqMap = {};
    wordsArr.forEach(w => { freqMap[w] = (freqMap[w] || 0) + 1; });

    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / words) * 100).toFixed(1)
      }));
  };

  const keywords = getKeywordDensity();

  const copyStats = () => {
    const stats = [
      `Word Count: ${words}`,
      `Characters (with spaces): ${charsWithSpaces}`,
      `Characters (no spaces): ${charsWithoutSpaces}`,
      `Sentences: ${sentences}`,
      `Paragraphs: ${paragraphs}`,
      `Estimated Reading Time: ${readingTime}`,
      keywords.length > 0 ? "\nTop Keywords:" : "",
      ...keywords.map(kw => `${kw.word}: ${kw.count} (${kw.percentage}%)`)
    ].join("\n");

    navigator.clipboard.writeText(stats);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const clearText = () => {
    setText("");
    setCopied(false);
  };

  const charLimit = 10000;
  const remainingChars = charLimit - charsWithSpaces;

  return (
    <>
      <Helmet>
        <title>Word Counter – Count Words, Characters & Reading Time</title>
        <meta
          name="description"
          content="Instantly count words, characters (with/without spaces), sentences, paragraphs, reading time & keyword density. Perfect for writers, students, bloggers & SEO. Free, no signup, 100% private – built in Karachi."
        />
        <meta
          name="keywords"
          content="word counter online, count words free, character counter, reading time calculator, keyword density checker, free word count tool 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/word-counter" />

        <meta property="og:title" content="Word Counter – Free Online Tool 2026" />
        <meta property="og:description" content="Count words, characters, sentences, reading time & keyword density instantly." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Word Counter – Words, Characters, Reading Time" />
        <meta name="twitter:description" content="Real-time word count, keyword density & stats – no signup needed." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Word Counter",
            url: "https://generatorpromptai.com/tools/word-counter",
            description: "Free online tool to count words, characters, sentences, paragraphs, reading time and keyword density.",
            applicationCategory: "UtilityApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Word Counter
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Count words • characters • sentences • reading time • keyword density
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your text here..."
                className="w-full h-64 md:h-96 px-5 py-4 font-sans text-base border border-gray-300 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-gray-900"
                spellCheck="false"
                aria-label="Text input for word counting"
              />

              {charsWithSpaces > charLimit && (
                <p className="mt-2 text-red-600 text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} /> Character limit exceeded ({remainingChars} remaining)
                </p>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
                <div className="p-5 bg-gray-50 rounded-xl text-center border border-gray-100">
                  <FileText className="mx-auto mb-2 text-sky-600" size={28} />
                  <p className="text-2xl font-bold">{words.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Words</p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl text-center border border-gray-100">
                  <AlignLeft className="mx-auto mb-2 text-sky-600" size={28} />
                  <p className="text-2xl font-bold">{charsWithSpaces.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Characters (with spaces)</p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl text-center border border-gray-100">
                  <Hash className="mx-auto mb-2 text-sky-600" size={28} />
                  <p className="text-2xl font-bold">{charsWithoutSpaces.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Characters (no spaces)</p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl text-center border border-gray-100">
                  <BookOpen className="mx-auto mb-2 text-sky-600" size={28} />
                  <p className="text-2xl font-bold">{sentences.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Sentences</p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl text-center border border-gray-100">
                  <FileText className="mx-auto mb-2 text-sky-600" size={28} />
                  <p className="text-2xl font-bold">{paragraphs.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">Paragraphs</p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl text-center border border-gray-100">
                  <Clock className="mx-auto mb-2 text-sky-600" size={28} />
                  <p className="text-2xl font-bold">{readingTime}</p>
                  <p className="text-sm text-gray-600 mt-1">Reading Time</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button
                  onClick={copyStats}
                  disabled={!text.trim()}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50 font-medium"
                >
                  <Copy size={18} />
                  {copied ? "Stats Copied!" : "Copy All Stats"}
                </button>

                <button
                  onClick={clearText}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition font-medium"
                >
                  <RefreshCw size={18} />
                  Clear Text
                </button>
              </div>

              {/* Keyword Density */}
              {keywords.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-center mb-6">Top Keywords & Density</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {keywords.map((kw, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                        <p className="font-bold text-lg">{kw.word}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {kw.count} times <span className="font-medium">({kw.percentage}%)</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Functional Word Counter – Words, Characters, Reading Time & Keywords
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Instantly count words, characters (with & without spaces), sentences, paragraphs, and estimate reading time with our free online word counter. Also shows top keyword density (great for SEO, content analysis, academic writing). Paste any text – essays, blog posts, tweets, scripts, emails, or code. Real-time updates, clean interface, and copyable stats. No signup, no limits, 100% private – all in your browser.
              </p>
              <p>
                Built in Karachi – perfect for students, bloggers, writers, SEO specialists, marketers, and content creators in Pakistan and worldwide. Fast, accurate, and completely free.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Word Counter
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Type or paste your text into the large textarea above.</li>
                <li>All stats (words, characters, sentences, paragraphs, reading time) update instantly as you type.</li>
                <li>Scroll down to see top 5 keywords with count & density % (useful for SEO & content optimization).</li>
                <li>Click <strong>Copy All Stats</strong> to copy complete statistics to clipboard.</li>
                <li>Click <strong>Clear Text</strong> to start fresh with new content.</li>
                <li>Tip: Use it to stay within word limits (essays, tweets), check readability, or optimize keyword usage for blogs/articles.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Text & Writing Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/lorem-ipsum-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Lorem Ipsum Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate placeholder text for designs & mockups.
                </p>
              </Link>

              <Link
                to="/tools/plagiarism-checker"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Plagiarism Checker
                </h3>
                <p className="text-gray-600 text-sm">
                  Check text for plagiarism & duplicate content.
                </p>
              </Link>

              <Link
                to="/tools/fake-data-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Fake Data Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate realistic dummy text & data.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default WordCounter;