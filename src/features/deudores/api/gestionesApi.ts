import httpClient from '@/app/httpClient';
import type {
  Gestion,
  CreateGestionDto,
  UpdateGestionDto,
  BatchStatusRequest,
  BatchStatusResponse,
} from '../interfaces/gestion';

const BASE_PATH = '/gestiones';

/**
 * Crea una nueva gestión en el servidor
 */
export const createGestion = async (dto: CreateGestionDto): Promise<Gestion> => {
  const response = await httpClient.post<Gestion>(BASE_PATH, dto);
  return response.data;
};

/**
 * Consulta el estado más reciente de múltiples créditos en batch
 * Ideal para sincronizar el estado al cargar un CSV
 */
export const batchStatus = async (nrosCredito: string[]): Promise<BatchStatusResponse> => {
  const request: BatchStatusRequest = { nrosCredito };
  const response = await httpClient.post<BatchStatusResponse>(`${BASE_PATH}/batch-status`, request);
  return response.data;
};

/**
 * Obtiene todas las gestiones históricas de un crédito específico
 */
export const getGestionesByCredito = async (nroCredito: string): Promise<Gestion[]> => {
  const response = await httpClient.get<Gestion[]>(`${BASE_PATH}/credito/${nroCredito}`);
  return response.data;
};

/**
 * Obtiene una gestión específica por su ID
 */
export const getGestionById = async (id: string): Promise<Gestion> => {
  const response = await httpClient.get<Gestion>(`${BASE_PATH}/${id}`);
  return response.data;
};

/**
 * Actualiza parcialmente una gestión existente
 */
export const updateGestion = async (id: string, dto: UpdateGestionDto): Promise<Gestion> => {
  const response = await httpClient.patch<Gestion>(`${BASE_PATH}/${id}`, dto);
  return response.data;
};

/**
 * Elimina lógicamente (soft delete) una gestión
 */
export const deleteGestion = async (id: string): Promise<void> => {
  await httpClient.delete(`${BASE_PATH}/${id}`);
};
