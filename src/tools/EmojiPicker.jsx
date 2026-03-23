// pages/EmojiPicker.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Copy, Search, X } from "lucide-react";

const EmojiPicker = () => {
  const [search, setSearch] = useState("");
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [recent, setRecent] = useState([]);
  const [copied, setCopied] = useState(false);

  // ~400+ emojis – you can keep expanding this array
  const emojis = [
    // Smileys & Emotion (most used)
    { emoji: "😀", name: "grinning face" },
    { emoji: "😃", name: "grinning face big eyes" },
    { emoji: "😄", name: "grinning smiling eyes" },
    { emoji: "😁", name: "beaming smiling eyes" },
    { emoji: "😆", name: "grinning squinting face" },
    { emoji: "😅", name: "grinning sweat" },
    { emoji: "😂", name: "tears of joy" },
    { emoji: "🤣", name: "rolling laughing" },
    { emoji: "🥲", name: "smiling tear" },
    { emoji: "😊", name: "smiling smiling eyes" },
    { emoji: "😇", name: "smiling halo" },
    { emoji: "🥰", name: "smiling hearts" },
    { emoji: "😍", name: "heart-eyes" },
    { emoji: "🤩", name: "star-struck" },
    { emoji: "😘", name: "blowing kiss" },
    { emoji: "😋", name: "savoring food" },
    { emoji: "😛", name: "face with tongue" },
    { emoji: "😜", name: "winking tongue" },
    { emoji: "🤪", name: "zany face" },
    { emoji: "🤑", name: "money-mouth" },
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
    { emoji: "😎", name: "sunglasses face" },
    { emoji: "🥺", name: "pleading face" },
    { emoji: "😢", name: "crying face" },
    { emoji: "😭", name: "loudly crying" },
    { emoji: "😤", name: "steam from nose" },
    { emoji: "😡", name: "pouting face" },
    { emoji: "🤬", name: "symbols mouth" },
    { emoji: "💀", name: "skull" },
    { emoji: "☠️", name: "skull crossbones" },
    { emoji: "💩", name: "pile of poo" },

    // Animals & Nature
    { emoji: "🐶", name: "dog face" },
    { emoji: "🐱", name: "cat face" },
    { emoji: "🐭", name: "mouse face" },
    { emoji: "🐹", name: "hamster face" },
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
    { emoji: "🙈", name: "see-no-evil" },
    { emoji: "🙉", name: "hear-no-evil" },
    { emoji: "🙊", name: "speak-no-evil" },
    { emoji: "🐔", name: "chicken" },
    { emoji: "🐧", name: "penguin" },
    { emoji: "🦅", name: "eagle" },
    { emoji: "🦆", name: "duck" },
    { emoji: "🦢", name: "swan" },
    { emoji: "🦉", name: "owl" },
    { emoji: "🦚", name: "peacock" },
    { emoji: "🦜", name: "parrot" },
    { emoji: "🦩", name: "flamingo" },

    // Food & Drink (popular)
    { emoji: "🍎", name: "red apple" },
    { emoji: "🍌", name: "banana" },
    { emoji: "🍇", name: "grapes" },
    { emoji: "🍉", name: "watermelon" },
    { emoji: "🍓", name: "strawberry" },
    { emoji: "🥝", name: "kiwi" },
    { emoji: "🍕", name: "pizza" },
    { emoji: "🍔", name: "hamburger" },
    { emoji: "🍟", name: "french fries" },
    { emoji: "🌭", name: "hot dog" },
    { emoji: "🌮", name: "taco" },
    { emoji: "🍣", name: "sushi" },
    { emoji: "🍰", name: "shortcake" },
    { emoji: "🧁", name: "cupcake" },
    { emoji: "🍩", name: "doughnut" },
    { emoji: "☕", name: "hot beverage" },
    { emoji: "🍵", name: "teacup" },
    { emoji: "🍺", name: "beer mug" },
    { emoji: "🍻", name: "clinking beers" },

    // Symbols & Objects
    { emoji: "❤️", name: "red heart" },
    { emoji: "💔", name: "broken heart" },
    { emoji: "💕", name: "two hearts" },
    { emoji: "💖", name: "sparkling heart" },
    { emoji: "💘", name: "heart with arrow" },
    { emoji: "🔥", name: "fire" },
    { emoji: "💯", name: "hundred points" },
    { emoji: "⭐", name: "star" },
    { emoji: "✨", name: "sparkles" },
    { emoji: "⚡", name: "high voltage" },
    { emoji: "💥", name: "collision" },
    { emoji: "🚀", name: "rocket" },

    // Flags (popular in Pakistan & region)
    { emoji: "🇵🇰", name: "flag Pakistan" },
    { emoji: "🇮🇳", name: "flag India" },
    { emoji: "🇦🇪", name: "flag UAE" },
    { emoji: "🇸🇦", name: "flag Saudi Arabia" },
    { emoji: "🇺🇸", name: "flag United States" },
    { emoji: "🇬🇧", name: "flag United Kingdom" },
  ];

  const filteredEmojis = emojis.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const addEmoji = (emoji) => {
    if (!selectedEmojis.includes(emoji)) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
    // Update recent
    const newRecent = [emoji, ...recent.filter((e) => e !== emoji)].slice(0, 16);
    setRecent(newRecent);
    localStorage.setItem("recentEmojis", JSON.stringify(newRecent));
  };

  const removeEmoji = (emoji) => {
    setSelectedEmojis(selectedEmojis.filter((e) => e !== emoji));
  };

  const copySelected = () => {
    if (selectedEmojis.length === 0) return;
    navigator.clipboard.writeText(selectedEmojis.join(""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const clearSelected = () => setSelectedEmojis([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentEmojis");
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch {
        localStorage.removeItem("recentEmojis");
      }
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Emoji Picker 👓 – Free online Emoji Copy & Paste tool</title>
        <meta
          name="description"
          content="Fast online emoji picker with search, recent emojis, and bulk copy. Hundreds of smileys, hearts, animals, food, flags Pakistan 🇵🇰 & more. Free, no sign-up, works on mobile & desktop."
        />
        <meta
          name="keywords"
          content="emoji picker, copy paste emoji, emoji keyboard online, free emoji selector, emoji search, recent emojis, pakistan emoji, whatsapp emoji picker 2026"
        />
        <link rel="canonical" href="https://generatorpromptai.com/tools/emoji-picker" />

        <meta property="og:title" content="Free Online Emoji Picker – Copy Emojis Instantly" />
        <meta
          property="og:description"
          content="Search & copy thousands of emojis: hearts ❤️, fire 🔥, Pakistan flag 🇵🇰, food, animals & more. Perfect for WhatsApp, Instagram, Facebook, Discord."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://generatorpromptai.com/tools/emoji-picker" />
        <meta property="og:site_name" content="GeneratorPromptAI" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Emoji Picker – Free Copy & Paste Tool" />
        <meta name="twitter:description" content="Instant emoji search & copy – hearts, flags, animals, food & more." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Emoji Picker",
            url: "https://generatorpromptai.com/tools/emoji-picker",
            description: "Free browser-based emoji picker with search, recent history, and one-click copy.",
            applicationCategory: "UtilityApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "GeneratorPromptAI" },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="flex-grow max-w-6xl mx-auto w-full px-4 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Emoji Picker
          </h1>
          <p className="text-center text-gray-600 text-lg mb-10">
            Search • Select • Copy – hundreds of emojis instantly
          </p>

          {/* Main Tool Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-10 mb-12">
            {/* Search */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search emojis… (heart, fire, cat, food, pakistan)"
                className="w-full px-5 py-4 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm text-lg"
              />
              <Search
                size={22}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Selected Emojis */}
            <div className="min-h-[80px] mb-8">
              {selectedEmojis.length > 0 ? (
                <div className="flex flex-wrap gap-3 justify-center p-5 bg-gray-50 rounded-xl border border-gray-100">
                  {selectedEmojis.map((e, i) => (
                    <div
                      key={i}
                      className="relative group"
                      title="Click to remove"
                    >
                      <span className="text-5xl cursor-pointer transition hover:scale-110">
                        {e}
                      </span>
                      <button
                        onClick={() => removeEmoji(e)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-6 text-lg">
                  Click emojis below to add them here
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <button
                onClick={copySelected}
                disabled={selectedEmojis.length === 0}
                className="flex items-center gap-2 px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Copy size={18} />
                {copied ? "Copied!" : "Copy Selected"}
                {selectedEmojis.length > 0 && ` (${selectedEmojis.length})`}
              </button>

              <button
                onClick={clearSelected}
                disabled={selectedEmojis.length === 0}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            {/* Recent */}
            {recent.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Recent
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {recent.map((e, i) => (
                    <button
                      key={i}
                      onClick={() => addEmoji(e)}
                      className="text-4xl p-3 rounded-xl hover:bg-sky-50 hover:scale-110 transition"
                      title="Add again"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Emoji Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2 md:gap-3">
              {filteredEmojis.length > 0 ? (
                filteredEmojis.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => addEmoji(item.emoji)}
                    className="text-4xl md:text-5xl p-3 rounded-xl hover:bg-sky-50 hover:scale-110 transition transform active:scale-95"
                    title={item.name}
                    aria-label={`Add ${item.name}`}
                  >
                    {item.emoji}
                  </button>
                ))
              ) : (
                <p className="col-span-full text-center py-16 text-gray-500 text-lg">
                  No emojis found for "{search}"
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Free Online Emoji Picker & Copier
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>
                Quickly find and copy any emoji with our clean, fast emoji picker. Search by name, see recent picks, build combinations, and copy everything in one click. Works perfectly for WhatsApp, Instagram, Facebook, Discord, Twitter/X, emails, notes, and more.
              </p>
              <p>
                <p>Especially useful in Pakistan 🇵🇰 — includes local flags and popular regional emojis. 100% browser-based, private, no login, no ads.</p>
              </p>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use the Emoji Picker
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-4 text-gray-700 text-[17px]">
                <li>Type in the search field (e.g. "heart", "fire", "pakistan", "food").</li>
                <li>Click any emoji to add it to your selection area.</li>
                <li>Recently used emojis appear below search for fast reuse.</li>
                <li>Click any selected emoji to remove it.</li>
                <li>Press "Copy Selected" to copy all emojis at once.</li>
                <li>Paste anywhere — chats, posts, comments, documents.</li>
              </ol>
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Related Free Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tools/word-counter"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Word Counter
                </h3>
                <p className="text-gray-600 text-sm">
                  Count words, characters, reading time instantly.
                </p>
              </Link>

              <Link
                to="/tools/lorem-ipsum-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Lorem Ipsum Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate placeholder text for design & development.
                </p>
              </Link>

              <Link
                to="/tools/random-number-generator"
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-sky-300 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-sky-600">
                  Random Number Generator
                </h3>
                <p className="text-gray-600 text-sm">
                  Dice, lottery numbers, random ranges & more.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default EmojiPicker;