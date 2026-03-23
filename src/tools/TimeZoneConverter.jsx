// pages/TimeZoneConverter.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Copy, RefreshCw, CheckCircle2 } from "lucide-react";

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
    const formatter = new Intl.DateTimeFormat("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: fromTz,
    });
    setCurrentFrom(formatter.format(now));

    const toFormatter = new Intl.DateTimeFormat("en-PK", {
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

      const converted = inputDate.toLocaleString("en-PK", {
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
    const text = `${inputTime} (${fromTz}) → ${result} (${toTz})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const swapTimeZones = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  return (
    <>
      <Helmet>
        <title>Time Zone Converter – Convert Time Between Cities Worldwide</title>
        <meta
          name="description"
          content="Convert time between any cities/time zones instantly – Karachi PKT, New York EST, London GMT, Dubai GST, Tokyo JST & more. Handles DST automatically. Live current times shown. Free, no signup, 100% browser-based – built in Karachi."
        />
        <meta
          name="keywords"
          content="time zone converter online, convert time between cities, world time converter, karachi to new york time, pakistan time converter 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/time-zone-converter" />

        <meta property="og:title" content="Time Zone Converter – Free Online Worldwide 2026" />
        <meta property="og:description" content="Instant time conversion between cities – live current times & DST support." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Time Zone Converter" />
        <meta name="twitter:description" content="Convert time across zones instantly – Karachi, New York, London & more." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Time Zone Converter",
            url: "https://generatorpromptai.com/tools/time-zone-converter",
            description: "Free online tool to convert time between cities and time zones worldwide.",
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
            Time Zone Converter
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Convert time between cities • Live current times • DST aware
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              <div className="grid md:grid-cols-3 gap-6 items-end">
                {/* Input Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date & Time to Convert
                  </label>
                  <input
                    type="datetime-local"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* From Time Zone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    From Time Zone
                  </label>
                  <select
                    value={fromTz}
                    onChange={(e) => setFromTz(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {timeZones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label} ({tz.offset})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Current: <strong>{currentFrom || "Loading..."}</strong>
                  </p>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center md:mt-6">
                  <button
                    onClick={swapTimeZones}
                    className="p-4 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-sm"
                    title="Swap time zones"
                    aria-label="Swap from and to time zones"
                  >
                    <RefreshCw size={28} className="transform rotate-90" />
                  </button>
                </div>

                {/* To Time Zone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    To Time Zone
                  </label>
                  <select
                    value={toTz}
                    onChange={(e) => setToTz(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {timeZones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label} ({tz.offset})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Current: <strong>{currentTo || "Loading..."}</strong>
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="mt-12 text-center">
                {result ? (
                  <div className="space-y-5">
                    <div className="text-5xl md:text-6xl font-bold text-sky-600 tracking-tight">
                      {result}
                    </div>
                    <p className="text-xl text-gray-700">
                      in {toTz.split("/")[1].replace("_", " ")}
                    </p>

                    <button
                      onClick={copyResult}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium shadow-sm"
                    >
                      <Copy size={18} />
                      {copied ? "Copied!" : "Copy Conversion"}
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-500 py-8">
                    Select date/time and zones to see conversion
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Time Zone Converter – Worldwide City Time Conversion
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Convert any date and time between cities or time zones instantly — from Karachi PKT to New York EST, London GMT, Dubai GST, Tokyo JST, Sydney AEDT, and more. Automatically handles daylight saving time (DST). See live current time in both zones, updated every minute. No signup, no ads, 100% browser-based — private & secure.
              </p>
              <p>
                Built in Karachi – perfect for remote workers, travelers, international teams, freelancers, students, and anyone coordinating across time zones. Fast, accurate, and completely free.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Time Zone Converter
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Pick the date and time you want to convert using the datetime picker (defaults to now).</li>
                <li>Select the "From" time zone (e.g., Asia/Karachi for Pakistan time).</li>
                <li>Select the "To" time zone (e.g., America/New_York for US East Coast).</li>
                <li>Click the swap button (↔) to reverse zones instantly.</li>
                <li>Converted time appears immediately below with large, readable display.</li>
                <li>Click <strong>Copy Conversion</strong> to copy the full result (original + converted time).</li>
                <li>Current local time in both zones updates automatically every minute.</li>
                <li>Tip: Use UTC as neutral reference when converting between multiple unfamiliar zones.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/currency-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Currency Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert currencies with live exchange rates.
                </p>
              </Link>

              <Link
                to="/tools/date-calculator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Date Calculator
                </h3>
                <p className="text-gray-600 text-sm">
                  Add/subtract days, months, years from any date.
                </p>
              </Link>

              <Link
                to="/tools/age-calculator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Age Calculator
                </h3>
                <p className="text-gray-600 text-sm">
                  Calculate exact age in years, months, days & more.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TimeZoneConverter;