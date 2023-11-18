import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CForm,
    CFormFeedback,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react';
import { ChangeEvent, FC, KeyboardEventHandler, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BACKEND_API_URL } from '../../common-consts/api';
import { setDefaultQuery } from '../../common-utils/query';

const enum FiledNames {
    Email = 'email',
    Password = 'password',
}

type Props = {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const LoginPage: FC<Props> = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState(false);

    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        if (name === FiledNames.Email) {
            setLogin(value);
            setLoginError('');
        } else if (name === FiledNames.Password) {
            setPassword(value);
            setPasswordError('');
        }
    };

    const handleOnKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Enter') return handleSubmit();
    };

    const handleSubmit = () => {
        setError(false);
        let isInputValid = true;

        const loginTrimmed = login.trim();
        if (!loginTrimmed.length) {
            setLoginError('Необходимо заполнить данное поле');
            isInputValid = false;
        }

        if (!password.length) {
            setPasswordError('Необходимо заполнить данное поле');
            isInputValid = false;
        }

        if (!isInputValid) return;

        const data = {
            login: loginTrimmed,
            password,
        };

        fetch(`${BACKEND_API_URL}/auth`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    window.localStorage.setItem('token', data.token);
                    const newQuery = setDefaultQuery(search);
                    navigate(`${pathname}?${newQuery}`);
                    setIsLoggedIn(true);
                } else {
                    setError(true);
                }
            });
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCard className="p-4">
                            <CCardBody>
                                <CForm>
                                    <p className="text-medium-emphasis">
                                        Пожалуйста, введите Ваш логин (email) и пароль
                                    </p>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput
                                            name={FiledNames.Email}
                                            placeholder="Логин"
                                            spellCheck={false}
                                            autoComplete="off"
                                            value={login}
                                            onChange={handleFieldChange}
                                            invalid={!!loginError}
                                            autoFocus={true}
                                            onKeyDown={handleOnKeyDown}
                                            className="rounded-end"
                                        />
                                        <CFormFeedback invalid>{loginError}</CFormFeedback>
                                    </CInputGroup>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            name={FiledNames.Password}
                                            type="password"
                                            placeholder="Пароль"
                                            spellCheck={false}
                                            autoComplete="off"
                                            value={password}
                                            onChange={handleFieldChange}
                                            invalid={!!passwordError}
                                            onKeyDown={handleOnKeyDown}
                                        />
                                        <CFormFeedback invalid>{passwordError}</CFormFeedback>
                                    </CInputGroup>
                                    <CAlert color="danger" visible={error}>
                                        Ошибка авторизации. Проверьте корректность введенных данных.
                                    </CAlert>
                                    <CRow>
                                        <CCol xs={6}>
                                            <CButton color="primary" onClick={handleSubmit}>
                                                Войти в систему
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default LoginPage;
