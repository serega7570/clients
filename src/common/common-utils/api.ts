import {
    ActionCreatorWithoutPayload,
    ActionCreatorWithPayload,
    createAction,
    PayloadActionCreator,
} from '@reduxjs/toolkit';
import axios, { RawAxiosRequestConfig } from 'axios';
import { AppDispatch, AppThunk, RootState } from '../../app/store';
import { getAbortController } from './abort-controller-manager';

export function createAsyncActions<T = void>(actionPrefix: string) {
    return {
        pending: createAction<void>(`${actionPrefix}/pending`),
        fulfilled: createAction<T>(`${actionPrefix}/fulfilled`),
        rejected: createAction<Error>(`${actionPrefix}/rejected`),
    };
}

type AppThunkApi = {
    dispatch: AppDispatch;
    state: RootState;
};

type CreateAppAsyncThunkReturnType<ParamsType, ReturnType> = {
    pending: ActionCreatorWithoutPayload;
    fulfilled: PayloadActionCreator<ReturnType>;
    rejected: ActionCreatorWithPayload<Error>;
    getThunk: (params: ParamsType, options?: { dispatchActions: boolean }) => AppThunk<Promise<ReturnType>>;
};

export function createAppAsyncThunk<ParamsType extends object, ReturnType>(
    prefix: string,
    payloadCreator: (params: ParamsType, thunkApi: AppThunkApi) => Promise<ReturnType>,
    paramsAction: boolean = false
): CreateAppAsyncThunkReturnType<ParamsType, ReturnType> {
    const { pending, fulfilled, rejected } = createAsyncActions<ReturnType>(prefix);

    function getThunk(
        params: ParamsType,
        options: { dispatchActions: boolean } = {
            dispatchActions: true,
        }
    ): AppThunk<Promise<ReturnType>> {
        const { dispatchActions } = options;
        return async (dispatch, getState) => {
            try {
                if (dispatchActions) dispatch(pending());
                const result = await payloadCreator(params, {
                    dispatch,
                    state: getState(),
                });
                if (dispatchActions) dispatch(fulfilled(paramsAction ? { result, params } : result));
                return result;
            } catch (e) {
                const eSerializable = JSON.parse(JSON.stringify(e));
                if (dispatchActions) dispatch(rejected(eSerializable));
                throw e;
            }
        };
    }

    return { pending, fulfilled, rejected, getThunk };
}

type ApiRequest = {
    config: RawAxiosRequestConfig;
    requestAccess?: {
        sessionUserPermissions: Record<string, string>;
        requiredPermissions: string[];
    };
    dispatch?: AppDispatch;
};
export async function makeApiRequest<ReturnType>({ config, requestAccess }: ApiRequest): Promise<ReturnType> {
    if (requestAccess) {
        const { sessionUserPermissions, requiredPermissions } = requestAccess;

        const isRequestAccess =
            sessionUserPermissions && requiredPermissions.every((item) => item in sessionUserPermissions);

        if (!isRequestAccess) throw new Error('request_not_access');
    }

    const requestConfig = {
        ...config,
        signal: getAbortController().signal,
    };

    const { data } = await axios<ReturnType>(requestConfig);
    return data;
}
