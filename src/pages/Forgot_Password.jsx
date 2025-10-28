import MomondoLogo from "../components/MomondoLogo";
import { Link } from "react-router-dom";

export default function Forgot_Password() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password Forgot Submitted");
  };

  return (
    <div className="min-h-screen bg-momondo-purple flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <MomondoLogo />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-2">Forgot Password ?</h2>
          <p className="text-purple-200 mb-6">Reset your password here</p>
          <div className="space-y-4">
              <div>
                <label className="block text-purple-100 text-sm font-medium mb-2">
                Email
              </label>
              
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              />
              </div>
              <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Reset Password
            </button>
          </div>

        
        
        
        </div>
      </div>
    </div>
  );
}
