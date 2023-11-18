export enum AppRoutes {
    Any = '*',
    Index = '/',
}

export const APP_ROUTES_INFO = {
    [AppRoutes.Any]: { title: '*' },
    [AppRoutes.Index]: { title: 'Главная страница' },
};
