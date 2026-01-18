import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Loader2, ArrowDownCircle, ArrowUpCircle, Filter } from "lucide-react";
import { toast } from "react-toastify";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";
import apiClient from "../services/apiClient";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
];

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "deposit", label: "Deposits" },
  { key: "withdraw", label: "Withdrawals" },
];

const statusMeta = {
  PENDING: {
    icon: Clock,
    labelClass: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    iconClass: "text-yellow-300",
    label: "Pending",
  },
  APPROVED: {
    icon: CheckCircle,
    labelClass: "bg-blue-500/20 text-blue-200 border-blue-500/30",
    iconClass: "text-blue-300",
    label: "Approved",
  },
  COMPLETED: {
    icon: CheckCircle,
    labelClass: "bg-green-500/20 text-green-200 border-green-500/30",
    iconClass: "text-green-300",
    label: "Completed",
  },
  REJECTED: {
    icon: XCircle,
    labelClass: "bg-red-500/20 text-red-200 border-red-500/30",
    iconClass: "text-red-300",
    label: "Rejected",
  },
};

const formatCurrency = (amount) => {
  const numeric = Number(amount ?? 0);
  if (Number.isNaN(numeric)) {
    return amount ?? "$0.00";
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
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${month}/${day}/${year} ${displayHours}:${displayMinutes} ${ampm}`;
};

function TransactionCard({ transaction }) {
  const meta = statusMeta[transaction.status] || statusMeta.PENDING;
  const Icon = meta?.icon ?? Clock;
  const transactionType = transaction.type || transaction.transaction_type;
  const typeIcon = transactionType === "DEPOSIT" ? ArrowUpCircle : ArrowDownCircle;
  const typeColor = transactionType === "DEPOSIT" ? "text-green-400" : "text-pink-400";
  const isPending = transaction.status === "PENDING" || transaction.status === "APPROVED";

  return (
    <div className="bg-white/10 border border-white/15 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${typeColor} bg-white/10`}>
              {typeIcon === ArrowUpCircle ? (
                <ArrowUpCircle className="h-5 w-5" />
              ) : (
                <ArrowDownCircle className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white">
                {transactionType === "DEPOSIT" ? "Deposit" : "Withdrawal"}
              </h3>
              <p className="text-xs text-purple-200 mt-0.5">
                {formatTimestamp(transaction.created_at)}
              </p>
              {transaction.transaction_id && (
                <p className="text-xs text-purple-300 mt-0.5">
                  ID: {transaction.transaction_id}
                </p>
              )}
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${meta.labelClass}`}>
            <Icon className={`h-3.5 w-3.5 ${meta.iconClass}`} />
            <span>{meta.label}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-white/20 pt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-purple-200">Amount</span>
            <span className={`font-bold text-lg ${transactionType === "DEPOSIT" ? "text-green-400" : "text-pink-400"}`}>
              {transactionType === "DEPOSIT" ? "+" : "-"}{formatCurrency(transaction.amount)}
            </span>
          </div>

          {transaction.remark_type && (
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Type</span>
              <span className="font-semibold text-white text-xs">
                {transaction.remark_type}
              </span>
            </div>
          )}

          {transaction.remark && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-xs text-purple-300">{transaction.remark}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get("/api/transaction/my-transactions/");
        setTransactions(data?.transactions || []);
        if (data?.current_balance !== undefined) {
          setCurrentBalance(Number(data.current_balance));
        }
      } catch (err) {
        setError("Unable to load transactions at the moment. Please try again shortly.");
        toast.error("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeStatusFilter !== "all") {
      const statusKey = transaction.status?.toLowerCase();
      if (statusKey !== activeStatusFilter.toLowerCase()) {
        return false;
      }
    }

    if (activeTypeFilter !== "all") {
      const transactionType = transaction.type || transaction.transaction_type;
      const typeKey = transactionType?.toLowerCase();
      if (activeTypeFilter === "deposit" && typeKey !== "deposit") {
        return false;
      }
      if (activeTypeFilter === "withdraw" && typeKey !== "withdrawal") {
        return false;
      }
    }

    return true;
  });

  const pendingTransactions = transactions.filter((t) => t.status === "PENDING" || t.status === "APPROVED");
  const pendingCount = pendingTransactions.length;

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {pendingCount > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-100 rounded-2xl p-4 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-200 mb-1">
                    You have {pendingCount} pending transaction{pendingCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-yellow-100/80 text-xs">
                    {pendingCount === 1
                      ? "This transaction is awaiting admin approval."
                      : "These transactions are awaiting admin approval."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-purple-200">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {statusFilters.map((filter) => {
                  const isActive = activeStatusFilter === filter.key;
                  const count = filter.key === "all" 
                    ? transactions.length 
                    : transactions.filter((t) => t.status?.toLowerCase() === filter.key.toLowerCase()).length;
                  
                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveStatusFilter(filter.key)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                          : "bg-white/10 text-purple-200 border border-white/20 hover:border-pink-200 hover:text-white"
                      }`}
                    >
                      {filter.label} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {typeFilters.map((filter) => {
                  const isActive = activeTypeFilter === filter.key;
                  const count = filter.key === "all"
                    ? transactions.length
                    : transactions.filter((t) => {
                        const transactionType = t.type || t.transaction_type;
                        const typeKey = transactionType?.toLowerCase();
                        if (filter.key === "deposit") {
                          return typeKey === "deposit";
                        }
                        if (filter.key === "withdraw") {
                          return typeKey === "withdrawal";
                        }
                        return false;
                      }).length;
                  
                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveTypeFilter(filter.key)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                          : "bg-white/10 text-purple-200 border border-white/20 hover:border-blue-200 hover:text-white"
                      }`}
                    >
                      {filter.label} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="bg-white/10 border border-white/15 rounded-3xl p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-300 mx-auto mb-3" />
              <p className="text-purple-200">Loading transactions...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-100 rounded-2xl p-4 text-sm">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="flex flex-col gap-4 pb-12">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-8 text-center">
                  <p className="text-lg font-semibold text-white mb-2">No transactions found</p>
                  <p className="text-sm text-purple-200">
                    {activeStatusFilter !== "all" || activeTypeFilter !== "all"
                      ? "Try adjusting your filters to see more transactions."
                      : "You haven't made any transactions yet."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Footer />
    </div>
  );
}

