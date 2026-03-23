// pages/LoremIpsumGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, FileText, Download } from "lucide-react";

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(4);
  const [wordsPerPara, setWordsPerPara] = useState(80); // more natural than sentences
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
      const length = Math.floor(Math.random() * 12) + 6; // 6–18 words
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
        const headingLevel = Math.floor(Math.random() * 3) + 2; // h2–h4
        text += `<h${headingLevel}>Section ${p + 1}</h${headingLevel}>\n<p>${para.trim()}</p>\n\n`;
      } else {
        text += para.trim() + "\n\n";
      }
    }

    // Classic "Lorem ipsum..." start
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

  return (
    <>
      <Helmet>
        <title>Lorem Ipsum Generator – Placeholder Text for Designs</title>
        <meta
          name="description"
          content="Generate unlimited Lorem Ipsum placeholder text instantly – customize paragraphs, words, HTML tags. Perfect for web mockups, UI design, wireframes. Free, no signup, 100% browser-based – built in Karachi."
        />
        <meta
          name="keywords"
          content="lorem ipsum generator, placeholder text generator, dummy text online, free lorem ipsum, html placeholder text, design mockup text 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/lorem-ipsum-generator" />

        <meta property="og:title" content="Lorem Ipsum Generator – Free Placeholder Text 2026" />
        <meta property="og:description" content="Create custom dummy text for websites, designs & mockups – HTML support included." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Lorem Ipsum Generator" />
        <meta name="twitter:description" content="Custom placeholder text for UI, web & print designs – instant & free." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Lorem Ipsum Generator",
            url: "https://generatorpromptai.com/tools/lorem-ipsum-generator",
            description: "Free online tool to generate customizable placeholder (Lorem Ipsum) text for design & development.",
            applicationCategory: "UtilityApplication",
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
            Lorem Ipsum Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Custom placeholder text • Paragraphs • Words • HTML • Free & instant
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Paragraphs
                  </label>
                  <input
                    type="number"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(Math.max(1, Math.min(20, parseInt(e.target.value) || 3)))}
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-4 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={startWithLorem}
                      onChange={(e) => setStartWithLorem(e.target.checked)}
                      className="h-5 w-5 text-sky-600 rounded"
                    />
                    <span className="text-gray-700">Start with "Lorem ipsum..."</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeHtml}
                      onChange={(e) => setIncludeHtml(e.target.checked)}
                      className="h-5 w-5 text-sky-600 rounded"
                    />
                    <span className="text-gray-700">Include HTML tags (p + headings)</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <button
                  onClick={generateLorem}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText size={20} />
                  Generate Lorem Ipsum
                </button>

                <button
                  onClick={reset}
                  className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Reset
                </button>
              </div>

              {/* Generated Text */}
              {generatedText ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Generated Placeholder Text
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={copyText}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                      >
                        <Copy size={16} />
                        {copied ? "Copied!" : "Copy All"}
                      </button>

                      <button
                        onClick={downloadText}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                      >
                        <Download size={16} />
                        .txt
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-auto p-5 bg-white border rounded-lg font-sans text-base leading-relaxed whitespace-pre-wrap">
                    {generatedText}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 text-lg">
                  Click "Generate Lorem Ipsum" to create placeholder text
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free Lorem Ipsum Generator – Placeholder Text for Designs
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Instantly make as much placeholder (Lorem Ipsum) text as you want. You can change the number of paragraphs, the number of words per paragraph, the HTML formatting, and the classic starting phrase. Great for web designers, UI/UX mockups, wireframes, presentations, print layouts, or testing content.              </p>
              <p>
                Made in Karachi, no need to sign up, no limits, and it's all done in your browser. This is great for Pakistani freelancers, designers, developers, students, and anyone else working on projects in Pakistan or around the world. In just a few seconds, you can get clean, realistic filler text.              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Lorem Ipsum Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Set number of paragraphs (default 4).</li>
                <li>Choose approximate words per paragraph (default ~80 – adjust for density).</li>
                <li>Check "Start with 'Lorem ipsum...'" for classic Latin beginning (recommended).</li>
                <li>Check "Include HTML tags" for formatted output with paragraphs & random headings.</li>
                <li>Click <strong>Generate Lorem Ipsum</strong>.</li>
                <li>Your custom placeholder text appears below instantly.</li>
                <li>Click <strong>Copy All</strong> or <strong>.txt</strong> to save/copy.</li>
                <li>Use <strong>Reset</strong> to clear and start fresh.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Text & Design Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/word-counter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Word Counter
                </h3>
                <p className="text-gray-600 text-sm">
                  Count words, characters & reading time instantly.
                </p>
              </Link>

              <Link
                to="/tools/fake-data-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Fake Data Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create realistic dummy data (including text fields).
                </p>
              </Link>

              <Link
                to="/tools/json-formatter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  JSON Formatter
                </h3>
                <p className="text-gray-600 text-sm">
                  Beautify, minify & validate JSON code.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default LoremIpsumGenerator;