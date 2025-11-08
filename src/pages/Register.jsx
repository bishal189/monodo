import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Phone, Lock, Eye, EyeOff, Gift } from "lucide-react";
import MomondoLogo from "../components/MomondoLogo";
import apiClient, { storeTokens, storeUser } from "../services/apiClient";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    withdraw_password: "",
    confirm_withdraw_password: "",
    login_password: "",
    confirm_login_password: "",
    invitation_code: "",
  });
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [showConfirmWithdrawPassword, setShowConfirmWithdrawPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showConfirmLoginPassword, setShowConfirmLoginPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.withdraw_password !== formData.confirm_withdraw_password) {
      toast.error("Withdraw passwords do not match.");
      return;
    }

    if (formData.login_password !== formData.confirm_login_password) {
      toast.error("Login passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await apiClient.post("/register/", formData);

      toast.success(data?.message ?? "Registration successful!");

      if (data?.tokens) {
        storeTokens(data.tokens);
      }

      if (data?.user) {
        storeUser(data.user);
      }

      setFormData({
        username: "",
        phone_number: "",
        withdraw_password: "",
        confirm_withdraw_password: "",
        login_password: "",
        confirm_login_password: "",
        invitation_code: "",
      });

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Unable to register. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-momondo-purple flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <MomondoLogo />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-purple-200 mb-6">Join us and start your journey</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter Username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Withdraw Password Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Withdraw Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type={showWithdrawPassword ? "text" : "password"}
                  name="withdraw_password"
                  value={formData.withdraw_password}
                  onChange={handleChange}
                  placeholder="Enter Withdraw password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowWithdrawPassword(!showWithdrawPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showWithdrawPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Withdraw Password Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Confirm Withdraw Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type={showConfirmWithdrawPassword ? "text" : "password"}
                  name="confirm_withdraw_password"
                  value={formData.confirm_withdraw_password}
                  onChange={handleChange}
                  placeholder="Confirm Withdraw password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmWithdrawPassword(!showConfirmWithdrawPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmWithdrawPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Password Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Login Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="login_password"
                  value={formData.login_password}
                  onChange={handleChange}
                  placeholder="Enter Login password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showLoginPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Login Password Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Confirm Login Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type={showConfirmLoginPassword ? "text" : "password"}
                  name="confirm_login_password"
                  value={formData.confirm_login_password}
                  onChange={handleChange}
                  placeholder="Confirm Login password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmLoginPassword(!showConfirmLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmLoginPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Invitation Code Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Invitation Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Gift className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type="text"
                  name="invitation_code"
                  value={formData.invitation_code}
                  onChange={handleChange}
                  placeholder="Enter Invitation code"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-purple-200 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-400 hover:text-pink-300 transition font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}