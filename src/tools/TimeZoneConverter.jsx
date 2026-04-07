// pages/TimeZoneConverter.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Copy, Eraser, RefreshCw } from "lucide-react";

const TimeZoneConverter = () => {
  const [inputTime, setInputTime] = useState(new Date().toISOString().slice(0, 16));
  const [fromTz, setFromTz] = useState("Asia/Karachi");
  const [toTz, setToTz] = useState("America/New_York");
  const [result, setResult] = useState("");
  const [currentFrom, setCurrentFrom] = useState("");
  const [currentTo, setCurrentTo] = useState("");
  const [copied, setCopied] = useState(false);

  const timeZones = [
    { label: "Karachi (PKT)", value: "Asia/Karachi", offset: "UTC+5" },
    { label: "New York (EST/EDT)", value: "America/New_York", offset: "UTC-5 / -4" },
    { label: "London (GMT/BST)", value: "Europe/London", offset: "UTC+0 / +1" },
    { label: "Dubai (GST)", value: "Asia/Dubai", offset: "UTC+4" },
    { label: "Tokyo (JST)", value: "Asia/Tokyo", offset: "UTC+9" },
    { label: "Sydney (AEDT/AEST)", value: "Australia/Sydney", offset: "UTC+10 / +11" },
    { label: "Los Angeles (PST/PDT)", value: "America/Los_Angeles", offset: "UTC-8 / -7" },
    { label: "UTC / GMT", value: "UTC", offset: "UTC+0" },
    { label: "Paris (CET/CEST)", value: "Europe/Paris", offset: "UTC+1 / +2" },
    { label: "Beijing (CST)", value: "Asia/Shanghai", offset: "UTC+8" },
    { label: "Moscow (MSK)", value: "Europe/Moscow", offset: "UTC+3" },
    { label: "Mumbai (IST)", value: "Asia/Kolkata", offset: "UTC+5:30" },
  ];

  const updateCurrentTimes = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: fromTz,
    });
    setCurrentFrom(formatter.format(now));

    const toFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: toTz,
    });
    setCurrentTo(toFormatter.format(now));
  };

  const convertTime = () => {
    if (!inputTime) {
      setResult("");
      return;
    }
    try {
      const inputDate = new Date(inputTime);
      if (isNaN(inputDate.getTime())) throw new Error();

      const converted = inputDate.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: toTz,
      });

      setResult(converted);
    } catch {
      setResult("Invalid date/time format");
    }
  };

  useEffect(() => {
    updateCurrentTimes();
    const interval = setInterval(updateCurrentTimes, 60000);
    return () => clearInterval(interval);
  }, [fromTz, toTz]);

  useEffect(() => {
    convertTime();
  }, [inputTime, fromTz, toTz]);

  const copyResult = () => {
    if (!result) return;
    const fromZone = timeZones.find(t => t.value === fromTz)?.label || fromTz;
    const toZone = timeZones.find(t => t.value === toTz)?.label || toTz;
    const text = `${inputTime} (${fromZone}) → ${result} (${toZone})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const swapTimeZones = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  const reset = () => {
    setInputTime(new Date().toISOString().slice(0, 16));
    setFromTz("Asia/Karachi");
    setToTz("America/New_York");
    setResult("");
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Time Zone Converter",
    url: "https://www.generatorpromptai.com/tools/time-zone-converter",
    description: "Free online tool to convert time between cities and time zones worldwide.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI" }
  };

  const schemaBreadCrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", position: 2, name: "Calculators", item: "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", position: 3, name: "Time Zone Converter", item: "https://www.generatorpromptai.com/tools/time-zone-converter" }
    ]
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert Time Zones",
    description: "Steps to convert time between different cities online.",
    step: [
      { "@type": "HowToStep", name: "Select Time", text: "Choose the date and time you want to convert." },
      { "@type": "HowToStep", name: "Select Zones", text: "Pick the origin and destination time zones from the dropdowns." },
      { "@type": "HowToStep", name: "View Result", text: "The converted time appears instantly. Click copy to save the result." }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does this tool automatically handle Daylight Saving Time (DST)?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our tool uses the native browser Internationalization API, which automatically adjusts for Daylight Saving Time based on the specific time zone and date you select." }
      },
      {
        "@type": "Question",
        name: "Why is the time different depending on the date I select?",
        acceptedAnswer: { "@type": "Answer", text: "Because some regions change their UTC offset for Daylight Saving Time. For example, New York is UTC-5 in winter but UTC-4 in summer." }
      },
      {
        "@type": "Question",
        name: "Is the current time shown live?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. The current local time for both selected time zones updates automatically every minute." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Time Zone Converter - Convert Time Between Cities Worldwide</title>
        <meta name="description" content="Convert time between any cities instantly – Karachi, New York, London, Dubai, Tokyo & more. Handles DST automatically with live current times." />
        <meta name="keywords" content="time zone converter online, convert time between cities, world time converter, karachi to new york time, pakistan time converter" />
        
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/time-zone-converter" />

        <meta property="og:title" content="Time Zone Converter – Free Online Worldwide" />
        <meta property="og:description" content="Instant time conversion between cities – live current times & DST support." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/time-zone-converter" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Time Zone Converter" />
        <meta name="twitter:description" content="Convert time across zones instantly – Karachi, New York, London & more." />

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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mb-4">
              <Clock className="text-blue-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Time Zone Converter
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Convert time between cities • Live current times • DST aware
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Date Picker (Full Width) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date & Time to Convert
                  </label>
                  <input
                    type="datetime-local"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                </div>

                {/* Zones Row */}
                <div className="flex items-end gap-3 sm:gap-4">
                  {/* From Zone */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">From Time Zone</label>
                    <select
                      value={fromTz}
                      onChange={(e) => setFromTz(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
                    >
                      {timeZones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label} ({tz.offset})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1.5 truncate">
                      Now: <strong>{currentFrom || "..."}</strong>
                    </p>
                  </div>

                  {/* Swap Button (Aligned with inputs) */}
                  <button
                    onClick={swapTimeZones}
                    className="flex-shrink-0 p-3 mb-[18px] sm:mb-[22px] bg-gray-100 hover:bg-gray-200 rounded-xl transition shadow-sm group"
                    title="Swap time zones"
                    aria-label="Swap from and to time zones"
                  >
                    <RefreshCw size={22} className="text-gray-600 transform rotate-90 group-hover:rotate-[270deg] transition-transform duration-300" />
                  </button>

                  {/* To Zone */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">To Time Zone</label>
                    <select
                      value={toTz}
                      onChange={(e) => setToTz(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
                    >
                      {timeZones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label} ({tz.offset})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1.5 truncate">
                      Now: <strong>{currentTo || "..."}</strong>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium flex items-center justify-center gap-2 text-gray-700"
                  >
                    <Eraser size={18} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Result Area */}
              {result && !result.includes("Invalid") ? (
                <div className="mt-10 p-8 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                  <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Converted Time</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-3 tracking-tight">
                    {result}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    in {toTz.split("/")[1].replace("_", " ")}
                  </p>
                  <button
                    onClick={copyResult}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-xl transition font-medium shadow-sm"
                  >
                    <Copy size={16} />
                    {copied ? "Copied!" : "Copy Conversion"}
                  </button>
                </div>
              ) : result.includes("Invalid") ? (
                <div className="mt-10 text-center text-red-500 font-medium">
                  {result}
                </div>
              ) : null}
            </div>
          </div>

          {/* SEO Content */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Time Zone Converter – Worldwide City Time Conversion
            </h2>
            <div className="text-gray-600 space-y-4 leading-relaxed">
              <p>
                Convert any date and time between major cities or time zones instantly. From Karachi PKT to New York EST, London GMT, Dubai GST, Tokyo JST, and more. Our tool automatically handles Daylight Saving Time (DST) based on the exact date you select.
              </p>
              <p>
                Perfect for remote workers, international business teams, travelers, and freelancers coordinating across different countries. The live current time for both selected zones updates automatically every minute. 100% free and runs directly in your browser.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the Time Zone Converter</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base">
              <li>Pick the date and time you want to convert (defaults to current time).</li>
              <li>Select the <strong>"From"</strong> time zone (e.g., Asia/Karachi).</li>
              <li>Select the <strong>"To"</strong> time zone (e.g., America/New_York).</li>
              <li>Click the swap button to reverse the zones instantly.</li>
              <li>The converted time appears immediately in the blue result box below.</li>
              <li>Click <strong>Copy Conversion</strong> to copy the full result.</li>
            </ol>
          </section>

          {/* FAQ Section for SEO */}
          <section className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Does this tool automatically handle Daylight Saving Time (DST)?",
                  a: "Yes. Our tool uses the native browser Internationalization API, which automatically adjusts for DST based on the specific time zone and the exact date you select."
                },
                {
                  q: "Why is the converted time different depending on the date I select?",
                  a: "Because some regions change their UTC offset for Daylight Saving Time. For example, New York is UTC-5 in winter but shifts to UTC-4 in summer."
                },
                {
                  q: "Is the current time shown live?",
                  a: "Yes. The current local time displayed under both dropdowns updates automatically every minute."
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Related Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/currency-converter", title: "Currency Converter", desc: "Convert currencies with live exchange rates." },
                { to: "/tools/age-calculator", title: "Age Calculator", desc: "Calculate exact age in years, months, days & more." },
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate %, increase, decrease, reverse & more." },
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

export default TimeZoneConverter;