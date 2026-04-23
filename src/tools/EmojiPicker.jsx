import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Copy, Search, X, Smile, Home, ChevronDown } from "lucide-react";

// ─── Emoji Data by Category ──────────────────────────────────────────────────
const EMOJI_DATA = {
  "😀 Smileys": [
    { emoji: "😀", name: "grinning face" },
    { emoji: "😃", name: "grinning big eyes" },
    { emoji: "😄", name: "grinning smiling eyes" },
    { emoji: "😁", name: "beaming smiling eyes" },
    { emoji: "😆", name: "grinning squinting" },
    { emoji: "😅", name: "grinning sweat" },
    { emoji: "😂", name: "tears of joy" },
    { emoji: "🤣", name: "rolling laughing" },
    { emoji: "😊", name: "smiling eyes" },
    { emoji: "😇", name: "smiling halo" },
    { emoji: "🥰", name: "smiling hearts" },
    { emoji: "😍", name: "heart eyes" },
    { emoji: "🤩", name: "star struck" },
    { emoji: "😘", name: "blowing kiss" },
    { emoji: "😋", name: "savoring food" },
    { emoji: "😛", name: "face tongue" },
    { emoji: "😜", name: "winking tongue" },
    { emoji: "🤪", name: "zany face" },
    { emoji: "🤑", name: "money mouth" },
    { emoji: "🤗", name: "hugging face" },
    { emoji: "🤭", name: "hand over mouth" },
    { emoji: "🤫", name: "shushing face" },
    { emoji: "🤔", name: "thinking face" },
    { emoji: "😏", name: "smirking face" },
    { emoji: "🙄", name: "rolling eyes" },
    { emoji: "😬", name: "grimacing face" },
    { emoji: "😌", name: "relieved face" },
    { emoji: "😔", name: "pensive face" },
    { emoji: "😴", name: "sleeping face" },
    { emoji: "😷", name: "masked face" },
    { emoji: "🤢", name: "nauseated face" },
    { emoji: "🤮", name: "vomiting face" },
    { emoji: "🥵", name: "hot face" },
    { emoji: "🥶", name: "cold face" },
    { emoji: "🥴", name: "woozy face" },
    { emoji: "🤯", name: "exploding head" },
    { emoji: "😎", name: "cool sunglasses" },
    { emoji: "🥺", name: "pleading face" },
    { emoji: "😢", name: "crying face" },
    { emoji: "😭", name: "loudly crying" },
    { emoji: "😤", name: "steam nose" },
    { emoji: "😡", name: "pouting angry" },
    { emoji: "🤬", name: "symbols mouth" },
    { emoji: "💀", name: "skull" },
    { emoji: "☠️", name: "skull crossbones" },
    { emoji: "💩", name: "pile of poo" },
    { emoji: "🤡", name: "clown face" },
    { emoji: "👻", name: "ghost" },
    { emoji: "👽", name: "alien" },
    { emoji: "🤖", name: "robot" },
  ],
  "👋 Gestures": [
    { emoji: "👍", name: "thumbs up" },
    { emoji: "👎", name: "thumbs down" },
    { emoji: "👌", name: "ok hand" },
    { emoji: "✌️", name: "victory hand" },
    { emoji: "🤞", name: "crossed fingers" },
    { emoji: "🤟", name: "love you gesture" },
    { emoji: "🤘", name: "sign of horns" },
    { emoji: "🤙", name: "call me hand" },
    { emoji: "👏", name: "clapping hands" },
    { emoji: "🙌", name: "raising hands" },
    { emoji: "🤲", name: "palms up" },
    { emoji: "🙏", name: "folded hands" },
    { emoji: "✊", name: "raised fist" },
    { emoji: "👊", name: "oncoming fist" },
    { emoji: "🤛", name: "left fist" },
    { emoji: "🤜", name: "right fist" },
    { emoji: "💪", name: "flexed bicep" },
    { emoji: "🖐️", name: "hand splayed" },
    { emoji: "✋", name: "raised hand" },
    { emoji: "👋", name: "waving hand" },
    { emoji: "🤚", name: "raised back hand" },
    { emoji: "👆", name: "index pointing up" },
    { emoji: "👇", name: "index pointing down" },
    { emoji: "👈", name: "index pointing left" },
    { emoji: "👉", name: "index pointing right" },
    { emoji: "☝️", name: "index pointing upward" },
    { emoji: "🖕", name: "middle finger" },
    { emoji: "🤏", name: "pinching hand" },
    { emoji: "👐", name: "open hands" },
    { emoji: "🫶", name: "heart hands" },
  ],
  "🐶 Animals": [
    { emoji: "🐶", name: "dog face" },
    { emoji: "🐱", name: "cat face" },
    { emoji: "🐭", name: "mouse face" },
    { emoji: "🐹", name: "hamster" },
    { emoji: "🐰", name: "rabbit face" },
    { emoji: "🦊", name: "fox face" },
    { emoji: "🐻", name: "bear face" },
    { emoji: "🐼", name: "panda face" },
    { emoji: "🐨", name: "koala" },
    { emoji: "🦁", name: "lion face" },
    { emoji: "🐮", name: "cow face" },
    { emoji: "🐷", name: "pig face" },
    { emoji: "🐸", name: "frog face" },
    { emoji: "🐵", name: "monkey face" },
    { emoji: "🙈", name: "see no evil" },
    { emoji: "🙉", name: "hear no evil" },
    { emoji: "🙊", name: "speak no evil" },
    { emoji: "🐔", name: "chicken" },
    { emoji: "🐧", name: "penguin" },
    { emoji: "🦅", name: "eagle" },
    { emoji: "🦆", name: "duck" },
    { emoji: "🦢", name: "swan" },
    { emoji: "🦉", name: "owl" },
    { emoji: "🦚", name: "peacock" },
    { emoji: "🦜", name: "parrot" },
    { emoji: "🦩", name: "flamingo" },
    { emoji: "🐍", name: "snake" },
    { emoji: "🦖", name: "t-rex" },
    { emoji: "🦕", name: "sauropod" },
    { emoji: "🐢", name: "turtle" },
    { emoji: "🦎", name: "lizard" },
    { emoji: "🐊", name: "crocodile" },
    { emoji: "🐬", name: "dolphin" },
    { emoji: "🐳", name: "whale" },
    { emoji: "🦈", name: "shark" },
    { emoji: "🐙", name: "octopus" },
    { emoji: "🦋", name: "butterfly" },
    { emoji: "🐝", name: "honeybee" },
    { emoji: "🦄", name: "unicorn" },
    { emoji: "🐉", name: "dragon" },
  ],
  "🍕 Food": [
    { emoji: "🍎", name: "red apple" },
    { emoji: "🍌", name: "banana" },
    { emoji: "🍇", name: "grapes" },
    { emoji: "🍉", name: "watermelon" },
    { emoji: "🍓", name: "strawberry" },
    { emoji: "🥝", name: "kiwi" },
    { emoji: "🍑", name: "peach" },
    { emoji: "🍒", name: "cherries" },
    { emoji: "🥭", name: "mango" },
    { emoji: "🍍", name: "pineapple" },
    { emoji: "🥥", name: "coconut" },
    { emoji: "🌽", name: "corn" },
    { emoji: "🥕", name: "carrot" },
    { emoji: "🧄", name: "garlic" },
    { emoji: "🍕", name: "pizza" },
    { emoji: "🍔", name: "hamburger" },
    { emoji: "🍟", name: "french fries" },
    { emoji: "🌭", name: "hot dog" },
    { emoji: "🌮", name: "taco" },
    { emoji: "🌯", name: "burrito" },
    { emoji: "🍣", name: "sushi" },
    { emoji: "🍜", name: "noodles" },
    { emoji: "🍛", name: "curry rice" },
    { emoji: "🍲", name: "pot of food" },
    { emoji: "🥘", name: "paella" },
    { emoji: "🍰", name: "shortcake" },
    { emoji: "🧁", name: "cupcake" },
    { emoji: "🍩", name: "doughnut" },
    { emoji: "🍫", name: "chocolate" },
    { emoji: "🍬", name: "candy" },
    { emoji: "🍭", name: "lollipop" },
    { emoji: "☕", name: "hot coffee" },
    { emoji: "🍵", name: "tea cup" },
    { emoji: "🧋", name: "bubble tea" },
    { emoji: "🥤", name: "cup with straw" },
    { emoji: "🍺", name: "beer mug" },
    { emoji: "🍻", name: "clinking beers" },
  ],
  "❤️ Hearts": [
    { emoji: "❤️", name: "red heart" },
    { emoji: "🧡", name: "orange heart" },
    { emoji: "💛", name: "yellow heart" },
    { emoji: "💚", name: "green heart" },
    { emoji: "💙", name: "blue heart" },
    { emoji: "💜", name: "purple heart" },
    { emoji: "🖤", name: "black heart" },
    { emoji: "🤍", name: "white heart" },
    { emoji: "🤎", name: "brown heart" },
    { emoji: "💔", name: "broken heart" },
    { emoji: "❤️‍🔥", name: "heart on fire" },
    { emoji: "❤️‍🩹", name: "mending heart" },
    { emoji: "💕", name: "two hearts" },
    { emoji: "💞", name: "revolving hearts" },
    { emoji: "💓", name: "beating heart" },
    { emoji: "💗", name: "growing heart" },
    { emoji: "💖", name: "sparkling heart" },
    { emoji: "💘", name: "heart with arrow" },
    { emoji: "💝", name: "heart with ribbon" },
    { emoji: "💟", name: "heart decoration" },
    { emoji: "♥️", name: "heart suit" },
    { emoji: "😍", name: "heart eyes" },
    { emoji: "🥰", name: "hearts face" },
    { emoji: "💌", name: "love letter" },
    { emoji: "💑", name: "couple with heart" },
  ],
  "🔥 Symbols": [
    { emoji: "🔥", name: "fire" },
    { emoji: "💯", name: "hundred points" },
    { emoji: "⭐", name: "star" },
    { emoji: "🌟", name: "glowing star" },
    { emoji: "✨", name: "sparkles" },
    { emoji: "⚡", name: "lightning bolt" },
    { emoji: "💥", name: "collision" },
    { emoji: "🚀", name: "rocket" },
    { emoji: "🎯", name: "bullseye" },
    { emoji: "🏆", name: "trophy" },
    { emoji: "🥇", name: "gold medal" },
    { emoji: "🎖️", name: "military medal" },
    { emoji: "💎", name: "gem stone" },
    { emoji: "💰", name: "money bag" },
    { emoji: "💸", name: "flying money" },
    { emoji: "💡", name: "light bulb" },
    { emoji: "🔑", name: "key" },
    { emoji: "🗝️", name: "old key" },
    { emoji: "⚙️", name: "gear" },
    { emoji: "🔧", name: "wrench" },
    { emoji: "🛡️", name: "shield" },
    { emoji: "⚔️", name: "crossed swords" },
    { emoji: "🧲", name: "magnet" },
    { emoji: "🎵", name: "musical note" },
    { emoji: "🎶", name: "musical notes" },
    { emoji: "📱", name: "mobile phone" },
    { emoji: "💻", name: "laptop" },
    { emoji: "🖥️", name: "desktop" },
    { emoji: "📷", name: "camera" },
    { emoji: "🎮", name: "video game" },
    { emoji: "📚", name: "books" },
    { emoji: "✏️", name: "pencil" },
    { emoji: "📝", name: "memo" },
    { emoji: "📌", name: "pushpin" },
    { emoji: "🔔", name: "bell" },
    { emoji: "✅", name: "check mark" },
    { emoji: "❌", name: "cross mark" },
    { emoji: "⚠️", name: "warning" },
    { emoji: "🚫", name: "no entry" },
    { emoji: "♻️", name: "recycling" },
  ],
  "✈️ Travel": [
    { emoji: "✈️", name: "airplane" },
    { emoji: "🚀", name: "rocket" },
    { emoji: "🚗", name: "car" },
    { emoji: "🚕", name: "taxi" },
    { emoji: "🚌", name: "bus" },
    { emoji: "🚂", name: "train" },
    { emoji: "🚢", name: "ship" },
    { emoji: "⛵", name: "sailboat" },
    { emoji: "🏖️", name: "beach" },
    { emoji: "🏔️", name: "mountain" },
    { emoji: "🗻", name: "mount fuji" },
    { emoji: "🏕️", name: "camping" },
    { emoji: "🗼", name: "tokyo tower" },
    { emoji: "🗽", name: "statue liberty" },
    { emoji: "🏰", name: "castle" },
    { emoji: "🕌", name: "mosque" },
    { emoji: "⛩️", name: "shinto shrine" },
    { emoji: "🕍", name: "synagogue" },
    { emoji: "⛪", name: "church" },
    { emoji: "🌍", name: "globe europe africa" },
    { emoji: "🌎", name: "globe americas" },
    { emoji: "🌏", name: "globe asia" },
    { emoji: "🗺️", name: "world map" },
    { emoji: "🧭", name: "compass" },
    { emoji: "🌐", name: "globe meridians" },
    { emoji: "🎒", name: "backpack" },
    { emoji: "🧳", name: "luggage" },
    { emoji: "🎫", name: "ticket" },
    { emoji: "🏨", name: "hotel" },
    { emoji: "⛽", name: "fuel pump" },
  ],
  "🇵🇰 Flags": [
    { emoji: "🇵🇰", name: "flag Pakistan" },
    { emoji: "🇮🇳", name: "flag India" },
    { emoji: "🇦🇪", name: "flag UAE" },
    { emoji: "🇸🇦", name: "flag Saudi Arabia" },
    { emoji: "🇺🇸", name: "flag United States" },
    { emoji: "🇬🇧", name: "flag United Kingdom" },
    { emoji: "🇨🇦", name: "flag Canada" },
    { emoji: "🇦🇺", name: "flag Australia" },
    { emoji: "🇩🇪", name: "flag Germany" },
    { emoji: "🇫🇷", name: "flag France" },
    { emoji: "🇨🇳", name: "flag China" },
    { emoji: "🇯🇵", name: "flag Japan" },
    { emoji: "🇰🇷", name: "flag South Korea" },
    { emoji: "🇧🇩", name: "flag Bangladesh" },
    { emoji: "🇲🇾", name: "flag Malaysia" },
    { emoji: "🇹🇷", name: "flag Turkey" },
    { emoji: "🇮🇷", name: "flag Iran" },
    { emoji: "🇪🇬", name: "flag Egypt" },
    { emoji: "🇳🇬", name: "flag Nigeria" },
    { emoji: "🇧🇷", name: "flag Brazil" },
    { emoji: "🇲🇽", name: "flag Mexico" },
    { emoji: "🇷🇺", name: "flag Russia" },
    { emoji: "🇮🇹", name: "flag Italy" },
    { emoji: "🇪🇸", name: "flag Spain" },
    { emoji: "🇰🇼", name: "flag Kuwait" },
    { emoji: "🇶🇦", name: "flag Qatar" },
    { emoji: "🇴🇲", name: "flag Oman" },
    { emoji: "🇧🇭", name: "flag Bahrain" },
    { emoji: "🇮🇩", name: "flag Indonesia" },
    { emoji: "🌍", name: "globe" },
  ],
};

