export const BLOG_POSTS = [
  {
    id: 1,
    slug: "claude-vs-chatgpt-which-is-better",
    title: "Claude vs ChatGPT in 2026: Which AI is Actually Better?",
    excerpt:
      "We tested both AI models across 20 real-world tasks — writing, coding, analysis, creativity.",
    category: "AI Comparison",
    tag: "Claude",
    readTime: 12,
    date: "April 5, 2026",
    dateISO: "2026-04-05",
    featured: true,
    image: null,
    color: "from-orange-500 to-red-500",
    emoji: "⚔️",
  },
  {
    id: 2,
    slug: "compress-image-to-100kb-online-free",
    title: "Compress Image to 100KB Online Free (Fast & Easy Guide 2026)",
    excerpt:
      "Learn how to compress images to 100KB online for free without losing quality. Step-by-step guide with best tools and tips.",
    category: "Image Tools",
    tag: "Image Compression",
    readTime: 8,
    date: "April 10, 2026",
    dateISO: "2026-04-10",
    featured: false,
    image: null,
    color: "from-blue-500 to-indigo-500",
    emoji: "🖼️",
  }
];

export const CATEGORIES = [
  "All",
  ...new Set(BLOG_POSTS.map((p) => p.category)),
];