import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        await api.post("/api/users/verify-email", { token });
        setStatus("success");
        toast.success("Account created, please login");
      } catch (error) {
        setStatus("error");
        toast.error(error?.response?.data?.message || "Verification failed");
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900">
              Verifying your email...
            </h2>
            <p className="text-gray-500">
              Please wait while we verify your token.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Account created
            </h2>
            <p className="text-gray-600 text-sm max-w-sm">
              Your email has been verified successfully. Please login to
              continue.
            </p>
            <button
              onClick={() => navigate("/auth?state=login")}
              className="mt-2 w-full max-w-xs px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Verification Failed
            </h2>
            <p className="text-gray-500">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate("/auth?state=register")}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Back to Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
