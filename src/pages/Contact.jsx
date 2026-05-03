import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Mail, MessageSquare, Github, Twitter } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      name: "Generator PromptAI",
      url: "https://www.generatorpromptai.com",
      contactPoint: {
        "@type": "ContactPoint",
        email: "generatorpromptai@gmail.com",
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: "English",
      },
    },
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Contact Us - Support & Feedback | Generator PromptAI</title>
        <meta
          name="description"
          content="Get in touch with Generator PromptAI. Report a bug, request a new tool, or just say hello. We typically reply within 24 hours."
        />
        <link
          rel="canonical"
          href="https://www.generatorpromptai.com/contact"
        />
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Generator PromptAI
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Got questions? Found a bug? Have a tool idea? Just want to say
              thanks? I read every message personally.
            </p>
          </div>

          {/* Main Contact Card */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 mb-10">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="text-sky-600" size={32} />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us an email
                </h2>
                <p className="text-gray-600">
                  Best and fastest way to reach us. We usually reply within 24
                  hours.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email Address
              </p>
              <a
                href="mailto:generatorpromptai@gmail.com"
                className="text-2xl font-bold text-sky-600 hover:text-sky-700 hover:underline break-words"
              >
                generatorpromptai@gmail.com
              </a>
            </div>
          </div>

          {/* SEO Content Section (Why contact us?) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-sky-50 rounded-2xl">
                <MessageSquare className="text-sky-600 mb-3" size={28} />
                <h4 className="font-bold text-gray-900 mb-2">Report a Bug</h4>
                <p className="text-sm text-gray-600">
                  Found an issue with one of our tools? Let us know so we can
                  fix it immediately.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl">
                <Mail className="text-purple-600 mb-3" size={28} />
                <h4 className="font-bold text-gray-900 mb-2">
                  Tool Suggestions
                </h4>
                <p className="text-sm text-gray-600">
                  Have an idea for a new converter or generator? We love hearing
                  from users.
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-2xl">
                <Twitter className="text-pink-600 mb-3" size={28} />
                <h4 className="font-bold text-gray-900 mb-2">
                  General Inquiry
                </h4>
                <p className="text-sm text-gray-600">
                  Questions about our privacy policy, terms, or business
                  partnerships.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-gray-600 mb-2">
                Generator PromptAI is a project dedicated to providing free,
                accessible AI tools and utilities. We are based in Karachi,
                Pakistan.
              </p>
              <p className="text-sm text-gray-500">
                Please note: We do not provide technical support for 3rd party
                AI models (like OpenAI or Midjourney), but we can help with the
                tools on this website.
              </p>
            </div>
          </div>
          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Free Online Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  to: "/tools/percentage-calculator",
                  title: "Percentage Calculator",
                  desc: "Calculate percentages, percentage increase, decrease and more.",
                },
                {
                  to: "/tools/time-zone-converter",
                  title: "Time Zone Converter",
                  desc: "Convert time between cities and global time zones instantly.",
                },
                {
                  to: "/tools/ad-revenue-calculator",
                  title: "Ad Revenue Calculator",
                  desc: "Estimate ad income from display, native, video, and other ad formats by category.",
                },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {tool.desc}
                  </p>
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

export default Contact;
