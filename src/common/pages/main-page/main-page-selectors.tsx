import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

const selectClientsState = (state: RootState) => state.clients;

export const selectClients = createSelector([selectClientsState], ({ clients }) => clients);

export const selectClientsCount = createSelector([selectClientsState], ({ count }) => count);
