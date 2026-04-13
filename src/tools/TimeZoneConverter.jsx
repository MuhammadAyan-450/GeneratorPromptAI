// pages/TimeZoneConverter.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Copy, RefreshCw, ArrowLeftRight, Globe } from "lucide-react";

// ─── All supported time zones ─────────────────────────────────────────────────
const TIME_ZONES = [
  { label: "Karachi (PKT)",          value: "Asia/Karachi",        offset: "UTC+5"      },
  { label: "Dubai (GST)",            value: "Asia/Dubai",          offset: "UTC+4"      },
  { label: "Riyadh (AST)",           value: "Asia/Riyadh",         offset: "UTC+3"      },
  { label: "Doha / Qatar (AST)",     value: "Asia/Qatar",          offset: "UTC+3"      },
  { label: "Kuwait City (AST)",      value: "Asia/Kuwait",         offset: "UTC+3"      },
  { label: "Bahrain (AST)",          value: "Asia/Bahrain",        offset: "UTC+3"      },
  { label: "Abu Dhabi (GST)",        value: "Asia/Dubai",          offset: "UTC+4"      },
  { label: "Mumbai / Delhi (IST)",   value: "Asia/Kolkata",        offset: "UTC+5:30"   },
  { label: "Dhaka (BST)",            value: "Asia/Dhaka",          offset: "UTC+6"      },
  { label: "Kabul (AFT)",            value: "Asia/Kabul",          offset: "UTC+4:30"   },
  { label: "London (GMT/BST)",       value: "Europe/London",       offset: "UTC+0/+1"   },
  { label: "Paris / Berlin (CET)",   value: "Europe/Paris",        offset: "UTC+1/+2"   },
  { label: "Moscow (MSK)",           value: "Europe/Moscow",       offset: "UTC+3"      },
  { label: "Istanbul (TRT)",         value: "Europe/Istanbul",     offset: "UTC+3"      },
  { label: "UTC / GMT",              value: "UTC",                 offset: "UTC+0"      },
  { label: "New York (EST/EDT)",     value: "America/New_York",    offset: "UTC-5/-4"   },
  { label: "Los Angeles (PST/PDT)",  value: "America/Los_Angeles", offset: "UTC-8/-7"   },
  { label: "Chicago (CST/CDT)",      value: "America/Chicago",     offset: "UTC-6/-5"   },
  { label: "Toronto (EST/EDT)",      value: "America/Toronto",     offset: "UTC-5/-4"   },
  { label: "Vancouver (PST/PDT)",    value: "America/Vancouver",   offset: "UTC-8/-7"   },
  { label: "Beijing / Shanghai (CST)",value: "Asia/Shanghai",      offset: "UTC+8"      },
  { label: "Tokyo (JST)",            value: "Asia/Tokyo",          offset: "UTC+9"      },
  { label: "Singapore (SGT)",        value: "Asia/Singapore",      offset: "UTC+8"      },
  { label: "Kuala Lumpur (MYT)",     value: "Asia/Kuala_Lumpur",   offset: "UTC+8"      },
  { label: "Bangkok (ICT)",          value: "Asia/Bangkok",        offset: "UTC+7"      },
  { label: "Sydney (AEDT/AEST)",     value: "Australia/Sydney",    offset: "UTC+10/+11" },
  { label: "Auckland (NZST/NZDT)",   value: "Pacific/Auckland",    offset: "UTC+12/+13" },
  { label: "Nairobi (EAT)",          value: "Africa/Nairobi",      offset: "UTC+3"      },
  { label: "Cairo (EET)",            value: "Africa/Cairo",        offset: "UTC+2"      },
  { label: "Johannesburg (SAST)",    value: "Africa/Johannesburg", offset: "UTC+2"      },
];

