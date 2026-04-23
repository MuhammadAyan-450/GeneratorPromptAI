import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import tools, { toolCategories } from "../data/tools";
import { BLOG_POSTS } from "../data/blogData";
import { Search, Sparkles, ArrowRight, Zap, TrendingUp, Clock, Star, ChevronDown } from "lucide-react";

const popularTools = tools.slice(0, 8);
const latestTools = tools.slice(0, 6);
const latestPosts = BLOG_POSTS.slice(0, 6);

const faqItems = [
  {
    question: "How to generate AI prompts for ChatGPT without signup?",
    answer: "Simply visit our AI Prompt Builder tool, select your AI model (ChatGPT, Claude, Midjourney, or YouTube), choose a category, describe your goal, and click generate. The entire process is free and requires no account creation or login."
  },
  {
    question: "What is the best free JSON formatter and validator online?",
    answer: "Our JSON Formatter tool lets you paste, format, validate, and minify JSON data instantly in your browser. It highlights syntax errors, supports tree view, and works without any server-side processing – your data never leaves your device."
  },
  {
    question: "How to compress image without losing quality online?",
    answer: "Use our Image Compressor tool to reduce file size while maintaining visual quality. Upload PNG, JPG, or WebP images, adjust the compression level, and download the optimized version. The tool uses smart compression algorithms to find the best quality-to-size ratio."
  },
  {
    question: "How to convert image to base64 encoding for free?",
    answer: "Our Image to Base64 Converter lets you drag and drop any image file and instantly get the base64 encoded string. This is useful for embedding images in HTML, CSS, or JSON. Supports PNG, JPG, SVG, GIF, and WebP formats."
  },
  {
    question: "Can I generate QR code with custom logo for free?",
    answer: "Yes, our QR Code Generator allows you to create QR codes for URLs, text, Wi-Fi, and more. You can customize colors, add a logo overlay, and download in PNG or SVG format – completely free with no watermarks."
  },
  {
    question: "How to convert timestamp to human readable date online?",
    answer: "Our Unix Timestamp Converter tool converts Unix timestamps to readable dates and vice versa. It supports both seconds and milliseconds, shows multiple date formats simultaneously, and works with your local timezone automatically."
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Generator Prompt AI - Free Online Tools",
    "url": "https://www.generatorpromptai.com/",
    "description": "Free online tools including JSON formatter, image compressor, base64 encoder, QR code generator, and AI prompt builder. No signup required.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.generatorpromptai.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Free Online Tools Collection",
    "description": "A curated collection of 30+ free online tools for developers, designers and content creators",
    "numberOfItems": popularTools.length,
    "itemListElement": popularTools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": tool.name,
      "description": tool.description,
      "url": `https://www.generatorpromptai.com${tool.path}`
    }))
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Generator Prompt AI",
    "url": "https://www.generatorpromptai.com/",
    "description": "Free online tools platform offering 30+ browser-based utilities for developers, designers and content creators"
  };

  return (
    <>
      <Helmet>
        <title>Free JSON Formatter, Image Compressor & AI Prompt Builder Online | No Signup</title>
        <meta
          name="description"
          content="Use 30+ free online tools: JSON formatter & validator, image compressor without losing quality, base64 encoder decoder, QR code generator with logo, AI prompt builder for ChatGPT. No signup, no installation – 100% browser-based."
        />
        <meta
          name="keywords"
          content="free JSON formatter online, image compressor without losing quality, base64 image encoder decoder, QR code generator with logo free, AI prompt builder for ChatGPT, free online word counter with reading time, CSS box shadow generator tool, pixel to rem converter online, timestamp to date converter, UUID generator online free, password generator with special characters, slug generator from text, Lorem ipsum generator, color picker from image online, text case converter online, hash generator MD5 SHA256, number to words converter, binary to text converter, roman numeral converter online, percentage calculator increase decrease, age calculator exact years months days, tip calculator split bill, unit conversion calculator, temperature converter celsius fahrenheit, gradient CSS generator, text to morse code converter, invisible character remover, word frequency counter, HTML to markdown converter, JSON to CSV converter"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.generatorpromptai.com/" />
        <meta property="og:title" content="Free JSON Formatter, Image Compressor & 30+ Online Tools – No Signup" />
        <meta property="og:description" content="JSON formatter, image compressor, base64 encoder, QR generator, AI prompt builder and 30+ free tools. Works in browser – no signup needed." />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-image.jpg" />
        <meta property="og:site_name" content="Generator Prompt AI" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.generatorpromptai.com/" />
        <meta property="twitter:title" content="Free JSON Formatter, Image Compressor & 30+ Online Tools" />
        <meta property="twitter:description" content="JSON formatter, image compressor, base64 encoder, QR generator, AI prompt builder and 30+ free tools. No signup needed." />
        <meta property="twitter:image" content="https://www.generatorpromptai.com/twitter-image.jpg" />

        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="author" content="Generator Prompt AI" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />

        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>

      <div className="bg-gray-50/40 min-h-screen flex flex-col">
        <Navbar />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* HERO SECTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/70 to-purple-50/40 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -left-20 top-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute right-10 bottom-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute left-1/2 top-1/2 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-5 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-indigo-200/50 rounded-full text-sm font-semibold text-indigo-700 mb-8 shadow-lg shadow-indigo-100/50 hover:shadow-xl transition-shadow duration-300">
              <Sparkles size={18} className="text-indigo-500 animate-pulse" />
              ✨ AI Prompt Builder & 30+ Free Tools – No Signup
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-7">
              Free Online Tools –{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                JSON Formatter, Image Resizer & AI Prompt Builder
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Format JSON, compress images without losing quality, encode base64, generate QR codes with logo,
              and build AI prompts for ChatGPT – all <strong>free, fast & no signup required</strong>.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 mb-12">
              <Link
                to="/tools/ai-agent"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-10 py-6 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-300/40 hover:shadow-indigo-400/60 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
              >
                <Zap size={24} className="animate-pulse" />
                Open AI Prompt Builder
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
              </Link>

              <Link
                to="/pages/all-tools"
                className="group inline-flex items-center justify-center gap-3 bg-white/95 backdrop-blur-sm border-2 border-gray-200 hover:border-indigo-400 text-gray-800 hover:text-indigo-700 px-10 py-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Browse All 30+ Free Tools
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">No Login or Signup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Works in Browser – No Install</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SEARCH SECTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Search Free Online Tools Instantly
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Find JSON formatter, image compressor, base64 converter, QR code maker, word counter, and more
            </p>

            <div className="relative max-w-3xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Try 'JSON formatter', 'image compressor', 'QR code generator', 'base64 encoder'..."
                  className="w-full px-7 py-7 pl-16 text-lg bg-white border-2 border-gray-200 rounded-3xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300"
                  aria-label="Search free online tools"
                />
                <Search
                  size={28}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {searchTerm.trim() && (
              <div className="mt-16 animate-fadeIn">
                <div className="flex items-center justify-center gap-3 mb-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""}
                  </h3>
                  <span className="text-gray-500 text-xl">for</span>
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                    "{searchTerm}"
                  </span>
                </div>

                {filteredTools.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.slice(0, 6).map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="group bg-white border-2 border-gray-100 rounded-2xl p-7 shadow-md hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-2 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {tool.name}
                          </h4>
                          <Star size={20} className="text-gray-300 group-hover:text-yellow-400 transition-colors" />
                        </div>
                        <p className="text-gray-600 line-clamp-3 mb-5">
                          {tool.description || "Free online tool – no signup required"}
                        </p>
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                          Open Tool Free
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200">
                    <p className="text-gray-600 text-xl mb-4">
                      😕 No matching tools found
                    </p>
                    <p className="text-gray-500">
                      Try different keywords or browse all our free tools below
                    </p>
                  </div>
                )}

                {filteredTools.length > 6 && (
                  <div className="mt-12">
                    <Link
                      to="/pages/all-tools"
                      className="inline-flex items-center gap-3 text-indigo-600 hover:text-indigo-800 font-bold text-lg bg-indigo-50 hover:bg-indigo-100 px-8 py-4 rounded-full transition-all duration-300"
                    >
                      See all {filteredTools.length} results
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* POPULAR TOOLS SECTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm mb-4">
              <TrendingUp size={18} />
              Most Used Free Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Popular Free Online Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands – format JSON, compress images, encode base64, generate QR codes and more
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularTools.map((tool, index) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-7 shadow-md hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-2"
              >
                {index < 3 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    #{index + 1}
                  </div>
                )}

                <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors mb-4 pr-8">
                  {tool.name}
                </h3>
                <p className="text-gray-600 flex-grow mb-6 line-clamp-3">
                  {tool.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-indigo-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Use Free Tool
                    <ArrowRight size={18} />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/50 transition-all duration-500 rounded-2xl -z-10"></div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/pages/all-tools"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-300/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              View All {tools.length} Free Tools
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* LATEST TOOLS SECTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 max-w-7xl mx-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-3xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-4">
              <Clock size={18} />
              Just Added
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              New Free Tools Added
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fresh tools added regularly – try the latest free online utilities
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {latestTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:border-green-300 transition-all duration-300 hover:-translate-y-2"
              >
                {/* ✅ Removed animate-pulse — replaced with static badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    NEW
                  </span>
                </div>

                <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 mb-4 pr-16 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-6">
                  {tool.description}
                </p>
                <div className="text-green-700 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Try Free Tool
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* FEATURES SECTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Why Use Our Free Online Tools?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every tool is built for speed, privacy and simplicity – no installs, no accounts
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  description: "All tools run in your browser for instant results. No server processing delays."
                },
                {
                  icon: "🔒",
                  title: "Private & Secure",
                  description: "Your files and data never leave your device. No server uploads, no tracking."
                },
                {
                  icon: "🎯",
                  title: "No Signup Needed",
                  description: "Open any tool and start using it immediately. No account, no email, no friction."
                },
                {
                  icon: "💰",
                  title: "Free Forever",
                  description: "No hidden fees, no premium tiers, no subscriptions. Every tool stays 100% free."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:border-indigo-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* FAQ SECTION – Low competition question-based keywords */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 bg-gradient-to-br from-gray-50/80 to-indigo-50/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Quick answers about our free online tools, AI prompt builder, and how to use them
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-200 transition-colors duration-300 shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    <ChevronDown
                      size={24}
                      className={`text-indigo-500 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* BLOG SECTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-indigo-50 via-purple-50/40 to-pink-50/30 py-20 md:py-24 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Free Tools Guides & Tutorials
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Learn how to use JSON formatter, compress images, build AI prompts, and get the most
                from our free online tools with step-by-step guides
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-40 flex items-center justify-center bg-gradient-to-br ${post.color}`}>
                    <span className="text-5xl">{post.emoji}</span>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 group-hover:text-indigo-600 transition">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{post.date}</span>
                      <span className="text-indigo-600 font-medium group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/blog"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                View All Guides →
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* CTA SECTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Start Using Free Online Tools Now
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95">
              Open JSON formatter, image compressor, AI prompt builder and 30+ more tools. Zero signup, zero cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/tools/ai-agent"
                className="group inline-flex items-center justify-center gap-3 bg-white text-indigo-600 hover:bg-gray-50 px-10 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <Zap size={24} />
                Open AI Prompt Builder
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/pages/all-tools"
                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-10 py-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Browse All Free Tools
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;