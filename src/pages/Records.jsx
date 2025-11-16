import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import apiClient from "../services/apiClient";

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

function RecordCard({ record, onSubmit }) {
  const meta = statusMeta[record.statusKey];
  const Icon = meta?.icon ?? Clock;

  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl overflow-hidden shadow-lg shadow-black/20">
      <div className="px-4 pt-4 pb-3 space-y-4">
        <img
          src={record.imageUrl}
          alt={record.title}
          className="w-full aspect-[7/5] object-cover rounded-2xl"
          loading="lazy"
        />
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
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2.5 rounded-full transition shadow-md shadow-pink-500/30"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default function Records() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [reviewingRecord, setReviewingRecord] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/records/images/");
        const payload = response?.data ?? {};
        setUserLevel(payload.user_level ?? null);
        const balance = Number(payload.user_balance ?? 0);
        setUserBalance(balance);
        const minimumBalance = Number(payload?.user_level?.minimum_balance ?? 0);
        const normalizedRecords = (payload.records ?? []).map((record) => {
          const statusKey = record.status?.toLowerCase() ?? "pending";
          const isBlockedByBalance =
            statusKey === "pending" && minimumBalance > 0 && balance < minimumBalance;
          return {
            ...record,
            statusKey,
            isBlockedByBalance,
            priceDisplay: formatCurrency(record.price),
            commissionDisplay: formatCurrency(record.commission),
            totalValueDisplay: formatCurrency(record.total_value ?? record.totalValue),
            imageUrl: record.image_url || record.imageUrl,
            timestampDisplay: formatTimestamp(record.updated_at ?? record.created_at),
          };
        });
        setRecords(normalizedRecords);
      } catch (err) {
        console.error("Failed to fetch record images", err);
        setError("Unable to load records at the moment. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [activeFilter]);

  const filteredRecords = useMemo(() => {
    if (activeFilter === "all") {
      return records.filter((record) => !(record.statusKey === "pending" && record.isBlockedByBalance));
    }
    return records.filter((record) => {
      if (record.statusKey !== activeFilter) {
        return false;
      }
      if (record.statusKey === "pending" && record.isBlockedByBalance) {
        return false;
      }
      return true;
    });
  }, [activeFilter, records]);

  const blockedPendingCount = useMemo(
    () => records.filter((record) => record.statusKey === "pending" && record.isBlockedByBalance).length,
    [records]
  );

  const openReviewModal = (record) => {
    setReviewingRecord(record);
    const firstReviewId = record?.reviews?.[0]?.id ?? null;
    setSelectedReviewId(firstReviewId);
  };

  const closeReviewModal = () => {
    setReviewingRecord(null);
    setSelectedReviewId(null);
  };

  const handleSubmitReview = async () => {
    if (!reviewingRecord || !selectedReviewId) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post("/records/submit-review/", {
        record_id: reviewingRecord.id,
        review_id: selectedReviewId,
      });

      // Handle insufficient balance error
      if (data.error === 'insufficient_balance') {
        const message = data.detail || `Balance not sufficient. You need $${data.required_amount || '0.00'} but you have $${data.current_balance || '0.00'}. Please deposit $${data.insufficient_amount || '0.00'} to proceed.`;
        toast.error(message, {
          autoClose: 5000,
          style: {
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
          }
        });
        closeReviewModal();
        return;
      }

      // Update user stats if provided
      if (data.user_stats) {
        const stats = data.user_stats;
        if (stats.balance !== undefined) {
          setUserBalance(Number(stats.balance));
        }
      }

      // Refresh records to get updated data
      try {
        const response = await apiClient.get("/records/images/");
        const payload = response?.data ?? {};
        const updatedBalance = Number(payload?.user_balance ?? userBalance);
        setUserBalance(updatedBalance);
        
        const normalizedRecords = (payload.records ?? []).map((record) => {
          const statusKey = record.status?.toLowerCase() ?? "pending";
          const minimumBalance = Number(payload?.user_level?.minimum_balance ?? 0);
          const isBlockedByBalance =
            statusKey === "pending" && minimumBalance > 0 && updatedBalance < minimumBalance;
          return {
            ...record,
            statusKey,
            isBlockedByBalance,
            priceDisplay: formatCurrency(record.price),
            commissionDisplay: formatCurrency(record.commission),
            totalValueDisplay: formatCurrency(record.total_value ?? record.totalValue),
            imageUrl: record.image_url || record.imageUrl,
            timestampDisplay: formatTimestamp(record.updated_at ?? record.created_at),
          };
        });
        setRecords(normalizedRecords);
      } catch (refreshErr) {
        console.error("Failed to refresh records", refreshErr);
        // Update records manually - mark the submitted record as completed
        setRecords((prev) => prev.map((item) => 
          item.id === reviewingRecord.id 
            ? { ...item, statusKey: 'completed', status: 'COMPLETED' }
            : item
        ));
      }

      toast.success("Review submitted successfully.");
      closeReviewModal();
    } catch (err) {
      console.error("Failed to submit review", err);
      const errorData = err?.response?.data || {};
      
      // Handle insufficient balance error
      if (errorData.error === 'insufficient_balance') {
        const message = errorData.detail || `Balance not sufficient. You need $${errorData.required_amount || '0.00'} but you have $${errorData.current_balance || '0.00'}. Please deposit $${errorData.insufficient_amount || '0.00'} to proceed.`;
        toast.error(message, {
          autoClose: 5000,
          style: {
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
          }
        });
      } else {
        const message = errorData.detail || "Unable to submit review. Please try again.";
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
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
                </p>
              )}
            </div>
            <div className="bg-white text-momondo-purple px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-black/15">
              {filteredRecords.length} {filteredRecords.length === 1 ? "item" : "items"}
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

          {blockedPendingCount > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-100 rounded-3xl p-4 text-sm">
              Balance not sufficient to access {blockedPendingCount} pending record{blockedPendingCount > 1 ? "s" : ""}.
              {userLevel?.minimum_balance && (
                <span className="block mt-1">
                  Minimum required: <span className="font-semibold text-white">{formatCurrency(userLevel.minimum_balance)}</span>
                  , current balance: <span className="font-semibold text-white">{formatCurrency(userBalance)}</span>.
                </span>
              )}
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
              filteredRecords.map((record) => (
                <RecordCard key={record.id} record={record} onSubmit={() => openReviewModal(record)} />
              ))}

            {!isLoading && filteredRecords.length === 0 && (
              <div className="bg-white border border-dashed border-[#E5E7EB] rounded-3xl p-8 text-center space-y-2">
                <p className="text-lg font-semibold text-[#111827]">No records yet</p>
                <p className="text-sm text-[#6B7280]">Switch filters or check back later for updates.</p>
              </div>
            )}
          </div>

          {reviewingRecord && (
            <div className="fixed inset-0 z-50 flex items-center justify-end md:justify-center bg-black/20 px-4 py-6">
              <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom md:zoom-in duration-200 max-h-[90vh] flex flex-col">
                <div className="relative">
                  <img
                    src={reviewingRecord.imageUrl}
                    alt={reviewingRecord.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                    <button
                    onClick={closeReviewModal}
                    className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-momondo-purple font-semibold"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-5 pt-5 pb-6 space-y-4 overflow-y-auto">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#111827]">{reviewingRecord.title}</h3>
                    <div className="border-t border-dashed border-[#E5E7EB] pt-3 text-sm text-[#4B5563] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span>Price</span>
                        <span className="font-semibold text-[#111827]">{reviewingRecord.priceDisplay}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Commission</span>
                        <span className="font-semibold text-[#111827]">{reviewingRecord.commissionDisplay}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total Value</span>
                        <span className="font-semibold text-[#111827]">{reviewingRecord.totalValueDisplay}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-[#374151]">Select Review</label>
                    <select
                      value={selectedReviewId || ""}
                      onChange={(e) => setSelectedReviewId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23374151%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10"
                    >
                      <option value="" disabled>
                        Choose a review...
                      </option>
                      {(reviewingRecord?.reviews ?? []).map((review) => (
                        <option key={review.id} value={review.id}>
                          {review.review_text}
                        </option>
                      ))}
                    </select>
                    {(reviewingRecord?.reviews ?? []).length === 0 && (
                      <p className="text-sm text-[#6B7280] text-center py-2">No reviews available.</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-full transition shadow-lg shadow-pink-500/30 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      disabled={!selectedReviewId || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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

