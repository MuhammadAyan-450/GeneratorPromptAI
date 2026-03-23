// data/tools.js

// Flat list of all tools (used for All Tools page, search, etc.)
export const tools = [
  {
    name: "Image Compressor",
    path: "/tools/image-compressor",
    description: "Reduce image file size without noticeable quality loss – fast & private.",
    category: "Image Tools"
  },
  {
    name: "Image Resizer",
    path: "/tools/image-resizer",
    description: "Resize images to exact dimensions while keeping aspect ratio locked.",
    category: "Image Tools"
  },
  {
    name: "Image Cropper",
    path: "/tools/image-cropper",
    description: "Crop images precisely with drag-and-drop and live preview.",
    category: "Image Tools"
  },
  {
    name: "Image Converter",
    path: "/tools/image-converter",
    description: "Convert between JPG, PNG, WebP formats with quality control.",
    category: "Image Tools"
  },
  {
    name: "QR Code Generator",
    path: "/tools/qr-code-generator",
    description: "Create custom QR codes for URLs, text, WiFi – add colors & sizes.",
    category: "Generators"
  },
  {
    name: "Password Generator",
    path: "/tools/password-generator",
    description: "Generate strong, secure random passwords with full customization.",
    category: "Generators"
  },
  {
    name: "JSON Formatter & Validator",
    path: "/tools/json-formatter",
    description: "Beautify, minify, validate and format JSON instantly with error highlighting.",
    category: "Text & Code Tools"
  },
  {
    name: "Word Counter",
    path: "/tools/word-counter",
    description: "Count words, characters, sentences, paragraphs, reading time & keyword density.",
    category: "Text & Code Tools"
  },
  {
    name: "YouTube Thumbnail Downloader",
    path: "/tools/youtube-thumbnail-downloader",
    description: "Download thumbnails from any YouTube video in multiple qualities instantly.",
    category: "Video & Media Tools"  // or "Generators" / new category
  },
  {
    name: "Age Calculator",
    path: "/tools/age-calculator",
    description: "Calculate exact age in years, months, days, plus reading time to next birthday.",
    category: "Calculators"
  },
  {
    name: "Currency Converter",
    path: "/tools/currency-converter",
    description: "Convert between currencies with real-time exchange rates – supports 170+ currencies.",
    category: "Calculators"
  },
  {
    name: "Time Zone Converter",
    path: "/tools/time-zone-converter",
    description: "Convert time between cities and time zones with current local time display.",
    category: "Calculators"
  },
  {
    name: "Percentage Calculator",
    path: "/tools/percentage-calculator",
    description: "Calculate percentages, changes, increases, decreases, and reverse percentages instantly.",
    category: "Calculators"
  },
  {
    name: "Hashtag Generator",
    path: "/tools/hashtag-generator",
    description: "Generate relevant hashtags for Instagram, TikTok, X – based on your keywords or topic.",
    category: "Social Media Tools"  // or "Generators"
  },
  {
    name: "Lorem Ipsum Generator",
    path: "/tools/lorem-ipsum-generator",
    description: "Generate placeholder dummy text (Lorem Ipsum) with customizable paragraphs, sentences, and HTML.",
    category: "Text & Code Tools"
  },
  {
    name: "Fake Data Generator",
    path: "/tools/fake-data-generator",
    description: "Generate realistic dummy data: names, emails, phones, addresses, ages – perfect for testing & mockups.",
    category: "Developers & Testing"
  },
  {
    name: "Sitemap Generator",
    path: "/tools/sitemap-generator",
    description: "Generate XML sitemap from list of URLs – with changefreq and priority options.",
    category: "SEO & Web Tools"
  },
  {
    name: "Emoji Picker",
    path: "/tools/emoji-picker",
    description: "Search, copy, and collect emojis for chats, posts, and docs – with recent history.",
    category: "Social Media Tools"
  },
  {
    name: "Random Number Generator",
    path: "/tools/random-number-generator",
    description: "Generate random numbers, dice rolls, lottery picks – with custom range and unique option.",
    category: "Generators"
  },
  {
    name: "Watermark Remover",
    path: "/tools/watermark-remover",
    description: "Remove simple watermarks and logos from images using color-based inpainting.",
    category: "Image Tools"
  },
  {
    name: "Image to Text (OCR)",
    path: "/tools/image-to-text",
    description: "Extract text from images, screenshots, scanned docs – supports English & Urdu.",
    category: "Image Tools"
  },
  {
    name: "PDF to Word",
    path: "/tools/pdf-to-word",
    description: "Extract text from PDF files and convert to editable Word (.docx) document.",
    category: "File Converters"
  },
  {
    name: "PDF Compressor",
    path: "/tools/pdf-compressor",
    description: "Reduce PDF file size by compressing images and streams – all in-browser.",
    category: "File Converters"
  },
  {
    name: "JSON Validator",
    path: "/tools/json-validator",
    description: "Validate JSON instantly – shows detailed errors with line & column info.",
    category: "Text & Code Tools"
  },
  {
    name: "ChatGPT Prompt Generator",
    path: "/tools/chatgpt-prompt-generator",
    description: "Generate powerful prompts optimized for ChatGPT – perfect for writing, coding, and research.",
    category: "AI Tools"
  },
  {
    name: "Claude Prompt Generator",
    path: "/tools/claude-prompt-generator",
    description: "Create high-quality prompts designed specifically for Claude AI responses.",
    category: "AI Tools"
  },
  {
    name: "Youtube Prompt Generator",
    path: "/tools/youtube-script-prompt-generator",
    description: "Generate prompts optimized for youtube to get better answers.",
    category: "AI Tools"
  },
  {
    name: "Midjourney Prompt Generator",
    path: "/tools/midjourney-prompt-generator",
    description: "Create detailed prompts for Midjourney AI images including styles and lighting.",
    category: "AI Tools"
  },
  {
    name: "AI Prompt Improver",
    path: "/tools/prompt-improver",
    description: "Improve and optimize AI prompts to generate more accurate and creative results.",
    category: "AI Tools"
  }
  // ← Add new tools here in the same format when you build them
];

// Automatically group tools by category for Navbar dropdowns
export const toolCategories = [
  {
    category: "AI Tools",
    tools: tools.filter(t => t.category === "AI Tools")
  },
  {
    category: "SEO & Web Tools",
    tools: tools.filter(t => t.category === "SEO & Web Tools")
  },
  {
    category: "Calculators",
    tools: tools.filter(t => t.category === "Calculators")
  },
  {
    category: "Social Media Tools",
    tools: tools.filter(t => t.category === "Social Media Tools")
  },
  {
    category: "Developers & Testing",
    tools: tools.filter(t => t.category === "Developers & Testing")
  },
  {
    category: "File Converters",
    tools: tools.filter(t => t.category === "File Converters")
  },
  {
    category: "Image Tools",
    tools: tools.filter(t => t.category === "Image Tools")
  },
  {
    category: "Generators",
    tools: tools.filter(t => t.category === "Generators")
  },
  {
    category: "Text & Code Tools",
    tools: tools.filter(t => t.category === "Text & Code Tools")
  }
  // Add more categories here as you create new groups
];

export default tools;