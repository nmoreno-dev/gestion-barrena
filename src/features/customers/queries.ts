import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchCustomer, fetchCustomers } from './api';

/**
 * Clave única para identificar la consulta de “customers” en la caché de React Query.
 * - ¿Por qué? Para que React Query agrupe, comparta y cachee correctamente los datos.
 * - ¿Cuándo? Siempre que queramos leer o pre-fetch la lista de clientes.
 */
export const customersQueryKey = ['customers'] as const;
export const customerQueryKey = ['customers'] as const;

/**
 * Opciones por defecto para las Query Keys
 * - queryKey: usa la clave definida más arriba.
 * - queryFn: función responsable de hacer el fetch.
 *
 * ¿Por qué definimos esto?
 * - Centralizar la configuración de la cache (TTL, reintentos, etc.).
 * - Permite reutilizar la misma configuración en loaders o en hooks.
 *
 * ¿Cuándo y cómo usarlo?
 * - En loaders de TanStack Router: queryClient.ensureQueryData(customersQueryOptions)
 * - En triggers de prefetch manual: queryClient.ensureQueryData(customersQueryOptions)
 */
export const customersQueryOptions = {
  queryKey: customersQueryKey,
  queryFn: fetchCustomers,
};
export const customerQueryOptions = {
  queryKey: customerQueryKey,
  queryFn: fetchCustomer,
};

/**
 * Hook personalizado para consumir la lista de clientes con React Query.
 *
 * ¿Por qué?
 * - Encapsula fetch y QueryOptions.
 * - Provee un API consistente (status, data, error, refetch…).
 *
 * ¿Cuándo?
 * - Dentro de componentes de React que necesitan mostrar o interactuar con la data de forma reactiva.
 *
 * ¿Cómo?
 * - Permite recibir opciones adicionales (`options`) para casos especiales
 *   (paginación, polling, onError, enabled flags…).
 * - Fusiona siempre la configuración base con la específica de cada llamada.
 */
export function useCustomersQuery(options?: UseQueryOptions<ReturnType<typeof fetchCustomers>>) {
  return useQuery({ ...customersQueryOptions, ...options });
}
export function useCustomerQuery(options?: UseQueryOptions<ReturnType<typeof fetchCustomer>>) {
  return useQuery({ ...customerQueryOptions, ...options });
}
