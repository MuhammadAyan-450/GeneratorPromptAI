import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, Copy, RefreshCw, Dices, ChevronDown,
  ChevronUp, CheckCircle, Shuffle, Hash
} from "lucide-react";

// ─── Crypto-secure random ────────────────────────────────────────────────────
const secureRand = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;

// ─── Quick presets ────────────────────────────────────────────────────────────
const PRESETS = [
  { label: "🎲 Dice (1–6)",      min: 1,   max: 6,   count: 1,  unique: false, decimal: false },
  { label: "🪙 Coin Flip",       min: 0,   max: 1,   count: 1,  unique: false, decimal: false },
  { label: "🎰 Lottery (6/49)",  min: 1,   max: 49,  count: 6,  unique: true,  decimal: false },
  { label: "🎱 8-Ball (1–8)",    min: 1,   max: 8,   count: 1,  unique: false, decimal: false },
  { label: "📱 OTP (100000–999999)", min: 100000, max: 999999, count: 1,  unique: false, decimal: false },
  { label: "🃏 Card (1–52)",     min: 1,   max: 52,  count: 5,  unique: true,  decimal: false },
  { label: "💯 1–100 (×5)",      min: 1,   max: 100, count: 5,  unique: false, decimal: false },
  { label: "🔢 1–1000 (×10)",    min: 1,   max: 1000,count: 10,  unique: false, decimal: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
const RandomNumberGenerator = () => {
  const [min,          setMin]          = useState(1);
  const [max,          setMax]          = useState(100);
  const [count,        setCount]        = useState(1);
  const [unique,       setUnique]       = useState(false);
  const [decimal,      setDecimal]      = useState(false);
  const [sorted,       setSorted]       = useState(false);
  const [results,      setResults]      = useState([]);
  const [history,      setHistory]      = useState([]);
  const [copied,       setCopied]       = useState(false);
  const [copiedIdx,    setCopiedIdx]    = useState(null);
  const [error,        setError]        = useState("");
  const [showHistory,  setShowHistory]  = useState(true);
  const [toast,        setToast]        = useState("");
  const fileInputRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const generate = useCallback((
    overMin = min, overMax = max, overCount = count,
    overUnique = unique, overDecimal = decimal
  ) => {
    setError("");
    const minVal  = parseFloat(overMin);
    const maxVal  = parseFloat(overMax);
    const numCount = parseInt(overCount);

    if (isNaN(minVal) || isNaN(maxVal) || minVal >= maxVal) {
      setError("Min must be less than Max."); return;
    }
    if (isNaN(numCount) || numCount < 1 || numCount > 1000) {
      setError("Count must be between 1 and 1000."); return;
    }

    const generated = [];

    if (overUnique && !overDecimal) {
      const range = Math.floor(maxVal) - Math.ceil(minVal) + 1;
      if (numCount > range) { setError(`Only ${range} unique integers in this range.`); return; }

      // Fisher-Yates shuffle
      const pool = Array.from({ length: range }, (_, i) => Math.ceil(minVal) + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(secureRand() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      generated.push(...pool.slice(0, numCount));
    } else {
      generated.length = 0;
      for (let i = 0; i < numCount; i++) {
        if (overDecimal) {
          generated.push(parseFloat((minVal + secureRand() * (maxVal - minVal)).toFixed(4)));
        } else {
          generated.push(Math.floor(minVal + secureRand() * (maxVal - minVal + 1)));
        }
      }
    }

    const finalList = sorted ? [...generated].sort((a, b) => a - b) : generated;
    setResults(finalList);
    setHistory((prev) => [{
      numbers: finalList,
      range:   `${overMin}–${overMax}`,
      count:   numCount,
      ts:      new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
    }, ...prev].slice(0, 10));
    setCopied(false); setCopiedIdx(null);
  }, [min, max, count, unique, decimal, sorted]);

  const applyPreset = (preset) => {
    setMin(preset.min); setMax(preset.max); setCount(preset.count);
    setUnique(preset.unique); setDecimal(preset.decimal);
    generate(preset.min, preset.max, preset.count, preset.unique, preset.decimal);
  };

  const copyAll = () => {
    if (!results.length) return;
    navigator.clipboard.writeText(results.join(", "));
    setCopied(true); showToast("All numbers copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copySingle = (i, v) => {
    navigator.clipboard.writeText(String(v));
    setCopiedIdx(i); showToast(`${v} copied!`);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const reset = () => { setResults([]); setError(""); setCopied(false); setCopiedIdx(null); };

  const coinResult = results.length === 1 && min == 0 && max == 1
    ? (results[0] === 0 ? "🪙 Tails" : "🪙 Heads")
    : null;

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Random Number Generator",
    url: "https://www.generatorpromptai.com/tools/random-number-generator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free secure random number generator. Generate dice rolls, lottery numbers, OTP codes, unique numbers and decimals. Uses cryptographic Crypto API.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this random number generator truly random?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our generator uses the browser's built-in crypto.getRandomValues() API which produces cryptographically secure random numbers — far more random than Math.random()." },
      },
      {
        "@type": "Question",
        name: "Can I generate lottery numbers with this tool?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Use the Lottery (6/49) preset to instantly generate 6 unique random numbers between 1 and 49. You can also set a custom range for any lottery format." },
      },
      {
        "@type": "Question",
        name: "How do I generate unique random numbers without repeats?",
        acceptedAnswer: { "@type": "Answer", text: "Check the 'Unique (no repeats)' checkbox before generating. The tool uses a Fisher-Yates shuffle algorithm to ensure each number appears only once." },
      },
      {
        "@type": "Question",
        name: "Can I generate random decimal numbers?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Check the 'Allow Decimals' checkbox to generate floating-point numbers within your specified range, rounded to 4 decimal places." },
      },
      {
        "@type": "Question",
        name: "How many numbers can I generate at once?",
        acceptedAnswer: { "@type": "Answer", text: "Up to 1000 random numbers at once. Set the 'How Many?' field to any number between 1 and 1000." },
      },
    ],
  };

  // ADDED: Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.generatorpromptai.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Tools",
        item: "https://www.generatorpromptai.com/pages/all-tools"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Random Number Generator"
      }
    ]
  };

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800";

  return (
    <>
      <Helmet>
        <title>Random Number Generator - Free Dice, Lottery, OTP & Number Picker Online</title>
        <meta
          name="description"
          content="Free online random number generator — dice rolls, lottery number picker, OTP codes, unique numbers and decimals. Uses secure Crypto API. Generate up to 1000 numbers at once. No sign-up."
        />
        <meta
          name="keywords"
          content="random number generator, dice roll online, lottery number generator, random number picker, otp generator, unique random numbers, random decimal generator, free random number tool 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/random-number-generator" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Random Number Generator - Dice, Lottery, OTP & More Free" />
        <meta property="og:description" content="Generate random numbers instantly. Dice rolls, lottery picks, OTP codes, unique numbers. Up to 1000 at once. Free, secure, no sign-up." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/random-number-generator" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-random-number-generator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Random Number Generator - Dice, Lottery, OTP" />
        <meta name="twitter:description" content="Generate random numbers, dice rolls, lottery picks and OTP codes. Secure Crypto API. Free online tool." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-random-number-generator.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script> {/* Added Breadcrumb */}
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Dices className="text-sky-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Random Number Generator</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Dice rolls, lottery numbers, OTP codes, unique picks. Cryptographically secure. Up to 1000 numbers at once.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-6">

            {/* Quick Presets */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-400 rounded-xl transition-all text-sm font-medium text-gray-700 hover:text-sky-700 gap-1"
                  >
                    <span className="text-base">{preset.label.split(" ")[0]}</span>
                    <span className="text-xs text-center leading-tight">{preset.label.split(" ").slice(1).join(" ")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Settings */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Min Value</label>
                <input type="number" value={min} onChange={(e) => setMin(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Max Value</label>
                <input type="number" value={max} onChange={(e) => setMax(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">How Many?</label>
                <input type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="1000" className={inputCls} />
              </div>
              <div className="flex flex-col justify-end gap-3">
                {[
                  { checked: unique,  set: setUnique,  label: "Unique (no repeats)" },
                  { checked: decimal, set: setDecimal, label: "Allow Decimals" },
                  { checked: sorted,  set: setSorted,  label: "Sort Results" },
                ].map((opt) => (
                  <label key={opt.label} className={`flex items-center gap-2.5 cursor-pointer text-sm px-3 py-2 rounded-xl border transition-all ${opt.checked ? "bg-sky-50 border-sky-300 text-sky-700 font-medium" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                    <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${opt.checked ? "bg-sky-600 border-sky-600" : "border-gray-300"}`}>
                      {opt.checked && <span className="text-white text-xs">✓</span>}
                    </span>
                    <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="hidden" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>}

            {/* Generate */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => generate()}
                className="flex-1 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Dices size={18} /> Generate Numbers
              </button>
              <button
                onClick={reset}
                className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
                {/* Coin flip special display */}
                {coinResult && (
                  <div className="text-center py-4 mb-4">
                    <p className="text-5xl font-bold text-sky-600">{coinResult}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-700">
                    {results.length} number{results.length > 1 ? "s" : ""} generated
                  </p>
                  <button
                    onClick={copyAll}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-sky-200 hover:bg-sky-50 rounded-xl text-sm font-medium text-sky-700 transition-colors"
                  >
                    {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy All"}
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
                  {results.map((num, i) => (
                    <button
                      key={i}
                      onClick={() => copySingle(i, num)}
                      className={`relative py-2.5 rounded-xl border text-sm font-mono font-semibold transition-all hover:scale-105 active:scale-95 ${
                        copiedIdx === i
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white border-sky-200 text-gray-800 hover:border-sky-400"
                      }`}
                      title="Click to copy"
                    >
                      {copiedIdx === i ? "✓" : num}
                    </button>
                  ))}
                </div>

                {/* Stats */}
                {results.length > 1 && (
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-sky-100 text-xs text-gray-500">
                    <span>Min: <strong className="text-gray-700">{Math.min(...results)}</strong></span>
                    <span>Max: <strong className="text-gray-700">{Math.max(...results)}</strong></span>
                    <span>Sum: <strong className="text-gray-700">{results.reduce((a, b) => a + parseFloat(b), 0).toFixed(decimal ? 2 : 0)}</strong></span>
                    <span>Avg: <strong className="text-gray-700">{(results.reduce((a, b) => a + parseFloat(b), 0) / results.length).toFixed(decimal ? 2 : 1)}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-sky-600 transition-colors mb-3"
                >
                  <Hash size={15} /> Recent Generations ({history.length})
                  {showHistory ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                {showHistory && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((entry, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 gap-3">
                        <div className="min-w-0">
                          <span className="text-xs text-gray-400 mr-2">{entry.ts} · {entry.range} · {entry.count}×</span>
                          <span className="font-mono text-sm text-gray-700 truncate">{entry.numbers.join(", ")}</span>
                        </div>
                        <button
                          onClick={() => { navigator.clipboard.writeText(entry.numbers.join(", ")); showToast("Copied!"); }}
                          className="text-gray-400 hover:text-sky-600 flex-shrink-0"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!results.length && !history.length && (
              <div className="text-center py-12 text-gray-300">
                <Shuffle size={36} className="mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click Generate or use a quick preset above</p>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Random Number Generator — Secure &amp; Instant
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our random number generator uses your browser's built-in <code className="bg-gray-100 px-1 rounded text-sm">crypto.getRandomValues()</code> API — producing cryptographically secure random numbers, not pseudo-random Math.random() numbers. Generate up to 1000 numbers at once with custom ranges, unique picks, decimals, and sorted output.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Use cases</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li><strong>Lottery & giveaways</strong> — pick unique winners from a group</li>
              <li><strong>Dice rolls</strong> — roll D6, D8, D20 or any custom dice</li>
              <li><strong>OTP codes</strong> — generate 6-digit one-time passwords</li>
              <li><strong>Statistics & research</strong> — random sampling from a population</li>
              <li><strong>Games</strong> — random card draws, team assignments, spin the wheel</li>
              <li><strong>Development & testing</strong> — generate test data with random values</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is this random number generator truly random?", a: "Yes. It uses the browser's crypto.getRandomValues() API which is cryptographically secure — far more random and unpredictable than Math.random()." },
                { q: "Can I generate lottery numbers?", a: "Yes. Use the Lottery (6/49) preset to instantly generate 6 unique random numbers from 1–49. You can customize the range for any lottery format." },
                { q: "How do I generate unique random numbers with no repeats?", a: "Check the 'Unique (no repeats)' checkbox. The tool uses a Fisher-Yates shuffle to ensure each number in your results appears only once." },
                { q: "Can I sort the generated numbers?", a: "Yes. Check 'Sort Results' before generating and all numbers will be sorted in ascending order automatically." },
                { q: "How many random numbers can I generate at once?", a: "Up to 1000 random numbers at once. Set the 'How Many?' field to any value between 1 and 1000." },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate %, increase, decrease, discount and tax." },
                { to: "/tools/age-calculator",        title: "Age Calculator",        desc: "Calculate exact age in years, months and days." },
                { to: "/tools/password-generator",    title: "Password Generator",    desc: "Generate secure random passwords and passphrases." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
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

export default RandomNumberGenerator;