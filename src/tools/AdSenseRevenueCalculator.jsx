import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Home, ChevronDown, Download, DollarSign, LayoutGrid, Zap, Shield, Eye, Layers, CheckCircle2, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdSenseRevenueCalculator = () => {
  const [pageViews, setPageViews] = useState("");
  const [adUnits, setAdUnits] = useState("3");
  const [customRpm, setCustomRpm] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: "tech", name: "Technology", icon: "💻", rpm: 4.50 },
    { id: "finance", name: "Finance & Insurance", icon: "🏦", rpm: 12.00 },
    { id: "health", name: "Health & Medical", icon: "🏥", rpm: 8.50 },
    { id: "legal", name: "Legal", icon: "⚖️", rpm: 15.00 },
    { id: "realestate", name: "Real Estate", icon: "🏠", rpm: 10.00 },
    { id: "education", name: "Education", icon: "📚", rpm: 5.00 },
    { id: "entertainment", name: "Entertainment", icon: "🎬", rpm: 2.00 },
    { id: "food", name: "Food & Recipes", icon: "🍕", rpm: 3.50 },
    { id: "travel", name: "Travel", icon: "✈️", rpm: 6.00 },
    { id: "sports", name: "Sports & Fitness", icon: "⚽", rpm: 3.00 },
    { id: "automotive", name: "Automotive", icon: "🚗", rpm: 7.00 },
    { id: "shopping", name: "Shopping & Deals", icon: "🛒", rpm: 5.50 },
  ];

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const calculate = () => {
    if (!pageViews) {
      setError("Please enter monthly page views");
      return;
    }
    if (selectedCategories.length === 0) {
      setError("Please select at least one niche category");
      return;
    }

    const views = parseFloat(pageViews);
    const units = parseInt(adUnits) || 3;
    const results = selectedCategories.map((catId) => {
      const cat = categories.find((c) => c.id === catId);
      const rpm = useCustom ? (parseFloat(customRpm) || 0) : cat.rpm;
      const monthlyRevenue = (views / 1000) * rpm;
      const dailyRevenue = monthlyRevenue / 30;
      const yearlyRevenue = monthlyRevenue * 12;
      const perPageRevenue = monthlyRevenue / views;
      return {
        ...cat,
        usedRpm: rpm.toFixed(2),
        monthlyRevenue: monthlyRevenue.toFixed(2),
        dailyRevenue: dailyRevenue.toFixed(2),
        yearlyRevenue: yearlyRevenue.toFixed(2),
        perPageRevenue: perPageRevenue.toFixed(4),
        adUnits: units,
      };
    });

    const grandMonthly = results.reduce((s, r) => s + parseFloat(r.monthlyRevenue), 0);
    const grandYearly = grandMonthly * 12;

    setError("");
    setResult({ results, grandMonthly: grandMonthly.toFixed(2), grandYearly: grandYearly.toFixed(2) });
  };

  const copyResult = () => {
    if (!result) return;
    const text = result.results.map((r) => `${r.name}: $${r.monthlyRevenue}/mo (RPM: $${r.usedRpm})`).join("\n");
    navigator.clipboard.writeText(`AdSense Revenue Estimate\n\n${text}\n\nTotal Monthly: $${result.grandMonthly}\nTotal Yearly: $${result.grandYearly}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = result.results.map((r) => `${r.name}: $${r.monthlyRevenue}/mo | Daily: $${r.dailyRevenue} | Yearly: $${r.yearlyRevenue} | RPM: $${r.usedRpm}`).join("\n");
    const file = new Blob([`AdSense Revenue Calculation\n\n${text}\n\nTotal Monthly: $${result.grandMonthly}\nTotal Yearly: $${result.grandYearly}`], { type: "text/plain" });
    const el = document.createElement("a");
    el.href = URL.createObjectURL(file);
    el.download = "adsense-revenue-calculation.txt";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const reset = () => {
    setPageViews("");
    setAdUnits("3");
    setCustomRpm("");
    setUseCustom(false);
    setSelectedCategories([]);
    setResult(null);
    setError("");
    setCopied(false);
  };

  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AdSense Revenue Calculator – Calculate Google AdSense Earnings by Niche",
    "url": "https://www.generatorpromptai.com/tools/adsense-revenue-calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "description": "Free Google AdSense revenue calculator. Estimate monthly and yearly earnings by niche category including technology, finance, health, legal, and more.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How to calculate Google AdSense revenue?", "acceptedAnswer": { "@type": "Answer", "text": "Multiply your monthly page views by your page RPM and divide by 1000. For example, 100,000 page views at $5 RPM = $500/month." } },
      { "@type": "Question", "name": "What is a good AdSense RPM?", "acceptedAnswer": { "@type": "Answer", "text": "AdSense RPM varies by niche. Finance and legal niches can see $10-25 RPM, while entertainment might be $1-3 RPM. The average across all niches is around $3-5." } },
      { "@type": "Question", "name": "Which niche pays the most for AdSense?", "acceptedAnswer": { "@type": "Answer", "text": "Legal, finance, insurance, and real estate typically have the highest AdSense RPMs due to high advertiser competition and CPC." } },
      { "@type": "Question", "name": "How much does AdSense pay per 1000 page views?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on niche and traffic source. On average, AdSense pays $2-10 per 1000 page views. High-value niches like finance can pay $15-25 per 1000 views." } }
    ]
  };

  return (
    <>
      <Helmet>
        <title>AdSense Revenue Calculator – Calculate Google AdSense Earnings by Niche</title>
        <meta name="description" content="Free Google AdSense revenue calculator. Estimate monthly and yearly AdSense earnings by niche category including technology, finance, health, legal, and more with realistic RPM data." />
        <meta name="keywords" content="adsense revenue calculator, google adsense earnings calculator by niche, how much does adsense pay per 1000 page views, adsense rpm calculator by category, estimate adsense income for technology blog, adsense revenue for finance niche, best adsense niches by rpm, google adsense monthly income estimator, adsense revenue per page view calculator, free adsense earnings calculator online" />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/adsense-revenue-calculator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="AdSense Revenue Calculator – Calculate Google AdSense Earnings by Niche" />
        <meta property="og:description" content="Estimate Google AdSense monthly and yearly earnings by niche category with realistic RPM data." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/adsense-revenue-calculator" />
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
            <span className="text-gray-900 font-semibold">AdSense Revenue Calculator</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
              <LayoutGrid className="text-sky-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
              AdSense Revenue Calculator – <span className="text-sky-600">Earnings by Niche</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Estimate Google AdSense monthly and yearly income by niche category using realistic RPM data for 12+ niches.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10 mb-8">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Page Views</label>
                <div className="relative">
                  <Eye size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" placeholder="e.g. 100000" value={pageViews} onChange={(e) => setPageViews(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ad Units Per Page</label>
                  <div className="relative">
                    <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" min="1" max="10" placeholder="e.g. 3" value={adUnits} onChange={(e) => setAdUnits(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Use Custom RPM?</label>
                  <div className="flex items-center gap-3 h-[50px]">
                    <button onClick={() => setUseCustom(!useCustom)} className={`relative w-12 h-7 rounded-full transition-colors ${useCustom ? "bg-sky-600" : "bg-gray-300"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${useCustom ? "translate-x-5" : ""}`} />
                    </button>
                    <span className="text-sm text-gray-600">{useCustom ? "Yes – using custom RPM" : "No – using niche default RPM"}</span>
                  </div>
                </div>
              </div>
              {useCustom && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Custom RPM ($)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" step="0.01" placeholder="e.g. 5.00" value={customRpm} onChange={(e) => setCustomRpm(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Niche Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all text-sm ${selectedCategories.includes(cat.id)
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50/50"
                      }`}
                  >
                    <span className="text-base block mb-0.5">{cat.icon}</span>
                    <span className="font-medium text-xs leading-tight block">{cat.name}</span>
                    {!useCustom && <span className="text-[10px] text-gray-400 block mt-0.5">~${cat.rpm} RPM</span>}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-red-600 text-sm font-medium">{error}</p></div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button onClick={calculate} disabled={!pageViews || selectedCategories.length === 0} className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5">
                <TrendingUp size={18} /> Calculate AdSense Revenue
              </button>
              <button onClick={reset} className="bg-white border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5">
                <RefreshCw size={18} /> Reset
              </button>
            </div>

            {result && (
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-sky-50 border-b border-sky-100 px-5 py-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-sky-600" />
                  <span className="text-sm font-bold text-sky-700">AdSense Earnings by Niche</span>
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
                          <span className="text-lg font-bold text-green-600">${r.monthlyRevenue}/mo</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>RPM: ${r.usedRpm}</span>
                          <span>Daily: ${r.dailyRevenue}</span>
                          <span>Yearly: ${r.yearlyRevenue}</span>
                          <span>Per Page: ${r.perPageRevenue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                      <p className="text-xs text-green-500 uppercase font-bold tracking-wider mb-1">Total Monthly</p>
                      <p className="text-2xl md:text-3xl font-extrabold text-green-700">${result.grandMonthly}</p>
                    </div>
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 text-center">
                      <p className="text-xs text-sky-500 uppercase font-bold tracking-wider mb-1">Total Yearly</p>
                      <p className="text-2xl md:text-3xl font-extrabold text-sky-700">${result.grandYearly}</p>
                    </div>
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
              { icon: <Zap size={20} className="text-amber-500" />, title: "12+ Niches", desc: "Pre-loaded RPM data for technology, finance, health, legal, and more." },
              { icon: <TrendingUp size={20} className="text-green-600" />, title: "Daily/Monthly/Yearly", desc: "See earnings breakdown across daily, monthly, and yearly timeframes." },
              { icon: <Shield size={20} className="text-sky-600" />, title: "100% Free", desc: "No signup, no limits, completely free to use forever." },
              { icon: <Layers size={20} className="text-violet-600" />, title: "Custom RPM", desc: "Toggle custom RPM mode to use your own actual AdSense data." },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Calculate Google AdSense Revenue by Niche</h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Enter monthly page views", desc: "Type your website's total monthly page views." },
                { step: "2", title: "Set ad units per page", desc: "Enter how many AdSense ad units you show per page (default 3)." },
                { step: "3", title: "Select niche categories", desc: "Choose one or more niches — each has realistic default RPM data." },
                { step: "4", title: "Compare earnings", desc: "See monthly, yearly, and per-page revenue for each niche side by side." },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Google AdSense Revenue Calculator – Estimate Earnings by Niche Category</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">This AdSense revenue calculator helps website owners and bloggers estimate Google AdSense income across 12+ niche categories. Each niche uses realistic average RPM data based on industry benchmarks, so you can compare potential earnings before choosing a niche or planning content strategy.</p>
            <p className="text-gray-600 leading-relaxed">Finance, legal, and real estate niches consistently show the highest AdSense RPMs ($10-25) due to high advertiser competition. Entertainment and sports tend to have lower RPMs ($1-5) but can compensate with high traffic volumes. Our calculator shows all this data side by side for easy comparison.</p>
          </section>

          {/* FAQ */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">AdSense Revenue Calculator – FAQs</h2>
            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                { q: "How to calculate Google AdSense revenue?", a: "Multiply your monthly page views by your page RPM and divide by 1000. For example, 100,000 page views at $5 RPM = $500/month." },
                { q: "What is a good AdSense RPM?", a: "AdSense RPM varies by niche. Finance and legal niches can see $10-25 RPM, while entertainment might be $1-3 RPM. The average across all niches is around $3-5." },
                { q: "Which niche pays the most for AdSense?", a: "Legal, finance, insurance, and real estate typically have the highest AdSense RPMs due to high advertiser competition and CPC." },
                { q: "How much does AdSense pay per 1000 page views?", a: "It depends on niche and traffic source. On average, AdSense pays $2-10 per 1000 page views. High-value niches like finance can pay $15-25 per 1000 views." },
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
                { to: "/tools/ad-revenue-calculator", title: "Ad Revenue Calculator", desc: "Calculate ad revenue from display, native, video, and other ad formats." },
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

export default AdSenseRevenueCalculator;