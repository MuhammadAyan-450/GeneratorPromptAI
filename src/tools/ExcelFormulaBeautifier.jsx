import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Code, AlertTriangle, Braces, Hash, Layers, Home, ChevronDown } from "lucide-react";

const ExcelFormulaBeautifier = () => {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState("");
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const beautifyFormula = () => {
    if (!formula.trim()) {
      setError("Please paste an Excel or Google Sheets formula.");
      setResult("");
      setTokens([]);
      setStats(null);
      return;
    }

    let inString = false;
    let openCount = 0;
    let closeCount = 0;

    for (let i = 0; i < formula.length; i++) {
      if (formula[i] === '"') inString = !inString;
      if (!inString) {
        if (formula[i] === "(") openCount++;
        if (formula[i] === ")") closeCount++;
      }
    }
    if (inString) {
      setError("Syntax Error: Mismatched quotation marks.");
      setResult("");
      setTokens([]);
      setStats(null);
      return;
    }
    if (openCount !== closeCount) {
      setError(`Syntax Error: Mismatched parentheses (${openCount} opening, ${closeCount} closing).`);
      setResult("");
      setTokens([]);
      setStats(null);
      return;
    }

    setError("");

    let formatted = "";
    let indent = 0;
    let maxDepth = 0;
    inString = false;

    for (let i = 0; i < formula.length; i++) {
      let char = formula[i];

      if (char === '"') {
        inString = !inString;
        formatted += char;
      } else if (inString) {
        formatted += char;
      } else {
        if (char === "(") {
          indent++;
          if (indent > maxDepth) maxDepth = indent;
          formatted += "(\n" + "  ".repeat(indent);
        } else if (char === ")") {
          indent--;
          formatted += "\n" + "  ".repeat(indent) + ")";
        } else if (char === ",") {
          formatted += ",\n" + "  ".repeat(indent);
        } else if (char === " ") {
          // Skip existing spaces to normalize formatting
        } else {
          formatted += char;
        }
      }
    }

    setResult(formatted);

    const funcMatches = formula.match(/[A-Za-z_]\w*\(/g);
    const funcCount = funcMatches ? funcMatches.length : 0;
    setStats({
      chars: formula.length,
      functions: funcCount,
      depth: maxDepth,
      commas: (formula.match(/,/g) || []).length,
    });

    const regex = /("(?:[^"\\]|\\.)*")|([A-Za-z_]\w*\()|([A-Za-z]+\d*:[A-Za-z]+\d*|[A-Za-z]+\d*)|([0-9]+\.?[0-9]*)|([\(\),])|(\s+)|(.)/g;
    let match;
    const tempTokens = [];
    while ((match = regex.exec(formatted)) !== null) {
      if (match[1]) tempTokens.push({ type: "string", val: match[1] });
      else if (match[2]) tempTokens.push({ type: "function", val: match[2] });
      else if (match[3]) tempTokens.push({ type: "ref", val: match[3] });
      else if (match[4]) tempTokens.push({ type: "number", val: match[4] });
      else if (match[5]) tempTokens.push({ type: "punct", val: match[5] });
      else if (match[6]) tempTokens.push({ type: "space", val: match[6] });
      else if (match[7]) tempTokens.push({ type: "operator", val: match[7] });
    }
    setTokens(tempTokens);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFormula("");
    setResult("");
    setTokens([]);
    setError("");
    setCopied(false);
    setStats(null);
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Format Messy Excel Formulas with Proper Indentation Online",
    "url": "https://www.generatorpromptai.com/tools/excel-formula-beautifier",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Free online tool to beautify messy Excel and Google Sheets formulas. Adds proper indentation, line breaks, and catches mismatched parentheses instantly.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Excel Formula Beautifier", "item": "https://www.generatorpromptai.com/tools/excel-formula-beautifier" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to format messy Excel formulas for readability?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste your messy formula into our tool and click 'Beautify Formula'. The tool will automatically add line breaks after every comma and nested parentheses with proper indentation so you can easily read and debug the logic."
        }
      },
      {
        "@type": "Question",
        "name": "How to format nested IF statements in Excel formulas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste the nested IF formula into our beautifier. The tool calculates the parenthesis depth and automatically indents each nested level on a new line, making complex conditional logic easy to follow."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this with Google Sheets formulas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Google Sheets and Excel share the exact same formula syntax, so this beautifier works perfectly for formatting both."
        }
      },
      {
        "@type": "Question",
        "name": "How to check Excel formula for mismatched parentheses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply paste your formula into our tool and click 'Beautify Formula'. If there's a mismatch, it will instantly show you an error telling you exactly how many opening vs closing brackets it found."
        }
      },
      {
        "@type": "Question",
        "name": "Is my formula data safe in this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% safe. The entire formatting and syntax checking logic runs locally in your web browser. We do not store, read, or send your formulas to any server."
        }
      },
      {
        "@type": "Question",
        "name": "Can I put the formatted formula back into Excel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Excel and Google Sheets require formulas to be written on a single line. This tool is designed to help you read and debug complex formulas, not to be pasted back into a cell."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Title targeting long-tails */}
        <title>Format Messy Excel Formulas Online – Nested IF Statement Formatter</title>

        <meta
          name="description"
          content="Format messy Excel and Google Sheets formulas for readability. Add proper indentation, line breaks, and check for mismatched parentheses instantly. Free online formula beautifier tool – no signup."
        />

        {/* Low comp long-tail keywords */}
        <meta
          name="keywords"
          content="how to format messy excel formulas, format nested if statement in excel online, excel formula beautifier with syntax highlighting, google sheets nested formula formatter, readable nested if statement formatter, excel formula line breaker tool, check excel formula for mismatched parentheses online, beautify complex vlookup and sumifs formulas, format long excel formulas for debugging, make unreadable excel formulas readable"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/excel-formula-beautifier" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (No emojis) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Format Messy Excel Formulas Online – Nested IF Statement Formatter" />
        <meta property="og:description" content="Format messy Excel and Google Sheets formulas with proper indentation and line breaks. Check for syntax errors instantly." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/excel-formatter" />

        {/* Twitter Card (No emojis) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Excel Formula Beautifier – Format Messy Formulas for Readability" />
        <meta name="twitter:description" content="Format messy Excel and Google Sheets formulas with proper indentation. Check for mismatched parentheses." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb Only ── */}
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
              <li><span className="text-gray-900 font-semibold">Excel Formula Beautifier</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Code className="text-sky-600" size={28} />
            </div>
            {/* H1 targeting long-tails */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Format Messy Excel Formulas Online –{" "}
              <span className="text-sky-600">Nested IF Statement Formatter</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Turn unreadable nested formulas into clean, properly indented code. Check for mismatched parentheses and syntax errors instantly.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paste your messy formula here
            </label>

            <textarea
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder='e.g. =IF(A1>1,SUM(B1:B10),IF(C1="Yes",VLOOKUP(D1,E:F,2,FALSE),0))'
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 font-mono text-sm mb-3 resize-y"
            />

            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button
                onClick={beautifyFormula}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl"
              >
                Beautify Formula
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-3 bg-red-50 p-3 rounded-lg">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            {/* Result Section */}
            {result && (
              <div className="mt-8">

                <div className="bg-gray-900 rounded-2xl p-6 mb-6 overflow-x-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Formatted Output</p>
                  <pre className="text-sm font-mono leading-relaxed">
                    {tokens.map((token, i) => {
                      if (token.type === "function") return <span key={i} className="text-sky-400 font-bold">{token.val}</span>;
                      if (token.type === "string") return <span key={i} className="text-green-400">{token.val}</span>;
                      if (token.type === "ref") return <span key={i} className="text-purple-400">{token.val}</span>;
                      if (token.type === "number") return <span key={i} className="text-orange-400">{token.val}</span>;
                      if (token.type === "operator") return <span key={i} className="text-yellow-300">{token.val}</span>;
                      if (token.type === "punct") return <span key={i} className="text-gray-500">{token.val}</span>;
                      return <span key={i}>{token.val}</span>;
                    })}
                  </pre>
                </div>

                {/* Stats Grid */}
                {stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><Hash size={20} /></div>
                      <p className="text-lg font-bold text-gray-800">{stats.chars}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Characters</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><Braces size={20} /></div>
                      <p className="text-lg font-bold text-gray-800">{stats.functions}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Functions</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><Layers size={20} /></div>
                      <p className="text-lg font-bold text-gray-800">{stats.depth}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Max Depth</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <div className="flex justify-center text-sky-500 mb-1"><AlertTriangle size={20} /></div>
                      <p className="text-lg font-bold text-gray-800">{stats.commas}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Arguments</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={copyResult}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Copy size={15} />
                    {copied ? "Copied!" : "Copy Result"}
                  </button>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <RefreshCw size={15} />
                    Reset
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "google sheets nested formula formatter" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Google Sheets & Excel Formula Beautifier – Readable Nested IF Statements
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Have you ever opened an Excel file and found a formula that looks like a continuous block of text? Nested <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">IF</code> statements, complex <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">VLOOKUP</code>s, and massive <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">SUMIFS</code> are almost impossible to debug when written on a single line.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free <strong>formula beautifier</strong> takes that messy string of text and automatically formats it. It adds line breaks after every comma and logical separation, applies proper indentation based on how deep the parentheses go, and color-codes the functions, references, and text so your eyes can instantly parse the logic.
            </p>
          </div>

          {/* ── How to Use Section ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "how to format messy excel formulas" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Format Messy Excel Formulas for Readability
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Click on the cell containing the formula in Excel or Google Sheets.</li>
              <li>Copy the formula from the formula bar (start from the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">=</code> sign).</li>
              <li>Paste it into the box above and click <strong>"Beautify Formula"</strong>.</li>
              <li>View the beautifully formatted, color-coded version with proper indentation.</li>
              <li>Use the "Copy Result" button to copy the readable version.</li>
            </ol>
          </div>

          {/* ── Features Section ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "beautify complex vlookup and sumifs formulas" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Beautify Complex VLOOKUP & SUMIFS Formulas Instantly
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Readability Formatting", desc: "Automatically adds line breaks and indentation based on parentheses depth so you can understand nested logic at a glance." },
                { title: "Mismatched Parentheses Check", desc: "Instantly detects and alerts you if your formula has mismatched opening or closing brackets." },
                { title: "Syntax Highlighting", desc: "Color-codes functions, cell references, text strings, and operators so each part of the formula is easy to identify." },
                { title: "100% Private & Secure", desc: "All formatting and syntax checking runs locally in your browser. Your formulas are never sent to any server." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Section (Accordion) ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Excel Formula Beautifier – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to format messy Excel formulas for readability?",
                  a: "Paste your messy formula into our tool and click 'Beautify Formula'. The tool will automatically add line breaks after every comma and nested parentheses with proper indentation so you can easily read and debug the logic."
                },
                {
                  q: "How to format nested IF statements in Excel formulas?",
                  a: "Paste the nested IF formula into our beautifier. The tool calculates the parenthesis depth and automatically indents each nested level on a new line, making complex conditional logic easy to follow."
                },
                {
                  q: "Can I use this with Google Sheets formulas?",
                  a: "Yes. Google Sheets and Excel share the exact same formula syntax, so this beautifier works perfectly for formatting both."
                },
                {
                  q: "How to check Excel formula for mismatched parentheses?",
                  a: "Simply paste your formula into our tool and click 'Beautify Formula'. If there's a mismatch, it will instantly show you an error telling you exactly how many opening vs closing brackets it found."
                },
                {
                  q: "Is my formula data safe in this tool?",
                  a: "Yes, 100% safe. The entire formatting and syntax checking logic runs locally in your web browser. We do not store, read, or send your formulas to any server."
                },
                {
                  q: "Can I put the formatted formula back into Excel?",
                  a: "No. Excel and Google Sheets require formulas to be written on a single line. This tool is designed to help you read and debug complex formulas, not to be pasted back into a cell."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Developer Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/json-formatter", title: "JSON Formatter & Validator", desc: "Beautify, minify, and validate JSON data with syntax error highlighting." },
                { to: "/tools/age-calculator", title: "Age Calculator", desc: "Calculate your exact age in years, months, days, and total days lived." },
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters, sentences, and reading time instantly." }
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

export default ExcelFormulaBeautifier;