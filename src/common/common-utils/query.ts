import { FilterNames } from '../common-consts/filters';

export const ORDER_SYMBOL = '-';
export const DEFAULT_PAGE = '1';
export const DEFAULT_PAGE_SIZE = '5';

export const getQueryParam = (query: string, queryParam: string) => new URLSearchParams(query).get(queryParam);

export const setDefaultQuery = (query: string) => {
    const searchParams = new URLSearchParams(query);
    searchParams.set(FilterNames.Page, DEFAULT_PAGE);
    searchParams.set(FilterNames.PageSize, DEFAULT_PAGE_SIZE);
    return searchParams.toString();
};

export const setQueryParam = (
    query: string,
    queryParam: string,
    paramName: string | undefined,
    defaultPagination: boolean = false
) => {
    if (!paramName) return deleteQueryParam(query, queryParam);
    const searchParams = new URLSearchParams(query);
    if (defaultPagination) {
        searchParams.set(FilterNames.Page, DEFAULT_PAGE);
        searchParams.set(FilterNames.PageSize, DEFAULT_PAGE_SIZE);
    }
    searchParams.set(queryParam, paramName);
    return searchParams.toString();
};

export const deleteQueryParam = (query: string, queryParam: string) => {
    const searchParam = getQueryParam(query, queryParam);
    if (searchParam) {
        const searchParams = new URLSearchParams(query);
        searchParams.delete(queryParam);
        return searchParams.toString();
    }
};
