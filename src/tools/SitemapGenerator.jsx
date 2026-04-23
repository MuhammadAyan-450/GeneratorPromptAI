// pages/SitemapGenerator.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, Download, Eraser, Code, Map, Home, ChevronDown } from "lucide-react";

const SitemapGenerator = () => {
  const [urlsInput, setUrlsInput] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://www.yourwebsite.com");
  const [defaultFreq, setDefaultFreq] = useState("weekly");
  const [defaultPriority, setDefaultPriority] = useState("0.8");
  const [generatedSitemap, setGeneratedSitemap] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [lastmodDate, setLastmodDate] = useState(new Date().toISOString().split("T")[0]);
  const [openFaq, setOpenFaq] = useState(null);

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
    "name": "XML Sitemap Generator from URL",
    "url": "https://www.generatorpromptai.com/tools/sitemap-generator",
    "description": "Generate XML sitemaps from URLs instantly. Create sitemap.xml with changefreq and priority options. Free online tool – no signup.",
    "applicationCategory": "SEOApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadCrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "XML Sitemap Generator", "item": "https://www.generatorpromptai.com/tools/sitemap-generator" }
    ]
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate an XML Sitemap from URLs",
    "description": "Step-by-step guide to create sitemap.xml from your website URLs for Google Search Console submission.",
    "step": [
      { "@type": "HowToStep", "name": "Set Base URL", "text": "Enter your website's base URL (e.g., https://www.yourwebsite.com) in the base URL field." },
      { "@type": "HowToStep", "name": "Add URLs or Paths", "text": "Paste your full URLs or relative paths (like /about or /blog/post-1), one per line in the text area." },
      { "@type": "HowToStep", "name": "Set Frequency & Priority", "text": "Choose the change frequency (daily, weekly, monthly) and priority (0.1 to 1.0) for your pages." },
      { "@type": "HowToStep", "name": "Auto-Generate & Download", "text": "The XML sitemap generates automatically. Click Download .xml to save the sitemap.xml file to your computer." },
      { "@type": "HowToStep", "name": "Upload & Submit", "text": "Upload sitemap.xml to your website's root folder and submit it to Google Search Console for faster indexing." }
    ]
  };

  // FAQ Schema based on ACTUAL Google Search Console queries
  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to generate XML sitemap from URL?",
        "acceptedAnswer": { "@type": "Answer", "text": "Paste your website URLs (full or relative paths like /about) into our tool, set your base URL, choose changefreq and priority, and the XML sitemap generates automatically. Download the sitemap.xml file and upload it to your website root." }
      },
      {
        "@type": "Question",
        "name": "How to create a sitemap.xml file for free?",
        "acceptedAnswer": { "@type": "Answer", "text": "Use our free XML Sitemap Generator tool. Enter your URLs, configure settings, and download a ready-to-use sitemap.xml file instantly. No signup, no software install, and no limits." }
      },
      {
        "@type": "Question",
        "name": "What is an XML sitemap and why do I need one?",
        "acceptedAnswer": { "@type": "Answer", "text": "An XML sitemap is a file that lists all important pages of your website in XML format. Search engines like Google and Bing use it to discover and crawl your pages faster. It is especially important for new websites or sites with many pages." }
      },
      {
        "@type": "Question",
        "name": "Where do I put the sitemap.xml file?",
        "acceptedAnswer": { "@type": "Answer", "text": "The sitemap.xml file must be uploaded to the root directory of your website. For example, if your domain is www.example.com, the sitemap should be accessible at www.example.com/sitemap.xml. You should also submit it in Google Search Console." }
      },
      {
        "@type": "Question",
        "name": "What does changefreq and priority mean in sitemap.xml?",
        "acceptedAnswer": { "@type": "Answer", "text": "Changefreq tells search engines how often the page content is likely to change (e.g., daily, weekly, monthly). Priority indicates the relative importance of the page compared to other pages on your site, from 0.1 (lowest) to 1.0 (highest). Homepage typically gets 1.0." }
      },
      {
        "@type": "Question",
        "name": "Can I generate sitemap XML from multiple URLs at once?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, our tool supports bulk sitemap generation. Paste multiple URLs or relative paths (one per line), and it will automatically remove duplicates and generate a valid sitemap.xml with all your URLs." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* ── OPTIMIZED TITLE based on GSC Data ── */}
        <title>Generate XML Sitemap from URL Free – Create sitemap.xml Instantly</title>
        
        {/* ── OPTIMIZED DESCRIPTION with exact GSC query matches ── */}
        <meta 
          name="description" 
          content="Generate XML sitemap from URLs instantly. Create sitemap.xml with changefreq and priority settings. Supports bulk URLs, auto-duplicates removal. Download ready-to-submit sitemap for Google Search Console – free, no signup." 
        />
        
        {/* ── KEYWORDS matching GSC queries exactly ── */}
        <meta
          name="keywords"
          content="xml sitemap generator, generate sitemap xml, xml sitemaps generator, xml-sitemaps generator, sitemap generator from url, generate xml sitemap, sitemap xml creation, generate sitemap from url, generate a sitemap xml, sitemap xml generation, xml sitemap generation, sitemap generator xml, sitemap.xml generator, generate xml sitemaps, create xml sitemap, create sitemap xml, sitemap xml file generator, free sitemap generator online"
        />
        
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/sitemap-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate XML Sitemap from URL Free – Create sitemap.xml Instantly" />
        <meta property="og:description" content="Generate XML sitemap from multiple URLs instantly. Set changefreq, priority, and download ready-to-submit sitemap.xml for Google – free online tool." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/sitemap-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Generate XML Sitemap from URL Free" />
        <meta name="twitter:description" content="Create sitemap.xml from URLs with changefreq and priority. Download instantly – no signup needed." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadCrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaHowTo)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* ── Breadcrumb ── */}
        <div className="max-w-6xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-sky-600 transition-colors">
                  <Home size={14} /> Home
                </Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li>
                <Link to="/pages/all-tools" className="hover:text-sky-600 transition-colors">All Tools</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">XML Sitemap Generator</span></li>
            </ol>
          </nav>
          
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">
          {/* ── Header with SEO-optimized H1 ── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 mb-4">
              <Map className="text-orange-600" size={28} />
            </div>
            {/* H1 targets: "xml sitemap generator", "generate sitemap xml" */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Generate XML Sitemap from URL{" "}
              <span className="text-sky-600">Free</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Create <strong>sitemap.xml</strong> instantly from your URLs. Set changefreq & priority, download Google-ready XML sitemap – no signup, no limits.
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">URLs (one per line – full or relative paths)</label>
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

          {/* ── SEO Content Section 1 ── */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            {/* H2 targets: "xml sitemaps generator", "xml sitemap generation" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free XML Sitemaps Generator – Create sitemap.xml for Google & Bing
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>
                Generate clean, valid <strong>XML sitemaps</strong> instantly from your website URLs. Whether you need to <strong>create a sitemap.xml file</strong> for a new website or update an existing one, our <strong>XML sitemap generator</strong> makes the process simple. Just paste your full URLs or relative paths, set the changefreq and priority, and download a Google Search Console-ready sitemap.
              </p>
              <p>
                This <strong>sitemap XML generation</strong> tool runs 100% in your browser. Your URLs are never sent to any external server, ensuring complete privacy for your website's structure. It automatically removes duplicate URLs and skips invalid entries.
              </p>
            </div>
          </section>

          {/* ── How to Use Section ── */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            {/* H2 targets: "generate sitemap xml", "generate xml sitemaps" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Generate Sitemap XML from URLs in 5 Steps
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base">
              <li>Enter your website's <strong>base URL</strong> (e.g., <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">https://www.yourwebsite.com</code>).</li>
              <li><strong>Paste your URLs or relative paths</strong> (like <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">/about</code> or <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">/blog/post-1</code>), one per line.</li>
              <li>Set the default <strong>Change Frequency</strong> (daily, weekly, monthly) and <strong>Priority</strong> (0.1 to 1.0).</li>
              <li>The <strong>XML sitemap generates automatically</strong> as you type – no need to click anything.</li>
              <li>Click <strong>Download .xml</strong> to save the file, then upload <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">sitemap.xml</code> to your website's root directory and submit it to Google Search Console.</li>
            </ol>
          </section>

          {/* ── Features Section (New - for content depth) ── */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            {/* H2 targets: "sitemap.xml generator", "sitemap xml file generator" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sitemap.xml Generator Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Generate from Any URL Format", desc: "Supports full URLs (https://...) and relative paths (/about, /blog). The tool converts relative paths to full URLs using your base URL." },
                { title: "Bulk URL Support", desc: "Paste hundreds of URLs at once. The generator automatically removes duplicates and skips invalid URLs." },
                { title: "Custom Changefreq & Priority", desc: "Set how often each page changes (daily, weekly, monthly) and its importance (0.1 to 1.0) for search engine crawlers." },
                { title: "100% Private & Browser-Based", desc: "Your URLs never leave your browser. No data is sent to any server – complete privacy for your website structure." },
                { title: "Auto-Generate Preview", desc: "See the XML sitemap generate in real-time as you type. No need to click a button to preview." },
                { title: "Ready for Google Search Console", desc: "Download a clean, validated sitemap.xml file that you can directly submit to Google Search Console and Bing Webmaster Tools." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ Section with Accordion (Matches GSC Queries Exactly) ── */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              XML Sitemap Generator – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to generate XML sitemap from URL?",
                  a: "Paste your website URLs (full or relative paths like /about) into the text area above, set your base URL, choose changefreq and priority, and the XML sitemap generates automatically as you type. Click 'Download .xml' to save the sitemap.xml file to your computer."
                },
                {
                  q: "How to create a sitemap.xml file for free?",
                  a: "Use our free XML Sitemap Generator. Enter your URLs, configure the changefreq and priority settings, and download a ready-to-use sitemap.xml file instantly. There is no signup, no software install, no limits, and no watermarks."
                },
                {
                  q: "What is an XML sitemap and why do I need one?",
                  a: "An XML sitemap is a file that lists all important pages of your website in XML format. Search engines like Google and Bing use it to discover and crawl your pages faster and more efficiently. It is especially important for new websites, sites with many pages, or sites with isolated pages that aren't linked well internally."
                },
                {
                  q: "Where do I put the sitemap.xml file on my website?",
                  a: "The sitemap.xml file must be uploaded to the root directory of your website. For example, if your domain is www.example.com, the sitemap should be accessible at www.example.com/sitemap.xml. After uploading, submit the URL to Google Search Console under 'Sitemaps' for faster indexing."
                },
                {
                  q: "What does changefreq and priority mean in sitemap.xml?",
                  a: "Changefreq tells search engines how often the page content is likely to change (options: always, hourly, daily, weekly, monthly, yearly, never). Priority indicates the relative importance of the page compared to other pages on your site, from 0.1 (lowest) to 1.0 (highest). Your homepage typically gets 1.0, and less important pages get lower values."
                },
                {
                  q: "Can I generate sitemap XML from multiple URLs at once?",
                  a: "Yes, our tool supports bulk sitemap XML generation. Paste multiple URLs or relative paths (one per line), and it will automatically remove duplicate URLs, skip invalid entries, and generate a clean, valid sitemap.xml containing all your URLs."
                },
                {
                  q: "Is this sitemap.xml generator really free?",
                  a: "Yes, 100% free with no limits. You can generate as many sitemaps as you want, with as many URLs as you need. There are no premium tiers, no signup requirements, and no hidden fees. The tool runs entirely in your browser."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">
                      {item.q}
                    </h3>
                    <ChevronDown
                      size={22}
                      className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related Tools ── */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Related Free Developer & SEO Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Generate realistic dummy data for testing your sitemaps or APIs – names, emails, addresses." },
                { to: "/tools/json-formatter", title: "JSON Formatter & Validator", desc: "Beautify, minify and validate JSON structures for web development and API testing." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Analyze text length, keyword density and reading time for SEO optimization." },
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