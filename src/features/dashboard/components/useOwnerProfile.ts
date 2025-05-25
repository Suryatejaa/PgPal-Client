import { useState, useRef } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useAppDispatch } from "../../../app/hooks";
import { logoutUser } from "../../auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function useOwnerProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const usernameCheckTimeout = useRef<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [emailPhoneError, setEmailPhoneError] = useState<string | null>(null);
  const [editingEmailPhone, setEditingEmailPhone] = useState(false);

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [checkingPhone, setCheckingPhone] = useState(false);

  const emailCheckTimeout = useRef<any>(null);
  const phoneCheckTimeout = useRef<any>(null);

  const [editingPhone, setEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [updatingPhone, setUpdatingPhone] = useState(false);

  const [editingPassword, setEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const usernameRegex = /^[A-Za-z0-9._]{4,18}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const fetchProfile = () => {
    const res = axiosInstance
      .get("http://localhost:4000/api/auth-service/me", {
        withCredentials: true,
      })
      .then((res: any) => res.data.user)
      .then(setProfile)
      .catch(() => setProfile(null));
  };
  const checkUsername = (username: string) => {
    if (usernameCheckTimeout.current)
      clearTimeout(usernameCheckTimeout.current);
    if (!username.trim()) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }
    setCheckingUsername(true);
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/api/auth-service/check-username?username=${encodeURIComponent(
            username
          )}`
        );
        const data = await res.data;
        setUsernameAvailable(data.available);
        setUsernameError(data.available ? null : "Username not available");
      } catch {
        setUsernameAvailable(null);
        setUsernameError("Error checking username");
      } finally {
        setCheckingUsername(false);
      }
    }, 500);
  };

  const handleUsernameEdit = () => {
    setEditingUsername(true);
    setNewUsername(profile?.username || "");
    setUsernameAvailable(null);
    setUsernameError(null);
  };

  const checkEmail = (email: string) => {
    if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);
    if (!email.trim()) {
      setEmailAvailable(null);
      setEmailPhoneError(null);
      return;
    }
    setCheckingEmail(true);
    emailCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/api/auth-service/check-email?email=${encodeURIComponent(
            email
          )}`
        );
        const data = await res.data;
        setEmailAvailable(data.available);
        setEmailPhoneError(data.available ? null : "Email not available");
      } catch {
        setEmailAvailable(null);
        setEmailPhoneError("Error checking email");
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
  };

  const checkPhone = (phone: string) => {
    if (phoneCheckTimeout.current) clearTimeout(phoneCheckTimeout.current);
    if (!phone.trim()) {
      setPhoneAvailable(null);
      setEmailPhoneError(null);
      return;
    }
    setCheckingPhone(true);
    phoneCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `http://localhost:4000/api/auth-service/check-phonenumber?phoneNumber=${encodeURIComponent(
            phone
          )}`
        );
        const data = await res.data;
        setPhoneAvailable(data.available);
        setEmailPhoneError(data.available ? null : "Phone not available");
      } catch (err: any) {
        setPhoneAvailable(null);
        setEmailPhoneError("Error checking phone");
      } finally {
        setCheckingPhone(false);
      }
    }, 500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
    if (e.target.value !== profile?.email) {
      checkEmail(e.target.value);
    } else {
      setEmailAvailable(null);
      setEmailPhoneError(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPhone(e.target.value);
    if (!phoneRegex.test(e.target.value)) {
      setEmailPhoneError(
        "Phone number should have 10 digits long and contain only numbers"
      );
    } else if (
      e.target.value !== profile?.phoneNumber &&
      e.target.value.length === 10 &&
      emailPhoneError
    ) {
      checkPhone(e.target.value);
    } else {
      setPhoneAvailable(null);
      setEmailPhoneError(null);
    }
  };

  const handleEmailPhoneEdit = () => {
    setEditingEmailPhone(true);
    setNewEmail(profile?.email || "");
    setNewPhone(profile?.phoneNumber || "");
    setEmailPhoneError(null);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
    if (e.target.value !== profile?.username) {
      checkUsername(e.target.value);
      if (!usernameRegex.test(e.target.value)) {
        setUsernameError(
          "Username must be 4-18 chars and only letters, numbers, . or _"
        );
      }
    } else {
      setUsernameAvailable(null);
      setUsernameError(null);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || newUsername === profile?.username) return;
    setUpdatingUsername(true);
    try {
      const res = await axiosInstance.put(
        "http://localhost:4000/api/auth-service/me",
        {
          username: newUsername,
        },
        {
          withCredentials: true,
        }
      );
      const updated = await res.data;
      setProfile((prev: any) => ({ ...prev, username: updated.username }));
      setEditingUsername(false);
    } catch (err) {
      setUsernameError("Failed to update username");
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handleEmailPhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPhone) return;
    setUpdatingEmail(true);
    setEmailPhoneError(null);
    try {
      const res = await axiosInstance.put(
        "http://localhost:4000/api/auth-service/me",
        {
          email: newEmail,
          phoneNumber: newPhone,
        },
        {
          withCredentials: true,
        }
      );
      setOtpMode(true);
      setEditingEmailPhone(true);
    } catch (err) {
      setEmailPhoneError("Failed to update email and phone");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingEmail(true);
    setOtpError(null);
    try {
      const res = await axiosInstance.post(
        "http://localhost:4000/api/auth-service/email-otp/verify",
        {
          email: newEmail,
          otp,
        }
      );
      const updated = await res.data;
      setProfile((prev: any) => ({
        ...prev,
        email: updated.email,
        phoneNumber: updated.phoneNumber,
      }));
      fetchProfile();
      setEditingEmail(false);
      setNewEmail("");
      setNewPhone("");
      setOtp("");
      setOtpMode(false);
      setEditingEmailPhone(false);
      setEmailPhoneError(null);
    } catch (err) {
      setOtpError("Invalid OTP or failed to update email");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handlePasswordEdit = () => {
    setEditingPassword(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  };

  const handlePasswordChange = () => {
    if (oldPassword.length < 8) {
      setPasswordError("Password must be 8 characters long");
      return;
    } else if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password should have 8 charaters long and contain atleast a upper case, a lower case, a numeric charater, a special charater "
      );
    } else if (newPassword !== confirmPassword) {
      setPasswordError("New and Confirm Password doesn't match");
    } else {
      setPasswordError(null);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match or missing fields");
      return;
    }
    setUpdatingPassword(true);
    setPasswordError(null);
    try {
      const res = await axiosInstance.put(
        "http://localhost:4000/api/auth-service/me",
        {
          currentPassword: oldPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      if (!res.data) throw new Error("Failed to update password");
      setEditingPassword(false);
    } catch (err: any) {
      setPasswordError("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return {
    profile,
    setProfile,
    editingUsername,
    setEditingUsername,
    newUsername,
    setNewUsername,
    usernameAvailable,
    setUsernameAvailable,
    checkingUsername,
    setCheckingUsername,
    updatingUsername,
    setUpdatingUsername,
    usernameError,
    setUsernameError,
    usernameCheckTimeout,
    fetchProfile,
    editingEmail,
    setEditingEmail,
    newEmail,
    setNewEmail,
    emailError,
    setEmailError,
    updatingEmail,
    setUpdatingEmail,
    otpMode,
    setOtpMode,
    otp,
    setOtp,
    otpError,
    setOtpError,
    emailPhoneError,
    setEmailPhoneError,
    editingEmailPhone,
    setEditingEmailPhone,
    emailAvailable,
    setEmailAvailable,
    checkingEmail,
    setCheckingEmail,
    phoneAvailable,
    setPhoneAvailable,
    checkingPhone,
    setCheckingPhone,
    emailCheckTimeout,
    phoneCheckTimeout,
    editingPhone,
    setEditingPhone,
    newPhone,
    setNewPhone,
    phoneError,
    setPhoneError,
    updatingPhone,
    setUpdatingPhone,
    editingPassword,
    setEditingPassword,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    setPasswordError,
    updatingPassword,
    setUpdatingPassword,
    showLogoutConfirm,
    setShowLogoutConfirm,
    checkUsername,
    handleUsernameEdit,
    handleUsernameChange,
    handleUsernameSubmit,
    checkEmail,
    checkPhone,
    handleEmailChange,
    handlePhoneChange,
    handleEmailPhoneEdit,
    handleEmailPhoneChange,
    handleOtpSubmit,
    handlePasswordEdit,
    handlePasswordChange,
    handlePasswordSubmit,
    handleLogout
  };
}