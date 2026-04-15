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
];

export const CATEGORIES = [
  "All",
  ...new Set(BLOG_POSTS.map((p) => p.category)),
];