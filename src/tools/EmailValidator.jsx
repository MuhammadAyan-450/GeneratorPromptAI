import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { RefreshCw, MailCheck, MailX, Globe, AtSign, Home, ChevronDown } from "lucide-react";

const EmailValidator = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null); 
  const [charCount, setCharCount] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setCharCount(email.length);
  }, [email]);

  const validateEmail = () => {
    if (!email.trim()) {
      setResult({ isValid: false, message: "Please enter an email address." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email.trim());

    if (isValid) {
      const [name, domain] = email.trim().split("@");
      setResult({
        isValid: true,
        message: "Valid Email Format",
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

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Check if Email Format is Valid Online Without Sending",
    "url": "https://www.generatorpromptai.com/tools/email-validator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free email syntax checker tool. Verify email address format and structure for HTML forms instantly in your browser without sending an email.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Email Validator", "item": "https://www.generatorpromptai.com/tools/email-validator" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to check if email format is valid online without sending an email?",
        "acceptedAnswer": { "@type": "Answer", "text": "Paste the email address into our tool and click 'Validate'. It uses standard regex pattern matching to instantly check the syntax and format of the email entirely in your browser, without sending or receiving any actual emails." }
      },
      {
        "@type": "Question",
        "name": "Does this email syntax checker detect missing @ symbol or domain?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our tool checks for the presence and correct placement of the '@' symbol, ensures a valid domain extension is present (like .com), and flags any invalid characters like spaces or illegal symbols." }
      },
      {
        "@type": "Question",
        "name": "Can I use this regex email format checker for HTML forms?",
        "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. The validation logic used by this tool is based on standard regex patterns that you can easily copy and implement in JavaScript, HTML5 (using the 'type=email' attribute), PHP, Python, or any other backend language for your website forms." }
      },
      {
        "@type": "Question",
        "name": "Is it safe to enter real email addresses in this tool?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes, 100% safe. All validation happens locally inside your web browser. We do not store, process, or transmit your email addresses to any external server." }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Title targeting long-tails */}
        <title>Check if Email Format is Valid Online – Email Syntax Checker for Forms</title>
        
        <meta
          name="description"
          content="Verify email address format and structure online without sending an email. Check for missing @ symbols, invalid domains, and bad characters instantly. Free email syntax checker for developers and HTML forms."
        />
        
        {/* Low comp keywords */}
        <meta
          name="keywords"
          content="how to check if email format is valid online, email syntax checker for html forms, verify email address format without sending email, check email address for invalid characters online, regex email format checker tool, is this email format valid test, email structure validator free"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/email-validator" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph (No emojis) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Check if Email Format is Valid Online – Email Syntax Checker" />
        <meta property="og:description" content="Verify email address format and structure instantly. Check for missing @, invalid domains, and bad characters. Free online tool." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/email-validator" />

        {/* Twitter Card (No emojis) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Email Syntax Checker – Verify Email Format Without Sending" />
        <meta name="twitter:description" content="Check if an email address format is valid instantly. Safe, private, browser-based validation tool." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb Only ── */}
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
              <li><span className="text-gray-900 font-semibold">Email Validator</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-4xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-10 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
              <AtSign className="text-sky-600" size={28} />
            </div>
            {/* H1 targeting exact match long-tails */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Check if Email Format is Valid Online –{" "}
              <span className="text-sky-600">Syntax Checker for Forms</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
              <strong>Verify email address format</strong> and structure without sending an email. Detect missing @ symbols, invalid domains, and bad characters instantly.
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
                Validate Format
              </button>
            </div>

            {/* Stats Bar */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6 flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Length</span>
              <span className="text-sm font-bold text-gray-700">{charCount} characters</span>
            </div>

            {/* Result Display */}
            {result && (
              <div className={`rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center gap-6 ${result.isValid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
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

          {/* ── SEO Content 1 ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "verify email address format without sending email" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verify Email Address Format Without Sending an Email
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our <strong>Email Syntax Checker</strong> allows you to test if an email address is formatted correctly without actually sending a message. It uses standard regex pattern matching to instantly verify the structure of the email, ensuring it has a valid username, "@' symbol, and proper domain extension.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This is particularly useful for developers building <strong>HTML forms</strong> who need to validate user inputs on the client side, or for marketers cleaning up mailing lists to remove typos and fake emails before sending out campaigns.
            </p>
          </section>

          {/* ── How to Use Section ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "how to check if email format is valid online" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Check if Email Format is Valid Online
            </h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3 text-base">
              <li>Paste or type the email address into the input box above.</li>
              <li>Click the <strong>"Validate Format"</strong> button (or press Enter).</li>
              <li>The tool will instantly check for a valid <strong>@</strong> symbol, proper domain structure, and legal characters.</li>
              <li>If valid, it will extract and display the <strong>username</strong> and <strong>domain provider</strong>.</li>
              <li>If invalid, it will flag the error so you can fix the formatting.</li>
            </ol>
          </section>

          {/* ── Features Section ── */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            {/* H2 targeting: "check email address for invalid characters online" */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Check Email Address for Invalid Characters & Missing Domains
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Instant Syntax Check", desc: "Verifies the email against standard regex rules in milliseconds. No server delays." },
                { title: "Detects Missing @ Symbol", desc: "Flags emails that are missing the crucial '@' separator between username and domain." },
                { title: "Domain Validator", desc: "Checks if the domain part of the email (e.g., gmail.com) is structured correctly." },
                { title: "100% Private & Browser-Based", desc: "Your emails are never sent to a server. The entire validation happens locally in your browser." }
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
              Email Validator – Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How to check if email format is valid online without sending an email?",
                  a: "Paste the email address into our tool and click 'Validate'. It uses standard regex pattern matching to instantly check the syntax and format of the email entirely in your browser, without sending or receiving any actual emails."
                },
                {
                  q: "Does this email syntax checker detect missing @ symbol or domain?",
                  a: "Yes. Our tool checks for the presence and correct placement of the '@' symbol, ensures a valid domain extension is present (like .com), and flags any invalid characters like spaces or illegal symbols."
                },
                {
                  q: "Can I use this regex email format checker for HTML forms?",
                  a: "Absolutely. The validation logic used by this tool is based on standard regex patterns that you can easily copy and implement in JavaScript, HTML5 (using the 'type=email' attribute), PHP, Python, or any other backend language for your website forms."
                },
                {
                  q: "Is it safe to enter real email addresses in this tool?",
                  a: "Yes, 100% safe. All validation happens locally inside your web browser. We do not store, process, or transmit your email addresses to any external server."
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
          </section>

          {/* ── Related Tools (Fixed broken links) ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Free Developer & Text Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/url-encoder", title: "URL Encoder & Decoder", desc: "Encode and decode URLs into percent-encoded format for safe web requests." },
                { to: "/tools/remove-duplicate-lines", title: "Remove Duplicate Lines", desc: "Clean up text lists by removing duplicate entries and blank lines instantly." },
                { to: "/tools/case-converter", title: "Case Converter", desc: "Convert text to UPPERCASE, lowercase, Title Case, and camelCase easily." }
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

export default EmailValidator;