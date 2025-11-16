import { Link } from "react-router-dom";
import MomondoLogo from "../components/MomondoLogo";

export default function Footer() {
  return (
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
          <div className="flex items-center gap-2">
            <Link to="/home" className="cursor-pointer hover:opacity-80 transition-opacity">
              <MomondoLogo />
            </Link>
          </div>
          <p>© 2025 momondo, Inc. All rights reserved</p>
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
  );
}
