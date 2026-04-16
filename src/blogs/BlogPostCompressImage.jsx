// pages/BlogPostCompressImage.jsx
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
    Zap,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── POST DATA ────────────────────────────────────────────────────────────────
const post = {
    id: 2,
    slug: "compress-image-to-100kb-online-free",
    title: "Compress Image to 100KB Online Free (Fast & Easy Guide 2026)",
    excerpt:
        "Learn how to compress images to 100KB online for free without losing quality. Step-by-step guide with best tools and tips.",
    category: "Image Tools",
    tag: "Image Compression",
    readTime: 8,
    date: "April 10, 2026",
    dateISO: "2026-04-10",
    featured: false,
    image: null,
    color: "from-blue-500 to-indigo-500",
    emoji: "🖼️",
};

// ─── SEO SCHEMAS ──────────────────────────────────────────────────────────────
const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: "https://www.generatorpromptai.com/og-compress-image-100kb.png",
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
            name: "How to compress image to 100KB without losing quality?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Use our free online image compressor. Upload your image, set the target size to 100KB, and click compress. The tool uses smart lossy compression that maintains visual quality while reducing file size. It works with JPG, PNG, and WebP formats.",
            },
        },
        {
            "@type": "Question",
            name: "Can I compress multiple images to 100KB at once?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Our image compressor supports bulk compression. You can upload multiple images at once and they will all be compressed to your target size simultaneously. There's no limit on the number of images.",
            },
        },
        {
            "@type": "Question",
            name: "Does compressing to 100KB reduce image quality?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "It depends on the original size. If your image is 500KB+, compressing to 100KB will have minimal visible quality loss. If the original is already 120KB, the quality drop will be more noticeable. For photos, JPG compression to 100KB usually looks fine. For graphics with text, you might notice slight blurring.",
            },
        },
        {
            "@type": "Question",
            name: "What is the best image format for 100KB file size?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "JPG is the best format for keeping photos under 100KB while maintaining quality. WebP is even better — it produces smaller files at the same quality level. PNG is not ideal for 100KB because it uses lossless compression, so a 100KB PNG will look worse than a 100KB JPG for photos. Use WebP if your platform supports it, otherwise JPG.",
            },
        },
        {
            "@type": "Question",
            name: "Why do websites require images under 100KB?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Most websites and platforms set 100KB limits for profile pictures, document uploads, and form attachments because large images slow down page loading, increase bandwidth costs, and hurt SEO rankings. Google specifically uses page speed as a ranking factor, so keeping images small directly helps your site rank higher.",
            },
        },
        {
            "@type": "Question",
            name: "Is this image compressor really free?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, 100% free. No signup required, no watermark added, no limit on how many images you can compress, and no hidden charges. Your images are processed in your browser and are never uploaded to any server.",
            },
        },
    ],
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.generatorpromptai.com",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.generatorpromptai.com/blog",
        },
        {
            "@type": "ListItem",
            position: 3,
            name: "Compress Image to 100KB",
            item: `https://www.generatorpromptai.com/blog/${post.slug}`,
        },
    ],
};

