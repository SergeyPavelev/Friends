import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RegisterFormState } from '@/features/auth/model/types/register.ts';
import {fetchRegister} from '@/features/auth';

const initialState: RegisterFormState = {
    isLoading: false,
    username: '',
    email: '',
    password: '',
    password_repeat: '',
};

export const registerSlice = createSlice({
    name: 'register',
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
        setPasswordRepeat: (state, action: PayloadAction<string>) => {
            state.password_repeat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegister.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchRegister.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { actions: registerActions } = registerSlice;
export const { reducer: registerReducer } = registerSlice;