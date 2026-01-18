import { useState, useEffect } from "react";
import { Wallet, DollarSign, Loader2, FileText } from "lucide-react";
import { toast } from "react-toastify";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import apiClient from "../services/apiClient";

const suggestedAmounts = [100, 200, 300, 500, 1000, 1500, 2000];

export default function Deposit() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [amount, setAmount] = useState("100");
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      setIsFetchingBalance(true);
      try {
        const { data } = await apiClient.get("/api/transaction/my-balance/");
        if (data?.balance !== undefined) {
          setAccountBalance(Number(data.balance) || 0);
        }
      } catch (error) {
        console.error("Failed to fetch balance", error);
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
    const depositAmount = parseFloat(amount);
    
    if (!amount || isNaN(depositAmount) || depositAmount <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    setIsLoading(true);
    try {
      const requestPayload = {
        amount: depositAmount,
        remark: remark || "Initial deposit",
      };
      
      
      const { data } = await apiClient.post("/api/transaction/my-deposit/", requestPayload);

      if (data?.current_balance !== undefined) {
        setAccountBalance(Number(data.current_balance));
      }
      setAmount("100");
      setRemark("");
      toast.success(`Deposit request of ${formatCurrency(depositAmount)} submitted successfully. Please wait for admin approval.`);
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

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Deposit</h1>
            <p className="text-sm text-purple-200">Replenish your wallet quickly with preset or custom amounts.</p>
          </div>

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
                <p className="text-sm font-semibold text-white">Remark</p>
                <div className="border-b border-white/20 pb-3">
                  <label className="text-xs font-medium text-purple-200 block mb-1">Add a note (optional)</label>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-purple-300 mt-1" />
                    <textarea
                      value={remark}
                      onChange={(event) => setRemark(event.target.value)}
                      className="w-full bg-transparent border-none text-sm text-white placeholder:text-purple-300 focus:outline-none resize-none"
                      placeholder="Enter any remarks or notes about this deposit..."
                      rows={3}
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
                  "Deposit"
                )}
              </button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
