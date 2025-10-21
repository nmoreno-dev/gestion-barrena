import formatCuil from '@/utils/cuilFormater';
import { Deudor } from '../interfaces/deudor';

const TEMPLATE = `Buen Día, <strong>[DEUDOR_NOMBRE], CUIL: [DEUDOR_CUIL]</strong>.<br><br>

Nos comunicamos desde <em>Estudio Jurídico Barrena</em>. Informamos que la empresa <strong>ADELANTOS.COM</strong> reclama saldos vencidos por su préstamo N° <strong>[NUMERO_CREDITO]</strong>.<br><br>

Usted tiene cuotas pendientes de pago por un total de <strong>[DEUDA_ACTUAL]</strong>.<br><br>

Si desea cancelar debe abonar un total de <strong>[DEUDA_CANCELATORIA]</strong>.<br><br>

Plazo para registrar el pago <strong>[PLAZO_VENCIMIENTO]</strong>.<br><br>

<em><strong>Le recomendamos regularizar a la brevedad para evitar que siga sumando intereses por atraso de pago.</strong></em> ❗⚠️<br><br>

Puede registrar el pago del saldo de sus cuotas vencidas ingresando a su cuenta en nuestra página web: <strong><a href="www.adelantos.com.ar">www.adelantos.com.ar</a></strong><br><br>

También puede registrar el pago a través de depósito o transferencia bancaria a la cuenta de la empresa.<br><br>

<u><strong>DATOS BANCARIOS:</strong></u><br>
BANCO: [ACREEDOR_BANCO]<br>
EMPRESA: [ACREEDOR_NOMBRE_EMPRESA]<br>
CUIT: [ACREEDOR_CUIT]<br>
N° CUENTA: [ACREEDOR_CUENTA]<br>
<strong>CBU: [ACREEDOR_CBU]</strong><br>
ALIAS: [ACREEDOR_ALIAS]<br>
[ACREEDOR_TIPO_CUENTA]

*Una vez que tenga el comprobante nos lo envía por este medio o al siguiente chat de WhatsApp: <strong><a href="https://wa.me/+5491173561406">https://wa.me/+5491173561406</a></strong><br><br>

Esperamos su respuesta.<br><br>

Muchas Gracias.<br><br>
Saludos.` as const;

export default function createMessage(deudor: Deudor) {
  return TEMPLATE.replaceAll('[DEUDOR_NOMBRE]', deudor.nombre)
    .replaceAll('[DEUDOR_CUIL]', formatCuil(deudor.cuil))
    .replaceAll('[NUMERO_CREDITO]', deudor.numeroCredito.toString())
    .replaceAll(
      '[DEUDA_ACTUAL]',
      deudor.deudaActual.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol',
        style: 'currency',
        currency: 'ARS',
      }),
    )
    .replaceAll(
      '[DEUDA_CANCELATORIA]',
      deudor.deudaCancelatoria.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol',
        style: 'currency',
        currency: 'ARS',
      }),
    )
    .replaceAll('[PLAZO_VENCIMIENTO]', new Date(Date.now() + 86400000).toLocaleDateString('es-AR'))
    .replaceAll('[ACREEDOR_BANCO]', deudor.acreedor.banco)
    .replaceAll('[ACREEDOR_NOMBRE_EMPRESA]', deudor.acreedor.nombreEmpresa)
    .replaceAll('[ACREEDOR_CUIT]', deudor.acreedor.cuit.toString())
    .replaceAll('[ACREEDOR_CUENTA]', deudor.acreedor.numeroCuenta.toString())
    .replaceAll('[ACREEDOR_ALIAS]', deudor.acreedor.alias)
    .replaceAll('[ACREEDOR_CBU]', deudor.acreedor.CBU.toString())
    .replaceAll(
      '[ACREEDOR_TIPO_CUENTA]',
      deudor.acreedor.tipoCuenta ? `TIPO DE CUENTA: ${deudor.acreedor.tipoCuenta}<br><br>` : '<br>',
    );
}
