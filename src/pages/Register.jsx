import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { User, Phone, Lock, Eye, EyeOff, Gift, Mail } from "lucide-react";
import MomondoLogo from "../components/MomondoLogo";
import apiClient, { storeTokens, storeUser } from "../services/apiClient";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    email: "",
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
  const [errors, setErrors] = useState({
    username: "",
    phone_number: "",
    email: "",
    withdraw_password: "",
    confirm_withdraw_password: "",
    login_password: "",
    confirm_login_password: "",
    invitation_code: "",
  });

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "login_password") {
      setErrors((prev) => ({
        ...prev,
        login_password: validatePassword(value),
        confirm_login_password: value !== formData.confirm_login_password && formData.confirm_login_password ? "Passwords do not match" : "",
      }));
    } else if (name === "confirm_login_password") {
      setErrors((prev) => ({
        ...prev,
        confirm_login_password: value !== formData.login_password ? "Passwords do not match" : "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginPasswordError = validatePassword(formData.login_password);

    setErrors({
      login_password: loginPasswordError,
      confirm_login_password: formData.login_password !== formData.confirm_login_password ? "Passwords do not match" : "",
    });

    if (loginPasswordError) {
      toast.error("Please fix password validation errors.");
      return;
    }

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
      const registrationData = {
        username: formData.username,
        phone_number: formData.phone_number,
        email: formData.email,
        login_password: formData.login_password,
        confirm_login_password: formData.confirm_login_password,
        withdraw_password: formData.withdraw_password,
        confirm_withdraw_password: formData.confirm_withdraw_password,
        invitation_code: formData.invitation_code,
      };

      const { data } = await apiClient.post("/api/auth/register/", registrationData);

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
        email: "",
        withdraw_password: "",
        confirm_withdraw_password: "",
        login_password: "",
        confirm_login_password: "",
        invitation_code: "",
      });

      setErrors({
        username: "",
        phone_number: "",
        email: "",
        withdraw_password: "",
        confirm_withdraw_password: "",
        login_password: "",
        confirm_login_password: "",
        invitation_code: "",
      });

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const errorData = error?.response?.data || {};
      
      if (errorData.errors) {
        const apiErrors = {};
        
        Object.keys(errorData.errors).forEach((field) => {
          const fieldError = errorData.errors[field];
          if (Array.isArray(fieldError)) {
            apiErrors[field] = fieldError.join(", ");
          } else {
            apiErrors[field] = fieldError;
          }
        });
        
        setErrors((prev) => ({
          ...prev,
          ...apiErrors,
        }));
        
        if (errorData.message) {
          toast.error(errorData.message);
        }
      } else {
        const errorMessage =
          errorData.message ||
          errorData.detail ||
          "Unable to register. Please try again.";
        toast.error(errorMessage);
      }
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
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${
                    errors.username ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
                  required
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
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
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${
                    errors.phone_number ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
                  required
                />
              </div>
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-400">{errors.phone_number}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${
                    errors.email ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${
                    errors.withdraw_password ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
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
              {errors.withdraw_password && (
                <p className="mt-1 text-sm text-red-400">{errors.withdraw_password}</p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${
                    errors.confirm_withdraw_password ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
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
              {errors.confirm_withdraw_password && (
                <p className="mt-1 text-sm text-red-400">{errors.confirm_withdraw_password}</p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${
                    errors.login_password ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
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
              {errors.login_password && (
                <p className="mt-1 text-sm text-red-400">{errors.login_password}</p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border ${
                    errors.confirm_login_password ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
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
              {errors.confirm_login_password && (
                <p className="mt-1 text-sm text-red-400">{errors.confirm_login_password}</p>
              )}
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
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${
                    errors.invitation_code ? "border-red-400" : "border-white/20"
                  } text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition`}
                />
              </div>
              {errors.invitation_code && (
                <p className="mt-1 text-sm text-red-400">{errors.invitation_code}</p>
              )}
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