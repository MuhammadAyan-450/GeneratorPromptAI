import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { toolCategories } from "../data/tools";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                GeneratorPromptAI
              </span>
              <Sparkles
                size={18}
                className="text-purple-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
              />
            </Link>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Free AI prompt generator and powerful Free online tools for creators,
              developers and marketers. Generate prompts for ChatGPT, Claude,
              Youtube and Midjourney instantly.
            </p>

            <p className="text-sm text-gray-500">
              Built with ❤️ in Karachi, Pakistan
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">

              <li>
                <Link to="/all-tools" className="text-gray-600 hover:text-indigo-600 transition">
                  All Tools
                </Link>
              </li>

              <li>
                <Link to="/tools/ai-agent" className="text-gray-600 hover:text-indigo-600 transition">
                  AI Prompt Generator
                </Link>
              </li>

              <li>
                <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition">
                  About
                </Link>
              </li>

              <li>
                <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition">
                  Contact
                </Link>
              </li>

               <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-indigo-600 transition">
                  Privacy Policy
                </Link>
              </li>

               <li>
                <Link to="/terms-of-service" className="text-gray-600 hover:text-indigo-600 transition">
                  Terms of Service
                </Link>
              </li>

            </ul>
          </div>

          {/* Tool Categories */}
          {toolCategories.slice(0, 3).map((cat) => (
            <div key={cat.category}>
              <h4 className="font-bold text-gray-900 text-lg mb-5">
                {cat.category}
              </h4>

              <ul className="space-y-3 text-sm">
                {cat.tools.slice(0, 4).map((tool) => (
                  <li key={tool.path}>
                    <Link
                      to={tool.path}
                      className="text-gray-600 hover:text-indigo-600 transition"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}

                {cat.tools.length > 5 && (
                  <li>
                    <Link
                      to={`/category/${cat.category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      + {cat.tools.length - 5} more
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}

          {/* Contact / Social */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 text-lg mb-5">
              Stay Connected
            </h4>

            <p className="text-gray-600 text-sm mb-6">
              Get updates about new AI tools and prompt engineering tips.
            </p>
          </div>
        </div>

        {/* SEO Description Block */}
        <div className="mt-16 max-w-4xl mx-auto text-center text-gray-600 text-sm leading-relaxed">
          <p>
            GeneratePromptAI is a powerful AI prompt generator that helps you
            create optimized prompts for ChatGPT, Claude, Youtube and Midjourney.
            Our platform also offers a collection of free of cost online tools including
            image converters, developer utilities, QR code generator , JsonFormatter and many
            productivity tools.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} GeneratePromptAI. All rights reserved.
          </p>

          <div className="mt-3 flex justify-center gap-6 text-xs">

            <Link to="/privacy-policy" className="hover:text-indigo-600">
              Privacy Policy
            </Link>

            <Link to="/terms-of-service" className="hover:text-indigo-600">
              Terms of Service
            </Link>

            <Link to="/sitemap.xml" className="hover:text-indigo-600">
              Sitemap
            </Link>

            <span>Made with ❤️ in Karachi, Pakistan</span>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;