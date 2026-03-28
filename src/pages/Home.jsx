// pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import tools, { toolCategories } from "../data/tools";
import { Search, Sparkles, ArrowRight, Zap } from "lucide-react";

const popularTools = tools.slice(0, 8); // increased a bit
const latestTools = tools.slice(0, 6);

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-gray-50/40 min-h-screen flex flex-col">
        <Navbar />


        {/* ── HERO ── Prominent AI Prompt Generator focus ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/70 to-purple-50/40 pt-20 pb-24 md:pt-28 md:pb-36">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -left-20 top-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute right-10 bottom-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-5 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/40 rounded-full text-sm font-medium text-indigo-700 mb-6">
              <Sparkles size={18} className="text-indigo-500" />
              New – AI Prompt Generator
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Free AI Prompt{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Generator
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
              Free AI Prompt Generator – for ChatGPT, Claude, Youtube and Midjourney. Plus access 30+ powerful free online tools.            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <Link
                to="/tools/ai-agent"  // ← change this to your real path
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-9 py-5 rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-200/40 hover:shadow-indigo-300/50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Zap size={22} />
                Generate AI Prompts Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/pages/all-tools"
                className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-indigo-300 text-gray-800 px-9 py-5 rounded-2xl font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                Explore All Tools
              </Link>
            </div>

            <p className="mt-10 text-sm text-gray-500">
              100% free • No login • Works with all major AI models • Made with love in Karachi
            </p>
          </div>
        </section>

        {/* ── Quick Search ── */}
        <section className="py-16 md:py-20 px-5 bg-white/70 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Find the Perfect Tool
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Image tools, converters, generators, calculators — search anything.
            </p>

            <div className="relative max-w-3xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools — e.g. image compressor, qr code, ai prompt, pdf converter..."
                className="w-full px-7 py-6 pl-16 text-lg bg-white border border-gray-200 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
              <Search
                size={26}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {searchTerm.trim() && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-8">
                  {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""} for “{searchTerm}”
                </h3>

                {filteredTools.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.slice(0, 6).map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="group bg-white border border-gray-200/80 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300"
                      >
                        <h4 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors mb-3">
                          {tool.name}
                        </h4>
                        <p className="text-gray-600 line-clamp-3">
                          {tool.description || "Useful free online tool"}
                        </p>
                        <div className="mt-5 text-indigo-600 font-medium inline-flex items-center gap-2 group-hover:gap-3">
                          Open Tool <ArrowRight size={18} />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-xl">
                    No matching tools. Try different keywords.
                  </p>
                )}

                {filteredTools.length > 6 && (
                  <div className="mt-10">
                    <Link
                      to="/pages/all-tools"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg inline-flex items-center gap-2"
                    >
                      See all {filteredTools.length} results <ArrowRight size={18} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Popular Tools ── */}
        <section className="py-20 px-5 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-14">
            Popular Tools Right Now
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {popularTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group bg-white border border-gray-200/70 rounded-2xl p-7 shadow hover:shadow-2xl hover:border-indigo-200/70 transition-all duration-300 flex flex-col"
              >
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors mb-4">
                  {tool.name}
                </h3>
                <p className="text-gray-600 flex-grow mb-5">
                  {tool.description}
                </p>
                <div className="mt-auto text-indigo-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Launch Tool <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/pages/all-tools"
              className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              View All Tools <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* ── Latest Tools ── (optional - can remove if not needed) */}
        <section className="py-20 px-5 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-14">
            Recently Added Tools
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {latestTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group bg-white border border-gray-200/70 rounded-2xl p-7 shadow hover:shadow-xl hover:border-indigo-200 transition-all"
              >
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 mb-4">
                  {tool.name}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-5">{tool.description}</p>
                <div className="text-indigo-600 font-medium inline-flex items-center gap-2 group-hover:gap-3">
                  Try Now <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Blog Teaser ── keep or remove depending on actual blog content */}
        <section className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 py-20 px-5">
          <div className="max-w-7xl mx-auto">

            {/* Section Title */}
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900">
                AI Tools Guides & Tutorials
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Learn how to use AI tools, write powerful prompts, and optimize
                your workflow with our expert guides and tutorials.
              </p>
              <p className="text-center font-bold text-gray-900 mt-14">Coming soon</p>
            </div>
          </div>
        </section>

        <Footer />

      </div>
    </>
  );
};


export default Home;