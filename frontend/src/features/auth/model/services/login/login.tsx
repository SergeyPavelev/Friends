import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/shared/config/entertainment.ts';
import { type User, userActions } from '@/entities/user';
import { ACCESS_TOKEN } from '@/shared/constants/localstorage.ts';

interface LoginProps {
    username: string;
    email: string;
    password: string;
}

export const fetchLogin = createAsyncThunk<User, LoginProps, { rejectValue: string }>(
    'login',
    async (loginData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/login`, loginData);

            if (!response.data) {
                throw new Error();
            }

            localStorage.setItem(ACCESS_TOKEN, response.data.access)
            thunkAPI.dispatch(userActions.setAuthData(response.data));

            return response.data
        } catch (e) {
            console.log(e, 'fetchLogin error')
            return thunkAPI.rejectWithValue('fetchLogin error');
        }
    },
)