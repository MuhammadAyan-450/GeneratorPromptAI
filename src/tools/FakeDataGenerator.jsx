import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, RefreshCw, Table, Download, Code, Database, Home, ChevronDown, Users, ShieldCheck, Zap, Globe } from "lucide-react";

// ─── Data pools ──────────────────────────────────────────────────────────────
const DATA = {
  pk: {
    firstNames: ["Ayan", "Sara", "Ali", "Fatima", "Ahmed", "Zara", "Hamza", "Aisha", "Omar", "Maryam", "Bilal", "Hina", "Usman", "Noor", "Rehan", "Zainab", "Ibrahim", "Laiba", "Raza", "Amna", "Hassan", "Sana", "Tariq", "Nimra", "Faisal", "Sadia", "Waqar", "Hira", "Kamran", "Iqra"],
    lastNames: ["Khan", "Ahmed", "Malik", "Siddiqui", "Hussain", "Raza", "Shah", "Iqbal", "Baig", "Chaudhry", "Ansari", "Mirza", "Butt", "Qureshi", "Cheema", "Rajput", "Niazi", "Abbasi", "Javed", "Nawaz"],
    cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Hyderabad", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Bahawalpur", "Sukkur", "Larkana", "Mardan"],
    streets: ["Main Boulevard", "Shahrah-e-Faisal", "Gulshan-e-Iqbal", "Clifton", "DHA Phase 2", "Johar Town", "Bahria Town", "Model Town", "Gulberg", "PECHS", "North Nazimabad", "Saddar", "Blue Area", "F-7 Markaz", "G-11"],
    companies: ["TechVentures Pvt Ltd", "NextGen Solutions", "AlphaSoft", "Packages Ltd", "Habib Bank", "MCB Bank", "Arif Habib Corp", "Systems Ltd", "NetSol Technologies", "TPL Corp", "Daraz", "Foodpanda Pakistan"],
    jobs: ["Software Engineer", "Frontend Developer", "Data Analyst", "Product Manager", "UI/UX Designer", "DevOps Engineer", "QA Engineer", "Business Analyst", "Full Stack Developer", "Project Manager", "CTO", "Backend Developer"],
    domains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "proton.me"],
    phonePrefix: "+92",
    country: "Pakistan",
    zipRange: [10000, 99999],
  },
  intl: {
    firstNames: ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "Benjamin", "Isabella", "Lucas", "Mia", "Mason", "Charlotte", "Ethan", "Amelia", "Logan", "Harper", "Jack", "Evelyn"],
    lastNames: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee"],
    cities: ["New York", "London", "Toronto", "Sydney", "Dubai", "Berlin", "Paris", "Tokyo", "Singapore", "Amsterdam", "Chicago", "Los Angeles", "Manchester", "Melbourne", "Vancouver"],
    streets: ["Oak Street", "Maple Avenue", "Cedar Lane", "Park Drive", "Elm Street", "Main Street", "Broadway", "5th Avenue", "Sunset Boulevard", "Oxford Street", "Kingsway", "Victoria Road"],
    companies: ["Acme Corp", "TechFlow Inc", "NovaSoft", "Bright Solutions", "Apex Systems", "Vertex Labs", "Quantum Inc", "DataBridge", "CloudForge", "Pixel Works", "NextWave", "CodeBase"],
    jobs: ["Software Engineer", "Marketing Manager", "Sales Executive", "Product Designer", "Data Scientist", "DevOps Engineer", "Financial Analyst", "HR Manager", "Content Writer", "Operations Lead", "CTO", "Consultant"],
    domains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "proton.me", "icloud.com"],
    phonePrefix: "+1",
    country: "United States",
    zipRange: [10000, 99999],
  },
};

const BIOS = [
  "Passionate web developer • React & Next.js enthusiast",
  "Coffee lover • Code • Repeat",
  "Building modern apps one commit at a time",
  "Always learning new tech stacks",
  "Frontend developer | UI/UX lover",
  "Open source contributor • Night owl coder",
  "Exploring AI tools and prompt engineering",
  "Clean code advocate • Testing enthusiast",
  "Full stack dev • Dog lover",
  "Remote worker • Digital nomad",
];

