import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import 'react-image-crop/dist/ReactCrop.css';


// Pages
const Home = lazy(() => import("./pages/Home"));
const AllTools = lazy(() => import("./pages/AllTools"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Blog = lazy(() => import("./pages/blog"));

//Components
import ScrollToTop from "./components/ScrollToTop";


// Blog
const BlogPostClaudeVsChatGPT = lazy(() =>
  import("./blogs/BlogPostClaudeVsChatGPT")
);

const BlogPostCompressImage = lazy(() =>
  import("./blogs/BlogPostCompressImage")
);

const BlogPostJpegVsPng = lazy(() =>
  import("./blogs/BlogPostJpegVsPng")
);


// Tools (lazy)
const AIAgent = lazy(() => import("./tools/AIAgent"));
const ImageCompressor = lazy(() => import("./tools/ImageCompressor"));
const ImageResizer = lazy(() => import("./tools/ImageResizer"));
const ImageCropper = lazy(() => import("./tools/ImageCropper"));
const ImageConverter = lazy(() => import("./tools/ImageConverter"));
const QRCodeGenerator = lazy(() => import("./tools/QRCodeGenerator"));
const PasswordGenerator = lazy(() => import("./tools/PasswordGenerator"));
const JsonFormatter = lazy(() => import("./tools/JsonFormatter"));
const WordCounter = lazy(() => import("./tools/WordCounter"));
const YoutubeThumbnailDownloader = lazy(() => import("./tools/YoutubeThumbnailDownloader"));
const AgeCalculator = lazy(() => import("./tools/AgeCalculator"));
const CurrencyConverter = lazy(() => import("./tools/CurrencyConverter"));
const TimeZoneConverter = lazy(() => import("./tools/TimeZoneConverter"));
const PercentageCalculator = lazy(() => import("./tools/PercentageCalculator"));
const HashtagGenerator = lazy(() => import("./tools/HashtagGenerator"));
const LoremIpsumGenerator = lazy(() => import("./tools/LoremIpsumGenerator"));
const FakeDataGenerator = lazy(() => import("./tools/FakeDataGenerator"));
const SitemapGenerator = lazy(() => import("./tools/SitemapGenerator"));
const EmojiPicker = lazy(() => import("./tools/EmojiPicker"));
const RandomNumberGenerator = lazy(() => import("./tools/RandomNumberGenerator"));
const WatermarkRemover = lazy(() => import("./tools/WatermarkRemover"));
const ImageToText = lazy(() => import("./tools/ImageToText"));
const PdfToWord = lazy(() => import("./tools/PdfToWord"));
const PdfCompressor = lazy(() => import("./tools/PdfCompressor"));
const JsonValidator = lazy(() => import("./tools/JsonValidator"));
const ChatGPTPrompt = lazy(() => import("./tools/ChatGPTPrompt"));
const ClaudePrompt = lazy(() => import("./tools/ClaudePrompt"));
const MidjourneyPrompt = lazy(() => import("./tools/MidjourneyPrompt"));
const YoutubePrompt = lazy(() => import("./tools/YoutubePrompt"));
const TikTokVideoDownloader = lazy(() => import("./tools/TikTokVideoDownloader"));
const InstagramVideoDownloader = lazy(() => import("./tools/InstagramVideoDownloader"));
const CaseConverter = lazy(() => import("./tools/CaseConverter"));
const RemoveDuplicateLines = lazy(() => import("./tools/RemoveDuplicateLines"));
const EmailValidator = lazy(() => import("./tools/EmailValidator"));
const UppercaseToLowercase = lazy(() => import("./tools/UppercaseToLowercase"));
const UnixTimestamp = lazy(() => import("./tools/UnixTimestamp"));
const Base64Encoder = lazy(() => import("./tools/Base64Encoder"));
const URLEncoder = lazy(() => import("./tools/URLEncoder"));
const UUIDGenerator = lazy(() => import("./tools/UUIDGenerator"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/pages/all-tools" element={<AllTools />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/blog" element={<Blog />} />

          {/* Blog */}
          <Route
            path="/blog/claude-vs-chatgpt-which-is-better"
            element={<BlogPostClaudeVsChatGPT />}
          />
          <Route path="/blog/jpeg-vs-png-complete-comparison-guide" element={<BlogPostJpegVsPng />} />
          <Route path="/blog/compress-image-to-100kb-online-free" element={<BlogPostCompressImage />} />

          {/* Tools */}
          <Route path="/tools/ai-agent" element={<AIAgent />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
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
          <Route path="/tools/json-validator" element={<JsonValidator />} />
          <Route path="/tools/chatgpt-prompt-generator" element={<ChatGPTPrompt />} />
          <Route path="/tools/claude-prompt-generator" element={<ClaudePrompt />} />
          <Route path="/tools/youtube-script-prompt-generator" element={<YoutubePrompt />} />
          <Route path="/tools/midjourney-prompt-generator" element={<MidjourneyPrompt />} />
          <Route path="/tools/tiktok-video-downloader" element={<TikTokVideoDownloader />} />
          <Route path="/tools/instagram-video-downloader" element={<InstagramVideoDownloader />} />
          <Route path="/tools/case-converter" element={<CaseConverter />} />
          <Route path="/tools/remove-duplicate-lines" element={<RemoveDuplicateLines />} />
          <Route path="/tools/email-validator" element={<EmailValidator />} />
          <Route path="/tools/uppercase-to-lowercase" element={<UppercaseToLowercase />} />
          <Route path="/tools/unix-timestamp" element={<UnixTimestamp />} />
          <Route path="/tools/base64-encode" element={<Base64Encoder />} />
          <Route path="/tools/url-encoder" element={<URLEncoder />} />
          <Route path="/tools/uuid-generator" element={<UUIDGenerator />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}