// ─── Quick pair presets ───────────────────────────────────────────────────────
const QUICK_PAIRS = [
  { label: "Karachi → Dubai",    from: "Asia/Karachi",     to: "Asia/Dubai"          },
  { label: "Karachi → London",   from: "Asia/Karachi",     to: "Europe/London"       },
  { label: "Karachi → New York", from: "Asia/Karachi",     to: "America/New_York"    },
  { label: "Karachi → Riyadh",   from: "Asia/Karachi",     to: "Asia/Riyadh"         },
  { label: "Karachi → Toronto",  from: "Asia/Karachi",     to: "America/Toronto"     },
  { label: "Dubai → London",     from: "Asia/Dubai",       to: "Europe/London"       },
  { label: "London → New York",  from: "Europe/London",    to: "America/New_York"    },
  { label: "UTC → Karachi",      from: "UTC",              to: "Asia/Karachi"        },
];

// ─── Cities to show in multi-compare ─────────────────────────────────────────
const COMPARE_ZONES = [
  "Asia/Karachi", "Asia/Dubai", "Asia/Riyadh",
  "Europe/London", "America/New_York", "America/Los_Angeles",
  "Asia/Tokyo", "Australia/Sydney",
];

const formatTime = (date, tz, style = "short") =>
  date.toLocaleString("en-US", {
    dateStyle: "medium", timeStyle: style, timeZone: tz,
  });

const getLabel = (tz) => TIME_ZONES.find((t) => t.value === tz)?.label || tz;

