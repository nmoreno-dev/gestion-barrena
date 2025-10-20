import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/app/constants';

/**
 * httpClient: instancia de Axios configurada para toda la aplicación.
 * - baseURL compuesto por base + versión de API.
 * - Timeout por defecto de 10 segundos.
 * - Interceptores para logs y manejo de errores global.
 */
const httpClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de request: añadir tokens, logs, etc.
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Asegurar que headers esté definido
    config.headers = config.headers ?? {};

    // TODO
    // Ejemplo: añadir token de auth si existe
    // const token = localStorage.getItem("auth_token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Log simple
    // console.debug("[HTTP] Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    console.error('[HTTP] Request Error:', error);
    return Promise.reject(error);
  },
);

// Interceptor de response: manejo global de errores
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Aquí puedes normalizar o transformar datos si es necesario
    return response;
  },
  (error: AxiosError) => {
    console.error('[HTTP] Response Error:', error.response?.status, error.message);
    // Ejemplo: manejo global de 401
    if (error.response?.status === 401) {
      // Redirigir a login o limpiar sesión
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default httpClient;
