import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  FileText, 
  Wallet, 
  ArrowDownCircle,
  Gift, 
  HelpCircle, 
  Info, 
  Rocket,
  LogOut
} from "lucide-react";
import { toast } from "react-toastify";
import MomondoLogo from "./MomondoLogo";
import apiClient, { clearAuthStorage, getStoredUser, storeUser } from "../services/apiClient";

const navItems = [
  { path: "/records", label: "Records", icon: FileText },
  { path: "/deposit", label: "Deposit", icon: Wallet },
  { path: "/withdraw", label: "Withdraw", icon: ArrowDownCircle },
  { path: "/invite", label: "Invite", icon: Gift },
  { path: "/faq", label: "FAQ", icon: HelpCircle },
  { path: "/about", label: "About", icon: Info },
  { path: "/get-started", label: "Get Started", icon: Rocket },
];

export default function PrimaryNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [storedUser, setStoredUser] = useState(() => getStoredUser());
  const username = storedUser?.username ?? storedUser?.phone_number ?? "User";

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const { data } = await apiClient.get("/profile/");
        if (!isMounted) return;
        if (data) {
          setStoredUser(data);
          storeUser(data);
        }
      } catch (error) {
        console.error("Failed to refresh profile information", error);
      }
    };

    if (!storedUser?.level?.display_name) {
      loadProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [storedUser?.level?.display_name]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    clearAuthStorage();
    toast.success("Logged out.");
    navigate("/login");
    setStoredUser(null);
  };

  const isActivePath = (path) => location.pathname.startsWith(path);

  return (
    <>
      <header className="border-b border-white/20 sticky top-0 bg-momondo-purple z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-10 lg:gap-12 min-w-0">
            <Link to="/home" className="cursor-pointer hover:opacity-80 transition-opacity">
              <MomondoLogo />
            </Link>
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7 text-sm">
              {navItems.map((item) => {
                const isActive = isActivePath(item.path);
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive ? "text-pink-300" : "text-white hover:text-pink-300"
                    }`}
                  >
                    <IconComponent size={18} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:flex items-center text-xs sm:text-sm text-white/80 whitespace-nowrap max-w-[180px] lg:max-w-none overflow-hidden">
              Logged in as{" "}
              <span className="ml-1 font-semibold text-white truncate">{username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-medium bg-white/10 hover:bg-pink-600 px-3 sm:px-4 py-2 rounded-lg transition-colors text-white border border-white/20"
            >
              <LogOut size={16} />
              <span>Logout</span>
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

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

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
        <div className="px-6 text-white space-y-1">
          <p className="text-sm text-white/70">Logged in as</p>
          <p className="text-lg font-semibold">{username}</p>
          <p className="text-xs text-white/60">
            Level: <span className="font-medium text-white">{storedUser?.level?.display_name ?? "N/A"}</span>
          </p>
        </div>
        <nav className="flex flex-col gap-4 px-6 mt-6 text-white">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                className={`flex items-center gap-2 text-left hover:text-pink-300 ${
                  isActive ? "text-pink-300" : "text-white"
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                <IconComponent size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            className="flex items-center gap-2 text-left hover:text-pink-300"
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}

