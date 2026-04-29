import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Home, ChevronDown, Download, DollarSign, BarChart3, Zap, Shield, Eye, MousePointerClick, Target, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdRevenueCalculator = () => {
  const [impressions, setImpressions] = useState("");
  const [cpm, setCpm] = useState("");
  const [cpc, setCpc] = useState("");
  const [ctr, setCtr] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: "display", name: "Display Ads", icon: "🖥️", cpmMult: 1.0, cpcMult: 1.0 },
    { id: "native", name: "Native Ads", icon: "📰", cpmMult: 1.3, cpcMult: 1.5 },
    { id: "video", name: "Video Ads", icon: "🎬", cpmMult: 2.2, cpcMult: 1.8 },
    { id: "popup", name: "Popup Ads", icon: "📢", cpmMult: 0.8, cpcMult: 0.7 },
    { id: "interstitial", name: "Interstitial Ads", icon: "📱", cpmMult: 1.8, cpcMult: 1.2 },
    { id: "rich", name: "Rich Media Ads", icon: "🎨", cpmMult: 2.5, cpcMult: 2.0 },
  ];

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const calculate = () => {
    if (!impressions || !cpm) {
      setError("Please enter at least impressions and CPM");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Please select at least one ad category");
      return;
    }

    const imp = parseFloat(impressions);
    const baseCpm = parseFloat(cpm);
    const baseCpc = parseFloat(cpc) || 0;
    const baseCtr = parseFloat(ctr) || 0;

    const results = selectedCategories.map((catId) => {
      const cat = categories.find((c) => c.id === catId);
      const effectiveCpm = baseCpm * cat.cpmMult;
      const effectiveCpc = baseCpc * cat.cpcMult;
      const clicks = (imp * baseCtr) / 100;
      const cpmRevenue = (imp / 1000) * effectiveCpm;
      const cpcRevenue = clicks * effectiveCpc;
      const totalRevenue = cpmRevenue + cpcRevenue;
      return {
        ...cat,
        effectiveCpm: effectiveCpm.toFixed(2),
        effectiveCpc: effectiveCpc.toFixed(2),
        clicks: Math.round(clicks),
        cpmRevenue: cpmRevenue.toFixed(2),
        cpcRevenue: cpcRevenue.toFixed(2),
        totalRevenue: totalRevenue.toFixed(2),
      };
    });

    const grandTotal = results.reduce((sum, r) => sum + parseFloat(r.totalRevenue), 0);

    setError("");
    setResult({ results, grandTotal: grandTotal.toFixed(2) });
  };

  const copyResult = () => {
    if (!result) return;
    const text = result.results
      .map((r) => `${r.name}: $${r.totalRevenue} (CPM: $${r.effectiveCpm})`)
      .join("\n");
    navigator.clipboard.writeText(`Ad Revenue Estimate\n\n${text}\n\nGrand Total: $${result.grandTotal}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = result.results
      .map((r) => `${r.name}: $${r.totalRevenue} (CPM: $${r.effectiveCpm}, CPC: $${r.effectiveCpc}, Clicks: ${r.clicks})`)
      .join("\n");
    const file = new Blob([`Ad Revenue Calculation\n\n${text}\n\nGrand Total: $${result.grandTotal}`], { type: "text/plain" });
    const el = document.createElement("a");
    el.href = URL.createObjectURL(file);
    el.download = "ad-revenue-calculation.txt";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const reset = () => {
    setImpressions("");
    setCpm("");
    setCpc("");
    setCtr("");
    setSelectedCategories([]);
    setResult(null);
    setError("");
    setCopied(false);
  };

  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Ad Revenue Calculator – Estimate Ad Income by Category",
    "url": "https://www.generatorpromptai.com/tools/ad-revenue-calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "description": "Free ad revenue calculator to estimate earnings from display, native, video, popup, interstitial, and rich media ads by category.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How to calculate ad revenue from impressions?", "acceptedAnswer": { "@type": "Answer", "text": "Divide total impressions by 1000 and multiply by CPM. For example, 100,000 impressions at $5 CPM = $500. Add CPC revenue by multiplying clicks by CPC." } },
      { "@type": "Question", "name": "What is a good CPM for display ads?", "acceptedAnswer": { "@type": "Answer", "text": "Display ad CPM typically ranges from $0.50 to $10 depending on niche, geography, and ad format. Finance and tech niches tend to have higher CPMs." } },
      { "@type": "Question", "name": "Which ad format pays the most?", "acceptedAnswer": { "@type": "Answer", "text": "Rich media and video ads typically have the highest CPMs, often 2-3x higher than standard display ads. Interstitial ads also perform well." } },
      { "@type": "Question", "name": "How does CTR affect ad revenue?", "acceptedAnswer": { "@type": "Answer", "text": "Higher CTR means more clicks, which directly increases CPC-based revenue. Even with a low CPC, a high CTR can significantly boost total earnings." } }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Ad Revenue Calculator – Estimate Ad Income by Category Free Online</title>
        <meta name="description" content="Free ad revenue calculator to estimate earnings from display, native, video, popup, interstitial, and rich media ads. Calculate CPM and CPC revenue by ad category instantly." />
        <meta name="keywords" content="ad revenue calculator, how to calculate ad revenue from impressions, estimate ad income by category, display ad revenue calculator, native ad revenue estimator, video ad CPM calculator, popup ad revenue calculator, interstitial ad earnings calculator, rich media ad revenue estimator, CPM revenue formula calculator, CPC revenue calculator online free" />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/ad-revenue-calculator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Ad Revenue Calculator – Estimate Ad Income by Category" />
        <meta property="og:description" content="Calculate estimated ad revenue from display, native, video, and other ad formats by category." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/ad-revenue-calculator" />
        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
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
            <span className="text-gray-900 font-semibold">Ad Revenue Calculator</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
              <BarChart3 className="text-sky-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Ad Revenue Calculator – <span className="text-sky-600">Estimate Income by Category</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Calculate estimated earnings from display, native, video, popup, interstitial, and rich media ads using CPM and CPC.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10 mb-8">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Impressions</label>
                <div className="relative">
                  <Eye size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" placeholder="e.g. 500000" value={impressions} onChange={(e) => setImpressions(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">CPM ($)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" placeholder="e.g. 5.00" value={cpm} onChange={(e) => setCpm(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">CPC ($)</label>
                  <div className="relative">
                    <MousePointerClick size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" placeholder="e.g. 0.50" value={cpc} onChange={(e) => setCpc(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">CTR (%)</label>
                  <div className="relative">
                    <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" step="0.01" placeholder="e.g. 1.5" value={ctr} onChange={(e) => setCtr(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Ad Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all text-sm font-medium ${selectedCategories.includes(cat.id)
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50/50"
                      }`}
                  >
                    <span className="text-lg block mb-1">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-red-600 text-sm font-medium">{error}</p></div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button onClick={calculate} disabled={!impressions || !cpm || selectedCategories.length === 0} className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5">
                <BarChart3 size={18} /> Calculate Revenue
              </button>
              <button onClick={reset} className="bg-white border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5">
                <RefreshCw size={18} /> Reset
              </button>
            </div>

            {result && (
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-sky-50 border-b border-sky-100 px-5 py-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-sky-600" />
                  <span className="text-sm font-bold text-sky-700">Revenue Breakdown by Category</span>
                </div>
                <div className="p-5">
                  <div className="space-y-3 mb-5">
                    {result.results.map((r) => (
                      <div key={r.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{r.icon}</span>
                            <span className="font-bold text-gray-900 text-sm">{r.name}</span>
                          </div>
                          <span className="text-lg font-bold text-green-600">${r.totalRevenue}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>CPM: ${r.effectiveCpm}</span>
                          <span>CPC: ${r.effectiveCpc}</span>
                          <span>Clicks: {r.clicks.toLocaleString()}</span>
                          <span>CPM Rev: ${r.cpmRevenue}</span>
                          {parseFloat(r.cpcRevenue) > 0 && <span>CPC Rev: ${r.cpcRevenue}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center mb-5">
                    <p className="text-xs text-green-500 uppercase font-bold tracking-wider mb-1">Grand Total Estimated Revenue</p>
                    <p className="text-3xl md:text-4xl font-extrabold text-green-700">${result.grandTotal}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                    <button onClick={copyResult} className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md">
                      <Copy size={15} /> {copied ? "Copied!" : "Copy Result"}
                    </button>
                    <button onClick={handleDownload} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all">
                      <Download size={15} /> Download .txt
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Zap size={20} className="text-amber-500" />, title: "Instant Estimate", desc: "Get ad revenue estimates in milliseconds for all categories." },
              { icon: <BarChart3 size={20} className="text-green-600" />, title: "Category-Wise", desc: "See revenue breakdown for display, native, video, and more." },
              { icon: <Shield size={20} className="text-sky-600" />, title: "100% Free", desc: "No signup, no limits, completely free to use." },
              { icon: <Target size={20} className="text-violet-600" />, title: "CPM + CPC", desc: "Calculate revenue from both CPM and CPC models together." },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Calculate Ad Revenue by Category</h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Enter your impressions", desc: "Type total ad impressions for your page or campaign." },
                { step: "2", title: "Set CPM, CPC, and CTR", desc: "Enter your base CPM, optional CPC, and click-through rate." },
                { step: "3", title: "Select ad categories", desc: "Choose one or more ad formats to compare revenue across types." },
                { step: "4", title: "View category-wise results", desc: "See estimated revenue for each category with a grand total." },
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

          {/* SEO */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Ad Revenue Calculator – Estimate Earnings from All Ad Formats</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">This ad revenue calculator helps publishers, bloggers, and website owners estimate monthly ad income across multiple formats. Unlike basic calculators that only handle CPM, this tool lets you compare revenue from display ads, native ads, video ads, popup ads, interstitial ads, and rich media ads side by side.</p>
            <p className="text-gray-600 leading-relaxed">Each ad category has different typical CPM rates. Video and rich media ads typically earn 2-3x more than standard display ads. Our calculator applies realistic multipliers so you get a meaningful comparison to plan your monetization strategy.</p>
          </section>

          {/* FAQ */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ad Revenue Calculator – FAQs</h2>
            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                { q: "How to calculate ad revenue from impressions?", a: "Divide total impressions by 1000 and multiply by CPM. For example, 100,000 impressions at $5 CPM = $500. Add CPC revenue by multiplying clicks by CPC." },
                { q: "What is a good CPM for display ads?", a: "Display ad CPM typically ranges from $0.50 to $10 depending on niche, geography, and ad format. Finance and tech niches tend to have higher CPMs." },
                { q: "Which ad format pays the most?", a: "Rich media and video ads typically have the highest CPMs, often 2-3x higher than standard display ads. Interstitial ads also perform well." },
                { q: "How does CTR affect ad revenue?", a: "Higher CTR means more clicks, which directly increases CPC-based revenue. Even with a low CPC, a high CTR can significantly boost total earnings." },
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

          {/* Related Tools */}
          <section className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Free Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/adsense-revenue-calculator", title: "AdSense Revenue Calculator", desc: "Calculate Google AdSense earnings by niche category with RPM-based estimation." },
                { to: "/tools/youtube-ad-revenue-calculator", title: "YouTube Ad Revenue Calculator", desc: "Estimate YouTube earnings from views, CPM, and video category." },
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Generate test emails, passwords, names, and user data for development." }
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

export default AdRevenueCalculator;