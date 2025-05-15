import axios from "axios";

export const forgotPasswordRequest = async (credential: string) => {
  return axios.post("http://localhost:4000/api/auth-service/forgot-password-request", { credential });
};

export const forgotPasswordVerify = async (
  otp: number,
  newPassword: string,
  confirmPassword: string
) => {
  return axios.post("http://localhost:4000/api/auth-service/forgot-password-verify-otp", {
    otp,
    newPassword,
    confirmPassword,
  });
};

export const checkUsernameAvailability = async (username: string) => {
  const res = await fetch(
    `http://localhost:4000/api/auth-service/check-username?username=${encodeURIComponent(username)}`
  );
  return res.json(); // { available: true/false }
};

export const checkEmailAvailability = async (email: string) => {
    const res = await fetch(
      `http://localhost:4000/api/auth-service/check-email?email=${encodeURIComponent(email)}`
    );
    return res.json(); // { available: true/false }
  };
  
  export const checkPhoneAvailability = async (phoneNumber: string) => {
    const res = await fetch(
      `http://localhost:4000/api/auth-service/check-phonenumber?phoneNumber=${encodeURIComponent(phoneNumber)}`
    );
    return res.json(); // { available: true/false }
  };