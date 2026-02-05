import { useEffect, useState } from "react";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
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

const statusFilters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

const statusMeta = {
  pending: {
    icon: Clock,
    labelClass: "bg-yellow-500/20 text-yellow-200",
    iconClass: "text-yellow-300",
    label: "Pending",
  },
  completed: {
    icon: CheckCircle,
    labelClass: "bg-emerald-100 text-emerald-700",
    iconClass: "text-emerald-700",
    label: "Completed",
  },
};

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

const formatTimestamp = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

function RecordCard({ record, selectedReviewId, onReviewChange, onSubmit, isSubmitting, canReview, userBalance, requiredAmount }) {
  const meta = statusMeta[record.statusKey];
  const Icon = meta?.icon ?? Clock;

  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl overflow-hidden shadow-lg shadow-black/20">
      <div className="px-4 pt-4 pb-3 space-y-4">
        {record.imageUrl && (
          <img
            src={record.imageUrl}
            alt={record.title}
            className="w-full aspect-[7/5] object-cover rounded-2xl"
            loading="lazy"
          />
        )}
        <h3 className="text-base font-semibold text-white">{record.title}</h3>
        <div className="border-t border-dashed border-white/20 pt-3 space-y-2.5 text-sm text-purple-100">
          <div className="flex items-center justify-between">
            <span>Price</span>
            <span className="font-semibold text-white">{record.priceDisplay}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Commission</span>
            <span className="font-semibold text-white">{record.commissionDisplay}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Value</span>
            <span className="font-semibold text-white">{record.totalValueDisplay}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${meta?.labelClass}`}>
            <Icon className={`h-4 w-4 ${meta?.iconClass}`} />
            <span>{meta?.label ?? record.status}</span>
          </div>
          <span className="text-xs text-purple-200">{record.timestampDisplay}</span>
        </div>
      </div>

      {record.statusKey === 'pending' && (
        <div className="px-4 pb-4 space-y-3">
          {!canReview && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-100 rounded-xl px-4 py-3 text-sm mb-3">
              <p className="font-semibold text-yellow-200 mb-1">Insufficient Balance</p>
              <p className="text-yellow-100/80 text-xs">
                Your balance ({formatCurrency(userBalance)}) is less than the required amount ({formatCurrency(requiredAmount)}). 
                Please deposit more funds to review products.
              </p>
            </div>
          )}

          <select
            value={selectedReviewId || ""}
            onChange={(e) => onReviewChange(record.id, Number(e.target.value))}
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
            onClick={onSubmit}
            disabled={!canReview || !selectedReviewId || isSubmitting}
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
      )}
    </div>
  );
}

const normalizeReviewToRecord = (review) => {
  const reviewStatus = review.status?.toUpperCase() ?? "PENDING";
  const statusKey = reviewStatus === "COMPLETED" ? "completed" : "pending";
  const commission = Number(review.commission_earned ?? 0);
  const price = Number(review.product_price ?? 0);
  
  return {
    id: review.product,
    reviewId: review.id,
    title: review.product_title ?? "N/A",
    price: price,
    commission: commission,
    total_value: price,
    status: reviewStatus,
    statusKey,
    priceDisplay: formatCurrency(price),
    commissionDisplay: formatCurrency(commission),
    totalValueDisplay: formatCurrency(price),
    imageUrl: review.product_image_url || null,
    timestampDisplay: formatTimestamp(review.created_at),
  };
};

const updateUserData = (payload, setCommissionRate, setUserBalance, setRequiredAmount, setUserLevel) => {
  setCommissionRate(Number(payload.commission_rate ?? 0));
  setUserBalance(Number(payload.balance ?? 0));
  setRequiredAmount(Number(payload.required_amount ?? 0));
  
  if (payload.level) {
    setUserLevel({
      id: payload.level.id,
      level_name: payload.level.level_name,
      commission_rate: payload.level.commission_rate,
      status: payload.level.status,
      display_name: payload.level.level_name,
    });
  }
};

const getFilterParams = (activeFilter) => {
  const params = {};
  if (activeFilter === "pending") {
    params.review_status = "PENDING_FROZEN";
  } else if (activeFilter === "completed") {
    params.review_status = "COMPLETED";
  } else {
    params.review_status = "ALL";
  }
  return params;
};

export default function Records() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState({});
  const [submittingRecords, setSubmittingRecords] = useState({});
  const [userLevel, setUserLevel] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requiredAmount, setRequiredAmount] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = getFilterParams(activeFilter);
        const response = await apiClient.get("/api/product/reviews/", { params });
        console.log(response?.data);
        const payload = response?.data ?? {};
        
        updateUserData(payload, setCommissionRate, setUserBalance, setRequiredAmount, setUserLevel);
        
        const normalizedRecords = (payload.reviews ?? []).map(normalizeReviewToRecord);
        setRecords(normalizedRecords);
      } catch (err) {
        setError("Unable to load records at the moment. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [activeFilter]);

  const canReview = userBalance >= requiredAmount;

  const handleReviewChange = (recordId, reviewId) => {
    setSelectedReviews((prev) => ({
      ...prev,
      [recordId]: reviewId,
    }));
  };

  const handleSubmitReview = async (recordId) => {
    const selectedReviewId = selectedReviews[recordId];
    if (!selectedReviewId) {
      toast.error("Please select a review before submitting.");
      return;
    }

    if (!canReview) {
      toast.error(`Insufficient balance. Required: ${formatCurrency(requiredAmount)}, Current: ${formatCurrency(userBalance)}`);
      return;
    }

    setSubmittingRecords((prev) => ({
      ...prev,
      [recordId]: true,
    }));

    try {
      const selectedReview = staticReviews.find((r) => r.id === selectedReviewId);
      
      const reviewResponse = await apiClient.post("/api/product/review/", {
        product_id: recordId,
        review_text: selectedReview.text,
      });

      const backendMessage = reviewResponse?.data?.message || "Review submitted successfully!";
      
      if (backendMessage.toLowerCase().includes("insufficient balance")) {
        toast.error(backendMessage);
      } else {
        toast.success(backendMessage);
      }
      
      setSelectedReviews((prev) => {
        const updated = { ...prev };
        delete updated[recordId];
        return updated;
      });

      const params = getFilterParams(activeFilter);
      const response = await apiClient.get("/api/product/reviews/", { params });
      const payload = response?.data ?? {};
      
      updateUserData(payload, setCommissionRate, setUserBalance, setRequiredAmount, setUserLevel);
      
      const normalizedRecords = (payload.reviews ?? []).map(normalizeReviewToRecord);
      setRecords(normalizedRecords);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Unable to submit review. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmittingRecords((prev) => {
        const updated = { ...prev };
        delete updated[recordId];
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-momondo-purple text-[#1C1C1C]">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between bg-white/10 border border-white/15 rounded-2xl px-4 py-3 shadow-inner shadow-black/10">
            <div>
              <p className="text-xs uppercase tracking-wide text-purple-200">Overview</p>
              <p className="text-base font-semibold text-white mt-1">Records Summary</p>
              {userLevel && (
                <p className="text-xs text-purple-200 mt-1">
                  Level: <span className="font-semibold text-white">{userLevel.display_name}</span>
                  {commissionRate > 0 && (
                    <span className="ml-2">
                      • Commission: <span className="font-semibold text-white">{commissionRate}%</span>
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="bg-white text-momondo-purple px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-black/15">
              {records.length} {records.length === 1 ? "item" : "items"}
            </div>
          </div>

          {isLoading && (
            <div className="bg-white/10 border border-white/15 rounded-3xl p-6 text-center text-purple-200">
              Loading records...
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-100 rounded-3xl p-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {statusFilters.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                      : "bg-white/10 text-purple-200 border border-white/20 hover:border-pink-200 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-5 pb-12">
            {!isLoading &&
              records.map((record) => (
                <RecordCard 
                  key={record.id} 
                  record={record} 
                  selectedReviewId={selectedReviews[record.id]}
                  onReviewChange={handleReviewChange}
                  onSubmit={() => handleSubmitReview(record.id)}
                  isSubmitting={submittingRecords[record.id]}
                  canReview={canReview}
                  userBalance={userBalance}
                  requiredAmount={requiredAmount}
                />
              ))}

            {!isLoading && records.length === 0 && (
              <div className="bg-white border border-dashed border-[#E5E7EB] rounded-3xl p-8 text-center space-y-2">
                <p className="text-lg font-semibold text-[#111827]">No records yet</p>
                <p className="text-sm text-[#6B7280]">Check back later for updates.</p>
              </div>
            )}
          </div>

          <style>{`
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }

            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
      <Footer />
    </div>
  );
}

