// pages/AgeCalculator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Calendar, Clock, Star } from "lucide-react";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const calculateAge = () => {
    if (!birthDate) {
      setError("Please select your date of birth");
      setResult(null);
      return;
    }

    const today = new Date();
    const birth = new Date(birthDate);

    if (birth > today) {
      setError("Birth date cannot be in the future");
      setResult(null);
      return;
    }

    setError("");

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += lastDayOfPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const hours = Math.floor((today - birth) / (1000 * 60 * 60));
    const minutes = Math.floor((today - birth) / (1000 * 60));

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    const birthDay = birth.toLocaleDateString("en-US", { weekday: "long" });
    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());

    setResult({ years, months, days, totalDays, weeks, hours, minutes, daysToNextBirthday: daysToNext, birthDay, zodiac });
  };

  const getZodiac = (month, day) => {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries ♈";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus ♉";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini ♊";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer ♋";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo ♌";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo ♍";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio ♏";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius ♐";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn ♑";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius ♒";
    return "Pisces ♓";
  };

  const copyResult = () => {
    if (!result) return;
    const text =
      `Age: ${result.years} years, ${result.months} months, ${result.days} days\n` +
      `Total days lived: ${result.totalDays.toLocaleString()}\n` +
      `Weeks: ${result.weeks.toLocaleString()}\n` +
      `Hours: ${result.hours.toLocaleString()}\n` +
      `Next birthday in: ${result.daysToNextBirthday} days`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setBirthDate("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Age Calculator",
    url: "https://generatorpromptai.com/tools/age-calculator",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://generatorpromptai.com"
    },
    description: "Free online age calculator. Calculate your exact age in years, months, days, weeks, hours and minutes from your date of birth.",
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
        name: "How does the age calculator work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our age calculator compares your date of birth with today's date and calculates the exact difference in years, months, days, weeks, and hours using precise calendar logic."
        }
      },
      {
        "@type": "Question",
        name: "Is the age calculator free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our age calculator is completely free to use with no sign-up required."
        }
      },
      {
        "@type": "Question",
        name: "Can I calculate my age in days and hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our tool shows your total days lived, weeks, hours, and minutes since birth."
        }
      },
      {
        "@type": "Question",
        name: "How many days until my next birthday?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our age calculator automatically shows how many days remain until your next birthday."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Age Calculator - Calculate Your Exact Age in Years, Months & Days</title>
        <meta
          name="description"
          content="Free online age calculator — find your exact age in years, months, days, weeks, and hours. Instantly see days until your next birthday. No sign-up needed."
        />
        <meta
          name="keywords"
          content="age calculator, calculate age, age calculator online, date of birth calculator, how old am I, age in days, age in weeks, birthday calculator, exact age calculator"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/age-calculator" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Age Calculator - Calculate Your Exact Age Online Free" />
        <meta property="og:description" content="Find your exact age in years, months, days, weeks and hours instantly. Free online age calculator with birthday countdown." />
        <meta property="og:url" content="https://generatorpromptai.com/tools/age-calculator" />
        <meta property="og:image" content="https://generatorpromptai.com/og-age-calculator.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Age Calculator - Find Your Exact Age Free" />
        <meta name="twitter:description" content="Calculate your exact age in years, months, days, weeks and hours. Free online tool, no sign-up needed." />
        <meta name="twitter:image" content="https://generatorpromptai.com/og-age-calculator.png" />

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
              <Calendar className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Age Calculator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Find your exact age in years, months, days, weeks, hours — and see how many days until your next birthday.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of Birth
            </label>

            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800"
              />
              <button
                onClick={calculateAge}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl"
              >
                Calculate Age
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {/* Result */}
            {result && (
              <div className="mt-8">

                {/* Main Age Display */}
                <div className="text-center py-8 bg-sky-50 rounded-2xl mb-6">
                  <p className="text-sm font-medium text-sky-500 uppercase tracking-widest mb-1">Your Age</p>
                  <h2 className="text-6xl font-bold text-sky-600 mb-2">
                    {result.years}
                    <span className="text-2xl font-medium text-sky-400 ml-2">years</span>
                  </h2>
                  <p className="text-gray-500 text-lg">
                    {result.months} months &amp; {result.days} days
                  </p>
                  <div className="mt-3 flex justify-center gap-4 text-sm text-gray-400">
                    <span>Born on a <strong className="text-gray-600">{result.birthDay}</strong></span>
                    <span>·</span>
                    <span><strong className="text-gray-600">{result.zodiac}</strong></span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Total Days", value: result.totalDays.toLocaleString(), icon: "📅" },
                    { label: "Total Weeks", value: result.weeks.toLocaleString(), icon: "🗓️" },
                    { label: "Total Hours", value: result.hours.toLocaleString(), icon: "🕐" },
                    { label: "Total Minutes", value: result.minutes.toLocaleString(), icon: "⏱️" },
                    { label: "Next Birthday", value: `${result.daysToNextBirthday} days`, icon: "🎂" },
                    { label: "Zodiac Sign", value: result.zodiac, icon: "⭐" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-lg font-bold text-gray-800">{item.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>

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

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Age Calculator — Instant &amp; Accurate
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free age calculator lets you find your exact age in seconds. Simply enter your date of birth and instantly get your age broken down into years, months, days, weeks, hours, and minutes. No sign-up, no fees — just fast and accurate results.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Whether you need your precise age for official documents, want to know how many days old you are, or are curious how many days remain until your next birthday — our tool covers it all. We also show your day of birth and zodiac sign as a bonus.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How to use the Age Calculator</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
              <li>Select your date of birth using the date picker above.</li>
              <li>Click the <strong>Calculate Age</strong> button.</li>
              <li>Instantly see your full age breakdown in years, months, days, weeks, and hours.</li>
              <li>Copy your result or reset to calculate again.</li>
            </ol>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why use our Age Calculator?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>100% free — no account or sign-up required</li>
              <li>Shows age in years, months, days, weeks, hours, and minutes</li>
              <li>Birthday countdown — see days until your next birthday</li>
              <li>Shows your zodiac sign and day of birth</li>
              <li>Works on all devices — mobile, tablet, desktop</li>
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
                  q: "How does the age calculator work?",
                  a: "Our age calculator compares your date of birth with today's date and calculates the exact difference using precise calendar logic, accounting for leap years and varying month lengths."
                },
                {
                  q: "Is the age calculator free to use?",
                  a: "Yes, completely free. No sign-up, no account, no hidden fees. Just enter your date of birth and get your result instantly."
                },
                {
                  q: "Can I calculate my age in days and hours?",
                  a: "Yes. Our tool shows your total days lived, total weeks, total hours, and total minutes since the day you were born."
                },
                {
                  q: "How many days until my next birthday?",
                  a: "Our age calculator automatically calculates and displays how many days remain until your next birthday every time you calculate your age."
                },
                {
                  q: "Does the age calculator work for any birth date?",
                  a: "Yes, our tool works for any valid date of birth in the past. It cannot accept future dates as a birth date."
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
              Related Free Online Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentages, percentage increase, decrease and more." },
                { to: "/tools/time-zone-converter", title: "Time Zone Converter", desc: "Convert time between cities and global time zones instantly." },
                { to: "/tools/random-number-generator", title: "Random Number Generator", desc: "Generate random numbers for games, statistics, or testing." },
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

export default AgeCalculator;