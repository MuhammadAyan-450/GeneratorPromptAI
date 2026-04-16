// pages/Blog.jsx
import { BLOG_POSTS, CATEGORIES } from "../data/blogData";
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Search, Clock, Tag, ArrowRight, TrendingUp, BookOpen, Rss } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "GeneratorPromptAI Blog",
    url: "https://www.generatorpromptai.com/blog",
    description: "Tips, guides and tutorials on AI prompt engineering, ChatGPT, Claude, Midjourney and free online tools.",
    publisher: {
        "@type": "Organization",
        name: "GeneratorPromptAI",
        url: "https://www.generatorpromptai.com",
    },
    blogPost: BLOG_POSTS.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.dateISO,
        url: `https://www.generatorpromptai.com/blog/${post.slug}`,
        author: { "@type": "Organization", name: "GeneratorPromptAI" },
    })),
};

// ─── Card Component ───────────────────────────────────────────────────────────
const BlogCard = ({ post, featured = false }) => (
    <Link
        to={`/blog/${post.slug}`}
        className={`group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${featured ? "md:flex-row" : ""
            }`}
    >
        {/* Cover */}
        <div
            className={`flex items-center justify-center bg-gradient-to-br ${post.color} ${featured ? "md:w-80 md:flex-shrink-0 h-52 md:h-auto" : "h-44"
                }`}
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
            <h2 className={`font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug mb-3 ${featured ? "text-xl md:text-2xl" : "text-lg"
                }`}>
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
                <title>Blog - AI Prompts, ChatGPT Tips & Free Tool Guides | GeneratorPromptAI</title>
                <meta
                    name="description"
                    content="Read our latest guides on AI prompt engineering, ChatGPT, Claude, Midjourney and free online tools. Tips for Pakistani freelancers, students and professionals."
                />
                <meta
                    name="keywords"
                    content="AI prompt guide, ChatGPT tips, Claude AI blog, prompt engineering tutorial, AI tools for Pakistan, midjourney guide, free tool blog 2026"
                />
                <link rel="canonical" href="https://www.generatorpromptai.com/pages/blog" />
                <meta name="robots" content="index, follow" />

                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="GeneratorPromptAI" />
                <meta property="og:title" content="Blog - AI Prompts, ChatGPT Tips & Tool Guides" />
                <meta property="og:description" content="Guides and tutorials on AI prompt engineering, ChatGPT, Claude, Midjourney and free tools." />
                <meta property="og:url" content="https://www.generatorpromptai.com/pages/blog" />
                <meta property="og:image" content="https://www.generatorpromptai.com/pages/og-blog.png" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="GeneratorPromptAI Blog - AI Tips & Guides" />
                <meta name="twitter:description" content="Guides on ChatGPT, Claude, Midjourney, prompt engineering and free AI tools." />
                <meta name="twitter:image" content="https://www.generatorpromptai.com/pages/og-blog.png" />

                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Helmet>

            <div className="min-h-screen bg-gray-50">

                {/* ── Hero Banner ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">

                        {/* Back */}
                        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors mb-8">
                            <ArrowLeft size={14} /> Back to Home
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen size={20} className="text-indigo-600" />
                                    <span className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Our Blog</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
                                    AI Tips, Guides<br />
                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        & Tutorials
                                    </span>
                                </h1>
                                <p className="text-gray-500 text-lg max-w-xl">
                                    Learn prompt engineering, compare AI models, and get the most out of our free tools. Written for Pakistani freelancers, students, and professionals.
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

                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm text-gray-800 shadow-sm"
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
                                <h2 className="text-lg font-bold text-gray-900">Featured Articles</h2>
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
                                <h2 className="text-lg font-bold text-gray-900">
                                    {featured.length > 0 ? "More Articles" : "All Articles"}
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {regular.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Newsletter / CTA ── */}
                    <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mb-4">
                            <BookOpen size={22} className="text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                            Want more AI tips?
                        </h2>
                        <p className="text-indigo-100 mb-6 max-w-md mx-auto text-sm md:text-base">
                            Browse all our free tools and guides — built for Pakistani freelancers, students, and content creators.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/pages/all-tools"
                                className="px-7 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
                            >
                                Browse All Tools →
                            </Link>
                            <Link
                                to="/tools/chatgpt-prompt-generator"
                                className="px-7 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
                            >
                                Try Prompt Generator
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