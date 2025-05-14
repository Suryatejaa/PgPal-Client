export interface User {
    _id:string
    username: string;
    email: string;
    phoneNumber: string;
    role: string;
    gender?: string;
    token?: string;
    refreshToken?: string;
    pgpalId?:string
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}
