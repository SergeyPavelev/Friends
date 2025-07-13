import s from './register.module.scss';
import { useNavigate } from 'react-router-dom';
import { type ChangeEvent, useCallback } from 'react';
import { ButtonUi } from '@/shared/ui/button';
import { registerActions } from '@/features/auth';
import { getRegisterState } from '@/features/auth';
import { fetchRegister } from '@/features/auth';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.ts';
import { InputUi } from '@/shared/ui/input';

export const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const { username, email, password, password_repeat, isLoading, error } = useAppSelector(getRegisterState);
    const navigate = useNavigate();

    const onChangeUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(registerActions.setUsername(e.target.value));
    }, [dispatch]);

    const onChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(registerActions.setEmail(e.target.value));
    }, [dispatch]);

    const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(registerActions.setPassword(e.target.value));
    }, [dispatch]);

    const onChangePasswordRepeat = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(registerActions.setPasswordRepeat(e.target.value));
    }, [dispatch]);

    const onSubmit = useCallback(() => {
        dispatch(fetchRegister({ username, email, password, password_repeat }));
    }, [dispatch, username, email, password, password_repeat]);

    return (
        <div className={s.container}>
            <h1 className={s.title}>Sign up</h1>
            <div className={s.form_wrapper}>
                <div className={s.form}>
                    <InputUi
                        label={'Username'}
                        placeholder={'e.g., genius123'}
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
                    <InputUi
                        label={'Confirm password'}
                        placeholder={'••••••••••'}
                        value={password_repeat}
                        onChange={onChangePasswordRepeat}
                    />

                    {/*TODO make button disabled while pending*/}
                    <ButtonUi
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Sign up'}
                    </ButtonUi>
                </div>

                <div className={s.form_links}>
                    <div
                        onClick={() => navigate('/auth')}
                        className={s.register_link}
                    >
                        Already have an account?
                    </div>
                </div>
            </div>
        </div>
    );
};