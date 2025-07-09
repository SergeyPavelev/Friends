import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/app/layout';
import { ROUTES } from '@/shared/config/routes/routes.ts';

export const AppRouter = () => {
    return (
        <Routes>
            <Route element={<Layout />} path={ROUTES.ROOT}>
                <Route element={<div>blabla</div>} path={ROUTES.ROOT} />
            </Route>
        </Routes>
    );
};
