import React, { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { registerUser, verifyOtp } from "../authSlice";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  PhoneIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { useRef } from "react";
import {
  checkUsernameAvailability,
  checkEmailAvailability,
  checkPhoneAvailability,
} from "../services/apiServices";

const TenantRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //   const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirmPassword field
    phoneNumber: "",
    role: "tenant",
    gender: "male",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpMode, setOtpMode] = useState(false); // Toggle OTP input
  const [otp, setOtp] = useState(""); // OTP input field
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null); // Add OTP error state
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );
  const [emailAvailable, setEmailAvailable] = useState<null | boolean>(null);
  const [phoneAvailable, setPhoneAvailable] = useState<null | boolean>(null);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // Adjust as per your phone format
  const usernameRegex = /^[A-Za-z0-9._]{4,18}$/;

  // Check if the form is valid
  const isFormValid =
    form.username.trim() !== "" &&
    usernameRegex.test(form.username) &&
    form.email.trim() !== "" &&
    form.phoneNumber.trim() !== "" &&
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    form.password === form.confirmPassword &&
    passwordRegex.test(form.password) &&
    emailRegex.test(form.email) && // Email regex check
    phoneRegex.test(form.phoneNumber) &&
    usernameAvailable !== false &&
    emailAvailable !== false &&
    phoneAvailable !== false;

  const usernameCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const checkUsername = (username: string) => {
    if (usernameCheckTimeout.current)
      clearTimeout(usernameCheckTimeout.current);

    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const data = await checkUsernameAvailability(username);
        // console.log(data)
        setUsernameAvailable(data.available);
      } catch (e) {
        console.error("Error checking username availability:", e);
        setUsernameAvailable(null);
      }
    }, 500);
  };

  const emailCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkEmail = (email: string) => {
    if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);

    if (!email.trim()) {
      setEmailAvailable(null);
      return;
    }

    emailCheckTimeout.current = setTimeout(async () => {
      try {
        const data = await checkEmailAvailability(email);
        console.log(data.availabile);
        setEmailAvailable(data.available);
      } catch {
        setEmailAvailable(null);
      }
    }, 500);
  };
  const checkPhone = (phone: string) => {
    if (phoneCheckTimeout.current) clearTimeout(phoneCheckTimeout.current);

    if (!phone.trim()) {
      setPhoneAvailable(null);
      return;
    }

    phoneCheckTimeout.current = setTimeout(async () => {
      try {
        const data = await checkPhoneAvailability(phone);
        setPhoneAvailable(data.available);
      } catch {
        setPhoneAvailable(null);
      }
    }, 500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const processedValue = name === "username" ? value.toLowerCase() : value;

    setForm({ ...form, [name]: processedValue });
    setErrors({ ...errors, [name]: "" }); // Clear field-specific errors

    if (name === "username") {
      if (processedValue && !usernameRegex.test(processedValue)) {
        setErrors((prev) => ({
          ...prev,
          username:
            "Username must be 4-18 chars and only letters, numbers, . or _",
        }));
        setUsernameAvailable(null); // Reset availability if invalid
      } else {
        setErrors((prev) => ({ ...prev, username: "" }));
        if (processedValue) checkUsername(processedValue);
      }
    }

    if (name === "email") {
      if (value && !emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
        setEmailAvailable(null); // Reset availability if invalid
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
        if (value) checkEmail(value); // Only check if valid
      }
    }

    if (name === "phoneNumber") {
      if (value && !phoneRegex.test(value)) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Invalid phone number" }));
        setPhoneAvailable(null); // Reset availability if invalid
      } else {
        setErrors((prev) => ({ ...prev, phoneNumber: "" }));
        if (value) checkPhone(value); // Only check if valid
      }
    }
    if (name === "password") {
      if (value && !passwordRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          password:
            "Password should have 8 characters long and contain at least an uppercase, lowercase, numeric and special character",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
    if (name === "confirmPassword") {
      if (value && value !== form.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear all previous errors

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      await dispatch(registerUser(form)).unwrap();
      console.log("✅ Registration successful, switching to OTP mode");
      setOtpMode(true);
    } catch (err: any) {
      console.error("❌ Registration failed:", err);

      // IMPROVED ERROR HANDLING
      if (err && err.errors && Array.isArray(err.errors)) {
        // Handle field-specific validation errors (like "username already taken")
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          if (error.path && error.msg) {
            fieldErrors[error.path] = error.msg;
          }
        });
        setErrors(fieldErrors);
        console.log("📝 Field errors set:", fieldErrors);
      } else if (err && err.message) {
        // Handle general errors
        setErrors({ form: err.message });
        console.log("📝 General error set:", err.message);
      } else if (typeof err === "string") {
        // Handle string errors
        setErrors({ form: err });
      } else {
        setErrors({ form: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError(null); // Clear previous OTP errors

    try {
      await dispatch(
        verifyOtp({ otp: parseInt(otp, 10), email: form.email })
      ).unwrap();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ OTP verification failed:", err);

      // IMPROVED OTP ERROR HANDLING
      if (err && err.message) {
        setOtpError(err.message);
      } else if (typeof err === "string") {
        setOtpError(err);
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout app_type="tenant">
      {" "}
      <div>
        {!otpMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-500" />
                Username
              </label>
              <div className="relative">
                <input
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${
                    errors.username || usernameAvailable === false
                      ? "border-red-500 focus:ring-red-500"
                      : usernameAvailable === true
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300"
                  }`}
                  autoComplete="off"
                />
                {/* ADD: Visual indicator icons */}
                {!errors.username &&
                  form.username.trim() !== "" &&
                  usernameRegex.test(form.username) &&
                  usernameAvailable !== null && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {usernameAvailable ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </span>
                  )}
              </div>
              {/* FIX: Add text feedback for username */}
              {errors.username ? (
                <p className="text-red-500 text-sm font-medium">
                  {errors.username}
                </p>
              ) : usernameAvailable === false &&
                form.username.trim() !== "" &&
                usernameRegex.test(form.username) ? (
                <p className="text-red-500 text-sm font-medium">
                  Username already taken.
                </p>
              ) : null}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${
                    errors.email || emailAvailable === false
                      ? "border-red-500 focus:ring-red-500"
                      : emailAvailable === true
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300"
                  }`}
                  autoComplete="off"
                />
                {/* ADD: Visual indicator icons */}
                {!errors.email &&
                  form.email.trim() !== "" &&
                  emailRegex.test(form.email) &&
                  emailAvailable !== null && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailAvailable ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </span>
                  )}
              </div>
              {/* FIX: Add proper text feedback for email */}
              {errors.email ? (
                <p className="text-red-500 text-sm font-medium">
                  {errors.email}
                </p>
              ) : emailAvailable === false &&
                form.email.trim() !== "" &&
                emailRegex.test(form.email) ? (
                <p className="text-red-500 text-sm font-medium">
                  Email already taken.
                </p>
              ) : null}
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-gray-500" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${
                    errors.phoneNumber || phoneAvailable === false
                      ? "border-red-500 focus:ring-red-500"
                      : phoneAvailable === true
                      ? "border-green-500 focus:ring-green-500"
                      : "border-gray-300"
                  }`}
                  autoComplete="off"
                  maxLength={10}
                />
                {/* ADD: Visual indicator icons */}
                {!errors.phoneNumber &&
                  form.phoneNumber.trim() !== "" &&
                  phoneRegex.test(form.phoneNumber) &&
                  phoneAvailable !== null && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {phoneAvailable ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </span>
                  )}
              </div>
              {/* FIX: Add proper text feedback for phone */}
              {errors.phoneNumber ? (
                <p className="text-red-500 text-sm font-medium">
                  {errors.phoneNumber}
                </p>
              ) : phoneAvailable === false &&
                form.phoneNumber.trim() !== "" &&
                phoneRegex.test(form.phoneNumber) ? (
                <p className="text-red-500 text-sm font-medium">
                  Phone number already taken.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <LockClosedIcon className="h-4 w-4 text-gray-500" />
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
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
              {errors.password && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.password}
                </p>
              )}
            </div>
            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <LockClosedIcon className="h-4 w-4 text-gray-500" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {/* Gender Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Select Gender
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: "male" })}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 font-medium ${
                    form.gender === "male"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: "female" })}
                  className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 font-medium ${
                    form.gender === "female"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <span className="text-gray-600 text-sm">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Verify Your Email
              </h3>
              <p className="text-gray-600 text-sm">
                We've sent a verification code to your email address
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                name="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default TenantRegister;
