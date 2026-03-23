// pages/SitemapGenerator.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, Download, RefreshCw, Code, CheckCircle2, AlertCircle } from "lucide-react";

const SitemapGenerator = () => {
  const [urlsInput, setUrlsInput] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://yourwebsite.com");
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

  const generateSitemap = () => {
    setError("");

    const lines = urlsInput
      .trim()
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#")); // ignore comments

    if (lines.length === 0) {
      setError("Please enter at least one valid URL or path");
      setGeneratedSitemap("");
      return;
    }

    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      setError("Base URL must start with http:// or https://");
      return;
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(lines)];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    uniqueUrls.forEach((line) => {
      let fullUrl = line;
      if (!line.startsWith("http")) {
        fullUrl = baseUrl.replace(/\/$/, "") + (line.startsWith("/") ? "" : "/") + line;
      }

      // Basic URL validation
      try {
        new URL(fullUrl);
      } catch {
        return; // skip invalid URLs
      }

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
      xml += `    <lastmod>${lastmodDate}</lastmod>\n`;
      xml += `    <changefreq>${defaultFreq}</changefreq>\n`;
      xml += `    <priority>${defaultPriority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    setGeneratedSitemap(xml);
  };

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

  // Auto-generate preview when inputs change (optional – can be disabled if too heavy)
  useEffect(() => {
    if (urlsInput.trim() && !error) {
      generateSitemap();
    }
  }, [urlsInput, baseUrl, defaultFreq, defaultPriority, lastmodDate]);

  return (
    <>
      <Helmet>
        <title>XML Sitemap Generator – Create sitemap.xml Instantly</title>
        <meta
          name="description"
          content="Generate clean XML sitemaps instantly – enter URLs, set base URL, changefreq & priority. Download ready-to-submit sitemap.xml for Google, Bing, SEO. Free, no signup, 100% browser-based – built in Karachi."
        />
        <meta
          name="keywords"
          content="xml sitemap generator, sitemap.xml creator, free sitemap generator, generate sitemap online, seo sitemap tool 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/sitemap-generator" />

        <meta property="og:title" content="XML Sitemap Generator – Free Online Tool 2026" />
        <meta property="og:description" content="Create & download sitemap.xml instantly for better SEO & indexing." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free XML Sitemap Generator" />
        <meta name="twitter:description" content="Generate sitemap.xml in seconds – no signup needed." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "XML Sitemap Generator",
            url: "https://generatorpromptai.com/tools/sitemap-generator",
            description: "Free online tool to generate XML sitemaps for websites and SEO.",
            applicationCategory: "SEOApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            XML Sitemap Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Create sitemap.xml for SEO • Google & Bing ready • Free & instant
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left – Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Base URL (for relative paths)
                    </label>
                    <input
                      type="url"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      URLs (one per line – full or relative)
                    </label>
                    <textarea
                      value={urlsInput}
                      onChange={(e) => setUrlsInput(e.target.value)}
                      placeholder="/\n/about\n/blog/post-1\n/contact\n/services\nhttps://yourwebsite.com/extra-page"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[220px] font-mono text-sm resize-y"
                    />
                    {error && (
                      <p className="mt-2 text-red-600 text-sm font-medium flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Default Change Frequency
                      </label>
                      <select
                        value={defaultFreq}
                        onChange={(e) => setDefaultFreq(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        {frequencies.map(freq => (
                          <option key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Default Priority (0.0–1.0)
                      </label>
                      <input
                        type="number"
                        value={defaultPriority}
                        onChange={(e) => setDefaultPriority(e.target.value)}
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Lastmod Date (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={lastmodDate}
                      onChange={(e) => setLastmodDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={generateSitemap}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Code size={20} />
                      Generate Sitemap XML
                    </button>

                    <button
                      onClick={reset}
                      className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Right – Result */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Generated XML Sitemap
                  </h3>

                  {generatedSitemap ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 border-b bg-white">
                        <span className="font-medium text-gray-800">
                          Sitemap.xml ({urlsInput.trim().split("\n").filter(Boolean).length} URLs)
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={copySitemap}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                          >
                            <Copy size={16} />
                            {copied ? "Copied!" : "Copy XML"}
                          </button>

                          <button
                            onClick={downloadSitemap}
                            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition text-sm font-medium shadow-sm"
                          >
                            <Download size={16} />
                            Download .xml
                          </button>
                        </div>
                      </div>

                      <pre className="p-6 max-h-96 overflow-auto font-mono text-sm bg-gray-900 text-green-300 whitespace-pre-wrap leading-relaxed">
                        {generatedSitemap}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border text-gray-500 text-center px-6">
                      Enter URLs above and click Generate to create your sitemap.xml
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              XML Sitemap Generator – SEO Boost & Indexing
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Generate clean, valid XML sitemaps instantly — enter your URLs (full or relative), set base URL, change frequency, priority, and lastmod date. Download ready-to-submit sitemap.xml for Google Search Console, Bing Webmaster Tools, or any search engine. No signup, no limits, no server upload — everything happens 100% in your browser.
              </p>
              <p>
                Built in Karachi – perfect for small/medium websites, bloggers, freelancers, and Pakistani businesses wanting to improve SEO, crawl efficiency, and site indexing quickly. Supports relative paths and automatic lastmod.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the XML Sitemap Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Enter your website's base URL (e.g., https://yourwebsite.com) – used for relative paths.</li>
                <li>Paste your page URLs (one per line) – full URLs or relative paths like /about or /blog/post-1.</li>
                <li>Set default change frequency (weekly is good for most pages) and priority (0.8 for important pages).</li>
                <li>Choose lastmod date (defaults to today).</li>
                <li>Click <strong>Generate Sitemap XML</strong> – XML preview appears instantly.</li>
                <li>Click <strong>Copy XML</strong> or <strong>Download .xml</strong> to save the file.</li>
                <li>Upload sitemap.xml to your website root and submit to Google Search Console.</li>
                <li>Tip: For very large sites (500 pages), use a proper crawler tool instead.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related SEO & Website Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/robots-txt-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Robots.txt Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create robots.txt to control search engine crawling.
                </p>
              </Link>

              <Link
                to="/tools/seo-meta-tag-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  SEO Meta Tag Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate title tags & meta descriptions optimized for SEO.
                </p>
              </Link>

              <Link
                to="/tools/keyword-density-checker"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Keyword Density Checker
                </h3>
                <p className="text-gray-600 text-sm">
                  Analyze keyword usage in your content.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SitemapGenerator;