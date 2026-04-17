import React from "react";
import { ArrowLeft, FileText, Shield, Gavel, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        {/* ✅ SEO Optimized */}
        <title>Terms of Service | GeneratorPromptAI</title>

        <meta
          name="description"
          content="Read the Terms of Service for GeneratorPromptAI. Understand rules, acceptable use, and legal policies for using our free online tools."
        />

        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />

        <link rel="canonical" href="https://www.generatorpromptai.com/terms-of-service" />

        {/* ✅ Open Graph */}
        <meta property="og:title" content="Terms of Service | GeneratorPromptAI" />
        <meta property="og:description" content="Terms and conditions for using GeneratorPromptAI tools." />
        <meta property="og:url" content="https://www.generatorpromptai.com/terms-of-service" />
        <meta property="og:type" content="article" />

        {/* ✅ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            url: "https://www.generatorpromptai.com/terms-of-service",
            description: "Legal terms for using GeneratorPromptAI tools",
            isPartOf: {
              "@type": "WebSite",
              name: "GeneratorPromptAI",
              url: "https://www.generatorpromptai.com"
            }
          })}
        </script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-20">

        {/* Back */}
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 text-sm"
            aria-label="Go to homepage"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
              <FileText className="text-sky-600" size={32} />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>

            <p className="text-gray-500">
              Last updated: April 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 mb-10">

            <p className="text-lg text-gray-700 mb-8">
              Welcome to <strong>GeneratorPromptAI</strong>. By using any tool on this website, you agree to these terms.
            </p>

            {/* Hidden SEO */}
            <p className="sr-only">
              terms of service generatorpromptai, website terms and conditions, acceptable use policy,
              legal terms free online tools, privacy and usage rules generatorpromptai
            </p>

            <div className="space-y-10">

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="text-sky-600" size={24} />
                  <h2 className="text-2xl font-bold">1. Free & No Warranty</h2>
                </div>
                <p className="text-gray-600">
                  All tools are provided free of charge and "as is". We do not guarantee uninterrupted or error-free service.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold">2. Data & Privacy</h2>
                </div>
                <p className="text-gray-600">
                  We do not store or collect your files. Read our{" "}
                  <Link to="/privacy-policy" className="text-sky-600 underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Gavel className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold">3. Acceptable Use</h2>
                </div>
                <p className="text-gray-600">
                  Do not use this website for illegal or harmful activities.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="text-orange-600" size={24} />
                  <h2 className="text-2xl font-bold">4. Intellectual Property</h2>
                </div>
                <p className="text-gray-600">
                  You may use outputs freely, but you cannot copy or resell this website.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="text-gray-600" size={24} />
                  <h2 className="text-2xl font-bold">5. Changes</h2>
                </div>
                <p className="text-gray-600">
                  We may update these terms anytime.
                </p>
              </div>

            </div>

            {/* Internal Linking */}
            <p className="text-gray-600 text-sm mt-8">
              Try our{" "}
              <Link to="/tools/pdf-compressor" className="text-sky-600 underline">
                PDF Compressor
              </Link>{" "}
              and{" "}
              <Link to="/tools/image-compressor" className="text-sky-600 underline">
                Image Compressor
              </Link>{" "}
              tools.
            </p>

            <div className="mt-10 text-center text-gray-600">
              Contact:{" "}
              <a href="mailto:generatorpromptai@gmail.com" className="text-sky-600 underline">
                generatorpromptai@gmail.com
              </a>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsOfService;