// pages/RandomNumberGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Dices, Coins, CopyCheck, ChevronDown, ChevronUp } from "lucide-react";

const RandomNumberGenerator = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [decimal, setDecimal] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(true);

  const generateNumbers = () => {
    setError("");

    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    const numCount = parseInt(count);

    if (isNaN(minVal) || isNaN(maxVal) || minVal >= maxVal) {
      setError("Min must be less than Max");
      return;
    }
    if (isNaN(numCount) || numCount < 1 || numCount > 1000) {
      setError("Count must be between 1 and 1000");
      return;
    }
    if (unique && numCount > (maxVal - minVal + 1)) {
      setError("Not enough unique numbers in range");
      return;
    }

    const generated = [];

    if (unique) {
      // Fisher-Yates shuffle for unique numbers
      let available = [];
      const step = decimal ? 0.01 : 1;
      for (let i = minVal; i <= maxVal + 0.0001; i += step) {
        available.push(decimal ? i.toFixed(2) : Math.floor(i));
      }
      // Shuffle
      for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
      }
      generated.push(...available.slice(0, numCount));
    } else {
      for (let i = 0; i < numCount; i++) {
        const rand = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
        let num = minVal + rand * (maxVal - minVal + (decimal ? 0.99 : 0));
        generated.push(decimal ? num.toFixed(2) : Math.floor(num));
      }
    }

    setResults(generated);
    setHistory(prev => [{ numbers: generated, timestamp: new Date().toLocaleString("en-PK") }, ...prev.slice(0, 9)]);
    setCopied(false);
    setCopiedIndex(null);
  };

  const copyResults = () => {
    if (results.length === 0) return;
    const text = results.join(", ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const copySingle = (index, value) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const quickGenerate = (minV, maxV, cnt = 1, dec = false, uniq = false) => {
    setMin(minV);
    setMax(maxV);
    setCount(cnt);
    setDecimal(dec);
    setUnique(uniq);
    setTimeout(generateNumbers, 100);
  };

  const reset = () => {
    setResults([]);
    setError("");
    setCopied(false);
    setCopiedIndex(null);
  };

  return (
    <>
      <Helmet>
        <title>Random Number Generator – Dice, Lottery, OTP & More</title>
        <meta
          name="description"
          content="Generate secure random numbers instantly – dice rolls, lottery picks, OTP codes, ranges, unique numbers, decimals. Uses Crypto API for true randomness. Free, no signup, built in Karachi."
        />
        <meta
          name="keywords"
          content="random number generator online, random dice roll, lottery number generator, secure random numbers, otp generator free, random number picker 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/random-number-generator" />

        <meta property="og:title" content="Random Number Generator – Free & Secure Online 2026" />
        <meta property="og:description" content="Generate random numbers, dice, lottery picks instantly – cryptographically secure." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Random Number Generator" />
        <meta name="twitter:description" content="Dice rolls, lottery, OTP, unique numbers – secure & instant." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Random Number Generator",
            url: "https://generatorpromptai.com/tools/random-number-generator",
            description: "Free secure random number generator for dice, lottery, OTP, ranges & more.",
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
            Random Number Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Secure random numbers • Dice • Lottery • OTP • Unique & decimals
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              {/* Quick Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <button
                  onClick={() => quickGenerate(1, 6, 1)}
                  className="flex flex-col items-center p-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition border hover:border-sky-300"
                >
                  <Dices size={32} className="mb-3 text-sky-600" />
                  <span className="font-medium text-center">Dice Roll</span>
                </button>
                <button
                  onClick={() => quickGenerate(0, 1, 1)}
                  className="flex flex-col items-center p-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition border hover:border-sky-300"
                >
                  <Coins size={32} className="mb-3 text-sky-600" />
                  <span className="font-medium text-center">Coin Flip</span>
                </button>
                <button
                  onClick={() => quickGenerate(1, 49, 6, false, true)}
                  className="flex flex-col items-center p-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition border hover:border-sky-300"
                >
                  <RefreshCw size={32} className="mb-3 text-sky-600" />
                  <span className="font-medium text-center">Lottery (6/49)</span>
                </button>
                <button
                  onClick={() => quickGenerate(1, 100, 5)}
                  className="flex flex-col items-center p-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition border hover:border-sky-300"
                >
                  <CopyCheck size={32} className="mb-3 text-sky-600" />
                  <span className="font-medium text-center">1–100 (5×)</span>
                </button>
              </div>

              {/* Custom Settings */}
              <div className="grid md:grid-cols-4 gap-6 mb-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Value</label>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Value</label>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How Many?</label>
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="flex flex-col gap-4 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unique}
                      onChange={(e) => setUnique(e.target.checked)}
                      className="h-5 w-5 text-sky-600 rounded"
                    />
                    <span className="text-gray-700">Unique (no repeats)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={decimal}
                      onChange={(e) => setDecimal(e.target.checked)}
                      className="h-5 w-5 text-sky-600 rounded"
                    />
                    <span className="text-gray-700">Allow Decimals</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <button
                  onClick={generateNumbers}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Dices size={20} />
                  Generate Numbers
                </button>

                <button
                  onClick={reset}
                  className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Reset
                </button>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-xl mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Generated Numbers ({results.length})
                    </h3>
                    <button
                      onClick={copyResults}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                    >
                      <Copy size={16} />
                      {copied ? "Copied!" : "Copy List"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
                    {results.map((num, i) => (
                      <button
                        key={i}
                        onClick={() => copySingle(i, num)}
                        className="p-3 bg-white border rounded-lg hover:bg-gray-50 transition text-lg font-mono relative group"
                        title="Click to copy single number"
                      >
                        {num}
                        {copiedIndex === i && (
                          <span className="absolute inset-0 flex items-center justify-center bg-green-500/80 text-white rounded-lg text-sm font-medium">
                            Copied!
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="mt-10">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4 hover:text-sky-600 transition"
                  >
                    Recent Generations ({history.length})
                    {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {showHistory && (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {history.map((entry, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-2">{entry.timestamp}</p>
                          <p className="font-mono text-sm break-all">{entry.numbers.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {results.length === 0 && history.length === 0 && (
                <div className="text-center py-16 text-gray-500 text-lg">
                  Click Generate or use quick presets above
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
               Random Number Generator – Dice, Lottery, OTP
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Generate truly random numbers with cryptographic security using the browser's Crypto API. Perfect for dice rolls, lottery picks, OTP codes, giveaways, games, random sampling, testing, or token generation. Supports unique numbers, decimals, custom ranges, and up to 1000 numbers at once. History keeps your last 10 generations.
              </p>
              <p>
                Built in Karachi – 100% free, private, no signup. Ideal for students, gamers, developers, businesses, and anyone in Pakistan or worldwide needing secure randomness fast.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Random Number Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Set min & max values for your range (default 1–100).</li>
                <li>Choose how many numbers to generate (1–1000).</li>
                <li>Check "Unique" for no repeats (great for lotteries/raffles).</li>
                <li>Check "Allow Decimals" for floating-point results.</li>
                <li>Click <strong>Generate Numbers</strong> or use quick presets (Dice, Coin, Lottery…).</li>
                <li>Results appear instantly — click any number to copy it.</li>
                <li>Click <strong>Copy List</strong> for all numbers at once.</li>
                <li>View recent generations in the collapsible history section.</li>
                <li>Tip: Use high count + unique for secure token generation or fair draws.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/percentage-calculator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Percentage Calculator
                </h3>
                <p className="text-gray-600 text-sm">
                  Calculate %, increase, decrease, reverse & more.
                </p>
              </Link>

              <Link
                to="/tools/age-calculator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Age Calculator
                </h3>
                <p className="text-gray-600 text-sm">
                  Calculate exact age in years, months, days.
                </p>
              </Link>

              <Link
                to="/tools/currency-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Currency Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert currencies with real-time rates.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default RandomNumberGenerator;