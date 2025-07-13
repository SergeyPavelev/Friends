import { Route, Routes } from 'react-router-dom';
import { WelcomePage } from '@/pages/welcome';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { AuthLayout } from '@/layouts/auth';
import { MainLayout } from '@/layouts/main';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path={'/auth'} element={<AuthLayout />} >
                <Route index element={<LoginPage />} />
                <Route path={'register'} element={<RegisterPage />} />
            </Route>

            <Route path={'/'} element={<MainLayout />}>
                <Route index element={<WelcomePage />}  />
            </Route>
        </Routes>
    );
};
