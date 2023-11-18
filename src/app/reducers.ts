import { combineReducers } from '@reduxjs/toolkit';
import { clientsReducer } from '../common/pages/main-page/main-page-slice';

export const rootReducer = combineReducers({ clients: clientsReducer });
