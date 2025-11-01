import MomondoLogo from "../components/MomondoLogo";
import { Link } from "react-router-dom";
import { useState } from "react";

import {Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
   const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <div className="min-h-screen bg-momondo-purple flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <MomondoLogo />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-purple-200 mb-6">Sign in to your account</p>

          <div className="space-y-4">
            <div>
              <label className="block text-purple-100 text-sm font-medium mb-2">
                Usename
              </label>
              <input
                type="text"
                placeholder="Enter Usernamel"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
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
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
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
               <button className="text-pink-400 hover:text-pink-300 transition">
                <Link
              to="/forgot-password"
              className="text-pink-400 hover:text-pink-300 transition font-semibold"
            >
              Forgot password?
            </Link>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </div>


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