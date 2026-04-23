import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Calendar, Home, ChevronDown } from "lucide-react";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chronological Age Calculator by Date of Birth",
    "url": "https://www.generatorpromptai.com/tools/age-calculator",
    "applicationCategory": "UtilityApplication", // Fixed: was AIApplication
    "operatingSystem": "All",
    "description": "Calculate exact age in years, months, days, hours, and minutes from date of birth. Find how many days old you are and days until next birthday.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Age Calculator", "item": "https://www.generatorpromptai.com/tools/age-calculator" }
    ]
  };

  // FAQ Schema based on low-comp question keywords
  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to calculate my exact age in years, months, and days?",
        "acceptedAnswer": { "@type": "Answer", "text": "Enter your date of birth in the age calculator above and click 'Calculate Age'. The tool uses precise calendar logic to compute your exact age in years, months, and days, accounting for leap years and different month lengths." }
      },
      {
        "@type": "Question",
        "name": "How many days old am I?",
        "acceptedAnswer": { "@type": "Answer", "text": "To find out how many days old you are, enter your date of birth into our calculator. It will instantly show your total days lived, along with total weeks, hours, and minutes." }
      },
      {
        "@type": "Question",
        "name": "How to find days until my next birthday?",
        "acceptedAnswer": { "@type": "Answer", "text": "Simply enter your date of birth and calculate your age. Our tool automatically calculates and displays the exact number of days remaining until your next birthday." }
      },
      {
        "@type": "Question",
        "name": "Does this age calculator account for leap years?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, our calculator uses JavaScript's native Date object which correctly handles leap years, ensuring your age in days and hours is 100% accurate." }
      },
      {
        "@type": "Question",
        "name": "Is my date of birth saved or stored?",
        "acceptedAnswer": { "@type": "Answer", "text": "No. The calculation happens entirely in your browser. Your date of birth is never sent to any server, stored, or tracked. Your privacy is fully protected." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Title targeting: "calculate exact age", "how many days old am i" */}
        <title>Calculate Exact Age in Years, Months, Days – How Many Days Old Am I?</title>
        
        {/* Description targeting long-tails */}
        <meta
          name="description"
          content="Calculate your exact age in years, months, days, hours, and minutes. Find out how many days old you are and days until your next birthday. Free online chronological age calculator by date of birth."
        />
        
        {/* Low competition long-tail keywords */}
        <meta
          name="keywords"
          content="calculate exact age in years months days, how many days old am i calculator, chronological age calculator by date of birth, age in days hours minutes calculator, days until next birthday calculator, calculate my age from date of birth online, exact age calculator free, age calculator with zodiac sign"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/age-calculator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (No emojis for clean snippets) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Calculate Exact Age in Years, Months, Days – Free Online Tool" />
        <meta property="og:description" content="Find your exact age breakdown and total days lived. Includes next birthday countdown and zodiac sign." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/age-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Exact Age Calculator – Years, Months, Days, Hours" />
        <meta name="twitter:description" content="Calculate your precise age and days until your next birthday. 100% free online tool." />

        {/* Schemas */}
        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb Only (Back to Home Removed) ── */}
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
              <li><span className="text-gray-900 font-semibold">Age Calculator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Calendar className="text-sky-600" size={28} />
            </div>
            {/* H1 targeting exact match long-tails */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Calculate Exact Age in{" "}
              <span className="text-sky-600">Years, Months & Days</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Find out <strong>how many days old you are</strong>, your age in hours and minutes, and the exact <strong>days until your next birthday</strong>. Free chronological age calculator.
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
                  <p className="text-sm font-medium text-sky-500 uppercase tracking-widest mb-1">Your Exact Age</p>
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
                    { label: "Total Days Lived", value: result.totalDays.toLocaleString(), icon: "📅" },
                    { label: "Total Weeks", value: result.weeks.toLocaleString(), icon: "🗓️" },
                    { label: "Total Hours", value: result.hours.toLocaleString(), icon: "🕐" },
                    { label: "Total Minutes", value: result.minutes.toLocaleString(), icon: "⏱️" },
                    { label: "Next Birthday In", value: `${result.daysToNextBirthday} days`, icon: "🎂" },
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

          {/* ── SEO Content 1 ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "chronological age calculator by date of birth" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chronological Age Calculator by Date of Birth
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our free online age calculator lets you find your <strong>exact age in years, months, and days</strong> in seconds. Whether you need your precise chronological age for official documents, legal forms, or simply want to know <strong>how many days old you are</strong>, this tool gives you an accurate breakdown instantly.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Unlike basic calculators, our tool goes further by calculating your age in weeks, hours, and minutes. It also features a built-in <strong>days until next birthday calculator</strong> and reveals your birth day (e.g., "Monday") and zodiac sign.
            </p>
          </section>

          {/* ── How to Use Section ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "how to calculate my exact age online" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Calculate My Exact Age Online
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Select your <strong>date of birth</strong> using the date picker above.</li>
              <li>Click the <strong>"Calculate Age"</strong> button.</li>
              <li>View your full age breakdown: <strong>years, months, days, weeks, hours, and minutes</strong>.</li>
              <li>See exactly <strong>how many days until your next birthday</strong> and your zodiac sign.</li>
              <li>Click <strong>"Copy Result"</strong> to save or share your exact age.</li>
            </ol>
          </section>

          {/* ── Features Section ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "age in days hours minutes calculator" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Age in Days, Hours, Minutes & Birthday Countdown
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Exact Age Breakdown", desc: "Get your precise age down to the months and days, accurately handling leap years and varying month lengths." },
                { title: "Total Days Lived", desc: "Find out exactly how many days, weeks, hours, and minutes you have lived since your birth date." },
                { title: "Birthday Countdown", desc: "Automatically calculates the days remaining until your next birthday so you never miss it." },
                { title: "100% Private & Free", desc: "Your date of birth is never sent to a server. The calculation happens entirely in your browser, ensuring total privacy." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ Section (Accordion) ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Age Calculator – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to calculate my exact age in years, months, and days?",
                  a: "Enter your date of birth in the age calculator above and click 'Calculate Age'. The tool uses precise calendar logic to compute your exact age in years, months, and days, properly accounting for leap years and different month lengths."
                },
                {
                  q: "How many days old am I?",
                  a: "To find out how many days old you are, simply enter your date of birth into our calculator. It will instantly show your total days lived, along with your total weeks, hours, and minutes since birth."
                },
                {
                  q: "How to find days until my next birthday?",
                  a: "Just enter your date of birth and calculate your age. Our tool automatically calculates and displays the exact number of days remaining until your next birthday based on today's date."
                },
                {
                  q: "Does this age calculator account for leap years?",
                  a: "Yes, our calculator uses JavaScript's native Date object which correctly handles leap years (e.g., years like 2000, 2004, 2024), ensuring your age in days and hours is 100% accurate."
                },
                {
                  q: "Is my date of birth saved or stored anywhere?",
                  a: "No. The calculation happens entirely in your web browser. Your date of birth is never sent to any external server, stored in a database, or tracked. Your privacy is fully protected."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">
                      {item.q}
                    </h3>
                    <ChevronDown
                      size={22}
                      className={`text-sky-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related Tools (Fixed broken link) ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Online Calculators
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/percentage-calculator", title: "Percentage Calculator", desc: "Calculate percentage increase, decrease, and difference instantly." },
                { to: "/tools/time-zone-converter", title: "Time Zone Converter", desc: "Convert time between cities and global time zones accurately." },
                { to: "/tools/password-generator", title: "Password Generator", desc: "Generate strong, secure random passwords with custom settings." }, // Fixed link
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