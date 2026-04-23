// pages/Blog.jsx
import { BLOG_POSTS, CATEGORIES } from "../data/blogData";
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Search, Clock, ArrowRight, TrendingUp, BookOpen, Rss, ChevronDown, Home } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqItems = [
  {
    question: "How to use JSON formatter and validator to fix syntax errors?",
    answer: "Simply paste your raw JSON data into our free JSON Formatter tool. It will automatically validate the syntax and highlight exact errors with line and column numbers. You can then click 'Beautify' to fix indentation or 'Minify' to compress it for production use."
  },
  {
    question: "What is prompt engineering and how to write better AI prompts?",
    answer: "Prompt engineering is the process of structuring instructions for AI models (like ChatGPT and Claude) to get accurate and useful responses. To write better prompts: be specific about the output format, provide context, assign a role (e.g., 'Act as an expert developer'), and use our AI Prompt Generator tool to build structured prompts automatically."
  },
  {
    question: "How to compress images without losing quality for free?",
    answer: "Upload your image to our free Image Compressor tool. Use the quality slider to adjust the compression level (usually 70-80% gives the best balance). The tool compresses the file size by up to 90% while keeping the visual quality almost identical. It works with JPG, PNG, and WebP formats."
  },
  {
    question: "How to encode images to Base64 for HTML and CSS?",
    answer: "Open our free Base64 Encoder tool, upload your image (or drag and drop), and it will instantly convert the image into a Base64 encoded string. You can then copy this string and use it directly in your HTML <img> tag (src=`data:image/png;base64, YOUR_CODE`) or in your CSS background-image property."
  },
  {
    question: "What is the difference between Claude and ChatGPT prompts?",
    answer: "While both are powerful AI models, Claude generally performs better with long, detailed analytical tasks and following strict formatting rules. ChatGPT excels at creative writing, brainstorming, and coding assistance. Our dedicated Claude Prompt Generator and ChatGPT Prompt Generator tools are specifically tuned to use the best structures for each model."
  },
  {
    question: "How to generate strong passwords that are easy to remember?",
    answer: "Use our free Password Generator tool to create a random password of at least 16 characters, including uppercase, lowercase, numbers, and symbols. To make it memorable, you can use the 'Passphrase' method: combine 3-4 random words with numbers and symbols (e.g., 'Blue-Tiger-99!Jump'). Our tool can help you generate these securely."
  }
];

const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Free Online Tools Guides & AI Prompt Tutorials",
    "url": "https://www.generatorpromptai.com/blog",
    "description": "Step-by-step guides on how to use JSON formatter, image compressor, Base64 encoder, and AI prompt builders for ChatGPT, Claude, and Midjourney.",
    "publisher": {
        "@type": "Organization",
        "name": "GeneratorPromptAI",
        "url": "https://www.generatorpromptai.com",
    },
    "blogPost": BLOG_POSTS.map((post) => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.dateISO,
        "url": `https://www.generatorpromptai.com/blog/${post.slug}`,
        "author": { "@type": "Organization", "name": "GeneratorPromptAI" },
    })),
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.generatorpromptai.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools Guides & AI Tutorials Blog",
        "item": "https://www.generatorpromptai.com/blog"
      }
    ]
};

