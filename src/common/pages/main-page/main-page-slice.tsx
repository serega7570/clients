import { createSlice } from '@reduxjs/toolkit';
import { BACKEND_API_URL } from '../../common-consts/api';
import { createAppAsyncThunk, makeApiRequest } from '../../common-utils/api';
import { Client } from './main-page-type';

type ClientsState = {
    clients: Client[];
    count: number;
};

export const CLIENT_INITIAL_STATE: ClientsState = {
    clients: [],
    count: 0,
};

const clientsSlice = createSlice({
    name: 'clients',
    initialState: CLIENT_INITIAL_STATE,
    reducers: {
        clearClients: () => CLIENT_INITIAL_STATE,
    },
    extraReducers(builder) {
        builder.addCase(loadClients.fulfilled, (state, { payload }) => {
            state.clients = payload.results;
            state.count = payload.count;
        });
    },
});

export const { clearClients } = clientsSlice.actions;
export const clientsReducer = clientsSlice.reducer;

export const loadClients = createAppAsyncThunk<{ query: string }, { results: Client[]; count: number }>(
    'clients/loadClients',
    async ({ query }, { state }) =>
        makeApiRequest<{ results: Client[]; count: number }>({
            config: {
                url: `${BACKEND_API_URL}/clients${query}`,
                method: 'get',
            },
            sessionToken: window.localStorage.getItem('token'),
        })
);

export const deleteClient = createAppAsyncThunk<{ id: string }, boolean>(
    'clients/deleteClient',
    async ({ id }, { state }) =>
        makeApiRequest<boolean>({
            config: {
                url: `${BACKEND_API_URL}/client?id=${id}`,
                method: 'delete',
            },
            sessionToken: window.localStorage.getItem('token'),
        }),
    true
);

export const createClient = createAppAsyncThunk<{ address: string; email: string; fio: string }, Client>(
    'clients/createClient',
    async (data, { state }) =>
        makeApiRequest<Client>({
            config: {
                url: `${BACKEND_API_URL}/client`,
                method: 'post',
                data,
            },
            sessionToken: window.localStorage.getItem('token'),
        })
);

export const editClient = createAppAsyncThunk<{ id: string; address: string; email: string; fio: string }, Client>(
    'clients/editClient',
    async (data, { state }) =>
        makeApiRequest<Client>({
            config: {
                url: `${BACKEND_API_URL}/client`,
                method: 'put',
                data,
            },
            sessionToken: window.localStorage.getItem('token'),
        })
);
