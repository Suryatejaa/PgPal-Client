export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    phone: string;
    phoneNumber: string;
    pgpalId: string;
    gender: string;
    token?: string;
    refreshToken?: string;
    currentPlan?: string;
    isTrialClaimed?: boolean;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    loadingFromCookies: boolean;
    isInitialized: boolean;
}
