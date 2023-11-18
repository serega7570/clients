import { FC, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../common/pages/login-page';
import MainPage from '../common/pages/main-page';
import { AppRoutes } from '../common/routes';

const App: FC = () => {
    const [isLoggedIn, setIsLoggenIn] = useState(false);
    const doHaveToken = window.localStorage.getItem('token');
    return (
        <Routes>
            <Route
                path={AppRoutes.Any}
                element={isLoggedIn || doHaveToken ? <MainPage /> : <LoginPage setIsLoggedIn={setIsLoggenIn} />}
            />
        </Routes>
    );
};

export default App;
