import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/api/users/forgot-password", { email });
      toast.success(data.message || "If the email exists, a link was sent");
      if (data?.resetUrl) {
        await new Promise((r) => setTimeout(r, 2000));
        window.location.href = data.resetUrl;
        return;
      }
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <button
          onClick={() => navigate("/auth?state=login")}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-500 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
