const { NODE_ENV } = process.env;

const BACKEND_API_PROTOCOL = NODE_ENV === 'development' ? 'http:' : 'http:';

const BACKEND_HOST = NODE_ENV === 'development' ? '127.0.0.1:5001' : '127.0.0.1:5001';

export const BACKEND_API_URL = `${BACKEND_API_PROTOCOL}//${BACKEND_HOST}/api/v1`;
