import { useState } from "react";
import { ArrowDownCircle, DollarSign, MessageCircle, Check, Lock, Eye, EyeOff, CreditCard, ArrowLeft } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";

const suggestedAmounts = [50, 100, 200, 300, 500, 1000];

export default function Withdraw() {
  const [accountBalance] = useState(1250.50);
  const [amount, setAmount] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedAccount, setSavedAccount] = useState(null); // null means no account saved yet
  const [accountForm, setAccountForm] = useState({
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    routingNumber: "",
    accountType: "checking"
  });

  const handleSelectAmount = (value) => {
    setAmount(String(value));
  };

  const handleWithdraw = () => {
    if (!amount || Number(amount) <= 0) {
      return;
    }
    if (!withdrawPassword) {
      return;
    }
    if (Number(amount) > accountBalance) {
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
  const canWithdraw = amount && Number(amount) > 0 && Number(amount) <= accountBalance && withdrawPassword && savedAccount;

  const handleAccountFormChange = (field, value) => {
    setAccountForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAccount = () => {
    if (!accountForm.accountNumber || !accountForm.accountHolderName || !accountForm.bankName) {
      return;
    }
    setSavedAccount({ ...accountForm });
  };

  const handleEditAccount = () => {
    if (savedAccount) {
      setAccountForm(savedAccount);
      setSavedAccount(null);
    }
  };

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {!savedAccount ? (
            // Account Setup Page
            <>
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold">Add Withdrawal Account</h1>
                <p className="text-sm text-purple-200">Add your bank account details to withdraw funds.</p>
              </div>

              <section className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-pink-300" />
                    <p className="text-sm font-semibold text-white">Account Information</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                      Account Holder Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountForm.accountHolderName}
                      onChange={(e) => handleAccountFormChange("accountHolderName", e.target.value)}
                      placeholder="Enter account holder name"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                      Bank Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountForm.bankName}
                      onChange={(e) => handleAccountFormChange("bankName", e.target.value)}
                      placeholder="Enter bank name"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                      Account Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountForm.accountNumber}
                      onChange={(e) => handleAccountFormChange("accountNumber", e.target.value)}
                      placeholder="Enter account number"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={accountForm.routingNumber}
                      onChange={(e) => handleAccountFormChange("routingNumber", e.target.value)}
                      placeholder="Enter routing number (optional)"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                      Account Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={accountForm.accountType}
                      onChange={(e) => handleAccountFormChange("accountType", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    >
                      <option value="checking" className="bg-momondo-purple">Checking</option>
                      <option value="savings" className="bg-momondo-purple">Savings</option>
                    </select>
                  </div>
                </div>

                <div className="px-6 py-5 bg-white/5 border-t border-white/20">
                  <button
                    type="button"
                    onClick={handleSaveAccount}
                    disabled={!accountForm.accountNumber || !accountForm.accountHolderName || !accountForm.bankName}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Account & Continue
                  </button>
                </div>
              </section>
            </>
          ) : (
            // Withdraw Page
            <>
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold">Withdraw</h1>
                <p className="text-sm text-purple-200">Withdraw your earnings quickly and securely.</p>
              </div>

              {/* Account Info Display */}
              <section className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-pink-300" />
                      <p className="text-sm font-semibold text-white">Withdrawal Account</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleEditAccount}
                      className="text-xs font-medium text-pink-300 hover:text-pink-200 transition"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Account Number</span>
                      <span className="text-sm font-semibold text-white">
                        ****{savedAccount.accountNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Account Holder</span>
                      <span className="text-sm font-semibold text-white">{savedAccount.accountHolderName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Bank Name</span>
                      <span className="text-sm font-semibold text-white">{savedAccount.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Account Type</span>
                      <span className="text-sm font-semibold text-white capitalize">{savedAccount.accountType}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-purple-200">Available Balance</p>
                      <p className="text-2xl font-bold text-white">{formattedBalance}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-pink-300">
                      <ArrowDownCircle className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">Withdrawal Amount</p>
                    <div className="border-b border-white/20 pb-3">
                      <label className="text-xs font-medium text-purple-200 block mb-1">Enter Amount</label>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-purple-300" />
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={amount}
                          onChange={(event) => setAmount(event.target.value)}
                          className="w-full bg-transparent border-none text-lg font-semibold text-white placeholder:text-purple-300 focus:outline-none"
                          placeholder="0.00"
                        />
                      </div>
                      {amount && Number(amount) > accountBalance && (
                        <p className="text-xs text-red-400 mt-1">Amount exceeds available balance</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">Quick Fill</p>
                    <div className="grid grid-cols-3 gap-3 text-sm font-semibold">
                      {suggestedAmounts.map((value) => {
                        const isActive = Number(amount) === value;
                        const isDisabled = value > accountBalance;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => !isDisabled && handleSelectAmount(value)}
                            disabled={isDisabled}
                            className={`rounded-2xl py-3 transition ${
                              isActive
                                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/40"
                                : isDisabled
                                ? "bg-white/5 text-purple-300/50 border border-white/10 cursor-not-allowed"
                                : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                            }`}
                          >
                            {formatCurrency(value)}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setAmount("")}
                        className="rounded-2xl py-3 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                      >
                        Others
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">Withdraw Password</p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-purple-300" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={withdrawPassword}
                        onChange={(event) => setWithdrawPassword(event.target.value)}
                        placeholder="Enter withdraw password"
                        className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-purple-300 hover:text-pink-300 transition" />
                        ) : (
                          <Eye className="h-5 w-5 text-purple-300 hover:text-pink-300 transition" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 bg-white/5 border-t border-white/20">
                  <button
                    type="button"
                    onClick={handleWithdraw}
                    disabled={!canWithdraw}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Withdraw Now
                  </button>
                </div>
              </section>
            </>
          )}
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
                <h2 className="text-xl font-semibold text-white">Withdrawal Requested</h2>
                <p className="text-sm text-purple-200">
                  Your withdrawal request has been submitted successfully. Please wait for confirmation.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full border border-white/20 hover:border-pink-300 text-white font-semibold py-3 rounded-full transition bg-white/5 hover:bg-white/10"
                onClick={() => {
                  setShowSuccess(false);
                  setAmount("");
                  setWithdrawPassword("");
                }}
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