const FIELD_CONFIG = [
  { key: "name", label: "Full Name", default: true },
  { key: "username", label: "Username", default: true },
  { key: "email", label: "Email", default: true },
  { key: "phone", label: "Phone", default: true },
  { key: "address", label: "Address", default: true },
  { key: "city", label: "City", default: false },
  { key: "zipCode", label: "ZIP Code", default: false },
  { key: "country", label: "Country", default: false },
  { key: "age", label: "Age", default: true },
  { key: "company", label: "Company", default: false },
  { key: "jobTitle", label: "Job Title", default: false },
  { key: "website", label: "Website URL", default: false },
  { key: "password", label: "Password", default: false },
  { key: "bio", label: "Bio", default: false },
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(min + Math.random() * (max - min));

function generateRecord(fields, locale) {
  const pool = DATA[locale] || DATA.pk;
  const first = rand(pool.firstNames);
  const last = rand(pool.lastNames);
  const name = `${first} ${last}`;
  const city = rand(pool.cities);
  const entry = {};

  if (fields.name) entry.name = name;
  if (fields.username) entry.username = `${first.toLowerCase()}${last.toLowerCase()}${randInt(10, 999)}`;
  if (fields.email) entry.email = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1, 999)}@${rand(pool.domains)}`;
  if (fields.phone) entry.phone = `${pool.phonePrefix}${randInt(300, 399)}-${randInt(1000000, 9999999)}`;
  if (fields.address) entry.address = `${randInt(1, 999)} ${rand(pool.streets)}, ${city}`;
  if (fields.city) entry.city = city;
  if (fields.zipCode) entry.zipCode = String(randInt(...pool.zipRange));
  if (fields.country) entry.country = pool.country;
  if (fields.age) entry.age = randInt(18, 65);
  if (fields.company) entry.company = rand(pool.companies);
  if (fields.jobTitle) entry.jobTitle = rand(pool.jobs);
  if (fields.website) entry.website = `https://www.${first.toLowerCase()}${last.toLowerCase()}.com`;
  if (fields.password) entry.password = `${rand(["Pass", "Key", "Secure", "Safe", "My"])}${randInt(1000, 9999)}${rand(["!", "@", "#", "$"])}`;
  if (fields.bio) entry.bio = rand(BIOS);

  return entry;
}

