// pages/AllTools.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import tools from "../data/tools";
import { toolCategories } from "../data/tools";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight } from "lucide-react";   // ← Yeh zaroori hai

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
        {/* Back link */}
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
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid - Using Your Home Page Card UI Exactly */}
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
                    {tool.description || "Powerful free online utility"}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-indigo-600 font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      Launch Tool 
                      <ArrowRight size={18} />
                    </div>
                  </div>

                  {/* Hover gradient effect (same as your home card) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/50 transition-all duration-500 rounded-2xl -z-10"></div>
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