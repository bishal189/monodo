import { Gift, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import { toast } from "react-toastify";
import apiClient, { storeUser } from "../services/apiClient";

export default function Invite() {
  const [profile, setProfile] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInviteData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/api/auth/invite/");
        const inviteData = response?.data ?? {};
        setProfile(inviteData);
        setReferralCode(inviteData.invitation_code ?? "");
        if (inviteData) {
          storeUser(inviteData);
        }
      } catch (err) {
        console.error("Failed to load invite data", err);
        setError("Unable to fetch your invitation code. Please try again later.");
        setReferralCode("");
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInviteData();
  }, []);

  const handleCopy = async () => {
    if (!referralCode) {
      toast.error("Invitation code not available yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Invitation code copied!");
    } catch (error) {
      toast.error("Unable to copy. Please try manually.");
    }
  };

  const handleShare = async () => {
    if (!referralCode) {
      toast.error("Invitation code not available yet.");
      return;
    }

    const shareMessage = `Join me on Momondo! Use invitation code ${referralCode} to get started.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Invite Friends",
          text: shareMessage,
        });
        toast.success("Invitation shared!");
      } catch (error) {
        if (error?.name !== "AbortError") {
          toast.error("Unable to share. Try copying instead.");
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Invite Friends</h1>
            <p className="text-sm text-purple-200">Share your code and earn rewards together.</p>
          </div>

          <section className="bg-white/10 border border-white/15 rounded-3xl overflow-hidden shadow-lg shadow-black/20">
            <div className="relative bg-gradient-to-br from-[#07121f] via-[#07121f] to-[#10253f] px-6 py-12 flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#3b82f6_0%,transparent_60%)]" />
              <div className="relative flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full border border-white/40 flex items-center justify-center text-white">
                  <Gift className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <p className="uppercase tracking-[0.4em] text-xs text-cyan-200">Invite & Earn</p>
                  <h2 className="text-3xl font-bold text-white">Refer a Friend</h2>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 space-y-5 text-center">
              <div className="flex justify-center">
                <div className="h-14 w-14 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-inner">
                  <span className="text-xl font-semibold">
                    {(profile?.username ?? profile?.phone_number ?? "U").slice(0, 1).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-white">Refer friend</h3>
                <p className="text-sm text-purple-100">Copy your code, share it with your friends, and grow together.</p>
              </div>

              {profile && (
                <div className="mx-auto max-w-sm bg-white/10 border border-white/15 rounded-2xl px-4 py-3 shadow-inner space-y-2 text-sm">
                  <div className="flex items-center justify-between text-white/90">
                    <span className="uppercase tracking-wide text-xs text-purple-200">Signed in as</span>
                    <span className="font-semibold text-white">{profile.username}</span>
                  </div>
                  {profile.email && (
                    <div className="flex items-center justify-between text-white/90">
                      <span className="uppercase tracking-wide text-xs text-purple-200">Email</span>
                      <span className="font-semibold text-white text-xs truncate ml-2">{profile.email}</span>
                    </div>
                  )}
                  {profile.level?.level_name && (
                    <div className="flex items-center justify-between text-white/90">
                      <span className="uppercase tracking-wide text-xs text-purple-200">Level</span>
                      <span className="font-semibold text-pink-200">
                        {profile.level.level_name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {isLoading && (
                <p className="text-sm text-purple-200">Loading your invitation code...</p>
              )}

              {error && !isLoading && (
                <p className="text-sm text-red-200">{error}</p>
              )}

              <div className="flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow-inner shadow-black/10 max-w-xs mx-auto">
                <span className="text-lg font-semibold text-momondo-purple tracking-widest">{referralCode || "------"}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition shadow shadow-pink-500/40"
                >
                  Copy
                </button>
              </div>

              <div className="grid gap-2 text-left text-sm text-purple-100">
                <p>• Share your unique code with friends and earn rewards when they complete their first reservation.</p>
                <p>• The more friends you invite, the more bonuses you unlock for future tours and experiences.</p>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-full transition shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2"
              >
                <Share2 className="h-5 w-5" />
                <span>Send Invitation</span>
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