const FakeDataGenerator = () => {
  const defaultFields = Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, f.default]));

  const [numRecords, setNumRecords] = useState(10);
  const [fields, setFields] = useState(defaultFields);
  const [locale, setLocale] = useState("pk");
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedRow, setCopiedRow] = useState(-1);
  const [openFaq, setOpenFaq] = useState(null);

  const generateData = () => {
    const activeFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v));
    if (Object.keys(activeFields).length === 0) return;
    const newData = Array.from({ length: numRecords }, () => generateRecord(activeFields, locale));
    setData(newData);
    setViewMode("table");
  };

  const toCsv = () => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).map((v) => `"${v}"`).join(",")).join("\n");
    return headers + "\n" + rows;
  };

  const toJson = () => JSON.stringify(data, null, 2);

  const copyAsCsv = () => {
    navigator.clipboard.writeText(toCsv());
    setCopiedCsv(true); setTimeout(() => setCopiedCsv(false), 2000);
  };

  const copyAsJson = () => {
    navigator.clipboard.writeText(toJson());
    setCopiedJson(true); setTimeout(() => setCopiedJson(false), 2000);
  };

  const downloadCsv = () => {
    const blob = new Blob([toCsv()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "fake-data.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const blob = new Blob([toJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "fake-data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const copyRow = (row, index) => {
    navigator.clipboard.writeText(JSON.stringify(row, null, 2));
    setCopiedRow(index); setTimeout(() => setCopiedRow(-1), 2000);
  };

  const selectAll = () => setFields(Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, true])));
  const deselectAll = () => setFields(Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, false])));

  const reset = () => {
    setData([]);
    setFields(defaultFields);
    setNumRecords(10);
    setLocale("pk");
    setViewMode("table");
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generate Fake Pakistani Names, Emails & Addresses for Testing – CSV JSON Download",
    "url": "https://www.generatorpromptai.com/tools/fake-data-generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Free online tool to generate realistic fake data for testing — Pakistani names, emails, phone numbers, addresses, companies. Download as CSV or JSON instantly. No signup required.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Fake Data Generator", "item": "https://www.generatorpromptai.com/tools/fake-data-generator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to generate fake Pakistani names and addresses for testing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select the Pakistani locale, choose the fields you need (name, email, phone, address, etc.), set the number of records, and click Generate. The tool creates realistic Pakistani names, Karachi/Lahore/Islamabad addresses, and +92 phone numbers instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download fake test data as CSV or JSON file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. After generating data, click the Download CSV or Download JSON button to save the file directly. You can also copy the data to your clipboard in either format."
        }
      },
      {
        "@type": "Question",
        "name": "How to create dummy data for database seeding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select all the fields that match your database schema, generate the records, and download as JSON. You can use the JSON output directly in your seed scripts for MongoDB, PostgreSQL, or any other database."
        }
      },
      {
        "@type": "Question",
        "name": "Is the generated data safe to use for testing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely safe. All data is randomly generated and does not belong to any real person. No real personal information is used or stored."
        }
      },
      {
        "@type": "Question",
        "name": "How many fake records can I generate at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can generate up to 200 records per batch. For larger datasets, generate multiple batches and combine the downloaded CSV or JSON files."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool work offline or need an internet connection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The data generation runs entirely in your browser using JavaScript. Once the page is loaded, you can generate data even if your internet connection drops. No data is sent to any server."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Generate Fake Pakistani Names & Emails for Testing – Free CSV JSON Download</title>

        <meta
          name="description"
          content="Free fake data generator with Pakistani names, emails, phone numbers, and addresses. Generate dummy test data for database seeding and API testing. Download as CSV or JSON instantly – no signup required."
        />

        <meta
          name="keywords"
          content="how to generate fake pakistani names for testing, dummy data generator with pakistani addresses, fake email and phone number generator for api testing, create test data for database seeding free, mock data generator csv json download, random pakistani name and address generator, fake data for ui testing free tool, generate dummy user data for demo accounts, test data generator with karachi lahore islamabad addresses, free mock data generator no signup"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/fake-data-generator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Generate Fake Pakistani Names & Emails for Testing – CSV JSON Download" />
        <meta property="og:description" content="Free fake data generator with Pakistani names, emails, phones, addresses. Download as CSV or JSON for database seeding and API testing." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/fake-data-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Fake Data Generator – Pakistani Names, Emails, Addresses – CSV JSON" />
        <meta name="twitter:description" content="Generate realistic dummy data for testing. Pakistani & international names, emails, phones, addresses. Download as CSV or JSON." />

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
              <li><span className="text-gray-900 font-semibold">Fake Data Generator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* ── Hero ── */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <Database className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Generate Fake Pakistani Names & Emails for Testing –{" "}
              <span className="text-sky-600">Free CSV JSON Download</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              Create realistic dummy data with Pakistani names, addresses, and phone numbers. Perfect for database seeding, API testing, and demo accounts.
            </p>
          </div>

          {/* ── Tool Card ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            {/* Row 1: Records + Locale */}
            <div className="flex flex-wrap gap-5 mb-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Records</label>
                <input
                  type="number"
                  value={numRecords}
                  onChange={(e) => setNumRecords(Math.max(1, Math.min(200, parseInt(e.target.value) || 10)))}
                  min="1" max="200"
                  className="w-36 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-lg font-medium"
                />
                <p className="text-xs text-gray-400 mt-1">Max 200</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Data Locale</label>
                <div className="flex gap-2">
                  {[
                    { value: "pk", label: "Pakistani" },
                    { value: "intl", label: "International" },
                  ].map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLocale(l.value)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${locale === l.value
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
                        }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">Fields to Include</label>
                <div className="flex gap-3 text-xs">
                  <button onClick={selectAll} className="text-sky-600 hover:underline">Select All</button>
                  <button onClick={deselectAll} className="text-gray-400 hover:underline">Deselect All</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {FIELD_CONFIG.map((f) => (
                  <label
                    key={f.key}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none text-sm ${fields[f.key]
                      ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={fields[f.key]}
                      onChange={(e) => setFields({ ...fields, [f.key]: e.target.checked })}
                      className="hidden"
                    />
                    <span className={`w-3 h-3 rounded flex-shrink-0 border-2 ${fields[f.key] ? "bg-sky-600 border-sky-600" : "border-gray-300"}`} />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button
                onClick={generateData}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Table size={18} /> Generate {numRecords} Records
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
              >
                <RefreshCw size={15} /> Reset
              </button>
            </div>

            {/* ── Results ── */}
            {data.length > 0 && (
              <div className="mt-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Database size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{data.length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Records</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Users size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{Object.keys(data[0]).length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Fields</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Globe size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{locale === "pk" ? "PK" : "INTL"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Locale</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <div className="flex justify-center text-sky-500 mb-1"><Zap size={20} /></div>
                    <p className="text-lg font-bold text-gray-800">{toCsv().split("\n").length - 1}</p>
                    <p className="text-xs text-gray-500 mt-0.5">CSV Rows</p>
                  </div>
                </div>

                {/* Result Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Output</span>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${viewMode === "table" ? "bg-sky-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <Table size={13} /> Table
                      </button>
                      <button
                        onClick={() => setViewMode("json")}
                        className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${viewMode === "json" ? "bg-sky-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <Code size={13} /> JSON
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={copyAsCsv} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                      <Copy size={13} /> {copiedCsv ? "Copied!" : "Copy CSV"}
                    </button>
                    <button onClick={copyAsJson} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                      <Copy size={13} /> {copiedJson ? "Copied!" : "Copy JSON"}
                    </button>
                    <button onClick={downloadCsv} className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors">
                      <Download size={13} /> CSV
                    </button>
                    <button onClick={downloadJson} className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors">
                      <Download size={13} /> JSON
                    </button>
                  </div>
                </div>

                {/* Table View */}
                {viewMode === "table" && (
                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-8">#</th>
                          {Object.keys(data[0]).map((key) => (
                            <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </th>
                          ))}
                          <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Copy</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((row, index) => (
                          <tr key={index} className="hover:bg-sky-50 transition-colors">
                            <td className="px-3 py-3 text-gray-400 text-xs">{index + 1}</td>
                            {Object.values(row).map((val, i) => (
                              <td key={i} className="px-4 py-3 text-gray-800 whitespace-nowrap">{val}</td>
                            ))}
                            <td className="px-3 py-3 text-center">
                              <button
                                onClick={() => copyRow(row, index)}
                                className="text-gray-400 hover:text-sky-600 transition-colors"
                                title="Copy row as JSON"
                              >
                                {copiedRow === index ? <span className="text-xs text-green-600 font-bold">Done</span> : <Copy size={13} />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* JSON View */}
                {viewMode === "json" && (
                  <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto max-h-96">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">JSON Output</p>
                    <pre className="text-sm font-mono leading-relaxed">
                      {toJson().split(/"([^"]+)":/).map((part, i) => {
                        if (i % 2 === 1) return <span key={i} className="text-sky-400">"{part}"</span>;
                        if (part.startsWith('"') && part.endsWith('"')) return <span key={i} className="text-green-400">{part}</span>;
                        return <span key={i} className="text-gray-300">{part}</span>;
                      })}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!data.length && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-4">
                <Database size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Click <strong className="text-gray-500">Generate Records</strong> to create your fake dataset</p>
              </div>
            )}
          </div>

          {/* ── SEO Content 1 ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Dummy Data Generator with Pakistani Names, Emails & Addresses
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Most fake data generators only produce Western names and addresses. If you are building an app for the Pakistani market, testing with "John Smith" from "New York" does not cut it. Our tool solves this by offering a dedicated <strong>Pakistani locale</strong> with realistic names like Ahmed Khan, Fatima Siddiqui, and cities like Karachi, Lahore, and Islamabad.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Every record includes properly formatted Pakistani phone numbers with the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">+92</code> prefix, local street names like DHA Phase 2 and Gulshan-e-Iqbal, and recognizable company names. Switch to the international locale anytime for US, UK, and global data.
            </p>
          </div>

          {/* ── How to Use ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Create Dummy Data for Database Seeding
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Select <strong>Pakistani</strong> or <strong>International</strong> locale based on your target market.</li>
              <li>Choose the fields you need — name, email, phone, address, company, job title, and more.</li>
              <li>Set the number of records (up to 200 per batch).</li>
              <li>Click <strong>"Generate Records"</strong> and preview the data in table or JSON view.</li>
              <li>Download as <strong>.csv</strong> for spreadsheets or <strong>.json</strong> for database seed scripts.</li>
            </ol>
          </div>

          {/* ── Features Grid ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Random Pakistani Name & Address Generator – Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Pakistani Locale", desc: "Realistic Pakistani first names, last names, cities (Karachi, Lahore, Islamabad), streets (DHA, Clifton, Gulberg), and +92 phone numbers." },
                { title: "CSV & JSON Download", desc: "Export generated data as a .csv file for Excel or a .json file for database seeding scripts. Copy to clipboard also supported." },
                { title: "14 Customizable Fields", desc: "Mix and match Full Name, Username, Email, Phone, Address, City, ZIP, Country, Age, Company, Job Title, Website, Password, and Bio." },
                { title: "100% Private & Offline-Capable", desc: "All data generation runs locally in your browser. No data is sent to any server. Works even if your internet drops after page load." }
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
              Fake Data Generator – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to generate fake Pakistani names and addresses for testing?",
                  a: "Select the Pakistani locale, choose the fields you need (name, email, phone, address, etc.), set the number of records, and click Generate. The tool creates realistic Pakistani names, Karachi/Lahore/Islamabad addresses, and +92 phone numbers instantly."
                },
                {
                  q: "Can I download fake test data as CSV or JSON file?",
                  a: "Yes. After generating data, click the Download CSV or Download JSON button to save the file directly. You can also copy the data to your clipboard in either format."
                },
                {
                  q: "How to create dummy data for database seeding?",
                  a: "Select all the fields that match your database schema, generate the records, and download as JSON. You can use the JSON output directly in your seed scripts for MongoDB, PostgreSQL, or any other database."
                },
                {
                  q: "Is the generated data safe to use for testing?",
                  a: "Yes, completely safe. All data is randomly generated and does not belong to any real person. No real personal information is used or stored."
                },
                {
                  q: "How many fake records can I generate at once?",
                  a: "You can generate up to 200 records per batch. For larger datasets, generate multiple batches and combine the downloaded CSV or JSON files."
                },
                {
                  q: "Does this tool work offline or need an internet connection?",
                  a: "The data generation runs entirely in your browser using JavaScript. Once the page is loaded, you can generate data even if your internet connection drops. No data is sent to any server."
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Developer Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/json-formatter", title: "JSON Formatter & Validator", desc: "Beautify, minify, and validate JSON data with syntax error highlighting." },
                { to: "/tools/lorem-ipsum-generator", title: "Lorem Ipsum Generator", desc: "Generate placeholder text for design and development projects." },
                { to: "/tools/age-calculator", title: "Age Calculator", desc: "Calculate exact age in years, months, days, and total days lived." }
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

export default FakeDataGenerator;