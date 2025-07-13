export interface RegisterFormState {
    username: string;
    email: string;
    password: string;
    password_repeat: string;
    isLoading: boolean;
    error?: string;
}