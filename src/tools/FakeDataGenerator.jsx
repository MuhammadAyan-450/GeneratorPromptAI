// pages/FakeDataGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, RefreshCw, Table, Download, Code, Database } from "lucide-react";

// ─── Data pools ──────────────────────────────────────────────────────────────
const DATA = {
  pk: {
    firstNames: ["Ayan","Sara","Ali","Fatima","Ahmed","Zara","Hamza","Aisha","Omar","Maryam","Bilal","Hina","Usman","Noor","Rehan","Zainab","Ibrahim","Laiba","Raza","Amna","Hassan","Sana","Tariq","Nimra","Faisal","Sadia","Waqar","Hira","Kamran","Iqra"],
    lastNames:  ["Khan","Ahmed","Malik","Siddiqui","Hussain","Raza","Shah","Iqbal","Baig","Chaudhry","Ansari","Mirza","Butt","Qureshi","Cheema","Rajput","Niazi","Abbasi","Javed","Nawaz"],
    cities:     ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Hyderabad","Peshawar","Quetta","Sialkot","Gujranwala","Bahawalpur","Sukkur","Larkana","Mardan"],
    streets:    ["Main Boulevard","Shahrah-e-Faisal","Gulshan-e-Iqbal","Clifton","DHA Phase 2","Johar Town","Bahria Town","Model Town","Gulberg","PECHS","North Nazimabad","Saddar","Blue Area","F-7 Markaz","G-11"],
    companies:  ["TechVentures Pvt Ltd","NextGen Solutions","AlphaSoft","Packages Ltd","Habib Bank","MCB Bank","Arif Habib Corp","Systems Ltd","NetSol Technologies","TPL Corp","Daraz","Foodpanda Pakistan"],
    jobs:       ["Software Engineer","Frontend Developer","Data Analyst","Product Manager","UI/UX Designer","DevOps Engineer","QA Engineer","Business Analyst","Full Stack Developer","Project Manager","CTO","Backend Developer"],
    domains:    ["gmail.com","yahoo.com","hotmail.com","outlook.com","proton.me"],
    phonePrefix: "+92",
    country:    "Pakistan",
    zipRange:   [10000, 99999],
  },
  intl: {
    firstNames: ["James","Emma","Liam","Olivia","Noah","Ava","William","Sophia","Benjamin","Isabella","Lucas","Mia","Mason","Charlotte","Ethan","Amelia","Logan","Harper","Jack","Evelyn"],
    lastNames:  ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee"],
    cities:     ["New York","London","Toronto","Sydney","Dubai","Berlin","Paris","Tokyo","Singapore","Amsterdam","Chicago","Los Angeles","Manchester","Melbourne","Vancouver"],
    streets:    ["Oak Street","Maple Avenue","Cedar Lane","Park Drive","Elm Street","Main Street","Broadway","5th Avenue","Sunset Boulevard","Oxford Street","Kingsway","Victoria Road"],
    companies:  ["Acme Corp","TechFlow Inc","NovaSoft","Bright Solutions","Apex Systems","Vertex Labs","Quantum Inc","DataBridge","CloudForge","Pixel Works","NextWave","CodeBase"],
    jobs:       ["Software Engineer","Marketing Manager","Sales Executive","Product Designer","Data Scientist","DevOps Engineer","Financial Analyst","HR Manager","Content Writer","Operations Lead","CTO","Consultant"],
    domains:    ["gmail.com","yahoo.com","hotmail.com","outlook.com","proton.me","icloud.com"],
    phonePrefix: "+1",
    country:    "United States",
    zipRange:   [10000, 99999],
  },
};

const BIOS = [
  "Passionate web developer • React & Next.js enthusiast",
  "Coffee ☕ Code 💻 Repeat",
  "Building modern apps one commit at a time",
  "Always learning new tech stacks",
  "Frontend developer | UI/UX lover",
  "Open source contributor • Night owl coder",
  "Exploring AI tools and prompt engineering",
  "Clean code advocate • Testing enthusiast",
  "Full stack dev • Dog lover 🐶",
  "Remote worker • Digital nomad",
];

