export interface LoginFormState {
    username: string;
    email: string;
    password: string;
    isLoading: boolean;
    error?: string;
}