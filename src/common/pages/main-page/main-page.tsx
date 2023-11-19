import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CFormSelect,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';
import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { FilterNames } from '../../common-consts/filters';
import { getQueryParam, setDefaultQuery } from '../../common-utils/query';
import CreateClientModal from '../../create-client-modal';
import Pagination from '../../pagination';
import { selectClients, selectClientsCount } from './main-page-selectors';
import { clearClients, loadClients, deleteClient } from './main-page-slice';
import { Client } from './main-page-type';
import s from './main-page.module.scss';

const MainPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    const clients = useAppSelector(selectClients);
    const totalCount = useAppSelector(selectClientsCount);

    const [modal, setModal] = useState(false);
    const [client, setClient] = useState<Client | null>(null);

    const pageIndex = getQueryParam(search, FilterNames.Page);
    const pageSize = getQueryParam(search, FilterNames.PageSize);

    useEffect(() => {
        if (!pageIndex || !pageSize) {
            const newQuery = setDefaultQuery(search);
            navigate(`${pathname}?${newQuery}`);
        }
        dispatch(loadClients.getThunk({ query: search }));
    }, [dispatch, search, navigate, pathname, pageIndex, pageSize]);

    useEffect(() => {
        return () => {
            dispatch(clearClients());
        };
    }, [dispatch]);

    if (!pageIndex || !pageSize) return null;
    const pagesCount = Math.ceil(totalCount / parseInt(pageSize));

    const handleDeleteClient = async (id: string) => {
        await dispatch(deleteClient.getThunk({ id: id }));
        dispatch(loadClients.getThunk({ query: search }));
    };

    const handleEditClientClick = (client: Client) => {
        setClient(client);
        setModal(true);
    };

    const handlePageIndexChange = (newPageIndex: number) => {
        const searchParams = new URLSearchParams(search);
        searchParams.set('page', newPageIndex.toString());
        navigate(`${pathname}?${searchParams.toString()}`);
    };

    const handlePageSizeChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const searchParams = new URLSearchParams(search);
        searchParams.set(FilterNames.Page, '1');
        searchParams.set(FilterNames.PageSize, e.currentTarget.value);
        navigate(`${pathname}?${searchParams.toString()}`);
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol>
                        <CCard>
                            <CCardHeader component="h4">Клиенты</CCardHeader>
                            <CCardBody>
                                <CTable className="align-middle">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell className={s.width31}>ФИО</CTableHeaderCell>
                                            <CTableHeaderCell className={s.width31}>Email</CTableHeaderCell>
                                            <CTableHeaderCell className={s.width31}>Адрес</CTableHeaderCell>
                                            <CTableHeaderCell className={s.width7}></CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {clients &&
                                            clients.map((client) => {
                                                return (
                                                    <CTableRow key={client['id']}>
                                                        <CTableDataCell>{client['fio']}</CTableDataCell>
                                                        <CTableDataCell>{client['email']}</CTableDataCell>
                                                        <CTableDataCell>{client['address']}</CTableDataCell>
                                                        <CTableDataCell className="text-end">
                                                            <CButtonGroup>
                                                                <CButton
                                                                    color="warning"
                                                                    size="sm"
                                                                    onClick={() => handleEditClientClick(client)}
                                                                >
                                                                    <CIcon icon={cilPencil} />
                                                                </CButton>
                                                                <CButton
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteClient(client['id'])}
                                                                >
                                                                    <CIcon icon={cilTrash} />
                                                                </CButton>
                                                            </CButtonGroup>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                );
                                            })}
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                            <CCardHeader className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <CFormSelect value={pageSize} className="me-2" onChange={handlePageSizeChange}>
                                        {[1, 2, 5, 10].map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    <Pagination
                                        currentPage={parseInt(pageIndex)}
                                        totalPages={pagesCount}
                                        handleCurrentPageChange={handlePageIndexChange}
                                    />
                                </div>
                                <CButton size="sm" onClick={() => setModal(true)}>
                                    Добавить клиента
                                </CButton>
                            </CCardHeader>
                        </CCard>
                    </CCol>
                </CRow>
                <CreateClientModal client={client} visible={modal} setVisible={setModal} setClient={setClient} />
            </CContainer>
        </div>
    );
};

export default MainPage;
