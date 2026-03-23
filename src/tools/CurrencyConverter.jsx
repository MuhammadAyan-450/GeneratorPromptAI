// pages/CurrencyConverter.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, RefreshCw, Copy, Loader2 } from "lucide-react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [rate, setRate] = useState(null);
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [copied, setCopied] = useState(false);

  const popularCurrencies = [
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
  ];

  const fetchRate = useCallback(async () => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setRate(1);
      setConverted(parseFloat(amount) || 0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await res.json();

      if (data.result !== "success") {
        throw new Error("API response failed");
      }

      const currentRate = data.rates[toCurrency];
      if (!currentRate) {
        throw new Error("Target currency not available");
      }

      setRate(currentRate);
      setConverted((parseFloat(amount) || 0) * currentRate);
      setLastUpdated(new Date(data.time_last_update_utc).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }));
    } catch (err) {
      setError("Unable to fetch latest rates. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || (!isNaN(val) && val >= 0)) {
      setAmount(val);
      if (rate !== null) {
        setConverted((parseFloat(val) || 0) * rate);
      }
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const copyResult = () => {
    if (converted === null) return;
    const text = `${amount || 0} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}\nRate: 1 ${fromCurrency} = ${rate?.toFixed(4)} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <Helmet>
        <title>Currency Converter – Live Exchange Rates 2026</title>
        <meta
          name="description"
          content="Convert currencies instantly with real-time exchange rates. USD to PKR, EUR to PKR, AED to PKR, and 170+ currencies. Free, fast, no signup — perfect for Pakistan & international users."
        />
        <meta
          name="keywords"
          content="currency converter, usd to pkr, live exchange rates, free currency converter online, pkr converter, aed to pkr, sar to pkr, real time currency converter 2026"
        />
        <link
          rel="canonical"
          href="https://generatorpromptai.com/tools/currency-converter"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Currency Converter – Live Exchange Rates 2026" />
        <meta
          property="og:description"
          content="Instantly convert USD, EUR, GBP, PKR, AED, SAR, and more with accurate real-time rates. No ads, no registration."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/tools/currency-converter" />
        <meta property="og:site_name" content="GeneratorPromptAI" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online Currency Converter – Real-Time Rates" />
        <meta name="twitter:description" content="Convert PKR, USD, AED, SAR, EUR instantly. Built for Pakistan & global users." />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Currency Converter",
            url: "https://generatorpromptai.com/tools/currency-converter",
            description: "Free real-time currency conversion tool supporting 170+ currencies with live exchange rates.",
            applicationCategory: "UtilityApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "GeneratorPromptAI",
              url: "https://generatorpromptai.com",
            },
            featureList: "real-time exchange rates, currency swap, copy result, popular currencies including PKR"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Currency Converter
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Real-time exchange rates • 170+ currencies • Free & no sign-up
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg"
                />
              </div>

              {/* From → To (with swap) */}
              <div className="flex flex-col items-center gap-2 md:gap-0 md:flex-row md:items-end justify-center">
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    From
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full md:w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-lg font-medium"
                  >
                    {popularCurrencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={swapCurrencies}
                  disabled={loading}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition mt-4 md:mt-0 md:mx-4"
                  title="Swap currencies"
                >
                  <RefreshCw size={24} className="transform rotate-90" />
                </button>

                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    To
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full md:w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-lg font-medium"
                  >
                    {popularCurrencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Result Area */}
            <div className="mt-12 text-center">
              {loading ? (
                <div className="flex items-center justify-center gap-3 text-sky-600 text-lg">
                  <Loader2 size={28} className="animate-spin" />
                  <span>Fetching latest rates...</span>
                </div>
              ) : converted !== null ? (
                <div className="space-y-5">
                  <div className="text-5xl md:text-6xl font-bold text-sky-600 tracking-tight">
                    {converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                    {toCurrency}
                  </div>

                  <div className="text-xl text-gray-700">
                    1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}
                  </div>

                  {lastUpdated && (
                    <p className="text-sm text-gray-500">
                      Last updated: {lastUpdated}
                    </p>
                  )}

                  <button
                    onClick={copyResult}
                    className="mt-4 inline-flex items-center gap-2 px-7 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition font-medium"
                  >
                    <Copy size={18} />
                    {copied ? "Copied!" : "Copy Conversion"}
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-lg">
                  Enter amount and select currencies
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free Real-Time Currency Converter
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Convert currencies instantly using live exchange rates. Whether you're checking <strong>USD to PKR</strong>, <strong>AED to PKR</strong>, <strong>SAR to PKR</strong>,or any other pair — get accurate, up-to-date conversions without registration or ads.
              </p>
              <p>
                <p>Specially useful in Pakistan for remittances, online shopping, travel planning, and international payments. Supports major world currencies + frequent updates.</p>
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use This Currency Converter
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Enter the amount you want to convert (default: 1).</li>
                <li>Select the starting currency ("From").</li>
                <li>Choose the target currency ("To").</li>
                <li>Use the ↔ swap button to reverse currencies instantly.</li>
                <li>See the converted amount and current exchange rate immediately.</li>
                <li>Copy the full result (amount + rate) with one click.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Free Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/time-zone-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600 transition-colors">
                  Time Zone Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert time between any cities or time zones worldwide.
                </p>
              </Link>

              <Link
                to="/tools/percentage-calculator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600 transition-colors">
                  Percentage Calculator
                </h3>
                <p className="text-gray-600 text-sm">
                  Easily calculate percentages, discounts, markups & more.
                </p>
              </Link>

              <Link
                to="/tools/unit-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600 transition-colors">
                  Unit Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert length, weight, temperature, volume, area & more.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CurrencyConverter;