// pages/PasswordGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, RefreshCw, Copy, Eye, EyeOff,
  CheckCircle2, Shield, Clock, List
} from "lucide-react";

// ─── Word list for passphrase mode ───────────────────────────────────────────
const WORDS = [
  "apple","bridge","castle","dragon","eagle","forest","garden","harbor",
  "island","jungle","kitten","lemon","mango","north","ocean","planet",
  "queen","river","silver","tiger","uncle","valley","winter","yellow",
  "zebra","anchor","butter","candle","dancer","engine","falcon","golden",
  "hunter","ignite","jester","kelvin","lantern","marble","noble","orange",
  "pepper","quiet","rocket","shadow","thunder","ultra","velvet","walnut",
  "xenon","yonder","zephyr","arrow","blade","cloud","dawn","ember",
  "flame","grace","haven","ivory","jewel","knight","lunar","mystic",
];

// ─── Strength helpers ─────────────────────────────────────────────────────────
function calcStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)  score += 1;
  if (pwd.length >= 12) score += 2;
  if (pwd.length >= 16) score += 2;
  if (pwd.length >= 20) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[a-z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 2;

  const max = 11;
  const pct = Math.round((score / max) * 100);

  if (score >= 9)  return { label: "Very Strong", pct, color: "bg-green-500",  text: "text-green-600"  };
  if (score >= 7)  return { label: "Strong",      pct, color: "bg-emerald-500",text: "text-emerald-600"};
  if (score >= 5)  return { label: "Medium",      pct, color: "bg-yellow-500", text: "text-yellow-600" };
  if (score >= 3)  return { label: "Weak",        pct, color: "bg-orange-500", text: "text-orange-600" };
  return               { label: "Very Weak",   pct, color: "bg-red-500",    text: "text-red-600"   };
}

function crackTime(pwd) {
  // rough estimate: 10 billion guesses/sec (modern GPU cluster)
  const charsets = [
    { regex: /[a-z]/, size: 26 },
    { regex: /[A-Z]/, size: 26 },
    { regex: /[0-9]/, size: 10 },
    { regex: /[^A-Za-z0-9]/, size: 32 },
  ];
  const poolSize = charsets.reduce((acc, c) => acc + (c.regex.test(pwd) ? c.size : 0), 0);
  const combinations = Math.pow(poolSize || 1, pwd.length);
  const seconds = combinations / 10_000_000_000;

  if (seconds < 1)         return "< 1 second";
  if (seconds < 60)        return `${Math.round(seconds)} seconds`;
  if (seconds < 3600)      return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400)     return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000)   return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000)  return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 1e9)       return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 1e12)      return `${(seconds / 1e9).toFixed(1)} billion years`;
  return "millions of years";
}

function secureRandInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

