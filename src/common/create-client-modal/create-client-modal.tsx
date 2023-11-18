import {
    CButton,
    CFormFeedback,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react';
import { ChangeEvent, FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { createClient, editClient, loadClients } from '../pages/main-page/main-page-slice';
import { Client } from '../pages/main-page/main-page-type';

type Props = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    client: Client | null;
    setClient: (client: Client | null) => void;
};

enum InputFieldNames {
    Name = 'name',
    Email = 'email',
    Address = 'address',
}

const CreateCompanyModal: FC<Props> = ({ visible, setVisible, client, setClient }) => {
    const dispatch = useAppDispatch();
    const { search } = useLocation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addressError, setAddressError] = useState('');

    const onShow = () => {
        if (client) {
            setName(client.fio);
            setEmail(client.email);
            setAddress(client.address);
        } else {
            setName('');
            setEmail('');
            setAddress('');
        }
        setNameError('');
        setEmailError('');
        setAddressError('');
    };

    const onClose = () => {
        setVisible(false);
        setClient(null);
    };

    const handleChangeInputFields = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        if (name === InputFieldNames.Name) {
            setName(value);
            setNameError('');
        } else if (name === InputFieldNames.Email) {
            setEmail(value);
            setEmailError('');
        } else if (name === InputFieldNames.Address) {
            setAddress(value);
            setAddressError('');
        }
    };

    const isCorrectEmailAddress = (email: string) => {
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return pattern.test(email.trim());
    };

    const handleCreateCompany = async () => {
        let isInputValid = true;
        const nameTrimmed = name.trim();
        const adminEmailTrimmed = email.trim();
        const addressTrimmed = address.trim();

        if (!nameTrimmed) {
            setNameError('Необходимо заполнить данное поле');
            isInputValid = false;
        }
        if (!adminEmailTrimmed) {
            setEmailError('Необходимо заполнить данное поле');
            isInputValid = false;
        } else if (!isCorrectEmailAddress(adminEmailTrimmed)) {
            setEmailError('Введите корректный почтовый адрес');
            isInputValid = false;
        }
        if (!addressTrimmed) {
            setAddressError('Необходимо заполнить данное поле');
            isInputValid = false;
        }

        if (!isInputValid) return;

        const data = {
            fio: nameTrimmed,
            email: adminEmailTrimmed,
            address: addressTrimmed,
        };
        if (client) {
            const updateData = { ...data, id: client.id };
            await dispatch(editClient.getThunk(updateData));
        } else {
            await dispatch(createClient.getThunk(data));
        }
        dispatch(loadClients.getThunk({ query: search }));
        onShow();
        setVisible(false);
    };

    return (
        <CModal visible={visible} onShow={onShow} onClose={onClose} backdrop="static" alignment="center">
            <CModalHeader>
                <CModalTitle>{client ? 'Редактирование' : 'Создание'} клиента</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormLabel>ФИО</CFormLabel>
                <CFormInput
                    name={InputFieldNames.Name}
                    value={name}
                    onChange={handleChangeInputFields}
                    invalid={!!nameError}
                    placeholder="Введите ФИО клиента"
                    spellCheck={false}
                />
                <CFormFeedback invalid>{nameError}</CFormFeedback>
                <CFormLabel className="mt-3">Email</CFormLabel>
                <CFormInput
                    name={InputFieldNames.Email}
                    value={email}
                    onChange={handleChangeInputFields}
                    invalid={!!emailError}
                    placeholder="Введите почту клиента"
                    spellCheck={false}
                />
                <CFormFeedback invalid>{emailError}</CFormFeedback>
                <CFormLabel className="mt-3">Адрес</CFormLabel>
                <CFormInput
                    name={InputFieldNames.Address}
                    value={address}
                    onChange={handleChangeInputFields}
                    invalid={!!addressError}
                    placeholder="Введите адрес клиента"
                    spellCheck={false}
                />
                <CFormFeedback invalid>{addressError}</CFormFeedback>
            </CModalBody>
            <CModalFooter>
                <CButton color="success" className="text-white" onClick={handleCreateCompany}>
                    {client ? 'Сохранить' : 'Создать'}
                </CButton>
                <CButton color="light" onClick={() => setVisible(false)}>
                    Отмена
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default CreateCompanyModal;
