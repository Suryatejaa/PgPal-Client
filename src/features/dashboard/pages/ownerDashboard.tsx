import React from "react";
import OwnerProperties from "../../property/pages/OwnerProperties";
import OwnerProfileSidebar from "../components/OwnerProfileSidebar";
import axiosInstance from "../axiosInstance";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../auth/authSlice";

const OwnerDashboard: React.FC<{
  userId: string;
  userName: string;
  userRole: string;
}> = ({ userId, userName, userRole }) => {
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
      throw new Error("Failed to update username");
    } finally {
      setUpdatingUsername(false);
    }
  };
  // Email
  const handleEmailEdit = () => {
    setEditingEmail(true);
    setNewEmail(profile?.email || "");
    setEmailError(null);
    setOtpMode(false);
    setOtp("");
    setOtpError(null);
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewEmail(e.target.value);
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingEmail(true);
    setEmailError(null);
    try {
      // Send OTP to new email
      const res = await fetch("http://localhost:4000/api/auth-service/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: newEmail }),
      });
      console.log(res);
      if (!res.ok) throw new Error("Failed to send OTP");
      setOtpMode(true);
    } catch {
      setEmailError("Failed to send OTP");
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
    } catch (err) {
      console.log(err);
      setOtpError("Invalid OTP or failed to update email");
      throw new Error("Invalid OTP or failed to update email");
    } finally {
      setUpdatingEmail(false);
    }
  };

  // Phone
  const handlePhoneEdit = () => {
    setEditingPhone(true);
    setNewPhone(profile?.phoneNumber || "");
    setPhoneError(null);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPhone(e.target.value);
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPhone(true);
    setPhoneError(null);
    try {
      const res = await fetch("http://localhost:4000/api/auth-service/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phoneNumber: newPhone }),
      });
      if (!res.ok) throw new Error("Failed to update phone");
      const updated = await res.json();
      setProfile((prev: any) => ({
        ...prev,
        phoneNumber: updated.phoneNumber,
      }));
      setEditingPhone(false);
    } catch {
      setPhoneError("Failed to update phone");
    } finally {
      setUpdatingPhone(false);
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
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match or missing fields");
      return;
    }
    setUpdatingPassword(true);
    setPasswordError(null);
    try {
      const res = await fetch("http://localhost:4000/api/auth-service/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) throw new Error("Failed to update password");
      setEditingPassword(false);
    } catch {
      setPasswordError("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(logoutUser({}))
      .unwrap()
      .then(() => navigate("/"))
      .catch(() => {}); // error handled in slice
  };

  return (
    <div className="min-h-screen bg-purple-100 text-purple-800">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full text-white bg-purple-700 z-10 px-6 py-1 shadow flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <p className="-mb-2 -mt-1">👑</p>PGPAL Owner
        </h1>
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
      {/* Sidebar */}
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
      />

      <div className="pt-12 w-full">
        <div className="text-gradient-to-br from-purple-600 to-indigo-700 bg-white-100 shadow-lg p-2">
          <OwnerProperties
            userId={userId}
            userName={userName}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