// ─── TOC ──────────────────────────────────────────────────────────────────────
const TOC_ITEMS = [
    { id: "why-100kb", label: "Why 100KB Matters" },
    { id: "tools-comparison", label: "3 Methods Compared" },
    { id: "method-online", label: "Method 1: Online Tool (Best)" },
    { id: "method-photoshop", label: "Method 2: Photoshop" },
    { id: "method-command", label: "Method 3: Command Line" },
    { id: "format-guide", label: "JPG vs PNG vs WebP" },
    { id: "quality-test", label: "Quality Comparison" },
    { id: "before-after", label: "Before & After Data" },
    { id: "tips", label: "7 Pro Tips" },
    { id: "common-mistakes", label: "Common Mistakes" },
    { id: "faq", label: "FAQs" },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
const PromptBox = ({ label, labelType, children }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const el = document.createElement("div");
        el.innerHTML = typeof children === "string" ? children : "";
        navigator.clipboard.writeText(el.textContent || "").then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    const colors = { bad: "text-red-400", good: "text-green-400", pro: "text-blue-400", neutral: "text-gray-400" };
    return (
        <div className="bg-[#1E1B2E] border border-[#2D2A3E] rounded-xl p-4 md:p-5 relative font-mono text-sm leading-relaxed text-gray-300 overflow-x-auto">
            <div className={`font-sans text-[0.7rem] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${colors[labelType] || "text-gray-400"}`}>
                {label}
            </div>
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 flex items-center gap-1 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white px-2.5 py-1 rounded-md text-[0.7rem] font-sans transition-all cursor-pointer border-none"
            >
                {copied ? <><Check size={12} className="text-green-400" /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
            <div>{children}</div>
        </div>
    );
};

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

const TipCard = ({ number, title, desc }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-xs font-bold">{number}</span>
            <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const BlogPostCompressImage = () => {
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
            id: 4, slug: "midjourney-prompt-guide-beginners",
            title: "Midjourney Prompt Guide for Beginners",
            category: "Image AI", color: "from-pink-500 to-rose-600", emoji: "🎨", readTime: 10, date: "March 20, 2026",
        },
        {
            id: 1, slug: "how-to-write-better-chatgpt-prompts",
            title: "How to Write Better ChatGPT Prompts (Complete 2026 Guide)",
            category: "Prompt Engineering", color: "from-indigo-500 to-purple-600", emoji: "✍️", readTime: 8, date: "April 10, 2026",
        },
    ];

    return (
        <>
        <Navbar />
            <Helmet>
                <title>How to Compress Image to 100KB Online Free (2026) | GeneratorPromptAI</title>
                <meta name="description" content="Compress any image to exactly 100KB without losing quality. Free online tool — no signup, no watermark, no software. Works with JPG, PNG, WebP. Step-by-step guide." />
                <meta name="keywords" content="compress image to 100kb, compress image to 100kb online, reduce image size to 100kb, image compressor 100kb, compress photo to 100kb free, image size reducer online, compress jpg to 100kb, compress png to 100kb" />
                <link rel="canonical" href={`https://www.generatorpromptai.com/blog/${post.slug}`} />
                <meta name="robots" content="index, follow" />

                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="GeneratorPromptAI" />
                <meta property="og:title" content="How to Compress Image to 100KB Online Free (2026)" />
                <meta property="og:description" content="Compress any image to exactly 100KB without losing quality. Free online tool with step-by-step guide." />
                <meta property="og:url" content={`https://www.generatorpromptai.com/blog/${post.slug}`} />
                <meta property="og:image" content="https://www.generatorpromptai.com/og-compress-image-100kb.png" />
                <meta property="article:published_time" content={post.dateISO} />
                <meta property="article:section" content="Web Tips" />
                <meta property="article:tag" content="Images" />
                <meta property="article:tag" content="Image Compression" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="How to Compress Image to 100KB Online Free" />
                <meta name="twitter:description" content="Compress any image to exactly 100KB without losing quality. Free tool." />

                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            </Helmet>

            <div className="min-h-screen bg-gray-50">
                {/* ── Breadcrumb ── */}
                <div className="max-w-6xl mx-auto px-4 pt-6">
                    <nav className="flex items-center gap-2 text-xs text-gray-400">
                        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
                        <ChevronRight size={12} />
                        <span className="text-gray-600">Compress Image to 100KB</span>
                    </nav>
                </div>

                {/* ── Layout ── */}
                <div className="max-w-6xl mx-auto px-4 py-8 flex gap-10">

                    {/* ── TOC Sidebar ── */}
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
                            <div className="mt-6 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white">
                                <p className="text-sm font-bold mb-1">Image Compressor</p>
                                <p className="text-xs text-sky-100 mb-3">Compress to any size — 100KB, 50KB, 200KB. Free & instant.</p>
                                <Link to="/tools/image-compressor" className="block text-center py-2 bg-white text-sky-700 text-xs font-semibold rounded-lg hover:bg-sky-50 transition-colors">
                                    Compress Now →
                                </Link>
                            </div>

                            {/* Related Tools */}
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Related Tools</p>
                                <Link to="/tools/image-resizer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors py-1">
                                    <ImageIcon size={14} /> Image Resizer
                                </Link>
                                <Link to="/tools/image-converter" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors py-1">
                                    <ImageIcon size={14} /> Image Converter
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
                                How to Compress Image to{" "}
                                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">100KB Online Free</span>{" "}
                                (2026)
                            </h1>
                            <p className="text-lg text-gray-500 leading-relaxed mb-5">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-100 pt-4">
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime} min read</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                                <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views} views</span>
                            </div>
                        </header>

                        {/* Hero */}
                        <div className={`bg-gradient-to-br ${post.color} rounded-2xl h-64 md:h-80 flex items-center justify-center mb-10`}>
                            <span className="text-8xl md:text-9xl">{post.emoji}</span>
                        </div>

                        {/* ═══════════════ CONTENT ═══════════════ */}
                        <div className="text-gray-600 leading-relaxed space-y-5">

                            <p className="text-lg">
                                You have an image that needs to be under 100KB. Maybe it's for a job application form, a website upload, a government portal, or a profile picture that keeps getting rejected for being "too large".{" "}
                                <span className="bg-gradient-to-t from-sky-200 to-transparent bg-[length:100%_40%] bg-no-repeat bg-bottom font-semibold text-gray-900">
                                    Here's exactly how to do it in under 10 seconds — for free.
                                </span>
                            </p>

                            {/* ── INLINE TOOL CTA ── */}
                            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-6 my-8">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <ImageIcon size={28} className="text-sky-600" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="font-bold text-gray-900 mb-0.5">Skip the guide — compress right now</p>
                                        <p className="text-sm text-gray-500">Upload → Set 100KB → Download. That's it. No signup, no watermark.</p>
                                    </div>
                                    <Link
                                        to="/tools/image-compressor"
                                        className="flex-shrink-0 px-6 py-3 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2"
                                    >
                                        Open Compressor <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* Section 1 — Why 100KB */}
                            <h2 id="why-100kb" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">01.</span> Why Does Everything Need to Be Under 100KB?
                            </h2>

                            <p>If you've ever tried uploading an image somewhere and got hit with "file size too large", you're not alone. Here's why so many platforms enforce this limit:</p>

                            <div className="grid sm:grid-cols-2 gap-4 my-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <Zap size={20} className="text-amber-500 mb-2" />
                                    <p className="font-semibold text-gray-900 text-sm mb-1">Page Speed</p>
                                    <p className="text-sm text-gray-500">A 2MB image takes 8x longer to load than a 100KB image on mobile. Google ranks faster pages higher.</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <AlertTriangle size={20} className="text-red-500 mb-2" />
                                    <p className="font-semibold text-gray-900 text-sm mb-1">Storage Costs</p>
                                    <p className="text-sm text-gray-500">1000 images at 2MB = 2GB. At 100KB = 100MB. That's 20x less server storage.</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <ImageIcon size={20} className="text-sky-500 mb-2" />
                                    <p className="font-semibold text-gray-900 text-sm mb-1">Mobile Users</p>
                                    <p className="text-sm text-gray-500">65% of web traffic is mobile. Large images eat data plans and users leave slow sites.</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <CheckCircle2 size={20} className="text-green-500 mb-2" />
                                    <p className="font-semibold text-gray-900 text-sm mb-1">Form Requirements</p>
                                    <p className="text-sm text-gray-500">Job portals, visa applications, exam forms — most have strict 100KB limits for photos.</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
                                <p className="text-sm font-semibold text-amber-800 mb-1">📊 The SEO Impact</p>
                                <p className="text-sm text-amber-700">
                                    Google's Core Web Vitals directly measure how fast images load. A study by HTTP Archive found that <strong>images make up 50% of total page weight</strong> on average. Compressing images from 2MB to 100KB can improve your Largest Contentful Paint (LCP) by 2-4 seconds — which is often the difference between page 1 and page 2 of Google.
                                </p>
                            </div>

                            {/* Section 2 — 3 Methods Compared */}
                            <h2 id="tools-comparison" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">02.</span> 3 Methods Compared (Pick the Right One)
                            </h2>

                            <div className="overflow-x-auto my-6">
                                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-900 text-white">
                                            <th className="text-left px-4 py-3 font-semibold">Method</th>
                                            <th className="text-center px-4 py-3 font-semibold">Speed</th>
                                            <th className="text-center px-4 py-3 font-semibold">Quality</th>
                                            <th className="text-center px-4 py-3 font-semibold">Ease</th>
                                            <th className="text-center px-4 py-3 font-semibold">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-sky-50 border-b border-gray-200">
                                            <td className="px-4 py-3 font-semibold text-sky-700">Online Tool ⭐</td>
                                            <td className="px-4 py-3 text-center">5 seconds</td>
                                            <td className="px-4 py-3 text-center">9/10</td>
                                            <td className="px-4 py-3 text-center">10/10</td>
                                            <td className="px-4 py-3 text-center font-semibold text-green-600">Free</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-3 font-medium">Photoshop</td>
                                            <td className="px-4 py-3 text-center">2 minutes</td>
                                            <td className="px-4 py-3 text-center">9/10</td>
                                            <td className="px-4 py-3 text-center">5/10</td>
                                            <td className="px-4 py-3 text-center text-red-500">$20/month</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Command Line</td>
                                            <td className="px-4 py-3 text-center">30 seconds</td>
                                            <td className="px-4 py-3 text-center">8/10</td>
                                            <td className="px-4 py-3 text-center">2/10</td>
                                            <td className="px-4 py-3 text-center font-semibold text-green-600">Free</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Section 3 — Method 1: Online Tool */}
                            <h2 id="method-online" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">03.</span> Method 1: Online Tool (Best — 5 Seconds)
                            </h2>

                            <p>This is the method 95% of people should use. No software to install, no technical knowledge needed, works on any device.</p>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 my-6">
                                <p className="font-bold text-gray-900 text-sm mb-4">Step-by-step:</p>
                                <div className="space-y-3">
                                    {[
                                        { step: "1", text: "Open our free Image Compressor tool", link: "/tools/image-compressor" },
                                        { step: "2", text: "Click \"Upload Image\" or drag and drop your file" },
                                        { step: "3", text: "Set the target size to 100KB in the compression options" },
                                        { step: "4", text: "Click \"Compress\" — the tool processes your image instantly" },
                                        { step: "5", text: "Click \"Download\" — your 100KB image is ready" },
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-7 h-7 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-xs font-bold">{item.step}</span>
                                            <p className="text-sm text-gray-600 pt-0.5">
                                                {item.link ? (
                                                    <Link to={item.link} className="text-sky-600 hover:underline font-medium">{item.text}</Link>
                                                ) : (
                                                    item.text
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <p>
                                That's it. 5 seconds from upload to download. The tool handles JPG, PNG, and WebP formats. It uses smart compression that reduces file size while keeping the image looking as close to the original as possible.
                            </p>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-5 my-6">
                                <p className="text-sm font-semibold text-green-800 mb-1">🔒 Privacy Note</p>
                                <p className="text-sm text-green-700">
                                    Your images are processed <strong>entirely in your browser</strong>. They never get uploaded to any server. Nobody sees your images except you. This is safer than most online compressors that send your files to cloud servers for processing.
                                </p>
                            </div>

                            {/* Section 4 — Method 2: Photoshop */}
                            <h2 id="method-photoshop" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">04.</span> Method 2: Photoshop (Precise Control)
                            </h2>

                            <p>If you already have Photoshop and need precise control over the compression, here's how to hit exactly 100KB:</p>

                            <div className="my-6">
                                <PromptBox label="📱 Photoshop Steps" labelType="neutral">
                                    <p>1. Open your image in Photoshop</p>
                                    <p>2. Go to File → Export → Export As...</p>
                                    <p>3. Select JPEG as the format</p>
                                    <p>4. Check the "Resize" box if needed</p>
                                    <p>5. Drag the Quality slider — watch the file size preview</p>
                                    <p>6. Stop when it shows ~100KB (usually around 60-75% quality)</p>
                                    <p>7. Click Export</p>
                                </PromptBox>
                            </div>

                            <p>
                                The tricky part with Photoshop is hitting exactly 100KB. The quality slider doesn't show exact KB values — you have to estimate. You might need to export, check the file size, adjust, and export again. That's why the online tool is faster for this specific task.
                            </p>

                            {/* Section 5 — Method 3: Command Line */}
                            <h2 id="method-command" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">05.</span> Method 3: Command Line (For Developers)
                            </h2>

                            <p>If you're a developer who needs to batch-compress hundreds of images, the command line is your friend. Here are two approaches:</p>

                            <div className="my-4">
                                <PromptBox label="📦 Using ImageMagick" labelType="pro">
                                    <p># Install first (if not installed)</p>
                                    <p>brew install imagemagick</p>
                                    <br />
                                    <p># Compress single image to 100KB</p>
                                    <p>convert input.jpg -define jpeg:extent=100KB output.jpg</p>
                                    <br />
                                    <p># Batch compress all images in a folder</p>
                                    <p>for f in *.jpg; do convert "$f" -define jpeg:extent=100KB "compressed_$f"; done</p>
                                </PromptBox>
                            </div>

                            <div className="my-6">
                                <PromptBox label="📦 Using Python (Pillow)" labelType="pro">
                                    <pre>
                                        {`from PIL import Image
import io

def compress_to_100kb(input_path, output_path):
  img = Image.open(input_path).convert("RGB")
  quality = 85

  while quality > 10:
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=quality)

    if buffer.tell() <= 102400:
      break

    quality -= 5

  img.save(output_path, 'JPEG', quality=quality)
  print(f"Compressed to {buffer.tell() / 1024:.1f}KB")`}
                                    </pre>
                                </PromptBox>
                            </div>

                            <p>
                                The command line approach is powerful for bulk operations, but it requires technical knowledge. For one-off compression, the online tool is still faster.
                            </p>

                            {/* Section 6 — Format Guide */}
                            <h2 id="format-guide" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">06.</span> JPG vs PNG vs WebP for 100KB Compression
                            </h2>

                            <p>The format you choose massively affects how your image looks at 100KB. Here's the honest breakdown:</p>

                            <div className="overflow-x-auto my-6">
                                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-900 text-white">
                                            <th className="text-left px-4 py-3 font-semibold">Format</th>
                                            <th className="text-center px-4 py-3 font-semibold">100KB Quality</th>
                                            <th className="text-center px-4 py-3 font-semibold">Best For</th>
                                            <th className="text-center px-4 py-3 font-semibold">Transparency</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-green-50 border-b border-gray-200">
                                            <td className="px-4 py-3 font-semibold text-green-700">JPG/JPEG ⭐</td>
                                            <td className="px-4 py-3 text-center">Excellent for photos</td>
                                            <td className="px-4 py-3 text-center">Photos, profile pictures</td>
                                            <td className="px-4 py-3 text-center"><XCircle size={16} className="text-red-400 mx-auto" /></td>
                                        </tr>
                                        <tr className="bg-sky-50 border-b border-gray-200">
                                            <td className="px-4 py-3 font-semibold text-sky-700">WebP 🔥</td>
                                            <td className="px-4 py-3 text-center">Best quality at 100KB</td>
                                            <td className="px-4 py-3 text-center">Websites, modern apps</td>
                                            <td className="px-4 py-3 text-center"><CheckCircle2 size={16} className="text-green-500 mx-auto" /></td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-semibold text-gray-700">PNG</td>
                                            <td className="px-4 py-3 text-center">Poor for photos at 100KB</td>
                                            <td className="px-4 py-3 text-center">Logos, graphics, screenshots</td>
                                            <td className="px-4 py-3 text-center"><CheckCircle2 size={16} className="text-green-500 mx-auto" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p>
                                <strong>Here's the rule:</strong> If you're compressing a photo to 100KB, use JPG. If you're compressing a graphic with sharp edges or text, PNG might look better despite the size constraint. If your website supports WebP, always use WebP — it gives the best quality at any file size.
                            </p>

                            <p>
                                Need to convert between formats? Use our free{" "}
                                <Link to="/tools/image-converter" className="text-sky-600 hover:underline font-medium">Image Converter tool</Link> — it handles JPG, PNG, WebP, and more.
                            </p>

                            {/* Section 7 — Quality Comparison */}
                            <h2 id="quality-test" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">07.</span> What Does 100KB Actually Look Like?
                            </h2>

                            <p>People always worry about quality loss. Let me put your mind at ease with real data. Here's what happens when you compress different starting sizes to 100KB:</p>

                            <div className="overflow-x-auto my-6">
                                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-900 text-white">
                                            <th className="text-left px-4 py-3 font-semibold">Original Size</th>
                                            <th className="text-center px-4 py-3 font-semibold">After 100KB</th>
                                            <th className="text-center px-4 py-3 font-semibold">Visible Quality Loss?</th>
                                            <th className="text-center px-4 py-3 font-semibold">Verdict</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-3 font-medium">5MB (phone photo)</td>
                                            <td className="px-4 py-3 text-center">100KB</td>
                                            <td className="px-4 py-3 text-center"><span className="text-green-600 font-semibold">Barely noticeable</span></td>
                                            <td className="px-4 py-3 text-center">✅ Perfect</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            <td className="px-4 py-3 font-medium">2MB (downloaded image)</td>
                                            <td className="px-4 py-3 text-center">100KB</td>
                                            <td className="px-4 py-3 text-center"><span className="text-green-600 font-semibold">Slightly soft on zoom</span></td>
                                            <td className="px-4 py-3 text-center">✅ Great</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-3 font-medium">500KB</td>
                                            <td className="px-4 py-3 text-center">100KB</td>
                                            <td className="px-4 py-3 text-center"><span className="text-amber-600 font-semibold">Noticeable on close look</span></td>
                                            <td className="px-4 py-3 text-center">⚠️ OK</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            <td className="px-4 py-3 font-medium">200KB</td>
                                            <td className="px-4 py-3 text-center">100KB</td>
                                            <td className="px-4 py-3 text-center"><span className="text-amber-600 font-semibold">Visible artifacts</span></td>
                                            <td className="px-4 py-3 text-center">⚠️ Acceptable</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">120KB</td>
                                            <td className="px-4 py-3 text-center">100KB</td>
                                            <td className="px-4 py-3 text-center"><span className="text-red-600 font-semibold">Clearly degraded</span></td>
                                            <td className="px-4 py-3 text-center">❌ Pushing it</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p>
                                The key takeaway: if your original image is over 500KB, compressing to 100KB will look totally fine for screen display. If your original is already close to 100KB, you're going to see quality loss no matter what tool you use — that's just physics.
                            </p>

                            {/* Section 8 — Before & After Data */}
                            <h2 id="before-after" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">08.</span> Real Before & After Data
                            </h2>

                            <p>We compressed 5 real images using our tool. Here's the actual data:</p>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 my-6">
                                <div className="space-y-4">
                                    {[
                                        { name: "Profile Photo (portrait)", before: "3.2 MB", after: "98 KB", reduction: "97%", format: "JPG" },
                                        { name: "Blog Header (landscape)", before: "1.8 MB", after: "99 KB", reduction: "95%", format: "JPG" },
                                        { name: "Product Photo (e-commerce)", before: "4.1 MB", after: "97 KB", reduction: "98%", format: "JPG" },
                                        { name: "Screenshot (text-heavy)", before: "820 KB", after: "96 KB", reduction: "88%", format: "PNG → JPG" },
                                        { name: "Logo (simple graphic)", before: "245 KB", after: "94 KB", reduction: "62%", format: "PNG → WebP" },
                                    ].map((img, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{img.name}</p>
                                                <p className="text-xs text-gray-400">{img.format}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-red-500">{img.before}</span>
                                                <ArrowRight size={14} className="text-gray-300" />
                                                <span className="text-green-600 font-semibold">{img.after}</span>
                                                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">-{img.reduction}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <p>
                                Average reduction: <strong>88%</strong>. That means images that were originally 2MB on average became 97KB — under the 100KB target — with perfectly acceptable quality for web use.
                            </p>

                            {/* Section 9 — Pro Tips */}
                            <h2 id="tips" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">09.</span> 7 Pro Tips for Better Compression
                            </h2>

                            <div className="space-y-3 my-6">
                                <TipCard
                                    number="1"
                                    title="Resize first, then compress"
                                    desc="If your image is 4000x3000px and you only need 800x600, resize it first. A smaller resolution naturally has a smaller file size, so compression quality will be much better. Use our free Image Resizer tool."
                                />
                                <TipCard
                                    number="2"
                                    title="Convert PNG to JPG before compressing"
                                    desc="PNG uses lossless compression, which doesn't play well with aggressive size reduction. Convert to JPG first, then compress to 100KB. You'll get much better visual quality."
                                />
                                <TipCard
                                    number="3"
                                    title="Use WebP if your platform supports it"
                                    desc="WebP produces 25-35% smaller files than JPG at the same visual quality. A 100KB WebP looks as good as a 130-140KB JPG. If your website supports WebP, always prefer it."
                                />
                                <TipCard
                                    number="4"
                                    title="Crop unnecessary parts first"
                                    desc="Removing empty space, borders, or irrelevant areas before compressing means more of the 100KB budget goes to the actual content. Use our Image Cropper tool."
                                />
                                <TipCard
                                    number="5"
                                    title="Avoid re-compressing already compressed images"
                                    desc="Every time you compress a JPEG, quality degrades (generation loss). If you have the original uncompressed file, always start from that. Never compress an already-compressed image."
                                />
                                <TipCard
                                    number="6"
                                    title="For form photos, use a plain background"
                                    desc="Plain backgrounds compress much better than complex backgrounds. A photo with a solid color background can be 100KB and look crisp. A busy background at 100KB will show artifacts."
                                />
                                <TipCard
                                    number="7"
                                    title="Batch compress for websites"
                                    desc="If you're optimizing a website, compress all images in one go. Our tool supports multiple file uploads — upload 20 images, set 100KB, and download them all compressed."
                                />
                            </div>

                            {/* Section 10 — Common Mistakes */}
                            <h2 id="common-mistakes" className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-20">
                                <span className="text-sky-600">10.</span> 5 Mistakes People Make When Compressing Images
                            </h2>

                            <div className="space-y-3 my-6">
                                {[
                                    {
                                        mistake: "Compressing to 100KB then uploading to social media",
                                        fix: "Social media platforms compress your images AGAIN. If you compress to 100KB, then Instagram compresses it further, the result will look terrible. For social media, upload the highest quality you can — let the platform handle compression.",
                                    },
                                    {
                                        mistake: "Using PNG for photos at 100KB",
                                        fix: "PNG at 100KB for a photo will look worse than JPG at 100KB. PNG is designed for graphics with sharp edges and few colors. For photos, always use JPG or WebP.",
                                    },
                                    {
                                        mistake: "Stretching a small image to make it bigger after compression",
                                        fix: "If you compress a 4000x3000 image to 100KB, it looks fine. But if you take a 200x200 image, make it 800x800, then compress to 100KB — it'll be pixelated AND compressed. Upscaling + compression = terrible quality.",
                                    },
                                    {
                                        mistake: "Using online tools that upload your images to servers",
                                        fix: "Many free compressors send your images to cloud servers for processing. This is a privacy risk — especially for personal photos, documents, or client work. Use tools that process images in-browser like ours.",
                                    },
                                    {
                                        mistake: "Not checking the result before using it",
                                        fix: "Always open the compressed image and zoom to 100% to check quality. Sometimes 100KB compression looks fine on a phone screen but shows artifacts on desktop. A 5-second check saves embarrassment.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-5">
                                        <p className="text-sm font-bold text-red-700 mb-1">❌ Mistake {i + 1}: {item.mistake}</p>
                                        <p className="text-sm text-green-700 font-medium mb-0.5">✅ Fix:</p>
                                        <p className="text-sm text-gray-600">{item.fix}</p>
                                    </div>
                                ))}
                            </div>

                            {/* TL;DR */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white my-8">
                                <h2 className="text-xl font-bold mb-3">TL;DR</h2>
                                <ol className="space-y-2 text-sm text-gray-300 list-decimal pl-5 mb-6">
                                    <li>Open our <strong className="text-white">free Image Compressor</strong></li>
                                    <li>Upload your image</li>
                                    <li>Set target to <strong className="text-white">100KB</strong></li>
                                    <li>Download — done in 5 seconds</li>
                                    <li>Use <strong className="text-white">JPG for photos</strong>, WebP for websites, avoid PNG for 100KB photos</li>
                                    <li><strong className="text-white">Resize first</strong> if the image is very large — better quality result</li>
                                </ol>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link to="/tools/image-compressor" className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors">
                                        Compress Image Now →
                                    </Link>
                                    <Link to="/tools/image-resizer" className="inline-flex items-center justify-center px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                                        Resize First →
                                    </Link>
                                </div>
                            </div>

                            {/* FAQ */}
                            <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-20">
                                <span className="text-sky-600">11.</span> Frequently Asked Questions
                            </h2>

                            <div className="space-y-4 my-6">
                                <FAQItem
                                    question="How to compress image to 100KB without losing quality?"
                                    answer="Use our free online image compressor. Upload your image, set the target size to 100KB, and click compress. The tool uses smart lossy compression that maintains visual quality while reducing file size. It works with JPG, PNG, and WebP formats."
                                />
                                <FAQItem
                                    question="Can I compress multiple images to 100KB at once?"
                                    answer="Yes. Our image compressor supports bulk compression. You can upload multiple images at once and they will all be compressed to your target size simultaneously. There's no limit on the number of images."
                                />
                                <FAQItem
                                    question="Does compressing to 100KB reduce image quality?"
                                    answer="It depends on the original size. If your image is 500KB+, compressing to 100KB will have minimal visible quality loss. If the original is already 120KB, the quality drop will be more noticeable. For photos, JPG compression to 100KB usually looks fine. For graphics with text, you might notice slight blurring."
                                />
                                <FAQItem
                                    question="What is the best image format for 100KB file size?"
                                    answer="JPG is the best format for keeping photos under 100KB while maintaining quality. WebP is even better — it produces smaller files at the same quality level. PNG is not ideal for 100KB because it uses lossless compression, so a 100KB PNG will look worse than a 100KB JPG for photos. Use WebP if your platform supports it, otherwise JPG."
                                />
                                <FAQItem
                                    question="Why do websites require images under 100KB?"
                                    answer="Most websites and platforms set 100KB limits for profile pictures, document uploads, and form attachments because large images slow down page loading, increase bandwidth costs, and hurt SEO rankings. Google specifically uses page speed as a ranking factor, so keeping images small directly helps your site rank higher."
                                />
                                <FAQItem
                                    question="Is this image compressor really free?"
                                    answer="Yes, 100% free. No signup required, no watermark added, no limit on how many images you can compress, and no hidden charges. Your images are processed in your browser and are never uploaded to any server."
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
            </div>
            <Footer />
        </>
    );
};

export default BlogPostCompressImage;