import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Home, ChevronDown, Download, DollarSign, Play, Zap, Shield, Eye, Clock, CheckCircle2, TrendingUp, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const YoutubeAdRevenueCalculator = () => {
    const [views, setViews] = useState("");
    const [cpm, setCpm] = useState("");
    const [videoLength, setVideoLength] = useState("8");
    const [locationTier, setLocationTier] = useState("tier1");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { id: "gaming", name: "Gaming", icon: "🎮", cpmMult: 1.2 },
        { id: "tech", name: "Technology", icon: "💻", cpmMult: 1.5 },
        { id: "finance", name: "Finance & Investing", icon: "📈", cpmMult: 2.5 },
        { id: "education", name: "Education", icon: "📚", cpmMult: 1.8 },
        { id: "entertainment", name: "Entertainment", icon: "🎬", cpmMult: 0.8 },
        { id: "music", name: "Music", icon: "🎵", cpmMult: 0.5 },
        { id: "vlogs", name: "Vlogs & Lifestyle", icon: "📹", cpmMult: 0.9 },
        { id: "cooking", name: "Cooking & Food", icon: "🍳", cpmMult: 1.1 },
        { id: "fitness", name: "Fitness & Health", icon: "💪", cpmMult: 1.3 },
        { id: "news", name: "News & Politics", icon: "📰", cpmMult: 1.4 },
        { id: "travel", name: "Travel", icon: "✈️", cpmMult: 1.0 },
        { id: "automotive", name: "Automotive", icon: "🚗", cpmMult: 1.6 },
    ];

    const tierMultiplier = { tier1: 1.0, tier2: 0.4, tier3: 0.15 };
    const tierNames = { tier1: "Tier 1 (US, UK, CA, AU)", tier2: "Tier 2 (IN, BR, MX, etc.)", tier3: "Tier 3 (Other countries)" };

    const toggleCategory = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const calculate = () => {
        if (!views || !cpm) {
            setError("Please enter views and CPM");
            return;
        }
        if (selectedCategories.length === 0) {
            setError("Please select at least one video category");
            return;
        }

        const totalViews = parseFloat(views);
        const baseCpm = parseFloat(cpm);
        const length = parseFloat(videoLength) || 8;
        const hasMidroll = length >= 8;
        const midrollBonus = hasMidroll ? 1.5 : 1.0;
        const locationMult = tierMultiplier[locationTier];
        const monetizedViews = totalViews * 0.55; // ~55% monetized views

        const results = selectedCategories.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            const effectiveCpm = baseCpm * cat.cpmMult * locationMult * midrollBonus;
            const monthlyRevenue = (monetizedViews / 1000) * effectiveCpm;
            const yearlyRevenue = monthlyRevenue * 12;
            const perViewEarning = monthlyRevenue / monetizedViews;
            return {
                ...cat,
                effectiveCpm: effectiveCpm.toFixed(2),
                monetizedViews: Math.round(monetizedViews),
                monthlyRevenue: monthlyRevenue.toFixed(2),
                yearlyRevenue: yearlyRevenue.toFixed(2),
                perViewEarning: perViewEarning.toFixed(5),
                hasMidroll,
            };
        });

        const grandMonthly = results.reduce((s, r) => s + parseFloat(r.monthlyRevenue), 0);
        const grandYearly = grandMonthly * 12;

        setError("");
        setResult({ results, grandMonthly: grandMonthly.toFixed(2), grandYearly: grandYearly.toFixed(2), monetizedViews: Math.round(monetizedViews) });
    };

    const copyResult = () => {
        if (!result) return;
        const text = result.results.map((r) => `${r.name}: $${r.monthlyRevenue}/mo (CPM: $${r.effectiveCpm})`).join("\n");
        navigator.clipboard.writeText(`YouTube Ad Revenue Estimate\nMonetized Views: ${result.monetizedViews.toLocaleString()}\n\n${text}\n\nTotal Monthly: $${result.grandMonthly}\nTotal Yearly: $${result.grandYearly}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!result) return;
        const text = result.results.map((r) => `${r.name}: $${r.monthlyRevenue}/mo | Yearly: $${r.yearlyRevenue} | CPM: $${r.effectiveCpm} | Per View: $${r.perViewEarning}`).join("\n");
        const file = new Blob([`YouTube Ad Revenue Calculation\nMonetized Views: ${result.monetizedViews.toLocaleString()}\n\n${text}\n\nTotal Monthly: $${result.grandMonthly}\nTotal Yearly: $${result.grandYearly}`], { type: "text/plain" });
        const el = document.createElement("a");
        el.href = URL.createObjectURL(file);
        el.download = "youtube-ad-revenue-calculation.txt";
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    };

    const reset = () => {
        setViews("");
        setCpm("");
        setVideoLength("8");
        setLocationTier("tier1");
        setSelectedCategories([]);
        setResult(null);
        setError("");
        setCopied(false);
    };

    const schemaWebApp = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "YouTube Ad Revenue Calculator – Estimate YouTube Earnings by Category",
        "url": "https://www.generatorpromptai.com/tools/youtube-ad-revenue-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "description": "Free YouTube ad revenue calculator. Estimate YouTube earnings from views, CPM, video category, length, and audience location tier.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
    };

    const schemaFaq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How much does YouTube pay per 1000 views?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "YouTube typically pays $3-15 per 1000 monetized views depending on niche, audience location, and video length. Finance niches can earn $15-30 per 1000 views."
                }
            },
            {
                "@type": "Question",
                "name": "What is a good YouTube CPM?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A good YouTube CPM ranges from $5-20. Finance and education niches have higher CPMs ($10-30), while entertainment and music have lower CPMs ($1-5)."
                }
            },
            {
                "@type": "Question",
                "name": "Does video length affect YouTube revenue?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Videos over 8 minutes can include mid-roll ads, which typically increase revenue by 50-100% compared to pre-roll only videos."
                }
            },
            {
                "@type": "Question",
                "name": "How does audience location affect YouTube CPM?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tier 1 countries (US, UK, Canada, Australia) have the highest CPMs. Tier 2 (India, Brazil) are lower, and Tier 3 countries have the lowest CPMs."
                }
            },
            {
                "@type": "Question",
                "name": "What percentage of YouTube views are monetized?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Typically around 40-60% of YouTube views are monetized due to ad blockers, YouTube Premium, and skipped ads. This calculator uses 55% as default."
                }
            }
        ]
    };

    return (
        <>
            <Helmet>
                <title>YouTube Ad Revenue Calculator – Estimate YouTube Earnings by Category</title>
                <meta name="description" content="Free YouTube ad revenue calculator. Estimate YouTube earnings from views, CPM, video category, video length, and audience location tier. Compare revenue across 12+ categories." />
                <meta name="keywords" content="youtube ad revenue calculator, how much does youtube pay per 1000 views, youtube cpm calculator by category, estimate youtube earnings by niche, youtube money calculator for gaming channel, youtube revenue for finance videos, youtube ad income estimator by video length, how to calculate youtube ad revenue from views, youtube cpm by country tier, free youtube earnings calculator online" />
                <link rel="canonical" href="https://www.generatorpromptai.com/tools/youtube-ad-revenue-calculator" />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="GeneratorPromptAI" />
                <meta property="og:title" content="YouTube Ad Revenue Calculator – Estimate YouTube Earnings by Category" />
                <meta property="og:description" content="Estimate YouTube monthly and yearly ad revenue by video category, length, and audience location." />
                <meta property="og:url" content="https://www.generatorpromptai.com/tools/youtube-ad-revenue-calculator" />
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
                        <span className="text-gray-900 font-semibold">YouTube Ad Revenue Calculator</span>
                    </nav>
                </div>

                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10 mt-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
                            <Play className="text-sky-600" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
                            YouTube Ad Revenue Calculator – <span className="text-sky-600">Earnings by Category</span>
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                            Estimate YouTube ad income by video category, CPM, video length, and audience location tier.
                        </p>
                    </div>

                    {/* Tool Card */}
                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 md:p-10 mb-8">
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Views</label>
                                    <div className="relative">
                                        <Eye size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="number" placeholder="e.g. 500000" value={views} onChange={(e) => setViews(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base CPM ($)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="number" step="0.01" placeholder="e.g. 7.00" value={cpm} onChange={(e) => setCpm(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Avg Video Length (min)</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="number" min="1" max="120" placeholder="e.g. 10" value={videoLength} onChange={(e) => setVideoLength(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 placeholder:text-gray-400" />
                                    </div>
                                    {parseFloat(videoLength) >= 8 && (
                                        <p className="text-xs text-green-600 mt-1 font-medium">✓ Mid-roll ads eligible (8+ min videos earn ~50% more)</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Audience Location</label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select value={locationTier} onChange={(e) => setLocationTier(e.target.value)} className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-gray-50 appearance-none">
                                            <option value="tier1">Tier 1 (US, UK, CA, AU)</option>
                                            <option value="tier2">Tier 2 (IN, BR, MX, etc.)</option>
                                            <option value="tier3">Tier 3 (Other countries)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Video Categories</label>
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
                                        <span className="text-[10px] text-gray-400 block mt-0.5">{cat.cpmMult}x CPM</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3"><p className="text-red-600 text-sm font-medium">{error}</p></div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <button onClick={calculate} disabled={!views || !cpm || selectedCategories.length === 0} className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5">
                                <TrendingUp size={18} /> Calculate YouTube Revenue
                            </button>
                            <button onClick={reset} className="bg-white border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5">
                                <RefreshCw size={18} /> Reset
                            </button>
                        </div>

                        {result && (
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                <div className="bg-sky-50 border-b border-sky-100 px-5 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-sky-600" />
                                        <span className="text-sm font-bold text-sky-700">YouTube Earnings by Category</span>
                                    </div>
                                    <span className="text-xs text-sky-500">{result.monetizedViews.toLocaleString()} monetized views (55%)</span>
                                </div>
                                <div className="p-5">
                                    <div className="space-y-3 mb-5">
                                        {result.results.map((r) => (
                                            <div key={r.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{r.icon}</span>
                                                        <span className="font-bold text-gray-900 text-sm">{r.name}</span>
                                                        {r.hasMidroll && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">+Mid-roll</span>}
                                                    </div>
                                                    <span className="text-lg font-bold text-green-600">${r.monthlyRevenue}/mo</span>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                    <span>CPM: ${r.effectiveCpm}</span>
                                                    <span>Yearly: ${r.yearlyRevenue}</span>
                                                    <span>Per View: ${r.perViewEarning}</span>
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
                            { icon: <Zap size={20} className="text-amber-500" />, title: "12+ Categories", desc: "Compare YouTube earnings across gaming, tech, finance, and more." },
                            { icon: <Globe size={20} className="text-green-600" />, title: "Location Tiers", desc: "Adjusts CPM for Tier 1, 2, and 3 audience countries." },
                            { icon: <Clock size={20} className="text-sky-600" />, title: "Mid-Roll Detection", desc: "Auto-detects 8+ min videos and applies mid-roll bonus." },
                            { icon: <Shield size={20} className="text-violet-600" />, title: "100% Free", desc: "No signup, no limits, completely free to use." },
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Calculate YouTube Ad Revenue by Category</h2>
                        <ol className="space-y-4">
                            {[
                                { step: "1", title: "Enter monthly views", desc: "Type your channel's total monthly view count." },
                                { step: "2", title: "Set base CPM", desc: "Enter your average CPM or use a typical $7-10 for most channels." },
                                { step: "3", title: "Set video length & location", desc: "Video length determines mid-roll eligibility. Location tier adjusts CPM." },
                                { step: "4", title: "Select categories & compare", desc: "Choose video niches to see estimated revenue for each side by side." },
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Free YouTube Ad Revenue Calculator – Estimate Channel Earnings by Niche</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">This YouTube ad revenue calculator helps creators estimate monthly and yearly income from YouTube ads based on views, CPM, video category, length, and audience geography. It accounts for the fact that only ~55% of views are typically monetized due to ad blockers and YouTube Premium.</p>
                        <p className="text-gray-600 leading-relaxed">Finance and investing channels typically earn the highest CPMs ($15-30), while music and entertainment channels have lower CPMs ($1-5) but can compensate with high view volumes. Videos over 8 minutes unlock mid-roll ads which can increase revenue by 50-100%. Our calculator factors in all these variables automatically.</p>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">YouTube Ad Revenue Calculator – FAQs</h2>
                        <div className="space-y-3 max-w-4xl mx-auto">
                            {[
                                { q: "How much does YouTube pay per 1000 views?", a: "YouTube typically pays $3-15 per 1000 monetized views depending on niche, audience location, and video length. Finance niches can earn $15-30 per 1000 views." },
                                { q: "What is a good YouTube CPM?", a: "A good YouTube CPM ranges from $5-20. Finance and education niches have higher CPMs ($10-30), while entertainment and music have lower CPMs ($1-5)." },
                                { q: "Does video length affect YouTube revenue?", a: "Yes. Videos over 8 minutes can include mid-roll ads, which typically increase revenue by 50-100% compared to pre-roll only videos." },
                                { q: "How does audience location affect YouTube CPM?", a: "Tier 1 countries (US, UK, Canada, Australia) have the highest CPMs. Tier 2 (India, Brazil) are lower, and Tier 3 countries have the lowest CPMs." },
                                { q: "What percentage of YouTube views are monetized?", a: "Typically around 40-60% of YouTube views are monetized due to ad blockers, YouTube Premium, and skipped ads. This calculator uses 55% as default." },
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
                                { to: "/tools/adsense-revenue-calculator", title: "AdSense Revenue Calculator", desc: "Calculate Google AdSense earnings by niche category with RPM-based estimation." },
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

export default YoutubeAdRevenueCalculator;