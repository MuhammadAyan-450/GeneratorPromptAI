// pages/Contact.jsx
import React from "react";

import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Contact = () => {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8">
            Contact Generator PromptAI
          </h1>

          <div className="prose prose-lg mx-auto text-gray-700 text-center">
            <p className="text-xl mb-8">
              Got questions? Found a bug? Have a tool idea? Just want to say thanks?  
              I read every message personally.
            </p>

            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 mt-10">
              <h2 className="text-2xl font-bold mb-6">Send me an email</h2>
              <p className="text-lg mb-8">
                Best and fastest way to reach me:
              </p>
              <a
                href="mailto:ayan@gettolfiya.com"
                className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-10 py-4 rounded-xl font-medium text-xl transition shadow-md mb-8"
              >
                generatorpromptai@gmail.com
              </a>

              <p className="text-gray-600">
                Usually reply within 24 hours (often much faster).  
                Looking forward to hearing from you!
              </p>
            </div>

            <p className="mt-12 text-gray-500 text-sm">
              Generator PromptAI is a one-person project made with love in Karachi, Pakistan.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Contact;