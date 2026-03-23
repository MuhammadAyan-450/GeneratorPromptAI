// pages/About.jsx
import React from "react";

import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
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
            About Generator PromptAI
          </h1>

          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="lead text-xl mb-8">
              Hi I am Ayan. The person who made Generator PromptAI. I made this website because I was fed up with tools being hidden behind things you have to sign up for or ads or subscriptions that cost a lot of money.
            </p>

            <p>
              Generator PromptAI started as a project I worked on in my room in Karachi, Pakistan. I wanted to make something that would be useful for students, people who work on their developers, small business owners and anyone who just needs a tool that is easy to use and does not give them any trouble.            </p>

            <p>
              Today Generator PromptAI has than 20 tools that you can use for free on the internet. Things like a tool to make images smaller a QR code maker, a PDF changer, a password maker, a JSON fixer and a lot more. Every single tool on Generator PromptAI works in your browser. None of your stuff is sent to any server. Your files and information stay private and safe.            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Why people, like Generator PromptAI</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>It is 100% free. There are no costs, no special plans that you have to pay for</li>
              <li>You do not have to sign up. You can use any tool right away</li>
              <li>It was made in Pakistan. I built it with care in Karachi</li>
              <li>It works on your phone, tablet and computer</li>
              <li>Fast and lightweight — no heavy software needed</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6">Our promise to you</h2>
            <p>
              Generator PromptAI will always be free. We will keep adding tools every month. We will never sell your information never show you annoying things and never ask for your email unless you want to get in touch with us.            </p>

            <p className="mt-8">
              If you have any ideas found a problem. Just want to say hello. Feel free to contact us. I personally read every message that people send to Generator PromptAI.            </p>

            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-10 py-4 rounded-xl font-medium text-lg transition shadow-md"
              >
                Contact Generator PromptAI →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;