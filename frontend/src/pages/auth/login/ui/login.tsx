import s from './login.module.scss';
import { InputUi } from '@/shared/ui/input';
import { useNavigate } from 'react-router-dom';
import { ButtonUi } from '@/shared/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.ts';
import { getLoginState } from '@/features/auth';
import { type ChangeEvent, useCallback } from 'react';
import { loginActions } from '@/features/auth';
import { fetchLogin } from '@/features/auth';

export const LoginPage = () => {
    const { username, email, password, error, isLoading } = useAppSelector(getLoginState);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const onChangeUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(loginActions.setUsername(e.target.value));
    }, [dispatch]);

    const onChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(loginActions.setEmail(e.target.value));
    }, [dispatch]);

    const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(loginActions.setPassword(e.target.value));
    }, [dispatch]);

    const onSubmit = useCallback(() => {
        dispatch(fetchLogin({ username, email, password }));
    }, [dispatch, username, email, password]);

    return (
        <div className={s.container}>
            <h1 className={s.title}>Log in</h1>
            <div className={s.form_wrapper}>
                <div className={s.form}>
                    <InputUi
                        label={'Username'}
                        placeholder={'genius123'}
                        value={username}
                        onChange={onChangeUsername}
                    />
                    <InputUi
                        label={'Email'}
                        placeholder={'e.g., genius123@gmail.com'}
                        value={email}
                        onChange={onChangeEmail}
                    />
                    <InputUi
                        label={'Password'}
                        placeholder={'••••••••••'}
                        value={password}
                        onChange={onChangePassword}
                    />

                    <ButtonUi
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Log in'}
                    </ButtonUi>
                </div>

                <div className={s.form_links}>
                    <div
                        onClick={() => navigate('/auth/register')}
                        className={s.register_link}
                    >
                        Don't have an account?
                    </div>
                </div>
            </div>
        </div>
    );
};