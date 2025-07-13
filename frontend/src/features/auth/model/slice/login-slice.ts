import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginFormState } from '@/features/auth/model/types/login.ts';
import { fetchLogin } from '@/features/auth';

const initialState: LoginFormState = {
    isLoading: false,
    username: '',
    email: '',
    password: '',
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchLogin.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { actions: loginActions } = loginSlice;
export const { reducer: loginReducer } = loginSlice;