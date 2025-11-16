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
  const totalBalance = completedRecords.reduce((acc, item) => acc + Number(item.totalValueNumeric ?? item.total_value ?? 0), 0);
  const currentEarnings = completedRecords.reduce((acc, item) => acc + Number(item.commissionNumeric ?? item.commission ?? 0), 0);
  const completedCount = completedRecords.length;

  return {
    totalBalance: completedCount ? totalBalance : Number(userBalance ?? 0),
    currentEarnings: completedCount ? currentEarnings : Number(userBalance ?? 0),
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
  const [records, setRecords] = useState([]);
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
  const [userLevel, setUserLevel] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/records/images/");
        const payload = response?.data ?? {};
        const normalisedRecords = (payload.records ?? []).map((record) => normalizeRecord(record));

        setUserBalance(Number(payload?.user_balance ?? 0));
        setUserLevel(payload?.user_level ?? null);
        setSummary(computeSummary(normalisedRecords, payload?.user_balance));
        setRecords(normalisedRecords);
      } catch (err) {
        console.error("Unable to load records", err);
        setError("Unable to load records at the moment. Please try again shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleGenerate = () => {
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

      const updatedRecord = rehydrateRecord(data);

      setRecords((prev) => {
        const next = prev.map((item) => (item.id === updatedRecord.id ? updatedRecord : item));
        setSummary(computeSummary(next, userBalance));
        return next;
      });

      toast.success("Review submitted successfully.");
      advanceQueue(reviewingRecord.id);
      closeReviewModal();
    } catch (err) {
      console.error("Failed to submit review", err);
      const message = err?.response?.data?.detail || "Unable to submit review. Please try again.";
      toast.error(message);
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

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Total Balance</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(summary.totalBalance)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="text-xs uppercase tracking-wide text-purple-200">Current Earnings</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(summary.currentEarnings)}</p>
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
              <div className="flex flex-col gap-5 pb-4">
                <RecordCard record={activeRecord} onSubmit={() => openReviewModal(activeRecord)} />
                <p className="text-xs text-purple-200 text-center">
                  {recordQueue.length > 1
                    ? `Complete this task to unlock the next (${recordQueue.length - 1} remaining).`
                    : "Complete this task to finish today’s queue."}
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
                    <p className="text-sm font-semibold text-[#374151]">Available Reviews</p>
                    <div className="max-h-64 overflow-y-auto space-y-3 rounded-xl border border-[#D1D5DB] p-3 bg-white shadow-inner">
                      {(reviewingRecord?.reviews ?? []).map((review) => {
                        const isSelected = review.id === selectedReviewId;
                        return (
                          <button
                            key={review.id}
                            type="button"
                            onClick={() => setSelectedReviewId(review.id)}
                            className={`w-full text-left text-sm rounded-xl px-4 py-3 transition ${
                              isSelected
                                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border border-transparent shadow-lg shadow-pink-500/30"
                                : "bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                            }`}
                          >
                            {review.review_text}
                          </button>
                        );
                      })}
                      {(reviewingRecord?.reviews ?? []).length === 0 && (
                        <p className="text-sm text-[#6B7280] text-center py-2">No reviews available.</p>
                      )}
                    </div>
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

