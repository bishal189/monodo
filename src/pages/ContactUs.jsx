import { useEffect, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import { openLiveChatWithRetries } from "../lib/openLiveChat";
import { fetchContactPublic } from "../services/contactPublic";

const liveChatBtnClass =
  "inline-flex items-center justify-center gap-3 w-full max-w-sm py-4 px-8 rounded-full text-base font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 shadow-[0_10px_40px_-10px_rgba(236,72,153,0.6)] hover:shadow-[0_14px_44px_-10px_rgba(236,72,153,0.7)] hover:brightness-105 active:scale-[0.98] transition-all duration-200";

const whatsappBtnClass =
  "inline-flex items-center justify-center gap-3 w-full max-w-sm py-4 px-8 rounded-full text-base font-semibold text-white bg-[#25D366] shadow-[0_10px_40px_-10px_rgba(37,211,102,0.45)] hover:bg-[#20BD5A] hover:shadow-[0_14px_44px_-10px_rgba(37,211,102,0.55)] active:scale-[0.98] transition-all duration-200";

function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export default function ContactUs() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const data = await fetchContactPublic();
        if (!cancelled) {
          setPhoneNumber(typeof data?.phone_number === "string" ? data.phone_number : "");
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const digits = digitsOnly(phoneNumber);
  const whatsappHref = digits ? `https://wa.me/${digits}` : null;

  return (
    <div className="min-h-screen bg-momondo-purple text-white flex flex-col">
      <PrimaryNav />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-purple-200">Contact</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Talk to us</h1>
            <p className="text-sm text-purple-200/90">
              Open live chat — our team replies during business hours.
            </p>
          </div>
          <div className="flex flex-col items-center gap-5 w-full">
            <button type="button" onClick={() => openLiveChatWithRetries()} className={liveChatBtnClass}>
              <MessageCircle className="h-6 w-6 shrink-0" aria-hidden />
              Open live chat
            </button>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-purple-200 text-sm pt-2">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                Loading…
              </div>
            )}

            {loadError && !loading && (
              <p className="text-sm text-red-300 pt-2">Could not load contact options. Please try again later.</p>
            )}

            {!loading && !loadError && whatsappHref && (
              <div className="w-full max-w-sm pt-4 mt-1 border-t border-white/10">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={whatsappBtnClass}
                >
                  Connect via WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
