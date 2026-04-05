// pages/LoremIpsumGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, Eraser, FileText, Download, AlignLeft } from "lucide-react";

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(4);
  const [wordsPerPara, setWordsPerPara] = useState(80);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 1800);
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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lorem Ipsum Generator",
    url: "https://generatorpromptai.com/tools/lorem-ipsum-generator",
    description: "Free online tool to generate customizable placeholder (Lorem Ipsum) text for design & development.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI" }
  };

  const schemaBreadCrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://generatorpromptai.com/" },
      { "@type": "ListItem", position: 2, name: "Text & Code Tools", item: "https://generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", position: 3, name: "Lorem Ipsum Generator", item: "https://generatorpromptai.com/tools/lorem-ipsum-generator" }
    ]
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate Lorem Ipsum Text",
    description: "Steps to create custom placeholder text for your designs.",
    step: [
      { "@type": "HowToStep", name: "Set Parameters", text: "Choose the number of paragraphs and words per paragraph." },
      { "@type": "HowToStep", name: "Choose Options", text: "Select if you want to start with classic Lorem Ipsum and whether to wrap the text in HTML tags." },
      { "@type": "HowToStep", name: "Generate", text: "Click the generate button and copy or download the resulting text." }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Lorem Ipsum?",
        acceptedAnswer: { "@type": "Answer", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s." }
      },
      {
        "@type": "Question",
        name: "Can I generate Lorem Ipsum with HTML tags?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our tool has an 'Include HTML tags' option that wraps your paragraphs in <p> tags and adds random <h2>, <h3>, or <h4> headings." }
      },
      {
        "@type": "Question",
        name: "Is there a limit to how much text I can generate?",
        acceptedAnswer: { "@type": "Answer", text: "No. You can generate up to 20 paragraphs at a time, with up to 300 words per paragraph, completely free." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Lorem Ipsum Generator - Free Placeholder Text Online</title>
        <meta name="description" content="Generate unlimited Lorem Ipsum placeholder text instantly. Customize paragraphs, word count, and HTML tags. Perfect for UI/UX mockups and web design." />
        <meta name="keywords" content="lorem ipsum generator, placeholder text generator, dummy text online, free lorem ipsum, html placeholder text, design mockup text" />
        <link rel="canonical" href="https://generatorpromptai.com/tools/lorem-ipsum-generator" />

        <meta property="og:title" content="Lorem Ipsum Generator – Free Placeholder Text" />
        <meta property="og:description" content="Create custom dummy text for websites, designs & mockups – HTML support included." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/tools/lorem-ipsum-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Lorem Ipsum Generator" />
        <meta name="twitter:description" content="Custom placeholder text for UI, web & print designs – instant & free." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadCrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaHowTo)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 mb-4">
              <AlignLeft className="text-indigo-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Lorem Ipsum Generator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Custom placeholder text • Paragraphs • Words • HTML tags • Free & instant
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-8">
              {/* Settings Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Paragraphs
                  </label>
                  <input
                    type="number"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(Math.max(1, Math.min(20, parseInt(e.target.value) || 4)))}
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Words per Paragraph
                  </label>
                  <input
                    type="number"
                    value={wordsPerPara}
                    onChange={(e) => setWordsPerPara(Math.max(20, Math.min(300, parseInt(e.target.value) || 80)))}
                    min="20"
                    max="300"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
                  />
                </div>

                <div className="flex flex-col justify-end gap-3 pt-5 sm:pt-0 lg:pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={startWithLorem}
                      onChange={(e) => setStartWithLorem(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    Start with "Lorem ipsum..."
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={includeHtml}
                      onChange={(e) => setIncludeHtml(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    Wrap in HTML tags
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={generateLorem}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText size={20} />
                  Generate Text
                </button>

                <button
                  onClick={reset}
                  disabled={!generatedText}
                  className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium flex items-center justify-center gap-2 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Eraser size={18} />
                  Clear
                </button>
              </div>

              {/* Generated Text */}
              {generatedText ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {includeHtml ? "Generated HTML" : "Generated Placeholder Text"}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyText}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition text-sm font-medium text-gray-700"
                      >
                        <Copy size={14} />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={downloadText}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition text-sm font-medium text-gray-700"
                      >
                        <Download size={14} />
                        .txt
                      </button>
                    </div>
                  </div>
                  <div className="p-5 bg-white max-h-[450px] overflow-auto">
                    <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-gray-800 m-0">
                      {generatedText}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Click "Generate Text" to create placeholder text</p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Content */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Lorem Ipsum Generator – Placeholder Text for Designs
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>
                Instantly generate customizable Lorem Ipsum placeholder text for your projects. Adjust the exact number of paragraphs, control the word density, and optionally wrap the output in clean HTML tags with random headings.
              </p>
              <p>
                Perfect for web designers, UI/UX developers, and print layout artists who need realistic filler text for wireframes, mockups, and prototypes. 100% free, no sign-up required, and runs entirely in your browser.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the Lorem Ipsum Generator</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base">
              <li>Set the number of paragraphs you need (up to 20).</li>
              <li>Adjust the words per paragraph to control text density.</li>
              <li>Check <strong>"Start with Lorem ipsum..."</strong> for the classic opening phrase.</li>
              <li>Check <strong>"Wrap in HTML tags"</strong> if you need raw HTML output for your code.</li>
              <li>Click <strong>Generate Text</strong> and copy or download the result.</li>
            </ol>
          </section>

          {/* FAQ Section for SEO */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "What is Lorem Ipsum?",
                  a: "Lorem Ipsum is standard dummy text used in the printing, typesetting, and web development industries since the 1500s. It allows designers to focus on layout without being distracted by readable content."
                },
                {
                  q: "Can I generate Lorem Ipsum with HTML tags?",
                  a: "Yes. By checking the 'Wrap in HTML tags' option, the tool will output your text wrapped in paragraph tags and include randomly generated heading tags (h2, h3, h4)."
                },
                {
                  q: "Is there a limit to how much text I can generate?",
                  a: "You can generate up to 20 paragraphs at once, with up to 300 words per paragraph, completely free with no limits on how many times you can use the tool."
                }
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Related Text & Design Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters & reading time instantly." },
                { to: "/tools/fake-data-generator", title: "Fake Data Generator", desc: "Create realistic dummy data (including text fields)." },
                { to: "/tools/json-formatter", title: "JSON Formatter", desc: "Beautify, minify & validate JSON code." },
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

export default LoremIpsumGenerator;