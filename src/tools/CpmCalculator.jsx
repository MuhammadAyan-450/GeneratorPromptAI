import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy,
  RefreshCw,
  Home,
  ChevronDown,
  Download,
  DollarSign,
  Eye,
  Calculator,
  Zap,
  Shield,
  BarChart3,
  CheckCircle2,
  Target,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CpmCalculator = () => {
  const [mode, setMode] = useState("cpm");
  const [cost, setCost] = useState("");
  const [impressions, setImpressions] = useState("");
  const [cpm, setCpm] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setError("");
  }, [mode]);

  const calculate = () => {
    if (mode === "cpm") {
      if (!cost || !impressions) {
        setError("Please enter both campaign cost and total impressions.");
        return;
      }
      const c = parseFloat(cost);
      const i = parseFloat(impressions);
      if (i <= 0) {
        setError("Impressions must be greater than 0.");
        return;
      }
      const calcCpm = (c / i) * 1000;
      const costPerClick = i > 0 ? c / (i * 0.015) : 0;
      setResult({
        label: "CPM (Cost Per 1,000 Impressions)",
        value: `$${calcCpm.toFixed(2)}`,
        raw: calcCpm.toFixed(2),
        extras: [
          { label: "Campaign Cost", value: `$${c.toFixed(2)}` },
          { label: "Total Impressions", value: i.toLocaleString() },
          { label: "Cost Per Impression", value: `$${(c / i).toFixed(5)}` },
          {
            label: "Est. Cost Per Click (1.5% CTR)",
            value: `$${costPerClick.toFixed(2)}`,
          },
        ],
      });
    } else if (mode === "cost") {
      if (!cpm || !impressions) {
        setError("Please enter both CPM and total impressions.");
        return;
      }
      const cp = parseFloat(cpm);
      const i = parseFloat(impressions);
      if (i <= 0) {
        setError("Impressions must be greater than 0.");
        return;
      }
      const calcCost = (cp * i) / 1000;
      setResult({
        label: "Total Campaign Cost",
        value: `$${calcCost.toFixed(2)}`,
        raw: calcCost.toFixed(2),
        extras: [
          { label: "CPM Rate", value: `$${cp.toFixed(2)}` },
          { label: "Total Impressions", value: i.toLocaleString() },
          {
            label: "Cost Per Impression",
            value: `$${(calcCost / i).toFixed(5)}`,
          },
          {
            label: "Est. Budget for 1M Impressions",
            value: `$${(cp * 1000).toFixed(2)}`,
          },
        ],
      });
    } else if (mode === "impressions") {
      if (!cpm || !cost) {
        setError("Please enter both CPM and campaign cost.");
        return;
      }
      const cp = parseFloat(cpm);
      const c = parseFloat(cost);
      if (cp <= 0) {
        setError("CPM must be greater than 0.");
        return;
      }
      const calcImpressions = (c / cp) * 1000;
      setResult({
        label: "Total Impressions",
        value: Math.round(calcImpressions).toLocaleString(),
        raw: Math.round(calcImpressions),
        extras: [
          { label: "CPM Rate", value: `$${cp.toFixed(2)}` },
          { label: "Campaign Cost", value: `$${c.toFixed(2)}` },
          {
            label: "Cost Per Impression",
            value: `$${(c / calcImpressions).toFixed(5)}`,
          },
          {
            label: "Est. Clicks (1.5% CTR)",
            value: Math.round(calcImpressions * 0.015).toLocaleString(),
          },
        ],
      });
    }
    setError("");
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${result.label}: ${result.value}\n\n${result.extras.map((e) => `${e.label}: ${e.value}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = `CPM Calculation Result\n\n${result.label}: ${result.value}\n\n${result.extras.map((e) => `${e.label}: ${e.value}`).join("\n")}`;
    const file = new Blob([text], { type: "text/plain" });
    const el = document.createElement("a");
    el.href = URL.createObjectURL(file);
    el.download = "cpm-calculation.txt";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const handleReset = () => {
    setCost("");
    setImpressions("");
    setCpm("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const modes = [
    {
      id: "cpm",
      label: "Calculate CPM",
      desc: "From Cost & Impressions",
      icon: <Target size={16} />,
    },
    {
      id: "cost",
      label: "Calculate Cost",
      desc: "From CPM & Impressions",
      icon: <DollarSign size={16} />,
    },
    {
      id: "impressions",
      label: "Calculate Impressions",
      desc: "From CPM & Cost",
      icon: <Eye size={16} />,
    },
  ];

  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculate the CPM Online Free – CPM Calculator Tool",
    url: "https://www.generatorpromptai.com/tools/cpm-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    description:
      "Free online CPM calculator. Calculate cost per 1000 impressions, total campaign cost, or total impressions instantly. No signup required.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI" },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.generatorpromptai.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Free Tools",
        item: "https://www.generatorpromptai.com/pages/all-tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "CPM Calculator",
        item: "https://www.generatorpromptai.com/tools/cpm-calculator",
      },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How to calculate CPM online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Divide your total campaign cost by total impressions, then multiply by 1000. CPM = (Cost / Impressions) × 1000. Or use this free CPM calculator — just enter cost and impressions.",
        },
      },
      {
        "@type": "Question",
        name: "What is a good CPM for digital advertising?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A good CPM varies by platform and industry. Display ads average $2-5 CPM, social media $5-12, Google Search $10-30. Finance and tech niches have higher CPMs.",
        },
      },
      {
        "@type": "Question",
        name: "What does CPM stand for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CPM stands for Cost Per Mille (Mille = thousand in Latin). It means the cost an advertiser pays for 1,000 impressions of their ad.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between CPM and CPC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CPM is cost per 1,000 impressions — you pay for views. CPC is cost per click — you pay only when someone clicks your ad. CPM is better for brand awareness, CPC for direct response.",
        },
      },
      {
        "@type": "Question",
        name: "How to calculate campaign cost from CPM?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply CPM by number of impressions, then divide by 1000. Cost = (CPM × Impressions) / 1000. Example: $5 CPM × 100,000 impressions = $500 cost.",
        },
      },
    ],
  };

  const isDisabled =
    (mode === "cpm" && (!cost || !impressions)) ||
    (mode === "cost" && (!cpm || !impressions)) ||
    (mode === "impressions" && (!cpm || !cost));

  return (
    <>
      <Helmet>
        <title>
          Calculate the CPM Online Free – Cost Per 1000 Impressions Calculator
        </title>
        <meta
          name="description"
          content="Free online CPM calculator. Calculate cost per 1000 impressions, total campaign cost, or total impressions instantly. No signup, no limits."
        />
        <meta
          name="keywords"
          content="calculate the cpm online free, cpm calculator online free, cost per 1000 impressions calculator, how to calculate cpm for ads, calculate campaign cost from cpm, cpm formula calculator, digital advertising cpm calculator, calculate impressions from cpm and cost, free cpm calculator tool, what is my cpm calculator"
        />
        <link
          rel="canonical"
          href="https://www.generatorpromptai.com/tools/cpm-calculator"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta
          property="og:title"
          content="Calculate the CPM Online Free – CPM Calculator"
        />
        <meta
          property="og:description"
          content="Free CPM calculator. Calculate cost per 1000 impressions, campaign cost, or impressions instantly."
        />
        <meta
          property="og:url"
          content="https://www.generatorpromptai.com/tools/cpm-calculator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Calculate the CPM Online Free – CPM Calculator"
        />
        <meta
          name="twitter:description"
          content="Free CPM calculator to calculate cost per 1000 impressions instantly."
        />
        <script type="application/ld+json">
          {JSON.stringify(schemaWebApp)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(schemaBreadcrumb)}
        </script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-20">
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
            <span className="text-gray-900 font-semibold">CPM Calculator</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
              <BarChart3 className="text-sky-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Calculate the CPM Online Free –{" "}
              <span className="text-sky-600">Cost Per 1000 Impressions</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Calculate CPM, campaign cost, or total impressions instantly. Free
              online tool — no signup, no limits.
            </p>
          </div>

          {/* ── TOOL CARD ── */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10 mb-8">
            {/* Mode Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                What do you want to calculate?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id);
                      setResult(null);
                      setError("");
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      mode === m.id
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <span
                      className={
                        mode === m.id ? "text-sky-600" : "text-gray-400"
                      }
                    >
                      {m.icon}
                    </span>
                    <div>
                      <span className="font-semibold text-sm block">
                        {m.label}
                      </span>
                      <span className="text-[11px] text-gray-400 block">
                        {m.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              {mode === "cpm" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Campaign Cost ($)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 500"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Total Impressions
                    </label>
                    <div className="relative">
                      <Eye
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        placeholder="e.g. 100000"
                        value={impressions}
                        onChange={(e) => setImpressions(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {mode === "cost" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      CPM Rate ($)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 5.00"
                        value={cpm}
                        onChange={(e) => setCpm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Total Impressions
                    </label>
                    <div className="relative">
                      <Eye
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        placeholder="e.g. 100000"
                        value={impressions}
                        onChange={(e) => setImpressions(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {mode === "impressions" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      CPM Rate ($)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 5.00"
                        value={cpm}
                        onChange={(e) => setCpm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Campaign Cost ($)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 500"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Formula Banner */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1.5">
                Formula Used
              </p>
              <p className="text-gray-800 text-sm font-mono font-semibold">
                {mode === "cpm" && "CPM = (Cost ÷ Impressions) × 1,000"}
                {mode === "cost" && "Cost = (CPM × Impressions) ÷ 1,000"}
                {mode === "impressions" && "Impressions = (Cost ÷ CPM) × 1,000"}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <button
                onClick={calculate}
                disabled={isDisabled}
                className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5"
              >
                <Calculator size={18} /> Calculate
              </button>
              <button
                onClick={handleReset}
                className="bg-white border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5"
              >
                <RefreshCw size={18} /> Reset
              </button>
            </div>
          </div>

          {/* ── RESULT ── */}
          {result && (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden mb-8">
              <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">
                  Calculation Result
                </span>
              </div>
              <div className="p-6 md:p-8 text-center">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                  {result.label}
                </p>
                <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  {result.value}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {result.extras.map((e, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left"
                    >
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                        {e.label}
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {e.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-3 border-t border-gray-100 pt-5">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    <Copy size={15} /> {copied ? "Copied!" : "Copy Result"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all"
                  >
                    <Download size={15} /> Download .txt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              {
                icon: <Zap size={20} className="text-amber-500" />,
                title: "Instant",
                desc: "Get CPM, cost, or impressions calculated in milliseconds.",
              },
              {
                icon: <Target size={20} className="text-green-600" />,
                title: "3 Calculation Modes",
                desc: "Calculate CPM, cost, or impressions — switch with one click.",
              },
              {
                icon: <Shield size={20} className="text-sky-600" />,
                title: "100% Free",
                desc: "No signup, no limits, no hidden fees. Completely free.",
              },
              {
                icon: <BarChart3 size={20} className="text-violet-600" />,
                title: "Extra Metrics",
                desc: "See cost per impression and estimated CPC alongside CPM.",
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

          {/* How to Use */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Calculate CPM Online in 3 Steps
            </h2>
            <ol className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Select what to calculate",
                  desc: "Choose CPM, Cost, or Impressions based on what you want to find.",
                },
                {
                  step: "2",
                  title: "Enter the known values",
                  desc: "Fill in the two required fields (e.g., cost and impressions to find CPM).",
                },
                {
                  step: "3",
                  title: "Click Calculate",
                  desc: "Get your result instantly with extra metrics like cost per impression.",
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

          {/* SEO 1 */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free CPM Calculator – Calculate Cost Per 1000 Impressions Online
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              <strong>CPM (Cost Per Mille)</strong> is the most common pricing
              model in digital advertising. It tells you how much you pay for
              every 1,000 times your ad is shown, regardless of whether anyone
              clicks on it. This free CPM calculator lets you calculate your CPM
              in seconds — just enter your campaign cost and impressions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Beyond basic CPM, this tool also shows{" "}
              <strong>cost per individual impression</strong> and an{" "}
              <strong>estimated cost per click</strong> (assuming a 1.5% CTR).
              This gives you a fuller picture of your ad spend efficiency. You
              can also reverse-calculate: find out how much a campaign will cost
              given a CPM rate, or how many impressions you can buy with a fixed
              budget.
            </p>
          </section>

          {/* SEO 2 */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              CPM Formula Explained – How to Calculate Cost Per Thousand
              Impressions
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The CPM formula is straightforward:{" "}
              <strong>CPM = (Total Cost ÷ Total Impressions) × 1,000</strong>.
              For example, if you spent $500 on an ad campaign that received
              100,000 impressions, your CPM is ($500 ÷ 100,000) × 1,000 = $5.00.
              This means you paid $5 for every 1,000 times your ad was
              displayed.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Understanding CPM helps you compare ad platforms, optimize
              budgets, and negotiate better rates. A $3 CPM on Facebook vs a $12
              CPM on LinkedIn might seem like Facebook is cheaper — but if
              LinkedIn drives higher-quality leads, the higher CPM could be
              worth it. Always evaluate CPM alongside conversion metrics.
            </p>
          </section>

          {/* FAQ */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              CPM Calculator – FAQs
            </h2>
            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                {
                  q: "How to calculate CPM online?",
                  a: "Divide your total campaign cost by total impressions, then multiply by 1000. CPM = (Cost / Impressions) × 1000. Or use this free CPM calculator — just enter cost and impressions.",
                },
                {
                  q: "What is a good CPM for digital advertising?",
                  a: "A good CPM varies by platform and industry. Display ads average $2-5 CPM, social media $5-12, Google Search $10-30. Finance and tech niches have higher CPMs.",
                },
                {
                  q: "What does CPM stand for?",
                  a: "CPM stands for Cost Per Mille (Mille = thousand in Latin). It means the cost an advertiser pays for 1,000 impressions of their ad.",
                },
                {
                  q: "What is the difference between CPM and CPC?",
                  a: "CPM is cost per 1,000 impressions — you pay for views. CPC is cost per click — you pay only when someone clicks your ad. CPM is better for brand awareness, CPC for direct response.",
                },
                {
                  q: "How to calculate campaign cost from CPM?",
                  a: "Multiply CPM by number of impressions, then divide by 1000. Cost = (CPM × Impressions) / 1000. Example: $5 CPM × 100,000 impressions = $500 cost.",
                },
                {
                  q: "Is a lower CPM always better?",
                  a: "Not necessarily. A low CPM on a low-quality platform might generate poor results. Focus on cost-per-conversion rather than just CPM. A $20 CPM with 5% conversion rate beats a $2 CPM with 0.1% conversion.",
                },
                {
                  q: "How many impressions is 1 CPM?",
                  a: "1 CPM equals exactly 1,000 impressions. If your CPM is $5, you pay $5 for every 1,000 times your ad is shown to users.",
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

          {/* Related */}
          <section className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  to: "/tools/cpc-calculator",
                  title: "CPC Calculator",
                  desc: "Calculate cost per click for your ad campaigns. Compare CPC across platforms.",
                },
                {
                  to: "/tools/ad-revenue-calculator",
                  title: "Ad Revenue Calculator",
                  desc: "Estimate ad income from display, native, video, and other ad formats by category.",
                },
                {
                  to: "/tools/percentage-calculator",
                  title: "Percentage Calculator",
                  desc: "Calculate percentage increase, decrease, and difference instantly.",
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

export default CpmCalculator;
