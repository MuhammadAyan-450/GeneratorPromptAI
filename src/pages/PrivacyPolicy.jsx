// pages/PrivacyPolicy.jsx
import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const PrivacyPolicy = () => {
  return (
    <>
    <Navbar/>

      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Privacy Policy
          </h1>

          <p className="text-center text-gray-600 mb-12">
            Last updated: March 2026
          </p>

          <p>
            At Generator PromptAI we take your privacy very seriously. Here's the simple truth:
          </p>

          <ul className="list-disc pl-6 space-y-4">
            <li>We don't collect any personal information from you</li>
            <li>We don't use tracking cookies or analytics that identify you</li>
            <li>We don't store any files you upload — everything happens in your browser only</li>
            <li>We don't sell, share or give your data to anyone (because we don't have it)</li>
            <li>All tools on Gettolfiya are 100% client-side — no data leaves your device</li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6">What we do collect</h2>
          <p>
            Nothing that can identify you. We may see anonymous usage stats (like how many people use the image compressor), but that's it — no IP addresses, no emails, no names.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6">Third-party services</h2>
          <p>
            Some tools use third-party libraries (like Tesseract.js for OCR), but they also run completely in your browser. No data is sent to external servers unless the tool clearly says so (e.g. currency converter fetches public exchange rates).
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6">Changes to this policy</h2>
          <p>
            If we ever make any change (which is unlikely), we will update this page and mention the date. But again — we don't collect anything personal, so changes won't affect your privacy.
          </p>

          <p className="mt-12 text-center text-gray-600">
            Made with honesty in Karachi, Pakistan.<br />
            If you have any questions — just email <a href="mailto:generatorpromptai@gmail.com" className="text-sky-600 hover:underline">generatorpromptai@gmail.com</a>
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PrivacyPolicy;