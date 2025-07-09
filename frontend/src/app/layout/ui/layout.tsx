import s from './layout.module.scss';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};