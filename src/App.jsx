// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import AllTools from "./pages/AllTools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Tools
import AIAgent from "./tools/AIAgent"

import ImageCompressor from "./tools/ImageCompressor";
import ImageResizer from "./tools/ImageResizer";
import ImageCropper from "./tools/ImageCropper";
import ImageConverter from "./tools/ImageConverter";
import QRCodeGenerator from "./tools/QRCodeGenerator";
import PasswordGenerator from "./tools/PasswordGenerator";
import JsonFormatter from "./tools/JsonFormatter";
import WordCounter from "./tools/WordCounter";
import YoutubeThumbnailDownloader from "./tools/YoutubeThumbnailDownloader";
import AgeCalculator from "./tools/AgeCalculator";
import CurrencyConverter from "./tools/CurrencyConverter";
import TimeZoneConverter from "./tools/TimeZoneConverter";
import PercentageCalculator from "./tools/PercentageCalculator";
import HashtagGenerator from "./tools/HashtagGenerator";
import LoremIpsumGenerator from "./tools/LoremIpsumGenerator";
import FakeDataGenerator from "./tools/FakeDataGenerator";
import SitemapGenerator from "./tools/SitemapGenerator";
import EmojiPicker from "./tools/EmojiPicker";
import RandomNumberGenerator from "./tools/RandomNumberGenerator";
import WatermarkRemover from "./tools/WatermarkRemover";
import ImageToText from "./tools/ImageToText";
import PdfToWord from "./tools/PdfToWord";
import PdfCompressor from "./tools/PdfCompressor";
import JsonValidator from "./tools/JsonValidator";
import ChatGPTPrompt from "./tools/ChatGPTPrompt"
import ClaudePrompt from "./tools/ClaudePrompt"
import MidjourneyPrompt from "./tools/MidjourneyPrompt"
import YoutubePrompt from "./tools/YoutubePrompt";
import 'react-image-crop/dist/ReactCrop.css';


// blogs


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Home />} />
        <Route path="/pages/all-tools" element={<AllTools />} />

        {/* Tools */}
        <Route path="/tools/ai-agent" element={<AIAgent />} />
        <Route path="/tools/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/chatgpt-prompt-generator" element={<ChatGPTPrompt />} />
        <Route path="/tools/claude-prompt-generator" element={<ClaudePrompt />} />
        <Route path="/tools/youtube-script-prompt-generator" element={<YoutubePrompt />} />
        <Route path="/tools/midjourney-prompt-generator" element={<MidjourneyPrompt />} />
        <Route path="/tools/json-validator" element={<JsonValidator />} />
        <Route path="/tools/image-resizer" element={<ImageResizer />} />
        <Route path="/tools/image-cropper" element={<ImageCropper />} />
        <Route path="/tools/image-converter" element={<ImageConverter />} />
        <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
        <Route path="/tools/password-generator" element={<PasswordGenerator />} />
        <Route path="/tools/json-formatter" element={<JsonFormatter />} />
        <Route path="/tools/word-counter" element={<WordCounter />} />
        <Route path="/tools/youtube-thumbnail-downloader" element={<YoutubeThumbnailDownloader />} />
        <Route path="/tools/age-calculator" element={<AgeCalculator />} />
        <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
        <Route path="/tools/time-zone-converter" element={<TimeZoneConverter />} />
        <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
        <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
        <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
        <Route path="/tools/fake-data-generator" element={<FakeDataGenerator />} />
        <Route path="/tools/sitemap-generator" element={<SitemapGenerator />} />
        <Route path="/tools/emoji-picker" element={<EmojiPicker />} />
        <Route path="/tools/random-number-generator" element={<RandomNumberGenerator />} />
        <Route path="/tools/watermark-remover" element={<WatermarkRemover />} />
        <Route path="/tools/image-to-text" element={<ImageToText />} />
        <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
        <Route path="/tools/pdf-compressor" element={<PdfCompressor />} />

        {/* Static pages – clean short paths (this fixes /about error) */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />


        {/* 404 - Catch all unmatched routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
              <div className="text-center p-8">
                <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
                <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-8">
                  Page not found
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;