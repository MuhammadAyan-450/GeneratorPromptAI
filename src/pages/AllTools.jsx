// pages/AllTools.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import tools from "../data/tools";
import { toolCategories } from "../data/tools";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

const AllTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Back link + header area */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pt-6 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="flex-grow max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            All Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover every free tool we offer — image editors, converters, generators, AI helpers and more.
            <br className="hidden sm:block" />
            100% free • No login • Instant use
          </p>
        </div>

        {/* Search + Category Filters */}
        <div className="mb-12 space-y-6 md:space-y-8">
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search tools — image compressor, AI prompt, QR code, JSON formatter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-5 pl-14 bg-white border border-gray-200 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-lg"
            />
            <Search
              size={24}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Category Pills - horizontal scroll on mobile if many */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 shadow-sm ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200/50"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              All Tools
            </button>

            {toolCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 shadow-sm ${
                  selectedCategory === cat.category
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200/50"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                {cat.category}
                {/* Optional small count badge */}
                {/* <span className="ml-1.5 text-xs opacity-80">({cat.tools.length})</span> */}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-7">
            {filteredTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group bg-white border border-gray-200/70 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Icon area */}
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center mb-5 text-indigo-600 text-3xl shadow-sm">
                  {/* You can later map real icons per tool name/category */}
                  <span aria-hidden="true">🛠️</span>
                </div>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
                    {tool.name}
                  </h3>
                  {/* Optional badge - example */}
                  {/* {tool.name.includes("AI") && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      <Sparkles size={12} /> AI
                    </span>
                  )} */}
                </div>

                <p className="text-gray-600 text-base flex-grow line-clamp-3 mb-5">
                  {tool.description || "Powerful free online utility"}
                </p>

                <div className="mt-auto text-indigo-600 font-semibold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Open Tool
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AllTools;