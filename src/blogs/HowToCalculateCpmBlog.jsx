import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Eye,
  ChevronRight,
  ChevronDown,
  FileText,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Zap,
  Code,
  DollarSign,
  BarChart3,
  TrendingDown,
  Calculator,
  Target,
  MousePointerClick,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── POST DATA ────────────────────────────────────────────────────────────────
const post = {
  id: 11,
  slug: "how-to-calculate-cpm",
  title: "How to Calculate CPM: Step-by-Step Formula, Examples & Benchmarks",
  excerpt:
    "Learn the exact CPM formula, follow a step-by-step calculation tutorial, see real-world ad campaign examples, and check 2025 CPM benchmarks by platform.",
  category: "Digital Marketing",
  tag: "Ad Calculators",
  readTime: 8,
  date: "January 15, 2025",
  dateISO: "2025-01-15",
  featured: false,
  image: null,
  color: "from-sky-500 to-blue-600",
  emoji: "📊",
  views: "12.8K",
};

// ─── SEO SCHEMAS ──────────────────────────────────────────────────────────────
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: "Learn exactly how to calculate CPM for your digital ad campaigns. Includes the CPM formula, real-world examples, industry benchmarks for 2025, and tips to lower your CPM.",
  image: "https://www.generatorpromptai.com/og-cpm-calculator.png",
  datePublished: post.dateISO,
  dateModified: "2025-06-20",
  author: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  publisher: {
    "@type": "Organization",
    name: "GeneratorPromptAI",
    logo: { "@type": "ImageObject", url: "https://www.generatorpromptai.com/logo.png" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.generatorpromptai.com/blog/${post.slug}` },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the formula to calculate CPM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The formula to calculate CPM is: CPM = (Total Campaign Cost / Total Impressions) x 1,000. For example, if you spend $500 and get 100,000 impressions, your CPM is ($500 / 100,000) x 1,000 = $5.00.",
      },
    },
    {
      "@type": "Question",
      name: "What does CPM stand for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPM stands for Cost Per Mille. 'Mille' is the Latin word for thousand. In digital advertising, it represents the cost an advertiser pays for 1,000 impressions of their ad.",
      },
    },
    {
      "@type": "Question",
      name: "Is a $5 CPM good?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, a $5 CPM is generally considered good for most digital advertising campaigns. It sits right in the middle of average display ad CPMs ($2-$5). However, 'good' depends on your industry — B2B tech might see $15 CPMs, while entertainment might see $1 CPMs.",
      },
    },
    {
      "@type": "Question",
      name: "How do I calculate CPM from CPC and CTR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To calculate CPM from CPC and CTR, use the formula: CPM = CPC x CTR x 1,000. For example, if your CPC is $2.00 and your CTR is 2% (0.02), your CPM is 2.00 x 0.02 x 1,000 = $40.00.",
      },
    },
    {
      "@type": "Question",
      name: "What is a good CPM for Facebook ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A good CPM for Facebook and Instagram ads in 2025 ranges from $5 to $12. During Q4 (holiday season), CPMs can spike to $15-$20 due to heavy competition. B2B niches tend to have higher CPMs than B2C.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my CPM so high?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "High CPM is usually caused by: narrow audience targeting (less inventory = higher prices), low ad relevance scores, seasonal competition (Q4 is always expensive), expensive geographies (US/UK cost more), or ad fatigue from not rotating creatives.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.generatorpromptai.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.generatorpromptai.com/blog" },
    { "@type": "ListItem", position: 3, name: "CPM Calculation Guide", item: `https://www.generatorpromptai.com/blog/${post.slug}` },
  ],
};

