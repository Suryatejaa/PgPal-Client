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
            const token = res.data.authToken;
            const refreshToken = res.data.refreshToken;
            Cookies.set('token', token);
            Cookies.set('refreshToken', refreshToken);
            console.log("Login API Response: ", res.data);

            return res.data;
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
            return res.data;
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

        const token = res.data.authToken;
        const refreshToken = res.data.refreshToken;
        Cookies.set('token', token);
        Cookies.set('refreshToken', refreshToken);
        console.log("OTP Verification Response: ", res.data);

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
                        username: decoded.name,
                        pgpalId: decoded.pgpalId,
                        role: decoded.role,
                        token, // Include the token if needed
                        email: "", // Provide a default or decoded value for email
                        phoneNumber: "", // Provide a default or decoded value for phoneNumber
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
                console.log("State.user ", state.user);
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
                const { token, refreshToken, ...userDetails } = action.payload;

                // Update the user state
                state.user = {
                    ...userDetails,
                    token,
                };

                if (token) {
                    Cookies.set("token", token, { secure: true, sameSite: "None" });
                }
                if (refreshToken) {
                    Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "None" });
                }

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
