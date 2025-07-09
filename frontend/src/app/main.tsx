import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/app-router.tsx';
import '../shared/assets/styles/global.scss';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>,
);
