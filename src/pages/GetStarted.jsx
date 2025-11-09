import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";
import apiClient from "../services/apiClient";

const initialSummary = {
  totalBalance: 0,
  currentEarnings: 0,
  entitlements: 0,
  completed: 0,
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

export default function GetStarted() {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get("/records/images/");
        const records = data?.records ?? [];

        const totalBalance = records.reduce(
          (acc, record) => acc + Number(record.total_value ?? record.totalValue ?? 0),
          0,
        );
        const currentEarnings = records.reduce(
          (acc, record) => acc + Number(record.commission ?? 0),
          0,
        );
        const entitlements = records.length;
        const completed = records.filter(
          (record) => (record.status ?? "").toLowerCase() === "completed",
        ).length;

        setSummary({
          totalBalance,
          currentEarnings,
          entitlements,
          completed,
        });
      } catch (err) {
        console.error("Unable to fetch summary data", err);
        setError("Unable to fetch balance overview. Try again in a moment.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-momondo-purple text-white flex flex-col">
      <PrimaryNav />

      <main className="flex-1 px-4 py-10 flex justify-center">
        <div className="w-full max-w-3xl">
          <section className="relative isolate overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

            <header className="flex items-center justify-between px-6 pt-6 pb-4">
              <h1 className="text-lg font-semibold tracking-wide mx-auto">Optimization</h1>
              <span className="w-6" />
            </header>

            <div className="flex flex-col items-center gap-8 px-6 py-6">
              <div className="h-40 w-40 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  className="h-20 w-20 text-white/90"
                >
                  <path
                    fill="currentColor"
                    d="M14 50h36v4H14zm18-34a2 2 0 0 1 2 2v19h-4V18a2 2 0 0 1 2-2Zm-12 8a2 2 0 0 1 2 2v11h-4V26a2 2 0 0 1 2-2Zm24 0a2 2 0 0 1 2 2v11h-4V26a2 2 0 0 1 2-2Z"
                  />
                </svg>
              </div>

              <div className="bg-white rounded-3xl w-full max-w-[480px] text-[#101828] shadow-xl overflow-hidden">
                <div className="flex flex-col items-center gap-3 px-8 pt-10 pb-6">
                  <div className="h-14 w-14 rounded-full bg-[#ff5f6d] flex items-center justify-center shadow-lg shadow-[#ff5f6d]/40">
                    <span className="text-xl font-semibold uppercase">M</span>
                  </div>
                  {loading ? (
                    <div className="flex flex-col items-center gap-3 text-[#475467] py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-[#ff5f6d]" />
                      <span className="text-sm font-medium">Preparing your balance overview…</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-[#101828]">
                        {formatCurrency(summary.totalBalance)}
                      </p>
                      <p className="text-sm font-medium uppercase tracking-widest text-[#475467]">
                        Total Balance
                      </p>
                    </>
                  )}
                </div>

                <div className="border-t border-[#f2f4f7]" />

                <div className="px-8 py-6 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#475467] font-semibold">
                      Details
                    </p>
                    <p className="text-xs text-[#98a2b3] mt-1">Current Earnings</p>
                    <p className="text-lg font-semibold text-[#101828]">
                      {formatCurrency(summary.currentEarnings)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl bg-[#0a1b29] text-white px-3 py-4 shadow-inner">
                      <p className="text-xs text-white/70">No of Entitlement</p>
                      <p className="text-lg font-semibold mt-1">{summary.entitlements}</p>
                    </div>
                    <div className="rounded-2xl bg-[#0a1b29] text-white px-3 py-4 shadow-inner">
                      <p className="text-xs text-white/70">Completed</p>
                      <p className="text-lg font-semibold mt-1">{summary.completed}</p>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 text-center bg-red-50 border border-red-200 rounded-xl py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-[#ff5f6d] to-[#ff5f6d] hover:from-[#ff4f5f] hover:to-[#ff4f5f] text-white font-semibold py-3 rounded-2xl shadow-lg shadow-[#ff5f6d]/40 transition"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