// ─── TOC ──────────────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "what-is-cpm", label: "What is CPM (Cost Per Mille)?" },
  { id: "cpm-formula", label: "The CPM Formula Explained" },
  { id: "step-by-step", label: "How to Calculate CPM Step-by-Step" },
  { id: "real-example", label: "Real-World Calculation Example" },
  { id: "from-cpc-ctr", label: "Calculating CPM from CPC & CTR" },
  { id: "good-cpm", label: "What is a Good CPM in 2025?" },
  { id: "cpm-vs-cpc", label: "CPM vs. CPC vs. CPA" },
  { id: "lower-cpm", label: "How to Lower Your CPM" },
  { id: "common-mistakes", label: "Common CPM Mistakes" },
  { id: "faq", label: "FAQs" },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <details open={open} onToggle={(e) => setOpen(e.target.open)} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <summary className="px-5 py-4 cursor-pointer font-semibold text-gray-900 text-sm flex items-center justify-between hover:bg-gray-50 transition list-none">
        {question}
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${open ? "rotate-180" : ""}`} />
      </summary>
      <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{answer}</div>
    </details>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const BlogPostHowToCalculateCpm = () => {
  const [activeTOC, setActiveTOC] = useState("");
  const [copiedFormula, setCopiedFormula] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headings = TOC_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
      let current = "";
      headings.forEach((h) => { if (window.scrollY >= h.offsetTop - 120) current = h.id; });
      setActiveTOC(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyFormula = () => {
    navigator.clipboard.writeText("CPM = (Total Cost ÷ Total Impressions) × 1,000");
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const relatedPosts = [
    { id: 9, slug: "how-to-generate-lorem-ipsum-text-custom-length", title: "How to Generate Lorem Ipsum Text of Any Length (2026 Guide)", category: "Web Tips", color: "from-violet-500 to-purple-600", emoji: "📝", readTime: 5, date: "April 18, 2026" },
    { id: 10, slug: "how-to-convert-pdf-to-word-without-formatting-loss", title: "How to Convert PDF to Word Without Losing Formatting", category: "Web Tips", color: "from-red-500 to-rose-600", emoji: "📄", readTime: 8, date: "April 16, 2026" },
  ];

  return (
    <>
      <Helmet>
        <title>How to Calculate CPM: Step-by-Step Formula, Examples & Benchmarks | GeneratorPromptAI</title>
        <meta name="description" content="Learn how to calculate CPM (Cost Per 1000 Impressions) with the simple formula. Step-by-step tutorial with real-world examples, industry benchmarks, and tips to lower your CPM." />
        <meta name="keywords" content="how to calculate cpm, cpm formula, cost per mille formula, calculate cpm from cost and impressions, what is cpm in digital marketing, how to calculate cost per 1000 impressions, cpm calculation example, how to find cpm, calculate cpm for facebook ads, calculate cpm for google ads" />
        <link rel="canonical" href={`https://www.generatorpromptai.com/blog/${post.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="How to Calculate CPM: Step-by-Step Formula & Examples" />
        <meta property="og:description" content="Master the CPM formula. Learn to calculate cost per 1000 impressions for Google, Facebook, and display ads with real examples." />
        <meta property="og:url" content={`https://www.generatorpromptai.com/blog/${post.slug}`} />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-cpm-calculator.png" />
        <meta property="article:published_time" content={post.dateISO} />
        <meta property="article:modified_time" content="2025-06-20" />
        <meta property="article:section" content="Digital Marketing" />
        <meta property="article:tag" content="Ad Calculators" />
        <meta property="article:tag" content="CPM" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Calculate CPM: Formula & Examples" />
        <meta name="twitter:description" content="Free step-by-step guide to calculating CPM for your ad campaigns." />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* ── Navbar ── */}
        <Navbar />

        {/* ── Breadcrumb ── */}
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-sky-600 transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 truncate max-w-[150px] inline-block align-bottom">CPM Calculation Guide</span>
          </nav>
        </div>

        {/* ── Layout ── */}
        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-10">

          {/* ── TOC (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">On this page</p>
              <div className="flex flex-col gap-0.5">
                {TOC_ITEMS.map((item) => (
                  <a key={item.id} href={`#${item.id}`}
                    className={`text-sm py-1.5 px-3 rounded-r-lg transition-all border-l-2 ${activeTOC === item.id ? "border-l-sky-600 text-sky-600 bg-sky-50 font-medium" : "border-l-transparent text-gray-500 hover:text-sky-600 hover:bg-gray-50"}`}
                  >{item.label}</a>
                ))}
              </div>
              <div className="mt-6 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white">
                <p className="text-sm font-bold mb-1">CPM Calculator</p>
                <p className="text-xs text-sky-100 mb-3">Calculate CPM, cost, or impressions instantly — free.</p>
                <Link to="/tools/cpm-calculator" className="block text-center py-2 bg-white text-sky-700 text-xs font-semibold rounded-lg hover:bg-sky-50 transition-colors">Calculate Now →</Link>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Related Tools</p>
                <Link to="/tools/cpc-calculator" className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition-colors py-1"><MousePointerClick size={14} /> CPC Calculator</Link>
                <Link to="/tools/ad-revenue-calculator" className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition-colors py-1"><BarChart3 size={14} /> Ad Revenue Calculator</Link>
                <Link to="/tools/percentage-calculator" className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition-colors py-1"><Target size={14} /> Percentage Calculator</Link>
              </div>
            </div>
          </aside>

          {/* ── Article ── */}
          <article className="flex-1 max-w-3xl">

            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-semibold text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full">{post.category}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">#{post.tag}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                How to Calculate CPM:{" "}
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">The Complete Formula Guide</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-5">{post.excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 border-t border-gray-100 pt-4">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime} min read</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views} views</span>
              </div>
            </header>

            {/* Hero */}
            <div className={`bg-gradient-to-br ${post.color} rounded-2xl h-56 sm:h-64 md:h-80 flex items-center justify-center mb-10`}>
              <span className="text-7xl sm:text-8xl md:text-9xl">{post.emoji}</span>
            </div>

            {/* ═══════════════ CONTENT ═══════════════ */}
            <div className="text-gray-600 leading-relaxed space-y-6">

              <p className="text-lg">
                Last month I sat through a marketing meeting where a media buyer couldn't explain what CPM actually meant — they just kept saying "it's what we pay per thousand." When the CFO asked for the formula, the room went silent. That shouldn't happen. CPM is one of the simplest calculations in advertising, and if you work in digital marketing, you should be able to do it on a napkin.
              </p>

              <p>
                This guide covers exactly how to calculate CPM, with the formula, a step-by-step walkthrough, real campaign examples, benchmarks by platform, and the common mistakes that make your CPM look worse than it actually is.
              </p>

              {/* ── Inline CTA ── */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-5 sm:p-6 my-8">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Calculator size={28} className="text-sky-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-gray-900 mb-0.5">Don't want to calculate manually?</p>
                    <p className="text-sm text-gray-500">Our free CPM calculator does it instantly — plus cost and impressions.</p>
                  </div>
                  <Link to="/tools/cpm-calculator" className="flex-shrink-0 px-6 py-3 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                    Calculate Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* ── What Is CPM ── */}
              <h2 id="what-is-cpm" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                What is CPM (Cost Per Mille)?
              </h2>

              <p>
                <strong>CPM stands for Cost Per Mille</strong> — "Mille" being the Latin word for thousand. In digital advertising, CPM represents the cost an advertiser pays for <strong>1,000 impressions</strong> (views) of their advertisement.
              </p>

              <p>
                Unlike CPC (Cost Per Click), where you only pay when someone interacts with your ad, <strong>CPM pricing means you pay for visibility</strong>. Whether the user clicks the ad or scrolls past it, you are paying simply for the ad to appear on their screen. This makes CPM the standard metric for brand awareness campaigns, display advertising, and video ads (like YouTube pre-rolls).
              </p>

              <div className="bg-white border border-gray-200 rounded-xl p-5 my-6">
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-3">The key distinction</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-sky-50 rounded-lg p-4">
                    <p className="font-semibold text-sky-800 text-sm mb-1">CPM (You Pay For Views)</p>
                    <p className="text-sm text-gray-500">100,000 people see your ad → you pay based on that number, regardless of clicks.</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="font-semibold text-green-800 text-sm mb-1">CPC (You Pay For Clicks)</p>
                    <p className="text-sm text-gray-500">100,000 people see your ad, but only 500 click → you only pay for those 500 clicks.</p>
                  </div>
                </div>
              </div>

              {/* ── Formula ── */}
              <h2 id="cpm-formula" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                The CPM Formula Explained
              </h2>

              <p className="mb-5">
                The formula to calculate CPM from cost and impressions is straightforward. You divide the total cost of your campaign by the total number of impressions, and then multiply by 1,000.
              </p>

              <div className="bg-gray-900 text-green-400 rounded-2xl p-6 mb-5 font-mono text-center text-lg md:text-xl font-bold tracking-wide relative">
                CPM = (Total Cost ÷ Total Impressions) × 1,000
                <button onClick={handleCopyFormula} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors" title="Copy formula">
                  {copiedFormula ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              <p className="mb-4"><strong>Where:</strong></p>
              <ul className="space-y-2 text-gray-600 pl-6 list-disc mb-4">
                <li><strong>Total Cost:</strong> The total amount you spent on the ad campaign (e.g., $500)</li>
                <li><strong>Total Impressions:</strong> The total number of times your ad was displayed (e.g., 100,000)</li>
                <li><strong>1,000:</strong> The multiplier used because CPM stands for "Cost Per <em>Thousand</em>"</li>
              </ul>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-sky-800 mb-1">Bonus formula: CPM from CPC and CTR</p>
                  <p className="text-sm text-sky-700 font-mono">CPM = CPC × CTR × 1,000</p>
                  <p className="text-xs text-sky-600 mt-1">If your CPC is $2.00 and CTR is 2%, your CPM = 2.00 × 0.02 × 1,000 = $40.00</p>
                </div>
              </div>

              {/* ── Step by Step ── */}
              <h2 id="step-by-step" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                How to Calculate CPM Step-by-Step
              </h2>

              <p className="mb-6">
                To manually calculate your CPM, you only need two data points from your ad dashboard (like Google Ads or Meta Ads Manager): your total spend and your total impressions.
              </p>

              <div className="space-y-6">
                {[
                  { step: "1", title: "Find Your Total Campaign Cost", text: "Log into your ad platform (Google Ads, Facebook Ads Manager, etc.) and look at the total spend for your campaign. Let's say you spent $500.00 over the last 30 days." },
                  { step: "2", title: "Find Your Total Impressions", text: "In the same dashboard, find the \"Impressions\" metric. This is the number of times your ad was shown to users. Let's say your ad received 100,000 impressions." },
                  { step: "3", title: "Divide Cost by Impressions", text: "Calculate: $500 ÷ 100,000 = 0.005. This is your cost per single impression." },
                  { step: "4", title: "Multiply by 1,000", text: "Calculate: 0.005 × 1,000 = $5.00. Your CPM is $5.00 — meaning you pay $5 for every 1,000 times your ad is shown." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold">{item.step}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Real Example ── */}
              <h2 id="real-example" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                Real-World CPM Calculation Example
              </h2>

              <p className="mb-4">
                Let's look at a comparison of CPM across two different ad campaigns to understand how it affects your budget and strategy.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden mb-4">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-bold">Metric</th>
                      <th className="px-4 py-3 font-bold">Campaign A (Display)</th>
                      <th className="px-4 py-3 font-bold">Campaign B (Search)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="text-gray-600"><td className="px-4 py-3 font-medium">Total Cost</td><td className="px-4 py-3">$1,000</td><td className="px-4 py-3">$1,000</td></tr>
                    <tr className="text-gray-600"><td className="px-4 py-3 font-medium">Total Impressions</td><td className="px-4 py-3">500,000</td><td className="px-4 py-3">50,000</td></tr>
                    <tr className="bg-sky-50 font-bold text-sky-700"><td className="px-4 py-3">Calculated CPM</td><td className="px-4 py-3">$2.00</td><td className="px-4 py-3">$20.00</td></tr>
                  </tbody>
                </table>
              </div>

              <p>
                Even though both campaigns spent the same <strong>$1,000</strong>, Campaign A has a much lower CPM ($2.00) because display ads generate massive reach. Campaign B (Google Search) has a higher CPM ($20.00) because search intent is highly targeted. Neither is inherently "better" — it depends on whether your goal is <strong>brand awareness</strong> (low CPM) or <strong>direct conversions</strong> (higher CPM, but higher intent).
              </p>

              {/* ── From CPC & CTR ── */}
              <h2 id="from-cpc-ctr" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                Calculating CPM from CPC & CTR
              </h2>

              <p className="mb-4">
                Sometimes you don't have impressions handy, but you know your CPC and CTR. You can reverse-engineer CPM:
              </p>

              <div className="bg-white border border-gray-200 rounded-xl p-6 my-6">
                <p className="font-bold text-gray-900 text-sm mb-4">Example calculation:</p>
                <div className="space-y-3 font-mono text-sm">
                  <p className="text-gray-500">CPC = $2.50</p>
                  <p className="text-gray-500">CTR = 2.5% (0.025)</p>
                  <p className="text-gray-500 border-t border-gray-100 pt-3">CPM = $2.50 × 0.025 × 1,000</p>
                  <p className="text-gray-500">CPM = $0.0625 × 1,000</p>
                  <p className="text-sky-600 font-bold text-base border-t border-gray-100 pt-1">CPM = $62.50</p>
                </div>
              </div>

              <p>
                This tells you that for every 1,000 impressions, you're effectively paying $62.50 in click costs. This is useful when comparing CPM-based buys (like display) against CPC-based buys (like search) on an equal playing field.
              </p>

              {/* ── Good CPM ── */}
              <h2 id="good-cpm" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                What is a Good CPM in 2025?
              </h2>

              <p className="mb-4">
                A "good" CPM varies heavily depending on the platform, industry, and targeting. Here are the average CPM benchmarks for 2025:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  { platform: "Facebook / Instagram Ads", range: "$5 – $12", note: "Spikes in Q4" },
                  { platform: "Google Display Network", range: "$2 – $5", note: "Cheapest option" },
                  { platform: "Google Search Ads", range: "$15 – $40", note: "High intent" },
                  { platform: "YouTube Pre-Roll Ads", range: "$8 – $20", note: "Skippable vs non" },
                  { platform: "LinkedIn Ads", range: "$20 – $50", note: "B2B premium" },
                  { platform: "TikTok Ads", range: "$4 – $10", note: "Growing fast" },
                ].map((item) => (
                  <div key={item.platform} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">{item.platform}</span>
                      <span className="text-sm font-bold text-sky-600">{item.range}</span>
                    </div>
                    <p className="text-xs text-gray-400">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 my-6">
                <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Don't obsess over the lowest CPM.</strong> A $2 CPM with a 0.1% conversion rate is worse than a $30 CPM with a 5% conversion rate. Always measure CPM alongside your <strong>cost-per-acquisition (CPA)</strong> and return on ad spend (ROAS).
                </p>
              </div>

              {/* ── CPM vs CPC vs CPA ── */}
              <h2 id="cpm-vs-cpc" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                CPM vs. CPC vs. CPA — What's the Difference?
              </h2>

              <p className="mb-4">
                Understanding how CPM fits into the broader pricing ecosystem is crucial for media buyers and marketers.
              </p>

              <div className="space-y-4">
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={18} className="text-sky-600" />
                    <h3 className="font-bold text-sky-800 text-sm">CPM (Cost Per Mille)</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">You pay for <strong>1,000 impressions</strong>. The ad platform shows your ad to people — whether they click or not, you pay.</p>
                  <p className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full inline-block">Best for: Brand awareness, retargeting, video ads</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointerClick size={18} className="text-green-600" />
                    <h3 className="font-bold text-green-800 text-sm">CPC (Cost Per Click)</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">You pay for <strong>each click</strong>. Your ad can be shown a million times, but you only pay when someone actually clicks on it.</p>
                  <p className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block">Best for: Direct response, lead generation, search ads</p>
                </div>
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-violet-600" />
                    <h3 className="font-bold text-violet-800 text-sm">CPA (Cost Per Acquisition)</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">You pay for <strong>each conversion</strong> (purchase, signup, download). The platform optimizes to find people most likely to convert.</p>
                  <p className="text-xs font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full inline-block">Best for: E-commerce, SaaS, app installs</p>
                </div>
              </div>

              {/* ── Lower CPM ── */}
              <h2 id="lower-cpm" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                How to Lower Your CPM
              </h2>

              <p className="mb-4">
                If your CPM is eating into your profit margins, here are proven strategies to bring it down:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6">
                {[
                  { icon: Target, color: "text-sky-500", bg: "bg-sky-50", title: "Broaden Your Targeting", desc: "Overly narrow audiences have less ad inventory, which drives up prices. Test broader demographics and let the algorithm optimize." },
                  { icon: TrendingDown, color: "text-green-500", bg: "bg-green-50", title: "Improve Ad Relevance", desc: "Higher click-through rates (CTR) signal quality to ad platforms, often rewarding you with lower CPMs." },
                  { icon: Code, color: "text-violet-500", bg: "bg-violet-50", title: "Use Automatic Placements", desc: "Let the platform automatically place your ads where they perform best instead of manual placements." },
                  { icon: Zap, color: "text-amber-500", bg: "bg-amber-50", title: "Rotate Your Creatives", desc: "Ad fatigue is real. If users keep seeing the same ad, engagement drops and CPMs rise. Rotate every 2-3 weeks." },
                  { icon: BarChart3, color: "text-blue-500", bg: "bg-blue-50", title: "Test Different Formats", desc: "Carousel, video, and static images all have different CPM baselines. Test to find the cheapest for your audience." },
                  { icon: DollarSign, color: "text-red-500", bg: "bg-red-50", title: "Avoid Seasonal Spikes", desc: "Q4 (Oct-Dec) CPMs can be 30-50% higher. Plan brand awareness campaigns for Q1-Q3 when inventory is cheaper." },
                ].map((item) => (
                  <div key={item.title} className={`${item.bg} border border-gray-100 rounded-xl p-5`}>
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon size={16} className={item.color} />
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* ── Common Mistakes ── */}
              <h2 id="common-mistakes" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                Common CPM Mistakes That Cost You Money
              </h2>

              <p className="mb-4">
                These are the mistakes I see most often — and most of them are easy to fix once you know about them.
              </p>

              <div className="space-y-3 my-6">
                {[
                  { title: "Comparing CPMs across different platforms", desc: "A $2 CPM on Facebook Display is NOT the same as a $2 CPM on Google Search. The audience intent, placement quality, and conversion potential are completely different. Compare CPMs within the same platform and campaign type.", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
                  { title: "Optimizing only for CPM instead of CPA", desc: "I've seen advertisers celebrate a $1.50 CPM while ignoring that their CPA is $150. A slightly higher CPM with a much lower CPA is almost always the better deal. Track both.", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
                  { title: "Not accounting for viewability", desc: "Not all impressions are actually seen by a human. A large percentage of display ad impressions are below the fold, in hidden iframes, or served to bots. Look at vCPM (viewable CPM) instead of raw CPM for a more accurate picture.", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
                  { title: "Ignoring frequency capping", desc: "Without frequency caps, you might show the same ad to one person 20 times. That's 20 impressions but effectively 1 reach. Your CPM looks fine, but your effective cost per unique person is 20x higher.", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} border ${item.border} rounded-xl p-5`}>
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon size={16} className={item.color} />
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* ── TL;DR ── */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 text-white my-8">
                <h2 className="text-xl font-bold mb-4">TL;DR</h2>
                <div className="bg-white/10 rounded-xl p-4 mb-4 text-center">
                  <p className="text-base sm:text-lg font-semibold font-mono">CPM = (Cost ÷ Impressions) × 1,000</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5 mb-6">
                  <li>CPM = Cost Per <strong className="text-white">Thousand</strong> impressions — what you pay for 1,000 ad views</li>
                  <li>A $5 CPM is <strong className="text-white">average</strong> for display, $20+ is normal for search</li>
                  <li>Low CPM ≠ better campaign — always measure <strong className="text-white">CPA and ROAS</strong> alongside CPM</li>
                  <li>Use <strong className="text-white">vCPM (viewable CPM)</strong> for a more accurate cost comparison</li>
                  <li>Broaden targeting and rotate creatives to <strong className="text-white">lower your CPM</strong></li>
                  <li>Don't compare CPMs across <strong className="text-white">different platforms</strong> — compare within the same platform</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/tools/cpm-calculator" className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors">CPM Calculator →</Link>
                  <Link to="/tools/cpc-calculator" className="inline-flex items-center justify-center px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20">CPC Calculator →</Link>
                </div>
              </div>

              {/* ── FAQ ── */}
              <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-20">
                Questions People Actually Ask
              </h2>

              <div className="space-y-4 my-6">
                <FAQItem question="What is the formula to calculate CPM?" answer="The formula to calculate CPM is: CPM = (Total Campaign Cost / Total Impressions) x 1,000. For example, if you spend $500 and get 100,000 impressions, your CPM is ($500 / 100,000) x 1,000 = $5.00." />
                <FAQItem question="What does CPM stand for?" answer="CPM stands for Cost Per Mille. 'Mille' is the Latin word for thousand. In digital advertising, it represents the cost an advertiser pays for 1,000 impressions of their ad." />
                <FAQItem question="Is a $5 CPM good?" answer="Yes, a $5 CPM is generally considered good for most digital advertising campaigns. It sits right in the middle of average display ad CPMs ($2-$5). However, 'good' depends on your industry — B2B tech might see $15 CPMs, while entertainment might see $1 CPMs." />
                <FAQItem question="How do I calculate CPM from CPC and CTR?" answer="To calculate CPM from CPC and CTR, use the formula: CPM = CPC x CTR x 1,000. For example, if your CPC is $2.00 and your CTR is 2% (0.02), your CPM is 2.00 x 0.02 x 1,000 = $40.00." />
                <FAQItem question="What is a good CPM for Facebook ads?" answer="A good CPM for Facebook and Instagram ads in 2025 ranges from $5 to $12. During Q4 (holiday season), CPMs can spike to $15-$20 due to heavy competition. B2B niches tend to have higher CPMs than B2C." />
                <FAQItem question="Why is my CPM so high?" answer="High CPM is usually caused by: narrow audience targeting (less inventory = higher prices), low ad relevance scores, seasonal competition (Q4 is always expensive), expensive geographies (US/UK cost more), or ad fatigue from not rotating creatives." />
              </div>

            </div>
            {/* ═══════════════ CONTENT END ═══════════════ */}

            {/* ── Related Posts ── */}
            <div className="mt-16 border-t border-gray-200 pt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Reading</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className={`flex items-center justify-center bg-gradient-to-br ${rp.color} h-32`}><span className="text-5xl">{rp.emoji}</span></div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">{rp.category}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors mt-2 mb-1">{rp.title}</h3>
                      <p className="text-xs text-gray-400">{rp.readTime} min read · {rp.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-sky-600 transition-colors">
                <ArrowLeft size={14} /> Back to all articles
              </Link>
            </div>
          </article>
        </div>

        {/* ── Footer ── */}
        <Footer />
      </div>
    </>
  );
};

export default BlogPostHowToCalculateCpm;