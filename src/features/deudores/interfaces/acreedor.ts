export enum Banco {
  BBVA = 'BANCO FRANCES - BBVA',
  BANCO_INDUSTRIAL = 'BANCO INDUSTRIAL S.A.',
  BANCO_SANTANDER = 'SANTANDER',
  PATAGONIA = 'PATAGONIA',
  CERSIUM = 'CERSIUM S.A.',
}

export interface Acreedor {
  id: string; // id interno del acreedor
  nombre: string; // nombre del acreedor, ej: 'CREDIPLAT S.A.'
  nombreEmpresa: string; // nombre legal de la empresa
  banco: Banco; // banco del acreedor
  nombreCortoBanco: string; // nombre corto del banco, ej: 'BBVA'
  cuit: number | string; // CUIT del acreedor
  numeroCuenta?: string; // número de cuenta del acreedor (opcional)
  alias: string; // alias de la cuenta del acreedor
  CBU: string; // CBU de la cuenta del acreedor
  titular?: string; // titular de la cuenta del acreedor
  tipoCuenta?: string; // tipo de cuenta del acreedor
}

const CEFERINO: Acreedor = {
  id: 'ceferino',
  nombre: 'CEFERINO',
  nombreEmpresa: 'CREDIPLAT S.A.',
  banco: Banco.BBVA,
  nombreCortoBanco: 'BBVA',
  cuit: '30-71151720-7',
  numeroCuenta: '2000003038200',
  alias: 'FRANCESCREDIPLAT',
  CBU: '0170356420000030382008',
};

const SAN_JORGE: Acreedor = {
  id: 'sanjorge',
  nombre: 'SAN JORGE',
  nombreEmpresa: 'MILENIO EDICIONES S.A.',
  banco: Banco.CERSIUM,
  nombreCortoBanco: 'CERSIUM',
  cuit: '30-70543429-4',
  numeroCuenta: '1-5020320/1',
  alias: 'ADELANTO.SANJORGE',
  CBU: '0000335100000000196240',
  tipoCuenta: 'CUENTA CORRIENTE',
};

const IXPAY: Acreedor = {
  id: 'ixpay',
  nombre: 'IXPAY',
  nombreEmpresa: 'EDICIONES TALAR',
  banco: Banco.BANCO_SANTANDER,
  nombreCortoBanco: 'SANTANDER',
  cuit: '30-70912863-5',
  numeroCuenta: '429-016358/3',
  alias: 'TRAPO.CLARIN.BATA',
  CBU: '0720429020000001635836',
};

const ONCE_DE_JULIO: Acreedor = {
  id: '11dejulio',
  nombre: 'ONCE DE JULIO',
  nombreEmpresa: 'MILENIO EDICIONES S.A.',
  banco: Banco.CERSIUM,
  nombreCortoBanco: 'CERSIUM',
  cuit: '30-70543429-4',
  numeroCuenta: '010-100766315-000',
  alias: 'ADELANTO.11DEJULIO',
  CBU: '0000335100000000196257',
};
export const ACREEDORES: Acreedor[] = [CEFERINO, SAN_JORGE, IXPAY, ONCE_DE_JULIO];
