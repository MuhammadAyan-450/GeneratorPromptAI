// pages/PercentageCalculator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Percent, CheckCircle } from "lucide-react";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "percentOf",      label: "X% of Y",          icon: "%" },
  { id: "isWhat",         label: "X is what % of Y",  icon: "?" },
  { id: "change",         label: "% Change",          icon: "↑↓" },
  { id: "addSubtract",    label: "Add / Subtract %",  icon: "+−" },
  { id: "reverse",        label: "Reverse %",         icon: "⟵" },
  { id: "discount",       label: "Discount",          icon: "🏷" },
  { id: "tax",            label: "Tax / VAT",         icon: "📋" },
];

// ─── Round to avoid floating-point artifacts ──────────────────────────────────
const r = (n, decimals = 2) => {
  if (!isFinite(n)) return null;
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

const fmt = (n) => {
  if (n === null || n === undefined) return "—";
  return Number.isInteger(n) ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

// ─── Component ────────────────────────────────────────────────────────────────
const PercentageCalculator = () => {
  const [activeTab, setActiveTab] = useState("percentOf");
  const [history,   setHistory]   = useState([]);
  const [copied,    setCopied]    = useState(false);
  const [toast,     setToast]     = useState("");

  // Per-tab state
  const [po,  setPo]  = useState({ pct: "", num: "" });
  const [iw,  setIw]  = useState({ part: "", whole: "" });
  const [pc,  setPc]  = useState({ old: "", nw: "" });
  const [as_,  setAs]  = useState({ val: "", pct: "", op: "add" });
  const [rv,  setRv]  = useState({ final: "", pct: "" });
  const [dc,  setDc]  = useState({ price: "", pct: "" });
  const [tx,  setTx]  = useState({ price: "", pct: "" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  // ── Calculators ─────────────────────────────────────────────────────────────
  const calc = {
    percentOf: () => {
      const p = parseFloat(po.pct), n = parseFloat(po.num);
      if (isNaN(p) || isNaN(n)) return null;
      return r(p / 100 * n);
    },
    isWhat: () => {
      const part = parseFloat(iw.part), whole = parseFloat(iw.whole);
      if (isNaN(part) || isNaN(whole) || whole === 0) return null;
      return r((part / whole) * 100);
    },
    change: () => {
      const o = parseFloat(pc.old), n = parseFloat(pc.nw);
      if (isNaN(o) || isNaN(n) || o === 0) return null;
      return r(((n - o) / Math.abs(o)) * 100);
    },
    addSubtract: () => {
      const v = parseFloat(as_.val), p = parseFloat(as_.pct);
      if (isNaN(v) || isNaN(p)) return null;
      return as_.op === "add" ? r(v * (1 + p / 100)) : r(v * (1 - p / 100));
    },
    reverse: () => {
      const f = parseFloat(rv.final), p = parseFloat(rv.pct);
      if (isNaN(f) || isNaN(p)) return null;
      return r(f / (1 + p / 100));
    },
    discount: () => {
      const price = parseFloat(dc.price), pct = parseFloat(dc.pct);
      if (isNaN(price) || isNaN(pct)) return null;
      const saved = r(price * pct / 100);
      const final = r(price - saved);
      return { saved, final };
    },
    tax: () => {
      const price = parseFloat(tx.price), pct = parseFloat(tx.pct);
      if (isNaN(price) || isNaN(pct)) return null;
      const taxAmt = r(price * pct / 100);
      const total  = r(price + taxAmt);
      return { taxAmt, total };
    },
  };

  // ── Result + equation strings ────────────────────────────────────────────────
  const getResult = () => {
    switch (activeTab) {
      case "percentOf":   return { value: calc.percentOf(),   eq: `${po.pct}% of ${po.num} = ${fmt(calc.percentOf())}`,       unit: ""   };
      case "isWhat":      return { value: calc.isWhat(),      eq: `${iw.part} is ${fmt(calc.isWhat())}% of ${iw.whole}`,      unit: "%"  };
      case "change": {
        const v = calc.change();
        return { value: v, eq: `From ${pc.old} to ${pc.nw} = ${v !== null ? (v >= 0 ? "+" : "") + fmt(v) + "%" : "—"}`, unit: "%", signed: true };
      }
      case "addSubtract": return { value: calc.addSubtract(), eq: `${as_.val} ${as_.op === "add" ? "+" : "−"} ${as_.pct}% = ${fmt(calc.addSubtract())}`, unit: "" };
      case "reverse":     return { value: calc.reverse(),     eq: `Original of ${rv.final} after ${rv.pct}% change = ${fmt(calc.reverse())}`, unit: "" };
      case "discount": {
        const d = calc.discount();
        return { value: d, eq: d ? `${dc.price} − ${dc.pct}% = ${fmt(d.final)} (saved ${fmt(d.saved)})` : null, unit: "", multi: true };
      }
      case "tax": {
        const t = calc.tax();
        return { value: t, eq: t ? `${tx.price} + ${tx.pct}% tax = ${fmt(t.total)} (tax: ${fmt(t.taxAmt)})` : null, unit: "", multi: true };
      }
      default: return { value: null, eq: null };
    }
  };

  const { value, eq, unit, signed, multi } = getResult();
  const hasResult = value !== null && value !== undefined;

  const resultStr = () => {
    if (!hasResult) return null;
    if (multi) {
      if (activeTab === "discount") return `Sale price: ${fmt(value.final)} (saved ${fmt(value.saved)})`;
      if (activeTab === "tax")      return `Total: ${fmt(value.total)} (tax: ${fmt(value.taxAmt)})`;
    }
    return `${signed && value >= 0 ? "+" : ""}${fmt(value)}${unit}`;
  };

  const copyResult = () => {
    const str = resultStr();
    if (!str) return;
    navigator.clipboard.writeText(str);
    setCopied(true); showToast("Result copied!");
    setTimeout(() => setCopied(false), 2000);
    if (eq) addHistory(eq);
  };

  const addHistory = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 6));
  };

  const resetAll = () => {
    setPo({ pct: "", num: "" }); setIw({ part: "", whole: "" });
    setPc({ old: "", nw: "" }); setAs({ val: "", pct: "", op: "add" });
    setRv({ final: "", pct: "" }); setDc({ price: "", pct: "" });
    setTx({ price: "", pct: "" }); setCopied(false);
  };

  const FORMULAS = {
    percentOf:   "Result = (Percentage ÷ 100) × Number",
    isWhat:      "Result = (Part ÷ Whole) × 100",
    change:      "Change % = ((New − Old) ÷ |Old|) × 100",
    addSubtract: "Add: Result = Value × (1 + % ÷ 100)   |   Subtract: Result = Value × (1 − % ÷ 100)",
    reverse:     "Original = Final Value ÷ (1 + % ÷ 100)",
    discount:    "Sale Price = Price − (Price × Discount% ÷ 100)",
    tax:         "Total = Price + (Price × Tax% ÷ 100)",
  };

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Percentage Calculator",
    url: "https://www.generatorpromptai.com/tools/percentage-calculator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free online percentage calculator. Calculate X% of Y, percentage change, reverse percentage, discount, tax/VAT and more. Real-time results.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate what percentage one number is of another?",
        acceptedAnswer: { "@type": "Answer", text: "Divide the part by the whole and multiply by 100. For example, 75 is what percent of 300? Answer: (75 ÷ 300) × 100 = 25%. Use the 'X is what % of Y' tab." },
      },
      {
        "@type": "Question",
        name: "How do I calculate percentage increase or decrease?",
        acceptedAnswer: { "@type": "Answer", text: "Subtract the old value from the new value, divide by the old value, and multiply by 100. Formula: ((New − Old) ÷ Old) × 100. Use the '% Change' tab." },
      },
      {
        "@type": "Question",
        name: "How do I calculate a discount?",
        acceptedAnswer: { "@type": "Answer", text: "Multiply the original price by the discount percentage divided by 100 to get the discount amount, then subtract from the original price. Use the 'Discount' tab for instant results." },
      },
      {
        "@type": "Question",
        name: "What is reverse percentage?",
        acceptedAnswer: { "@type": "Answer", text: "Reverse percentage finds the original value before a percentage change was applied. Formula: Original = Final ÷ (1 + Percentage ÷ 100). For example, if a price is 120 after a 20% increase, the original was 100." },
      },
      {
        "@type": "Question",
        name: "How do I add VAT or tax to a price?",
        acceptedAnswer: { "@type": "Answer", text: "Multiply the price by the tax rate divided by 100, then add to the original price. Formula: Total = Price × (1 + Tax% ÷ 100). Use the 'Tax / VAT' tab for instant calculation." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Percentage Calculator - Free Online % Calculator | Discount, Tax, % Change</title>
        <meta
          name="description"
          content="Free online percentage calculator — calculate X% of Y, percentage change, reverse percentage, discount, tax/VAT and more. Real-time results, copy with one click. No sign-up needed."
        />
        <meta
          name="keywords"
          content="percentage calculator, percent calculator online, percentage change calculator, discount calculator, tax calculator, reverse percentage, what percent of, free percentage tool 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/percentage-calculator" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Percentage Calculator - Free Online | Discount, Tax, % Change" />
        <meta property="og:description" content="Calculate any percentage instantly. X% of Y, % change, discount, tax/VAT, reverse percentage. Real-time results." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/percentage-calculator" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-percentage-calculator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Percentage Calculator - All Types Online" />
        <meta name="twitter:description" content="Calculate percentages instantly. Discount, tax, % change, reverse % and more. Free online tool." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-percentage-calculator.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Percent className="text-sky-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Percentage Calculator</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Calculate any percentage instantly. Discount, tax, % change, reverse % and more. Real-time results.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8 mb-6">

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-sky-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Formula hint */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-2.5 mb-6 text-xs text-sky-700 font-mono">
              📐 {FORMULAS[activeTab]}
            </div>

            {/* ── Tab content ──────────────────────────────────────────── */}

            {activeTab === "percentOf" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Percentage (%)</label>
                  <input type="number" value={po.pct} onChange={(e) => setPo({ ...po, pct: e.target.value })} placeholder="e.g. 20" className={inputCls} /></div>
                <div><label className={labelCls}>Of Number</label>
                  <input type="number" value={po.num} onChange={(e) => setPo({ ...po, num: e.target.value })} placeholder="e.g. 500" className={inputCls} /></div>
              </div>
            )}

            {activeTab === "isWhat" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Part (X)</label>
                  <input type="number" value={iw.part} onChange={(e) => setIw({ ...iw, part: e.target.value })} placeholder="e.g. 75" className={inputCls} /></div>
                <div><label className={labelCls}>Whole (Y)</label>
                  <input type="number" value={iw.whole} onChange={(e) => setIw({ ...iw, whole: e.target.value })} placeholder="e.g. 300" className={inputCls} /></div>
              </div>
            )}

            {activeTab === "change" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Original / Old Value</label>
                  <input type="number" value={pc.old} onChange={(e) => setPc({ ...pc, old: e.target.value })} placeholder="e.g. 200" className={inputCls} /></div>
                <div><label className={labelCls}>New Value</label>
                  <input type="number" value={pc.nw} onChange={(e) => setPc({ ...pc, nw: e.target.value })} placeholder="e.g. 250" className={inputCls} /></div>
              </div>
            )}

            {activeTab === "addSubtract" && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={labelCls}>Original Value</label>
                  <input type="number" value={as_.val} onChange={(e) => setAs({ ...as_, val: e.target.value })} placeholder="e.g. 1000" className={inputCls} /></div>
                <div><label className={labelCls}>Percentage (%)</label>
                  <input type="number" value={as_.pct} onChange={(e) => setAs({ ...as_, pct: e.target.value })} placeholder="e.g. 15" className={inputCls} /></div>
                <div><label className={labelCls}>Operation</label>
                  <select value={as_.op} onChange={(e) => setAs({ ...as_, op: e.target.value })} className={inputCls}>
                    <option value="add">Add (+%)</option>
                    <option value="subtract">Subtract (−%)</option>
                  </select></div>
              </div>
            )}

            {activeTab === "reverse" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Final Value (after % change)</label>
                  <input type="number" value={rv.final} onChange={(e) => setRv({ ...rv, final: e.target.value })} placeholder="e.g. 120" className={inputCls} /></div>
                <div><label className={labelCls}>% Change Applied</label>
                  <input type="number" value={rv.pct} onChange={(e) => setRv({ ...rv, pct: e.target.value })} placeholder="e.g. 20" className={inputCls} /></div>
              </div>
            )}

            {activeTab === "discount" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Original Price</label>
                  <input type="number" value={dc.price} onChange={(e) => setDc({ ...dc, price: e.target.value })} placeholder="e.g. 2500" className={inputCls} /></div>
                <div><label className={labelCls}>Discount (%)</label>
                  <input type="number" value={dc.pct} onChange={(e) => setDc({ ...dc, pct: e.target.value })} placeholder="e.g. 30" className={inputCls} /></div>
              </div>
            )}

            {activeTab === "tax" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Price (before tax)</label>
                  <input type="number" value={tx.price} onChange={(e) => setTx({ ...tx, price: e.target.value })} placeholder="e.g. 5000" className={inputCls} /></div>
                <div><label className={labelCls}>Tax / VAT Rate (%)</label>
                  <input type="number" value={tx.pct} onChange={(e) => setTx({ ...tx, pct: e.target.value })} placeholder="e.g. 17" className={inputCls} /></div>
              </div>
            )}

            {/* ── Result display ────────────────────────────────────────── */}
            <div className={`mt-6 rounded-2xl p-6 text-center transition-all ${hasResult ? "bg-sky-50 border border-sky-100" : "bg-gray-50 border border-gray-100"}`}>
              {hasResult ? (
                <>
                  {/* Multi-value result (discount/tax) */}
                  {multi && activeTab === "discount" && value && (
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div><p className="text-xs text-gray-400 mb-1">Sale Price</p>
                        <p className="text-3xl font-bold text-sky-600">{fmt(value.final)}</p></div>
                      <div><p className="text-xs text-gray-400 mb-1">You Save</p>
                        <p className="text-3xl font-bold text-green-600">{fmt(value.saved)}</p></div>
                    </div>
                  )}
                  {multi && activeTab === "tax" && value && (
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div><p className="text-xs text-gray-400 mb-1">Tax Amount</p>
                        <p className="text-3xl font-bold text-orange-500">{fmt(value.taxAmt)}</p></div>
                      <div><p className="text-xs text-gray-400 mb-1">Total (incl. tax)</p>
                        <p className="text-3xl font-bold text-sky-600">{fmt(value.total)}</p></div>
                    </div>
                  )}
                  {/* Single result */}
                  {!multi && (
                    <p className={`text-5xl font-bold mb-2 ${
                      activeTab === "change" && value < 0 ? "text-red-500" :
                      activeTab === "change" && value >= 0 ? "text-green-600" : "text-sky-600"
                    }`}>
                      {signed && value >= 0 ? "+" : ""}{fmt(value)}{unit}
                    </p>
                  )}
                  {/* Equation */}
                  {eq && <p className="text-xs text-gray-400 font-mono mt-2">{eq}</p>}
                </>
              ) : (
                <p className="text-gray-300 text-lg">Enter values above to see the result</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={copyResult}
                disabled={!hasResult}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl text-sm font-medium transition-colors"
              >
                {copied ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy Result"}
              </button>
              <button
                onClick={resetAll}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
              >
                <RefreshCw size={15} /> Reset All
              </button>
            </div>
          </div>

          {/* Calculation History */}
          {history.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Recent Calculations</p>
              <div className="space-y-1.5">
                {history.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2">
                    <span className="text-sm font-mono text-gray-600 truncate">{entry}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(entry); showToast("Copied!"); }}
                      className="ml-3 text-gray-400 hover:text-sky-600 flex-shrink-0"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Percentage Calculator — All Types
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our percentage calculator covers 7 types of percentage calculations with real-time results as you type. No clicking a calculate button — just enter your numbers and the answer appears instantly.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What each calculator does</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li><strong>X% of Y</strong> — Find what X percent of a number is. E.g., 20% of 500 = 100</li>
              <li><strong>X is what % of Y</strong> — Find what percentage one number is of another. E.g., 75 is 25% of 300</li>
              <li><strong>% Change</strong> — Calculate increase or decrease between two values</li>
              <li><strong>Add / Subtract %</strong> — Add or remove a percentage from a value</li>
              <li><strong>Reverse %</strong> — Find the original value before a percentage was applied</li>
              <li><strong>Discount</strong> — Calculate sale price and amount saved from a discount</li>
              <li><strong>Tax / VAT</strong> — Add GST, VAT, or sales tax to a price</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How do I calculate what percentage one number is of another?", a: "Divide the part by the whole and multiply by 100. For example: 75 is what % of 300? Answer: (75 ÷ 300) × 100 = 25%. Use the 'X is what % of Y' tab." },
                { q: "How do I calculate percentage increase?", a: "Subtract the old value from the new value, divide by the old value, and multiply by 100. Formula: ((New − Old) ÷ Old) × 100. Use the '% Change' tab." },
                { q: "How do I calculate a discount?", a: "Sale Price = Original Price − (Original Price × Discount% ÷ 100). For a 30% discount on Rs. 2500: 2500 − (2500 × 30 ÷ 100) = Rs. 1750. Use the Discount tab." },
                { q: "What is reverse percentage?", a: "Reverse percentage finds the original value before a percentage change. Formula: Original = Final ÷ (1 + % ÷ 100). If price is 120 after 20% increase, original was 100." },
                { q: "How do I add GST or VAT to a price?", a: "Total = Price + (Price × Tax% ÷ 100). For 17% GST on Rs. 5000: 5000 + (5000 × 17 ÷ 100) = Rs. 5850. Use the Tax / VAT tab." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Calculator Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/age-calculator",         title: "Age Calculator",         desc: "Calculate exact age in years, months and days." },
                { to: "/tools/currency-converter",     title: "Currency Converter",     desc: "Convert currencies with live real-time rates." },
                { to: "/tools/random-number-generator",title: "Random Number Generator",desc: "Generate random numbers, ranges and dice rolls." },
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

export default PercentageCalculator;