import React from "react";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: "https://www.generatorpromptai.com/privacy-policy",
    description: "Privacy Policy for Generator PromptAI. We do not collect personal data. All tools run client-side in your browser.",
    mainEntity: {
      "@type": "Organization",
      name: "Generator PromptAI",
      url: "https://www.generatorpromptai.com"
    }
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Privacy Policy - Generator PromptAI</title>
        <meta
          name="description"
          content="Generator PromptAI Privacy Policy. We respect your privacy. We do not collect personal data, and all file processing happens in your browser."
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/privacy-policy" />
        <meta name="robots" content="index, follow" />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-20">

        {/* Nav Back */}
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500">
              Last updated: April 2026
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 mb-10">

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At <strong>Generator PromptAI</strong>, we take your privacy very seriously. Here is the simple truth about how our platform works:
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <Lock className="text-green-600 shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">We don't collect personal information</h3>
                  <p className="text-gray-600 text-sm">We don't ask for your name, email, or phone number to use our tools.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Eye className="text-sky-600 shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">We don't use tracking cookies</h3>
                  <p className="text-gray-600 text-sm">We do not use invasive tracking cookies or analytics that identify you personally.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Database className="text-purple-600 shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Client-side processing</h3>
                  <p className="text-gray-600 text-sm">All tools on <strong>Generator PromptAI</strong> are 100% client-side. Your files (images, PDFs) are processed in your browser and never leave your device.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">What data do we collect?</h2>
            <p className="text-gray-600 mb-4">
              Nothing that can identify you. We may see anonymous usage statistics (like how many people use the Image Compressor), but that is it. No IP addresses, no emails, no names.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Third-party services</h2>
            <p className="text-gray-600 mb-4">
              Some tools use open-source libraries (like Tesseract.js for OCR), but these also run completely in your browser. No data is sent to external servers unless the tool clearly says so (e.g., Currency Converter fetches public exchange rates).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use essential cookies only to ensure the website functions correctly (e.g., remembering your preferences). We do not use advertising or tracking cookies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Changes to this policy</h2>
            <p className="text-gray-600 mb-4">
              If we ever make any changes, we will update this page and the date above. Since we don't collect personal data, future changes are unlikely to affect your privacy.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Made with honesty in Karachi, Pakistan.<br />
                If you have any questions — just email <a href="mailto:generatorpromptai@gmail.com" className="text-sky-600 hover:underline font-semibold">generatorpromptai@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Online Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentages, percentage increase, decrease and more." },
                { to: "/tools/time-zone-converter", title: "Time Zone Converter", desc: "Convert time between cities and global time zones instantly." },
                { to: "/tools/random-number-generator", title: "Random Number Generator", desc: "Generate random numbers for games, statistics, or testing." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;