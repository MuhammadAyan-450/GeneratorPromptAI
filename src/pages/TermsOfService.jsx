import React from "react";
import { ArrowLeft, FileText, Shield, Gavel, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsOfService = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service",
    url: "https://www.generatorpromptai.com/terms-of-service",
    description: "Terms of Service for Generator PromptAI. Rules regarding free usage, data privacy, intellectual property, and acceptable use.",
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
        <title>Terms of Service - Generator PromptAI</title>
        <meta
          name="description"
          content="Read the Terms of Service for Generator PromptAI. Learn about our free tools, no-warranty policy, and acceptable use guidelines."
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/terms-of-service" />
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

          {/* Main Content Card */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 mb-10">

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Welcome to <strong>Generator PromptAI</strong>. By using any tool on this website, you agree to these simple terms.
            </p>

            <div className="space-y-10">
              {/* 1. Free & No Warranty */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="text-sky-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">1. Free & No Warranty</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  All tools on <strong>Generator PromptAI</strong> are provided completely free of charge. We offer them "as is" without any warranty — express or implied. We do not guarantee that the tools will be uninterrupted, secure, or error-free. Use them at your own risk.
                </p>
              </div>

              {/* 2. No Data Collection */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">2. Data & Privacy</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Most tools run entirely in your browser. We don't store, collect, or transmit any files or personal information. For more details, please read our <Link to="/privacy-policy" className="text-sky-600 hover:underline font-semibold">Privacy Policy</Link>.
                </p>
              </div>

              {/* 3. Acceptable Use */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Gavel className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">3. Acceptable Use</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  You may not use <strong>Generator PromptAI</strong> tools for anything illegal, harmful, or to violate someone else's rights. Do not attempt to abuse, hack, or overload the site.
                </p>
              </div>

              {/* 4. Intellectual Property */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="text-orange-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">4. Intellectual Property</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  The tools, code, and design of <strong>Generator PromptAI</strong> belong to the owner. You can use the output of the tools freely (e.g., converted PDF, generated prompts), but you may not copy, reproduce, or resell the website itself.
                </p>
              </div>

              {/* 5. Changes */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="text-gray-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">5. Changes to Terms</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We may update these terms from time to time. Continued use of the website after changes means you accept them.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Questions? Just email <a href="mailto:generatorpromptai@gmail.com" className="text-sky-600 hover:underline font-semibold">generatorpromptai@gmail.com</a><br />
                Made with honesty in Karachi, Pakistan.
              </p>
            </div>
          </div>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Free Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/time-zone-converter", title: "Time Zone Converter", desc: "Convert time between any cities or time zones worldwide." },
                { to: "/tools/random-number-generator", title: "Random Number Generator", desc: "Generate random numbers for games, statistics, or testing." },
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentages, discounts, markups and more." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-green-600 transition-colors">{tool.title}</h3>
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

export default TermsOfService;