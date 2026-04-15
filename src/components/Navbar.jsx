// components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { toolCategories } from "../data/tools";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-indigo-600 transition-colors";

  // Flatten all tools into one array for the grid
  const allTools = toolCategories.flatMap((cat) =>
    cat.tools.map((tool) => ({ ...tool, category: cat.category }))
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              GeneratorPromptAI
            </span>
            <Sparkles
              size={18}
              className="text-purple-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-8">

            {/* All Tools dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm"
              >
                All Tools
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* ── Mega Dropdown ── */}
              {dropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[780px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      All Tools
                      <span className="ml-2 text-xs text-gray-400 font-normal">({allTools.length} tools)</span>
                    </p>
                    <Link
                      to="/pages/all-tools"
                      onClick={() => setDropdownOpen(false)}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      View All →
                    </Link>
                  </div>

                  {/* Tools grid — all in rows */}
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {toolCategories.map((cat) => (
                      <div key={cat.category} className="mb-6 last:mb-0">
                        {/* Category label */}
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                          {cat.category}
                        </p>
                        {/* Tools in a responsive grid row */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
                          {cat.tools.map((tool) => (
                            <Link
                              key={tool.path}
                              to={tool.path}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
                            >
                              {tool.icon && (
                                <span className="text-base flex-shrink-0">{tool.icon}</span>
                              )}
                              <span className="truncate">{tool.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <Link
                      to="/pages/all-tools"
                      onClick={() => setDropdownOpen(false)}
                      className="text-sm text-indigo-600 hover:underline font-medium"
                    >
                      Browse all {allTools.length} tools →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/" className={`${isActive("/")} text-sm`}>Home</Link>
            <Link to="/blog" className={`${isActive("/blog")} text-sm`}>Blogs</Link>
            <Link to="/about" className={`${isActive("/about")} text-sm`}>About</Link>
            <Link to="/privacy-policy" className={`${isActive("/privacy-policy")} text-sm`}>Privacy</Link>
            <Link to="/contact" className={`${isActive("/contact")} text-sm`}>Contact</Link>

          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-4">

            {/* Primary links */}
            <div className="flex flex-col gap-1 mb-4">
              {[
                { to: "/about", label: "About" },
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* All Tools accordion */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => setMobileExpanded(!mobileExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
              >
                <span>All Tools <span className="text-xs text-gray-400 font-normal">({allTools.length})</span></span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-200 ${mobileExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {mobileExpanded && (
                <div className="mt-2 space-y-4">
                  {toolCategories.map((cat) => (
                    <div key={cat.category} className="px-2">
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-2 mb-2">
                        {cat.category}
                      </p>
                      {/* Tools in 2-column grid on mobile */}
                      <div className="grid grid-cols-2 gap-1">
                        {cat.tools.map((tool) => (
                          <Link
                            key={tool.path}
                            to={tool.path}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {tool.icon && <span className="flex-shrink-0">{tool.icon}</span>}
                            <span className="truncate">{tool.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="px-4 pb-2">
                    <Link
                      to="/pages/all-tools"
                      className="block text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                      View All {allTools.length} Tools
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;