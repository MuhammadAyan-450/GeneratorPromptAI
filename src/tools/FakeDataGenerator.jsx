// pages/FakeDataGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Table } from "lucide-react";

const FakeDataGenerator = () => {
  const [numRecords, setNumRecords] = useState(10);
  const [fields, setFields] = useState({
    name: true,
    email: true,
    phone: true,
    address: true,
    age: true,
    bio: false,
  });
  const [data, setData] = useState([]);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const firstNames = [
    "Ayan", "Sara", "Ali", "Fatima", "Ahmed", "Zara", "Hamza", "Aisha", "Omar",
    "Maryam", "Bilal", "Hina", "Usman", "Noor", "Rehan", "Zainab", "Ibrahim", "Laiba"
  ];
  const lastNames = [
    "Khan", "Ahmed", "Malik", "Siddiqui", "Hussain", "Raza", "Shah", "Iqbal",
    "Baig", "Chaudhry", "Ansari", "Mirza", "Butt", "Qureshi"
  ];
  const cities = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan",
    "Hyderabad", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Bahawalpur"
  ];
  const streets = [
    "Main Boulevard", "Shahrah-e-Faisal", "Gulshan-e-Iqbal", "Clifton",
    "Defence Housing Authority", "Johar Town", "Bahria Town", "Model Town",
    "Gulberg", "PECHS", "North Nazimabad", "Saddar"
  ];

  const generateRandomName = () =>
    `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

  const generateEmail = (name) =>
    name.toLowerCase().replace(" ", ".") + Math.floor(Math.random() * 1000) + "@example.com";

  const generatePhone = () =>
    `+92${Math.floor(300 + Math.random() * 400)}-${Math.floor(1000000 + Math.random() * 9000000)}`;

  const generateAddress = () =>
    `${Math.floor(1 + Math.random() * 999)} ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}, Pakistan`;

  const generateAge = () => Math.floor(18 + Math.random() * 55);

  const generateBio = () => {
    const bios = [
      "Passionate web developer • React & Next.js enthusiast",
      "Coffee • Code • Chai • Repeat",
      "Building modern apps from Karachi",
      "Always learning new tech stacks",
      "Frontend developer | UI/UX lover",
      "Open source contributor • Night owl coder",
      "Exploring AI tools and prompt engineering",
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  };

  const generateData = () => {
    const newData = [];
    for (let i = 0; i < numRecords; i++) {
      const name = generateRandomName();
      const entry = {};
      if (fields.name) entry.name = name;
      if (fields.email) entry.email = generateEmail(name.split(" ")[0]);
      if (fields.phone) entry.phone = generatePhone();
      if (fields.address) entry.address = generateAddress();
      if (fields.age) entry.age = generateAge();
      if (fields.bio) entry.bio = generateBio();
      newData.push(entry);
    }
    setData(newData);
  };

  const copyAsCsv = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csv = headers + "\n" + rows;
    navigator.clipboard.writeText(csv);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 1800);
  };

  const copyAsJson = () => {
    if (data.length === 0) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1800);
  };

  const reset = () => {
    setData([]);
    setCopiedCsv(false);
    setCopiedJson(false);
  };

  return (
    <>
      <Helmet>
        <title>Fake Data Generator – Dummy Names, Emails, Addresses | GeneratorPromptAI</title>
        <meta
          name="description"
          content="Generate realistic fake data for testing: Pakistani names, emails, phone numbers (+92), addresses (Karachi, Lahore, etc.), ages & bios. CSV & JSON export. 100% browser-based, free, no signup."
        />
        <meta
          name="keywords"
          content="fake data generator, dummy data, test data generator, fake data generator, dummy emails, random pakistani addresses, mock data csv json, developer tools 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/fake-data-generator" />

        <meta property="og:title" content="Fake Data Generator – Realistic Dummy Data Generator Online" />
        <meta
          property="og:description"
          content="Create mock names, emails, +92 phones, Pakistani addresses & more for testing APIs, databases, forms. Free & private."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/tools/fake-data-generator" />
        <meta property="og:site_name" content="GeneratorPromptAI" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Fake Data Generator – CSV & JSON" />
        <meta name="twitter:description" content="Generate realistic test data with Pakistani names & addresses." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Fake Data Generator",
            url: "https://generatorpromptai.com/tools/fake-data-generator",
            description: "Free tool to generate realistic dummy data (names, emails, phones, addresses) for development & testing.",
            applicationCategory: "DeveloperApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Fake Data Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Realistic Fake data Generator for developers • Pakistani names & addresses • CSV & JSON
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Number of Records
                </label>
                <input
                  type="number"
                  value={numRecords}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNumRecords(Math.max(1, Math.min(200, isNaN(val) ? 10 : val)));
                  }}
                  min="1"
                  max="200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg"
                />
              </div>

              <div className="col-span-1 md:col-span-3 flex flex-wrap gap-x-8 gap-y-4 items-end">
                {Object.keys(fields).map((field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fields[field]}
                      onChange={(e) => setFields({ ...fields, [field]: e.target.checked })}
                      className="h-5 w-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                    />
                    <span className="text-gray-700 capitalize select-none">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={generateData}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Table size={20} />
                Generate Fake Data
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-8 py-3.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
              >
                <RefreshCw size={18} />
                Reset
              </button>
            </div>

            {data.length > 0 ? (
              <div className="overflow-x-auto bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Generated Data ({data.length} records)
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={copyAsCsv}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                      <Copy size={18} />
                      {copiedCsv ? "CSV Copied!" : "Copy CSV"}
                    </button>
                    <button
                      onClick={copyAsJson}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                      <Copy size={18} />
                      {copiedJson ? "JSON Copied!" : "Copy JSON"}
                    </button>
                  </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 text-lg">
                Click "Generate Fake Data" to create realistic dummy records
              </div>
            )}
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free Fake Data Generator for Developers & Testers
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Need dummy data fast? Our tool makes it easy. It includes Pakistani names, phone numbers, and addresses. You also get emails, ages, and short bios.

                It's great for testing forms, APIs, databases, and more. Just click to export as CSV or JSON. Your data stays private and secure.              </p>
              <p>
                Our tool is built in Karachi for developers everywhere. It's easy to use and keeps your data safe.

              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use This Fake Data Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Choose how many records you need (1–200).</li>
                <li>Select which fields to include (name, email, phone, address…).</li>
                <li>Click <strong>Generate Fake Data</strong>.</li>
                <li>View the generated table instantly.</li>
                <li>Copy as CSV or JSON format for your project.</li>
                <li>Use <strong>Reset</strong> to clear everything and start fresh.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Developer Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/json-formatter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  JSON Formatter & Validator
                </h3>
                <p className="text-gray-600 text-sm">
                  Beautify, minify, validate and repair JSON instantly.
                </p>
              </Link>

              <Link
                to="/tools/lorem-ipsum-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Lorem Ipsum Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate placeholder text in multiple languages & lengths.
                </p>
              </Link>

              <Link
                to="/tools/random-number-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Random Number Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Create random numbers, ranges, dice & lottery picks.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default FakeDataGenerator;