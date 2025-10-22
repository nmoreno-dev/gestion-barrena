export interface Plantilla {
  id: string;
  name: string;
  subject: string;
  body: string;
  bcc: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlantillaData {
  name: string;
  subject: string;
  body: string;
  bcc: string[];
}

export interface UpdatePlantillaData {
  name?: string;
  subject?: string;
  body?: string;
  bcc?: string[];
}

export interface PlantillaPreviewData {
  [key: string]: string | number;
}

export interface TemplateVariableInfo {
  variable: string;
  description: string;
  example: string;
}

// Variables disponibles para template strings basadas en el sistema existente
export const AVAILABLE_TEMPLATE_VARIABLES: TemplateVariableInfo[] = [
  // Variables del deudor
  {
    variable: '[DEUDOR_NOMBRE]',
    description: 'Nombre completo del deudor',
    example: 'Juan Pérez',
  },
  {
    variable: '[DEUDOR_CUIL]',
    description: 'CUIL del deudor formateado',
    example: '20-12345678-9',
  },
  {
    variable: '[NUMERO_CREDITO]',
    description: 'Número de crédito del deudor',
    example: '123456',
  },

  // Variables de deuda
  {
    variable: '[DEUDA_ACTUAL]',
    description: 'Monto de la deuda actual formateado',
    example: '$15.000,50',
  },
  {
    variable: '[DEUDA_CANCELATORIA]',
    description: 'Monto total para cancelar la deuda',
    example: '$18.500,75',
  },
  {
    variable: '[PLAZO_VENCIMIENTO]',
    description: 'Fecha de vencimiento del plazo',
    example: '15/12/2024',
  },

  // Variables del acreedor
  {
    variable: '[ACREEDOR_BANCO]',
    description: 'Nombre del banco del acreedor',
    example: 'BBVA Argentina',
  },
  {
    variable: '[ACREEDOR_NOMBRE_EMPRESA]',
    description: 'Nombre de la empresa acreedora',
    example: 'ADELANTOS.COM',
  },
  {
    variable: '[ACREEDOR_CUIT]',
    description: 'CUIT del acreedor',
    example: '30-12345678-9',
  },
  {
    variable: '[ACREEDOR_CUENTA]',
    description: 'Número de cuenta del acreedor',
    example: '1234567890',
  },
  {
    variable: '[ACREEDOR_CBU]',
    description: 'CBU del acreedor',
    example: '0110599520000012345678',
  },
  {
    variable: '[ACREEDOR_ALIAS]',
    description: 'Alias bancario del acreedor',
    example: 'ADELANTOS.EMPRESA',
  },
  {
    variable: '[ACREEDOR_TIPO_CUENTA]',
    description: 'Tipo de cuenta del acreedor (opcional)',
    example: 'Cuenta Corriente',
  },
];
