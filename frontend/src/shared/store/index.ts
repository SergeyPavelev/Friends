import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@/entities/user';
import { loginReducer } from '@/features/auth';
import { registerReducer } from '@/features/auth';

const rootReducer = combineReducers({
    user: userReducer,
    loginForm: loginReducer,
    registerForm: registerReducer,
});

export const store = () => {
    return configureStore({
        reducer: rootReducer,
    });
};

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof store>
export type AppDispatch = AppStore['dispatch']