import { AppRouter } from '@/app/routes/app-router.tsx';
import '../shared/assets/styles/global.scss';
import { useAppDispatch } from '@/shared/hooks/redux.ts';
import { useEffect } from 'react';
import { userActions } from '@/entities/user';

export const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(userActions.initAuthData());
    }, [dispatch]);

    return (
        <AppRouter />
    );
};