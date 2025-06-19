import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import type { AuthState, User } from "./types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_URL + "/auth-service";

// Flag to prevent multiple initialization attempts

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, thunkAPI) => {
    try {
      // Check if we're on a public page that doesn't need auth
      const currentPath = window.location.pathname;
      const publicPaths = ['/login', '/signUp', '/pricing', '/about', '/contact', '/tenant-landing', '/owner-landing'];
      
      // CRITICAL FIX: Check for the root path exactly, and then check other public paths.
      let isPublicPage = false;
      if (currentPath === '/') {
        isPublicPage = true;
      } else {
        isPublicPage = publicPaths.some(path => currentPath.startsWith(path));
      }

      console.log("🔐 Initializing auth - trying /me endpoint");
      
      const res = await axiosInstance.get("/auth-service/me", {
        withCredentials: true
      });
      
      console.log("✅ Auth initialization successful:", res.data);
      return res.data.user;
    } catch (err: any) {
      console.log("❌ Auth initialization failed:", err.response?.status, err.response?.data?.message);
      
      // Return null instead of rejecting - let axios interceptor handle refresh
      return null;
    }
  }
);

export const loginUser = createAsyncThunk<
  User,
  { credential: string; password: string; role: string }
>("auth/login", async (payload, thunkAPI) => {
  try {
    console.log("🔐 Attempting login with:", { 
      credential: payload.credential, 
      role: payload.role, 
      password: "[HIDDEN]" 
    });
    
    const res = await axiosInstance.post("/auth-service/login", payload, {
      withCredentials: true,
    });
    
    console.log("✅ Login response received:", {
      status: res.status,
      hasUser: !!res.data?.user,
      hasToken: !!res.data?.authToken
    });
    
    const { authToken, refreshToken, user } = res.data;
    
    if (!authToken || !user) {
      console.error("❌ Invalid response structure - missing token or user");
      return thunkAPI.rejectWithValue("Invalid server response");
    }
    
    // Store tokens in cookies
    Cookies.set("token", authToken, { path: "/", sameSite: "lax" });
    if (refreshToken) {
      Cookies.set("refreshToken", refreshToken, { path: "/", sameSite: "lax" });
    }
    
    console.log("🍪 Tokens stored in cookies");
    
    return {
      ...user,
      name: user.username || user.name,
      phone: user.phoneNumber || user.phone,
      token: authToken,
      refreshToken,
    };
  } catch (err: any) {
    console.error("❌ Login error details:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message
    });
    
    // PROPER ERROR EXTRACTION FROM SERVER
    let message = "Login failed";
    if (err.response?.data) {
      // Try different error message formats
      if (typeof err.response.data === 'string') {
        message = err.response.data;
      } else if (err.response.data.message) {
        message = err.response.data.message;
      } else if (err.response.data.error) {
        message = err.response.data.error;
      } else if (err.response.status === 401) {
        message = "Invalid email/phone or password";
      }
    }
    
    console.error("🔴 Login failed with message:", message);
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
    console.log("📝 Attempting registration with:", { ...payload, password: "[HIDDEN]" });
    const res = await axiosInstance.post("/auth-service/register", payload, {
      withCredentials: true,
    });
    console.log("✅ Registration successful:", res.data);
    
    // Reset initialization flag on successful registration
    
    return res.data;
  } catch (err: any) {
    console.error("❌ Registration error:", err.response?.data || err.message);
    
    // Extract proper error message
    if (err.response?.data) {
      // Return the entire error object from server
      return thunkAPI.rejectWithValue(err.response.data);
    }
    
    return thunkAPI.rejectWithValue({
      message: "Registration failed. Please try again.",
      errors: []
    });
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      console.log("🚪 Attempting logout");
      await axiosInstance.post("/auth-service/logout", {}, {
        withCredentials: true,
      });
      console.log("✅ Logout successful");
      
      // Reset initialization flag on logout
      
      return true;
    } catch (err: any) {
      console.error("❌ Logout error:", err.response?.data || err.message);
      
      // Even if logout fails on server, clear client state
      
      const message = err?.response?.data?.message || err.message || "Logout failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyOtp = createAsyncThunk<
  any,
  { otp: number; email: string },
  { rejectValue: any }
>("auth/verifyOtp", async ({ otp, email }, thunkAPI) => {
  try {
    console.log("🔢 Attempting OTP verification for:", email);
    const res = await axiosInstance.post("/auth-service/otp/verify", 
      { otp, email },
      { withCredentials: true }
    );
    console.log("✅ OTP verification successful:", res.data);

    const { authToken, refreshToken, user } = res.data;
    
    // Store tokens in cookies
    Cookies.set("token", authToken, { path: "/", sameSite: "lax" });
    if (refreshToken) {
      Cookies.set("refreshToken", refreshToken, { path: "/", sameSite: "lax" });
    }
    
    // Reset initialization flag on successful OTP verification
    
    return {
      ...user,
      name: user.username || user.name,
      phone: user.phoneNumber || user.phone,
      token: authToken,
      refreshToken,
    };
  } catch (err: any) {
    console.error("❌ OTP verification error:", err.response?.data || err.message);
    
    if (err.response?.data) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
    
    return thunkAPI.rejectWithValue({
      message: "OTP verification failed. Please try again.",
    });
  }
});

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
  isInitialized: false, // Flag to track if initialization has been done
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserFromCookies(state) {
      const token = Cookies.get("token");
      console.log("🍪 setUserFromCookies called, token:", token ? "present" : "not found");

      if (token) {
        try {
          const decoded: TokenPayload = jwtDecode(token);
          console.log("🔓 Token decoded successfully:", { id: decoded._id, role: decoded.role });

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
            console.log("✅ User set from cookies:", state.user._id);
          } else {
            console.log("❌ Invalid token payload - missing required fields");
            state.user = null;
          }
        } catch (error) {
          console.error("❌ Failed to decode token:", error);
          state.user = null;
          Cookies.remove("token");
          Cookies.remove("refreshToken");
        }
      } else {
        console.log("ℹ️ No token found in cookies");
        state.user = null;
      }
      state.loadingFromCookies = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.loadingFromCookies = false;
      state.isInitialized = true; // Reset initialization flag
      
      // Clear cookies
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      
      // Reset initialization flag
      
      console.log("🧹 User state cleared");
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        console.log("🔄 Login pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("✅ Login fulfilled with user:", action.payload);
        const user = action.payload;
        if (user) {
          state.user = {
            ...user,
            name: user.username || user.name,
            phone: user.phoneNumber || user.phone,
          };
        }
        state.loadingFromCookies = false;
        state.loading = false;
        state.isInitialized = true; // Set initialization flag
        state.error = null;
        console.log("🎉 Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("❌ Login REJECTED in reducer:", action.payload);
        state.user = null;
        state.error = action.payload as string; // THIS WILL NOW CONTAIN PROPER SERVER ERROR
        state.loading = false;
        state.isInitialized = true;
        state.loadingFromCookies = false;
        
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        
        console.error("💥 LOGIN FAILED - State updated with error:", state.error);
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        console.log("🔄 Registration pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("✅ Registration fulfilled:", action.payload);
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
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error("❌ Registration rejected:", action.payload);
        state.error = action.payload as string;
        state.loading = false;
        state.loadingFromCookies = false;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        console.log("🔄 Logout pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log("✅ Logout fulfilled");
        state.user = null;
        state.loading = false;
        state.error = null;
        state.loadingFromCookies = false;

        // Clear cookies on successful logout
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        console.log("🧹 Logout successful, cookies cleared.");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.error("❌ Logout rejected:", action.payload);
        // Still clear user state even if server logout fails
        state.user = null;
        state.error = action.payload as string;
        state.loading = false;
        state.loadingFromCookies = false;
        
        // Clear cookies anyway
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        console.error("💥 Logout failed but cleared local state:", state.error);
      })

      // OTP Verification
      .addCase(verifyOtp.pending, (state) => {
        console.log("🔄 OTP verification pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        console.log("✅ OTP verification fulfilled:", action.payload);
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
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        console.error("❌ OTP verification rejected:", action.payload);
        state.error = action.payload as string;
        state.loading = false;
        state.loadingFromCookies = false;
      })
    
      // Initialize Auth
     .addCase(initializeAuth.pending, (state) => {
        // DON'T set loadingFromCookies here - this causes loops
        console.log("🔄 Auth initialization pending");
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        console.log("✅ Auth initialization fulfilled:", action.payload);
        const user = action.payload;
        if (user) {
          state.user = {
            ...user,
            name: user.username || user.name,
            phone: user.phoneNumber || user.phone,
          };
        }
        state.isInitialized = true; // Set initialization flag
        // Don't clear user if null - they might have valid token from cookies
        // state.loadingFromCookies = false;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        console.log("⚠️ Auth initialization rejected - but keeping existing user if any");
        // DON'T clear user here - they might have valid token that just needs refresh
        // state.loadingFromCookies = false;
        state.error = null; // Don't show errors for auth initialization
      });
  },
});

export const { setUserFromCookies, clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;