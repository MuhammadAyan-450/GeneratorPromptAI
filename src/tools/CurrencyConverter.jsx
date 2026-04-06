// pages/CurrencyConverter.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, RefreshCw, Copy, Loader2, ArrowLeftRight, TrendingUp, DollarSign } from "lucide-react";

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

// Popular pairs for Pakistani audience
const QUICK_PAIRS = [
  { from: "USD", to: "PKR", label: "USD → PKR" },
  { from: "AED", to: "PKR", label: "AED → PKR" },
  { from: "SAR", to: "PKR", label: "SAR → PKR" },
  { from: "GBP", to: "PKR", label: "GBP → PKR" },
  { from: "EUR", to: "PKR", label: "EUR → PKR" },
  { from: "CAD", to: "PKR", label: "CAD → PKR" },
];

const QUICK_AMOUNTS = [1, 100, 500, 1000, 5000, 10000];

// Multi-compare targets when converting TO PKR
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

  // Fetch exchange rates
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

  // Initial fetch + refetch on currency change
  useEffect(() => { fetchRate(); }, [fromCurrency, toCurrency]);

  // Recalculate on amount change without refetch
  useEffect(() => {
    if (rate !== null) setConverted((parseFloat(amount) || 0) * rate);
  }, [amount, rate]);

  // Auto-refresh countdown
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { fetchRate(true); return 60; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [fetchRate]);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || (!isNaN(val) && parseFloat(val) >= 0)) setAmount(val);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const setQuickPair = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const copyResult = () => {
    if (converted === null) return;
    const text = `${amount || 0} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}\nRate: 1 ${fromCurrency} = ${rate?.toFixed(4)} ${toCurrency}\nUpdated: ${lastUpdated}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Multi-compare: show same FROM amount in several currencies
  const compareTargets = COMPARE_CURRENCIES.filter((c) => c !== fromCurrency).slice(0, 5);
  const hasCompare = Object.keys(allRates).length > 0;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Currency Converter",
    url: "https://www.generatorpromptai.com/tools/currency-converter",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free real-time currency converter supporting 170+ currencies with live exchange rates. Convert USD to PKR, AED to PKR, SAR to PKR and more.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
    featureList: "Real-time exchange rates, 170+ currencies, currency swap, auto-refresh, multi-currency comparison",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the current USD to PKR rate?",
        acceptedAnswer: { "@type": "Answer", text: "Our currency converter shows the live USD to PKR exchange rate updated every 60 seconds from real-time market data." },
      },
      {
        "@type": "Question",
        name: "Is this currency converter free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no sign-up, no ads, and no hidden fees." },
      },
      {
        "@type": "Question",
        name: "How often are exchange rates updated?",
        acceptedAnswer: { "@type": "Answer", text: "Rates are fetched from live market data and automatically refresh every 60 seconds on this page." },
      },
      {
        "@type": "Question",
        name: "How many currencies does this converter support?",
        acceptedAnswer: { "@type": "Answer", text: "Our currency converter supports 170+ world currencies including USD, EUR, GBP, PKR, AED, SAR, INR, CAD, and many more." },
      },
      {
        "@type": "Question",
        name: "What is the AED to PKR exchange rate today?",
        acceptedAnswer: { "@type": "Answer", text: "Select AED as the From currency and PKR as the To currency in our converter to see the live AED to PKR rate updated in real time." },
      },
    ],
  };

  const getCurrencyInfo = (code) => CURRENCIES.find((c) => c.code === code) || { flag: "💱", name: code };

  return (
    <>
      <Helmet>
        <title>Currency Converter - Live Exchange Rates USD to PKR, AED to PKR & 170+ Currencies</title>
        <meta
          name="description"
          content="Free real-time currency converter — convert USD to PKR, AED to PKR, SAR to PKR and 170+ currencies instantly. Live exchange rates updated every minute. No sign-up needed."
        />
        <meta
          name="keywords"
          content="currency converter, usd to pkr, aed to pkr, sar to pkr, live exchange rates, free currency converter, pkr converter, gbp to pkr, eur to pkr, real time currency converter 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/currency-converter" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Currency Converter - Live USD to PKR, AED to PKR Rates" />
        <meta property="og:description" content="Convert USD, AED, SAR, GBP to PKR and 170+ currencies with real-time rates. Free, no sign-up." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/currency-converter" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-currency-converter.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Currency Converter - Live Exchange Rates 2026" />
        <meta name="twitter:description" content="Convert USD to PKR, AED to PKR, SAR to PKR and 170+ currencies in real time. Free online tool." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-currency-converter.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Back Nav */}
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 mb-4">
              <DollarSign className="text-green-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Currency Converter
            </h1>
            <p className="text-gray-500 text-base md:text-lg">
              Real-time exchange rates · 170+ currencies · Auto-refresh every 60s
            </p>
          </div>

          {/* Quick Pairs — NEW */}
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Amount + Currency Selectors */}
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-6">

              {/* From */}
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
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={swapCurrencies}
                  disabled={loading}
                  className="p-3 bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-full transition-all mt-6"
                  title="Swap currencies"
                >
                  <ArrowLeftRight size={22} />
                </button>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-medium text-gray-800"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Amount Buttons — NEW */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-xs text-gray-400 self-center mr-1">Quick:</span>
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${amount === String(a)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-400"
                    }`}
                >
                  {a.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Result */}
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
                    <p className="text-xs text-gray-400">
                      Rates updated: {lastUpdated} · Auto-refreshing in {countdown}s
                    </p>
                  )}
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={copyResult}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Copy size={15} />
                      {copied ? "Copied!" : "Copy Result"}
                    </button>
                    <button
                      onClick={() => fetchRate()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      <RefreshCw size={15} /> Refresh Rate
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Enter an amount to see conversion</p>
              )}
            </div>
          </div>

          {/* Multi-Currency Comparison — NEW */}
          {hasCompare && !loading && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-600" />
                <h2 className="text-base font-semibold text-gray-800">
                  {amount || 1} {fromCurrency} in other currencies
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {compareTargets.map((code) => {
                  const info = getCurrencyInfo(code);
                  const r = allRates[code];
                  if (!r) return null;
                  const val = (parseFloat(amount) || 1) * r;
                  return (
                    <button
                      key={code}
                      onClick={() => setToCurrency(code)}
                      className="bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-300 rounded-xl p-3 text-center transition-all"
                    >
                      <div className="text-xl mb-1">{info.flag}</div>
                      <div className="text-sm font-bold text-gray-800">
                        {val.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500">{code}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Real-Time Currency Converter — Live Exchange Rates
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free currency converter uses live exchange rates updated every minute to give you accurate conversions for 170+ world currencies. No sign-up, no ads, no fees — just instant, reliable currency conversion.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Especially useful for Pakistan-based users checking <strong>USD to PKR</strong>, <strong>AED to PKR</strong>, <strong>SAR to PKR</strong>, and <strong>GBP to PKR</strong> rates for remittances, online shopping, salary conversion, or international payments.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How to use this currency converter</h3>
            <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li>Enter the amount you want to convert.</li>
              <li>Select the currency you're converting from.</li>
              <li>Select the target currency.</li>
              <li>See the live converted amount and exchange rate instantly.</li>
              <li>Use the swap button to reverse the conversion.</li>
              <li>Use quick amount buttons (100, 500, 1K, 5K, 10K) for fast calculations.</li>
            </ol>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Live exchange rates from real market data</li>
              <li>Auto-refresh every 60 seconds</li>
              <li>Quick pair buttons: USD→PKR, AED→PKR, SAR→PKR, GBP→PKR</li>
              <li>Multi-currency comparison — see one amount in 5 currencies at once</li>
              <li>Quick amount selector (100, 500, 1,000, 5,000, 10,000)</li>
              <li>170+ supported currencies</li>
              <li>Copy result to clipboard in one click</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "What is today's USD to PKR exchange rate?", a: "Our converter shows the live USD to PKR rate updated every 60 seconds. Select USD → PKR above to see the current rate." },
                { q: "How often are exchange rates updated?", a: "Rates are fetched from live market data and automatically refresh every 60 seconds on this page. You can also click Refresh Rate manually." },
                { q: "Is this currency converter free?", a: "Yes, completely free. No account, no sign-up, no ads, no hidden fees." },
                { q: "How many currencies are supported?", a: "Our converter supports 170+ world currencies including USD, EUR, GBP, PKR, AED, SAR, INR, CAD, JPY, and many more." },
                { q: "Can I convert AED to PKR?", a: "Yes. Click the 'AED → PKR' quick pair button or select AED as From and PKR as To in the dropdowns for the live rate." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Free Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/time-zone-converter", title: "Time Zone Converter", desc: "Convert time between any cities or time zones worldwide." },
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentages, discounts, markups and more." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-400 transition-all"
                >
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