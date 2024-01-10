import * as Page from './pages';

const AppRoutes = [
    {
        path: '/',
        Component: Page?.MainPage,
    },
    {
        path: '/login',
        Component: Page?.LoginPage,
    }
];

export default AppRoutes;