// ─── Component ────────────────────────────────────────────────────────────────
const TimeZoneConverter = () => {
  const [inputTime, setInputTime]   = useState(new Date().toISOString().slice(0, 16));
  const [fromTz,    setFromTz]      = useState("Asia/Karachi");
  const [toTz,      setToTz]        = useState("America/New_York");
  const [result,    setResult]      = useState("");
  const [liveFrom,  setLiveFrom]    = useState("");
  const [liveTo,    setLiveTo]      = useState("");
  const [liveAll,   setLiveAll]     = useState({});
  const [copied,    setCopied]      = useState(false);
  const [toast,     setToast]       = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  // Live clock — updates every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLiveFrom(formatTime(now, fromTz));
      setLiveTo(formatTime(now, toTz));
      const all = {};
      COMPARE_ZONES.forEach((tz) => { all[tz] = formatTime(now, tz); });
      setLiveAll(all);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [fromTz, toTz]);

  // Convert on input change
  useEffect(() => {
    if (!inputTime) { setResult(""); return; }
    try {
      const d = new Date(inputTime);
      if (isNaN(d)) throw new Error();
      setResult(formatTime(d, toTz));
    } catch {
      setResult("Invalid date");
    }
  }, [inputTime, toTz]);

  const swap = () => { setFromTz(toTz); setToTz(fromTz); };

  const applyPair = (pair) => { setFromTz(pair.from); setToTz(pair.to); };

  const copyResult = () => {
    if (!result || result === "Invalid date") return;
    const text = `${inputTime} (${getLabel(fromTz)}) → ${result} (${getLabel(toTz)})`;
    navigator.clipboard.writeText(text);
    setCopied(true); showToast("Conversion copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setInputTime(new Date().toISOString().slice(0, 16));
    setFromTz("Asia/Karachi"); setToTz("America/New_York");
  };

  const selectCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white text-sm";

  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Time Zone Converter",
    url: "https://www.generatorpromptai.com/tools/time-zone-converter",
    description: "Free online time zone converter. Convert time between cities worldwide — Karachi, Dubai, London, New York, Toronto, Riyadh and 25+ more. DST auto-handled.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",      item: "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", position: 2, name: "All Tools", item: "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", position: 3, name: "Time Zone Converter", item: "https://www.generatorpromptai.com/tools/time-zone-converter" },
    ],
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert Time Between Time Zones",
    description: "Steps to convert time between different cities and time zones online.",
    step: [
      { "@type": "HowToStep", name: "Select Date & Time", text: "Pick the date and time you want to convert using the date/time picker." },
      { "@type": "HowToStep", name: "Choose Zones",       text: "Select the From and To time zones from the dropdown menus." },
      { "@type": "HowToStep", name: "View Result",        text: "The converted time appears instantly. Click Copy to save the result." },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What time is it in Dubai when it is 12pm in Karachi?",
        acceptedAnswer: { "@type": "Answer", text: "When it is 12:00 PM in Karachi (PKT, UTC+5), it is 11:00 AM in Dubai (GST, UTC+4). Dubai is 1 hour behind Karachi." },
      },
      {
        "@type": "Question",
        name: "What time is it in London when it is 12pm in Karachi?",
        acceptedAnswer: { "@type": "Answer", text: "When it is 12:00 PM in Karachi, London is 5 hours behind in winter (GMT, UTC+0) and 4 hours behind in summer (BST, UTC+1). Our tool adjusts automatically for Daylight Saving Time." },
      },
      {
        "@type": "Question",
        name: "Does this tool automatically handle Daylight Saving Time (DST)?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. The tool uses the browser's native Intl.DateTimeFormat API which automatically applies DST based on the specific time zone and the exact date selected." },
      },
      {
        "@type": "Question",
        name: "What is the time difference between Karachi and Toronto?",
        acceptedAnswer: { "@type": "Answer", text: "Karachi (PKT) is 10 hours ahead of Toronto (EST) in winter and 9 hours ahead in summer during Eastern Daylight Time (EDT). Use our converter to get the exact time for any specific date." },
      },
      {
        "@type": "Question",
        name: "Is the current time shown in real time?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. The live current time shown under both zone dropdowns and in the world clock table updates every second." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Time Zone Converter - Convert Time Between Cities Worldwide | Karachi, Dubai, London</title>
        <meta
          name="description"
          content="Free online time zone converter — convert time between Karachi, Dubai, London, New York, Toronto, Riyadh and 25+ cities. DST auto-handled. Live current times. No sign-up."
        />
        <meta
          name="keywords"
          content="time zone converter, convert time between cities, karachi to new york time, karachi to dubai time, world time converter, time zone calculator, pakistan time converter, DST time zone"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/time-zone-converter" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Time Zone Converter - Karachi, Dubai, London, New York & 25+ Cities" />
        <meta property="og:description" content="Convert time between cities instantly. Karachi to Dubai, London, New York, Toronto, Riyadh and more. DST auto-handled. Live clocks." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/time-zone-converter" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-time-zone-converter.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Time Zone Converter - Karachi, Dubai, London, New York" />
        <meta name="twitter:description" content="Convert time between any cities. 25+ time zones. DST auto-handled. Live current times." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-time-zone-converter.png" />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaHowTo)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mb-4">
              <Clock className="text-blue-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Time Zone Converter</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Convert time between Karachi, Dubai, London, New York and 25+ cities. DST auto-handled. Live clocks.
            </p>
          </div>

          {/* Quick Pairs */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Pairs</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PAIRS.map((pair) => (
                <button
                  key={pair.label}
                  onClick={() => applyPair(pair)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                    fromTz === pair.from && toTz === pair.to
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 mb-6">

            {/* Date/Time picker */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date &amp; Time to Convert</label>
              <input
                type="datetime-local"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>

            {/* From / Swap / To */}
            <div className="flex items-end gap-3 mb-5">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                <select value={fromTz} onChange={(e) => setFromTz(e.target.value)} className={selectCls}>
                  {TIME_ZONES.map((tz) => (
                    <option key={tz.value + tz.label} value={tz.value}>{tz.label} ({tz.offset})</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1.5">Now: <strong className="text-gray-600">{liveFrom}</strong></p>
              </div>

              <button
                onClick={swap}
                className="flex-shrink-0 p-3 mb-[22px] bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-colors"
                title="Swap zones" aria-label="Swap time zones"
              >
                <ArrowLeftRight size={20} />
              </button>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <select value={toTz} onChange={(e) => setToTz(e.target.value)} className={selectCls}>
                  {TIME_ZONES.map((tz) => (
                    <option key={tz.value + tz.label} value={tz.value}>{tz.label} ({tz.offset})</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1.5">Now: <strong className="text-gray-600">{liveTo}</strong></p>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              <RefreshCw size={14} /> Reset
            </button>

            {/* Result */}
            {result && result !== "Invalid date" && (
              <div className="mt-6 p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Converted Time</p>
                <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2 tracking-tight">{result}</h2>
                <p className="text-gray-500 text-sm mb-5">
                  in <strong>{getLabel(toTz)}</strong>
                </p>
                <button
                  onClick={copyResult}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors"
                >
                  <Copy size={14} /> {copied ? "Copied!" : "Copy Conversion"}
                </button>
              </div>
            )}
            {result === "Invalid date" && (
              <p className="mt-4 text-red-500 text-sm text-center">Invalid date — please check your input.</p>
            )}
          </div>

          {/* World Clock / Multi-city comparison */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-blue-500" />
              <h2 className="text-base font-semibold text-gray-800">World Clock — Current Times</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COMPARE_ZONES.map((tz) => {
                const info = TIME_ZONES.find((t) => t.value === tz);
                const shortLabel = info?.label?.split(" ")[0] || tz.split("/")[1];
                return (
                  <button
                    key={tz}
                    onClick={() => setToTz(tz)}
                    className={`p-3 rounded-xl border text-left transition-all hover:border-blue-300 ${
                      toTz === tz ? "border-blue-400 bg-blue-50" : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">{shortLabel}</p>
                    <p className="text-sm font-bold text-gray-800">{liveAll[tz] || "..."}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">Click any city to set it as the To zone · Updates every second</p>
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Time Zone Converter — 25+ Cities, DST Auto-Handled
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our time zone converter lets you instantly convert any date and time between 25+ major cities and time zones worldwide — including Karachi, Dubai, Riyadh, London, New York, Toronto, Tokyo, Sydney and more. Daylight Saving Time (DST) is handled automatically based on the exact date selected.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Perfect for Pakistani expats and remote workers coordinating with teams in the Gulf (UAE, Saudi Arabia, Qatar, Kuwait), UK, Canada, and the US. The live world clock shows current times in 8 major cities updating every second.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Common time differences from Karachi (PKT)</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>Karachi → Dubai:</strong> 1 hour behind (PKT is UTC+5, GST is UTC+4)</li>
              <li><strong>Karachi → Riyadh / Doha / Kuwait:</strong> 2 hours behind (UTC+3)</li>
              <li><strong>Karachi → London:</strong> 5 hours behind in winter, 4 in summer (DST)</li>
              <li><strong>Karachi → New York:</strong> 10 hours behind in winter, 9 in summer (DST)</li>
              <li><strong>Karachi → Toronto:</strong> 10 hours behind in winter, 9 in summer (DST)</li>
              <li><strong>Karachi → Los Angeles:</strong> 13 hours behind in winter, 12 in summer (DST)</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "What time is it in Dubai when it is 12pm in Karachi?", a: "When it is 12:00 PM in Karachi (PKT, UTC+5), it is 11:00 AM in Dubai (GST, UTC+4). Dubai is always 1 hour behind Karachi." },
                { q: "What time is it in London when it is 12pm in Karachi?", a: "In winter (GMT, UTC+0), London is 5 hours behind Karachi so 12pm PKT = 7am GMT. In summer (BST, UTC+1), London is 4 hours behind so 12pm PKT = 8am BST. Our tool adjusts automatically." },
                { q: "Does this tool handle Daylight Saving Time automatically?", a: "Yes. The tool uses the browser's native Intl.DateTimeFormat API which automatically applies DST rules based on the time zone and the exact date you select." },
                { q: "What is the time difference between Karachi and Toronto?", a: "Karachi is 10 hours ahead of Toronto in winter (EST, UTC-5) and 9 hours ahead in summer (EDT, UTC-4). Use the quick pair button or set Asia/Karachi → America/Toronto." },
                { q: "Is the world clock updated in real time?", a: "Yes. The world clock section and the live current time shown under both dropdowns update every second using your browser's local clock." },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/currency-converter",    title: "Currency Converter",    desc: "Convert currencies with live real-time exchange rates." },
                { to: "/tools/age-calculator",        title: "Age Calculator",        desc: "Calculate exact age in years, months, days and hours." },
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate %, increase, decrease, discount and tax." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
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