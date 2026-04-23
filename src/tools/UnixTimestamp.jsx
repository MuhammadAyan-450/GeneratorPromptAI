// pages/UnixTimestamp.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Copy, RefreshCw, Clock, Calendar, Home, ChevronDown,
  Hash, Type, Layers, Download, ArrowRightLeft
} from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
const UnixTimestamp = () => {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [unixResult, setUnixResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedUnix, setCopiedUnix] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Conversions ─────────────────────────────────────────────────────────────
  const convertUnixToDate = () => {
    if (!unixInput) return;
    const date = new Date(unixInput * 1000);
    if (isNaN(date.getTime())) {
      setDateResult("Invalid Timestamp");
      return;
    }
    setDateResult(date.toString());
  };

  const convertDateToUnix = () => {
    if (!dateInput) return;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setUnixResult("Invalid Date");
      return;
    }
    setUnixResult(Math.floor(date.getTime() / 1000).toString());
  };

  const copyCurrentTime = () => {
    navigator.clipboard.writeText(currentTime.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyResult = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const downloadResult = () => {
    const parts = [];
    if (dateResult && dateResult !== "Invalid Timestamp") {
      parts.push(`Unix: ${unixInput}\nDate: ${dateResult}`);
    }
    if (unixResult && unixResult !== "Invalid Date") {
      parts.push(`Date: ${dateInput}\nUnix: ${unixResult}`);
    }
    if (parts.length === 0) return;
    const blob = new Blob([parts.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `unix-timestamp-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setUnixInput("");
    setDateInput("");
    setDateResult("");
    setUnixResult("");
    setCopied(false);
    setCopiedUnix(false);
  };

  // ── Derived Stats ───────────────────────────────────────────────────────────
  const now = new Date();
  const epochStart = new Date("1970-01-01T00:00:00Z");
  const daysSinceEpoch = Math.floor((now - epochStart) / (1000 * 60 * 60 * 24));
  const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const year2038 = new Date("2038-01-19T03:14:07Z");
  const daysTo2038 = Math.max(0, Math.ceil((year2038 - now) / (1000 * 60 * 60 * 24)));
  const currentDateString = now.toLocaleString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const hasResult = dateResult || unixResult;

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert Unix Timestamp to Human Readable Date Online Free – Epoch Time Converter",
    "url": "https://www.generatorpromptai.com/tools/unix-timestamp",
    "applicationCategory": "DeveloperTools",
    "operatingSystem": "All",
    "description": "Free online Unix timestamp converter. Convert epoch seconds to human-readable dates and vice versa. Live Unix clock with stats. No signup required.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Unix Timestamp Converter", "item": "https://www.generatorpromptai.com/tools/unix-timestamp" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to convert Unix timestamp to human readable date online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paste the Unix timestamp (epoch seconds) into the 'Unix Timestamp to Date' input and click Convert. The tool shows the full human-readable date and time in your local timezone."
        }
      },
      {
        "@type": "Question",
        "name": "What is a Unix timestamp and why does it start from 1970?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Unix timestamp (epoch time) is the number of seconds elapsed since January 1, 1970 at 00:00:00 UTC. This date is called the Unix Epoch and was chosen as the standard reference point for Unix operating systems."
        }
      },
      {
        "@type": "Question",
        "name": "Is Unix timestamp affected by timezone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Unix timestamps are always in UTC and are timezone-agnostic. However, when converting to a readable date, the result is displayed in your browser's local timezone for convenience."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between seconds and milliseconds timestamp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard Unix timestamps are in seconds. Some systems (like JavaScript's Date.now()) use milliseconds. To convert milliseconds to seconds, divide by 1000. To convert seconds to milliseconds, multiply by 1000."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Year 2038 problem in Unix timestamps?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "32-bit Unix timestamps will overflow on January 19, 2038 at 03:14:07 UTC (timestamp 2147483647). Most modern 64-bit systems are not affected. This tool uses 64-bit integers and works far beyond 2038."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Convert Unix Timestamp to Human Readable Date Online Free – Epoch Time Converter</title>

        <meta
          name="description"
          content="Free online Unix timestamp converter. Convert epoch seconds to human-readable dates and vice versa. Live Unix clock with stats. No signup required."
        />

        <meta
          name="keywords"
          content="how to convert unix timestamp to human readable date online free, epoch time converter seconds to date free tool, convert human date to unix epoch timestamp online, what is unix timestamp and why 1970 epoch explained, unix timestamp milliseconds vs seconds difference converter, check year 2038 problem unix timestamp overflow free, live unix epoch clock current timestamp online, free online unix timestamp converter for developers no signup, convert timestamp to date javascript php python format, best free epoch time converter with download and copy 2026"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/unix-timestamp" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Convert Unix Timestamp to Date Free – Epoch Time Converter with Live Clock" />
        <meta property="og:description" content="Convert epoch seconds to readable dates and vice versa. Live Unix clock, stats, copy and download. Free developer tool." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/unix-timestamp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Unix Timestamp Converter – Epoch to Date & Back" />
        <meta name="twitter:description" content="Convert Unix timestamps to readable dates instantly. Live clock included. Free online tool." />

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
              <li><span className="text-gray-900 font-semibold">Unix Timestamp Converter</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Clock className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Convert Unix Timestamp to Human Readable Date Online Free –{" "}
              <span className="text-sky-600">Epoch Time Converter</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Convert epoch seconds to readable dates and vice versa. Live Unix clock with epoch stats for developers.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Live Clock Banner */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-1">Current Unix Timestamp</p>
                <p className="text-xs text-sky-500">Updates every second</p>
              </div>
              <p className="text-4xl md:text-5xl font-mono font-bold text-sky-700 tracking-tight text-center">
                {currentTime}
              </p>
              <button
                onClick={copyCurrentTime}
                className="bg-white hover:bg-gray-50 text-sky-700 font-bold py-2.5 px-5 rounded-xl border border-sky-200 transition-colors text-sm flex-shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Two Column Inputs */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* Unix to Date */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-sky-600" size={18} />
                  <h3 className="font-bold text-gray-800 text-sm">Unix Timestamp to Date</h3>
                </div>
                <input
                  type="number"
                  value={unixInput}
                  onChange={(e) => setUnixInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && convertUnixToDate()}
                  className={`${inputCls} font-mono mb-3`}
                  placeholder="e.g. 1672531200"
                />
                <button
                  onClick={convertUnixToDate}
                  className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  Convert to Date
                </button>
              </div>

              {/* Date to Unix */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="text-sky-600" size={18} />
                  <h3 className="font-bold text-gray-800 text-sm">Date to Unix Timestamp</h3>
                </div>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && convertDateToUnix()}
                  className={`${inputCls} mb-3`}
                />
                <button
                  onClick={convertDateToUnix}
                  className="w-full bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  Convert to Timestamp
                </button>
              </div>
            </div>

            {/* Swap Icon (Visual) */}
            <div className="flex justify-center mb-2">
              <div className="bg-gray-50 p-2 rounded-full text-gray-400">
                <ArrowRightLeft size={22} />
              </div>
            </div>

            {/* Reset */}
            <div className="flex justify-center mb-2">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>

            {/* ── Result Section ── */}
            {hasResult && (
              <div className="mt-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Hash size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{currentTime}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Current Epoch</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Calendar size={20} /></div>
                    <p className="text-sm font-bold text-gray-800">{currentDateString}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Current Date</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Layers size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{daysSinceEpoch.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Days Since Epoch</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Clock size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{daysTo2038.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Days to 2038</p>
                  </div>
                </div>

                {/* Dark Output Block */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6 overflow-x-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">Conversion Results</p>

                  {dateResult && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Unix {unixInput} → Human Date</p>
                      <pre className={`text-sm font-mono leading-relaxed ${dateResult === "Invalid Timestamp" ? "text-red-400" : "text-sky-400"}`}>
                        {dateResult}
                      </pre>
                    </div>
                  )}

                  {unixResult && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date {dateInput} → Unix Timestamp</p>
                      <pre className={`text-sm font-mono leading-relaxed ${unixResult === "Invalid Date" ? "text-red-400" : "text-green-400"}`}>
                        {unixResult}
                      </pre>
                    </div>
                  )}

                  {!dateResult && !unixResult && (
                    <pre className="text-sm text-gray-500">No conversion yet</pre>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                  {(dateResult && dateResult !== "Invalid Timestamp") && (
                    <button
                      onClick={() => copyResult(dateResult, setCopied)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                    >
                      <Copy size={15} />
                      {copied ? "Copied!" : "Copy Date"}
                    </button>
                  )}
                  {(unixResult && unixResult !== "Invalid Date") && (
                    <button
                      onClick={() => copyResult(unixResult, setCopiedUnix)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                    >
                      <Copy size={15} />
                      {copiedUnix ? "Copied!" : "Copy Timestamp"}
                    </button>
                  )}
                  <button
                    onClick={downloadResult}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Download size={15} /> Download .txt
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasResult && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <Clock size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Enter a timestamp or date and click <strong className="text-gray-500">Convert</strong> to see results</p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Unix Timestamp Converter — Epoch Seconds to Date &amp; Back
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              A <strong>Unix Timestamp</strong> (also known as Epoch time) is a way to track time as a running total of seconds since January 1st, 1970 at 00:00:00 UTC — the <strong>Unix Epoch</strong>. This format is universal and timezone-agnostic, making it the standard way to store dates in databases, set cookie expiration times, schedule cron jobs, and debug API responses.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free converter lets you instantly switch between epoch seconds and human-readable dates in both directions. The <strong>live Unix clock</strong> shows the current epoch timestamp updating every second, while the stats grid displays useful context like days since epoch and the countdown to the <strong>Year 2038 problem</strong> when 32-bit timestamps overflow.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Convert Unix Timestamp to Human Readable Date Online Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>To convert <strong>timestamp to date</strong>, paste the epoch seconds in the left input and click "Convert to Date".</li>
              <li>To convert <strong>date to timestamp</strong>, pick a date/time in the right input and click "Convert to Timestamp".</li>
              <li>View the <strong>stats grid</strong> showing current epoch, current date, days since epoch, and days to 2038.</li>
              <li>Results appear in the <strong>dark output block</strong> — copy individual results or download both as .txt.</li>
              <li>Use the <strong>live clock banner</strong> at the top to copy the current Unix timestamp at any moment.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Epoch Time Converter with Live Clock – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Live Unix Clock (Updates Every Second)", desc: "A real-time epoch counter shows the current Unix timestamp at the top of the tool. One-click copy to clipboard for instant use in code, APIs, or database queries." },
                { title: "Bidirectional Conversion", desc: "Convert Unix timestamps to human-readable dates AND convert dates back to epoch seconds. Both conversions work instantly with Enter key support for power users." },
                { title: "Epoch Stats Dashboard", desc: "See the current epoch value, current date/time, total days since January 1 1970, and a countdown to the Year 2038 problem — all updating live." },
                { title: "Copy & Download Results", desc: "Copy individual conversion results to clipboard or download both conversions as a single .txt file. Perfect for documentation, debugging notes, or sharing with team members." }
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
              Unix Timestamp Converter – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to convert Unix timestamp to human readable date online free?",
                  a: "Paste the Unix timestamp (epoch seconds) into the 'Unix Timestamp to Date' input and click Convert. The tool shows the full human-readable date and time in your browser's local timezone."
                },
                {
                  q: "What is a Unix timestamp and why does it start from 1970?",
                  a: "A Unix timestamp (epoch time) is the number of seconds elapsed since January 1, 1970 at 00:00:00 UTC. This date is called the Unix Epoch and was chosen as the standard reference point for Unix operating systems."
                },
                {
                  q: "Is Unix timestamp affected by timezone?",
                  a: "No. Unix timestamps are always in UTC and are timezone-agnostic. However, when converting to a readable date, the result is displayed in your browser's local timezone for convenience."
                },
                {
                  q: "What is the difference between seconds and milliseconds timestamp?",
                  a: "Standard Unix timestamps are in seconds. Some systems like JavaScript's Date.now() use milliseconds. To convert milliseconds to seconds, divide by 1000. To convert seconds to milliseconds, multiply by 1000."
                },
                {
                  q: "What is the Year 2038 problem in Unix timestamps?",
                  a: "32-bit signed Unix timestamps will overflow on January 19, 2038 at 03:14:07 UTC (timestamp 2147483647). Most modern 64-bit systems are not affected. This tool uses 64-bit integers and works correctly far beyond 2038."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Developer &amp; Encoding Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/base64-encode", title: "Base64 Encoder / Decoder", desc: "Encode and decode text to Base64 format for data transmission." },
                { to: "/tools/url-encoder", title: "URL Encoder / Decoder", desc: "Encode and decode URLs with special characters for APIs." },
                { to: "/tools/uuid-generator", title: "UUID Generator", desc: "Generate unique UUID v4 identifiers for database keys and tokens." }
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

export default UnixTimestamp;