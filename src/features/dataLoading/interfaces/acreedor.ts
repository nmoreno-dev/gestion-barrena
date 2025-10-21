export enum Banco {
  BBVA = 'BANCO FRANCES - BBVA',
  BANCO_INDUSTRIAL = 'BANCO INDUSTRIAL S.A.',
  BANCO_SANTANDER = 'SANTANDER',
  PATAGONIA = 'PATAGONIA',
}

export interface Acreedor {
  nombre: string; // nombre del acreedor, ej: 'CREDIPLAT S.A.'
  nombreEmpresa?: string; // nombre legal de la empresa
  banco: Banco; // banco del acreedor
  nombreCortoBanco: string; // nombre corto del banco, ej: 'BBVA'
  cuit: number | string; // CUIT del acreedor
  numeroCuenta: string; // número de cuenta del acreedor
  alias: string; // alias de la cuenta del acreedor
  CBU: string; // CBU de la cuenta del acreedor
  titular?: string; // titular de la cuenta del acreedor
  tipoCuenta?: string; // tipo de cuenta del acreedor
  web?: string; // página web del acreedor
}

const CEFERINO: Acreedor = {
  nombre: 'CREDIPLAT S.A.',
  nombreEmpresa: 'CREDIPLAT S.A.',
  banco: Banco.BBVA,
  nombreCortoBanco: 'BBVA',
  cuit: '30-71151720-7',
  numeroCuenta: '2000003038200',
  alias: 'FRANCESCREDIPLAT',
  CBU: '0170356420000030382008',
};

const SAN_JORGE: Acreedor = {
  nombre: 'ADLENATOS.COM',
  nombreEmpresa: 'ADELANTOS PAY S.A.',
  banco: Banco.BANCO_INDUSTRIAL,
  nombreCortoBanco: 'INDUSTRIAL',
  cuit: '30718438906',
  numeroCuenta: '1-5020320/1',
  alias: 'ADELANTOSPAY',
  CBU: '3220001805050203200010',
  titular: 'ADELANTOS PAY S.A.',
  tipoCuenta: 'CUENTA CORRIENTE',
  web: 'www.adelantos.com.ar',
};

const IXPAY: Acreedor = {
  nombre: 'EDICIONES TALAR',
  nombreEmpresa: 'EDICIONES TALAR',
  banco: Banco.BANCO_SANTANDER,
  nombreCortoBanco: 'SANTANDER',
  cuit: '30-70912863-5',
  numeroCuenta: '429-016358/3',
  alias: 'TRAPO.CLARIN.BATA',
  CBU: '0720429020000001635836',
};

const ONCE_DE_JULIO: Acreedor = {
  nombre: 'EDUCAX S.A.',
  nombreEmpresa: 'EDUCAX S.A.',
  banco: Banco.PATAGONIA,
  nombreCortoBanco: 'PATAGONIA',
  cuit: '30-71810511-7',
  numeroCuenta: '010-100766315-000',
  alias: 'CALCULAR.SUMAN.ABACO',
  CBU: '0340010400100766315009',
};
export const ACREEDORES: Acreedor[] = [CEFERINO, SAN_JORGE, IXPAY, ONCE_DE_JULIO];
