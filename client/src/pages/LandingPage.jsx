import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Train,
  Moon,
  Sun,
  Handshake,
  BookOpen,
  Leaf,
  Plus
} from "lucide-react";

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={dark ? "dark" : ""}>
      <div className="bg-white dark:bg-black text-slate-900 dark:text-white font-sans">

        {/* NAVBAR */}

        <nav className="fixed top-0 w-full z-50 px-4 py-4">
          <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/70 dark:bg-black/40 border rounded-3xl px-6 py-3 flex items-center justify-between shadow">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                <Train size={18}/>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                RailSwap
              </span>
            </div>

            <div className="hidden lg:flex gap-8 font-semibold text-sm">
              <a href="#">Circles</a>
              <a href="#">Swaps</a>
              <a href="#">Meetups</a>
              <a href="#">Guides</a>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {dark ? <Sun size={18}/> : <Moon size={18}/>}
              </button>

              <button onClick={() => navigate("/login")} className="bg-black cursor-pointer dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm font-semibold">
                Sign In
              </button>

            </div>
          </div>
        </nav>

        {/* HERO SECTION */}

        <section className="max-w-7xl mx-auto px-6 pt-40 pb-24 flex flex-col lg:flex-row items-center gap-16">

          <div className="lg:w-1/2">

            <span className="text-pink-500 bg-pink-100 px-4 py-1 rounded-full text-xs font-semibold">
              COMMUNITY FIRST RAILWAY
            </span>

            <h1 className="text-6xl md:text-7xl font-extrabold mt-6 leading-tight">
              Your Journey,
              <br/>
              <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                Shared.
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg max-w-xl">
              More than just a seat swap. Join 500,000+ travelers turning long hauls
              into lifelong connections and collective adventures.
            </p>

            <div className="flex gap-4 mt-8">

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/login")}
                className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg cursor-pointer"
              >
                Join Our Traveler’s Circle
              </motion.button>

              <button className="border px-6 py-4 rounded-2xl">
                Explore Stories
              </button>

            </div>

          </div>

          {/* RIGHT GRID */}

          <div className="lg:w-1/2 grid grid-cols-2 gap-4">

            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
              className="rounded-3xl h-72 object-cover"
            />

            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-3xl">
              <h3 className="text-xl font-bold">Daily Active Circles</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join chats for specific train numbers
              </p>
            </div>

            <div className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-3xl">
              <h3 className="text-xl font-bold">4.9 / 5 Rating</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Community vetted safety
              </p>
            </div>

            <motion.img
              whileHover={{ scale: 1.05 }}
              src="https://images.unsplash.com/photo-1504215680853-026ed2a45def"
              className="rounded-3xl h-72 object-cover"
            />

          </div>

        </section>

        {/* CHALLENGES */}

        <section className="bg-gray-50 dark:bg-white/5 py-28">

          <div className="max-w-7xl mx-auto px-6">

            <div className="flex justify-between items-end mb-12">

              <div>
                <h2 className="text-4xl font-bold">The Journey Challenges</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Pick a challenge and level up your traveler profile.
                </p>
              </div>

              <button className="border px-5 py-2 rounded-xl">
                View All Quests
              </button>

            </div>

            <div className="grid md:grid-cols-3 gap-8">

              {/* CARD */}

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-black p-8 rounded-3xl shadow"
              >
                <Handshake className="text-pink-500 mb-4"/>
                <h3 className="text-xl font-bold">The Harmony Swap</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Swap seats with a senior citizen or family.
                </p>

                <div className="flex justify-between mt-6 text-sm font-semibold text-pink-500">
                  ACTIVE NOW
                  <Plus size={18}/>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-black p-8 rounded-3xl shadow"
              >
                <BookOpen className="text-indigo-500 mb-4"/>
                <h3 className="text-xl font-bold">Book Buddy Circle</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Share books with fellow travelers.
                </p>

                <div className="flex justify-between mt-6 text-sm font-semibold text-indigo-500">
                  340 PARTICIPATING
                  <Plus size={18}/>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-black p-8 rounded-3xl shadow"
              >
                <Leaf className="text-green-500 mb-4"/>
                <h3 className="text-xl font-bold">Green Commuter</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Share eco friendly travel experiences.
                </p>

                <div className="flex justify-between mt-6 text-sm font-semibold text-green-500">
                  TRENDING
                  <Plus size={18}/>
                </div>
              </motion.div>

            </div>

          </div>

        </section>

        {/* STATS MARQUEE */}

        <section className="bg-black text-white py-8 overflow-hidden">

          <div className="flex animate-marquee whitespace-nowrap text-3xl font-bold gap-16">

            <span>500K TRAVELERS JOINED</span>
            <span className="text-indigo-500">2M+ SUCCESSFUL SWAPS</span>
            <span>10K ACTIVE ROUTES</span>
            <span className="text-pink-500">50K DAILY STORIES</span>
            <span>#RAILSWAPCOMMUNITY</span>

          </div>

        </section>

        {/* CTA */}

        <section className="py-32">

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center rounded-3xl p-20"
          >

            <h2 className="text-5xl font-bold mb-6">
              Ready to change how you travel?
            </h2>

            <p className="opacity-80 mb-10">
              Stop being a passenger. Become part of the circle.
            </p>

            <div className="flex justify-center gap-6">

              <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold">
                Get The App Now
              </button>

              <button className="border px-8 py-4 rounded-full">
                See Why It Works
              </button>

            </div>

          </motion.div>

        </section>

        {/* FOOTER */}

        <footer className="bg-gray-50 dark:bg-black py-20">

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

            <div className="col-span-2">

              <div className="flex items-center gap-2 mb-4">
                <Train/>
                <span className="text-xl font-bold">RailSwap</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                Redefining railway travel through community, empathy,
                and smart technology.
              </p>

            </div>

            <div>
              <h4 className="font-bold mb-3">Explore</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Community Challenges</li>
                <li>Seat Swap Portal</li>
                <li>Route Optimization</li>
                <li>Travel Circles</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">Support</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Trust & Safety</li>
                <li>Community Guidelines</li>
                <li>Help Center</li>
                <li>Contact Us</li>
              </ul>
            </div>

          </div>

          <p className="text-center text-gray-500 mt-12 text-sm">
            © 2024 RailSwap Technologies
          </p>

        </footer>

      </div>

      {/* MARQUEE STYLE */}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          width:200%;
          animation: marquee 30s linear infinite;
        }
      `}</style>

    </div>
  );
}