import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/shared/config/entertainment.ts';
import type { User } from '@/entities/user';

interface RegisterProps {
    username: string;
    email: string;
    password: string;
    password_repeat: string;
}

export const fetchRegister = createAsyncThunk<User, RegisterProps, { rejectValue: string }>(
    'signup',
    async (registerData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, registerData);
            if (!response.data) {
                throw new Error();
            }
            return response.data
        } catch (e) {
            console.log(e, 'fetchRegister error')
            return thunkAPI.rejectWithValue('fetchRegister error');
        }
    },
)