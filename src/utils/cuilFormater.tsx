export default function formatCuil(cuil: string): string {
  if (!cuil) return '';

  // Eliminar no-dígitos
  const soloNumeros = cuil.replace(/\D/g, '');

  // Verificar que tenga 11 dígitos
  if (soloNumeros.length !== 11) {
    return cuil; // Devolver el valor original si no tiene 11 dígitos
  }

  // Formatear el número
  return `${soloNumeros.slice(0, 2)}-${soloNumeros.slice(2, 10)}-${soloNumeros.slice(10)}`;
}
