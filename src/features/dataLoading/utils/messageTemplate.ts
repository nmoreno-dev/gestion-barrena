import { Deudor } from '../interfaces/deudor';

const TEMPLATE = `
Buen Dia, [NOMBRE Y APELLIDO].
Nos comunicamos desde Estudio Jurídico Barrena. Informamos que la empresa [ACREEDOR_NOMBRE] reclama saldos vencidos por su préstamo N°[Nº DE CREDITO].
Usted tiene cuotas pendientes de pago por un total de [DEUDA ACTUAL].

Si desea cancelar debe abonar un total de [DEUDA CANCELATORIA].
Plazo para registrar el pago [Dia de mañana].
Le recomendamos regularizar a la brevedad para evitar que siga sumando intereses por atraso de pago. 
[ACREEDOR_WEB]
También puede registrar el pago a través de depósito o transferencia bancaria a la cuenta de la empresa.
DATOS BANCARIOS:
BANCO: [ACREEDOR_BANCO]
EMPRESA: [ACREEDOR_NOMBRE]
CUIT: [ACREEDOR_CUIT]
N° CUENTA: [ACREEDOR_CUENTA]
ALIAS: [ACREEDOR_ALIAS]
CBU: [ACREEDOR_CBU]
[ACREEDOR_TIPO_CUENTA]

IMPORTANTE: Recuerde enviar el comprobante de pago para poder actualizar su estado en nuestro sistema.
Una vez que tenga el comprobante nos lo envía por este medio o al siguiente chat de WhatsApp: https://wa.me/+5491173561406
Esperamos su respuesta.
Muchas Gracias.
Saludos.
` as const;

export default function createMessage(deudor: Deudor) {
  return TEMPLATE.replaceAll('[NOMBRE Y APELLIDO]', deudor.nombre)
    .replaceAll('[Nº DE CREDITO]', deudor.numeroCredito.toString())
    .replaceAll(
      '[DEUDA ACTUAL]',
      deudor.deudaActual.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol',
        style: 'currency',
        currency: 'ARS',
      }),
    )
    .replaceAll(
      '[DEUDA CANCELATORIA]',
      deudor.deudaCancelatoria.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol',
        style: 'currency',
        currency: 'ARS',
      }),
    )
    .replaceAll('[Dia de mañana]', new Date(Date.now() + 86400000).toLocaleDateString('es-AR'))
    .replaceAll('[ACREEDOR_BANCO]', deudor.acreedor.banco)
    .replaceAll('[ACREEDOR_NOMBRE]', deudor.acreedor.nombre)
    .replaceAll('[ACREEDOR_CUIT]', deudor.acreedor.cuit.toString())
    .replaceAll('[ACREEDOR_CUENTA]', deudor.acreedor.numeroCuenta.toString())
    .replaceAll('[ACREEDOR_ALIAS]', deudor.acreedor.alias)
    .replaceAll('[ACREEDOR_CBU]', deudor.acreedor.CBU.toString())
    .replaceAll(
      '[ACREEDOR_WEB]',
      deudor.acreedor.web
        ? `Puede registrar el pago del saldo de sus cuotas vencidas ingresando a su cuenta en nuestra página web: ${deudor.acreedor.web}`
        : '',
    )
    .replaceAll(
      '[ACREEDOR_TIPO_CUENTA]',
      deudor.acreedor.tipoCuenta ? `TIPO DE CUENTA: ${deudor.acreedor.tipoCuenta}` : '',
    );
}
