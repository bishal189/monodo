import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";
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
  const [showRecords, setShowRecords] = useState(false);
  const [reviewingRecord, setReviewingRecord] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generateError, setGenerateError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/records/images/");
        const payload = response?.data ?? {};
        const normalisedRecords = (payload.records ?? []).map((record) => {
          const statusKey = record.status?.toLowerCase() ?? "pending";
          return {
            ...record,
            statusKey,
            priceDisplay: formatCurrency(record.price),
            commissionDisplay: formatCurrency(record.commission),
            totalValueDisplay: formatCurrency(record.total_value ?? record.totalValue),
            imageUrl: record.image_url || record.imageUrl,
            timestampDisplay: formatTimestamp(record.updated_at ?? record.created_at),
          };
        });

        const totalBalance = normalisedRecords.reduce(
          (acc, item) => acc + Number(item.total_value ?? item.totalValue ?? 0),
          0,
        );
        const currentEarnings = normalisedRecords.reduce(
          (acc, item) => acc + Number(item.commission ?? 0),
          0,
        );
        const entitlements = normalisedRecords.length;
        const completed = normalisedRecords.filter((item) => item.statusKey === "completed").length;

        setSummary({ totalBalance, currentEarnings, entitlements, completed });
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
    if (!records.length) {
      setGenerateError("No records available to generate right now.");
      setShowRecords(false);
    } else {
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

            {showRecords && (
              <div className="flex flex-col gap-5 pb-4">
                {records.map((record) => (
                  <RecordCard key={record.id} record={record} onSubmit={() => openReviewModal(record)} />
                ))}
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
                      onClick={() => {
                        if (!selectedReviewId) {
                          return;
                        }
                        closeReviewModal();
                      }}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-full transition shadow-lg shadow-pink-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={!selectedReviewId}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

