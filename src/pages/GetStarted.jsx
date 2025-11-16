import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import apiClient from "../services/apiClient";

const statusMeta = {
  pending: {
    labelClass: "bg-yellow-500/20 text-yellow-200",
    iconClass: "text-yellow-300",
    label: "Pending",
  },
  completed: {
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

const normalizeRecord = (record) => {
  const statusKey = record.status?.toLowerCase() ?? "pending";
  const priceNumeric = Number(record.price ?? 0);
  const commissionNumeric = Number(record.commission ?? 0);
  const totalValueNumeric = Number(record.total_value ?? record.totalValue ?? priceNumeric + commissionNumeric);
  const timestampSource = record.updated_at ?? record.created_at ?? null;

  return {
    ...record,
    statusKey,
    priceNumeric,
    commissionNumeric,
    totalValueNumeric,
    priceDisplay: formatCurrency(priceNumeric),
    commissionDisplay: formatCurrency(commissionNumeric),
    totalValueDisplay: formatCurrency(totalValueNumeric),
    imageUrl: record.image_url || record.imageUrl,
    timestampDisplay: formatTimestamp(timestampSource),
  };
};

const computeSummary = (records, userBalance = 0) => {
  const completedRecords = records.filter((item) => item.statusKey === "completed");
  // Use actual user balance from database (matches withdraw page)
  const totalBalance = Number(userBalance ?? 0);
  // Calculate current earnings as sum of commissions from completed records
  const currentEarnings = completedRecords.reduce((acc, item) => acc + Number(item.commissionNumeric ?? item.commission ?? 0), 0);
  const completedCount = completedRecords.length;

  return {
    totalBalance: totalBalance,
    currentEarnings: currentEarnings,
    entitlements: completedCount,
    completed: completedCount,
  };
};

function RecordCard({ record, onSubmit }) {
  const meta = statusMeta[record.statusKey];

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
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              meta?.labelClass ?? "bg-white/10 text-purple-200"
            }`}
          >
            <span>{meta?.label ?? record.status}</span>
          </div>
          <span className="text-xs text-purple-200">{record.timestampDisplay}</span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2.5 rounded-full transition shadow-md shadow-pink-500/30"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default function GetStarted() {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    currentEarnings: 0,
    entitlements: 0,
    completed: 0,
  });
  const [allRecords, setAllRecords] = useState([]); // Store ALL records (pending + completed) for summary
  const [records, setRecords] = useState([]); // Store only PENDING records for generation
  const [recordQueue, setRecordQueue] = useState([]);
  const [activeRecord, setActiveRecord] = useState(null);
  const [showRecords, setShowRecords] = useState(false);
  const [reviewingRecord, setReviewingRecord] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generateError, setGenerateError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [todaysCommission, setTodaysCommission] = useState(0);
  const [userLevel, setUserLevel] = useState(null);
  const [completionMessage, setCompletionMessage] = useState(null);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/records/images/");
        const payload = response?.data ?? {};
        
        // Normalize ALL records (both pending and completed)
        const allNormalisedRecords = (payload.records ?? []).map((record) => normalizeRecord(record));
        
        // Separate: PENDING records for generation, ALL records for summary
        const pendingRecords = allNormalisedRecords.filter((record) => record.statusKey !== "completed");

        setUserBalance(Number(payload?.user_balance ?? 0));
        setTodaysCommission(Number(payload?.todays_commission ?? 0));
        setUserLevel(payload?.user_level ?? null);
        
        // Store completion message and status
        setCompletionMessage(payload?.completion_message ?? null);
        setAllCompleted(payload?.all_completed ?? false);
        
        // Use ALL records for summary calculation (includes completed)
        setSummary(computeSummary(allNormalisedRecords, payload?.user_balance));
        
        // Store all records for summary, but only pending for generation
        setAllRecords(allNormalisedRecords);
        setRecords(pendingRecords);
      } catch (err) {
        console.error("Unable to load records", err);
        setError("Unable to load records at the moment. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleGenerate = async () => {
    setGenerateError(null);
    setIsGenerating(true);

    const minimumBalance = Number(userLevel?.minimum_balance ?? 0);
    if (minimumBalance && userBalance < minimumBalance) {
      const message = `Balance not sufficient. Minimum required is ${formatCurrency(minimumBalance)}.`;
      toast.error(message);
      setGenerateError(message);
      setIsGenerating(false);
      return;
    }

    // Refresh records to ensure we have the latest data
    try {
      const response = await apiClient.get("/records/images/");
      const payload = response?.data ?? {};
      const updatedBalance = Number(payload?.user_balance ?? 0);
      setUserBalance(updatedBalance);
      setTodaysCommission(Number(payload?.todays_commission ?? 0));

      // Store completion message and status
      setCompletionMessage(payload?.completion_message ?? null);
      setAllCompleted(payload?.all_completed ?? false);

      // Normalize ALL records (both pending and completed)
      const allFreshRecords = (payload.records ?? []).map((record) => normalizeRecord(record));
      
      // Separate: PENDING records for generation, ALL records for summary
      const freshPendingRecords = allFreshRecords.filter((record) => record.statusKey !== "completed");

      // Update records: all for summary, only pending for generation
      setAllRecords(allFreshRecords);
      setRecords(freshPendingRecords);
      
      // Use ALL records (including completed) for summary calculation
      setSummary(computeSummary(allFreshRecords, updatedBalance));

      if (!freshPendingRecords.length) {
        setGenerateError("No pending records available to generate right now.");
        setShowRecords(false);
        setActiveRecord(null);
        setRecordQueue([]);
      } else {
        setRecordQueue(freshPendingRecords);
        setActiveRecord(freshPendingRecords[0]);
        setShowRecords(true);
      }
    } catch (err) {
      console.error("Failed to refresh records", err);
      // Fallback to existing records if refresh fails
      const pendingRecords = records.filter((item) => item.statusKey !== "completed");
      if (!pendingRecords.length) {
        setGenerateError("No pending records available to generate right now.");
        setShowRecords(false);
        setActiveRecord(null);
        setRecordQueue([]);
      } else {
        setRecordQueue(pendingRecords);
        setActiveRecord(pendingRecords[0]);
        setShowRecords(true);
      }
    }

    setTimeout(() => setIsGenerating(false), 300);
  };

  const openReviewModal = (record) => {
    setReviewingRecord(record);
    const firstReviewId = record?.reviews?.[0]?.id ?? null;
    setSelectedReviewId(firstReviewId);
  };

  const closeReviewModal = () => {
    setReviewingRecord(null);
    setSelectedReviewId(null);
  };

  const advanceQueue = (completedId) => {
    setRecordQueue((prev) => {
      const remaining = prev.filter((item) => item.id !== completedId);
      if (!remaining.length) {
        setActiveRecord(null);
        setShowRecords(false);
      } else {
        setActiveRecord(remaining[0]);
      }
      return remaining;
    });
  };

  const rehydrateRecord = (record) => normalizeRecord(record);

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

      // Handle new API response format with record and user_stats
      const recordData = data.record || data;
      const updatedRecord = rehydrateRecord(recordData);

      // Update user stats immediately from response (real-time update)
      if (data.user_stats) {
        const stats = data.user_stats;
        if (stats.balance !== undefined) {
          setUserBalance(Number(stats.balance));
        }
        if (stats.todays_commission !== undefined) {
          setTodaysCommission(Number(stats.todays_commission));
        }
      }

      // Refresh user balance and records from API to get updated data after commission is added
      try {
        const response = await apiClient.get("/records/images/");
        const payload = response?.data ?? {};
        const updatedBalance = Number(payload?.user_balance ?? userBalance);
        setUserBalance(updatedBalance);
        setTodaysCommission(Number(payload?.todays_commission ?? todaysCommission));

        // Store completion message and status
        setCompletionMessage(payload?.completion_message ?? null);
        setAllCompleted(payload?.all_completed ?? false);

        // Normalize ALL records (both pending and completed)
        const allFreshRecords = (payload.records ?? []).map((record) => normalizeRecord(record));
        
        // Separate: PENDING records for generation, ALL records for summary
        const freshPendingRecords = allFreshRecords.filter((record) => record.statusKey !== "completed");

        // Update records: all for summary, only pending for generation
        setAllRecords(allFreshRecords);
        setRecords(freshPendingRecords);
        
        // Use ALL records (including completed) for summary calculation
        setSummary(computeSummary(allFreshRecords, updatedBalance));
      } catch (refreshErr) {
        // If refresh fails, update records by removing completed one
        console.error("Failed to refresh balance", refreshErr);
        const updatedRecordWithCompleted = rehydrateRecord(recordData);
        setAllRecords((prev) => {
          const next = prev.map((item) => (item.id === updatedRecordWithCompleted.id ? updatedRecordWithCompleted : item));
          setSummary(computeSummary(next, userBalance));
          return next;
        });
        setRecords((prev) => prev.filter((item) => item.id !== reviewingRecord.id));
      }

      toast.success("Review submitted successfully.");
      advanceQueue(reviewingRecord.id);
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
        
        // Update frozen amount if provided
        if (errorData.frozen_amount !== undefined) {
          // You might want to update a state variable for frozen amount here
          // For now, just log it
          console.log('Frozen amount:', errorData.frozen_amount);
        }
      } else {
        // Handle other errors
        const message = errorData.detail || "Unable to submit review. Please try again.";
        toast.error(message);
      }
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-200">Overview</p>
                <p className="text-base font-semibold text-white mt-1">Records Summary</p>
              </div>
              {isLoading && <Loader2 className="h-5 w-5 animate-spin text-purple-100" />}
            </div>

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-100 rounded-2xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {completionMessage && (
              <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                allCompleted 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-100' 
                  : 'bg-blue-500/10 border border-blue-500/30 text-blue-100'
              }`}>
                <div className="flex items-center gap-2">
                  {allCompleted && (
                    <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p className="font-semibold">{completionMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Total Balance</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(summary.totalBalance)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Today's Commission</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(todaysCommission)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Entitlements</p>
                <p className="text-xl font-semibold mt-1">{summary.entitlements}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Completed</p>
                <p className="text-xl font-semibold mt-1">{summary.completed}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white/5 border border-white/15 shadow-lg shadow-black/20 px-5 py-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Generate Records</h2>
                <p className="text-xs text-purple-200">Tap generate to review tasks just like the records page.</p>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || isLoading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-pink-500/30 disabled:opacity-60"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Generate
              </button>
            </div>

            {generateError && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-xs text-red-100">
                {generateError}
              </div>
            )}

            {showRecords && activeRecord && (
              <div className="flex flex-col gap-5 pt-2">
                <RecordCard record={activeRecord} onSubmit={() => openReviewModal(activeRecord)} />
                <p className="text-xs text-purple-200 text-center">
                  {recordQueue.length > 1
                    ? `Complete this task to unlock the next (${recordQueue.length - 1} remaining).`
                    : "Complete this task to finish today's queue."}
                </p>
              </div>
            )}

            {showRecords && !activeRecord && !isGenerating && (
              <div className="rounded-3xl bg-white/5 border border-white/10 px-6 py-10 text-center text-white/70">
                <p className="font-semibold text-white mb-2">All tasks completed</p>
                <p className="text-sm">Tap Generate again later when new records are available.</p>
              </div>
            )}
          </section>

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
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-full transition shadow-lg shadow-pink-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={!selectedReviewId || isSubmitting}
                    >
                      {isSubmitting ? "Submitting…" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

