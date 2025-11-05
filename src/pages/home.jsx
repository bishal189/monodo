"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Globe,
  Menu,
  X,
} from "lucide-react";
import MomondoLogo from "../components/MomondoLogo";

export default function Home() {
  const [listings, setListings] = useState({
    Kathmandu: [],
    Pokhara: [],
    Tokyo: [],
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/home/")
      .then((res) => res.json())
      .then((data) => {
        setListings({
          Kathmandu: data.Kathmandu || [],
          Pokhara: data.Pokhara || [],
          Tokyo: data.Tokyo || [],
        });
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const scroll = (section, direction) => {
    const container = document.getElementById(`scroll-${section}`);
    if (container) {
      const isMobile = window.innerWidth < 768;
      const scrollAmount = isMobile ? container.offsetWidth * 0.9 : 320;
      container.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const ListingCard = ({ listing }) => (
    <div className="flex-shrink-0 w-[45vw] sm:w-64 md:w-72 cursor-pointer group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-md hover:scale-[1.02] transition-transform duration-300">
      <div className="relative mb-2 overflow-hidden h-40 sm:h-48 md:h-56">
        <img
          src={listing.image}
          alt={listing.location}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-white/70 rounded-full p-2 hover:bg-white transition-colors">
          <Heart size={18} className="text-gray-700" />
        </button>
        <span className="absolute top-3 left-3 bg-white/80 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Guest favorite
        </span>
      </div>
      <div className="px-3 pb-3">
        <h3 className="font-semibold text-white truncate text-sm sm:text-base">
          {listing.location}
        </h3>
        <p className="text-pink-200 text-xs sm:text-sm">
          ${listing.price} for 2 nights
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} fill="#FFD700" className="text-yellow-400" />
          <span className="text-xs sm:text-sm font-medium text-white">
            {listing.rating}
          </span>
          <span className="text-xs text-gray-300">
            ({listing.reviews})
          </span>
        </div>
      </div>
    </div>
  );

  const ListingSection = ({ title, sectionKey, items }) => (
    <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-white/20">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {title} <span className="text-gray-300">›</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(sectionKey, "left")}
            className="p-1.5 sm:p-2 rounded-full border border-white/30 text-white bg-transparent hover:bg-white/20 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => scroll(sectionKey, "right")}
            className="p-1.5 sm:p-2 rounded-full border border-white/30 text-white bg-transparent hover:bg-white/20 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      <div
        id={`scroll-${sectionKey}`}
        className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth hide-scrollbar"
      >
        {items.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );

  return (
    <div className="bg-momondo-purple w-full min-h-full text-white">
      {/* Header */}
      <header className="border-b border-white/20 sticky top-0 bg-momondo-purple z-50">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <MomondoLogo />
            <nav className="hidden md:flex items-center gap-6 sm:gap-8">
              <button className="flex items-center gap-2 text-white hover:text-pink-300 text-sm font-medium transition-colors">
                🏠 Homes
              </button>
              <button className="flex items-center gap-2 text-white hover:text-pink-300 text-sm font-medium transition-colors">
                🎈 Experiences
                <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  NEW
                </span>
              </button>
              <button className="flex items-center gap-2 text-white hover:text-pink-300 text-sm font-medium transition-colors">
                🔒 Services
                <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  NEW
                </span>
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <button className="hidden md:block text-sm font-medium hover:bg-pink-700 px-4 py-2 rounded-lg transition-colors text-white">
              Become a host
            </button>
            <button className="p-2 hover:bg-pink-700 rounded-full transition-colors text-white">
              <Globe size={20} />
            </button>
            <button
              className="p-2 hover:bg-pink-700 rounded-full transition-colors md:hidden text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-momondo-purple shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            className="p-2 hover:bg-pink-700 rounded-full text-white"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-6 mt-4">
          <button
            className="text-left hover:text-pink-300"
            onClick={() => setMenuOpen(false)}
          >
            🏠 Homes
          </button>
          <button
            className="text-left hover:text-pink-300"
            onClick={() => setMenuOpen(false)}
          >
            🎈 Experiences
          </button>
          <button
            className="text-left hover:text-pink-300"
            onClick={() => setMenuOpen(false)}
          >
            🔒 Services
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pb-12">
        <ListingSection
          title="Kathmandu"
          sectionKey="Kathmandu"
          items={listings.Kathmandu}
        />
        <ListingSection
          title="Pokhara"
          sectionKey="Pokhara"
          items={listings.Pokhara}
        />
        <ListingSection
          title="Tokyo"
          sectionKey="Tokyo"
          items={listings.Tokyo}
        />
      </main>

      {/* Footer */}
      <footer className="bg-momondo-purple border-t border-white/20 py-8 sm:py-12 text-white">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                Support
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Safety information
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Cancellation options
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                Community
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Airbnb Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                Hosting
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Try hosting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Hosting resources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Community forum
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                Company
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-pink-300">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pink-300">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs sm:text-sm">
            <p>© 2025 Airbnb, Inc. All rights reserved</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-pink-300">
                Privacy
              </a>
              <a href="#" className="hover:text-pink-300">
                Terms
              </a>
              <a href="#" className="hover:text-pink-300">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}