import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import tools, { toolCategories } from "../data/tools";
import { Search, Sparkles, ArrowRight, Zap, TrendingUp, Clock, Star } from "lucide-react";

const popularTools = tools.slice(0, 8);
const latestTools = tools.slice(0, 6);

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Schema.org structured data for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Tools Hub - Free AI Prompt Generator & Online Tools",
    "url": "https://generatorpromptai.com/",
    "description": "Free AI Prompt Generator for ChatGPT, Claude, YouTube and Midjourney. Access 30+ powerful free online tools including image converters, calculators, and generators.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://generatorpromptai.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Free AI Prompt Generator & 30+ Online Tools | AI Tools Hub</title>
        <meta 
          name="description" 
          content="Free AI Prompt Generator for ChatGPT, Claude, YouTube and Midjourney. Access 30+ powerful free online tools including image converters, PDF tools, QR generators, and calculators. No login required." 
        />
        <meta 
          name="keywords" 
          content="AI prompt generator, ChatGPT prompts, Claude AI, Midjourney prompts, free online tools, image converter, PDF tools, QR code generator, free tools" 
        />
        <link rel="canonical" href="https://generatorpromptai.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/" />
        <meta property="og:title" content="Free AI Prompt Generator & 30+ Online Tools" />
        <meta property="og:description" content="Generate perfect AI prompts for ChatGPT, Claude & Midjourney. Plus 30+ free tools - no login required." />
        <meta property="og:image" content="https://generatorpromptai.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://generatorpromptai.com/" />
        <meta property="twitter:title" content="Free AI Prompt Generator & 30+ Online Tools" />
        <meta property="twitter:description" content="Generate perfect AI prompts for ChatGPT, Claude & Midjourney. Plus 30+ free tools - no login required." />
        <meta property="twitter:image" content="https://generatorpromptai.com/twitter-image.jpg" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="AI Tools Hub" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="bg-gray-50/40 min-h-screen flex flex-col">
        <Navbar />
        
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* HERO SECTION - Enhanced with better visual hierarchy */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/70 to-purple-50/40 pt-20 pb-24 md:pt-32 md:pb-40">
          {/* Animated background gradients */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -left-20 top-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute right-10 bottom-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute left-1/2 top-1/2 w-72 h-72 bg-indigo-200 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-5 text-center">
            {/* Badge - More prominent */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-indigo-200/50 rounded-full text-sm font-semibold text-indigo-700 mb-8 shadow-lg shadow-indigo-100/50 hover:shadow-xl transition-shadow duration-300">
              <Sparkles size={18} className="text-indigo-500 animate-pulse" />
              ✨ New – AI Prompt Generator Now Live
            </div>

            {/* Main Heading - Improved typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-7">
              Free AI Prompt{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Generator & Tools
              </span>
            </h1>

            {/* Subheading - Better readability */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Generate perfect prompts for <strong>ChatGPT, Claude, YouTube & Midjourney</strong>.
              <br className="hidden sm:block" />
              Plus access <strong>30+ powerful free online tools</strong> – no login required.
            </p>

            {/* CTA Buttons - Enhanced design */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 mb-12">
              <Link
                to="/tools/ai-agent"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white px-10 py-6 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-300/40 hover:shadow-indigo-400/60 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
              >
                <Zap size={24} className="animate-pulse" />
                Generate AI Prompts Now
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
              </Link>

              <Link
                to="/pages/all-tools"
                className="group inline-flex items-center justify-center gap-3 bg-white/95 backdrop-blur-sm border-2 border-gray-200 hover:border-indigo-400 text-gray-800 hover:text-indigo-700 px-10 py-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore All Tools
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">No Login Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">All Major AI Models</span>
              </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-black text-indigo-600 mb-1">30+</div>
                <div className="text-sm text-gray-600 font-medium">Free Tools</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-3xl font-black text-purple-600 mb-1">100K+</div>
                <div className="text-sm text-gray-600 font-medium">Users Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-pink-600 mb-1">4.9★</div>
                <div className="text-sm text-gray-600 font-medium">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SEARCH SECTION - Enhanced UI */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Find Your Perfect Tool
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Search from our collection of image tools, converters, generators, and calculators
            </p>

            {/* Enhanced search bar */}
            <div className="relative max-w-3xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tools – try 'image compressor', 'qr code', 'ai prompt', 'pdf converter'..."
                  className="w-full px-7 py-7 pl-16 text-lg bg-white border-2 border-gray-200 rounded-3xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300"
                  aria-label="Search tools"
                />
                <Search
                  size={28}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Search Results */}
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
                          {tool.description || "Useful free online tool"}
                        </p>
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                          Open Tool 
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
                      Try different keywords or browse all our tools below
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
        {/* POPULAR TOOLS SECTION - Enhanced grid */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm mb-4">
              <TrendingUp size={18} />
              Trending Now
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Most Popular Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The tools our users love the most – tried, tested, and trusted
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularTools.map((tool, index) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-7 shadow-md hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-2"
              >
                {/* Popular badge for top 3 */}
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
                    Launch Tool 
                    <ArrowRight size={18} />
                  </div>
                </div>

                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/50 transition-all duration-500 rounded-2xl -z-10"></div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/pages/all-tools"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-300/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              View All {tools.length} Tools 
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* LATEST TOOLS SECTION - Fresh additions */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 max-w-7xl mx-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-3xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm mb-4">
              <Clock size={18} />
              Fresh & New
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Recently Added Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out our newest additions – more tools added regularly
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {latestTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:border-green-300 transition-all duration-300 hover:-translate-y-2"
              >
                {/* NEW badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
                    NEW
                  </span>
                </div>

                <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-700 mb-4 pr-16 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-6">
                  {tool.description}
                </p>
                <div className="text-green-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Try Now 
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* FEATURES/BENEFITS SECTION - New addition */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Why Choose Our Tools?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built with simplicity, speed, and user experience in mind
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  description: "All tools are optimized for speed and performance. No waiting around."
                },
                {
                  icon: "🔒",
                  title: "100% Secure",
                  description: "Your data stays private. We don't store any of your files or information."
                },
                {
                  icon: "🎯",
                  title: "Easy to Use",
                  description: "Simple, intuitive interfaces. No technical knowledge required."
                },
                {
                  icon: "💰",
                  title: "Always Free",
                  description: "No hidden fees, no subscriptions. All tools are completely free forever."
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
        {/* BLOG/GUIDES SECTION - Enhanced */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-indigo-50 via-purple-50/40 to-pink-50/30 py-20 md:py-24 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                AI Tools Guides & Tutorials
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Learn how to use AI tools effectively, write powerful prompts, and optimize
                your workflow with our expert guides and tutorials
              </p>
            </div>

            {/* Coming Soon Card */}
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-3xl p-12 text-center shadow-xl">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Coming Very Soon!
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                We're preparing comprehensive guides on AI prompting, tool tutorials, and productivity tips. Stay tuned!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input 
                  type="email" 
                  placeholder="Enter your email for updates"
                  className="px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                  aria-label="Email for updates"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* CTA SECTION - Final call to action */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-24 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Boost Your Productivity?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95">
              Start using our free AI prompt generator and 30+ tools today. No sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/tools/ai-agent"
                className="group inline-flex items-center justify-center gap-3 bg-white text-indigo-600 hover:bg-gray-50 px-10 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <Zap size={24} />
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/pages/all-tools"
                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-10 py-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Browse All Tools
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
