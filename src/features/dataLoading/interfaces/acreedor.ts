export enum Banco {
  BBVA = 'BANCO FRANCES - BBVA',
  BANCO_INDUSTRIAL = 'BANCO INDUSTRIAL SA',
  BANCO_SANTANDER = 'SANTANDER',
  PATAGONIA = 'PATAGONIA',
}

export interface Acreedor {
  nombreCortoBanco: string;
  banco: Banco;
  nombre: string;
  cuit: number | string;
  numeroCuenta: string;
  alias: string;
  CBU: string;
  titular?: string;
  tipoCuenta?: string;
}

const CEFERINO: Acreedor = {
  nombreCortoBanco: 'BBVA',
  banco: Banco.BBVA,
  nombre: 'CREDIPLAT S.A.',
  cuit: '30-71151720-7',
  numeroCuenta: '2000003038200',
  alias: 'FRANCESCREDIPLAT',
  CBU: '0170356420000030382008',
};

const SAN_JORGE: Acreedor = {
  nombreCortoBanco: 'INDUSTRIAL',
  banco: Banco.BANCO_INDUSTRIAL,
  nombre: 'ADELANTOS PAY SA.',
  cuit: '30718438906',
  numeroCuenta: '1-5020320/1',
  alias: 'ADELANTOSPAY',
  CBU: '3220001805050203200010',
  titular: 'ADELANTOS PAY SA.',
  tipoCuenta: 'CUENTA CORRIENTE',
};

const IXPAY: Acreedor = {
  nombreCortoBanco: 'SANTANDER',
  banco: Banco.BANCO_SANTANDER,
  nombre: 'EDICIONES TALAR',
  cuit: '30-70912863-5',
  numeroCuenta: '429-016358/3',
  alias: 'TRAPO.CLARIN.BATA',
  CBU: '0720429020000001635836',
};

const ONCE_DE_JULIO: Acreedor = {
  nombreCortoBanco: 'PATAGONIA',
  banco: Banco.PATAGONIA,
  nombre: 'EDUCAX SA.',
  cuit: '30-71810511-7',
  numeroCuenta: '010-100766315-000',
  alias: 'CALCULAR.SUMAN.ABACO',
  CBU: '0340010400100766315009',
};
export const ACREEDORES: Acreedor[] = [CEFERINO, SAN_JORGE, IXPAY, ONCE_DE_JULIO];