const ALL_EMOJIS = Object.values(EMOJI_DATA).flat();
const CATEGORIES = ["All", ...Object.keys(EMOJI_DATA)];

const EmojiPicker = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState([]);
  const [recent, setRecent] = useState([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1500);
  };

  const filteredEmojis = useMemo(() => {
    const pool = activeCategory === "All" ? ALL_EMOJIS : (EMOJI_DATA[activeCategory] || []);
    if (!search.trim()) return pool;
    return ALL_EMOJIS.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [search, activeCategory]);

  const addToSelected = (emoji) => {
    if (!selected.includes(emoji)) setSelected([...selected, emoji]);
    setRecent((prev) => [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 16));
  };

  const copySingle = (emoji, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(emoji);
    showToast(`${emoji} Copied!`);
  };

  const removeFromSelected = (emoji) => setSelected(selected.filter((e) => e !== emoji));

  const copySelected = () => {
    if (!selected.length) return;
    navigator.clipboard.writeText(selected.join(""));
    setCopied(true);
    showToast(`Copied ${selected.length} emoji${selected.length > 1 ? "s" : ""}!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── SCHEMAS ──
  const schemaWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Emoji Picker Online – Copy & Paste Emojis",
    "url": "https://www.generatorpromptai.com/tools/emoji-picker",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "description": "Free online emoji picker to search, select and copy emojis instantly. Includes heart, flag, smiley face, and food emojis.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "GeneratorPromptAI" }
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.generatorpromptai.com/" },
      { "@type": "ListItem", "position": 2, "name": "All Free Tools", "item": "https://www.generatorpromptai.com/pages/all-tools" },
      { "@type": "ListItem", "position": 3, "name": "Emoji Picker", "item": "https://www.generatorpromptai.com/tools/emoji-picker" }
    ]
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I copy and paste emojis from this picker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Click any emoji to add it to your collection at the bottom, then click 'Copy All Emojis' to copy them all at once. You can also hover over any emoji and click the copy icon for an instant single copy."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use these emojis on WhatsApp and Instagram?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Simply copy the emojis from our picker and paste them directly into WhatsApp, Instagram, Facebook, Twitter/X, Discord, Telegram, Slack, or any other app that supports emojis."
        }
      },
      {
        "@type": "Question",
        "name": "Does this emoji picker work on mobile phones?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our emoji picker is fully responsive and works perfectly on all mobile phones, tablets, and desktop browsers without needing to install any app."
        }
      },
      {
        "@type": "Question",
        "name": "How to find the Pakistan flag emoji to copy and paste?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Click the 'Flags' category tab or search 'pakistan' in the search bar above. You will find the Pakistan flag emoji (🇵🇰) which you can copy with one click."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Emojis removed from title/desc for clean Google snippet */}
        <title>Free Emoji Picker Online – Copy & Paste 500+ Emojis Instantly</title>
        <meta
          name="description"
          content="Free online emoji picker to search, select, and copy emojis instantly. Includes heart emoji copy paste, flag emoji copy paste, smiley faces, food, and more. Works for WhatsApp, Instagram, and Discord."
        />
        {/* Kept main keywords that are bringing traffic + added long-tails */}
        <meta
          name="keywords"
          content="emoji picker, copy paste emoji, emoji keyboard online, heart emoji copy paste online, flag emoji copy paste free, smiley face emoji copy paste, whatsapp emoji copy paste, instagram emoji copy, tiktok emoji copy, cute emoji copy paste, emoji list copy paste, emoji search tool online"
        />
        <link rel="canonical" href="https://www.generatorpromptai.com/tools/emoji-picker" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GeneratorPromptAI" />
        <meta property="og:title" content="Free Emoji Picker Online – Copy & Paste 500+ Emojis Instantly" />
        <meta property="og:description" content="Search, select and copy 500+ emojis instantly. Heart emoji, flag emoji, smiley faces & more. Works for WhatsApp, Instagram & Discord." />
        <meta property="og:url" content="https://www.generatorpromptai.com/tools/emoji-picker" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Emoji Picker Online – Copy & Paste Emojis Instantly" />
        <meta name="twitter:description" content="Search and copy 500+ emojis for WhatsApp, Instagram, TikTok & Discord. Free online emoji picker tool." />

        <script type="application/ld+json">{JSON.stringify(schemaWebApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>
      </Helmet>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ── Breadcrumb Only ── */}
        <div className="max-w-6xl mx-auto w-full px-4 pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-yellow-500 transition-colors">
                  <Home size={14} /> Home
                </Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li>
                <Link to="/pages/all-tools" className="hover:text-yellow-500 transition-colors">All Tools</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li><span className="text-gray-900 font-semibold">Emoji Picker</span></li>
            </ol>
          </nav>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">

          {/* Hero */}
          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-100 mb-4">
              <Smile className="text-yellow-500" size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Free Emoji Picker Online –{" "}
              <span className="text-yellow-500">Copy & Paste 500+ Emojis</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg">
              Search emojis by name, browse categories, and copy them instantly for WhatsApp, Instagram, and Discord.
            </p>
          </div>

          {/* Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8 mb-8">

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory("All"); }}
                placeholder="Search emojis… heart, fire, cat, food, pakistan"
                className="w-full px-5 py-3.5 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-sm"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            {!search && (
              <div className="flex gap-2 flex-wrap justify-center mb-6">
                {CATEGORIES.map((cat) => {
                  const count = cat === "All" ? ALL_EMOJIS.length : (EMOJI_DATA[cat]?.length || 0);
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${activeCategory === cat
                        ? "bg-yellow-400 text-gray-900 border-yellow-400"
                        : "bg-white text-gray-600 border-gray-200 hover:border-yellow-300"
                        }`}
                    >
                      {cat} <span className="text-xs opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Recent Emojis */}
            {recent.length > 0 && !search && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">Recently Used</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {recent.map((e, i) => (
                    <button
                      key={i}
                      onClick={() => addToSelected(e)}
                      className="text-3xl p-2 rounded-xl hover:bg-yellow-50 hover:scale-110 transition-all"
                      title={`Add ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Emoji Grid */}
            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-1">
              {filteredEmojis.length > 0 ? (
                filteredEmojis.map((item, i) => (
                  <div key={i} className="relative group">
                    <button
                      onClick={() => { addToSelected(item.emoji); showToast(`${item.emoji} Added!`); }}
                      className="w-full text-3xl md:text-4xl p-2 rounded-xl hover:bg-yellow-50 hover:scale-110 transition-all active:scale-95"
                      title={item.name}
                      aria-label={item.name}
                    >
                      {item.emoji}
                    </button>
                    {/* Hover: instant copy button */}
                    <button
                      onClick={(e) => copySingle(item.emoji, e)}
                      className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full w-5 h-5 items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition hidden sm:flex"
                      title="Copy instantly"
                    >
                      <Copy size={10} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center py-12 text-gray-400">
                  No emojis found for "{search}"
                </p>
              )}
            </div>

            {/* Selected Collection */}
            {selected.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Your collection ({selected.length})</p>
                  <button onClick={() => setSelected([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear all</button>
                </div>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                  {selected.map((e, i) => (
                    <div key={i} className="relative group">
                      <span className="text-4xl cursor-default">{e}</span>
                      <button
                        onClick={() => removeFromSelected(e)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={copySelected}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold transition-all active:scale-95"
                >
                  <Copy size={17} />
                  {copied ? "Copied!" : `Copy All ${selected.length} Emojis`}
                </button>
              </div>
            )}
          </div>

          {/* ── SEO Content ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Free Online Emoji Picker – Search, Select & Copy Emojis
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free emoji picker gives you instant access to 500+ emojis organized into 8 categories — Smileys, Gestures, Animals, Food, Hearts, Symbols, Travel, and Flags. Search by name, browse by category, or pick from your recently used emojis.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Click any emoji to add it to your collection, then copy them all at once. Or hover over any emoji and click the copy icon to copy it instantly without adding to your collection. Works perfectly for WhatsApp, Instagram, Facebook, Twitter, Discord, Slack, and any other platform.
            </p>
          </div>

          {/* ── FAQ Section (Accordion) ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Emoji Picker – Frequently Asked Questions
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  q: "How do I copy and paste emojis from this picker?",
                  a: "Click any emoji to add it to your collection at the bottom, then click 'Copy All Emojis' to copy them at once. Or hover over any emoji and click the tiny copy icon for an instant single copy."
                },
                {
                  q: "Can I use these emojis on WhatsApp and Instagram?",
                  a: "Yes. Simply copy the emojis and paste them directly into WhatsApp, Instagram, Facebook, Twitter/X, Discord, Telegram, Slack, or anywhere else that supports emojis."
                },
                {
                  q: "Does this emoji picker work on mobile phones?",
                  a: "Yes, our emoji picker is fully responsive and works perfectly on all mobile phones, tablets, and desktop browsers without needing to install any app."
                },
                {
                  q: "How to find the Pakistan flag emoji to copy and paste?",
                  a: "Click the 'Flags' category tab or search 'pakistan' in the search bar above. You will find the Pakistan flag emoji (🇵🇰) which you can copy with one click."
                }
              ].map((item, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-yellow-200 transition-colors duration-300">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openFaq === i}>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 pr-4">{item.q}</h3>
                    <ChevronDown size={22} className={`text-yellow-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Tools (Fixed broken link) ── */}
          <section>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Related Free Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: "/tools/word-counter", title: "Word Counter", desc: "Count words, characters and reading time instantly." },
                { to: "/tools/lorem-ipsum-generator", title: "Lorem Ipsum Generator", desc: "Generate placeholder text for design and development." },
                { to: "/tools/hashtag-generator", title: "Hashtag Generator", desc: "Generate relevant hashtags for Instagram, TikTok and X/Twitter." }
              ].map((tool) => (
                <Link key={tool.to} to={tool.to} className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-yellow-400 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-yellow-500 transition-colors">{tool.title}</h3>
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

export default EmojiPicker;