const FIELD_CONFIG = [
  { key: "name",      label: "Full Name",    default: true  },
  { key: "username",  label: "Username",     default: true  },
  { key: "email",     label: "Email",        default: true  },
  { key: "phone",     label: "Phone",        default: true  },
  { key: "address",   label: "Address",      default: true  },
  { key: "city",      label: "City",         default: false },
  { key: "zipCode",   label: "ZIP Code",     default: false },
  { key: "country",   label: "Country",      default: false },
  { key: "age",       label: "Age",          default: true  },
  { key: "company",   label: "Company",      default: false },
  { key: "jobTitle",  label: "Job Title",    default: false },
  { key: "website",   label: "Website URL",  default: false },
  { key: "password",  label: "Password",     default: false },
  { key: "bio",       label: "Bio",          default: false },
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(min + Math.random() * (max - min));

function generateRecord(fields, locale) {
  const pool    = DATA[locale] || DATA.pk;
  const first   = rand(pool.firstNames);
  const last    = rand(pool.lastNames);
  const name    = `${first} ${last}`;
  const city    = rand(pool.cities);
  const entry   = {};

  if (fields.name)     entry.name     = name;
  if (fields.username) entry.username = `${first.toLowerCase()}${last.toLowerCase()}${randInt(10,999)}`;
  if (fields.email)    entry.email    = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(1,999)}@${rand(pool.domains)}`;
  if (fields.phone)    entry.phone    = `${pool.phonePrefix}${randInt(300,399)}-${randInt(1000000,9999999)}`;
  if (fields.address)  entry.address  = `${randInt(1,999)} ${rand(pool.streets)}, ${city}`;
  if (fields.city)     entry.city     = city;
  if (fields.zipCode)  entry.zipCode  = String(randInt(...pool.zipRange));
  if (fields.country)  entry.country  = pool.country;
  if (fields.age)      entry.age      = randInt(18, 65);
  if (fields.company)  entry.company  = rand(pool.companies);
  if (fields.jobTitle) entry.jobTitle = rand(pool.jobs);
  if (fields.website)  entry.website  = `https://www.${first.toLowerCase()}${last.toLowerCase()}.com`;
  if (fields.password) entry.password = `${rand(["Pass","Key","Secure","Safe","My"])}${randInt(1000,9999)}${rand(["!","@","#","$"])}`;
  if (fields.bio)      entry.bio      = rand(BIOS);

  return entry;
}

