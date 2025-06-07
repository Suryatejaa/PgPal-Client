import React, { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { registerUser, verifyOtp } from "../authSlice";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
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
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<null | boolean>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [phoneAvailable, setPhoneAvailable] = useState<null | boolean>(null);
  const [checkingPhone, setCheckingPhone] = useState(false);

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

    setCheckingUsername(true);
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const data = await checkUsernameAvailability(username);
        setUsernameAvailable(data.available);
      } catch {
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
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

    setCheckingEmail(true);
    emailCheckTimeout.current = setTimeout(async () => {
      try {
        const data = await checkEmailAvailability(email);
        setEmailAvailable(data.available);
      } catch {
        setEmailAvailable(null);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
  };

  const checkPhone = (phone: string) => {
    if (phoneCheckTimeout.current) clearTimeout(phoneCheckTimeout.current);

    if (!phone.trim()) {
      setPhoneAvailable(null);
      return;
    }

    setCheckingPhone(true);
    phoneCheckTimeout.current = setTimeout(async () => {
      try {
        const data = await checkPhoneAvailability(phone);
        setPhoneAvailable(data.available);
      } catch {
        setPhoneAvailable(null);
      } finally {
        setCheckingPhone(false);
      }
    }, 500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear field-specific errors

    if (e.target.name === "username") {
      if (e.target.value && !usernameRegex.test(e.target.value)) {
        setErrors((prev) => ({
          ...prev,
          username:
            "Username must be 4-18 chars and only letters, numbers, . or _",
        }));
        setUsernameAvailable(null); // Reset availability if invalid
      } else {
        setErrors((prev) => ({ ...prev, username: "" }));
        if (e.target.value) checkUsername(e.target.value);
      }
    }
    if (e.target.name === "email") checkEmail(e.target.value);
    if (e.target.name === "phoneNumber") checkPhone(e.target.value);

    if (e.target.name === "email") {
      if (e.target.value && !emailRegex.test(e.target.value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
        setEmailAvailable(null); // Reset availability if invalid
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
        if (e.target.value) checkEmail(e.target.value); // Only check if valid
      }
    }

    if (e.target.name === "phoneNumber") {
      if (e.target.value && !phoneRegex.test(e.target.value)) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Invalid phone number" }));
        setPhoneAvailable(null); // Reset availability if invalid
      } else {
        setErrors((prev) => ({ ...prev, phoneNumber: "" }));
        if (e.target.value) checkPhone(e.target.value); // Only check if valid
      }
    }

    if (e.target.name === "password") {
      if (e.target.value && !passwordRegex.test(e.target.value)) {
        setErrors((prev) => ({
          ...prev,
          password:
            "Password should have 8 charaters long and contain atleast a upper case, a lower case, a numeric charater, a special charater",
        }));
        setPhoneAvailable(null); // Reset availability if invalid
      } else {
        setErrors((prev) => ({ ...prev, phoneNumber: "" }));
        if (e.target.value) checkPhone(e.target.value); // Only check if valid
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const res = await dispatch(registerUser(form)).unwrap();
      console.log("otp mode enabled");
      console.log(res);
      setOtpMode(true); // Enable OTP input mode
    } catch (err: any) {
      if (err.errors) {
        // Map server errors to form fields
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          fieldErrors[error.path] = error.msg;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(
        verifyOtp({ otp: parseInt(otp, 10), email: form.email })
      ).unwrap();
      navigate("/dashboard"); // Redirect to dashboard on success
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      alert(err || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        {!otpMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                name="username"
                placeholder="Name"
                value={form.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                  usernameAvailable === false
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                autoComplete="off"
              />
              {errors.username === "" &&
                form.username.trim() !== "" &&
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
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}

            <div className="relative">
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                  emailAvailable === false
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                autoComplete="off"
              />
              {errors.email === "" &&
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
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <div className="relative">
              <input
                name="phoneNumber"
                placeholder="Phone"
                value={form.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                  phoneAvailable === false
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                autoComplete="off"
                maxLength={10}
              />
              {errors.phoneNumber === "" &&
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
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}

            <div className="relative">
              <input
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center text-gray-900 bg-transparent"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            <div className="relative">
              <input
                name="confirmPassword"
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center text-gray-500 bg-transparent"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Select Role:</p>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "tenant" })}
                  className={`px-4 py-2 rounded-half border ${
                    form.role === "tenant"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full border-purple-600"
                      : "bg-gray-200 text-gray-700 rounded-half border-gray-300"
                  }`}
                >
                  Tenant
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "owner" })}
                  className={`px-4 py-2 rounded-half border ${
                    form.role === "owner"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full border-purple-600"
                      : "bg-gray-200 text-gray-700 rounded-half border-gray-300"
                  }`}
                >
                  Owner
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Select Gender:</p>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: "male" })}
                  className={`px-4 py-2 rounded-half border ${
                    form.gender === "male"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full border-purple-600"
                      : "bg-gray-200 text-gray-700 rounded-half border-gray-300"
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: "female" })}
                  className={`px-4 py-2 rounded-half border ${
                    form.gender === "female"
                      ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full border-purple-600"
                      : "bg-gray-200 text-gray-700 rounded-half border-gray-300"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <div className="text-sm text-gray-600 mt-4 text-center">
              Already have an account?{" "}
              <Link to="/" className="text-purple-600 hover:underline">
                Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-800">
              Enter OTP
            </h3>
            <input
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default TenantRegister;
