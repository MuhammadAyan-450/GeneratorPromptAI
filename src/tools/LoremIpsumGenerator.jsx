import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, FileText, Download, AlignLeft, Home, ChevronDown, Hash, Type, Layers, Code } from "lucide-react";

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(4);
  const [wordsPerPara, setWordsPerPara] = useState(80);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const baseWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
    "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat",
    "duis", "aute", "irure", "reprehenderit", "voluptate", "velit", "esse", "cillum",
    "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
    "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt",
    "mollit", "anim", "id", "est", "laborum"
  ];

  const generateLorem = () => {
    let text = "";

    const getRandomSentence = () => {
      const length = Math.floor(Math.random() * 12) + 6;
      let sentence = "";
      for (let i = 0; i < length; i++) {
        const word = baseWords[Math.floor(Math.random() * baseWords.length)];
        sentence += (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) + " ";
      }
      return sentence.trim() + ".";
    };

    for (let p = 0; p < paragraphs; p++) {
      let para = "";
      let wordCount = 0;

      while (wordCount < wordsPerPara) {
        const sentence = getRandomSentence();
        const sentenceWords = sentence.split(" ").length;
        if (wordCount + sentenceWords > wordsPerPara) break;
        para += sentence + " ";
        wordCount += sentenceWords;
      }

      if (includeHtml) {
        const headingLevel = Math.floor(Math.random() * 3) + 2;
        text += `<h${headingLevel}>Section ${p + 1}</h${headingLevel}>\n<p>${para.trim()}</p>\n\n`;
      } else {
        text += para.trim() + "\n\n";
      }
    }

    if (startWithLorem && !includeHtml) {
      text =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
        text;
    }

    setGeneratedText(text.trim());
  };

  const copyText = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lorem-ipsum-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setGeneratedText("");
    setCopied(false);
  };

  const totalWords = generatedText.trim() ? generatedText.trim().split(/\s+/).length : 0;
  const totalChars = generatedText.length;
  const totalSentences = generatedText.trim() ? generatedText.split(/[.!?]+/).filter(Boolean).length : 0;

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generate Placeholder Text for Website Design Free – Lorem Ipsum with HTML Tags",
    "url": "https://www.generatorpromptai.com/tools/lorem-ipsum-generator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online Lorem Ipsum generator with customizable paragraphs, word count, and HTML tag wrapping. Create placeholder text for wireframes, mockups, and prototypes instantly.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Lorem Ipsum Generator", "item": "https://www.generatorpromptai.com/tools/lorem-ipsum-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to generate placeholder text for website design free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Set the number of paragraphs and words per paragraph in our Lorem Ipsum generator, then click Generate Text. Copy or download the result and paste it directly into your design mockup or prototype."
        }
      },
      {
        "@type": "Question",
        "name": "Can I generate Lorem Ipsum with HTML tags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Check the 'Wrap in HTML tags' option and the tool will output your paragraphs wrapped in <p> tags with randomly generated <h2>, <h3>, or <h4> headings between sections."
        }
      },
      {
        "@type": "Question",
        "name": "What is Lorem Ipsum and why do designers use it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lorem Ipsum is dummy text used in the printing and web design industries since the 1500s. Designers use it to fill layouts with realistic-looking text so clients and stakeholders focus on the visual design rather than reading the content."
        }
      },
      {
        "@type": "Question",
        "name": "How many paragraphs of Lorem Ipsum should I use for a wireframe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For a typical website wireframe, 3-5 paragraphs per section works well. For a full-page mockup, 10-20 paragraphs total gives a realistic feel. Use shorter paragraphs (40-60 words) for tighter layouts."
        }
      },
      {
        "@type": "Question",
        "name": "Can I generate dummy text with a specific word count?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Set the 'Words per Paragraph' slider to your desired count (20-300 words) and the tool will generate paragraphs that match that target as closely as possible."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Generate Placeholder Text for Website Design Free – Lorem Ipsum with HTML Tags</title>

        <meta
          name="description"
          content="Free Lorem Ipsum generator with customizable paragraphs, word count, and HTML tag wrapping. Create placeholder text for wireframes, mockups, and prototypes instantly. No signup required."
        />

        <meta
          name="keywords"
          content="how to generate placeholder text for website design free, lorem ipsum generator with html tags free online, generate dummy text for wireframe mockup free, placeholder text generator for ui ux design, free lorem ipsum paragraphs with specific word count, create filler text for website prototype online, random placeholder text generator no signup, generate lorem ipsum with heading tags html, dummy text generator for print layout free, best free placeholder text tool for designers"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/lorem-ipsum-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate Placeholder Text for Website Design Free – Lorem Ipsum" />
        <meta property="og:description" content="Custom Lorem Ipsum with paragraphs, word count, and HTML tags. Free placeholder text for wireframes and mockups." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/lorem-ipsum-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Lorem Ipsum Generator – Placeholder Text with HTML Tags" />
        <meta name="twitter:description" content="Generate customizable placeholder text for wireframes and mockups. HTML support included." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb ── */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb">
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
              <li><span className="text-gray-900 font-semibold">Lorem Ipsum Generator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <AlignLeft className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Generate Placeholder Text for Website Design Free –{" "}
              <span className="text-sky-600">Lorem Ipsum with HTML Tags</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Create customizable dummy text for wireframes, mockups and prototypes. Set paragraph count, word density, and HTML output.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Settings Grid */}
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraphs</label>
                <input
                  type="number"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(Math.max(1, Math.min(20, parseInt(e.target.value) || 4)))}
                  min="1" max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">1 to 20 paragraphs</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Words per Paragraph</label>
                <input
                  type="number"
                  value={wordsPerPara}
                  onChange={(e) => setWordsPerPara(Math.max(20, Math.min(300, parseInt(e.target.value) || 80)))}
                  min="20" max="300"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">20 to 300 words</p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="h-4 w-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                />
                Start with "Lorem ipsum..."
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={includeHtml}
                  onChange={(e) => setIncludeHtml(e.target.checked)}
                  className="h-4 w-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                />
                Wrap in HTML tags
              </label>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button
                onClick={generateLorem}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <FileText size={18} /> Generate Text
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>

            {/* ── Result ── */}
            {generatedText && (
              <div className="mt-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Layers size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{paragraphs}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Paragraphs</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Type size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{totalWords}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Words</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Hash size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{totalChars}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Characters</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Code size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{totalSentences}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Sentences</p>
                  </div>
                </div>

                {/* Output */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6 overflow-x-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
                    {includeHtml ? "Generated HTML Output" : "Generated Placeholder Text"}
                  </p>
                  {includeHtml ? (
                    <pre className="text-sm font-mono leading-relaxed">
                      {generatedText.split(/(<[^>]+>)/).map((part, i) => {
                        if (i % 2 === 1) return <span key={i} className="text-sky-400">{part}</span>;
                        return <span key={i} className="text-gray-300">{part}</span>;
                      })}
                    </pre>
                  ) : (
                    <pre className="text-sm font-mono leading-relaxed text-gray-200">{generatedText}</pre>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={copyText}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Copy size={15} />
                    {copied ? "Copied!" : "Copy Result"}
                  </button>
                  <button
                    onClick={downloadText}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Download size={15} /> Download .txt
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!generatedText && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <FileText size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Click <strong className="text-gray-500">Generate Text</strong> to create placeholder text</p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Lorem Ipsum Generator with HTML Tags – Placeholder Text for UI Design
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Lorem Ipsum has been the standard dummy text for the printing and typesetting industry since the 1500s. Our free generator goes beyond the basics — you control the <strong>exact number of paragraphs</strong>, set a <strong>specific word count per paragraph</strong>, and optionally wrap the output in <strong>clean HTML tags</strong> with randomly generated headings.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This makes it ideal for UI/UX designers building wireframes in Figma, web developers prototyping layouts, and print designers creating mockups. The HTML output mode generates properly structured <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">&lt;p&gt;</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">&lt;h2&gt;-&lt;h4&gt;</code> tags that you can paste directly into your code editor.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Generate Dummy Text for Wireframe Mockup Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Set the number of <strong>paragraphs</strong> you need (1 to 20).</li>
              <li>Adjust <strong>words per paragraph</strong> to control text density (20 to 300).</li>
              <li>Check <strong>"Start with Lorem ipsum..."</strong> for the classic opening phrase.</li>
              <li>Check <strong>"Wrap in HTML tags"</strong> to get output with paragraph and heading tags.</li>
              <li>Click <strong>"Generate Text"</strong>, then <strong>copy</strong> or <strong>download</strong> the result.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create Filler Text for Website Prototype Online – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Custom Paragraph and Word Count", desc: "Set exactly how many paragraphs you need and how many words each paragraph should contain. The tool generates text that matches your targets as closely as possible." },
                { title: "HTML Tag Wrapping", desc: "Toggle HTML mode to get paragraphs wrapped in <p> tags with random <h2>, <h3>, or <h4> headings between sections. Ready to paste into any code editor." },
                { title: "Classic Lorem Ipsum Opening", desc: "Optionally start the first paragraph with the traditional 'Lorem ipsum dolor sit amet...' phrase that designers and clients recognize instantly." },
                { title: "Copy or Download as .txt", desc: "Copy the generated text to your clipboard with one click or download it as a plain text file for offline use in your design tools." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Accordion ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Lorem Ipsum Generator – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to generate placeholder text for website design free?",
                  a: "Set the number of paragraphs and words per paragraph in our Lorem Ipsum generator, then click Generate Text. Copy or download the result and paste it directly into your design mockup or prototype."
                },
                {
                  q: "Can I generate Lorem Ipsum with HTML tags?",
                  a: "Yes. Check the 'Wrap in HTML tags' option and the tool will output your paragraphs wrapped in <p> tags with randomly generated <h2>, <h3>, or <h4> headings between sections."
                },
                {
                  q: "What is Lorem Ipsum and why do designers use it?",
                  a: "Lorem Ipsum is dummy text used in the printing and web design industries since the 1500s. Designers use it to fill layouts with realistic-looking text so clients and stakeholders focus on the visual design rather than reading the content."
                },
                {
                  q: "How many paragraphs of Lorem Ipsum should I use for a wireframe?",
                  a: "For a typical website wireframe, 3-5 paragraphs per section works well. For a full-page mockup, 10-20 paragraphs total gives a realistic feel. Use shorter paragraphs (40-60 words) for tighter layouts."
                },
                {
                  q: "Can I generate dummy text with a specific word count?",
                  a: "Yes. Set the 'Words per Paragraph' input to your desired count (20-300 words) and the tool will generate paragraphs that match that target as closely as possible."
                }
              ].map((item, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={22} className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Text & Design Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters and reading time instantly." },
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Generate realistic dummy data including text fields." },
                { to: "/tools/json-formatter", title: "JSON Formatter", desc: "Beautify, minify and validate JSON code." }
              ].map((tool) => (
                <Link key={tool.to} to={tool.to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">{tool.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default LoremIpsumGenerator;