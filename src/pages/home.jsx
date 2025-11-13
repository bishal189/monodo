"use client";

import { useState } from "react";
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
import PrimaryNav from "../components/PrimaryNav";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const listings = {
    kathmandu: [
      {
        id: 1,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-seoul-cozy-FDUJ07tdkXWQyAwQhtQu1ddBUO5hZD.jpg",
        name: "Apartment in Kathmandu",
        price: "$26 for 2 nights",
        rating: 4.95,
        reviews: 128,
      },
      {
        id: 2,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-seoul-cozy-FDUJ07tdkXWQyAwQhtQu1ddBUO5hZD.jpg",
        name: "Room in Lalitpur",
        price: "$64 for 2 nights",
        rating: 4.99,
        reviews: 214,
      },
      {
        id: 3,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-seoul-cozy-FDUJ07tdkXWQyAwQhtQu1ddBUO5hZD.jpg",
        name: "Room in Lalitpur",
        price: "$28 for 2 nights",
        rating: 4.96,
        reviews: 189,
      },
      {
        id: 4,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-seoul-cozy-FDUJ07tdkXWQyAwQhtQu1ddBUO5hZD.jpg",
        name: "Apartment in Kathmandu",
        price: "$156 for 2 nights",
        rating: 4.96,
        reviews: 245,
      },
      {
        id: 5,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-seoul-cozy-FDUJ07tdkXWQyAwQhtQu1ddBUO5hZD.jpg",
        name: "Apartment in Kathmandu",
        price: "$71 for 2 nights",
        rating: 4.81,
        reviews: 167,
      },
      {
        id: 6,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-seoul-cozy-FDUJ07tdkXWQyAwQhtQu1ddBUO5hZD.jpg",
        name: "Apartment in Kathmandu",
        price: "$89 for 2 nights",
        rating: 4.97,
        reviews: 298,
      },
      {
        id: 7,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-seoul-cozy-FDUJ07tdkXWQyAwQhtQu1ddBUO5hZD.jpg",
        name: "Apartment in Lalitpur",
        price: "$80 for 2 nights",
        rating: 4.97,
        reviews: 156,
      },
    ],
    seoul: [
      {
        id: 8,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/home-seoul-modern-NQN4Uhn4eN750K2AxVKlGEoOmpZqCt.jpg",
        name: "Room in Jongno-gu",
        price: "$168 for 2 nights",
        rating: 4.94,
        reviews: 342,
      },
      {
        id: 9,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/home-seoul-modern-NQN4Uhn4eN750K2AxVKlGEoOmpZqCt.jpg",
        name: "Room in Dongjak-gu",
        price: "$166 for 2 nights",
        rating: 4.95,
        reviews: 428,
      },
      {
        id: 10,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/home-seoul-modern-NQN4Uhn4eN750K2AxVKlGEoOmpZqCt.jpg",
        name: "Home in Seoul",
        price: "$140 for 2 nights",
        rating: 5.0,
        reviews: 612,
      },
      {
        id: 11,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/home-seoul-modern-NQN4Uhn4eN750K2AxVKlGEoOmpZqCt.jpg",
        name: "Room in Mapo-gu",
        price: "$81 for 2 nights",
        rating: 4.87,
        reviews: 298,
      },
      {
        id: 12,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/home-seoul-modern-NQN4Uhn4eN750K2AxVKlGEoOmpZqCt.jpg",
        name: "Room in Seoul",
        price: "$253 for 2 nights",
        rating: 4.99,
        reviews: 567,
      },
      {
        id: 13,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/home-seoul-modern-NQN4Uhn4eN750K2AxVKlGEoOmpZqCt.jpg",
        name: "Hotel in Seoul",
        price: "$765 for 2 nights",
        rating: 5.0,
        reviews: 890,
      },
      {
        id: 14,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/home-seoul-modern-NQN4Uhn4eN750K2AxVKlGEoOmpZqCt.jpg",
        name: "Apartment in Seoul",
        price: "$380 for 2 nights",
        rating: 4.97,
        reviews: 734,
      },
    ],
    tokyo: [
      {
        id: 15,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-lalitpur-balcony-view-Sjjm7v43pSpaeCmfTYcGdBNerKTZ5L.jpg",
        name: "Apartment in Shibuya",
        price: "$156 for 2 nights",
        rating: 4.98,
        reviews: 567,
      },
      {
        id: 16,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-lalitpur-balcony-view-Sjjm7v43pSpaeCmfTYcGdBNerKTZ5L.jpg",
        name: "Room in Asakusa",
        price: "$98 for 2 nights",
        rating: 4.92,
        reviews: 423,
      },
      {
        id: 17,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-lalitpur-balcony-view-Sjjm7v43pSpaeCmfTYcGdBNerKTZ5L.jpg",
        name: "Condo in Shinjuku",
        price: "$203 for 2 nights",
        rating: 4.99,
        reviews: 678,
      },
      {
        id: 18,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-lalitpur-balcony-view-Sjjm7v43pSpaeCmfTYcGdBNerKTZ5L.jpg",
        name: "Apartment in Minato",
        price: "$145 for 2 nights",
        rating: 4.96,
        reviews: 534,
      },
      {
        id: 19,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-lalitpur-balcony-view-Sjjm7v43pSpaeCmfTYcGdBNerKTZ5L.jpg",
        name: "Room in Harajuku",
        price: "$76 for 2 nights",
        rating: 4.88,
        reviews: 301,
      },
      {
        id: 20,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-lalitpur-balcony-view-Sjjm7v43pSpaeCmfTYcGdBNerKTZ5L.jpg",
        name: "Penthouse in Tokyo",
        price: "$456 for 2 nights",
        rating: 5.0,
        reviews: 892,
      },
      {
        id: 21,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/room-lalitpur-balcony-view-Sjjm7v43pSpaeCmfTYcGdBNerKTZ5L.jpg",
        name: "Traditional Stay in Tokyo",
        price: "$234 for 2 nights",
        rating: 4.97,
        reviews: 612,
      },
    ],
  };

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
        alt={listing.name}
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
        {listing.name}
      </h3>
      <p className="text-pink-200 text-xs sm:text-sm">{listing.price}</p>
      <div className="flex items-center gap-1 mt-1">
        <Star size={14} fill="#FFD700" className="text-yellow-400" />
        <span className="text-xs sm:text-sm font-medium text-white">
          {listing.rating}
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
      <PrimaryNav/>
     

      {/* Main Content */}
      <main className="pb-12">
        <ListingSection
          title="Popular homes in Kathmandu"
          sectionKey="kathmandu"
          items={listings.kathmandu}
        />
        <ListingSection
          title="Available next month in Seoul"
          sectionKey="seoul"
          items={listings.seoul}
        />
        <ListingSection
          title="Stay in Tokyo"
          sectionKey="tokyo"
          items={listings.tokyo}
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
                    momondo Community
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