// pages/PasswordGenerator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, RefreshCw, Copy, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState({ label: "", score: 0, color: "gray" });
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

    let chars = "";
    if (includeLowercase) chars += lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars.length === 0) {
      setPassword("Select at least one character type");
      setStrength({ label: "", score: 0, color: "gray" });
      return;
    }

    let newPassword = "";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(randomValues[i] % chars.length);
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
    setCopied(false);
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 2;
    if (pwd.length >= 16) score += 2;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 2;

    let label = "";
    let color = "gray";

    if (score >= 8) {
      label = "Very Strong";
      color = "green";
    } else if (score >= 6) {
      label = "Strong";
      color = "emerald";
    } else if (score >= 4) {
      label = "Medium";
      color = "yellow";
    } else {
      label = "Weak";
      color = "red";
    }

    setStrength({ label, score, color });
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Helmet>
        <title>Password Generator Online – Strong & Secure Random Passwords</title>
        <meta
          name="description"
          content="Generate strong, random, secure passwords instantly online. Customize length, uppercase, numbers, symbols. Real-time strength meter, copy with one click. Uses secure Crypto API – 100% private, no signup. Built in Karachi."
        />
        <meta
          name="keywords"
          content="password generator online, strong password generator, random password creator, secure password maker, free password tool 2026, password strength checker"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/password-generator" />

        <meta property="og:title" content="Password Generator – Free & Secure Online 2026" />
        <meta property="og:description" content="Create unbreakable passwords with strength meter – copy & use instantly." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Password Generator – Strong & Random" />
        <meta name="twitter:description" content="Generate secure passwords with real-time strength feedback – private & fast." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Password Generator",
            url: "https://generatorpromptai.com/tools/password-generator",
            description: "Free online tool to generate strong, random, secure passwords with customizable options and strength rating.",
            applicationCategory: "SecurityApplication",
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
            Password Generator
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Create strong, random, secure passwords • Real-time strength meter
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="p-6 md:p-10">
              {/* Generated Password Display */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Secure Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="w-full px-5 py-5 text-2xl font-mono border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 pr-24"
                    placeholder="Click Generate to create password"
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                    <button
                      onClick={toggleShowPassword}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>

                    <button
                      onClick={copyToClipboard}
                      disabled={!password}
                      className="text-sky-600 hover:text-sky-800 disabled:opacity-40 p-1"
                      title="Copy password to clipboard"
                      aria-label="Copy password"
                    >
                      {copied ? (
                        <CheckCircle2 size={22} className="text-green-600" />
                      ) : (
                        <Copy size={22} />
                      )}
                    </button>
                  </div>
                </div>

                {password && strength.label && (
                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Strength:</span>
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-white text-xs ${
                          strength.color === "green" ? "bg-green-600" :
                          strength.color === "emerald" ? "bg-emerald-600" :
                          strength.color === "yellow" ? "bg-yellow-600" : "bg-red-600"
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>

                    <span className="text-gray-600">
                      Length: <strong>{password.length}</strong> characters
                    </span>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Length: <strong>{length}</strong> characters
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className="w-full accent-sky-600"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                        className="h-5 w-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                      />
                      <span className="text-gray-700">Uppercase Letters (A-Z)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        className="h-5 w-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                      />
                      <span className="text-gray-700">Lowercase Letters (a-z)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="h-5 w-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                      />
                      <span className="text-gray-700">Numbers (0-9)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        className="h-5 w-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                      />
                      <span className="text-gray-700">Symbols (!@#$%^&* etc.)</span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-gray-500 italic">
                      Uses browser's secure <code>crypto.getRandomValues()</code> for true randomness.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={generatePassword}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-medium py-4 rounded-lg transition text-lg flex items-center justify-center gap-2 shadow-md"
                >
                  <RefreshCw size={22} />
                  Generate Secure Password
                </button>

                <button
                  onClick={() => {
                    setPassword("");
                    setStrength({ label: "", score: 0, color: "gray" });
                    setCopied(false);
                  }}
                  className="px-10 py-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium text-lg"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Online Password Generator – Strong, Random & Secure
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Create strong, truly random passwords instantly with customizable length and character types. Uses the browser's secure <code>crypto.getRandomValues()</code> API — far more secure than Math.random(). Real-time strength meter shows how secure your password is. Perfect for new accounts, Wi-Fi, apps, crypto wallets, or any login.
              </p>
              <p>
                Built in Karachi – 100% free, no signup, no data stored. Ideal for Pakistani users who want quick, safe passwords for online security. Copy with one click and use immediately.
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Password Generator
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Adjust password length with the slider (8–64 characters recommended).</li>
                <li>Check/uncheck boxes for uppercase, lowercase, numbers, and symbols (at least one type required).</li>
                <li>Click <strong>Generate Secure Password</strong> – a strong random password appears.</li>
                <li>Click the eye icon to show/hide the password.</li>
                <li>Check the real-time strength rating (Weak → Very Strong).</li>
                <li>Click the copy icon to copy to clipboard instantly.</li>
                <li>Click <strong>Clear</strong> to generate a new one.</li>
                <li>Tip: Use 16+ characters with all types enabled for maximum security. Consider a password manager.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Security & Utility Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/password-strength-checker"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Password Strength Checker
                </h3>
                <p className="text-gray-600 text-sm">
                  Test how strong & crack-resistant your password is.
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
                  Generate random numbers for OTPs, lotteries, testing.
                </p>
              </Link>

              <Link
                to="/tools/word-counter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Word Counter
                </h3>
                <p className="text-gray-600 text-sm">
                  Count words, characters & reading time instantly.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PasswordGenerator;