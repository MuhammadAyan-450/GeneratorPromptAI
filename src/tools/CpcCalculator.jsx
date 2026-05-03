import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy, RefreshCw, Home, ChevronDown, Download,
  DollarSign, MousePointerClick, Eye, Calculator,
  Zap, Shield, Target, CheckCircle2, TrendingUp
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CpcCalculator = () => {
  const [mode, setMode] = useState("cpc");
  const [cost, setCost] = useState("");
  const [clicks, setClicks] = useState("");
  const [cpc, setCpc] = useState("");
  const [impressions, setImpressions] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setError("");
  }, [mode]);

  const calculate = () => {
    const imp = parseFloat(impressions) || 0;
    const hasImpressions = imp > 0;

    if (mode === "cpc") {
      if (!cost || !clicks) { setError("Please enter both campaign cost and total clicks."); return; }
      const c = parseFloat(cost);
      const cl = parseFloat(clicks);
      if (cl <= 0) { setError("Clicks must be greater than 0."); return; }
      const calcCpc = c / cl;
      const extras = [
        { label: "Total Cost", value: `$${c.toFixed(2)}` },
        { label: "Total Clicks", value: cl.toLocaleString() },
      ];
      if (hasImpressions) {
        extras.push({ label: "CTR (Click-Through Rate)", value: `${((cl / imp) * 100).toFixed(2)}%` });
        extras.push({ label: "Equivalent CPM", value: `$${((c / imp) * 1000).toFixed(2)}` });
      } else {
        extras.push({ label: "Cost Per 1,000 Clicks", value: `$${(calcCpc * 1000).toFixed(2)}` });
        extras.push({ label: "Est. Conversions (3% Rate)", value: Math.round(cl * 0.03).toLocaleString() });
      }
      setResult({ label: "CPC (Cost Per Click)", value: `$${calcCpc.toFixed(2)}`, raw: calcCpc.toFixed(2), extras });
    } 
    
    else if (mode === "cost") {
      if (!cpc || !clicks) { setError("Please enter both CPC rate and total clicks."); return; }
      const cp = parseFloat(cpc);
      const cl = parseFloat(clicks);
      if (cp <= 0 || cl <= 0) { setError("CPC and clicks must be greater than 0."); return; }
      const calcCost = cp * cl;
      const extras = [
        { label: "CPC Rate", value: `$${cp.toFixed(2)}` },
        { label: "Total Clicks", value: cl.toLocaleString() },
      ];
      if (hasImpressions) {
        extras.push({ label: "CTR (Click-Through Rate)", value: `${((cl / imp) * 100).toFixed(2)}%` });
        extras.push({ label: "Equivalent CPM", value: `$${((calcCost / imp) * 1000).toFixed(2)}` });
      } else {
        extras.push({ label: "Budget for 10,000 Clicks", value: `$${(cp * 10000).toFixed(2)}` });
        extras.push({ label: "Est. Conversions (3% Rate)", value: Math.round(cl * 0.03).toLocaleString() });
      }
      setResult({ label: "Total Campaign Cost", value: `$${calcCost.toFixed(2)}`, raw: calcCost.toFixed(2), extras });
    } 
    
    else if (mode === "clicks") {
      if (!cpc || !cost) { setError("Please enter both CPC rate and campaign cost."); return; }
      const cp = parseFloat(cpc);
      const c = parseFloat(cost);
      if (cp <= 0) { setError("CPC must be greater than 0."); return; }
      const calcClicks = c / cp;
      const extras = [
        { label: "CPC Rate", value: `$${cp.toFixed(2)}` },
        { label: "Campaign Cost", value: `$${c.toFixed(2)}` },
      ];
      if (hasImpressions) {
        extras.push({ label: "CTR (Click-Through Rate)", value: `${((calcClicks / imp) * 100).toFixed(2)}%` });
        extras.push({ label: "Equivalent CPM", value: `$${((c / imp) * 1000).toFixed(2)}` });
      } else {
        extras.push({ label: "Est. Impressions (2% CTR)", value: Math.round(calcClicks / 0.02).toLocaleString() });
        extras.push({ label: "Est. Conversions (3% Rate)", value: Math.round(calcClicks * 0.03).toLocaleString() });
      }
      setResult({ label: "Total Clicks", value: Math.round(calcClicks).toLocaleString(), raw: Math.round(calcClicks), extras });
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
    const text = `CPC Calculation Result\n\n${result.label}: ${result.value}\n\n${result.extras.map((e) => `${e.label}: ${e.value}`).join("\n")}`;
    const file = new Blob([text], { type: "text/plain" });
    const el = document.createElement("a");
    el.href = URL.createObjectURL(file);
    el.download = "cpc-calculation.txt";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const handleReset = () => {
    setCost(""); setClicks(""); setCpc(""); setImpressions(""); setResult(null); setError(""); setCopied(false);
  };

  const modes = [
    { id: "cpc", label: "Calculate CPC", desc: "From Cost & Clicks", icon: <Target size={16} /> },
    { id: "cost", label: "Calculate Cost", desc: "From CPC & Clicks", icon: <DollarSign size={16} /> },
    { id: "clicks", label: "Calculate Clicks", desc: "From CPC & Cost", icon: <MousePointerClick size={16} /> },
  ];

  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculate CPC Online Free – Cost Per Click Calculator",
    "url": "https://www.generatorpromptai.com/tools/cpc-calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "description": "Free online CPC calculator. Calculate cost per click, total campaign cost, or total clicks instantly. Includes CTR and CPM metrics.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "CPC Calculator", "item": "https://www.generatorpromptai.com/tools/cpc-calculator" },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How to calculate CPC online?", "acceptedAnswer": { "@type": "Answer", "text": "Divide total campaign cost by total clicks. CPC = Cost / Clicks. Example: $500 cost / 100 clicks = $5.00 CPC. Use this free calculator to do it instantly." } },
      { "@type": "Question", "name": "What is a good CPC for Google Ads?", "acceptedAnswer": { "@type": "Answer", "text": "A good CPC on Google Ads varies by industry. Legal and finance can be $5-50+, while e-commerce averages $1-3. The global average across all industries is around $2-$4." } },
      { "@type": "Question", "name": "What does CPC stand for?", "acceptedAnswer": { "@type": "Answer", "text": "CPC stands for Cost Per Click. It is the amount an advertiser pays each time a user clicks on their ad. It is the primary pricing model for Google Ads and social media ads." } },
      { "@type": "Question", "name": "What is the difference between CPC and CPM?", "acceptedAnswer": { "@type": "Answer", "text": "CPC (Cost Per Click) means you pay when someone clicks your ad. CPM (Cost Per Mille) means you pay per 1,000 impressions regardless of clicks. CPC is better for direct response, CPM for brand awareness." } },
      { "@type": "Question", "name": "How to reduce CPC?", "acceptedAnswer": { "@type": "Answer", "text": "Improve Quality Score (relevance of ads, keywords, landing page), use long-tail keywords, add negative keywords, optimize ad copy for higher CTR, and run A/B tests on your campaigns." } },
    ],
  };

  const isDisabled =
    (mode === "cpc" && (!cost || !clicks)) ||
    (mode === "cost" && (!cpc || !clicks)) ||
    (mode === "clicks" && (!cpc || !cost));

  return (
    <>
      <Helmet>
        <title>Calculate CPC Online Free – Cost Per Click Calculator</title>
        <meta name="description" content="Free online CPC calculator. Calculate cost per click, total campaign cost, or total clicks instantly. No signup, no limits." />
        <meta name="keywords" content="calculate cpc online free, cost per click calculator, how to calculate cpc for ads, cpc formula calculator, calculate campaign cost from cpc, free cpc calculator tool, digital advertising cpc calculator, what is my cpc, calculate clicks from cpc and budget, google ads cpc calculator" />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/cpc-calculator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Calculate CPC Online Free – Cost Per Click Calculator" />
        <meta property="og:description" content="Free CPC calculator to calculate cost per click, campaign cost, or total clicks instantly." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/cpc-calculator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calculate CPC Online Free – CPC Calculator" />
        <meta name="twitter:description" content="Free CPC calculator to calculate cost per click instantly." />
        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-20">

        <div className="max-w-7xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-sky-600 transition-colors"><Home size={14} /> Home</Link>
            <span className="text-gray-300">/</span>
            <Link to="/pages/all-tools" className="hover:text-sky-600 transition-colors">All Tools</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">CPC Calculator</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
              <Target className="text-sky-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Calculate CPC Online Free – <span className="text-sky-600">Cost Per Click Calculator</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Calculate cost per click, campaign cost, or total clicks instantly. Free online tool — no signup, no limits.
            </p>
          </div>

          {/* ── TOOL CARD ── */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10 mb-8">

            {/* Mode Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">What do you want to calculate?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setMode(m.id); setResult(null); setError(""); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      mode === m.id
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <span className={mode === m.id ? "text-sky-600" : "text-gray-400"}>{m.icon}</span>
                    <div>
                      <span className="font-semibold text-sm block">{m.label}</span>
                      <span className="text-[11px] text-gray-400 block">{m.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              {mode === "cpc" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Cost ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" step="0.01" placeholder="e.g. 500" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Clicks</label>
                    <div className="relative">
                      <MousePointerClick size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" placeholder="e.g. 100" value={clicks} onChange={(e) => setClicks(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                    </div>
                  </div>
                </>
              )}

              {mode === "cost" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">CPC Rate ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" step="0.01" placeholder="e.g. 2.50" value={cpc} onChange={(e) => setCpc(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Clicks</label>
                    <div className="relative">
                      <MousePointerClick size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" placeholder="e.g. 1000" value={clicks} onChange={(e) => setClicks(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                    </div>
                  </div>
                </>
              )}

              {mode === "clicks" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">CPC Rate ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" step="0.01" placeholder="e.g. 2.50" value={cpc} onChange={(e) => setCpc(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Cost ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" step="0.01" placeholder="e.g. 500" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                    </div>
                  </div>
                </>
              )}

              {/* Optional Impressions Field */}
              <div className="pt-2 border-t border-dashed border-gray-200">
                <label className="block text-sm font-semibold text-gray-500 mb-1.5">
                  Total Impressions <span className="text-gray-400 font-normal">(optional — calculates CTR & CPM)</span>
                </label>
                <div className="relative">
                  <Eye size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" placeholder="e.g. 10000" value={impressions} onChange={(e) => setImpressions(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                </div>
              </div>
            </div>

            {/* Formula Banner */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1.5">Formula Used</p>
              <p className="text-gray-800 text-sm font-mono font-semibold">
                {mode === "cpc" && "CPC = Total Cost ÷ Total Clicks"}
                {mode === "cost" && "Total Cost = CPC × Total Clicks"}
                {mode === "clicks" && "Total Clicks = Total Cost ÷ CPC"}
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
              <button onClick={calculate} disabled={isDisabled} className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5">
                <Calculator size={18} /> Calculate
              </button>
              <button onClick={handleReset} className="bg-white border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5">
                <RefreshCw size={18} /> Reset
              </button>
            </div>
          </div>

          {/* ── RESULT ── */}
          {result && (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden mb-8">
              <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-sm font-bold text-green-700">Calculation Result</span>
              </div>
              <div className="p-6 md:p-8 text-center">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">{result.label}</p>
                <p className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">{result.value}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {result.extras.map((e, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{e.label}</p>
                      <p className="text-lg font-bold text-gray-800">{e.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-3 border-t border-gray-100 pt-5">
                  <button onClick={handleCopy} className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md">
                    <Copy size={15} /> {copied ? "Copied!" : "Copy Result"}
                  </button>
                  <button onClick={handleDownload} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all">
                    <Download size={15} /> Download .txt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Zap size={20} className="text-amber-500" />, title: "Instant", desc: "Calculate CPC, cost, or clicks in milliseconds." },
              { icon: <Target size={20} className="text-green-600" />, title: "3 Calculation Modes", desc: "Find CPC, budget, or expected clicks — switch instantly." },
              { icon: <TrendingUp size={20} className="text-sky-600" />, title: "CTR & CPM Bonus", desc: "Add impressions to auto-calculate CTR and CPM metrics." },
              { icon: <Shield size={20} className="text-violet-600" />, title: "100% Free", desc: "No signup, no limits, no hidden fees. Completely free." },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-sky-300 transition-all">
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* How to Use */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Calculate CPC Online in 3 Steps</h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Select what to calculate", desc: "Choose CPC, Cost, or Clicks based on what metric you need." },
                { step: "2", title: "Enter the known values", desc: "Fill in the two required fields (e.g., cost and clicks to find CPC)." },
                { step: "3", title: "Click Calculate", desc: "Get your result instantly with bonus CTR and CPM metrics." },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{item.step}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* SEO 1 */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free CPC Calculator – Calculate Cost Per Click for Your Ads</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              <strong>CPC (Cost Per Click)</strong> is the amount you pay each time a user clicks on your digital ad. It is the most important metric for pay-per-click (PPC) campaigns on platforms like Google Ads, Facebook Ads, and LinkedIn Ads. This free CPC calculator lets you figure out your actual CPC in seconds.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you also enter your total impressions, this tool goes beyond basic CPC calculation and automatically computes your <strong>Click-Through Rate (CTR)</strong> and <strong>CPM (Cost Per Mille)</strong>. This gives you a complete picture of your ad performance without needing multiple separate tools.
            </p>
          </section>

          {/* SEO 2 */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">CPC Formula Explained – How to Calculate Cost Per Click</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The CPC formula is simple: <strong>CPC = Total Campaign Cost ÷ Total Clicks</strong>. For example, if you spent $500 on a Google Ads campaign and received 100 clicks, your CPC is $500 ÷ 100 = $5.00. This means you paid exactly $5 for every person who clicked your ad.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You can reverse this formula to plan budgets: if your target CPC is $3 and you want 500 clicks, your budget should be $3 × 500 = $1,500. Or if you have a $2,000 budget and your CPC is $4, you can expect approximately 500 clicks. This calculator handles all three directions instantly.
            </p>
          </section>

          {/* FAQ */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">CPC Calculator – FAQs</h2>
            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                { q: "How to calculate CPC online?", a: "Divide total campaign cost by total clicks. CPC = Cost / Clicks. Example: $500 cost / 100 clicks = $5.00 CPC. Use this free calculator to do it instantly." },
                { q: "What is a good CPC for Google Ads?", a: "A good CPC on Google Ads varies by industry. Legal and finance can be $5-50+, while e-commerce averages $1-3. The global average across all industries is around $2-$4." },
                { q: "What does CPC stand for?", a: "CPC stands for Cost Per Click. It is the amount an advertiser pays each time a user clicks on their ad. It is the primary pricing model for Google Ads and social media ads." },
                { q: "What is the difference between CPC and CPM?", a: "CPC (Cost Per Click) means you pay when someone clicks your ad. CPM (Cost Per Mille) means you pay per 1,000 impressions regardless of clicks. CPC is better for direct response, CPM for brand awareness." },
                { q: "How to reduce CPC?", a: "Improve Quality Score (relevance of ads, keywords, landing page), use long-tail keywords, add negative keywords, optimize ad copy for higher CTR, and run A/B tests on your campaigns." },
                { q: "Why is my CPC so high?", a: "High CPC is usually caused by bidding on competitive short-tail keywords, low Quality Score, poor landing page experience, or targeting high-competition audiences/locations." },
                { q: "Can I calculate CTR with this tool?", a: "Yes. If you optionally enter your total impressions along with cost and clicks, the tool will automatically calculate your CTR (Click-Through Rate) and CPM alongside your CPC." },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-sm md:text-base font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={20} className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Free Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/cpm-calculator", title: "CPM Calculator", desc: "Calculate cost per 1000 impressions for your display and social ad campaigns." },
                { to: "/tools/ad-revenue-calculator", title: "Ad Revenue Calculator", desc: "Estimate ad income from display, native, video, and other ad formats." },
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentage increase, decrease, and difference instantly." },
              ].map((tool) => (
                <Link key={tool.to} to={tool.to} className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-sky-400 transition-all">
                  <h3 className="font-bold text-gray-800 text-sm mb-1.5 group-hover:text-sky-600 transition-colors">{tool.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{tool.desc}</p>
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

export default CpcCalculator;