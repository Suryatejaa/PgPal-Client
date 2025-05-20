import React from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

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
}: any) => {
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
            <div className="font-bold text-lg flex items-center gap-2">
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
            <div className="text-gray-600 flex flex-col items-start w-full mt-4 border-2 rounded-xl p-2 border-purple-700">
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
                  <form
                    onSubmit={handleEmailPhoneChange}
                    className="flex flex-col gap-2 w-full"
                  >
                    <label className="text-xs text-gray-500">Email</label>
                    <input
                      className="border px-2 py-1 rounded text-black"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Email"
                      disabled={updatingEmailPhone}
                    />
                    <label className="text-xs text-gray-500">Phone</label>
                    <input
                      className="border px-2 py-1 rounded text-black"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Phone"
                      disabled={updatingEmailPhone}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-2 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
                        disabled={
                          updatingEmailPhone ||
                          (!newEmail && !newPhone) ||
                          (newEmail === profile?.email &&
                            newPhone === profile?.phoneNumber)
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
                )
              ) : (
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2">
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{profile?.phoneNumber}</span>
                    <button
                      className="text-purple-600 py-1 px-1 mb-1 bg-transparent hover:text-purple-900 border-none"
                      onClick={handleEmailPhoneEdit}
                      title="Edit email and phone"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
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
            <button
              className="px-2 py-1 mt-1 text-red-600 w-full rounded-lg border-2 bg-transparent border-red-600 hover:bg-red-600 hover:border-red-600 hover:text-white"
              onClick={handleLogout}
            > 
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default OwnerProfileSidebar;
