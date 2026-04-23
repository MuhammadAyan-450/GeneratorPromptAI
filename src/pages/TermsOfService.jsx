import React from "react";
import { ArrowLeft, FileText, Shield, Gavel, RefreshCw, Users, AlertTriangle, Globe, Lock, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | GeneratorPromptAI — Free Online Tools</title>

        <meta
          name="description"
          content="Read the complete Terms of Service for GeneratorPromptAI. Understand your rights, acceptable use policies, data handling rules, and legal protections when using our free online tools."
        />
        <meta
          name="keywords"
          content="terms of service generatorpromptai, website terms and conditions, acceptable use policy for free online tools, user agreement generatorpromptai, legal terms free tools website, generatorpromptai terms conditions"
        />
        <meta name="robots" content="index, follow, max-snippet:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://www.generatorpromptai.com/terms-of-service" />

        <meta property="og:title" content="Terms of Service | GeneratorPromptAI" />
        <meta property="og:description" content="Complete Terms of Service for GeneratorPromptAI free online tools." />
        <meta property="og:url" content="https://www.generatorpromptai.com/terms-of-service" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Terms of Service | GeneratorPromptAI" />
        <meta name="twitter:description" content="Complete Terms of Service for GeneratorPromptAI." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service",
            "url": "https://www.generatorpromptai.com/terms-of-service",
            "description": "Complete Terms of Service for GeneratorPromptAI free online tools.",
            "isPartOf": {
              "@type": "WebSite",
              "name": "GeneratorPromptAI",
              "url": "https://www.generatorpromptai.com"
            },
            "dateModified": "2026-04-20"
          })}
        </script>
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-20">

        {/* Back */}
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 text-sm transition-colors"
            aria-label="Go to homepage"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
              <FileText className="text-sky-600" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Terms of Service
            </h1>
            <p className="text-gray-500 text-lg">
              Last updated: April 20, 2026
            </p>
            <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Globe size={12} /> English</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1"><Clock size={12} /> 8 min read</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <Link to="/privacy-policy" className="flex items-center gap-1 hover:text-sky-600 transition-colors"><Lock size={12} /> Privacy Policy</Link>
            </div>
          </div>

          {/* Hidden SEO text */}
          <p className="sr-only">
            terms of service generatorpromptai, website terms and conditions, acceptable use policy for free online tools,
            user agreement generatorpromptai, legal terms free tools website, generatorpromptai terms conditions,
            disclaimer free online tools, liability limitation generatorpromptai, intellectual property rights online tools,
            terms of use for ai tools, generatorpromptai legal terms
          </p>

          {/* Content */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm">

            {/* Agreement Banner */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-10">
              <p className="text-gray-700 text-sm leading-relaxed">
                By accessing or using any tool on{" "}
                <strong className="text-gray-900">GeneratorPromptAI</strong>{" "}
                (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must not use the Service.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-xl p-5 mb-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Table of Contents</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "1. Service Description",
                  "2. Acceptance of Terms",
                  "3. User Accounts",
                  "4. Acceptable Use Policy",
                  "5. Intellectual Property Rights",
                  "6. User-Generated Content",
                  "7. Data & Privacy",
                  "8. Disclaimer of Warranties",
                  "9. Limitation of Liability",
                  "10. Indemnification",
                  "11. Third-Party Links",
                  "12. Modifications to Terms",
                  "13. Termination",
                  "14. Governing Law",
                  "15. Contact Information",
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`#section-${i + 1}`}
                    className="text-sm text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12">

              {/* 1 */}
              <section id="section-1">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <h2 className="text-xl font-bold text-gray-900">Service Description</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  GeneratorPromptAI provides free online tools including but not limited to: PDF tools (compressor, converter, merger), image tools (compressor, converter, resizer, cropper, background remover), text tools (word counter, case converter, Lorem Ipsum generator, JSON formatter), developer tools (UUID generator, Base64 encoder, timestamp converter), and AI tools (ChatGPT prompt generator, Claude prompt generator, Midjourney prompt generator).
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The tools are provided for personal and commercial use at no cost. We reserve the right to modify, suspend, or discontinue any tool at any time without prior notice.
                </p>
              </section>

              {/* 2 */}
              <section id="section-2">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <h2 className="text-xl font-bold text-gray-900">Acceptance of Terms</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  By using our Service, you confirm that you are at least 13 years of age and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Your continued use of the Service after any changes to these Terms constitutes acceptance of the revised Terms.
                </p>
              </section>

              {/* 3 */}
              <section id="section-3">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <h2 className="text-xl font-bold text-gray-900">User Accounts</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Most tools on GeneratorPromptAI do not require an account. For features that do require account creation, you agree to:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc mb-3">
                  <li>Provide accurate and complete registration information</li>
                  <li>Keep your password confidential and not share it with anyone</li>
                  <li>Maintain the security of your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activity under your account</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  We are not liable for any loss or damage arising from your failure to protect your account credentials.
                </p>
              </section>

              {/* 4 */}
              <section id="section-4">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  <h2 className="text-xl font-bold text-gray-900">Acceptable Use Policy</h2>
                </div>

                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>You must not use the Service to:</strong>
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  {[
                    { text: "Upload content that is illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable", icon: "🚫" },
                    { text: "Infringe on anyone's intellectual property rights, including copyrights, trademarks, or patents", icon: "🚫" },
                    { text: "Distribute malware, viruses, or any code designed to damage systems", icon: "🚫" },
                    { text: "Attempt to gain unauthorized access to our systems, servers, or databases", icon: "🚫" },
                    { text: "Use the Service for any purpose that violates applicable local, state, national, or international law", icon: "🚫" },
                    { text: "Interfere with or disrupt the Service's infrastructure or other users' experience", icon: "🚫" },
                    { text: "Scrape, extract, or data-mine our website content without written permission", icon: "🚫" },
                    { text: "Resell, sublicense, or redistribute our tools or their output as a service", icon: "🚫" },
                  ].map((item, i) => (
                    <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2.5">
                      <span className="text-sm flex-shrink-0">{item.icon}</span>
                      <p className="text-sm text-gray-700">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Violation consequence:</strong> We reserve the right to restrict or terminate your access to the Service immediately and without warning if we determine you have violated these terms. We may also report violations to relevant authorities if required by law.
                    </p>
                  </div>
                </div>
              </section>

              {/* 5 */}
              <section id="section-5">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                  <h2 className="text-xl font-bold text-gray-900">Intellectual Property Rights</h2>
                </div>
                <ul className="space-y-3 text-gray-600 text-sm pl-6 list-disc">
                  <li>The GeneratorPromptAI name, logo, website design, and code are our intellectual property and are protected by applicable copyright, trademark, and other intellectual property laws.</li>
                  <li>You may not copy, reproduce, modify, distribute, or create derivative works from our website, tools, or branding without our written permission.</li>
                  <li>You retain all rights to any content you upload or generate using our tools (your original files, your text prompts, your converted documents). We do not claim ownership of your uploaded files or generated outputs.</li>
                  <li>We do not claim any ownership rights over AI-generated prompts or text produced by our tools. You are free to use, modify, and distribute outputs as you see fit.</li>
                </ul>
              </section>

              {/* 6 */}
              <section id="section-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
                  <h2 className="text-xl font-bold text-gray-900">User-Generated Content & File Handling</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  <strong>What happens to your files:</strong>
                </p>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc mb-4">
                  <li>Your files are processed in your browser whenever possible — they are not uploaded to our servers unless the specific tool requires server-side processing.</li>
                  <li>For tools that require server processing (such as AI prompt generation), files are temporarily processed and automatically deleted after a short period.</li>
                  <li>We do not view, read, analyze, store, or share your uploaded files with third parties.</li>
                  <li>You are solely responsible for the content you upload and ensure you have the right to process it.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Your responsibility:</strong> You must ensure that any content you submit does not violate any third-party rights or applicable laws. We are not responsible for content you choose to process through our tools.
                </p>
              </section>

              {/* 7 */}
              <section id="section-7">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">7</span>
                  <h2 className="text-xl font-bold text-gray-900">Data & Privacy</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Your privacy is important to us. This section summarizes our data practices — our full{" "}
                  <Link to="/privacy-policy" className="text-sky-600 hover:text-sky-700 underline transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  provides complete details.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc">
                  <li>We collect minimal data — only what is necessary to provide the Service (e.g., tool usage analytics via cookies).</li>
                  <li>We do not sell, rent, or trade your personal information to third parties.</li>
                  <li>We use cookies and analytics tools to understand how the Service is used — you can opt out through your browser settings.</li>
                  <li>Files you upload are not permanently stored unless required for the tool's functionality.</li>
                </ul>
              </section>

              {/* 8 */}
              <section id="section-8">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">8</span>
                  <h2 className="text-xl font-bold text-gray-900">Disclaimer of Warranties</h2>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</strong>
                  </p>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc mb-4">
                  <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                  <li>Warranties that the Service will be uninterrupted, timely, secure, or error-free</li>
                  <li>Warranties that the results obtained from the Service will be accurate or reliable</li>
                  <li>Any warranty that defects in the Service will be corrected</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  You assume all responsibility for determining whether the Service is suitable for your needs and for the results obtained from using it.
                </p>
              </section>

              {/* 9 */}
              <section id="section-9">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">9</span>
                  <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  To the maximum extent permitted by applicable law:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc mb-4">
                  <li>GeneratorPromptAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</li>
                  <li>Our total liability shall not exceed the amount you have paid us (which is $0 for free tools).</li>
                  <li>We are not liable for any loss or corruption of files during or after processing.</li>
                  <li>We are not liable for any damages caused by interruptions, bugs, or errors in the Service.</li>
                  <li>We are not liable for any content generated by AI tools — the output reflects your prompt input, not our views.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so the above limitation may not apply to you. In such cases, our liability is limited to the fullest extent permitted by law.
                </p>
              </section>

              {/* 10 */}
              <section id="section-10">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">10</span>
                  <h2 className="text-xl font-bold text-gray-900">Indemnification</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless GeneratorPromptAI, its team, and its affiliates from any claims, damages, losses, costs, or expenses (including reasonable legal fees) arising from:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc mb-3">
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any applicable law or regulation</li>
                  <li>Your infringement of any third party's intellectual property rights</li>
                  <li>Content you submit that causes harm to others</li>
                  <li>Your misuse of any tool's output</li>
                </ul>
              </section>

              {/* 11 */}
              <section id="section-11">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">11</span>
                  <h2 className="text-xl font-bold text-gray-900">Third-Party Links & Services</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Our Service may contain links to third-party websites, tools, or services that are not owned or controlled by us. These links are provided for convenience only.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc mb-3">
                  <li>We do not endorse, guarantee, or assume responsibility for any third-party content or services.</li>
                  <li>We are not responsible for the accuracy, legality, or content of external sites.</li>
                  <li>You access third-party services at your own risk and are subject to their own terms and privacy policies.</li>
                </ul>
              </section>

              {/* 12 */}
              <section id="section-12">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">12</span>
                  <h2 className="text-xl font-bold text-gray-900">Modifications to Terms</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to update or modify these Terms at any time. When we make changes, we will update the "Last updated" date at the top of this page. Continued use of the Service after changes are posted means you accept the revised Terms. We will make reasonable efforts to notify users of significant changes through our website, but we are not obligated to provide individual notice for every change.
                </p>
              </section>

              {/* 13 */}
              <section id="section-13">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">13</span>
                  <h2 className="text-xl font-bold text-gray-900">Termination</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  We reserve the right to terminate or suspend your access to the Service immediately, without prior notice, if:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm pl-6 list-disc mb-3">
                  <li>You materially breach these Terms</li>
                  <li>You engage in activity that is harmful to our systems, users, or third parties</li>
                  <li>Required by law or legal process</li>
                  <li>We discontinue the Service or a specific tool permanently</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  Upon termination, the sections that should survive indefinitely will continue to apply: Intellectual Property, Disclaimer of Warranties, Limitation of Liability, Indemnification, and Governing Law.
                </p>
              </section>

              {/* 14 */}
              <section id="section-14">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">14</span>
                  <h2 className="text-xl font-bold text-gray-900">Governing Law</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  These Terms are governed by the laws of Pakistan. Any disputes arising from these Terms shall be resolved through:
                </p>
                <ol className="space-y-2 text-gray-600 text-sm pl-6 list-decimal mb-3">
                  <li><strong>First:</strong> Informal resolution — contact us at the email below and we'll try to resolve it within 14 days.</li>
                  <li><strong>Second:</strong> Mediation through a mutually agreed neutral mediator.</li>
                  <li><strong>Third:</strong> Exclusive jurisdiction of the courts in Pakistan.</li>
                </ol>
                <p className="text-gray-600 leading-relaxed">
                  If any provision of these Terms is found to be unenforceable by a court, the remaining provisions will continue in full force and effect.
                </p>
              </section>

              {/* 15 */}
              <section id="section-15">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-8 h-8 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">15</span>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-5">
                  If you have questions or concerns about these Terms, please reach out:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-sky-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Email</p>
                        <a href="mailto:generatorpromptai@gmail.com" className="text-sky-600 hover:text-sky-700 font-medium transition-colors">
                          generatorpromptai@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-sky-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Website</p>
                        <Link to="/" className="text-sky-600 hover:text-sky-700 font-medium transition-colors">
                          https://www.generatorpromptai.com
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-sky-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Response Time</p>
                        <p className="text-gray-700">We aim to respond to all legal inquiries within 7 business days.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Internal Linking */}
            <div className="border-t border-gray-100 mt-10 pt-8">
              <p className="text-gray-500 text-sm mb-3">Related pages you might need:</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/privacy-policy" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200 transition-colors">
                  <FileText size={14} className="inline mr-1.5" />
                  Privacy Policy
                </Link>
                <Link to="/pages/all-tools" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200 transition-colors">
                  All Free Tools
                </Link>
                <Link to="/blog" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200 transition-colors">
                  Blog
                </Link>
                <Link to="/contact" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsOfService;