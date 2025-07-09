import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/app/layout';
import { ROUTES } from '@/shared/config/routes/routes.ts';
import { WelcomePage } from '@/pages/welcome';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';

export const AppRouter = () => {
    return (
        <Routes>
            <Route element={<Layout />} path={ROUTES.ROOT}>
                <Route element={<div>blabla</div>} path={ROUTES.ROOT} />
                <Route element={<LoginPage />} path={ROUTES.LOGIN} />
                <Route element={<RegisterPage />} path={ROUTES.REGISTER} />
                <Route element={<WelcomePage />} path={ROUTES.WELCOME_PAGE} />
            </Route>
        </Routes>
    );
};
