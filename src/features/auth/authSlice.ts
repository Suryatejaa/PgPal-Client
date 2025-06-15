import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import type { AuthState, User } from "./types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_URL + "/auth-service";

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, thunkAPI) => {
    try {
      // Try to get user info from the protected /me endpoint
      const res = await axiosInstance.get("/auth-service/me", {
        withCredentials: true
      });
      console.log(res.data);
      // Return user object from server
      return res.data.user;
    } catch (err) {
      // If 401, try to refresh
      try {
        const refreshRes = await axiosInstance.post("/auth-service/refresh-token", {}, {
          withCredentials: true
        });
        // After refresh, try /me again
        const meRes = await axiosInstance.get("/auth-service/me", {
          withCredentials: true
        });
        return meRes.data.user;
      } catch (refreshErr) {
        // If refresh fails, user is not authenticated
        return null;
      }
    }
  }
);

export const loginUser = createAsyncThunk<
  User,
  { credential: string; password: string; role: string }
>("auth/login", async (payload, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth-service/login", payload, {
      withCredentials: true,
    });
    const { authToken, refreshToken, user } = res.data;
    Cookies.set("token", authToken, { path: "/", sameSite: "lax" });
    Cookies.set("refreshToken", refreshToken, { path: "/", sameSite: "lax" });
    return {
      ...user,
      name: user.username || user.name,
      phone: user.phoneNumber || user.phone,
      token: authToken,
      refreshToken,
    };
  } catch (err: any) {
    console.log(err)
    const message =
      err?.response?.data?.message || err.message || "Login failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  User,
  {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
    gender: string;
  }
>("auth/register", async (payload, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth-service/register", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Register failed"
    );
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post("/auth-service/logout", {}, {
        withCredentials: true,
      });
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Logout failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyOtp = createAsyncThunk<
  any,
  { otp: number; email: string },
  { rejectValue: string }
>("auth/verifyOtp", async ({ otp, email }, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth-service/otp/verify", 
      { otp, email },
      { withCredentials: true }
    );

    const { authToken, refreshToken, user } = res.data;
    Cookies.set("token", authToken, { path: "/", sameSite: "lax" });
    Cookies.set("refreshToken", refreshToken, { path: "/", sameSite: "lax" });
    return {
      ...user,
      name: user.username || user.name,
      phone: user.phoneNumber || user.phone,
      token: authToken,
      refreshToken,
    };
  } catch (err: any) {
    const message = err.response?.data?.message || "OTP verification failed";
    return thunkAPI.rejectWithValue(message);
  }
});

// ... rest of the slice remains the same

interface TokenPayload {
  _id: string;
  name: string;
  pgpalId: string;
  role: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  phone: string;
  gender: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  loadingFromCookies: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserFromCookies(state) {
      const token = Cookies.get("token");
      console.log("setUserFromCookies called, token:", token);

      if (token) {
        try {
          // Decode the token to extract the payload
          const decoded: TokenPayload = jwtDecode(token);

          if (decoded._id && decoded.role) {
            state.user = {
              _id: decoded._id,
              name: decoded.username || decoded.name,
              pgpalId: decoded.pgpalId,
              role: decoded.role,
              token,
              email: decoded.email || "",
              phone: decoded.phoneNumber || decoded.phone || "",
              gender: decoded.gender || "",
              username: decoded.username || "",
              phoneNumber: decoded.phoneNumber || "",
            };
          } else {
            state.user = null;
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          state.user = null;
        }
      } else {
        state.user = null;
      }
      state.loadingFromCookies = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("State.user ", action.payload);
        const user = action.payload;
        if (user) {
          state.user = {
            ...user,
            name: user.username || user.name,
            phone: user.phoneNumber || user.phone,
          };
        } else {
          state.user = null;
        }
        state.loadingFromCookies = false;
        state.loading = false;

        console.log("Login successful, token stored in cookies by server.");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("State.user ", action.payload);
        const user = action.payload;
        if (user) {
          state.user = {
            ...user,
            name: user.username || user.name,
            phone: user.phoneNumber || user.phone,
          };
        } else {
          state.user = null;
        }
        state.loadingFromCookies = false;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;

        // Clear cookies on successful logout
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        console.log("Logout successful, cookies cleared.");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        console.error("Logout failed:", state.error);
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        console.log("State.user ", action.payload);
        const user = action.payload;
        if (user) {
          state.user = {
            ...user,
            name: user.username || user.name,
            phone: user.phoneNumber || user.phone,
          };
        } else {
          state.user = null;
        }
        state.loadingFromCookies = false;
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
    
      .addCase(initializeAuth.pending, (state) => {
        state.loadingFromCookies = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        const user = action.payload;
        if (user) {
          state.user = {
            ...user,
            name: user.username || user.name,
            phone: user.phoneNumber || user.phone,
          };
        } else {
          state.user = null;
        }
        state.loadingFromCookies = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.loadingFromCookies = false;
      });
  },
});

export const { setUserFromCookies } = authSlice.actions;
export default authSlice.reducer;
