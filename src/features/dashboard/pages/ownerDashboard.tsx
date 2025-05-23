import React, { useState,useEffect } from "react";
import OwnerProperties from "../../property/pages/OwnerProperties";
import OwnerProfileSidebar from "../components/OwnerProfileSidebar";
import axiosInstance from "../axiosInstance";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../auth/authSlice";
import GlobalAlert from "../../../components/GlobalAlert";
import { BellIcon } from "@heroicons/react/24/outline";
import NotificationSection from "../../notifications/components/sections/NotificationSection";
import { getNotifications } from "../../notifications/services/notificationApis";

const OwnerDashboard: React.FC<{
  userId: string;
  userName: string;
  userRole: string;
  userPpid: string;
}> = ({ userId, userName, userRole, userPpid }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const [editingUsername, setEditingUsername] = React.useState(false);
  const [newUsername, setNewUsername] = React.useState("");
  const [usernameAvailable, setUsernameAvailable] = React.useState<
    boolean | null
  >(null);
  const [checkingUsername, setCheckingUsername] = React.useState(false);
  const [updatingUsername, setUpdatingUsername] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const usernameCheckTimeout = React.useRef<any>(null);
  // For email
  const [editingEmail, setEditingEmail] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [updatingEmail, setUpdatingEmail] = React.useState(false);
  const [otpMode, setOtpMode] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [emailPhoneError, setEmailPhoneError] = React.useState<string | null>(
    null
  );
  const [editingEmailPhone, setEditingEmailPhone] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [emailAvailable, setEmailAvailable] = React.useState<boolean | null>(
    null
  );
  const [checkingEmail, setCheckingEmail] = React.useState(false);
  const [phoneAvailable, setPhoneAvailable] = React.useState<boolean | null>(
    null
  );
  const [checkingPhone, setCheckingPhone] = React.useState(false);

  const emailCheckTimeout = React.useRef<any>(null);
  const phoneCheckTimeout = React.useRef<any>(null);

  // For phone
  const [editingPhone, setEditingPhone] = React.useState(false);
  const [newPhone, setNewPhone] = React.useState("");
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [updatingPhone, setUpdatingPhone] = React.useState(false);

  // For password
  const [editingPassword, setEditingPassword] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotificationIds, setLastNotificationIds] = useState<string[]>([]);

  const [alert, setAlert] = useState<{
    message: string;
    type?: "info" | "success" | "error";
  } | null>(null);

  const usernameRegex = /^[A-Za-z0-9._]{4,18}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // Adjust as per your phone format


  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchUnread = async () => {
      try {
        const res = await getNotifications({
          ownerId: userId, // userId is the owner's id
          audience: "owner",
        });
        console.log(res.data)
        const notifications = res.data || [];
        const unread = notifications.filter((n: any) => !n.isRead).length;
        setUnreadCount(unread);

        // Detect new notification
        const currentIds = notifications.map((n: any) => n._id);
        if (
          lastNotificationIds.length > 0 &&
          currentIds[0] &&
          currentIds[0] !== lastNotificationIds[0]
        ) {
          setAlert({
            message: "You have a new notification!",
            type: "info",
          });
        }
        setLastNotificationIds(currentIds);
      } catch(err: any) {
        console.log(err);
        setUnreadCount(0);
      }
    };

    fetchUnread(); // initial fetch

    interval = setInterval(fetchUnread, 30000); // poll every 10s

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [userPpid, lastNotificationIds]);

  const fetchProfile = () =>
    axiosInstance
      .get("http://localhost:4000/api/auth-service/me", {
        withCredentials: true,
      })
      .then((res: any) => res.data)
      .then(setProfile)
      .catch(() => setProfile(null));

  React.useEffect(() => {
    fetchProfile();
  }, []);

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
    console.log(phone);
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
        console.log(err.response.data);
        setPhoneAvailable(null);
        setEmailPhoneError("Error checking phone");
      } finally {
        setCheckingPhone(false);
      }
    }, 500);
  };

  // Update input handlers:
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
      setAlert({ message: "Username updated successfully!", type: "success" });
    } catch (err) {
      setUsernameError("Failed to update username");
      setAlert({ message: "Failed to update Username", type: "error" });
      throw new Error("Failed to update username");
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
      console.log(res);
      setOtpMode(true);
      setEditingEmailPhone(true);
    } catch (err) {
      console.log(err);
      setEmailPhoneError("Failed to update email and phone");
      throw new Error("Failed to update email and phone");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingEmail(true);
    setOtpError(null);
    try {
      // PATCH email with OTP
      const res = await axiosInstance.post(
        "http://localhost:4000/api/auth-service/email-otp/verify",
        {
          email: newEmail,
          otp,
        }
      );
      console.log(res);
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
      setAlert({
        message: "Email and phone updated Successfully!",
        type: "success",
      });
    } catch (err) {
      console.log(err);
      setAlert({ message: "Failed to update Email and phone", type: "error" });
      setOtpError("Invalid OTP or failed to update email");
      throw new Error("Invalid OTP or failed to update email");
    } finally {
      setUpdatingEmail(false);
    }
  };

  // Password
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
      setAlert({ message: "Password Updated successfully!", type: "success" });
    } catch (err: any) {
      console.log(err);
      const message = err.response.data.message
        ? err.response.data.message
        : err.response.data.error;
      const error = err.response.data.error
        ? err.response.data.error
        : err.response.data.message;
      setPasswordError("Failed to update password");
      setAlert({ message: message || error, type: "error" });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = (e: React.FormEvent) => {
    e?.preventDefault();
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate("/"))
      .catch(() => {}); // error handled in slice
  };

  return (
    <div className="min-h-screen bg-purple-100 text-purple-800">
      {/* Top Bar */}
      {alert && <GlobalAlert {...alert} onClose={() => setAlert(null)} />}
      <div className="fixed top-0 left-0 w-full text-white bg-purple-700 z-10 px-3 py-3 shadow flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Purple PG<span className="text-sm"> (Owner)</span>
        </h1>
        <div className="flex items-center">
          <div className="relative">
            <BellIcon
              className="w-7 h-7 -mr-1 cursor-pointer text-white hover:text-yellow-300"
              onClick={() => setNotificationOpen(true)}
              title="Notifications"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <button
            className="-mr-4 flex items-center bg-transparent rounded-full  h-9 focus:outline-none hover:focus:outline-none border-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open profile"
          >
            <span className="inline-block w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm">
              {profile?.username?.[0] || userName?.[0] || "P"}
            </span>
          </button>
        </div>
      </div>
      {/* Sidebar */}
      <NotificationSection
        open={notificationOpen}
        setOpen={setNotificationOpen}
        userId={userPpid}
        setUnreadCount={setUnreadCount}
      />
      <OwnerProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        profile={profile}
        // Username props...
        editingUsername={editingUsername}
        setEditingUsername={setEditingUsername}
        newUsername={newUsername}
        usernameAvailable={usernameAvailable}
        checkingUsername={checkingUsername}
        updatingUsername={updatingUsername}
        usernameError={usernameError}
        setUsernameError={setUsernameError}
        handleUsernameEdit={handleUsernameEdit}
        handleUsernameChange={handleUsernameChange}
        handleUsernameSubmit={handleUsernameSubmit}
        // Email & phone props
        editingEmailPhone={editingEmailPhone}
        setEditingEmailPhone={setEditingEmailPhone}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        newPhone={newPhone}
        setNewPhone={setNewPhone}
        emailPhoneError={emailPhoneError}
        setEmailPhoneError={setEmailPhoneError}
        otpMode={otpMode}
        setOtpMode={setOtpMode}
        otp={otp}
        setOtp={setOtp}
        otpError={otpError}
        setOtpError={setOtpError}
        handleEmailPhoneEdit={handleEmailPhoneEdit}
        handleEmailPhoneChange={handleEmailPhoneChange}
        handleOtpSubmit={handleOtpSubmit}
        handleLogout={handleLogout}
        handlePasswordEdit={handlePasswordEdit}
        handlePasswordSubmit={handlePasswordSubmit}
        editingPassword={editingPassword}
        setEditingPassword={setEditingPassword}
        setPasswordError={setPasswordError}
        passwordError={passwordError}
        setConfirmPassword={setConfirmPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        newPassword={newPassword}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        handlePasswordChange={handlePasswordChange}
        onLogout={handleLogout}
        setShowLogoutConfirm={setShowLogoutConfirm}
        showLogoutConfirm={showLogoutConfirm}
        checkingEmail={checkingEmail}
        emailAvailable={emailAvailable}
        handleEmailChange={handleEmailChange}
        checkingPhone={checkingPhone}
        phoneAvailable={phoneAvailable}
        handlePhoneChange={handlePhoneChange}
      />

      <div className="pt-12 w-full">
        <div className="text-gradient-to-br from-purple-600 to-indigo-700 bg-white-100 shadow-lg p-2">
          <OwnerProperties
            userId={userId}
            userName={userName}
            userRole={userRole}
            userPpid={userPpid}
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
