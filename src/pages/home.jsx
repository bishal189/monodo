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
    Dubai: [
      {
        id: 1,
        image:
          "https://www.momondo.com/rimg/himg/52/7c/f4/expedia_group-2423447-c08ce1-359170.jpg?width=968&height=607&crop=true",
        name: "Tecom, Hessa Street, Al Barsha South, 1, Dubai",
        price: "$172 for 2 nights",
        rating: 4,
        reviews: 128,
      },
      {
        id: 2,
        image:"https://content.r9cdn.net/rimg/himg/09/dc/33/expedia_group-5536349-177164054-662774.jpg?width=1020&height=1020&xhint=1080&yhint=666&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Jumeirah Village, Dubai",
        price: "$399 for 2 nights",
        rating: 4.99,
        reviews: 214,
      },
      {
        id: 3,
        image:"https://content.r9cdn.net/rimg/himg/2b/ad/54/expedia_group-302708-d7997d-944849.jpg?width=1020&height=1020&xhint=520&yhint=333&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Atlantis, The Palm, Dubai",
        price: "$1020 for 2 nights",
        rating: 4.96,
        reviews: 189,
      },
      {
        id: 4,
        image:"https://content.r9cdn.net/rimg/himg/52/33/f5/ice-7057498-122953719-113267.jpg?width=1020&height=1020&xhint=1497&yhint=960&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Marasi Drive,Dubai",
        price: "$385 for 2 nights",
        rating: 4.96,
        reviews: 245,
      },
      {
        id: 5,
        image:"https://content.r9cdn.net/rimg/himg/74/05/e4/leonardo-12863-177478294-689353.jpg?width=1020&height=1020&xhint=1620&yhint=843&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Jumeirah Burj Al Arab ,Dubai",
        price: "$1728 for 2 nights",
        rating: 4.81,
        reviews: 167,
      },
      {
        id: 6,
        image:"https://content.r9cdn.net/rimg/himg/50/4e/ff/leonardo-139875-1721876-938194.jpg?width=1020&height=1020&xhint=1440&yhint=1000&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Le Méridien Dubai Hotel & Conference Centre",
        price: "$330 for 2 nights",
        rating: 4.97,
        reviews: 298,
      },
    ],
    Paris: [
      {
        id: 8,
        image:"https://www.momondo.com/rimg/himg/c3/da/26/leonardo-1070927-7229_sm_05_p_3000x2250_O-230896.jpg?width=836&height=607&crop=true",
        name: "Pullman Paris Tour Eiffel",
        price: "$431 for 2 nights",
        rating: 4.94,
        reviews: 342,
      },
      {
        id: 9,
        image:"https://content.r9cdn.net/rimg/himg/48/f8/dc/leonardo-1237489-Cit_Tour_Eiffel_Studio_Eiffel_Tower_View_.06-HR_O-353561.jpg?width=1020&height=1020&xhint=1500&yhint=1259&crop=true&watermarkheight=28&watermarkpadding=10 ",
        name: "Citadines Tour Eiffel Paris",
        price: "$204 for 2 nights",
        rating: 4.95,
        reviews: 428,
      },
      {
        id: 10,
        image:"https://www.momondo.com/rimg/himg/01/ae/5b/leonardo-2936883-2119340-208422.jpg?width=836&height=607&crop=true",
        name: "CitizenM Paris Gare de Lyon",
        price: "$186 for 2 nights",
        rating: 4.0,
        reviews: 612,
      },
      {
        id: 11,
        image:"https://content.r9cdn.net/rimg/himg/6b/28/97/ice-21536-6e15d3-401908.jpg?width=1020&height=1020&xhint=1440&yhint=1036&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Novotel Paris Centre Tour Eiffel",
        price: "$172 for 2 nights",
        rating: 4.87,
        reviews: 298,
      },
      {
        id: 12,
        image:"https://content.r9cdn.net/rimg/himg/d9/a8/54/leonardo-20514-196423458-137046.jpg?width=1020&height=1020&xhint=1560&yhint=1000&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Intercontinental Hotels Paris",
        price: "$667 for 2 nights",
        rating: 4.99,
        reviews: 567,
      },
      {
        id: 13,
        image:"https://content.r9cdn.net/rimg/himg/47/cc/40/ice-2074945-b82cd4-759010.jpg?width=1020&height=1020&xhint=1500&yhint=1080&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Molitor Hotel & Spa Paris MGallery Collection",
        price: "$348 for 2 nights",
        rating: 4.5,
        reviews: 890,
      },
    ],
    tokyo: [
      {
        id: 15,
        image:"https://www.momondo.com/rimg/himg/8a/9c/ba/leonardo-97042-1463735-035159.jpg?width=968&height=607&crop=true",
        name: "The Prince Sakura Tower ,Tokyo ",
        price: "$416 for 2 nights",
        rating: 4.98,
        reviews: 567,
      },
      {
        id: 16,
        image:"https://www.momondo.com/rimg/himg/3a/0f/fd/ostrovok-185421-9b4b34-080446.jpg?width=968&height=607&crop=true",
        name: "Intercontinental Hotels The Strings ,Tokyo",
        price: "$526 for 2 nights",
        rating: 4.92,
        reviews: 423,
      },
      {
        id: 17,
        image:"https://content.r9cdn.net/rimg/himg/cd/e9/b3/leonardo-1070660018-165512733-186681.jpg?width=552&height=552&xhint=1500&yhint=1000&crop=true&watermarkheight=28&watermarkpadding=10",
        name: "Hotel Indigo Tokyo Shibuya",
        price: "$523 for 2 nights",
        rating: 4.99,
        reviews: 678,
      },
      {
        id: 18,
        image:"https://www.momondo.com/rimg/kimg/ff/93/8a5bf4406ad07e7f.jpg?width=968&height=607&crop=true",
        name: "Asakusa Kokono Club Hotel",
        price: "$201 for 2 nights",
        rating: 4.96,
        reviews: 534,
      },
      {
        id: 19,
        image:"https://www.momondo.com/rimg/himg/bf/9b/51/leonardo-67422-989402-367889.jpg?width=968&height=607&crop=true",
        name: "Sheraton Grande Tokyo Bay Hotel",
        price: "$445 for 2 nights",
        rating: 4.88,
        reviews: 301,
      },
      {
        id: 20,
        image:"https://www.momondo.com/rimg/himg/4b/5f/96/ice-546402-97706102-704553.jpg?width=968&height=607&crop=true",
        name: "Hotel New Otani Tokyo The Main",
        price: "$434 for 2 nights",
        rating: 5.0,
        reviews: 892,
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
          title="Popular Hotels in Dubai"
          sectionKey="Dubai"
          items={listings.Dubai}
        />
        <ListingSection
          title="Popular Hotels in Paris"
          sectionKey="Paris"
          items={listings.Paris}
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