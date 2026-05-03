import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Mail,
  ArrowUp,
} from "lucide-react";
import { toolCategories } from "../data/tools";

const Footer = () => {
  const topTools = [
    { path: "/tools/ai-image-generator", name: "Free AI Image Generator" },
    { path: "/tools/base64-encode", name: "Base64 Encoder & Decoder" },
    { path: "/tools/lorem-ipsum-generator", name: "Lorem Ipsum Generator" },
    { path: "/tools/adsense-revenue-calculator", name: "AdSense Revenue Calculator" },
    { path: "/tools/youtube-ad-revenue-calculator", name: "YouTube Ad Revenue Calculator" },
    { path: "/tools/pdf-compressor", name: "Compress PDF Files Free" },
    { path: "/tools/json-formatter", name: "JSON Formatter & Validator" },
    { path: "/tools/uuid-generator", name: "Free UUID Generator Online" },
    { path: "/tools/qr-code-generator", name: "QR Code Generator" },
    { path: "/tools/password-generator", name: "Strong Password Generator" },
    { path: "/tools/ai-agent", name: "ChatGPT Prompt Generator" },
    { path: "/tools/midjourney-prompt-generator", name: "Midjourney Prompt Builder" },
  ];

  const resourceLinks = [
    { path: "/pages/all-tools", name: "Browse All Free Tools" },
    { path: "/blog", name: "Blog & Tutorials" },
    { path: "/about", name: "About Us" },
    { path: "/contact", name: "Contact Us" },
    { path: "/privacy-policy", name: "Privacy Policy" },
    { path: "/terms-of-service", name: "Terms of Service" },
    { path: "https://www.generatorpromptai.com/sitemap.xml", name: "XML Sitemap", external: true },
  ];

  const seoLinks = [
    { path: "/blog/how-to-calculate-cpm", name: "How to Calculate CPM Guide" },
    { path: "/blog/how-to-generate-lorem-ipsum-text-custom-length", name: "How to Generate Lorem Ipsum" },
    { path: "/tools/cpm-calculator", name: "Free CPM Calculator Online" },
    { path: "/tools/cpc-calculator", name: "Free CPC Calculator Tool" },
    { path: "/tools/ad-revenue-calculator", name: "Ad Revenue Estimator" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-8 md:pt-14 md:pb-10">

        {/* ── Back to Top ── */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            <ArrowUp size={14} /> Back to Top
          </button>
        </div>

        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-gray-200 dark:border-gray-800">

          {/* ── Brand Column ── */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <Sparkles size={30} className="text-purple-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                GeneratorPromptAI
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Free AI prompt generators and powerful online tools for creators, developers, and marketers. No signup, no limits.
            </p>

            {/* Email Contact */}
            <a
              href="mailto:generatorpromptai@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Mail size={15} />
              generatorpromptai@gmail.com
            </a>
          </div>

          {/* ── Popular Tools ── */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-sm">
              {topTools.map((tool) => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.path} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Tool Categories ── */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-4">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {toolCategories.map((cat) => (
                <li key={cat.category}>
                  <Link
                    to={`/pages/all-tools#${cat.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat.category}{" "}
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">({cat.tools.length})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Learn & Legal Interlinks ── */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-4">
              Learn & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              {seoLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── SEO Description Block ── */}
        <div className="pb-5 text-center pt-5">
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-3xl mx-auto">
            GeneratorPromptAI offers 30+ free online tools including AI prompt generators for ChatGPT, Claude, and Midjourney, plus image converters, text utilities, developer tools, SEO tools, calculators, and more. No signup required. Built with ❤️ in Karachi, Pakistan.
          </p>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
          <p>
            © {new Date().getFullYear()} GeneratorPromptAI. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-y-0">
            <Link to="/privacy-policy" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/about" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
              Contact
            </Link>
            <Link to="https://www.generatorpromptai.com/sitemap.xml" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;