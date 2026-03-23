// pages/TermsOfService.jsx
import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsOfService = () => {
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
            Terms of Service
          </h1>

          <p className="text-center text-gray-600 mb-12">
            Last updated: March 2026
          </p>

          <p>
            Welcome to Gettolfiya. By using any tool on this website you agree to these simple terms.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6">1. Free & No Warranty</h2>
          <p>
            All tools on Gettolfiya are provided completely free of charge. We offer them "as is" without any warranty — express or implied. Use them at your own risk.
          </p>

          <h2 className="text-3xl font-bold mt-10 mb-6">2. No Data Collection</h2>
          <p>
            Most tools run entirely in your browser. We don't store, collect or transmit any files or personal information. Read our Privacy Policy for full details.
          </p>

          <h2 className="text-3xl font-bold mt-10 mb-6">3. Acceptable Use</h2>
          <p>
            You may not use Gettolfiya tools for anything illegal, harmful, or to violate someone else's rights. Don't try to abuse or overload the site.
          </p>

          <h2 className="text-3xl font-bold mt-10 mb-6">4. Intellectual Property</h2>
          <p>
            The tools, code, and design of Gettolfiya belong to Ayan. You can use the output of the tools freely, but don't copy/re-sell the website itself.
          </p>

          <h2 className="text-3xl font-bold mt-10 mb-6">5. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use after changes means you accept them.
          </p>

          <p className="mt-12 text-center text-gray-600">
            Questions? Just email <a href="mailto:ayan@gettolfiya.com" className="text-sky-600 hover:underline">ayan@gettolfiya.com</a><br/>
            Made with honesty in Karachi, Pakistan.
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default TermsOfService;