import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, RefreshCw, MailCheck, MailX, Globe, AtSign } from "lucide-react";

const EmailValidator = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null); // { isValid: boolean, message: string, details: object }
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(email.length);
  }, [email]);

  // --- Logic ---

  const validateEmail = () => {
    if (!email.trim()) {
      setResult({ isValid: false, message: "Please enter an email address." });
      return;
    }

    // Basic Regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email.trim());

    if (isValid) {
      const [name, domain] = email.trim().split("@");
      setResult({
        isValid: true,
        message: "Valid Email Address",
        details: {
          username: name,
          provider: domain,
          type: domain.includes(".") ? "Standard" : "Likely Local"
        }
      });
    } else {
      setResult({
        isValid: false,
        message: "Invalid Email Format",
        details: null
      });
    }
  };

  const handleClear = () => {
    setEmail("");
    setResult(null);
  };

  // --- Schema Data ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Email Validator",
    url: "https://www.generatorpromptai.com/tools/email-validator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    creator: {
      "@type": "Organization",
      name: "GeneratorPromptAI",
      url: "https://www.generatorpromptai.com"
    },
    description: "Free online Email Validator. Check if an email address is valid and formatted correctly instantly.",
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
        name: "How accurate is this email validator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our tool uses standard regex patterns to check the syntax of the email. It confirms if the format is correct, but it cannot verify if the inbox actually exists without sending an email."
        }
      },
      {
        "@type": "Question",
        name: "Is my email stored?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The validation happens entirely in your browser. We do not save or transmit any email addresses you enter."
        }
      },
      {
        "@type": "Question",
        name: "What makes an email invalid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common reasons include missing the '@' symbol, missing the domain extension (like .com), or containing spaces or illegal characters."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Free Email Validator - Check Email Format Instantly</title>
        <meta
          name="description"
          content="Free online email validator tool. Check if an email address is valid and properly formatted. Fast, secure, and no sign-up required."
        />
        <meta
          name="keywords"
          content="email validator, check email format, verify email address, email syntax checker, online email tool"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/email-validator" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Email Validator - Check Format Online" />
        <meta property="og:description" content="Verify email addresses instantly with our free online tool. Secure and fast." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/email-validator" />
        <meta property="og:image" content="https://www.generatorpromptai.com/og-email-validator.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Email Validator - Free Online Tool" />
        <meta name="twitter:description" content="Check if an email address is valid instantly." />
        <meta name="twitter:image" content="https://www.generatorpromptai.com/og-email-validator.png" />

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
              <AtSign className="text-sky-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Email Validator
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Check if an email address is valid and correctly formatted. Instant verification, secure and free.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Email Address
            </label>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 text-lg"
                placeholder="example@domain.com"
                onKeyDown={(e) => e.key === 'Enter' && validateEmail()}
              />
              <button
                onClick={validateEmail}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 transition-all text-white font-semibold px-8 py-3 rounded-xl whitespace-nowrap"
              >
                Validate
              </button>
            </div>

            {/* Stats Bar (Visual Balance) */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6 flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Length</span>
                <span className="text-sm font-bold text-gray-700">{charCount} characters</span>
            </div>

            {/* Result Display */}
            {result && (
              <div className={`rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up ${
                result.isValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}>
                <div className={`p-4 rounded-full ${result.isValid ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                  {result.isValid ? <MailCheck size={40} /> : <MailX size={40} />}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className={`text-2xl font-bold mb-1 ${result.isValid ? "text-green-800" : "text-red-800"}`}>
                    {result.message}
                  </h2>
                  {result.isValid && result.details && (
                    <div className="text-sm text-green-700 space-y-1 mt-2">
                      <p><strong>Username:</strong> {result.details.username}</p>
                      <p className="flex items-center justify-center md:justify-start gap-1">
                        <strong>Provider:</strong> <Globe size={14} /> {result.details.provider}
                      </p>
                    </div>
                  )}
                  {!result.isValid && (
                    <p className="text-sm text-red-600 mt-1">Please check the syntax (e.g., user@domain.com)</p>
                  )}
                </div>
              </div>
            )}

            {/* Utility Actions */}
            <div className="flex justify-center">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all"
              >
                <RefreshCw size={16} />
                Clear
              </button>
            </div>
          </div>

          {/* SEO Content Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Email Validator
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our <strong>Email Validator</strong> is a simple yet powerful tool for checking the syntax of email addresses. Whether you are cleaning a mailing list or verifying a user input on a form, this tool helps you identify formatting errors instantly.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              It checks for the presence of an "@" symbol, a valid domain name, and proper characters. Note that this is a <strong>syntax checker</strong>. It confirms that the email *looks* right, but it does not ping the mail server to see if the inbox actually exists.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Common Email Errors Detected:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Missing the "@" symbol (e.g., "userdomain.com").</li>
              <li>Missing the domain extension (e.g., "user@domain").</li>
              <li>Invalid characters (e.g., spaces or special symbols).</li>
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
                  q: "Does this tool check if the email exists?",
                  a: "No, it only checks if the format is valid. To check if the email exists, you would need to send a verification email."
                },
                {
                  q: "Is it safe to enter real emails?",
                  a: "Yes. All processing is done locally in your browser. We do not store or send your data anywhere."
                },
                {
                  q: "Can I use this for my website forms?",
                  a: "You can use the logic (Regex) provided in our tool to implement client-side validation on your own website."
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
                { to: "/tools/credit-card-validator", title: "Credit Card Validator", desc: "Check validity of credit card numbers using the Luhn algorithm." },
                { to: "/tools/password-generator", title: "Password Generator", desc: "Create strong, secure passwords instantly." },
                { to: "/tools/uuid-generator", title: "UUID Generator", desc: "Generate unique Universally Unique Identifiers." },
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

export default EmailValidator;