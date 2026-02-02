export { default as PACKAGE_JSON } from '@/package.json';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v2';
export const IS_PROD = import.meta.env.PROD;
export const IS_DEV = import.meta.env.DEV;
