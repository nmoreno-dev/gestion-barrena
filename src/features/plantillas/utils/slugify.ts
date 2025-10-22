/**
 * Convierte un nombre a formato slug (snake-case)
 * Útil para crear URLs amigables a partir de nombres de plantillas
 *
 * @param name - El nombre a convertir
 * @returns El slug generado
 *
 * @example
 * nameToSlug('Mi Plantilla de Pago') // 'mi-plantilla-de-pago'
 * nameToSlug('Notificación 123!') // 'notificacion-123'
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
