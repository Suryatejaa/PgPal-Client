import { useState, useRef } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useAppDispatch } from "../../../app/hooks";
import { logoutUser } from "../../auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function useOwnerProfile() {
  // Keep only the states that are actually used
  const  dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  // Username editing
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const usernameCheckTimeout = useRef<any>(null);
  
  // Email & Phone editing (combined)
  const [editingEmailPhone, setEditingEmailPhone] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [emailPhoneError, setEmailPhoneError] = useState<string | null>(null);
  const [updatingEmailPhone, setUpdatingEmailPhone] = useState(false);
  
  // Availability checking
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const emailCheckTimeout = useRef<any>(null);
  const phoneCheckTimeout = useRef<any>(null);
  
  // OTP verification
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  
  // Password editing
  const [editingPassword, setEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Regex patterns
  const usernameRegex = /^[A-Za-z0-9._]{4,18}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const fetchProfile = () => {
    axiosInstance
      .get("/auth-service/me", { withCredentials: true })
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
          `/auth-service/check-usernames?username=${encodeURIComponent(username)}`
        );
        const data = await res.data;
        setUsernameAvailable(data.available);
        setUsernameError(data.available ? null : "Username not available");
      } catch(e:any) {
        //console.log(e)
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
          `/auth-service/check-email?email=${encodeURIComponent(email)}`
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
          `/auth-service/check-phonenumber?phoneNumber=${encodeURIComponent(phone)}`
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
  setEmailAvailable(null);  // Reset availability states
  setPhoneAvailable(null);  
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
      const res = await axiosInstance.put("/auth-service/me", {
        username: newUsername,
      }, { withCredentials: true });
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
    setUpdatingEmailPhone(true);
    setEmailPhoneError(null);
  
    try {
      // Check what's being changed
      const isEmailChanged = newEmail !== profile?.email;
      const isPhoneChanged = newPhone !== profile?.phoneNumber;
  
      if (isEmailChanged) {
        // If email is being changed, send OTP regardless of phone change
        console.log("📧 Email change detected, sending OTP to:", newEmail);
        
        const res = await axiosInstance.put("/auth-service/me", {
          email: newEmail,
          phoneNumber: newPhone,
        }, { withCredentials: true });
        
        console.log("✅ OTP sent for email verification");
        setOtpMode(true);
        
      } else if (isPhoneChanged && !isEmailChanged) {
        // If only phone is being changed, update directly without OTP
        console.log("📱 Only phone change detected, updating directly");
        
        const res = await axiosInstance.put("/auth-service/me", {
          phoneNumber: newPhone,
        }, { withCredentials: true });
        
        console.log("✅ Phone number updated successfully", res.data);
        
        // Update the profile in state immediately
        setProfile((prev: any) => ({
          ...prev,
          phoneNumber: newPhone // Use the newPhone value, not from response
        }));
        
        // ✅ FIX: Close edit mode and reset states AFTER successful update
        setEditingEmailPhone(false);
        setNewEmail("");  // Clear the form
        setNewPhone("");  // Clear the form
        setEmailPhoneError(null);
        
        console.log("Phone number updated successfully!");
        
      } else {
        // Neither field has changed
        setEmailPhoneError("No changes detected");
      }
      
    } catch (err: any) {
      console.error("❌ Update failed:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to update. Please try again.";
      setEmailPhoneError(errorMessage);
    } finally {
      setUpdatingEmailPhone(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingEmailPhone(true); // Use the same loading state
    setOtpError(null);
    
    try {
      console.log("🔢 Verifying OTP for email/phone update");
      
      const res = await axiosInstance.post(
        "/auth-service/email-otp/verify",
        {
          email: newEmail,
          otp: parseInt(otp, 10), // Ensure it's a number
        },
        { withCredentials: true }
      );
      
      const updated = res.data;
      console.log("✅ OTP verified, profile updated");
      
      // Update the profile in state
      setProfile((prev: any) => ({
        ...prev,
        email: updated.email || newEmail,
        phoneNumber: updated.phoneNumber || newPhone,
      }));
      
      // Optionally fetch fresh profile data
      fetchProfile();
      
      // Reset all form states
      setOtpMode(false);
      setEditingEmailPhone(false);
      setOtp("");
      setNewEmail(profile?.email || "");
      setNewPhone(profile?.phoneNumber || "");
      setEmailPhoneError(null);
      setOtpError(null);
      
      console.log("Email and phone updated successfully!");
      
    } catch (err: any) {
      console.error("❌ OTP verification failed:", err);
      setOtpError(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setUpdatingEmailPhone(false);
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
    
    // Call validation first
    handlePasswordChange();
    
    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match or missing fields");
      return;
    }
    
    if (passwordError) {
      return; // Don't submit if there are validation errors
    }
    
    setUpdatingPassword(true);
    setPasswordError(null);
    
    try {
      const res = await axiosInstance.put(
        "/auth-service/me",
        {
          currentPassword: oldPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      
      console.log("✅ Password updated successfully");
      setEditingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
      
    } catch (err: any) {
      console.error("❌ Password update failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to update password";
      setPasswordError(errorMessage);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return {
    // Profile data
    profile,
    setProfile,
    fetchProfile,

    // Username editing
    editingUsername,
    setEditingUsername,
    newUsername,
    setNewUsername,
    usernameAvailable,
    checkingUsername,
    updatingUsername,
    usernameError,
    setUsernameError,
    handleUsernameEdit,
    handleUsernameChange,
    handleUsernameSubmit,

    // Email & Phone editing
    editingEmailPhone,
    setEditingEmailPhone,
    newEmail,
    setNewEmail,
    newPhone,
    setNewPhone,
    emailPhoneError,
    setEmailPhoneError,
    updatingEmailPhone,
    emailAvailable,
    checkingEmail,
    phoneAvailable,
    checkingPhone,
    handleEmailChange,
    handlePhoneChange,
    handleEmailPhoneEdit,
    handleEmailPhoneChange,

    // OTP
    otpMode,
    setOtpMode,
    otp,
    setOtp,
    otpError,
    setOtpError,
    handleOtpSubmit,

    // Password
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
    handlePasswordEdit,
    handlePasswordChange,
    handlePasswordSubmit,

    // Logout
    showLogoutConfirm,
    setShowLogoutConfirm,
    handleLogout,
  };
}