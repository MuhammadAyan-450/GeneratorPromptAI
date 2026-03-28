import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Helmet } from "react-helmet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass =
    "text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200";

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                GeneratorPromptAI
              </span>
              <Sparkles
                size={20}
                className="text-purple-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/pages/all-tools" className={navLinkClass}>All Tools</Link>
              <Link to="/about" className={navLinkClass}>About</Link>
              <Link to="/privacy-policy" className={navLinkClass}>Privacy Policy</Link>
              <Link to="/contact" className={navLinkClass}>Contact</Link>
            </div>
            
            {/* Mobile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isOpen ? (
                <X size={26} className="text-gray-700" />
              ) : (
                <Menu size={26} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex flex-col px-4 py-3 space-y-3">
            <Link onClick={() => setIsOpen(false)} to="/pages/all-tools" className={navLinkClass}>
              All Tools
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/about" className={navLinkClass}>
              About
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/privacy-policy" className={navLinkClass}>
              Privacy Policy
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/contact" className={navLinkClass}>
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
