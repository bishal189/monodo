import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
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
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState({});
  const [submittingProducts, setSubmittingProducts] = useState({});
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/api/product/dashboard/");
        console.log(response.data,'response data')
        setDashboardData(response?.data ?? {});
      } catch (err) {
        setError("Unable to load dashboard at the moment. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboardData?.products) {
      const pending = dashboardData.products.filter(product => product.review_status !== "COMPLETED");
      if (pending.length > 0 && currentProductIndex >= pending.length) {
        setCurrentProductIndex(pending.length - 1);
      }
    }
  }, [dashboardData, currentProductIndex]);

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

  const recordsSummary = dashboardData?.records_summary ?? {};
  const commissionRate = dashboardData?.commission_rate ?? 0;
  const allProducts = dashboardData?.products ?? [];
  const productCount = dashboardData?.product_count ?? 0;
  
  const totalBalance = Number(recordsSummary.total_balance ?? 0);
  const requiredAmount = Number(recordsSummary.required_amount ?? 0);
  const canReview = totalBalance >= requiredAmount;
  
  const pendingProducts = allProducts.filter(product => product.review_status !== "COMPLETED");
  const currentProduct = currentProductIndex >= 0 && currentProductIndex < pendingProducts.length 
    ? pendingProducts[currentProductIndex] 
    : null;
  const hasMoreProducts = currentProductIndex < pendingProducts.length - 1;
  const allProductsShown = currentProductIndex >= pendingProducts.length - 1 && pendingProducts.length > 0;

  const handleReviewChange = (productId, reviewId) => {
    setSelectedReviews((prev) => ({
      ...prev,
      [productId]: reviewId,
    }));
  };

  const handleSubmitReview = async (productId) => {
    const selectedReviewId = selectedReviews[productId];
    if (!selectedReviewId) {
      toast.error("Please select a review before submitting.");
      return;
    }

    if (!canReview) {
      toast.error(`Insufficient balance. Required: ${formatCurrency(requiredAmount)}, Current: ${formatCurrency(totalBalance)}`);
      return;
    }

    setSubmittingProducts((prev) => ({
      ...prev,
      [productId]: true,
    }));

    try {
      const selectedReview = staticReviews.find((r) => r.id === selectedReviewId);
      
      await apiClient.post("/api/product/review/", {
        product_id: productId,
        review_text: selectedReview.text,
      });

      toast.success("Review submitted successfully!");
      
      setSelectedReviews((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      const response = await apiClient.get("/api/product/dashboard/");
      console.log(response.data,'response data')
      const updatedProducts = response?.data?.products ?? [];
      const updatedPending = updatedProducts.filter(product => product.review_status !== "COMPLETED");
      
      setDashboardData(response?.data ?? {});
      
      if (currentProductIndex < updatedPending.length - 1) {
        setCurrentProductIndex(prev => prev + 1);
      } else if (updatedPending.length > 0 && currentProductIndex >= updatedPending.length) {
        setCurrentProductIndex(updatedPending.length - 1);
      }
    } catch (err) {
      console.error("Failed to submit review", err);
      const errorMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Unable to submit review. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmittingProducts((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-momondo-purple text-white flex flex-col">
      <PrimaryNav />

      <main className="flex-1 px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <section className="rounded-3xl bg-white/10 border border-white/15 shadow-inner shadow-black/10 px-5 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-200">Overview</p>
                <p className="text-base font-semibold text-white mt-1">Records Summary</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Total Balance</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(recordsSummary.total_balance ?? 0)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Today's Commission</p>
                <p className="text-xl font-semibold mt-1">{commissionRate}%</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Entitlements</p>
                <p className="text-xl font-semibold mt-1">{recordsSummary.entitlements ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Completed</p>
                <p className="text-xl font-semibold mt-1">{recordsSummary.completed ?? 0}</p>
              </div>
            </div>
          </section>

          {pendingProducts.length > 0 && (
            <section className="rounded-3xl bg-white/10 border border-white/15 shadow-inner shadow-black/10 px-5 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-purple-200">Products</p>
                  <p className="text-base font-semibold text-white mt-1">
                    Product {currentProductIndex + 1} of {pendingProducts.length}
                  </p>
                </div>
              </div>

              {currentProduct ? (
                <div className="max-w-md mx-auto">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/10 overflow-hidden hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
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
                      <div>
                        <h3 className="text-white font-bold text-lg mb-3">{currentProduct.title ?? "N/A"}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-pink-300 text-xl font-bold">{formatCurrency(currentProduct.price ?? 0)}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm">
                              <span className="text-purple-200">Rate: </span>
                              <span className="text-green-400 font-semibold">{currentProduct.commission_rate ?? 0}%</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-purple-200">Commission: </span>
                              <span className="text-green-400 font-semibold">{formatCurrency(currentProduct.commission_amount ?? 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!canReview && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-100 rounded-xl px-4 py-3 text-sm mb-3">
                          <p className="font-semibold text-yellow-200 mb-1">Insufficient Balance</p>
                          <p className="text-yellow-100/80 text-xs">
                            Your balance ({formatCurrency(totalBalance)}) is less than the required amount ({formatCurrency(requiredAmount)}). 
                            Please deposit more funds to review products.
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <select
                          value={selectedReviews[currentProduct.id] || ""}
                          onChange={(e) => handleReviewChange(currentProduct.id, Number(e.target.value))}
                          disabled={!canReview}
                          className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="" disabled className="bg-momondo-purple">Select review...</option>
                          {staticReviews.map((review) => (
                            <option key={review.id} value={review.id} className="bg-momondo-purple">
                              {review.text}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleSubmitReview(currentProduct.id)}
                          disabled={!canReview || !selectedReviews[currentProduct.id] || submittingProducts[currentProduct.id]}
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {submittingProducts[currentProduct.id] ? (
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
              ) : allProductsShown ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 text-green-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-lg font-semibold text-white mb-2">All products reviewed!</p>
                  <p className="text-sm text-purple-200 text-center">
                    You have completed reviewing all available products.
                  </p>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
