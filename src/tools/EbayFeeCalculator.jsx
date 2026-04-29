import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy,
  RefreshCw,
  DollarSign,
  Home,
  ChevronDown,
  Download,
  Calculator,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  Percent,
  Truck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EbayChargesCalculator = () => {
  const [price, setPrice] = useState("");
  const [shipping, setShipping] = useState("");
  const [feePercent, setFeePercent] = useState(13);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const calculateFees = () => {
    if (!price) {
      setError("Please enter item price");
      return;
    }

    const total = parseFloat(price) + parseFloat(shipping || 0);
    const fee = (total * feePercent) / 100;
    const profit = total - fee;

    setError("");
    setResult({ total, fee, profit });
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `Total: $${result.total.toFixed(2)}\neBay Fee: $${result.fee.toFixed(2)}\nProfit: $${result.profit.toFixed(2)}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob(
      [
        `eBay Fee Calculation\n\nTotal: $${result.total.toFixed(2)}\neBay Fee: $${result.fee.toFixed(2)}\nProfit: $${result.profit.toFixed(2)}`,
      ],
      { type: "text/plain" },
    );
    element.href = URL.createObjectURL(file);
    element.download = "ebay-fee-calculation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setPrice("");
    setShipping("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const isDisabled = !price.trim();

  // ── SCHEMA ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "eBay Charges Calculator Free Online",
    url: "https://www.generatorpromptai.com/tools/ebay-charges-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    description:
      "Free eBay charges calculator to calculate seller fees, final value fees, and profit instantly.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How to calculate eBay fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter item price and shipping cost. The calculator automatically applies the eBay final value fee percentage and shows your profit.",
        },
      },
      {
        "@type": "Question",
        name: "What is eBay final value fee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is the percentage eBay charges on total sale including shipping. Usually around 10–15% depending on category.",
        },
      },
      {
        "@type": "Question",
        name: "How to calculate profit after eBay fees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Subtract eBay fee from total sale amount. This tool does it automatically.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>
          eBay Charges Calculator – Calculate eBay Fees & Profit Free
        </title>

        <meta
          name="description"
          content="Free eBay charges calculator. Calculate eBay seller fees, final value fees, and profit instantly. Best eBay fee calculator online."
        />

        <meta
          name="keywords"
          content="ebay charges calculator, ebay fee calculator 2026, ebay profit calculator, final value fee ebay calculator"
        />

        <link
          rel="canonical"
          href="https://www.generatorpromptai.com/tools/ebay-charges-calculator"
        />

        <script type="application/ld+json">
          {JSON.stringify(schemaWebApp)}
        </script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto w-full px-4 pt-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-gray-500"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-sky-600 transition-colors"
            >
              <Home size={14} /> Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              to="/pages/all-tools"
              className="hover:text-sky-600 transition-colors"
            >
              All Tools
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">
              eBay Charges Calculator
            </span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
              <DollarSign className="text-sky-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
              eBay Charges Calculator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Calculate eBay seller fees, final value fee, and profit instantly
              using this <strong>free online tool</strong>.
            </p>
          </div>

          {/* ── TOOL CARD ── */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10 mb-8">
            {/* Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Item Price ($)
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="e.g. 99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Shipping Cost ($)
                </label>
                <div className="relative">
                  <Truck
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="e.g. 5.99 (optional)"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  eBay Fee Percentage (%)
                </label>
                <div className="relative">
                  <Percent
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Default: 13%"
                    value={feePercent}
                    onChange={(e) => setFeePercent(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={calculateFees}
                disabled={isDisabled}
                className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5"
              >
                <Calculator size={18} /> Calculate Fees
              </button>
              <button
                onClick={reset}
                className="bg-white border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5"
              >
                <RefreshCw size={18} /> Reset
              </button>
            </div>

            {/* ── Result ── */}
            {result && (
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                {/* Result Header */}
                <div className="bg-sky-50 border-b border-sky-100 px-5 py-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-sky-600" />
                  <span className="text-sm font-bold text-sky-700">
                    Calculation Result
                  </span>
                </div>

                {/* Result Grid */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        Total Sale
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">
                        ${result.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                      <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider mb-1">
                        eBay Fee
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-red-600">
                        −${result.fee.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                      <p className="text-[10px] text-green-500 uppercase font-bold tracking-wider mb-1">
                        Your Profit
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">
                        ${result.profit.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Profit Bar Visual */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>
                        Fee: {((result.fee / result.total) * 100).toFixed(1)}%
                      </span>
                      <span>
                        Profit:{" "}
                        {((result.profit / result.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-red-400 h-full rounded-l-full transition-all duration-500"
                        style={{
                          width: `${(result.fee / result.total) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-green-400 h-full rounded-r-full transition-all duration-500"
                        style={{
                          width: `${(result.profit / result.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Utility Actions */}
                  <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                    <button
                      onClick={copyResult}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                    >
                      <Copy size={15} />
                      {copied ? "Copied!" : "Copy Result"}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all"
                    >
                      <Download size={15} />
                      Download .txt
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Features Grid ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              {
                icon: <Zap size={20} className="text-amber-500" />,
                title: "Instant",
                desc: "Get fee breakdown in milliseconds — no waiting.",
              },
              {
                icon: <TrendingUp size={20} className="text-green-600" />,
                title: "Profit Breakdown",
                desc: "See exactly how much you keep after fees.",
              },
              {
                icon: <Shield size={20} className="text-sky-600" />,
                title: "100% Free",
                desc: "No signup, no limits, completely free to use.",
              },
              {
                icon: <Calculator size={20} className="text-violet-600" />,
                title: "Custom Fee %",
                desc: "Adjust the fee percentage for any category.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ── How to Use ── */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Calculate eBay Fees in 3 Steps
            </h2>
            <ol className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Enter your item price",
                  desc: "Type in the selling price of your item in dollars.",
                },
                {
                  step: "2",
                  title: "Add shipping cost",
                  desc: "Optionally add the shipping charge. eBay fee is calculated on total.",
                },
                {
                  step: "3",
                  title: "Hit Calculate",
                  desc: "Instantly see total sale, eBay fee, and your actual profit.",
                },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.title}
                    </p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── SEO Content ── */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free eBay Fee Calculator – Calculate Seller Profit Easily
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This eBay charges calculator helps sellers estimate total fees and
              profit instantly. It includes final value fee calculations and
              works for all categories.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The <strong>eBay final value fee</strong> is calculated on the
              total amount of the sale — including the item price and shipping
              cost. This means even if you offer free shipping, the fee still
              applies to what you actually spend on shipping. Our tool accounts
              for this automatically, giving you an accurate profit estimate.
            </p>
          </section>

          {/* ── FAQ Accordion ── */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              eBay Fee Calculator – FAQs
            </h2>

            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                {
                  q: "How to calculate eBay fees?",
                  a: "Enter item price and shipping cost. The calculator automatically applies the eBay final value fee percentage and shows your profit.",
                },
                {
                  q: "What is eBay final value fee?",
                  a: "It is the percentage eBay charges on total sale including shipping. Usually around 10–15% depending on category.",
                },
                {
                  q: "How to calculate profit after eBay fees?",
                  a: "Subtract eBay fee from total sale amount. This tool does it automatically.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">
                      {item.q}
                    </h3>
                    <ChevronDown
                      size={20}
                      className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related Tools ── */}
          <section className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  to: "/tools/age-calculator",
                  title: "Age Calculator",
                  desc: "Calculate exact age in years, months and days from your date of birth.",
                },

                {
                  to: "/tools/currency-converter",
                  title: "Currency Converter",
                  desc: "Convert between currencies with live real-time exchange rates.",
                },

                {
                  to: "/tools/percentage-calculator",
                  title: "Percentage Calculator",
                  desc: "Calculate percentages, percentage change, and percentage difference instantly.",
                },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
                  <h3 className="font-bold text-gray-800 text-sm mb-1.5 group-hover:text-sky-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EbayChargesCalculator;
