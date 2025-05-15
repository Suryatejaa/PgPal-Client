import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthState, User } from "./types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_BASE = "http://localhost:4000/api/auth-service";

export const loginUser = createAsyncThunk<User, { credential: string; password: string; role: string; }>(
    "auth/login",
    async (payload, thunkAPI) => {
        try {
            const res = await axios.post(`${API_BASE}/login`, payload,
                {
                    withCredentials: true
                }
            );
            const { authToken, refreshToken, user } = res.data;
            Cookies.set('token', authToken);
            Cookies.set('refreshToken', refreshToken);
            return { ...user, token: authToken, refreshToken }; // return user object with tokens

        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Login failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const registerUser = createAsyncThunk<User, {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
    gender: string;
}>(
    "auth/register",
    async (payload, thunkAPI) => {
        try {
            const res = await axios.post(`${API_BASE}/register`, payload, {
                withCredentials: true
            });

            const { authToken, refreshToken, user } = res.data;
            Cookies.set('token', authToken);
            Cookies.set('refreshToken', refreshToken);
            return { ...user, token: authToken, refreshToken };

        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Register failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {

            await axios.post(
                `${API_BASE}/logout`,
                {}, // No body required
                {
                    withCredentials: true, // Ensure cookies are sent
                }
            );

            return true; // Indicate successful logout
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Logout failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const verifyOtp = createAsyncThunk<
    any, // Replace with the appropriate type for the server response
    { otp: number; email: string; }, // Payload type
    { rejectValue: string; } // Error type
>("auth/verifyOtp", async ({ otp, email }, thunkAPI) => {
    try {
        const res = await axios.post(
            "http://localhost:4000/api/auth-service/otp/verify",
            { otp, email },
            { withCredentials: true }
        );

        const { authToken, refreshToken, user } = res.data;
        Cookies.set('token', authToken);
        Cookies.set('refreshToken', refreshToken);
        return { ...user, token: authToken, refreshToken };

        return res.data; // Return the response data
    } catch (err: any) {
        const message = err.response?.data?.message || "OTP verification failed";
        return thunkAPI.rejectWithValue(message);
    }
});


interface TokenPayload {
    _id: string;
    name: string;
    pgpalId: string;
    role: string;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setUserFromCookies(state) {
            const token = Cookies.get("token");

            if (token) {
                try {
                    // Decode the token to extract the payload
                    const decoded: TokenPayload = jwtDecode(token);

                    // Update the state with the extracted payload
                    state.user = {
                        _id: decoded._id,
                        name: decoded.name,
                        pgpalId: decoded.pgpalId,
                        role: decoded.role,
                        token, // Include the token if needed
                        email: "", // Provide a default or decoded value for email
                        phone: "", // Provide a default or decoded value for phoneNumber
                        gender: "", // Provide a default or decoded value for gender
                    };
                } catch (error) {
                    console.error("Failed to decode token:", error);
                    state.user = null;
                }
            } else {
                state.user = null;
            }
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
                state.user = action.payload;
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
                state.user = action.payload;
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
                state.user = action.payload; // Update user state with the response
                state.loading = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

export const { setUserFromCookies } = authSlice.actions;
export default authSlice.reducer;
