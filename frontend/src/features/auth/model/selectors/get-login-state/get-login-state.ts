import type { RootState } from '@/shared/store';

export const getLoginState = (state: RootState)=> state.loginForm;