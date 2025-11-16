import { useState } from "react";
import { Wallet, DollarSign, MessageCircle, Check } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";

const suggestedAmounts = [100, 200, 300, 500, 1000, 1500, 2000];

export default function Deposit() {
  const [accountBalance] = useState(-242.81);
  const [amount, setAmount] = useState("100");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectAmount = (value) => {
    setAmount(String(value));
  };

  const handleDeposit = () => {
    if (!amount || Number(amount) <= 0) {
      return;
    }
    setShowSuccess(true);
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

          <section className="bg-white rounded-3xl shadow-xl overflow-hidden border border-black/5">
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between bg-[#FDF1F3] border border-[#FEC7D2] rounded-2xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#2D2D2D]">My Balance</p>
                  <p className="text-2xl font-bold text-[#E83F5B]">{formattedBalance}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white border border-[#FEC7D2] flex items-center justify-center text-[#E83F5B]">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#2D2D2D]">Deposit Amount</p>
                <div className="border-b border-[#E5E7EB] pb-3">
                  <label className="text-xs font-medium text-[#6B7280] block mb-1">Enter Amount</label>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-[#9CA3AF]" />
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full bg-transparent border-none text-lg font-semibold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#2D2D2D]">Quick Fill</p>
                <div className="grid grid-cols-3 gap-3 text-sm font-semibold">
                  {suggestedAmounts.map((value) => {
                    const isActive = Number(amount) === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleSelectAmount(value)}
                        className={`rounded-2xl py-3 transition ${
                          isActive
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/40"
                            : "bg-[#FDF1F3] text-[#E83F5B] border border-[#FEC7D2] hover:bg-[#FCE0E5]"
                        }`}
                      >
                        {formatCurrency(value)}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setAmount("")}
                    className="rounded-2xl py-3 bg-white border border-[#D1D5DB] text-[#374151] hover:border-[#FEC7D2] hover:text-[#E83F5B] transition"
                  >
                    Others
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 bg-white border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow-lg shadow-pink-500/30"
              >
                Replenish Now
              </button>
            </div>
          </section>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-5 text-center shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center shadow-inner shadow-green-200/60">
                <Check className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#111827]">Successful</h2>
                <p className="text-sm text-[#6B7280]">
                  Recharge requested successfully. Please confirm with Live Agent.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full border border-[#D1D5DB] hover:border-pink-300 text-[#E83F5B] font-semibold py-3 rounded-full transition"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-full transition shadow-md shadow-pink-500/30 flex items-center justify-center gap-2"
              >
                Live Chat
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

