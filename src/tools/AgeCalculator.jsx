// pages/AgeCalculator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw } from "lucide-react";

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

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);

    const daysToNext = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      weeks,
      hours,
      daysToNextBirthday: daysToNext
    });
  };

  const copyResult = () => {
    if (!result) return;

    const text =
      `Age: ${result.years} years, ${result.months} months, ${result.days} days\n` +
      `Total days lived: ${result.totalDays}\n` +
      `Weeks: ${result.weeks}\n` +
      `Hours: ${result.hours}\n` +
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

  return (
    <>
      <Helmet>
        <title>Age Calculator | GeneratorPromptAI</title>

        <meta
          name="description"
          content="Free online age calculator to calculate your exact age in years, months, days, weeks and hours. Fast, accurate and easy to use tool by GeneratorPromptAI."
        />

        <meta name="keywords" content="age calculator, age calculator gap, date of birth calculator"></meta>

        <link
          rel="canonical"
          href="https://generatorpromptai.com/tools/age-calculator"
        />

        <meta property="og:title" content="Age Calculator | GeneratorPromptAI" />
        <meta
          property="og:description"
          content="Calculate your exact age instantly with our free online age calculator."
        />
        <meta
          property="og:url"
          content="https://generatorpromptai.com/tools/age-calculator"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Age Calculator Online" />
        <meta
          name="twitter:description"
          content="Find your exact age in years, months and days instantly."
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Age Calculator",
            url: "https://generatorpromptai.com/tools/age-calculator",
            applicationCategory: "Utility",
            operatingSystem: "All",
            creator: {
              "@type": "Organization",
              name: "GeneratorPromptAI"
            },
            description:
              "Free online age calculator that calculates exact age in years, months, days and hours."
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Age Calculator
          </h1>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Date of Birth
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />

                <button
                  onClick={calculateAge}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg"
                >
                  Calculate Age
                </button>
              </div>

              {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
            </div>

            {result && (
              <div className="space-y-8 text-center">
                <h3 className="text-5xl font-bold text-sky-600">
                  {result.years} Years Old
                </h3>

                <p className="text-lg text-gray-700">
                  {result.months} months, {result.days} days
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">{result.totalDays}</p>
                    <p className="text-sm text-gray-600">Total Days</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">{result.weeks}</p>
                    <p className="text-sm text-gray-600">Weeks</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">{result.hours}</p>
                    <p className="text-sm text-gray-600">Hours</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">
                      {result.daysToNextBirthday}
                    </p>
                    <p className="text-sm text-gray-600">Next Birthday</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg"
                  >
                    <Copy size={18} />
                    {copied ? "Copied!" : "Copy Result"}
                  </button>

                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg"
                  >
                    <RefreshCw size={18} />
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Accurate Age Calculator Online
            </h2>

            <p className="text-gray-700 mb-4">
              Our free online age calculator helps you quickly find your exact age. You can see your age in years, months, weeks, days, and hours.
            </p>

            <p className="text-gray-700">
              Just enter your date of birth. Our tool will instantly show your full age breakdown.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Age Calculator FAQ
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold">
                  How does the age calculator work?
                </h3>
                <p>
                  It compares your birth date with today's date and calculates
                  the difference.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Is the age calculator accurate?</h3>
                <p>
                  Yes. It uses real calendar calculations to determine your
                  precise age.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  Can I calculate age in days and hours?
                </h3>
                <p>
                  Yes, our tool shows total days lived, weeks lived and total
                  hours.
                </p>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
              Related Free Online Tools
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <Link
                to="/tools/date-calculator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-400 transition"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Date Calculator
                </h3>
                <p className="text-gray-600 text-sm">
                  Add or subtract days, months, and years between dates instantly.
                </p>
              </Link>

              <Link
                to="/tools/percentage-calculator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-400 transition"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Percentage Calculator
                </h3>
                <p className="text-gray-600 text-sm">
                  Calculate percentages, percentage increase, decrease and more.
                </p>
              </Link>

              <Link
                to="/tools/birthday-countdown"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-400 transition"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Birthday Countdown
                </h3>
                <p className="text-gray-600 text-sm">
                  Find out exactly how many days remain until your next birthday.
                </p>
              </Link>

              <Link
                to="/tools/time-zone-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-400 transition"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Time Zone Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert time between cities and global time zones instantly.
                </p>
              </Link>

              <Link
                to="/tools/random-number-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-400 transition"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Random Number Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate random numbers quickly for games, statistics, or testing.
                </p>
              </Link>

              <Link
                to="/tools/unit-converter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-400 transition"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Unit Converter
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert length, weight, temperature, and more with our free converter.
                </p>
              </Link>

            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default AgeCalculator;