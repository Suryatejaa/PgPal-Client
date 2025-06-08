import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loginUser } from "../authSlice";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import {
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import Modal from "../components/Modal";
import {
  forgotPasswordRequest,
  forgotPasswordVerify,
} from "../services/apiServices";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const role = "owner"; // Fixed role for owner login
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Check if the form is valid
  const isFormValid = credential.trim() !== "" && passwordRegex.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return; // Prevent submission if form is invalid
    dispatch(loginUser({ credential, password, role }))
      .unwrap()
      .then(() => navigate("/dashboard"))
      .catch(() => {}); // error handled in slice
  };

  const handleForgotPasswordRequest = async () => {
    try {
      await forgotPasswordRequest(credential);
      setOtpStep(true);
    } catch (err: any) {
      console.error("Error requesting OTP:", err.response?.data?.message);
      alert(err.response?.data?.message || "Failed to request OTP.");
    }
  };

  const handleForgotPasswordVerify = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await forgotPasswordVerify(
        parseInt(otp, 10),
        newPassword,
        confirmPassword
      );
      alert("Password reset successful!");
      setIsModalOpen(false);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error verifying OTP:", err.response?.data?.message);
      alert(err.response?.data?.message || "Failed to reset password.");
    }
  };
  return (
    <AuthLayout app_type="owner">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Credential Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="flex items-center">
              <EnvelopeIcon className="h-4 w-4 text-gray-500 mr-1" />
              <PhoneIcon className="h-4 w-4 text-gray-500" />
            </div>
            Email or Phone
          </label>
          <div className="relative">
            <input
              placeholder="Enter your email or phone number"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              autoComplete="username"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <LockClosedIcon className="h-4 w-4 text-gray-500" />
            Password
          </label>
          <div className="relative">
            <input
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Links */}
        <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-200">
          <Link
            to="/signup"
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
          >
            Create Account
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 bg-transparent"
          >
            Forgot Password?
          </button>
        </div>
      </form>{" "}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setOtpStep(false);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        }}
      >
        {!otpStep ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your email or phone to receive an OTP
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email or Phone
              </label>
              <input
                placeholder="Enter your email or phone"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              onClick={handleForgotPasswordRequest}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Enter OTP
              </h2>
              <p className="text-gray-600 text-sm">
                An OTP has been sent to your registered email/phone
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  OTP Code
                </label>
                <input
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleForgotPasswordVerify}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
            >
              Reset Password
            </button>
          </div>
        )}
      </Modal>
    </AuthLayout>
  );
};

export default Login;
