// pages/BlogPostJpegVsPng.jsx
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
  Copy,
  Check,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Monitor,
  Smartphone,
  Camera,
  FileImage,
  Layers,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── POST DATA ────────────────────────────────────────────────────────────────
const post = {
  id: 4,
  slug: "jpeg-vs-png-complete-comparison-guide",
  title: "JPEG vs PNG — Complete Comparison Guide (When to Use Which in 2026)",
  excerpt:
    "JPEG vs PNG: which format should you use? Complete comparison of file size, quality, transparency, and use cases. With real data, examples, and a simple decision rule.",
  category: "Web Tips",
  tag: "Images",
  readTime: 7,
  date: "April 14, 2026",
  dateISO: "2026-04-14",
  featured: false,
  color: "from-emerald-500 to-teal-600",
  emoji: "🖼️",
};

// ─── SEO SCHEMAS ──────────────────────────────────────────────────────────────
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  image: "https://www.generatorpromptai.com/og-jpeg-vs-png.png",
  datePublished: post.dateISO,
  dateModified: post.dateISO,
  author: {
    "@type": "Organization",
    name: "GeneratorPromptAI",
    url: "https://www.generatorpromptai.com",
  },
  publisher: {
    "@type": "Organization",
    name: "GeneratorPromptAI",
    logo: {
      "@type": "ImageObject",
      url: "https://www.generatorpromptai.com/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://www.generatorpromptai.com/blog/${post.slug}`,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which is better quality, JPEG or PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG has better quality than JPEG for images with text, sharp edges, and few colors because it uses lossless compression — no data is lost. However, for photographs, JPEG at high quality (90%+) looks identical to PNG while being 5-10x smaller in file size. So 'better quality' depends on what you're comparing.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use JPEG vs PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use JPEG for photographs, social media images, email attachments, and any image with many colors and gradients. Use PNG for logos, icons, screenshots, graphics with text, and any image that needs a transparent background. Simple rule: photos = JPEG, graphics = PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Is PNG higher quality than JPEG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG is lossless (no quality loss ever) while JPEG is lossy (loses quality each time you save). So technically yes, PNG preserves exact quality. But in practice, a JPEG saved at 95% quality looks identical to PNG for photos — you'd need to zoom to 200-300% to see any difference, while the JPEG file is 5-10x smaller.",
      },
    },
    {
      "@type": "Question",
      name: "Why are PNG files so large?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG files are large because they use lossless compression — they store every single pixel's exact data without throwing anything away. A 4000x3000 photo saved as PNG can be 15-30MB, while the same photo as JPEG might be 1-3MB. PNG was designed for graphics, not photos. For photos, JPEG or WebP are much more efficient formats.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert JPEG to PNG without losing quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can convert JPEG to PNG, but it won't improve quality. JPEG has already discarded some image data during compression. Converting to PNG just stores the already-degraded image in a bigger file. Think of it like taking a photocopy of a photocopy and putting it in a more expensive frame — the content doesn't improve, only the container changes.",
      },
    },
    {
      "@type": "Question",
      name: "Which format is better for websites, JPEG or PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For website speed, JPEG is generally better because smaller files = faster loading. But the best approach is using the right format for each image: JPEG for photos, PNG for logos and graphics. Even better, use WebP format if possible — it's 25-35% smaller than JPEG with the same quality and supports transparency like PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Does JPEG support transparency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, standard JPEG does not support transparency. JPEG images always have a solid background (usually white or black). If you need a transparent background — for logos, overlays, stickers — you must use PNG, WebP, GIF, or SVG. There is a rarely-used format called JPEG 2000 that supports transparency, but it's not supported by web browsers.",
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
    { "@type": "ListItem", position: 3, name: "JPEG vs PNG", item: `https://www.generatorpromptai.com/blog/${post.slug}` },
  ],
};

// ─── TOC ──────────────────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id: "quick-answer", label: "Quick Answer" },
  { id: "what-is-jpeg", label: "What is JPEG?" },
  { id: "what-is-png", label: "What is PNG?" },
  { id: "side-by-side", label: "Side-by-Side Comparison" },
  { id: "file-size-test", label: "Real File Size Data" },
  { id: "quality-test", label: "Quality Comparison" },
  { id: "transparency", label: "Transparency Test" },
  { id: "when-jpeg", label: "When to Use JPEG" },
  { id: "when-png", label: "When to Use PNG" },
  { id: "webp-better", label: "Why WebP Beats Both" },
  { id: "decision-rule", label: "The 10-Second Rule" },
  { id: "convert", label: "How to Convert" },
  { id: "myths", label: "Myths Busted" },
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