// ─── Component ────────────────────────────────────────────────────────────────
const PasswordGenerator = () => {
  const [password,          setPassword]          = useState("");
  const [bulkPasswords,     setBulkPasswords]     = useState([]);
  const [history,           setHistory]           = useState([]);
  const [length,            setLength]            = useState(16);
  const [includeUppercase,  setIncludeUppercase]  = useState(true);
  const [includeLowercase,  setIncludeLowercase]  = useState(true);
  const [includeNumbers,    setIncludeNumbers]    = useState(true);
  const [includeSymbols,    setIncludeSymbols]    = useState(true);
  const [excludeAmbiguous,  setExcludeAmbiguous]  = useState(false);
  const [passphraseMode,    setPassphraseMode]    = useState(false);
  const [wordCount,         setWordCount]         = useState(4);
  const [bulkCount,         setBulkCount]         = useState(0); // 0 = single
  const [showPassword,      setShowPassword]      = useState(false);
  const [copied,            setCopied]            = useState("");
  const [toast,             setToast]             = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const buildCharset = () => {
    const ambiguous = "0Ol1I";
    const filter    = (s) => excludeAmbiguous ? s.split("").filter((c) => !ambiguous.includes(c)).join("") : s;
    let chars = "";
    if (includeLowercase) chars += filter("abcdefghijklmnopqrstuvwxyz");
    if (includeUppercase) chars += filter("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (includeNumbers)   chars += filter("0123456789");
    if (includeSymbols)   chars += "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    return chars;
  };

  const generateSingle = () => {
    if (passphraseMode) {
      const words = Array.from({ length: wordCount }, () => WORDS[secureRandInt(WORDS.length)]);
      return words.join("-");
    }
    const chars = buildCharset();
    if (!chars) return "Select at least one character type";
    return Array.from({ length }, (_, i) => {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return chars[arr[0] % chars.length];
    }).join("");
  };

  const generate = () => {
    setBulkPasswords([]);
    if (bulkCount > 0) {
      const passwords = Array.from({ length: bulkCount }, generateSingle);
      setBulkPasswords(passwords);
      setPassword(passwords[0]);
      addToHistory(passwords[0]);
    } else {
      const pwd = generateSingle();
      setPassword(pwd);
      addToHistory(pwd);
    }
    setCopied("");
  };

  const addToHistory = (pwd) => {
    setHistory((prev) => [pwd, ...prev].slice(0, 5));
  };

  const copyPwd = (pwd, key) => {
    navigator.clipboard.writeText(pwd);
    setCopied(key);
    showToast("Password copied!");
    setTimeout(() => setCopied(""), 2000);
  };

  const strength    = password ? calcStrength(password) : null;
  const timeToBreak = password && !passphraseMode ? crackTime(password) : null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Password Generator",
    url: "https://www.generatorpromptai.com/tools/password-generator",
    applicationCategory: "SecurityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description: "Free online password generator. Create strong random passwords or memorable passphrases. Real-time strength meter, time-to-crack estimate, bulk generation. Uses secure crypto API.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "GeneratorPromptAI", url: "https://www.generatorpromptai.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How long should a strong password be?",
        acceptedAnswer: { "@type": "Answer", text: "A strong password should be at least 12 characters long. For high-security accounts, use 16–20+ characters with uppercase, lowercase, numbers, and symbols." },
      },
      {
        "@type": "Question",
        name: "Is this password generator secure?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Our generator uses the browser's built-in crypto.getRandomValues() API which produces cryptographically secure random numbers. Generated passwords are never sent to any server." },
      },
      {
        "@type": "Question",
        name: "What is a passphrase and is it more secure?",
        acceptedAnswer: { "@type": "Answer", text: "A passphrase is a string of random words (e.g. 'tiger-castle-river-lamp'). A 4-word passphrase is often easier to remember and can be as secure as a 16-character random password, especially for master passwords." },
      },
      {
        "@type": "Question",
        name: "Should I use the same password for multiple accounts?",
        acceptedAnswer: { "@type": "Answer", text: "Never reuse passwords. If one account is breached, all accounts with the same password become vulnerable. Use a unique password for every account and store them in a password manager." },
      },
      {
        "@type": "Question",
        name: "What does 'exclude ambiguous characters' mean?",
        acceptedAnswer: { "@type": "Answer", text: "Ambiguous characters like 0 (zero) and O (letter O), or 1 (one) and l (letter L) can be hard to tell apart. Excluding them makes passwords easier to type manually without errors." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Password Generator - Free Strong Random Password Generator Online 2026</title>
        <meta
          name="description"
          content="Free online password generator — create strong random passwords or memorable passphrases. Real-time strength meter, time-to-crack estimate, bulk generation. Uses secure crypto API. No sign-up."
        />
        <meta
          name="keywords"
          content="password generator, strong password generator, random password, secure password maker, passphrase generator, free password generator 2026, password strength checker, bulk password generator"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/password-generator" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Password Generator - Strong Random Passwords Free" />
        <meta property="og:description" content="Generate strong random passwords or memorable passphrases. Real-time strength meter and time-to-crack estimate. Free, secure, no sign-up." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/password-generator" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-password-generator.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Password Generator - Strong & Random" />
        <meta name="twitter:description" content="Generate strong random passwords with strength meter and time-to-crack estimate. Free online tool." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-password-generator.png" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 py-5">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 mb-4">
              <Shield className="text-indigo-600" size={26} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Password Generator</h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Create strong random passwords or memorable passphrases. Real-time strength meter and time-to-crack estimate.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-6">

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPassphraseMode(false)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  !passphraseMode ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
                }`}
              >
                🔐 Random Password
              </button>
              <button
                onClick={() => setPassphraseMode(true)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  passphraseMode ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
                }`}
              >
                💬 Passphrase
              </button>
            </div>

            {/* Password Display */}
            <div className="mb-6">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="w-full px-5 py-4 text-xl font-mono border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-24 tracking-widest"
                  placeholder="Click Generate"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 p-1.5" title="Toggle visibility">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button onClick={() => copyPwd(password, "main")} disabled={!password} className="text-indigo-500 hover:text-indigo-700 disabled:opacity-30 p-1.5" title="Copy">
                    {copied === "main" ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Strength + crack time */}
              {strength && password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Strength:</span>
                      <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                    </div>
                    {timeToBreak && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={12} /> Time to crack: <strong className="text-gray-600">{timeToBreak}</strong>
                      </div>
                    )}
                  </div>
                  {/* Strength bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            {!passphraseMode ? (
              <div className="space-y-5 mb-6">
                {/* Length */}
                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                    <span>Password Length</span>
                    <span className="text-indigo-600">{length} characters</span>
                  </div>
                  <input
                    type="range" min="8" max="64" value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>8</span><span>64</span>
                  </div>
                </div>

                {/* Character types */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Uppercase (A-Z)",    checked: includeUppercase, set: setIncludeUppercase },
                    { label: "Lowercase (a-z)",    checked: includeLowercase, set: setIncludeLowercase },
                    { label: "Numbers (0-9)",      checked: includeNumbers,   set: setIncludeNumbers   },
                    { label: "Symbols (!@#$...)",  checked: includeSymbols,   set: setIncludeSymbols   },
                  ].map((opt) => (
                    <label key={opt.label} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none text-sm ${
                      opt.checked ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium" : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}>
                      <input
                        type="checkbox" checked={opt.checked}
                        onChange={(e) => opt.set(e.target.checked)} className="hidden"
                      />
                      <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${opt.checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                        {opt.checked && <span className="text-white text-xs">✓</span>}
                      </span>
                      {opt.label}
                    </label>
                  ))}
                </div>

                {/* Exclude ambiguous */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-sm ${
                  excludeAmbiguous ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-gray-50 border-gray-200 text-gray-600"
                }`}>
                  <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="hidden" />
                  <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${excludeAmbiguous ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                    {excludeAmbiguous && <span className="text-white text-xs">✓</span>}
                  </span>
                  Exclude ambiguous characters (0, O, l, 1, I) — easier to type manually
                </label>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>Number of words</span>
                  <span className="text-indigo-600">{wordCount} words</span>
                </div>
                <input
                  type="range" min="3" max="8" value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <p className="text-xs text-gray-400 mt-2">Example: <em>tiger-castle-river-lamp</em> — easy to remember, hard to crack</p>
              </div>
            )}

            {/* Bulk mode */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Generate Mode</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Single",  value: 0 },
                  { label: "5 at once", value: 5 },
                  { label: "10 at once", value: 10 },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setBulkCount(m.value)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      bulkCount === m.value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-4 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} /> Generate {passphraseMode ? "Passphrase" : "Password"}
            </button>

            {/* Bulk results */}
            {bulkPasswords.length > 1 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <List size={15} /> Generated Passwords — click to copy
                </p>
                <div className="space-y-2">
                  {bulkPasswords.map((pwd, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 hover:border-indigo-300 transition-colors">
                      <span className="font-mono text-sm text-gray-800 truncate flex-1">{showPassword ? pwd : "•".repeat(Math.min(pwd.length, 20))}</span>
                      <button onClick={() => copyPwd(pwd, `bulk-${i}`)} className="ml-3 text-indigo-500 hover:text-indigo-700 flex-shrink-0">
                        {copied === `bulk-${i}` ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Recent Passwords (this session)</p>
              <div className="space-y-2">
                {history.slice(1).map((pwd, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                    <span className="font-mono text-xs text-gray-500 truncate flex-1">{"•".repeat(Math.min(pwd.length, 30))}</span>
                    <button onClick={() => copyPwd(pwd, `hist-${i}`)} className="ml-3 text-gray-400 hover:text-indigo-500 flex-shrink-0">
                      {copied === `hist-${i}` ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Password Generator — Strong, Random &amp; Secure
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free password generator creates cryptographically secure random passwords using your browser's built-in <code className="bg-gray-100 px-1 rounded text-sm">crypto.getRandomValues()</code> API — far more secure than <code className="bg-gray-100 px-1 rounded text-sm">Math.random()</code>. Generated passwords are never sent to any server.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Choose between random passwords (most secure) or memorable passphrases (great for master passwords). The real-time strength meter and time-to-crack estimate show exactly how secure your password is.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Password security tips</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Use at least 12 characters — 16+ is recommended for important accounts</li>
              <li>Use a unique password for every account — never reuse passwords</li>
              <li>Enable two-factor authentication (2FA) wherever possible</li>
              <li>Store passwords in a trusted password manager (Bitwarden, 1Password)</li>
              <li>Use passphrases for master passwords — easier to remember, hard to crack</li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How long should a strong password be?", a: "At least 12 characters for most accounts. For high-security accounts (banking, email, crypto), use 16–20+ characters with uppercase, lowercase, numbers, and symbols." },
                { q: "Is this password generator secure?", a: "Yes. It uses the browser's crypto.getRandomValues() API which produces cryptographically secure random numbers. Passwords are generated locally and never sent to any server." },
                { q: "What is a passphrase and should I use one?", a: "A passphrase is a string of random words (e.g. 'tiger-castle-river-lamp'). A 4-word passphrase is easy to remember and can be as secure as a 16-character random password. Great for master passwords." },
                { q: "What does 'exclude ambiguous characters' do?", a: "It removes characters that look similar — like 0 (zero) vs O (letter), or 1 (one) vs l (letter L). This makes passwords easier to type manually without mistakes." },
                { q: "Should I reuse passwords?", a: "Never. If one account is breached, all accounts with the same password become vulnerable. Use a unique password for every account and store them in a password manager like Bitwarden or 1Password." },
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
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Security &amp; Utility Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/password-strength-checker", title: "Password Strength Checker", desc: "Test how strong and crack-resistant your password is." },
                { to: "/tools/random-number-generator",   title: "Random Number Generator",   desc: "Generate secure random numbers for OTPs and testing." },
                { to: "/tools/fake-data-generator",       title: "Fake Data Generator",       desc: "Generate test passwords and user data for development." },
              ].map((tool) => (
                <Link
                  key={tool.to}
                  to={tool.to}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-400 transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-indigo-600 transition-colors">{tool.title}</h3>
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

export default PasswordGenerator;