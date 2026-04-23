import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { RefreshCw, Copy, Loader2, ArrowLeftRight, TrendingUp, DollarSign, Home, ChevronDown } from "lucide-react";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
  { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦" },
  { code: "OMR", name: "Omani Rial", flag: "🇴🇲" },
  { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
];

const QUICK_PAIRS = [
  { from: "USD", to: "PKR", label: "USD → PKR" },
  { from: "AED", to: "PKR", label: "AED → PKR" },
  { from: "SAR", to: "PKR", label: "SAR → PKR" },
  { from: "GBP", to: "PKR", label: "GBP → PKR" },
  { from: "EUR", to: "PKR", label: "EUR → PKR" },
  { from: "CAD", to: "PKR", label: "CAD → PKR" },
];

const QUICK_AMOUNTS = [1, 100, 500, 1000, 5000, 10000];
const COMPARE_CURRENCIES = ["USD", "EUR", "GBP", "AED", "SAR", "CAD"];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [rate, setRate] = useState(null);
  const [allRates, setAllRates] = useState({});
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const countdownRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const fetchRate = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await res.json();
      if (data.result !== "success") throw new Error("API error");

      setAllRates(data.rates);
      const currentRate = fromCurrency === toCurrency ? 1 : data.rates[toCurrency];
      if (!currentRate) throw new Error("Currency not available");

      setRate(currentRate);
      setConverted((parseFloat(amount) || 0) * currentRate);
      setLastUpdated(
        new Date(data.time_last_update_utc).toLocaleString("en-US", {
          dateStyle: "medium", timeStyle: "short",
        })
      );
      setCountdown(60);
    } catch (err) {
      setError("Unable to fetch latest rates. Please try again.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount]);

  useEffect(() => { fetchRate(); }, [fromCurrency, toCurrency]);
  useEffect(() => { if (rate !== null) setConverted((parseFloat(amount) || 0) * rate); }, [amount, rate]);

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { fetchRate(true); return 60; } return c - 1; });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [fetchRate]);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || (!isNaN(val) && parseFloat(val) >= 0)) setAmount(val);
  };

  const swapCurrencies = () => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); };
  const setQuickPair = (from, to) => { setFromCurrency(from); setToCurrency(to); };

  const copyResult = () => {
    if (converted === null) return;
    const text = `${amount || 0} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}\nRate: 1 ${fromCurrency} = ${rate?.toFixed(4)} ${toCurrency}\nUpdated: ${lastUpdated}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const compareTargets = COMPARE_CURRENCIES.filter((c) => c !== fromCurrency).slice(0, 5);
  const hasCompare = Object.keys(allRates).length > 0;
  const getCurrencyInfo = (code) => CURRENCIES.find((c) => c.code === code) || { flag: "💱", name: code };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert USD to PKR Online with Live Exchange Rate",
    "url": "https://www.generatorpromptai.com/tools/currency-converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "description": "Free live currency converter to calculate USD to PKR, AED to PKR, SAR to PKR rates. Auto-refreshes every 60 seconds.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Currency Converter", "item": "https://www.generatorpromptai.com/tools/currency-converter" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name:": "What is 1 dollar to PKR today live rate?",
        "acceptedAnswer": { "@type": "Answer", "text": "The live 1 USD to PKR rate is shown at the top of this page. It automatically refreshes every 60 seconds to ensure you are seeing the most accurate, real-time market exchange rate." }
      },
      {
        "@type": "Question",
        "name": "How much is 1000 AED in PKR today?",
        "acceptedAnswer": { "@type": "Answer", "text": "To find out how much 1000 AED is in PKR today, click the 'AED → PKR' quick pair button and type 1000 in the amount box. The exact live conversion will be displayed instantly." }
      },
      {
        "@type": "Question",
        "name": "How to convert USD to PKR online with live exchange rate?",
        "acceptedAnswer": { "@type": "Answer", "text": "Simply enter the USD amount in our converter, make sure 'From' is set to USD and 'To' is set to PKR. The tool automatically calculates the live conversion using real-time market rates." }
      },
      {
        "@type": "Question",
        "name": "Is this AED to PKR conversion calculator free?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, 100% free. There are no hidden fees, no sign-ups, and no limits. You can convert AED to PKR, SAR to PKR, or any other currency as many times as you want." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Title targeting exact long-tails */}
        <title>Convert USD to PKR Online – Live Dollar to PKR Rate Calculator</title>
        
        <meta
          name="description"
          content="Convert USD to PKR, AED to PKR, SAR to PKR online with live exchange rates. Calculate 1 dollar to PKR today, 1000 AED to PKR instantly. Auto-refresh every 60s – free online currency converter."
        />
        
        {/* Low comp long-tail keywords */}
        <meta
          name="keywords"
          content="convert usd to pkr online with live exchange rate, 1 dollar to pkr today live rate calculator, aed to pkr conversion calculator live, how much is 1000 aed in pkr today, sar to pkr live rate converter, gbp to pkr exchange rate today calculator, live currency exchange rate calculator for pkr"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/currency-converter" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (No emojis) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Convert USD to PKR Online – Live Dollar to PKR Rate Calculator" />
        <meta property="og:description" content="Get live USD to PKR, AED to PKR, SAR to PKR exchange rates instantly. Auto-refresh every 60 seconds. Free online currency converter." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/currency-converter" />

        {/* Twitter Card (No emojis) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Live USD to PKR Rate Calculator – Convert Currency Free" />
        <meta name="twitter:description" content="Convert USD to PKR, AED to PKR & 170+ currencies with live rates. Auto-refresh every minute." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb Only ── */}
        <div className="max-w-5xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-green-600 transition-colors">
                  <Home size={14} /> Home
                </Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li>
                <Link to="/pages/all-tools" className="hover:text-green-600 transition-colors">All Tools</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">Currency Converter</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 mb-4">
              <DollarSign className="text-green-600" size={28} />
            </div>
            {/* H1 targeting exact match long-tails */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Convert USD to PKR Online –{" "}
              <span className="text-green-600">Live Exchange Rate Calculator</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Calculate <strong>1 dollar to PKR today</strong>, convert <strong>1000 AED to PKR</strong>, and check live rates for 170+ currencies. Auto-refreshes every 60 seconds.
            </p>
          </div>

          {/* Quick Pairs */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {QUICK_PAIRS.map((pair) => (
              <button
                key={pair.label}
                onClick={() => setQuickPair(pair.from, pair.to)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${fromCurrency === pair.from && toCurrency === pair.to
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                  }`}
              >
                {pair.label}
              </button>
            ))}
          </div>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-6">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
            )}

            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount & From</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    min="0"
                    step="any"
                    placeholder="0.00"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-medium text-gray-800"
                  >
                    {CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.code}</option>))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button onClick={swapCurrencies} disabled={loading} className="p-3 bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-full transition-all mt-6" title="Swap currencies">
                  <ArrowLeftRight size={22} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-medium text-gray-800"
                >
                  {CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-xs text-gray-400 self-center mr-1">Quick:</span>
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${amount === String(a) ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-400"}`}
                >
                  {a.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="text-center py-8 bg-green-50 rounded-2xl">
              {loading ? (
                <div className="flex items-center justify-center gap-3 text-green-600">
                  <Loader2 size={24} className="animate-spin" />
                  <span className="text-lg">Fetching live rates...</span>
                </div>
              ) : converted !== null ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium uppercase tracking-widest">
                    {getCurrencyInfo(fromCurrency).flag} {amount || 0} {fromCurrency} equals
                  </p>
                  <div className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                    {converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-2xl font-medium text-green-500 ml-2">{toCurrency}</span>
                  </div>
                  <p className="text-gray-500 text-base">
                    1 {fromCurrency} = <strong className="text-gray-700">{rate?.toFixed(4)}</strong> {toCurrency}
                  </p>
                  {lastUpdated && (
                    <p className="text-xs text-gray-400">Rates updated: {lastUpdated} · Auto-refreshing in {countdown}s</p>
                  )}
                  <div className="flex justify-center gap-3 mt-4">
                    <button onClick={copyResult} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                      <Copy size={15} /> {copied ? "Copied!" : "Copy Result"}
                    </button>
                    <button onClick={() => fetchRate()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
                      <RefreshCw size={15} /> Refresh Rate
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Enter an amount to see conversion</p>
              )}
            </div>
          </div>

          {/* Multi-Currency Comparison */}
          {hasCompare && !loading && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-600" />
                <h2 className="text-base font-semibold text-gray-800">{amount || 1} {fromCurrency} in other currencies</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {compareTargets.map((code) => {
                  const info = getCurrencyInfo(code);
                  const r = allRates[code];
                  if (!r) return null;
                  const val = (parseFloat(amount) || 1) * r;
                  return (
                    <button key={code} onClick={() => setToCurrency(code)} className="bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-300 rounded-xl p-3 text-center transition-all">
                      <div className="text-xl mb-1">{info.flag}</div>
                      <div className="text-sm font-bold text-gray-800">{val.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
                      <div className="text-xs text-gray-500">{code}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SEO Content ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "aed to pkr conversion calculator live" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Live AED to PKR Conversion Calculator – USD to PKR & More
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free currency converter pulls <strong>live exchange rates</strong> from real-time market data to give you accurate conversions. Whether you need to <strong>convert USD to PKR online</strong>, check how much 1000 AED is in PKR, or calculate SAR to PKR for remittances, this tool updates automatically every 60 seconds.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Unlike static rate websites, our calculator ensures you are always looking at the current market rate. Use the quick pair buttons for instant USD to PKR, AED to PKR, and SAR to PKR conversions.
            </p>
          </div>

          {/* ── FAQ Section (Accordion) ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Currency Conversion – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "What is 1 dollar to PKR today live rate?",
                  a: "The live 1 USD to PKR rate is shown at the top of this page. It automatically refreshes every 60 seconds to ensure you are seeing the most accurate, real-time market exchange rate."
                },
                {
                  q: "How much is 1000 AED in PKR today?",
                  a: "To find out how much 1000 AED is in PKR today, click the 'AED → PKR' quick pair button and type 1000 in the amount box. The exact live conversion will be displayed instantly."
                },
                {
                  q: "How to convert USD to PKR online with live exchange rate?",
                  a: "Simply enter the USD amount in our converter, make sure 'From' is set to USD and 'To' is set to PKR. The tool automatically calculates the live conversion using real-time market rates without any manual input needed."
                },
                {
                  q: "Is this AED to PKR conversion calculator free?",
                  a: "Yes, 100% free. There are no hidden fees, no sign-ups, and no limits. You can convert AED to PKR, SAR to PKR, or any other currency as many times as you want."
                },
                {
                  q: "How often are exchange rates updated?",
                  a: "Rates are fetched from live market data and automatically refresh every 60 seconds on this page. You can also click 'Refresh Rate' manually if needed."
                }
              ].map((item, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-green-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={22} className={`text-green-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools (Fixed broken link) ── */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Free Calculators</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/time-zone-converter", title: "Time Zone Converter", desc: "Convert time between any cities or global time zones accurately." },
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentage increase, decrease, difference, and ratios." },
                { to: "/tools/age-calculator", title: "Age Calculator", desc: "Calculate exact age in years, months, days, and total days lived." }
              ].map((tool) => (
                <Link key={tool.to} to={tool.to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-400 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-green-600 transition-colors">{tool.title}</h3>
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

export default CurrencyConverter;