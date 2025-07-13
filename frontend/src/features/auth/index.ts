export { loginReducer, loginActions } from './model/slice/login-slice.ts';
export { registerReducer, registerActions } from './model/slice/register-slice.ts';
export { fetchLogin } from './model/services/login/login.tsx';
export { fetchRegister } from './model/services/register/register.tsx';
export { getLoginState } from './model/selectors/get-login-state/get-login-state.ts';
export { getRegisterState } from './model/selectors/get-register-state/get-register-state.ts';