import { useState, useEffect } from "react";
import { ArrowDownCircle, DollarSign, MessageCircle, Lock, Eye, EyeOff, CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import apiClient from "../services/apiClient";

const suggestedAmounts = [50, 100, 200, 300, 500, 1000];

export default function Withdraw() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [minimumWithdraw, setMinimumWithdraw] = useState(0);
  const [maximumWithdraw, setMaximumWithdraw] = useState(0);
  const [amount, setAmount] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(true);
  const [savedAccount, setSavedAccount] = useState(null);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accountForm, setAccountForm] = useState({
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    routingNumber: "",
    accountType: "checking"
  });

  const openLiveChat = () => {
    if (typeof window !== 'undefined' && window.LiveChatWidget) {
      try {
        window.LiveChatWidget.call('maximize');
      } catch (error) {
        if (window.LiveChatWidget.onReady) {
          window.LiveChatWidget.onReady(() => {
            window.LiveChatWidget.call('maximize');
          });
        }
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsFetchingBalance(true);
      try {
        const { data: profileData } = await apiClient.get("/api/auth/profile/");
        if (profileData?.balance !== undefined) {
          setAccountBalance(Number(profileData.balance) || 0);
        }
        if (profileData?.level?.min_withdraw_amount !== undefined) {
          setMinimumWithdraw(Number(profileData.level.min_withdraw_amount) || 0);
        }
        if (profileData?.level?.max_withdraw_amount !== undefined) {
          setMaximumWithdraw(Number(profileData.level.max_withdraw_amount) || 0);
        }

        try {
          const { data: accountData } = await apiClient.get("/api/transaction/withdrawal-accounts/check/");
          if (accountData?.has_account && accountData?.primary_account) {
            const primaryAccount = accountData.primary_account;
            setSavedAccount({
              id: primaryAccount.id,
              account_holder_name: primaryAccount.account_holder_name,
              bank_name: primaryAccount.bank_name,
              account_number: primaryAccount.account_number || "",
              masked_account_number: primaryAccount.masked_account_number,
              account_type: primaryAccount.account_type,
              routing_number: primaryAccount.routing_number || "",
            });
            setShowAccountForm(false);
          } else {
            setShowAccountForm(true);
          }
        } catch (err) {
          setShowAccountForm(true);
        }
      } catch (error) {
        toast.error("Failed to load account information");
      } finally {
        setIsFetchingBalance(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSelectAmount = (value) => {
    setAmount(String(value));
  };

  const handleAccountFormChange = (field, value) => {
    setAccountForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAccount = async () => {
    if (!accountForm.accountNumber || !accountForm.accountHolderName || !accountForm.bankName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSavingAccount(true);
    try {
      const accountTypeUpper = accountForm.accountType?.toUpperCase() || "CHECKING";
      
      const { data } = await apiClient.post("/api/transaction/withdrawal-accounts/", {
        account_holder_name: accountForm.accountHolderName,
        bank_name: accountForm.bankName,
        account_number: accountForm.accountNumber,
        routing_number: accountForm.routingNumber || "",
        account_type: accountTypeUpper,
        is_primary: true,
      });

      toast.success(data.message || "Account details saved successfully");
      setSavedAccount(data.bank_account || data);
      setShowAccountForm(false);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to save account details. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = Number(amount);
    
    if (!amount || withdrawAmount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    if (!withdrawPassword) {
      toast.error("Please enter your withdrawal password");
      return;
    }

    if (!savedAccount) {
      toast.error("Please save your bank account details first");
      setShowAccountForm(true);
      return;
    }

    if (withdrawAmount > accountBalance) {
      toast.error(`Insufficient balance. Available: ${formatCurrency(accountBalance)}`);
      return;
    }

    if (minimumWithdraw > 0 && withdrawAmount < minimumWithdraw) {
      toast.error(`Minimum withdrawal amount is ${formatCurrency(minimumWithdraw)}`);
      return;
    }

    if (maximumWithdraw > 0 && withdrawAmount > maximumWithdraw) {
      toast.error(`Maximum withdrawal amount is ${formatCurrency(maximumWithdraw)}`);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await apiClient.post("/api/transaction/withdraw/", {
        amount: withdrawAmount,
        withdraw_password: withdrawPassword,
        withdrawal_account_id: savedAccount?.id,
        remark: `Withdrawal to bank account`,
      });

      toast.success(data.message || "Withdrawal request submitted successfully");
      setAmount("");
      setWithdrawPassword("");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.withdraw_password?.[0] ||
        error?.response?.data?.amount?.[0] ||
        "Failed to process withdrawal. Please try again.";
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

  const formattedAvailableBalance = formatCurrency(accountBalance);
  const canWithdraw = 
    amount && 
    Number(amount) > 0 && 
    Number(amount) <= accountBalance &&
    (!minimumWithdraw || Number(amount) >= minimumWithdraw) &&
    (!maximumWithdraw || Number(amount) <= maximumWithdraw) &&
    withdrawPassword && 
    savedAccount &&
    !showAccountForm;

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {showAccountForm ? (
            <>
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold">Add Withdrawal Account</h1>
                <p className="text-sm text-purple-200">
                  {savedAccount ? "Update your bank account details" : "Add your bank account details to withdraw funds"}
                </p>
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
                      disabled={isSavingAccount}
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
                      disabled={isSavingAccount}
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
                      disabled={isSavingAccount}
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
                      disabled={isSavingAccount}
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
                      disabled={isSavingAccount}
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
                    disabled={isSavingAccount || !accountForm.accountNumber || !accountForm.accountHolderName || !accountForm.bankName}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingAccount ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Account & Continue"
                    )}
                  </button>
                </div>
              </section>
            </>
          ) : (
            <>
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold">Withdraw</h1>
                <p className="text-sm text-purple-200">Withdraw your earnings quickly and securely.</p>
              </div>

              <section className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-pink-300" />
                    <p className="text-sm font-semibold text-white">Withdrawal Account</p>
                  </div>

                  <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Account Number</span>
                      <span className="text-sm font-semibold text-white">
                        {savedAccount?.masked_account_number || `****${savedAccount?.account_number?.slice(-4) || "****"}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Account Holder</span>
                      <span className="text-sm font-semibold text-white">{savedAccount?.account_holder_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Bank Name</span>
                      <span className="text-sm font-semibold text-white">{savedAccount?.bank_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Account Type</span>
                      <span className="text-sm font-semibold text-white capitalize">{savedAccount?.account_type}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-purple-200">Available Balance</p>
                      {isFetchingBalance ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
                          <p className="text-2xl font-bold text-white">Loading...</p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-white">{formattedAvailableBalance}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-pink-300">
                      <ArrowDownCircle className="h-6 w-6" />
                    </div>
                  </div>

                  {minimumWithdraw > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl px-4 py-2 text-xs text-blue-100">
                      Minimum withdrawal: {formatCurrency(minimumWithdraw)}
                      {maximumWithdraw > 0 && ` | Maximum: ${formatCurrency(maximumWithdraw)}`}
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">Withdrawal Amount</p>
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
                          className="w-full bg-transparent border-none text-lg font-semibold text-white placeholder:text-purple-300 focus:outline-none disabled:opacity-50"
                          placeholder="0.00"
                          disabled={isLoading}
                        />
                      </div>
                      {amount && Number(amount) > accountBalance && (
                        <p className="text-xs text-red-400 mt-1">Amount exceeds available balance</p>
                      )}
                      {minimumWithdraw > 0 && amount && Number(amount) < minimumWithdraw && (
                        <p className="text-xs text-red-400 mt-1">
                          Minimum withdrawal amount is {formatCurrency(minimumWithdraw)}
                        </p>
                      )}
                      {maximumWithdraw > 0 && amount && Number(amount) > maximumWithdraw && (
                        <p className="text-xs text-red-400 mt-1">
                          Maximum withdrawal amount is {formatCurrency(maximumWithdraw)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">Quick Fill</p>
                    <div className="grid grid-cols-3 gap-3 text-sm font-semibold">
                      {suggestedAmounts.map((value) => {
                        const isActive = Number(amount) === value;
                        const isDisabled = value > accountBalance || (minimumWithdraw > 0 && value < minimumWithdraw) || (maximumWithdraw > 0 && value > maximumWithdraw);
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => !isDisabled && handleSelectAmount(value)}
                            disabled={isDisabled || isLoading}
                            className={`rounded-2xl py-3 transition ${
                              isActive
                                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/40"
                                : isDisabled
                                ? "bg-white/5 text-purple-300/50 border border-white/10 cursor-not-allowed"
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
                        className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition disabled:opacity-50"
                        disabled={isLoading}
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
                    disabled={!canWithdraw || isLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Withdraw Now"
                    )}
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
