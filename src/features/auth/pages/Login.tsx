import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loginUser } from "../authSlice";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";
import axios from "axios";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("owner");
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      await axios.post(
        "http://localhost:4000/api/auth-service/forgot-password-request",
        {
          credential,
        }
      );
      setOtpStep(true); // Move to OTP step
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
      await axios.post(
        "http://localhost:4000/api/auth-service/forgot-password-verify-otp",
        {
          otp: parseInt(otp, 10),
          newPassword,
          confirmPassword,
        }
      );
      alert("Password reset successful!");
      setIsModalOpen(false); // Close modal
    } catch (err: any) {
      console.error("Error verifying OTP:", err.response?.data?.message);
      alert(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Phone or Email"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="relative">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"} // Toggle password visibility
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center text-gray-700 bg-transparent"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-gray-700 font-medium">Select Role:</p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`px-4 py-2 rounded-full border ${
                role === "owner"
                  ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-600"
                  : "bg-gray-200 text-gray-700 border-gray-300"
              }`}
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => setRole("tenant")}
              className={`px-4 py-2 rounded-full border ${
                role === "tenant"
                  ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-600"
                  : "bg-gray-200 text-gray-700 border-gray-300"
              }`}
            >
              Tenant
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
          <Link to="/signup" className="hover:underline">
            Sign Up
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="hover:underline text-purple-600 bg-transparent"
          >
            Forgot Password?
          </button>
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {!otpStep ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Forgot Password</h2>
            <input
              placeholder="Enter your email or phone"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleForgotPasswordRequest}
              className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Request OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Reset Password</h2>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleForgotPasswordVerify}
              className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-2 rounded-lg hover:opacity-90 transition"
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
