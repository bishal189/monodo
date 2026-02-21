import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import apiClient from "../services/apiClient";

const staticReviews = [
  { id: 1, text: "Great product! Highly recommended." },
  { id: 2, text: "Good quality and fast delivery." },
  { id: 3, text: "Satisfied with my purchase." },
  { id: 4, text: "Excellent value for money." },
  { id: 5, text: "Would buy again in the future." },
];

const formatCurrency = (amount) => {
  const numeric = Number(amount ?? 0);
  if (Number.isNaN(numeric)) {
    return amount ?? "N/A";
  }
  return numeric.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

export default function GetStarted() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  const fetchDashboard = async () => {
    setError(null);
    try {
      const response = await apiClient.get("/api/product/dashboard/");
      setDashboardData(response?.data ?? {});
    } catch {
      setError("Unable to load dashboard. Please try again shortly.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      await fetchDashboard();
      if (!cancelled) setIsLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-momondo-purple text-white flex flex-col">
        <PrimaryNav />
        <main className="flex-1 px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-100" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-momondo-purple text-white flex flex-col">
        <PrimaryNav />
        <main className="flex-1 px-4 py-8 flex items-center justify-center">
          <div className="bg-red-500/10 border border-red-500/30 text-red-100 rounded-2xl px-6 py-4 text-sm">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalBalance = Number(dashboardData?.total_balance ?? 0);
  const minimumBalance = Number(dashboardData?.minimum_balance ?? 0);
  const balanceFrozen = Boolean(dashboardData?.balance_frozen);
  const balanceFrozenAmount = Number(dashboardData?.balance_frozen_amount ?? 0);
  const effectiveBalance = balanceFrozen ? balanceFrozenAmount : totalBalance;
  const commissionRate = Number(dashboardData?.commission_rate ?? 0);
  const todaysCommission = Number(dashboardData?.todays_commission ?? 0);
  const entitlements = Number(dashboardData?.entitlements ?? 0);
  const completed = Number(dashboardData?.completed ?? 0);

  const handleGenerate = async () => {
    if (minimumBalance > 0 && effectiveBalance < minimumBalance) {
      setShowInsufficientModal(true);
      return;
    }
    setIsLoadingProduct(true);
    setCurrentProduct(null);
    setSelectedReviewId(null);
    try {
      const response = await apiClient.get("/api/product/dashboard-products/");
      const products = response?.data?.products ?? [];
      setCurrentProduct(products[0] ?? null);
    } catch {
      setCurrentProduct(null);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReviewId) {
      toast.error("Please select a review.");
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedReview = staticReviews.find((r) => r.id === selectedReviewId);
      const response = await apiClient.post("/api/product/review/", {
        product_id: currentProduct.id,
        review_text: selectedReview.text,
      });
      const msg = response?.data?.message || "Review submitted successfully!";
      toast.success(msg);
      setCurrentProduct(null);
      setSelectedReviewId(null);
      await fetchDashboard();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Unable to submit review. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-momondo-purple text-white flex flex-col">
      <PrimaryNav />

      <main className="flex-1 px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <section className="rounded-3xl bg-white/10 border border-white/15 shadow-inner shadow-black/10 px-5 py-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-purple-200">Overview</p>
              <p className="text-base font-semibold text-white mt-1">Records Summary</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              <div className={`rounded-2xl border px-4 py-4 ${totalBalance < 0 ? "bg-red-500/20 border-red-500/40" : "bg-white/10 border-white/15"}`}>
                <p className="text-xs uppercase tracking-wide text-purple-200">Total Balance</p>
                <p className={`text-xl font-semibold mt-1 ${totalBalance < 0 ? "text-red-200" : ""}`}>
                  {formatCurrency(totalBalance)}
                </p>
                {totalBalance < 0 && (
                  <p className="text-xs text-red-200/90 mt-1">Balance frozen. Please contact support to resolve.</p>
                )}
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Level&apos;s Commission</p>
                <p className="text-xl font-semibold mt-1">{commissionRate}%</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Today&apos;s Commission</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(todaysCommission)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Entitlements</p>
                <p className="text-xl font-semibold mt-1">{entitlements}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Completed</p>
                <p className="text-xl font-semibold mt-1">{completed}</p>
              </div>
            </div>
          </section>

          {entitlements > 0 && entitlements === completed ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-green-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-xl font-bold text-green-400 mb-2">Congratulations!</p>
              <p className="text-lg font-semibold text-white mb-2">You&apos;ve completed your journey</p>
              <p className="text-sm text-purple-200 text-center max-w-sm">
                All {entitlements} products have been reviewed. Great job! You can now withdraw your earnings.
              </p>
            </div>
          ) : !currentProduct ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-white mb-4">Ready for the journey?</p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoadingProduct}
                className="min-w-[280px] px-16 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingProduct ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/10 overflow-hidden">
                {currentProduct.image_url && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={currentProduct.image_url}
                      alt={currentProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-4">
                  <h3 className="text-white font-bold text-lg">{currentProduct.title ?? "N/A"}</h3>
                  {currentProduct.description && (
                    <p className="text-purple-200 text-sm">{currentProduct.description}</p>
                  )}
                  <div className="border-t border-dashed border-white/20 pt-3 space-y-2.5 text-sm text-purple-100">
                    <div className="flex items-center justify-between">
                      <span>Price</span>
                      <span className="font-semibold text-white">{formatCurrency(currentProduct.effective_price ?? currentProduct.price ?? 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Commission</span>
                      <span className="font-semibold text-white">{formatCurrency(currentProduct.commission_amount ?? 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Commission Rate</span>
                      <span className="font-semibold text-green-400">{currentProduct.commission_rate ?? 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Value</span>
                      <span className="font-semibold text-white">{formatCurrency(Number(currentProduct.effective_price ?? currentProduct.price ?? 0) + Number(currentProduct.commission_amount ?? 0))}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <select
                      value={selectedReviewId ?? ""}
                      onChange={(e) => setSelectedReviewId(Number(e.target.value) || null)}
                      className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10"
                    >
                      <option value="" disabled className="bg-momondo-purple">Select review...</option>
                      {staticReviews.map((r) => (
                        <option key={r.id} value={r.id} className="bg-momondo-purple">{r.text}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={!selectedReviewId || isSubmitting}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {showInsufficientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowInsufficientModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Insufficient Balance</h3>
              <button
                type="button"
                onClick={() => setShowInsufficientModal(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 pb-4">
              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <svg className="w-6 h-6 flex-shrink-0 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">You have insufficient balance.</p>
                  <p className="text-sm text-gray-600 mt-0.5">Please deposit funds to continue.</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button
                type="button"
                onClick={() => setShowInsufficientModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInsufficientModal(false);
                  navigate("/deposit");
                }}
                className="flex-1 px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
              >
                Yes, Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
