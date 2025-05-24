import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import ConfirmDialog from "../../../components/ConfirmDialog";

const OwnerProfileSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  profile,
  // Username props...
  editingUsername,
  setEditingUsername,
  newUsername,
  usernameAvailable,
  checkingUsername,
  updatingUsername,
  usernameError,
  setUsernameError,
  handleUsernameEdit,
  handleUsernameChange,
  handleUsernameSubmit,
  // Email & phone props
  editingEmailPhone,
  setEditingEmailPhone,
  newEmail,
  setNewEmail,
  newPhone,
  setNewPhone,
  updatingEmailPhone,
  updatingPassword,
  emailPhoneError,
  setEmailPhoneError,
  otpMode,
  setOtpMode,
  otp,
  setOtp,
  updatingOtp,
  otpError,
  setOtpError,
  handleEmailPhoneEdit,
  handleEmailPhoneChange,
  handleOtpSubmit,
  handleLogout,
  handlePasswordEdit,
  handlePasswordSubmit,
  editingPassword,
  setEditingPassword,
  passwordError,
  setPasswordError,
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  handlePasswordChange,
  setShowLogoutConfirm,
  showLogoutConfirm,
  checkingEmail,
  emailAvailable,
  handleEmailChange,
  checkingPhone,
  phoneAvailable,
  handlePhoneChange,
}: any) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

  return (
    sidebarOpen && (
      <div className="fixed inset-0 z-30 flex justify-end">
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative bg-white w-72 max-w-full h-full shadow-lg p-6 z-40">
          <button
            className="absolute top-2 right-2 text-sm bg-transparent text-gray-500"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="flex flex-col items-center mt-6">
            <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700 mb-2">
              {profile?.username?.[0] || "P"}
            </div>
            {/* Username Edit (unchanged) */}
            <div className="font-bold text-lg text-purple-800 flex items-center gap-2">
              {editingUsername ? (
                <form
                  onSubmit={handleUsernameSubmit}
                  className="flex flex-col items-stretch gap-2 w-full"
                >
                  <input
                    className="border px-2 py-1 rounded text-black"
                    value={newUsername}
                    onChange={handleUsernameChange}
                    disabled={updatingUsername}
                    autoFocus
                  />
                  <div className="flex items-center gap-2 justify-end">
                    {checkingUsername && (
                      <span className="text-xs text-gray-400">Checking...</span>
                    )}
                    {usernameAvailable === true && (
                      <span className="text-green-600">✔</span>
                    )}
                    {usernameAvailable === false && (
                      <span className="text-red-600">✖</span>
                    )}
                    <button
                      type="submit"
                      className="px-2 py-1 bg-purple-600 text-xs text-white rounded disabled:opacity-50"
                      disabled={
                        updatingUsername ||
                        !newUsername ||
                        newUsername === profile?.username ||
                        usernameAvailable === false
                      }
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded"
                      onClick={() => {
                        setEditingUsername(false);
                        setUsernameError(null);
                      }}
                      disabled={updatingUsername}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <span>{profile?.username}</span>
                  <button
                    className="text-purple-600 py-1 px-1 mb-1 bg-transparent hover:text-purple-900 border-none"
                    onClick={handleUsernameEdit}
                    title="Edit username"
                  >
                    <PencilIcon className="h-4 w-4  inline" />
                  </button>
                </>
              )}
            </div>
            {usernameError && (
              <div className="text-xs text-red-600 -mr-20 ml-12">
                {usernameError}
              </div>
            )}

            {/* Email & Phone Edit */}
            <div className="text-gray-600 flex flex-col items-start w-full mt-4 border-2 rounded-xl p-2 border-purple-700 relative">
              {!editingEmailPhone && (
                <button
                  className="absolute top-4 -right-4 text-purple-600 bg-white hover:text-purple-900 border-purple-700 border-2 px-2 py-2"
                  onClick={handleEmailPhoneEdit}
                  title="Edit email and phone"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              )}
              {editingEmailPhone ? (
                otpMode ? (
                  <form
                    onSubmit={handleOtpSubmit}
                    className="flex flex-col gap-2 w-full"
                  >
                    <label className="text-xs text-gray-500">
                      OTP sent to{" "}
                      <b>
                        <i className=" text-purple-900">{newEmail}</i>
                      </b>
                    </label>
                    <input
                      className="border px-2 py-1 rounded text-black"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      disabled={updatingOtp}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-2 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
                        disabled={updatingOtp || !otp}
                      >
                        Verify OTP
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded"
                        onClick={() => {
                          setOtpMode(false);
                          setOtp("");
                          setEditingEmailPhone(false);
                          setEmailPhoneError(null);
                          setOtpError(null);
                        }}
                        disabled={updatingOtp}
                      >
                        Cancel
                      </button>
                    </div>
                    {otpError && (
                      <div className="text-xs text-red-600">{otpError}</div>
                    )}
                  </form>
                ) : (
                  // ...existing code...
                  <form
                    onSubmit={handleEmailPhoneChange}
                    className="flex flex-col gap-2 w-full"
                  >
                    <label className="text-xs text-gray-500">Email</label>
                    <div className="relative flex items-center">
                      <input
                        className="border px-2 py-1 rounded text-black w-full"
                        value={newEmail}
                        onChange={handleEmailChange}
                        placeholder="Email"
                        disabled={updatingEmailPhone}
                      />
                      {checkingEmail && (
                        <span className="absolute right-2 text-xs text-gray-400">
                          Checking...
                        </span>
                      )}
                      {emailAvailable === true && !checkingEmail && (
                        <span className="absolute right-2 text-green-600">
                          ✔
                        </span>
                      )}
                      {emailAvailable === false && !checkingEmail && (
                        <span className="absolute right-2 text-red-600">✖</span>
                      )}
                    </div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <div className="relative flex items-center">
                      <input
                        className="border px-2 py-1 rounded text-black w-full"
                        value={newPhone}
                        onChange={handlePhoneChange}
                        placeholder="Phone"
                        disabled={updatingEmailPhone}
                      />
                      {checkingPhone && (
                        <span className="absolute right-2 text-xs text-gray-400">
                          Checking...
                        </span>
                      )}
                      {phoneAvailable === true && !checkingPhone && (
                        <span className="absolute right-2 text-green-600">
                          ✔
                        </span>
                      )}
                      {phoneAvailable === false && !checkingPhone && (
                        <span className="absolute right-2 text-red-600">✖</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-2 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
                        disabled={
                          updatingEmailPhone ||
                          (!newEmail && !newPhone) ||
                          (newEmail === profile?.email &&
                            newPhone === profile?.phoneNumber) ||
                          emailAvailable === false ||
                          phoneAvailable === false ||
                          newPhone.length < 10
                        }
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded"
                        onClick={() => {
                          setEditingEmailPhone(false);
                          setEmailPhoneError(null);
                        }}
                        disabled={updatingEmailPhone}
                      >
                        Cancel
                      </button>
                    </div>
                    {emailPhoneError && (
                      <div className="text-xs text-red-600">
                        {emailPhoneError}
                      </div>
                    )}
                  </form>
                  // ...existing code...
                )
              ) : (
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2">
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{profile?.phoneNumber}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Static fields */}
            <div className="text-gray-600 flex flex-col items-start w-full mt-1 border-2 rounded-xl p-2 border-purple-700">
              <div className="text-gray-600 capitalize">
                <b>Role:</b> {profile?.role}
              </div>
              <div className="text-gray-600">
                <b>PGPAl ID:</b> {profile?.pgpalId}
              </div>
            </div>
            {editingPassword ? (
              <form
                onSubmit={handleEmailPhoneChange}
                className="flex flex-col gap-2 w-full"
              >
                <label className="text-xs text-gray-500">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    className="border px-2 py-1 rounded text-black w-full"
                    value={oldPassword}
                    type={showOldPassword ? "text" : "password"}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current Password"
                    disabled={updatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 flex items-center text-gray-700 bg-transparent"
                  >
                    {showOldPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <label className="text-xs text-gray-500">New Password</label>
                <div className="relative">
                  <input
                    className="border px-2 py-1 rounded text-black w-full"
                    value={newPassword}
                    type={showNewPassword ? "text" : "password"}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    disabled={updatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center text-gray-700 bg-transparent"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <label className="text-xs text-gray-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="border px-2 py-1 rounded text-black w-full"
                    value={confirmPassword}
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    disabled={updatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center text-gray-700 bg-transparent"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-2 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
                    disabled={
                      oldPassword.length < 8 ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword ||
                      passwordError
                    }
                    onChange={handlePasswordChange()}
                    onClick={handlePasswordSubmit}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-300 text-gray-700 rounded"
                    onClick={() => {
                      setEditingPassword(false);
                      setPasswordError(null);
                    }}
                    disabled={updatingPassword}
                  >
                    Cancel
                  </button>
                </div>
                {passwordError && (
                  <div className="text-xs text-red-600">{passwordError}</div>
                )}
              </form>
            ) : (
              <button
                className="py-1 mt-1 w-full text-purple-800 border-purple-600 border-2 bg-transparent hover:bg-purple-600 hover:text-white hover:border-none"
                onClick={handlePasswordEdit}
              >
                Change Password
              </button>
            )}
            <button
              className="px-2 py-1 mt-1 text-red-600 w-full rounded-lg border-2 bg-transparent border-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        </div>
        <ConfirmDialog
          open={showLogoutConfirm}
          title="Logout"
          message="Are you sure you want to logout."
          onConfirm={() => {
            setShowLogoutConfirm(false);
            handleLogout();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
          confirmText="Logout"
          cancelText="Cancel"
        />
      </div>
    )
  );
};

export default OwnerProfileSidebar;