// ─── Card Component ───────────────────────────────────────────────────────────
const BlogCard = ({ post, featured = false }) => (
    <Link
        to={`/blog/${post.slug}`}
        className={`group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${featured ? "md:flex-row" : ""}`}
    >
        {/* Cover */}
        <div
            className={`flex items-center justify-center bg-gradient-to-br ${post.color} ${featured ? "md:w-80 md:flex-shrink-0 h-52 md:h-auto" : "h-44"}`}
        >
            <span className={featured ? "text-7xl" : "text-5xl"}>{post.emoji}</span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
            {/* Category + tag */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                    {post.category}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    #{post.tag}
                </span>
                {featured && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full ml-auto">
                        ⭐ Featured
                    </span>
                )}
            </div>

            {/* Title */}
            <h2 className={`font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug mb-3 ${featured ? "text-xl md:text-2xl" : "text-lg"}`}>
                {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime} min read
                    </span>
                    <span>{post.date}</span>
                </div>
                <span className="flex items-center gap-1 text-indigo-500 font-medium group-hover:gap-2 transition-all">
                    Read <ArrowRight size={13} />
                </span>
            </div>
        </div>
    </Link>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Blog = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [openFaq, setOpenFaq] = useState(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return BLOG_POSTS.filter((post) => {
            const matchCat = category === "All" || post.category === category;
            const matchSearch = !q ||
                post.title.toLowerCase().includes(q) ||
                post.excerpt.toLowerCase().includes(q) ||
                post.tag.toLowerCase().includes(q);
            return matchCat && matchSearch;
        });
    }, [search, category]);

    const featured = filtered.filter((p) => p.featured);
    const regular = filtered.filter((p) => !p.featured);

    return (
        <>
            <Navbar />
            <Helmet>
                <title>Free Tools Guides & AI Prompt Engineering Tutorials – Step-by-Step How-To Articles</title>
                <meta
                    name="description"
                    content="Learn how to use JSON formatter, compress images without losing quality, encode Base64, and write AI prompts for ChatGPT & Claude. Step-by-step free tools tutorials and prompt engineering guides."
                />
                <meta
                    name="keywords"
                    content="how to use JSON formatter online, how to compress image without losing quality, how to encode image to base64 HTML, prompt engineering step by step guide, how to write better ChatGPT prompts for coding, Claude vs ChatGPT prompt differences, how to use QR code generator with logo, free online tools tutorials for beginners, how to validate JSON syntax errors, best password generator settings"
                />
                <link rel="canonical" href="https://www.generatorpromptai.com/blog" />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="GeneratorPromptAI" />
                <meta property="og:title" content="Free Tools Guides & AI Prompt Engineering Tutorials" />
                <meta property="og:description" content="Step-by-step guides on JSON formatting, image compression, Base64 encoding, and building AI prompts for ChatGPT & Claude." />
                <meta property="og:url" content="https://www.generatorpromptai.com/blog" />
                <meta property="og:image" content="https://www.generatorpromptai.com/og-blog.png" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Free Tools Guides & AI Prompt Tutorials" />
                <meta name="twitter:description" content="Learn how to use free online tools and write better AI prompts with our step-by-step tutorials." />
                <meta name="twitter:image" content="https://www.generatorpromptai.com/og-blog.png" />

                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
                <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            </Helmet>

            <div className="min-h-screen bg-gray-50">

                {/* ── Breadcrumb ── */}
                <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 pt-6">
                        <ol className="flex items-center gap-2 text-sm text-gray-500">
                            <li>
                                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                                    <Home size={14} /> Home
                                </Link>
                            </li>
                            <li><span className="text-gray-300">/</span></li>
                            <li><span className="text-gray-900 font-semibold">Tools Guides & Tutorials</span></li>
                        </ol>
                    </div>
                </nav>

                {/* ── Hero Banner ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen size={20} className="text-indigo-600" />
                                    <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Guides & Tutorials</span>
                                </div>
                                
                                {/* SEO OPTIMIZED H1 */}
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
                                    Free Tools Guides &{" "}
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        AI Prompt Engineering Tutorials
                                    </span>
                                </h1>
                                
                                <p className="text-gray-500 text-lg max-w-2xl">
                                    Learn how to use <strong>JSON formatter</strong>, <strong>compress images without losing quality</strong>, <strong>encode Base64</strong>, and build powerful prompts for ChatGPT & Claude. Step-by-step guides for developers, freelancers, and content creators.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 flex-shrink-0">
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold text-gray-900">{BLOG_POSTS.length}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Articles</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold text-gray-900">{CATEGORIES.length - 1}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Categories</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className="max-w-6xl mx-auto px-4 py-10">

                    {/* Search + Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* Search with better placeholder */}
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search guides — 'how to format JSON', 'image compression tips', 'prompt engineering'..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm text-gray-800 shadow-sm"
                                aria-label="Search blog tutorials and guides"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${category === cat
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    {(search || category !== "All") && (
                        <p className="text-sm text-gray-400 mb-6">
                            {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
                            {search && <> for "<strong className="text-gray-600">{search}</strong>"</>}
                            {category !== "All" && <> in <strong className="text-gray-600">{category}</strong></>}
                        </p>
                    )}

                    {/* No results */}
                    {filtered.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-5xl mb-4">🔍</p>
                            <p className="text-xl font-bold text-gray-800 mb-2">No articles found</p>
                            <p className="text-gray-500 text-sm">Try a different search term or category.</p>
                            <button
                                onClick={() => { setSearch(""); setCategory("All"); }}
                                className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* ── Featured Posts ── */}
                    {featured.length > 0 && (
                        <section className="mb-12">
                            <div className="flex items-center gap-2 mb-5">
                                <TrendingUp size={17} className="text-amber-500" />
                                {/* SEO OPTIMIZED H2 */}
                                <h2 className="text-lg font-bold text-gray-900">Featured Tool Guides & AI Tutorials</h2>
                            </div>
                            <div className="flex flex-col gap-5">
                                {featured.map((post) => (
                                    <BlogCard key={post.id} post={post} featured />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Regular Posts Grid ── */}
                    {regular.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-5">
                                <Rss size={17} className="text-indigo-500" />
                                {/* SEO OPTIMIZED H2 */}
                                <h2 className="text-lg font-bold text-gray-900">
                                    All Free Tool Tutorials & Prompt Engineering Articles
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {regular.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── FAQ Section (Low Comp Question Keywords) ── */}
                    <section className="mt-16">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 text-center">
                                Common "How To" Questions Answered
                            </h2>
                            <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
                                Quick answers to common questions about using free online tools and writing AI prompts
                            </p>

                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-200 transition-colors duration-300 shadow-sm"
                                    >
                                        <button
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            className="w-full flex items-center justify-between p-5 text-left"
                                            aria-expanded={openFaq === index}
                                        >
                                            <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">
                                                {item.question}
                                            </h3>
                                            <ChevronDown
                                                size={22}
                                                className={`text-indigo-500 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                                        >
                                            <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                    {/* ── Newsletter / CTA ── */}
                    <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mb-4">
                            <BookOpen size={22} className="text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                            Ready to Use These Free Tools?
                        </h2>
                        <p className="text-indigo-100 mb-6 max-w-md mx-auto text-sm md:text-base">
                            Put these tutorials into practice — open our JSON formatter, image compressor, or AI prompt builder and start working smarter.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/pages/all-tools"
                                className="px-7 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
                            >
                                Browse All 35+ Free Tools →
                            </Link>
                            <Link
                                to="/tools/chatgpt-prompt-generator"
                                className="px-7 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
                            >
                                Open AI Prompt Builder
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blog;