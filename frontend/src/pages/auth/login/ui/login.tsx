import s from './login.module.scss';
import { TextInput } from '@/shared/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES } from '@/shared/config/routes/routes.ts';
import { ButtonUi } from '@/shared/ui/button';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    return (
        <div className={s.container}>
            <h1 className={s.title}>Log in</h1>
            <div className={s.form_wrapper}>
                <div className={s.form}>
                    <TextInput
                        label={'Email'}
                        placeholder={'e.g., suzero00@gmail.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error && !email ? 'Заполните поле' : ''}
                    />
                    <TextInput
                        label={'Password'}
                        placeholder={'••••••••••'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={error && !password ? 'Заполните поле' : ''}
                    />

                    <ButtonUi>Log in</ButtonUi>
                </div>

                <div className={s.form_links}>
                    <div
                        onClick={() => navigate(ROUTES.REGISTER)}
                        className={s.register_link}
                    >
                        Don't have an account?
                    </div>
                </div>
            </div>
        </div>
    );
};