const FakeDataGenerator = () => {
  const defaultFields = Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, f.default]));

  const [numRecords, setNumRecords] = useState(10);
  const [fields, setFields]         = useState(defaultFields);
  const [locale, setLocale]         = useState("pk");
  const [data, setData]             = useState([]);
  const [viewMode, setViewMode]     = useState("table"); // "table" | "json"
  const [copiedCsv, setCopiedCsv]   = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedRow, setCopiedRow]   = useState(-1);
  const [toast, setToast]           = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const generateData = () => {
    const activeFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v));
    if (Object.keys(activeFields).length === 0) { showToast("Select at least one field"); return; }
    const newData = Array.from({ length: numRecords }, () => generateRecord(activeFields, locale));
    setData(newData);
    setViewMode("table");
  };

  const toCsv = () => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows    = data.map((row) => Object.values(row).map((v) => `"${v}"`).join(",")).join("\n");
    return headers + "\n" + rows;
  };

  const toJson = () => JSON.stringify(data, null, 2);

  const copyAsCsv = () => {
    navigator.clipboard.writeText(toCsv());
    setCopiedCsv(true); setTimeout(() => setCopiedCsv(false), 2000);
    showToast("CSV copied to clipboard!");
  };

  const copyAsJson = () => {
    navigator.clipboard.writeText(toJson());
    setCopiedJson(true); setTimeout(() => setCopiedJson(false), 2000);
    showToast("JSON copied to clipboard!");
  };

  const downloadCsv = () => {
    const blob = new Blob([toCsv()], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "fake-data.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const blob = new Blob([toJson()], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "fake-data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const copyRow = (row, index) => {
    navigator.clipboard.writeText(JSON.stringify(row, null, 2));
    setCopiedRow(index); setTimeout(() => setCopiedRow(-1), 2000);
  };

  const selectAll   = () => setFields(Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, true])));
  const deselectAll = () => setFields(Object.fromEntries(FIELD_CONFIG.map((f) => [f.key, false])));

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fake Data Generator",
    url: "https://www.generatorpromptai.com/tools/fake-data-generator",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free tool to generate realistic fake data for testing — names, emails, phones, addresses, companies. CSV & JSON download. Pakistani and international data.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a fake data generator?",
        acceptedAnswer: { "@type": "Answer", text: "A fake data generator creates realistic but fictional data — names, emails, phone numbers, addresses — for use in testing, development, demos, and database seeding without using real personal information." },
      },
      {
        "@type": "Question",
        name: "Can I download the generated data as CSV or JSON?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our fake data generator lets you download the generated records as a .csv file or .json file with one click. You can also copy to clipboard." },
      },
      {
        "@type": "Question",
        name: "Is this fake data generator free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. No sign-up, no account, no limits on how many times you use it." },
      },
      {
        "@type": "Question",
        name: "Does it generate Pakistani names and addresses?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our tool includes a Pakistani locale with realistic Pakistani first names, last names, city names (Karachi, Lahore, Islamabad), Pakistani phone numbers (+92), and Pakistani street names." },
      },
      {
        "@type": "Question",
        name: "How many records can I generate at once?",
        acceptedAnswer: { "@type": "Answer", text: "You can generate up to 200 records at once. For larger datasets, simply generate multiple batches and combine the CSV or JSON outputs." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Fake Data Generator - Free Dummy Data Generator for Testing | CSV & JSON</title>
        <meta
          name="description"
          content="Free fake data generator for developers — generate realistic dummy names, emails, phone numbers, addresses, companies and more. Download as CSV or JSON. Pakistani & international data. No sign-up."
        />
        <meta
          name="keywords"
          content="fake data generator, dummy data generator, test data generator, mock data, random data generator, fake names generator, fake email generator, csv data generator, json data generator, pakistani dummy data"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/fake-data-generator" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Fake Data Generator - Free Dummy Data CSV & JSON" />
        <meta property="og:description" content="Generate realistic fake data for testing — names, emails, phones, addresses. Download as CSV or JSON. Free, no sign-up." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/fake-data-generator" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-fake-data-generator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Fake Data Generator - CSV & JSON Download" />
        <meta name="twitter:description" content="Generate realistic dummy data for testing. Pakistani & international names, emails, phones, addresses. Download as CSV or JSON." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-fake-data-generator.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-100 mb-4">
              <Database className="text-violet-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Fake Data Generator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Generate realistic dummy data for testing and development. Pakistani &amp; international. Download as CSV or JSON.
            </p>
          </div>

          {/* Tool Card */}
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
                  className="w-36 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg font-medium"
                />
                <p className="text-xs text-gray-400 mt-1">Max 200</p>
              </div>

              {/* Locale */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Data Locale</label>
                <div className="flex gap-2">
                  {[
                    { value: "pk",   label: "🇵🇰 Pakistani" },
                    { value: "intl", label: "🌍 International" },
                  ].map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLocale(l.value)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        locale === l.value
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-violet-400"
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
                  <button onClick={selectAll}   className="text-violet-600 hover:underline">Select All</button>
                  <button onClick={deselectAll} className="text-gray-400 hover:underline">Deselect All</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {FIELD_CONFIG.map((f) => (
                  <label
                    key={f.key}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none text-sm ${
                      fields[f.key]
                        ? "bg-violet-50 border-violet-400 text-violet-700 font-medium"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={fields[f.key]}
                      onChange={(e) => setFields({ ...fields, [f.key]: e.target.checked })}
                      className="hidden"
                    />
                    <span className={`w-3 h-3 rounded flex-shrink-0 border-2 ${fields[f.key] ? "bg-violet-600 border-violet-600" : "border-gray-300"}`} />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={generateData}
                className="flex-1 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Table size={18} /> Generate {numRecords} Records
              </button>
              <button
                onClick={() => setData([])}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>

            {/* Results */}
            {data.length > 0 && (
              <div>
                {/* Result Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">{data.length} records generated</span>
                    {/* View Toggle */}
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${viewMode === "table" ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <Table size={13} /> Table
                      </button>
                      <button
                        onClick={() => setViewMode("json")}
                        className={`px-3 py-1.5 flex items-center gap-1 transition-colors ${viewMode === "json" ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <Code size={13} /> JSON
                      </button>
                    </div>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button onClick={copyAsCsv}   className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      <Copy size={13} /> {copiedCsv ? "Copied!" : "Copy CSV"}
                    </button>
                    <button onClick={copyAsJson}  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      <Copy size={13} /> {copiedJson ? "Copied!" : "Copy JSON"}
                    </button>
                    <button onClick={downloadCsv} className="inline-flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors">
                      <Download size={13} /> CSV
                    </button>
                    <button onClick={downloadJson} className="inline-flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors">
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
                          <tr key={index} className="hover:bg-violet-50 transition-colors">
                            <td className="px-3 py-3 text-gray-400 text-xs">{index + 1}</td>
                            {Object.values(row).map((val, i) => (
                              <td key={i} className="px-4 py-3 text-gray-800 whitespace-nowrap">{val}</td>
                            ))}
                            <td className="px-3 py-3 text-center">
                              <button
                                onClick={() => copyRow(row, index)}
                                className="text-gray-400 hover:text-violet-600 transition-colors"
                                title="Copy row as JSON"
                              >
                                {copiedRow === index ? <span className="text-xs text-green-600">✓</span> : <Copy size={13} />}
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
                  <div className="bg-gray-900 rounded-xl p-5 overflow-x-auto max-h-96">
                    <pre className="text-green-400 text-xs leading-relaxed font-mono">
                      {toJson()}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {!data.length && (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Database size={32} className="mx-auto mb-3 text-gray-300" />
                <p>Click <strong className="text-gray-500">Generate Records</strong> to create your fake dataset</p>
              </div>
            )}
          </div>

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Fake Data Generator for Developers &amp; Testers
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Need realistic test data fast? Our free fake data generator creates believable dummy records — names, emails, phone numbers, addresses, companies, job titles, and more — perfect for testing APIs, seeding databases, filling demo forms, and building prototypes.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Choose between Pakistani locale (Karachi, Lahore, +92 numbers, Pakistani names) or international data. Generate up to 200 records at once and export directly as a <strong>.csv</strong> or <strong>.json</strong> file — no copy-paste needed.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What can you use fake data for?</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mb-4">
              <li>Seeding development and staging databases</li>
              <li>Testing API endpoints and form validation</li>
              <li>Creating demo accounts for client presentations</li>
              <li>Filling spreadsheets and mockups with realistic data</li>
              <li>UI/UX testing with realistic content</li>
              <li>Load testing with large generated datasets</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Available fields</h3>
            <p className="text-gray-600 text-sm">
              Full Name, Username, Email, Phone, Address, City, ZIP Code, Country, Age, Company, Job Title, Website URL, Password, Bio — mix and match any combination.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "What is a fake data generator?", a: "A fake data generator creates realistic but fictional data — names, emails, phones, addresses — for use in testing, development, and demos without using real personal information." },
                { q: "Can I download the data as CSV or JSON?", a: "Yes. Click the Download CSV or Download JSON buttons to save the generated data directly as a file. You can also copy it to clipboard." },
                { q: "Does it generate Pakistani names and addresses?", a: "Yes. Select the Pakistani locale to get realistic Pakistani names, Karachi/Lahore/Islamabad addresses, +92 phone numbers, and local company names." },
                { q: "How many records can I generate?", a: "Up to 200 records per generation. For larger datasets, generate multiple batches and combine the CSV files." },
                { q: "Is this fake data generator free?", a: "Yes, completely free with no sign-up, no account, and no limits on usage." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Developer Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/json-formatter",          title: "JSON Formatter & Validator", desc: "Beautify, minify, validate and repair JSON instantly." },
                { to: "/tools/lorem-ipsum-generator",   title: "Lorem Ipsum Generator",      desc: "Generate placeholder text for design and development." },
                { to: "/tools/random-number-generator", title: "Random Number Generator",    desc: "Generate random numbers, dice rolls and lottery picks." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-violet-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-violet-600 transition-colors">{tool.title}</h3>
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