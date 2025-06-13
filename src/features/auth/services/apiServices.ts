import axiosInstance from "../../../services/axiosInstance";

export const forgotPasswordRequest = async (credential: string) => {
  return axiosInstance.post("/auth-service/forgot-password-request", { credential });
};

export const forgotPasswordVerify = async (
  otp: number,
  newPassword: string,
  confirmPassword: string
) => {
  return axiosInstance.post("/auth-service/forgot-password-verify-otp", {
    otp,
    newPassword,
    confirmPassword,
  });
};

export const checkUsernameAvailability = async (username: string) => {
  const response = await axiosInstance.get(`/auth-service/check-usernames?username=${username}`, {
    headers: {
      "x-internal-service": "true", 
    },
  });
  return response.data; // { available: true/false }
};

export const checkEmailAvailability = async (email: string) => {
  const response = await axiosInstance.get(`/auth-service/check-email?email=${email}`, {
    headers: {
      "x-internal-service": "true",
    },
  });
  return response.data; // { available: true/false }
};

export const checkPhoneAvailability = async (phoneNumber: string) => {
  const response = await axiosInstance.get(`/auth-service/check-phonenumber?phoneNumber=${phoneNumber}`, {
    headers: {
      "x-internal-service": "true",
    },
  });
  return response.data; // { available: true/false }
};