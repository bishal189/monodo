import { useState, useEffect } from "react";
import { Wallet, DollarSign, MessageCircle, Check, Loader2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import apiClient from "../services/apiClient";

const suggestedAmounts = [100, 200, 300, 500, 1000, 1500, 2000];

export default function Deposit() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [amount, setAmount] = useState("100");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(true);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const openLiveChat = () => {
    if (typeof window !== 'undefined' && window.LiveChatWidget) {
      try {
        window.LiveChatWidget.call('maximize');
      } catch (error) {
        console.error('Failed to open LiveChat', error);
        // Fallback: try alternative methods
        if (window.LiveChatWidget.onReady) {
          window.LiveChatWidget.onReady(() => {
            window.LiveChatWidget.call('maximize');
          });
        }
      }
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      setIsFetchingBalance(true);
      try {
        const { data } = await apiClient.get("/profile/");
        if (data?.balance !== undefined) {
          setAccountBalance(Number(data.balance) || 0);
        }
        // Check if bank account details are saved
        setHasBankAccount(!!data?.bank_account?.account_number);

        // Fetch pending transactions
        try {
          const { data: transactionsData } = await apiClient.get("/transactions/?type=deposit");
          const pending = (transactionsData?.transactions || [])
            .filter(t => t.status === "PENDING" || t.status === "APPROVED")
            .length;
          setPendingCount(pending);
        } catch (err) {
          console.error("Failed to fetch pending transactions", err);
        }
      } catch (error) {
        console.error("Failed to fetch balance", error);
        toast.error("Failed to load balance");
      } finally {
        setIsFetchingBalance(false);
      }
    };

    fetchBalance();
  }, []);

  const handleSelectAmount = (value) => {
    setAmount(String(value));
  };

  const handleDeposit = async () => {
    const depositAmount = Number(amount);
    
    if (!amount || depositAmount <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiClient.post("/transactions/deposit/", {
        amount: depositAmount.toString(),
        notes: `Deposit of $${depositAmount}`,
      });

      toast.success(data.message || "Deposit request submitted successfully");
      setAccountBalance(Number(data.current_balance || accountBalance));
      setPendingCount(prev => prev + 1);
      setShowSuccess(true);
      setAmount("100"); // Reset to default
    } catch (error) {
      console.error("Deposit failed", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.amount?.[0] ||
        "Failed to process deposit. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);

  const formattedBalance = formatCurrency(accountBalance);
  const formattedAmount = amount ? formatCurrency(Number(amount)) : "$0.00";

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Deposit</h1>
            <p className="text-sm text-purple-200">Replenish your wallet quickly with preset or custom amounts.</p>
          </div>

          {hasBankAccount && (
            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-100 rounded-2xl p-4 text-sm">
              <p className="text-blue-200">
                ✓ Your bank account details are saved and ready for withdrawals.
              </p>
            </div>
          )}

          {pendingCount > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-100 rounded-2xl p-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-yellow-200 mb-1">
                    You have {pendingCount} pending deposit{pendingCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-yellow-100/80 text-xs">
                    Your deposit request{pendingCount > 1 ? "s are" : " is"} awaiting admin approval.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openLiveChat}
                  className="flex-shrink-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2 px-4 rounded-full transition shadow-md shadow-pink-500/30 flex items-center justify-center gap-2 text-xs whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </button>
              </div>
            </div>
          )}

          <section className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-purple-200">My Balance</p>
                  {isFetchingBalance ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
                      <p className="text-2xl font-bold text-white">Loading...</p>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-white">{formattedBalance}</p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-pink-300">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Deposit Amount</p>
                <div className="border-b border-white/20 pb-3">
                  <label className="text-xs font-medium text-purple-200 block mb-1">Enter Amount</label>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-purple-300" />
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full bg-transparent border-none text-lg font-semibold text-white placeholder:text-purple-300 focus:outline-none"
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Quick Fill</p>
                <div className="grid grid-cols-3 gap-3 text-sm font-semibold">
                  {suggestedAmounts.map((value) => {
                    const isActive = Number(amount) === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleSelectAmount(value)}
                        disabled={isLoading}
                        className={`rounded-2xl py-3 transition ${
                          isActive
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/40"
                            : "bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-50"
                        }`}
                      >
                        {formatCurrency(value)}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setAmount("")}
                    disabled={isLoading}
                    className="rounded-2xl py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition disabled:opacity-50"
                  >
                    Others
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 bg-white/5 border-t border-white/20">
              <button
                type="button"
                onClick={handleDeposit}
                disabled={isLoading || !amount || Number(amount) <= 0}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Replenish Now"
                )}
              </button>
            </div>
          </section>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 space-y-5 text-center shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-400/30">
                <Check className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">Deposit Request Submitted</h2>
                <p className="text-sm text-purple-200">
                  Your deposit request is pending admin approval. It will be processed after verification.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full border border-white/20 hover:border-pink-300 text-white font-semibold py-3 rounded-full transition bg-white/5 hover:bg-white/10"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
              <button
                type="button"
                onClick={openLiveChat}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-full transition shadow-md shadow-pink-500/30 flex items-center justify-center gap-2"
              >
                Chat with Admin
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
