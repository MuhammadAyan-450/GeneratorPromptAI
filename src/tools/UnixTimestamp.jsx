import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Clock, Calendar, ArrowRightLeft } from "lucide-react";

const UnixTimestamp = () => {
  // Live Current Time
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  
  // Inputs
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  
  // Results
  const [dateResult, setDateResult] = useState("");
  const [unixResult, setUnixResult] = useState("");
  const [copied, setCopied] = useState(false);

  // --- Live Clock Effect ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Logic ---

  const convertUnixToDate = () => {
    if (!unixInput) return;
    const date = new Date(unixInput * 1000);
    if (isNaN(date.getTime())) {
      setDateResult("Invalid Timestamp");
      return;
    }
    // Format: Weekday, Month Day, Year HH:MM:SS
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

  const handleDateInputKeyDown = (e) => {
    if (e.key === 'Enter') convertDateToUnix();
  };

  const handleUnixInputKeyDown = (e) => {
    if (e.key === 'Enter') convertUnixToDate();
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Unix Timestamp Converter",
    url: "https://www.generatorpromptai.com/tools/unix-timestamp",
    applicationCategory: "DeveloperTools",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free Unix Timestamp Converter. Convert epoch timestamps to human-readable dates and vice versa. Live clock included.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Unix Timestamp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Unix Timestamp (or Epoch time) is the number of seconds that have elapsed since January 1, 1970 (excluding leap seconds)."
        }
      },
      {
        "@type": "Question",
        name: "Why does it start from 1970?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This date is known as the 'Unix Epoch'. It was chosen as the standard reference point for Unix systems."
        }
      },
      {
        "@type": "Question",
        name: "How do I convert a date to timestamp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use our tool above. Select the date and time in the 'Human Date to Timestamp' section and click Convert."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Unix Timestamp Converter - Epoch Time Converter</title>
        <meta
          name="description"
          content="Free online Unix Timestamp Converter. Convert epoch seconds to human-readable dates and vice versa. Includes a live Unix clock."
        />
        <meta
          name="keywords"
          content="unix timestamp, epoch converter, timestamp to date, date to timestamp, unix time, epoch time converter"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/unix-timestamp" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Unix Timestamp Converter - Epoch Time" />
        <meta property="og:description" content="Convert Unix timestamps to readable dates instantly. Free developer tool with live clock." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/unix-timestamp" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-unix-timestamp.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unix Timestamp Converter" />
        <meta name="twitter:description" content="Convert epoch timestamps to dates and back. Live clock included." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-unix-timestamp.png" />

        {/* Schema: WebApplication */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

        {/* Schema: FAQ */}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Back Nav */}
        <div className="max-w-4xl mx-auto w-full px-4 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Clock className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Unix Timestamp Converter
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Convert epoch timestamps to human-readable dates and vice versa. Essential for developers and sysadmins.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
            
            {/* Live Clock Section */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-sky-600 uppercase tracking-wider mb-1">Current Unix Timestamp</p>
                <p className="text-xs text-sky-500">Updates every second</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-4xl md:text-5xl font-mono font-bold text-sky-700 tracking-tight">
                  {currentTime}
                </p>
              </div>
              <button
                onClick={copyCurrentTime}
                className="bg-white hover:bg-gray-50 text-sky-700 font-bold py-2 px-4 rounded-xl border border-sky-200 transition-colors text-sm"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              
              {/* Unix to Date */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-sky-600" size={20} />
                  <h3 className="font-bold text-gray-800">Unix Timestamp to Date</h3>
                </div>
                <input
                  type="number"
                  value={unixInput}
                  onChange={(e) => setUnixInput(e.target.value)}
                  onKeyDown={handleUnixInputKeyDown}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 font-mono"
                  placeholder="e.g. 1672531200"
                />
                <button
                  onClick={convertUnixToDate}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Convert to Date
                </button>
                {dateResult && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Human Readable Date</p>
                    <p className="font-mono text-gray-800 break-words">{dateResult}</p>
                  </div>
                )}
              </div>

              {/* Date to Unix */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-sky-600" size={20} />
                  <h3 className="font-bold text-gray-800">Date to Unix Timestamp</h3>
                </div>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  onKeyDown={handleDateInputKeyDown}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
                />
                <button
                  onClick={convertDateToUnix}
                  className="w-full bg-white border-2 border-sky-100 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all"
                >
                  Convert to Timestamp
                </button>
                {unixResult && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Epoch Seconds</p>
                        <p className="font-mono text-gray-800">{unixResult}</p>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(unixResult)} className="text-sky-600 hover:text-sky-800">
                        <Copy size={18} />
                    </button>
                  </div>
                )}
              </div>

            </div>
            
            {/* Swap Button (Visual only) */}
            <div className="flex justify-center">
                <div className="bg-gray-50 p-2 rounded-full text-gray-400">
                    <ArrowRightLeft size={24} />
                </div>
            </div>

          </div>

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Unix Timestamp Converter
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              A <strong>Unix Timestamp</strong> (also known as Epoch time) is a way to track time as a running total of seconds. This count starts at the Unix Epoch on January 1st, 1970 at UTC. Therefore, the Unix timestamp is merely the number of seconds between a particular date and the Unix Epoch.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Developers use this format to store dates in databases because it is universal and timezone-agnostic. Our tool allows you to quickly convert these large numbers back into readable dates, or find the timestamp for a specific future date.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Common Use Cases:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Setting expiration dates for cookies.</li>
              <li>Database record timestamps.</li>
              <li>Scheduling cron jobs.</li>
              <li>Debugging API responses.</li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Is the timestamp affected by my timezone?",
                  a: "No. The Unix timestamp is always in UTC. However, when we convert it to a date, we display it in your local browser timezone for your convenience."
                },
                {
                  q: "Will this work after the Year 2038 problem?",
                  a: "The 2038 problem affects 32-bit systems. Most modern systems and this tool use 64-bit integers, so they will handle dates far into the future."
                },
                {
                  q: "How many milliseconds are in a Unix timestamp?",
                  a: "Standard Unix timestamps are in seconds. Some systems use milliseconds, which would be the timestamp multiplied by 1000."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Developer Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/base64-encode", title: "Base64 Encoder", desc: "Encode and decode text to Base64 format." },
                { to: "/tools/html-entity-encoder", title: "HTML Entity Encoder", desc: "Convert special characters to HTML entities." },
                { to: "/tools/color-picker", title: "Color Picker", desc: "Pick colors and get Hex, RGB, and HSL codes." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-sky-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {tool.title}
                  </h3>
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