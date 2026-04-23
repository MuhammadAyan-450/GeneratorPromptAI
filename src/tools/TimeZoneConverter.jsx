// pages/TimeZoneConverter.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Clock, Copy, RefreshCw, ArrowLeftRight, Globe, Home, ChevronDown,
  Hash, Type, Layers, MapPin, Calendar
} from "lucide-react";

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

const formatTimeOnly = (date, tz) =>
  date.toLocaleString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: tz,
  });

const formatDateOnly = (date, tz) =>
  date.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric", timeZone: tz,
  });

const getLabel = (tz) => TIME_ZONES.find((t) => t.value === tz)?.label || tz;
const getOffset = (tz) => TIME_ZONES.find((t) => t.value === tz)?.offset || "";

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
  const [openFaq,   setOpenFaq]     = useState(null);

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

  const copyText = () => {
    if (!result || result === "Invalid date") return;
    const text = `${inputTime} (${getLabel(fromTz)}) → ${result} (${getLabel(toTz)})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setInputTime(new Date().toISOString().slice(0, 16));
    setFromTz("Asia/Karachi"); setToTz("America/New_York");
  };

  const hasResult = result && result !== "Invalid date";
  const inputDate = inputTime ? new Date(inputTime) : null;

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 bg-white text-sm";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Convert Time Between Karachi Dubai London New York Online Free – Time Zone Converter with DST",
    "url": "https://www.generatorpromptai.com/tools/time-zone-converter",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online time zone converter. Convert time between 25+ cities — Karachi, Dubai, London, New York, Toronto, Riyadh and more. DST auto-handled, live world clock. No signup required.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Time Zone Converter", "item": "https://www.generatorpromptai.com/tools/time-zone-converter" }
    ]
  };

  const schemaHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Time Between Time Zones Online Free",
    "description": "Steps to convert time between different cities and time zones online.",
    "step": [
      { "@type": "HowToStep", "name": "Select Date & Time", "text": "Pick the date and time you want to convert using the date/time picker." },
      { "@type": "HowToStep", "name": "Choose Zones", "text": "Select the From and To time zones from the dropdown menus, or use a Quick Pair button." },
      { "@type": "HowToStep", "name": "View Result", "text": "The converted time appears instantly in the dark output block with full stats. Click Copy to save." }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to convert time between Karachi and Dubai online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select 'Karachi → Dubai' from the Quick Pairs or manually set From to Asia/Karachi and To to Asia/Dubai. Pick your date and time — the converted Dubai time appears instantly. Dubai is always 1 hour behind Karachi."
        }
      },
      {
        "@type": "Question",
        "name": "What time is it in London when it is 12pm in Karachi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In winter (GMT, UTC+0), London is 5 hours behind Karachi so 12pm PKT = 7am GMT. In summer (BST, UTC+1), London is 4 hours behind so 12pm PKT = 8am BST. Our tool adjusts automatically for Daylight Saving Time."
        }
      },
      {
        "@type": "Question",
        "name": "Does this time zone converter handle Daylight Saving Time automatically?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The tool uses the browser's native Intl.DateTimeFormat API which automatically applies DST rules based on the specific time zone and the exact date you select."
        }
      },
      {
        "@type": "Question",
        "name": "How to convert time between Karachi and New York for meeting scheduling?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Click 'Karachi → New York' Quick Pair, set your meeting time in the date/time picker, and see the exact New York time instantly. Karachi is 10 hours ahead in winter (EST) and 9 hours ahead in summer (EDT)."
        }
      },
      {
        "@type": "Question",
        "name": "Is the world clock showing real-time current times?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The world clock section shows current times in 8 major cities (Karachi, Dubai, Riyadh, London, New York, Los Angeles, Tokyo, Sydney) updating every second using your browser's local clock."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Convert Time Between Karachi Dubai London New York Online Free – Time Zone Converter with DST</title>

        <meta
          name="description"
          content="Free online time zone converter — convert time between Karachi, Dubai, London, New York, Toronto, Riyadh and 25+ cities. DST auto-handled, live world clock. No signup required."
        />

        <meta
          name="keywords"
          content="how to convert time between karachi and dubai online free, convert time between karachi and new york for meeting, time zone converter with daylight saving time auto handled, what time is it in london when it is 12pm in karachi, free online world clock current time multiple cities, convert time between pakistan and canada toronto online, time difference between karachi and riyadh doha kuwait, schedule meeting across time zones karachi dubai london free tool, best free time zone converter 25 cities no signup 2026, convert time between gulf countries and pakistan india online"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/time-zone-converter" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Convert Time Between Cities Free – Karachi, Dubai, London, New York | DST Auto" />
        <meta property="og:description" content="Convert time between 25+ cities instantly. Karachi to Dubai, London, New York, Toronto, Riyadh. DST auto-handled. Live world clock." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/time-zone-converter" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Time Zone Converter – Karachi, Dubai, London, New York & 25+ Cities" />
        <meta name="twitter:description" content="Convert time between any cities. 25+ time zones, DST auto-handled, live world clock. Free online tool." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaHowTo)}</script>
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
              <li><span className="text-gray-900 font-semibold">Time Zone Converter</span></li>
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
              Convert Time Between Karachi Dubai London New York Online Free –{" "}
              <span className="text-sky-600">Time Zone Converter with DST</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Convert time between 25+ cities worldwide. DST auto-handled, live world clock, quick pair shortcuts.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Quick Pairs */}
            <div className="mb-6">
              <label className={labelCls}>Quick Pairs</label>
              <div className="flex flex-wrap gap-2">
                {QUICK_PAIRS.map((pair) => (
                  <button
                    key={pair.label}
                    onClick={() => applyPair(pair)}
                    className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                      fromTz === pair.from && toTz === pair.to
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                    }`}
                  >
                    {pair.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date/Time picker */}
            <div className="mb-6">
              <label className={labelCls}>Date &amp; Time to Convert</label>
              <input
                type="datetime-local"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* From / Swap / To */}
            <div className="flex items-end gap-3 mb-6">
              <div className="flex-1">
                <label className={labelCls}>From</label>
                <select value={fromTz} onChange={(e) => setFromTz(e.target.value)} className={inputCls}>
                  {TIME_ZONES.map((tz) => (
                    <option key={tz.value + tz.label} value={tz.value}>{tz.label} ({tz.offset})</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1.5">Now: <strong className="text-gray-600">{liveFrom}</strong></p>
              </div>

              <button
                onClick={swap}
                className="flex-shrink-0 p-3 mb-[22px] bg-gray-100 hover:bg-sky-100 hover:text-sky-600 rounded-xl transition-colors"
                title="Swap zones" aria-label="Swap time zones"
              >
                <ArrowLeftRight size={20} />
              </button>

              <div className="flex-1">
                <label className={labelCls}>To</label>
                <select value={toTz} onChange={(e) => setToTz(e.target.value)} className={inputCls}>
                  {TIME_ZONES.map((tz) => (
                    <option key={tz.value + tz.label} value={tz.value}>{tz.label} ({tz.offset})</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1.5">Now: <strong className="text-gray-600">{liveTo}</strong></p>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mb-2">
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
                    <div className="flex justify-center text-sky-500 mb-1"><MapPin size={20} /></div>
                    <p className="text-sm font-bold text-gray-800">{getLabel(fromTz).split(" ")[0]}</p>
                    <p className="text-xs text-gray-500 mt-0.5">From Zone</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><MapPin size={20} /></div>
                    <p className="text-sm font-bold text-sky-600">{getLabel(toTz).split(" ")[0]}</p>
                    <p className="text-xs text-gray-500 mt-0.5">To Zone</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Calendar size={20} /></div>
                    <p className="text-sm font-bold text-gray-800">{inputDate ? formatDateOnly(inputDate, toTz) : "—"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Date</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Globe size={20} /></div>
                    <p className="text-sm font-bold text-gray-800">{getOffset(toTz)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">UTC Offset</p>
                  </div>
                </div>

                {/* Dark Output Block */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Converted Time</p>
                  <pre className="text-3xl md:text-4xl font-bold text-sky-400 font-mono tracking-tight mb-3">{result}</pre>
                  <p className="text-sm text-gray-500">
                    in <strong className="text-gray-300">{getLabel(toTz)}</strong>
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 font-mono">
                    {inputTime} ({getLabel(fromTz)}) → {result} ({getLabel(toTz)})
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={copyText}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Copy size={15} />
                    {copied ? "Copied!" : "Copy Conversion"}
                  </button>
                </div>
              </div>
            )}

            {/* Invalid Date */}
            {result === "Invalid date" && (
              <div className="mt-8 text-center py-8 text-red-500 border-2 border-dashed border-red-200 rounded-xl">
                <p className="font-medium">Invalid date — please check your input.</p>
              </div>
            )}

            {/* Empty State */}
            {!result && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <Clock size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Select a date/time and zones to <strong className="text-gray-500">see the converted time</strong></p>
              </div>
            )}
          </div>

          {/* ── World Clock ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-sky-500" />
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
                    className={`p-3 rounded-xl border text-left transition-all hover:border-sky-300 ${
                      toTz === tz ? "border-sky-400 bg-sky-50" : "border-gray-100 bg-gray-50"
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

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Time Zone Converter — 25+ Cities, DST Auto-Handled
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our time zone converter lets you instantly convert any date and time between <strong>25+ major cities and time zones</strong> worldwide — including Karachi, Dubai, Riyadh, London, New York, Toronto, Tokyo, Sydney and more. Daylight Saving Time (DST) is handled automatically based on the exact date selected, so you never have to manually adjust for summer/winter time differences.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Perfect for Pakistani expats and remote workers coordinating with teams in the Gulf (UAE, Saudi Arabia, Qatar, Kuwait), UK, Canada, and the US. The <strong>Quick Pair buttons</strong> let you switch between popular routes in one click, and the <strong>live world clock</strong> shows current times in 8 major cities updating every second.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Convert Time Between Karachi Dubai London New York Online Free
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Click a <strong>Quick Pair</strong> button (e.g. "Karachi → New York") or manually select From and To zones.</li>
              <li>Pick the <strong>date and time</strong> you want to convert using the date/time picker.</li>
              <li>The <strong>converted time</strong> appears instantly in the output block with zone stats.</li>
              <li>Check the <strong>world clock</strong> below to see current times in 8 major cities.</li>
              <li><strong>Copy the conversion</strong> to share with colleagues or save for reference.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Time Zone Converter with Live World Clock – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Quick Pair Shortcuts", desc: "One-click buttons for the most popular routes — Karachi to Dubai, London, New York, Toronto, Riyadh and more. No need to scroll through 30+ time zones manually." },
                { title: "Automatic DST Handling", desc: "Uses the browser's native Intl.DateTimeFormat API which automatically applies Daylight Saving Time rules based on the specific zone and exact date. No manual offset adjustment needed." },
                { title: "Live World Clock (8 Cities)", desc: "Real-time current times in Karachi, Dubai, Riyadh, London, New York, Los Angeles, Tokyo and Sydney — updating every second. Click any city to set it as your target zone." },
                { title: "Full Conversion Context", desc: "The stats grid shows the from/to zones, converted date, and UTC offset at a glance. The dark output block displays the full conversion string for easy copying and sharing." }
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
              Time Zone Converter – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to convert time between Karachi and Dubai online free?",
                  a: "Select 'Karachi → Dubai' from the Quick Pairs or manually set From to Asia/Karachi and To to Asia/Dubai. Pick your date and time — the converted Dubai time appears instantly. Dubai is always 1 hour behind Karachi."
                },
                {
                  q: "What time is it in London when it is 12pm in Karachi?",
                  a: "In winter (GMT, UTC+0), London is 5 hours behind Karachi so 12pm PKT = 7am GMT. In summer (BST, UTC+1), London is 4 hours behind so 12pm PKT = 8am BST. Our tool adjusts automatically for Daylight Saving Time."
                },
                {
                  q: "Does this time zone converter handle Daylight Saving Time automatically?",
                  a: "Yes. The tool uses the browser's native Intl.DateTimeFormat API which automatically applies DST rules based on the specific time zone and the exact date you select. No manual adjustment is needed."
                },
                {
                  q: "How to convert time between Karachi and New York for meeting scheduling?",
                  a: "Click 'Karachi → New York' Quick Pair, set your meeting time in the date/time picker, and see the exact New York time instantly. Karachi is 10 hours ahead in winter (EST) and 9 hours ahead in summer (EDT). Copy the result to share with participants."
                },
                {
                  q: "Is the world clock showing real-time current times?",
                  a: "Yes. The world clock section shows current times in 8 major cities (Karachi, Dubai, Riyadh, London, New York, Los Angeles, Tokyo, Sydney) updating every second using your browser's local clock."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Calculator &amp; Utility Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/currency-converter", title: "Currency Converter", desc: "Convert currencies with live real-time exchange rates." },
                { to: "/tools/age-calculator", title: "Age Calculator", desc: "Calculate exact age in years, months, days and hours." },
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentage, increase, decrease, discount and tax." }
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

export default TimeZoneConverter;