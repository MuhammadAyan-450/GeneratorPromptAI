// pages/PercentageCalculator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw } from "lucide-react";

const PercentageCalculator = () => {
  const [activeTab, setActiveTab] = useState("percentOf");
  const [copied, setCopied] = useState(false);

  // State for each calculator
  const [percentOf, setPercentOf] = useState({ percent: "", number: "" });
  const [isWhatPercent, setIsWhatPercent] = useState({ part: "", whole: "" });
  const [percentChange, setPercentChange] = useState({ oldValue: "", newValue: "" });
  const [addSubtractPercent, setAddSubtractPercent] = useState({ value: "", percent: "", operation: "add" });
  const [reversePercent, setReversePercent] = useState({ finalValue: "", percentChange: "" });

  const calculatePercentOf = () => {
    const p = parseFloat(percentOf.percent);
    const n = parseFloat(percentOf.number);
    if (isNaN(p) || isNaN(n)) return "—";
    return (p / 100 * n).toFixed(2);
  };

  const calculateIsWhatPercent = () => {
    const part = parseFloat(isWhatPercent.part);
    const whole = parseFloat(isWhatPercent.whole);
    if (isNaN(part) || isNaN(whole) || whole === 0) return "—";
    return ((part / whole) * 100).toFixed(2) + "%";
  };

  const calculatePercentChange = () => {
    const oldV = parseFloat(percentChange.oldValue);
    const newV = parseFloat(percentChange.newValue);
    if (isNaN(oldV) || isNaN(newV) || oldV === 0) return "—";
    const change = ((newV - oldV) / oldV) * 100;
    const sign = change >= 0 ? "+" : "";
    const colorClass = change >= 0 ? "text-green-600" : "text-red-600";
    return <span className={colorClass}>{sign}{change.toFixed(2)}% {change >= 0 ? "(increase)" : "(decrease)"}</span>;
  };

  const calculateAddSubtract = () => {
    const v = parseFloat(addSubtractPercent.value);
    const p = parseFloat(addSubtractPercent.percent);
    if (isNaN(v) || isNaN(p)) return "—";
    const factor = addSubtractPercent.operation === "add" ? (1 + p / 100) : (1 - p / 100);
    return (v * factor).toFixed(2);
  };

  const calculateReverse = () => {
    const final = parseFloat(reversePercent.finalValue);
    const change = parseFloat(reversePercent.percentChange);
    if (isNaN(final) || isNaN(change)) return "—";
    const original = final / (1 + change / 100);
    return original.toFixed(2);
  };

  const copyResult = () => {
    let text = "";
    if (activeTab === "percentOf") text = calculatePercentOf();
    else if (activeTab === "isWhatPercent") text = calculateIsWhatPercent();
    else if (activeTab === "percentChange") text = percentChange.oldValue && percentChange.newValue ? calculatePercentChange().props.children[0] + calculatePercentChange().props.children[1] : "";
    else if (activeTab === "addSubtract") text = calculateAddSubtract();
    else if (activeTab === "reverse") text = calculateReverse();

    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const resetAll = () => {
    setPercentOf({ percent: "", number: "" });
    setIsWhatPercent({ part: "", whole: "" });
    setPercentChange({ oldValue: "", newValue: "" });
    setAddSubtractPercent({ value: "", percent: "", operation: "add" });
    setReversePercent({ finalValue: "", percentChange: "" });
    setCopied(false);
  };

  const tabs = [
    { id: "percentOf", label: "X% of Y" },
    { id: "isWhatPercent", label: "X is what % of Y" },
    { id: "percentChange", label: "% Change" },
    { id: "addSubtract", label: "+/- %" },
    { id: "reverse", label: "Reverse %" }
  ];

  return (
    <>
      <Helmet>
        <title>Percentage Calculator Online – Real-time result</title>
        <meta
          name="description"
          content="Calculate any percentage instantly: X% of Y, what % one number is of another, % change, add/subtract %, reverse percentage. Real-time results, copy with one click. Free, no signup, built in Karachi."
        />
        <meta
          name="keywords"
          content="percentage calculator online, percent of number, percentage increase decrease, reverse percentage calculator, add subtract percent, free percentage tool 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/percentage-calculator" />

        <meta property="og:title" content="Percentage Calculator – Free Online Tool 2026" />
        <meta property="og:description" content="Instant percentage calculations: increase, decrease, reverse & more – real-time results." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Percentage Calculator – All Types" />
        <meta name="twitter:description" content="Calculate %, % change, reverse % instantly – copy results easily." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Percentage Calculator",
            url: "https://generatorpromptai.com/tools/percentage-calculator",
            description: "Free online tool for all percentage calculations – real-time results, multiple types.",
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
            Percentage Calculator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Calculate %, increase, decrease, reverse & more • Real-time results
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 border-b pb-4 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 rounded-lg font-medium transition whitespace-nowrap ${activeTab === tab.id
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Calculator Content */}
              <div className="space-y-8">
                {activeTab === "percentOf" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
                      <input
                        type="number"
                        value={percentOf.percent}
                        onChange={(e) => setPercentOf({ ...percentOf, percent: e.target.value })}
                        placeholder="e.g. 20"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Of Number</label>
                      <input
                        type="number"
                        value={percentOf.number}
                        onChange={(e) => setPercentOf({ ...percentOf, number: e.target.value })}
                        placeholder="e.g. 500"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2 text-center">
                      <div className="text-4xl font-bold text-sky-600 mt-6">
                        {calculatePercentOf()}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Result</p>
                    </div>
                  </div>
                )}

                {activeTab === "isWhatPercent" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Part Number</label>
                      <input
                        type="number"
                        value={isWhatPercent.part}
                        onChange={(e) => setIsWhatPercent({ ...isWhatPercent, part: e.target.value })}
                        placeholder="e.g. 75"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Whole Number</label>
                      <input
                        type="number"
                        value={isWhatPercent.whole}
                        onChange={(e) => setIsWhatPercent({ ...isWhatPercent, whole: e.target.value })}
                        placeholder="e.g. 300"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2 text-center">
                      <div className="text-4xl font-bold text-sky-600 mt-6">
                        {calculateIsWhatPercent()}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Result</p>
                    </div>
                  </div>
                )}

                {activeTab === "percentChange" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Old/Original Value</label>
                      <input
                        type="number"
                        value={percentChange.oldValue}
                        onChange={(e) => setPercentChange({ ...percentChange, oldValue: e.target.value })}
                        placeholder="e.g. 200"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Value</label>
                      <input
                        type="number"
                        value={percentChange.newValue}
                        onChange={(e) => setPercentChange({ ...percentChange, newValue: e.target.value })}
                        placeholder="e.g. 250"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2 text-center">
                      <div className="text-4xl font-bold mt-6">
                        {calculatePercentChange()}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Percentage Change</p>
                    </div>
                  </div>
                )}

                {activeTab === "addSubtract" && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original Value</label>
                      <input
                        type="number"
                        value={addSubtractPercent.value}
                        onChange={(e) => setAddSubtractPercent({ ...addSubtractPercent, value: e.target.value })}
                        placeholder="e.g. 1000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
                      <input
                        type="number"
                        value={addSubtractPercent.percent}
                        onChange={(e) => setAddSubtractPercent({ ...addSubtractPercent, percent: e.target.value })}
                        placeholder="e.g. 15"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                      <select
                        value={addSubtractPercent.operation}
                        onChange={(e) => setAddSubtractPercent({ ...addSubtractPercent, operation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="add">Add (+%)</option>
                        <option value="subtract">Subtract (-%)</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 text-center">
                      <div className="text-4xl font-bold text-sky-600 mt-6">
                        {calculateAddSubtract()}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Result</p>
                    </div>
                  </div>
                )}

                {activeTab === "reverse" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Final Value (after % change)</label>
                      <input
                        type="number"
                        value={reversePercent.finalValue}
                        onChange={(e) => setReversePercent({ ...reversePercent, finalValue: e.target.value })}
                        placeholder="e.g. 120"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">% Change Applied</label>
                      <input
                        type="number"
                        value={reversePercent.percentChange}
                        onChange={(e) => setReversePercent({ ...reversePercent, percentChange: e.target.value })}
                        placeholder="e.g. 20"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2 text-center">
                      <div className="text-4xl font-bold text-sky-600 mt-6">
                        {calculateReverse()}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Original Value</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Global Actions */}
              <div className="flex justify-center gap-6 mt-12">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium disabled:opacity-50"
                  disabled={!["percentOf", "isWhatPercent", "percentChange", "addSubtract", "reverse"].some(tab => {
                    if (tab === "percentOf") return calculatePercentOf() !== "—";
                    if (tab === "isWhatPercent") return calculateIsWhatPercent() !== "—";
                    if (tab === "percentChange") return percentChange.oldValue && percentChange.newValue;
                    if (tab === "addSubtract") return calculateAddSubtract() !== "—";
                    if (tab === "reverse") return calculateReverse() !== "—";
                    return false;
                  })}
                >
                  <Copy size={18} />
                  {copied ? "Copied Result!" : "Copy Result"}
                </button>

                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
                >
                  <RefreshCw size={18} />
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Online Percentage Calculator – All Types of calculation
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                You can instantly find X% of Y, what percentage one number is of another, the percentage increase or decrease, the percentage change, or the percentage change back. You can see the results in real time as you type. Great for students, business owners, shoppers, accountants, teachers, and anyone else who needs to quickly do percentage math for taxes, discounts, profit margins, statistics, or everyday use.              </p>
              <p>
                Made in Karachi, no sign-up, no ads, and 100% private and browser-based. The interface is clean, and there are tabbed calculators and an instant copy feature. Quick, correct, and totally free.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Percentage Calculator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Click one of the tabs above to choose the type of percentage calculation (e.g., X% of Y, % Change, Reverse %).</li>
                <li>Enter the required numbers in the input fields — results update automatically as you type.</li>
                <li>See the large colored result instantly below the inputs.</li>
                <li>Click <strong>Copy Result</strong> to copy the calculated value to your clipboard.</li>
                <li>Use <strong>Reset All</strong> to clear all fields and start fresh.</li>
                <li>Tip: Switch tabs without losing previous inputs — great for comparing different percentage scenarios quickly.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Math & Calculator Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/random-number-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Random Number Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate random numbers, ranges, dice rolls.
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

export default PercentageCalculator;