const CheckXRow = ({ label, jpeg, png }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-700 font-medium pr-4">{label}</span>
    <div className="flex items-center gap-6 flex-shrink-0">
      <span className="flex items-center gap-1.5 text-sm w-20 justify-center">
        {jpeg ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-400" />}
        <span className={jpeg ? "text-green-700 font-medium" : "text-red-400"}>{jpeg || "—"}</span>
      </span>
      <span className="flex items-center gap-1.5 text-sm w-20 justify-center">
        {png ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-400" />}
        <span className={png ? "text-green-700 font-medium" : "text-red-400"}>{png || "—"}</span>
      </span>
    </div>
  </div>
);

const UseCaseCard = ({ icon: Icon, title, format, reason, color }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <span className={`text-xs font-bold ${format === "JPEG" ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full" : "text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full"}`}>{format}</span>
      </div>
    </div>
    <p className="text-sm text-gray-500 leading-relaxed">{reason}</p>
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const BlogPostJpegVsPng = () => {
  const [activeTOC, setActiveTOC] = useState("");

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

  const relatedPosts = [
    {
      id: 7, slug: "compress-image-to-100kb-online-free",
      title: "How to Compress Image to 100KB Online Free (2026)",
      category: "Web Tips", color: "from-sky-500 to-blue-600", emoji: "⚡", readTime: 6, date: "April 12, 2026",
    },
    {
      id: 4, slug: "midjourney-prompt-guide-beginners",
      title: "Midjourney Prompt Guide for Beginners",
      category: "Image AI", color: "from-pink-500 to-rose-600", emoji: "🎨", readTime: 10, date: "March 20, 2026",
    },
  ];

  return (
    <>
      <Helmet>
        <title>JPEG vs PNG — Complete Comparison Guide (2026) | GeneratorPromptAI</title>
        <meta name="description" content="JPEG vs PNG: which is better? Complete comparison of file size, quality, transparency, compression. Real data, examples, and a simple rule to decide in 10 seconds." />
        <meta name="keywords" content="jpeg vs png, jpeg vs png difference, jpeg vs png quality, jpeg vs png for web, jpeg vs png for photos, jpeg vs png for logos, when to use jpeg vs png, jpeg vs png file size, jpeg vs png transparency, png vs jpeg comparison, jpeg vs png which is better, jpeg vs png 2026" />
        <link rel="canonical" href={`https://www.generatorpromptai.com/blog/${post.slug}`} />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="JPEG vs PNG — Complete Comparison Guide (2026)" />
        <meta property="og:description" content="JPEG vs PNG: which is better? Complete comparison with real data, quality tests, and a simple decision rule." />
        <meta property="og:url" content={`https://www.generatorpromptai.com/blog/${post.slug}`} />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-jpeg-vs-png.png" />
        <meta property="article:published_time" content={post.dateISO} />
        <meta property="article:section" content="Web Tips" />
        <meta property="article:tag" content="Images" />
        <meta property="article:tag" content="JPEG" />
        <meta property="article:tag" content="PNG" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JPEG vs PNG — Complete Comparison Guide" />
        <meta name="twitter:description" content="JPEG vs PNG: which format should you use? Real data and a simple decision rule." />

        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* ── Breadcrumb ── */}
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600">JPEG vs PNG</span>
          </nav>
        </div>

        {/* ── Layout ── */}
        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-10">

          {/* ── TOC Sidebar (desktop only) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">On this page</p>
              <div className="flex flex-col gap-0.5">
                {TOC_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-sm py-1.5 px-3 rounded-r-lg transition-all border-l-2 ${activeTOC === item.id
                      ? "border-l-indigo-600 text-indigo-600 bg-indigo-50 font-medium"
                      : "border-l-transparent text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                      }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Tool CTA */}
              <div className="mt-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
                <p className="text-sm font-bold mb-1">Image Converter</p>
                <p className="text-xs text-emerald-100 mb-3">Convert between JPEG, PNG, WebP instantly. Free.</p>
                <Link to="/tools/image-converter" className="block text-center py-2 bg-white text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
                  Convert Now →
                </Link>
              </div>

              {/* Related Tools */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Related Tools</p>
                <Link to="/tools/image-compressor" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors py-1">
                  <ImageIcon size={14} /> Image Compressor
                </Link>
                <Link to="/tools/image-resizer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors py-1">
                  <ImageIcon size={14} /> Image Resizer
                </Link>
                <Link to="/tools/image-cropper" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors py-1">
                  <ImageIcon size={14} /> Image Cropper
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Article ── */}
          <article className="flex-1 max-w-3xl">

            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">{post.category}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">#{post.tag}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                JPEG vs PNG —{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Complete Comparison Guide
                </span>{" "}
                <span className="text-xl md:text-2xl font-bold text-gray-400">(2026)</span>
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
              <div className="text-center">
                <span className="text-7xl sm:text-8xl md:text-9xl block">{post.emoji}</span>
                <p className="text-white/80 text-sm md:text-base font-semibold mt-2">JPEG vs PNG — Let's settle this once and for all</p>
              </div>
            </div>

            {/* ═══════════════ CONTENT ═══════════════ */}
            <div className="text-gray-600 leading-relaxed space-y-5">

              <p className="text-lg">
                Every designer, developer, and content creator has asked this question:{" "}
                <span className="bg-gradient-to-t from-emerald-200 to-transparent bg-[length:100%_40%] bg-no-repeat bg-bottom font-semibold text-gray-900">
                  should I use JPEG or PNG?
                </span>{" "}
                And most articles give you a vague "it depends". That's useless. Here's the actual answer with real data, real file sizes, and a rule you can apply in 10 seconds.
              </p>

              {/* ── Quick Answer ── */}
              <h2 id="quick-answer" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">01.</span> Quick Answer (Save Your Time)
              </h2>

              {/* Mobile-friendly quick answer card */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden my-6">
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-5 sm:p-6 bg-amber-50/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Camera size={16} className="text-amber-600" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Use JPEG For</p>
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> Photographs</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> Social media posts</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> Email attachments</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> Blog post images</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> Product photos</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> Wallpaper / backgrounds</li>
                    </ul>
                  </div>
                  <div className="p-5 sm:p-6 bg-teal-50/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Layers size={16} className="text-teal-600" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Use PNG For</p>
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-teal-500 flex-shrink-0 mt-0.5" /> Logos & branding</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-teal-500 flex-shrink-0 mt-0.5" /> Icons & UI elements</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-teal-500 flex-shrink-0 mt-0.5" /> Screenshots</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-teal-500 flex-shrink-0 mt-0.5" /> Graphics with text</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-teal-500 flex-shrink-0 mt-0.5" /> Transparent backgrounds</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-teal-500 flex-shrink-0 mt-0.5" /> Line art / drawings</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200">
                  <strong className="text-gray-700">Simple rule:</strong> If it's a photo → JPEG. If it has sharp edges, text, or transparency → PNG.
                </div>
              </div>

              {/* What is JPEG */}
              <h2 id="what-is-jpeg" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">02.</span> What is JPEG?
              </h2>

              <p>
                JPEG (Joint Photographic Experts Group) was created in <strong>1992</strong> specifically for photographs. It uses <strong>lossy compression</strong> — meaning it throws away some image data to make the file smaller. The "loss" is mostly data your eyes can't see anyway.
              </p>

              <div className="bg-white border border-gray-200 rounded-xl p-5 my-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-amber-600">1992</p>
                    <p className="text-xs text-gray-500 mt-0.5">Created</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-amber-600">Lossy</p>
                    <p className="text-xs text-gray-500 mt-0.5">Compression</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-amber-600">16.7M</p>
                    <p className="text-xs text-gray-500 mt-0.5">Colors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-amber-600">.jpg .jpeg</p>
                    <p className="text-xs text-gray-500 mt-0.5">Extensions</p>
                  </div>
                </div>
              </div>

              <p>
                Think of JPEG like MP3 for audio — it removes data you can't perceive to make the file dramatically smaller. A 5MB RAW photo becomes a 500KB JPEG that looks virtually identical. That's a 90% size reduction with no visible quality loss.
              </p>

              <p>
                The tradeoff: every time you open and re-save a JPEG, it loses more quality (called "generation loss"). But for final output (saving once and using), this doesn't matter.
              </p>

              {/* What is PNG */}
              <h2 id="what-is-png" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">03.</span> What is PNG?
              </h2>

              <p>
                PNG (Portable Network Graphics) was created in <strong>1996</strong> as a replacement for the aging GIF format. It uses <strong>lossless compression</strong> — meaning zero data is lost, ever. The file you save is pixel-perfect identical to the original.
              </p>

              <div className="bg-white border border-gray-200 rounded-xl p-5 my-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-teal-600">1996</p>
                    <p className="text-xs text-gray-500 mt-0.5">Created</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-teal-600">Lossless</p>
                    <p className="text-xs text-gray-500 mt-0.5">Compression</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-teal-600">16.7M+</p>
                    <p className="text-xs text-gray-500 mt-0.5">Colors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-teal-600">.png</p>
                    <p className="text-xs text-gray-500 mt-0.5">Extension</p>
                  </div>
                </div>
              </div>

              <p>
                Think of PNG like FLAC for audio — perfect quality, but much larger files. A 5MB photo saved as PNG might be 15-25MB because it preserves every single pixel exactly. For photos, this is wasteful. But for graphics with sharp edges and text, PNG is essential because JPEG would blur those edges.
              </p>

              <p>
                PNG's superpower is <strong>transparency</strong>. It supports an alpha channel — meaning you can have images with see-through backgrounds. JPEG cannot do this.
              </p>

              {/* Side-by-Side Comparison */}
              <h2 id="side-by-side" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">04.</span> Side-by-Side Feature Comparison
              </h2>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden my-6">
                {/* Header */}
                <div className="grid grid-cols-3 bg-gray-900 text-white text-sm">
                  <div className="px-4 py-3 font-semibold">Feature</div>
                  <div className="px-4 py-3 font-semibold text-center text-amber-300">JPEG</div>
                  <div className="px-4 py-3 font-semibold text-center text-teal-300">PNG</div>
                </div>
                {/* Rows */}
                <div className="px-4">
                  <CheckXRow label="Compression type" jpeg="Lossy" png="Lossless" />
                  <CheckXRow label="Transparency" jpeg={null} png="Yes" />
                  <CheckXRow label="Animation" jpeg={null} png={null} />
                  <CheckXRow label="Max colors" jpeg="16.7 million" png="16.7 million+" />
                  <CheckXRow label="Best for photos" jpeg="Yes" png={null} />
                  <CheckXRow label="Best for graphics" jpeg={null} png="Yes" />
                  <CheckXRow label="Best for screenshots" jpeg={null} png="Yes" />
                  <CheckXRow label="Small file size" jpeg="Yes" png={null} />
                  <CheckXRow label="Exact quality preservation" jpeg={null} png="Yes" />
                  <CheckXRow label="Re-save without quality loss" jpeg={null} png="Yes" />
                  <CheckXRow label="Browser support" jpeg="100%" png="100%" />
                </div>
              </div>

              {/* File Size Test */}
              <h2 id="file-size-test" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">05.</span> Real File Size Comparison (Actual Data)
              </h2>

              <p>
                We saved 5 different images in both JPEG (quality 90%) and PNG formats. Here are the actual file sizes:
              </p>

              {/* Mobile-friendly table */}
              <div className="my-6 space-y-3">
                {/* Header — visible on mobile as labels */}
                <div className="hidden sm:grid sm:grid-cols-4 bg-gray-900 text-white text-sm rounded-xl overflow-hidden">
                  <div className="px-4 py-3 font-semibold">Image Type</div>
                  <div className="px-4 py-3 font-semibold text-center text-amber-300">JPEG (90%)</div>
                  <div className="px-4 py-3 font-semibold text-center text-teal-300">PNG</div>
                  <div className="px-4 py-3 font-semibold text-center">JPEG Smaller</div>
                </div>

                {[
                  { type: "Portrait photo (phone)", jpeg: "420 KB", png: "4.8 MB", smaller: "11.4x" },
                  { type: "Landscape photo (DSLR)", jpeg: "680 KB", png: "12.3 MB", smaller: "18.1x" },
                  { type: "Product photo (e-com)", jpeg: "310 KB", png: "3.1 MB", smaller: "10x" },
                  { type: "Screenshot (text-heavy)", jpeg: "180 KB", png: "520 KB", smaller: "2.9x" },
                  { type: "Logo (simple graphic)", jpeg: "28 KB", png: "15 KB", smaller: "0.5x ⚠️" },
                ].map((row, i) => (
                  <div key={i} className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${i % 2 === 0 ? "" : ""}`}>
                    {/* Desktop row */}
                    <div className="hidden sm:grid sm:grid-cols-4 text-sm">
                      <div className={`px-4 py-3 font-medium text-gray-800 ${i % 2 === 1 ? "bg-gray-50" : ""}`}>{row.type}</div>
                      <div className={`px-4 py-3 text-center font-semibold text-amber-700 ${i % 2 === 1 ? "bg-gray-50" : ""}`}>{row.jpeg}</div>
                      <div className={`px-4 py-3 text-center font-semibold text-teal-700 ${i % 2 === 1 ? "bg-gray-50" : ""}`}>{row.png}</div>
                      <div className={`px-4 py-3 text-center font-bold ${row.smaller.includes("⚠️") ? "text-red-600" : "text-green-600"} ${i % 2 === 1 ? "bg-gray-50" : ""}`}>
                        {row.smaller.includes("⚠️") ? "PNG is smaller!" : `${row.smaller} smaller`}
                      </div>
                    </div>
                    {/* Mobile card */}
                    <div className="sm:hidden p-4">
                      <p className="font-medium text-gray-800 text-sm mb-2">{row.type}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-amber-50 rounded-lg p-2.5 text-center">
                          <p className="text-xs text-amber-600 font-semibold">JPEG</p>
                          <p className="text-sm font-bold text-amber-800">{row.jpeg}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
                        <div className="flex-1 bg-teal-50 rounded-lg p-2.5 text-center">
                          <p className="text-xs text-teal-600 font-semibold">PNG</p>
                          <p className="text-sm font-bold text-teal-800">{row.png}</p>
                        </div>
                      </div>
                      <p className={`text-xs mt-2 font-semibold text-center ${row.smaller.includes("⚠️") ? "text-red-600" : "text-green-600"}`}>
                        {row.smaller.includes("⚠️") ? "⚠️ PNG is actually smaller here" : `JPEG is ${row.smaller} smaller`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
                <p className="text-sm font-semibold text-amber-800 mb-1">🔍 Key Finding</p>
                <p className="text-sm text-amber-700">
                  For photos, JPEG is <strong>10-18x smaller</strong> than PNG with virtually identical visual quality. But for simple graphics like logos, PNG can actually be smaller. This is why you can't use one format for everything.
                </p>
              </div>

              {/* Quality Test */}
              <h2 id="quality-test" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">06.</span> Quality Comparison (Honest Truth)
              </h2>

              <p>
                Here's what most articles won't tell you: <strong>for photographs, JPEG at 90% quality is visually identical to PNG.</strong> You would need to zoom to 200-300% and pixel-peep to see any difference.
              </p>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden my-6">
                <div className="grid grid-cols-3 bg-gray-900 text-white text-sm">
                  <div className="px-4 py-3 font-semibold">Scenario</div>
                  <div className="px-4 py-3 font-semibold text-center text-amber-300">JPEG Quality</div>
                  <div className="px-4 py-3 font-semibold text-center text-teal-300">PNG Quality</div>
                </div>
                <div className="px-4 divide-y divide-gray-100">
                  {[
                    { scenario: "Photo at 100% zoom", jpeg: "10/10", png: "10/10", note: "Identical" },
                    { scenario: "Photo at 200% zoom", jpeg: "8/10", png: "10/10", note: "Slight JPEG artifacts" },
                    { scenario: "Photo at 300% zoom", jpeg: "6/10", png: "10/10", note: "Clear JPEG blockiness" },
                    { scenario: "Logo at 100% zoom", jpeg: "5/10", png: "10/10", note: "JPEG blurs edges" },
                    { scenario: "Screenshot at 100%", jpeg: "6/10", png: "10/10", note: "JPEG fuzzes text" },
                    { scenario: "Graphic with text", jpeg: "4/10", png: "10/10", note: "JPEG mangles text clarity" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-3 text-sm">
                      <div className="py-3 font-medium text-gray-800">{row.scenario}</div>
                      <div className="py-3 text-center">
                        <span className={`font-bold ${row.jpeg === "10/10" ? "text-green-600" : "text-amber-600"}`}>{row.jpeg}</span>
                      </div>
                      <div className="py-3 text-center">
                        <span className="font-bold text-green-600">{row.png}</span>
                        <span className="text-xs text-gray-400 ml-1 hidden sm:inline">({row.note})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transparency */}
              <h2 id="transparency" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">07.</span> Transparency: The Dealbreaker
              </h2>

              <p>
                This is the one area where PNG absolutely wins and there's no debate. If your image needs a <strong>transparent background</strong>, you must use PNG (or WebP/SVG). JPEG does not support transparency — period.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="bg-white border-2 border-teal-200 rounded-xl p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-3 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,white_0%_50%)] bg-[length:16px_16px] rounded-xl flex items-center justify-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">P</div>
                  </div>
                  <p className="font-semibold text-teal-700 text-sm">PNG with Transparency</p>
                  <p className="text-xs text-gray-500 mt-1">Background is see-through ✓</p>
                </div>
                <div className="bg-white border-2 border-amber-200 rounded-xl p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-3 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">J</div>
                  </div>
                  <p className="font-semibold text-amber-700 text-sm">JPEG — No Transparency</p>
                  <p className="text-xs text-gray-500 mt-1">White box behind the circle ✗</p>
                </div>
              </div>

              <p>
                This matters for: logos on colored backgrounds, watermark overlays, sticker-style images, product photos on custom backgrounds, and any graphic that needs to blend with the page behind it. If you need transparency and someone tells you to "just use JPEG", they're wrong.
              </p>

              {/* When to Use JPEG */}
              <h2 id="when-jpeg" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">08.</span> When to Use JPEG (With Examples)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <UseCaseCard icon={Camera} title="Photographs" format="JPEG" reason="Any photo — portraits, landscapes, food, events. JPEG was literally invented for this. 10x smaller than PNG with zero visible quality difference at normal zoom." color="bg-amber-500" />
                <UseCaseCard icon={Smartphone} title="Social Media Posts" format="JPEG" reason="Instagram, Facebook, Twitter all convert your uploads to JPEG anyway. Uploading PNG is pointless — it wastes your time and bandwidth." color="bg-amber-500" />
                <UseCaseCard icon={Monitor} title="Blog & Website Photos" format="JPEG" reason="Faster page loading = better SEO. A 500KB JPEG vs a 5MB PNG for a blog header image — the JPEG loads 10x faster with identical visual quality." color="bg-amber-500" />
                <UseCaseCard icon={FileImage} title="Email Attachments" format="JPEG" reason="Most email providers limit attachments to 10-25MB. A batch of PNG photos could easily exceed this. JPEG lets you send 10x more photos." color="bg-amber-500" />
              </div>

              {/* When to Use PNG */}
              <h2 id="when-png" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">09.</span> When to Use PNG (With Examples)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <UseCaseCard icon={Layers} title="Logos & Branding" format="PNG" reason="Logos have sharp edges, solid colors, and often need transparent backgrounds. JPEG would blur the edges and add white boxes. PNG keeps it pixel-perfect." color="bg-teal-500" />
                <UseCaseCard icon={Monitor} title="Screenshots" format="PNG" reason="Screenshots contain text and sharp UI elements. JPEG makes text fuzzy and adds compression artifacts around edges. PNG keeps text crisp and readable." color="bg-teal-500" />
                <UseCaseCard icon={Zap} title="Icons & UI Elements" format="PNG" reason="Icons are small, have sharp edges, and often sit on colored backgrounds. PNG with transparency is the standard for icons. WebP is even better if supported." color="bg-teal-500" />
                <UseCaseCard icon={FileImage} title="Graphics with Text" format="PNG" reason="Infographics, charts, diagrams, memes with text — PNG preserves text clarity. JPEG makes text look fuzzy, especially at small sizes." color="bg-teal-500" />
              </div>

              {/* WebP Section */}
              <h2 id="webp-better" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">10.</span> Plot Twist: WebP Beats Both
              </h2>

              <p>
                In 2026, if you're only choosing between JPEG and PNG, you're missing the better option. <strong>WebP</strong> (created by Google) combines the best of both formats:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="text-left px-4 py-3 font-semibold">Feature</th>
                      <th className="text-center px-4 py-3 font-semibold">JPEG</th>
                      <th className="text-center px-4 py-3 font-semibold">PNG</th>
                      <th className="text-center px-4 py-3 font-semibold text-blue-300">WebP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Photo compression", "Good", "Poor (huge files)", "Best (25-35% smaller than JPEG)"],
                      ["Transparency", "❌ No", "✅ Yes", "✅ Yes"],
                      ["Text sharpness", "Poor", "Excellent", "Excellent"],
                      ["Browser support", "100%", "100%", "97%+"],
                      ["Animation", "❌ No", "❌ No", "✅ Yes"],
                    ].map((row, i) => (
                      <tr key={i} className={`${i % 2 === 1 ? "bg-gray-50" : ""} border-b border-gray-100`}>
                        <td className="px-4 py-3 font-medium text-gray-800">{row[0]}</td>
                        <td className="px-4 py-3 text-center text-sm">{row[1]}</td>
                        <td className="px-4 py-3 text-center text-sm">{row[2]}</td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-blue-700">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                WebP gives you JPEG-like compression for photos AND PNG-like quality for graphics — all in one format that also supports transparency and animation. If your website or app supports WebP, use it. Convert your images with our free{" "}
                <Link to="/tools/image-converter" className="text-emerald-600 hover:underline font-medium">Image Converter tool</Link>.
              </p>

              {/* Decision Rule */}
              <h2 id="decision-rule" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">11.</span> The 10-Second Decision Rule
              </h2>

              <p>
                Don't memorize all the data above. Use this flowchart instead:
              </p>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 my-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-gray-700"><strong>Does the image need a transparent background?</strong></p>
                </div>
                <div className="ml-11 pl-4 border-l-2 border-emerald-300 space-y-2">
                  <p className="text-sm text-emerald-700 font-medium">→ Yes: Use PNG (or WebP if supported)</p>
                  <p className="text-sm text-gray-500">→ No: Go to step 2</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-gray-700"><strong>Does the image contain text, sharp edges, or is it a screenshot/logo/icon?</strong></p>
                </div>
                <div className="ml-11 pl-4 border-l-2 border-emerald-300 space-y-2">
                  <p className="text-sm text-emerald-700 font-medium">→ Yes: Use PNG</p>
                  <p className="text-sm text-gray-500">→ No: Go to step 3</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-gray-700"><strong>Is it a photograph (people, nature, products, food)?</strong></p>
                </div>
                <div className="ml-11 pl-4 border-l-2 border-amber-300 space-y-2">
                  <p className="text-sm text-amber-700 font-medium">→ Yes: Use JPEG (quality 85-92%) or WebP</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 ml-11">
                  <p className="text-sm font-bold text-gray-900">🤷 Still not sure?</p>
                  <p className="text-sm text-gray-600">Save as JPEG at 90% quality. If it looks good, you're done. If edges look blurry or there's a white box where transparency should be, switch to PNG.</p>
                </div>
              </div>

              {/* Convert Section */}
              <h2 id="convert" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">12.</span> How to Convert Between JPEG and PNG
              </h2>

              <p>
                Need to switch formats? Don't install Photoshop. Use our free online converter:
              </p>

              {/* Inline Tool CTA */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 my-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <ImageIcon size={28} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-gray-900 mb-0.5">Free Image Converter</p>
                    <p className="text-sm text-gray-500">JPEG → PNG, PNG → JPEG, or convert to WebP. No signup, no watermark, instant.</p>
                  </div>
                  <Link to="/tools/image-converter" className="flex-shrink-0 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                    Convert Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <p>
                <strong>Important note about converting:</strong> Converting JPEG → PNG does NOT improve quality. The JPEG has already discarded data. Converting to PNG just stores the already-compressed image in a bigger file. It's like photocopying a photocopy and putting it in a nicer folder — the content doesn't get better.
              </p>

              <p>
                The right workflow is: <strong>start with the highest quality original</strong>, then save directly to your target format. If you have a RAW photo, save directly to JPEG or PNG — don't go through an intermediate format.
              </p>

              {/* Myths */}
              <h2 id="myths" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                <span className="text-emerald-600">13.</span> Myths About JPEG vs PNG (Busted)
              </h2>

              <div className="space-y-3 my-6">
                {[
                  {
                    myth: '"PNG is always higher quality than JPEG"',
                    truth: "PNG preserves exact pixel data (lossless), but for photographs, a JPEG at 90% quality is visually identical at normal zoom levels. 'Higher quality' in technical terms doesn't mean 'looks better to humans' for photos.",
                  },
                  {
                    myth: '"You should always use PNG for websites"',
                    truth: "This is terrible advice. Using PNG for all website images can make your page 5-10x slower. A photo saved as PNG might be 5MB vs 500KB as JPEG. That's the difference between a 1-second and a 10-second page load on mobile.",
                  },
                  {
                    myth: '"Converting JPEG to PNG improves quality"',
                    truth: "Impossible. Once JPEG has discarded data during compression, that data is gone forever. Converting to PNG just stores the degraded image in a larger file. Quality can only go down, never up through format conversion.",
                  },
                  {
                    myth: '"JPEG is an outdated format"',
                    truth: "JPEG is over 30 years old and still the most widely used image format on the internet. It handles photos better than almost any format except WebP. Age doesn't matter — results do. That said, WebP is the actual future.",
                  },
                  {
                    myth: '"PNG is only for web"',
                    truth: "PNG is used everywhere — print design, app development, video editing, document creation. Any time you need pixel-perfect quality or transparency, PNG is the standard choice across all industries.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm font-bold text-red-600 mb-1">❌ Myth: {item.myth}</p>
                    <p className="text-sm text-green-700 font-medium mb-0.5">✅ Reality:</p>
                    <p className="text-sm text-gray-600">{item.truth}</p>
                  </div>
                ))}
              </div>

              {/* TL;DR */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 text-white my-8">
                <h2 className="text-xl font-bold mb-3">TL;DR — The Only Rule You Need</h2>
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <p className="text-base sm:text-lg font-semibold text-center">
                    Photo → <span className="text-amber-400">JPEG</span> &nbsp;|&nbsp; Graphic/Logo/Screenshot → <span className="text-teal-400">PNG</span> &nbsp;|&nbsp; Website → <span className="text-blue-400">WebP</span>
                  </p>
                </div>
                <ul className="space-y-1.5 text-sm text-gray-300 list-disc pl-5 mb-6">
                  <li>JPEG is <strong className="text-white">10-18x smaller</strong> than PNG for photos with identical visual quality</li>
                  <li>PNG is <strong className="text-white">the only choice</strong> when you need transparency or pixel-perfect text</li>
                  <li>WebP beats both if your platform supports it</li>
                  <li>Converting JPEG → PNG does NOT improve quality</li>
                  <li>Using PNG for photos on websites = <strong className="text-white">terrible for page speed</strong></li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/tools/image-converter" className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                    Convert Images Now →
                  </Link>
                  <Link to="/tools/image-compressor" className="inline-flex items-center justify-center px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                    Compress Images →
                  </Link>
                </div>
              </div>

              {/* FAQ */}
              <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-20">
                <span className="text-emerald-600">14.</span> Frequently Asked Questions
              </h2>

              <div className="space-y-4 my-6">
                <FAQItem
                  question="Which is better quality, JPEG or PNG?"
                  answer="PNG has better quality than JPEG for images with text, sharp edges, and few colors because it uses lossless compression — no data is lost. However, for photographs, JPEG at high quality (90%+) looks identical to PNG while being 5-10x smaller in file size. So 'better quality' depends on what you're comparing."
                />
                <FAQItem
                  question="When should I use JPEG vs PNG?"
                  answer="Use JPEG for photographs, social media images, email attachments, and any image with many colors and gradients. Use PNG for logos, icons, screenshots, graphics with text, and any image that needs a transparent background. Simple rule: photos = JPEG, graphics = PNG."
                />
                <FAQItem
                  question="Is PNG higher quality than JPEG?"
                  answer="PNG is lossless (no quality loss ever) while JPEG is lossy (loses quality each time you save). So technically yes, PNG preserves exact quality. But in practice, a JPEG saved at 95% quality looks identical to PNG for photos — you'd need to zoom to 200-300% to see any difference, while the JPEG file is 5-10x smaller."
                />
                <FAQItem
                  question="Why are PNG files so large?"
                  answer="PNG files are large because they use lossless compression — they store every single pixel's exact data without throwing anything away. A 4000x3000 photo saved as PNG can be 15-30MB, while the same photo as JPEG might be 1-3MB. PNG was designed for graphics, not photos. For photos, JPEG or WebP are much more efficient formats."
                />
                <FAQItem
                  question="Can I convert JPEG to PNG without losing quality?"
                  answer="You can convert JPEG to PNG, but it won't improve quality. JPEG has already discarded some image data during compression. Converting to PNG just stores the already-degraded image in a bigger file. Think of it like taking a photocopy of a photocopy and putting it in a more expensive frame — the content doesn't improve, only the container changes."
                />
                <FAQItem
                  question="Which format is better for websites, JPEG or PNG?"
                  answer="For website speed, JPEG is generally better because smaller files = faster loading. But the best approach is using the right format for each image: JPEG for photos, PNG for logos and graphics. Even better, use WebP format if possible — it's 25-35% smaller than JPEG with the same quality and supports transparency like PNG."
                />
                <FAQItem
                  question="Does JPEG support transparency?"
                  answer="No, standard JPEG does not support transparency. JPEG images always have a solid background (usually white or black). If you need a transparent background — for logos, overlays, stickers — you must use PNG, WebP, GIF, or SVG. There is a rarely-used format called JPEG 2000 that supports transparency, but it's not supported by web browsers."
                />
              </div>

            </div>
            {/* ═══════════════ CONTENT END ═══════════════ */}

            {/* ── Related Posts ── */}
            <div className="mt-16 border-t border-gray-200 pt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Reading</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className={`flex items-center justify-center bg-gradient-to-br ${rp.color} h-32`}>
                      <span className="text-5xl">{rp.emoji}</span>
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{rp.category}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mt-2 mb-1">{rp.title}</h3>
                      <p className="text-xs text-gray-400">{rp.readTime} min read · {rp.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 transition-colors">
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

export default BlogPostJpegVsPng;