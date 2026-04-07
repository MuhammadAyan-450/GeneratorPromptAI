// pages/SitemapGenerator.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, Download, Eraser, Code, Map } from "lucide-react";

const SitemapGenerator = () => {
  const [urlsInput, setUrlsInput] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://www.yourwebsite.com");
  const [defaultFreq, setDefaultFreq] = useState("weekly");
  const [defaultPriority, setDefaultPriority] = useState("0.8");
  const [generatedSitemap, setGeneratedSitemap] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [lastmodDate, setLastmodDate] = useState(new Date().toISOString().split("T")[0]);

  const frequencies = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

  const escapeXml = (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const generateSitemap = useCallback(() => {
    let currentError = "";
    let xmlOutput = "";

    const lines = urlsInput
      .trim()
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#"));

    if (lines.length === 0) {
      currentError = "Please enter at least one valid URL or path";
    } else if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      currentError = "Base URL must start with http:// or https://";
    } else {
      const uniqueUrls = [...new Set(lines)];
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      uniqueUrls.forEach((line) => {
        let fullUrl = line;
        if (!line.startsWith("http")) {
          fullUrl = baseUrl.replace(/\/$/, "") + (line.startsWith("/") ? "" : "/") + line;
        }
        try {
          new URL(fullUrl);
          xml += `  <url>\n`;
          xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
          xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
          xml += `    <changefreq>${defaultFreq}</changefreq>\n`;
          xml += `    <priority>${defaultPriority}</priority>\n`;
          xml += `  </url>\n`;
        } catch { /* skip invalid URLs silently */ }
      });
      xml += `</urlset>`;
      xmlOutput = xml;
    }

    setError(currentError);
    setGeneratedSitemap(xmlOutput);
  }, [urlsInput, baseUrl, defaultFreq, defaultPriority, lastmodDate]);

  // Auto-generate preview when inputs change
  useEffect(() => {
    if (urlsInput.trim()) {
      generateSitemap();
    } else {
      setGeneratedSitemap("");
      setError("");
    }
  }, [generateSitemap, urlsInput.trim()]);

  const copySitemap = () => {
    if (!generatedSitemap) return;
    navigator.clipboard.writeText(generatedSitemap);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadSitemap = () => {
    if (!generatedSitemap) return;
    const blob = new Blob([generatedSitemap], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setUrlsInput("");
    setGeneratedSitemap("");
    setError("");
    setCopied(false);
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "XML Sitemap Generator",
    url: "https://www.generatorpromptai.com/tools/sitemap-generator",
    description: "Free online tool to generate XML sitemaps for websites and SEO.",
    applicationCategory: "SEOApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI" }
  };

  const schemaBreadCrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", position: 2, name: "SEO & Web Tools", item: "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", position: 3, name: "Sitemap Generator", item: "https://www.generatorpromptai.com/tools/sitemap-generator" }
    ]
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate a Sitemap",
    description: "Steps to create an XML sitemap for your website.",
    step: [
      { "@type": "HowToStep", name: "Set Base URL", text: "Enter your website's base URL (e.g., https://www.yourwebsite.com)." },
      { "@type": "HowToStep", name: "Add URLs", text: "Paste your page URLs or relative paths (like /about) one per line." },
      { "@type": "HowToStep", name: "Configure", text: "Set the update frequency and priority, then click generate." },
      { "@type": "HowToStep", name: "Download", text: "Download the generated sitemap.xml file and upload it to your website's root folder." }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an XML sitemap?",
        acceptedAnswer: { "@type": "Answer", text: "An XML sitemap is a file that lists all the important URLs of a website to help search engines like Google and Bing crawl and index your site more efficiently." }
      },
      {
        "@type": "Question",
        name: "Where do I put my sitemap.xml file?",
        acceptedAnswer: { "@type": "Answer", text: "The sitemap.xml file must be placed in the root directory of your website (e.g., www.yourwebsite.com/sitemap.xml)." }
      },
      {
        "@type": "Question",
        name: "What does changefreq and priority mean?",
        acceptedAnswer: { "@type": "Answer", text: "Changefreq tells search engines how often the page is likely to change (e.g., weekly). Priority indicates the importance of the page relative to other pages on your site, ranging from 0.1 to 1.0." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>XML Sitemap Generator - Create sitemap.xml Instantly</title>
        <meta name="description" content="Generate clean XML sitemaps instantly. Enter URLs, set frequency & priority, and download a ready-to-submit sitemap.xml for Google and Bing SEO." />
        <meta name="keywords" content="xml sitemap generator, sitemap.xml creator, free sitemap generator, generate sitemap online, seo sitemap tool" />
        
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/sitemap-generator" />

        <meta property="og:title" content="XML Sitemap Generator – Free Online Tool" />
        <meta property="og:description" content="Create & download sitemap.xml instantly for better SEO & indexing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/sitemap-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free XML Sitemap Generator" />
        <meta name="twitter:description" content="Generate sitemap.xml in seconds – no signup needed." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadCrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaHowTo)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 mb-4">
              <Map className="text-orange-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              XML Sitemap Generator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Create sitemap.xml for SEO • Google & Bing ready • Free & instant
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left – Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Base URL (for relative paths)</label>
                    <input
                      type="url"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://www.yourwebsite.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">URLs (one per line – full or relative)</label>
                    <textarea
                      value={urlsInput}
                      onChange={(e) => setUrlsInput(e.target.value)}
                      placeholder="/\n/about\n/blog/my-first-post\n/contact\nhttps://www.another-site.com/page"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[200px] font-mono text-sm resize-y text-gray-800"
                    />
                    {error && (
                      <p className="mt-2 text-red-600 text-sm font-medium">{error}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Change Frequency</label>
                      <select
                        value={defaultFreq}
                        onChange={(e) => setDefaultFreq(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-white"
                      >
                        {frequencies.map(freq => (
                          <option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority (0.0 – 1.0)</label>
                      <input
                        type="number"
                        value={defaultPriority}
                        onChange={(e) => setDefaultPriority(e.target.value)}
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Lastmod Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={lastmodDate}
                      onChange={(e) => setLastmodDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={generateSitemap}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Code size={20} />
                      Generate Sitemap
                    </button>
                    <button
                      onClick={reset}
                      disabled={!urlsInput}
                      className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium flex items-center justify-center gap-2 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Eraser size={18} />
                      Clear
                    </button>
                  </div>
                </div>

                {/* Right – Result */}
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">
                    Generated XML Sitemap
                  </h3>

                  {generatedSitemap ? (
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-200 bg-white">
                        <span className="font-medium text-gray-800 text-sm">
                          sitemap.xml ({urlsInput.trim().split("\n").filter(Boolean).length} URLs)
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={copySitemap}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition text-sm font-medium text-gray-700"
                          >
                            <Copy size={14} />
                            {copied ? "Copied!" : "Copy"}
                          </button>
                          <button
                            onClick={downloadSitemap}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition text-sm font-medium"
                          >
                            <Download size={14} />
                            .xml
                          </button>
                        </div>
                      </div>

                      <pre className="p-5 flex-1 max-h-[500px] overflow-auto font-mono text-sm bg-gray-900 text-green-300 whitespace-pre-wrap leading-relaxed m-0">
                        {generatedSitemap}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex-1 h-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                      <Code size={40} className="mb-3 opacity-30" />
                      <p className="text-sm text-center px-6">Enter URLs on the left to auto-generate your sitemap</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              XML Sitemap Generator – SEO Boost & Faster Indexing
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>
                Generate clean, valid XML sitemaps instantly. Simply enter your page URLs (full or relative paths), set your base URL, and configure the change frequency and priority. Download a ready-to-submit `sitemap.xml` file for Google Search Console, Bing Webmaster Tools, or any other search engine.
              </p>
              <p>
                This tool runs 100% in your browser. Your URLs are never sent to an external server, ensuring complete privacy for your website's structure. It automatically skips invalid URLs and removes duplicates.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the XML Sitemap Generator</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base">
              <li>Enter your website's base URL (e.g., `https://www.yourwebsite.com`).</li>
              <li>Paste your page URLs or relative paths (like `/about` or `/blog/post-1`), one per line.</li>
              <li>Set the default <strong>Change Frequency</strong> and <strong>Priority</strong>.</li>
              <li>The XML generates automatically as you type.</li>
              <li>Click <strong>Download .xml</strong> to save the file.</li>
              <li>Upload `sitemap.xml` to your website's root directory and submit it to Google Search Console.</li>
            </ol>
          </section>

          {/* FAQ Section for SEO */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "What is an XML sitemap?",
                  a: "An XML sitemap is a file that lists all the important URLs of a website. It acts as a roadmap for search engines like Google and Bing, helping them crawl and index your site more efficiently."
                },
                {
                  q: "Where do I put my sitemap.xml file?",
                  a: "The sitemap.xml file must be placed in the root directory of your website. For example, if your domain is www.example.com, the sitemap should be accessible at www.example.com/sitemap.xml."
                },
                {
                  q: "What does changefreq and priority mean?",
                  a: "Changefreq tells search engines how often the page is likely to change (e.g., weekly). Priority indicates the importance of the page relative to other pages on your site, ranging from 0.1 to 1.0."
                }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools (Fixed broken links to actual existing tools) */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Related Developer Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Generate realistic dummy data for testing your sitemaps or APIs." },
                { to: "/tools/json-formatter", title: "JSON Formatter", desc: "Beautify and validate JSON structures for web development." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Analyze text length and keyword density for SEO optimization." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-300 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">{tool.title}</h3>
                  <p className="text-gray-500 text-sm">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SitemapGenerator;