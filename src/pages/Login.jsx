import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Lock, Eye, EyeOff } from "lucide-react";
import MomondoLogo from "../components/MomondoLogo";
import apiClient, { storeTokens, storeUser } from "../services/apiClient";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { data } = await apiClient.post("/api/auth/login/", formData);
      
      if (data?.refresh && data?.access) {
        if (data?.user) {
          const user = data.user;
          const isNormalUser = user.role === "USER" || user.is_normal_user === true;
          
          if (!isNormalUser) {
            setErrorMessage("Access denied. Only normal users can login.");
            toast.error("Access denied. Only normal users can login.");
            setIsSubmitting(false);
            return;
          }
          
          storeUser(user);
        }
        
        storeTokens({
          refresh: data.refresh,
          access: data.access,
        });
        toast.success("Login successful!");
      } else {
        const errorMsg = "Invalid response from server.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      setFormData({
        email: "",
        password: "",
      });

      setTimeout(() => navigate("/home"), 800);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Access denied. Only normal users can login.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
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
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-purple-200 mb-6">Sign in to your account to continue</p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-100/90 border-2 border-red-400">
              <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300 hover:text-pink-400 transition" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-purple-200">
                <input
                  type="checkbox"
                  className="mr-2 rounded bg-white/10 border-white/20 text-pink-500 focus:ring-pink-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-pink-400 hover:text-pink-300 transition font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-purple-200 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-400 hover:text-pink-300 transition font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}