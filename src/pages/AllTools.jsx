// pages/AllTools.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, Home } from "lucide-react";
import tools from "../data/tools";
import { toolCategories } from "../data/tools";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const faqItems = [
  {
    question: "How many free online tools are available on this website?",
    answer: "We offer 35+ free online tools across 12 categories including image tools (compressor, resizer, cropper, converter, OCR), text tools (JSON formatter, word counter, case converter), generators (QR code, password, UUID, Lorem Ipsum), calculators (age, currency, percentage, time zone), AI tools (ChatGPT, Claude, Midjourney prompt generators), and developer tools (Base64 encoder, URL encoder, timestamp converter, fake data generator). All tools are 100% free and work directly in your browser."
  },
  {
    question: "Do I need to create an account to use these free tools?",
    answer: "No, none of our tools require any signup, login, or account creation. Simply open any tool and start using it immediately. There are no hidden paywalls or premium tiers – every tool is completely free forever."
  },
  {
    question: "Are my files and data safe when using these online tools?",
    answer: "Yes, your privacy is our priority. Most of our tools (like JSON formatter, password generator, Base64 encoder, case converter, and all calculators) process everything directly in your browser – your data never leaves your device. For image tools that require file uploads, files are processed in your browser session and are not stored on any server."
  },
  {
    question: "What is the best free image compressor without losing quality?",
    answer: "Our Image Compressor tool reduces JPG, PNG, and WebP file sizes by up to 90% without noticeable quality loss. You can adjust the compression level with a slider and compare the original vs compressed image side by side before downloading. It works entirely in your browser with no server upload required."
  },
  {
    question: "Can I use these tools on mobile phones and tablets?",
    answer: "Yes, all our tools are fully responsive and work on any device with a modern web browser – including smartphones, tablets, laptops, and desktops. There is no app to download; just open the tool URL in your mobile browser and start using it."
  },
  {
    question: "How to generate strong passwords with special characters for free?",
    answer: "Use our Password Generator tool to create secure random passwords. You can customize the length (up to 128 characters), and toggle uppercase letters, lowercase letters, numbers, and special characters on or off. The tool also shows a real-time password strength meter so you know how secure your password is. Copy it with one click."
  }
];

const AllTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.seoTitle || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // BreadcrumbList Schema
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
        "name": "All Free Online Tools",
        "item": "https://www.generatorpromptai.com/pages/all-tools"
      }
    ]
  };

  // Main ItemList Schema with all tools
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Complete Collection of Free Online Tools",
    "description": "35+ free browser-based tools for image editing, text processing, code formatting, password generation, unit conversion, and AI prompt building",
    "numberOfItems": tools.length,
    "itemListElement": tools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": tool.name,
      "description": tool.description,
      "url": `https://www.generatorpromptai.com${tool.path}`
    }))
  };

  // Category-wise ItemList schemas
  const categorySchemas = toolCategories
    .filter(cat => cat.tools.length > 0)
    .map(cat => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Free ${cat.category}`,
      "numberOfItems": cat.tools.length,
      "itemListElement": cat.tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": tool.name,
        "url": `https://www.generatorpromptai.com${tool.path}`
      }))
    }));

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SEO META TAGS */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Helmet>
        <title>35+ Free Online Tools – JSON Formatter, Image Compressor, QR Generator, AI Prompts</title>
        <meta
          name="description"
          content="Browse 35+ free online tools: JSON formatter & validator, image compressor without losing quality, QR code generator with logo, password generator, word counter with reading time, Base64 encoder decoder, UUID generator, age calculator, currency converter, and AI prompt builders for ChatGPT, Claude & Midjourney. No signup, no install – works in browser."
        />
        <meta
          name="keywords"
          content="free online tools collection, JSON formatter validator, image compressor without losing quality, QR code generator with logo free, password generator with special characters, word counter with reading time, Base64 encoder decoder online, UUID generator v4 free, age calculator exact years months days, currency converter live rates, percentage calculator increase decrease, Lorem Ipsum generator with HTML, fake data generator for testing, sitemap XML generator, timestamp to date converter, case converter uppercase lowercase, remove duplicate lines online, email validator syntax check, Claude prompt generator, Midjourney prompt builder, ChatGPT prompt maker, YouTube script prompt generator"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/pages/all-tools" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.generatorpromptai.com/pages/all-tools" />
        <meta property="og:title" content="35+ Free Online Tools – JSON Formatter, Image Compressor, QR Generator & More" />
        <meta property="og:description" content="Browse our complete collection of 35+ free browser-based tools. JSON formatter, image tools, generators, calculators, AI prompt builders – no signup needed." />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-image.jpg" />
        <meta property="og:site_name" content="Generator Prompt AI" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.generatorpromptai.com/pages/all-tools" />
        <meta property="twitter:title" content="35+ Free Online Tools – No Signup Required" />
        <meta property="twitter:description" content="JSON formatter, image compressor, QR generator, password maker, AI prompt builders and 30+ more free tools." />
        <meta property="twitter:image" content="https://www.generatorpromptai.com/twitter-image.jpg" />

        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="author" content="Generator Prompt AI" />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        {categorySchemas.map((schema, i) => (
          <script type="application/ld+json" key={`cat-${i}`}>{JSON.stringify(schema)}</script>
        ))}
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* BREADCRUMB – SEO + UX */}

        {/* Back link */}
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pt-2 pb-4 mt-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pb-20">
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* HERO SECTION – SEO Optimized Headings */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="text-center mb-10 md:mb-14">
            {/* Tool count badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold text-sm mb-6">
              🛠️ {tools.length} Free Tools Available
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-5 leading-tight">
              All Free Online Tools –{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                No Signup Required
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Browse our complete collection of {tools.length}+ free browser-based tools:
              <strong> JSON formatter & validator</strong>,
              <strong> image compressor without losing quality</strong>,
              <strong> QR code generator with logo</strong>,
              <strong> password generator</strong>,
              <strong> word counter with reading time</strong>,
              <strong> Base64 encoder decoder</strong>,
              <strong> AI prompt builders for ChatGPT & Claude</strong>,
              and more. 100% free • No login • Instant use
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SEARCH + CATEGORY FILTERS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="mb-12 space-y-6 md:space-y-8">
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools — 'JSON formatter', 'image compressor', 'QR code', 'password generator', 'Base64 encoder'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-5 pl-14 bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition text-lg"
                  aria-label="Search free online tools"
                />
                <Search
                  size={24}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 shadow-sm ${
                  selectedCategory === "All"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200/50 shadow-lg"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                All Tools ({tools.length})
              </button>

              {toolCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 shadow-sm ${
                    selectedCategory === cat.category
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200/50 shadow-lg"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md"
                  }`}
                >
                  {cat.category} ({cat.tools.length})
                </button>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* CATEGORY HEADING – SEO H2 */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {selectedCategory !== "All" && (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Free {selectedCategory} – {filteredTools.length} Tools
              </h2>
              <p className="text-gray-500 mt-2">
                Browse all free {selectedCategory.toLowerCase()} – click any tool to start using it instantly
              </p>
            </div>
          )}

          {searchTerm.trim() && (
            <div className="mb-8 flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""}
              </h2>
              <span className="text-gray-400">for</span>
              <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full font-semibold text-lg">
                "{searchTerm}"
              </span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TOOLS GRID */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {filteredTools.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6 opacity-40">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No tools found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search term or select a different category.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group relative bg-white border-2 border-gray-100 rounded-2xl p-7 shadow-md hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-2"
                >
                  {index < 3 && selectedCategory === "All" && !searchTerm.trim() && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      #{index + 1}
                    </div>
                  )}

                  {/* Category tag */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors mb-4">
                    {tool.name}
                  </h3>

                  <p className="text-gray-600 flex-grow mb-6 line-clamp-3">
                    {tool.description || "Free online tool – no signup required"}
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
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* FAQ SECTION – Low competition question keywords */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {!searchTerm.trim() && (
            <section className="mt-24 mb-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-center">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                  Common questions about our free online tools – how they work, privacy, and device support
                </p>

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
                        className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
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
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllTools;