export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    pgpalId: string;
    gender: string;
    token?: string;
    refreshToken?: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}
