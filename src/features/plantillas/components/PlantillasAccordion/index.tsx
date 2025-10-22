import { ChevronDown, Info, Code, User, DollarSign, Building } from 'lucide-react';
import { useState } from 'react';

// Variables organizadas por categorías
const variableCategories = [
  {
    title: 'Datos del Deudor',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    variables: [
      {
        code: '[DEUDOR_NOMBRE]',
        description: 'Nombre completo del deudor',
        example: 'Juan Carlos Pérez',
      },
      {
        code: '[DEUDOR_CUIL]',
        description: 'CUIL del deudor formateado',
        example: '20-12345678-9',
      },
    ],
  },
  {
    title: 'Información de Deuda',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    variables: [
      {
        code: '[NUMERO_CREDITO]',
        description: 'Número de crédito o préstamo',
        example: '123456',
      },
      {
        code: '[DEUDA_ACTUAL]',
        description: 'Monto actual de la deuda',
        example: '$15.000,50',
      },
      {
        code: '[DEUDA_CANCELATORIA]',
        description: 'Monto total para cancelar',
        example: '$18.500,75',
      },
      {
        code: '[PLAZO_VENCIMIENTO]',
        description: 'Fecha límite de pago',
        example: '15/12/2024',
      },
    ],
  },
  {
    title: 'Datos del Acreedor',
    icon: Building,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    variables: [
      {
        code: '[ACREEDOR_NOMBRE_EMPRESA]',
        description: 'Nombre de la empresa',
        example: 'ADELANTOS.COM',
      },
      {
        code: '[ACREEDOR_BANCO]',
        description: 'Banco del acreedor',
        example: 'BBVA Argentina',
      },
      {
        code: '[ACREEDOR_CUIT]',
        description: 'CUIT de la empresa',
        example: '30-12345678-9',
      },
      {
        code: '[ACREEDOR_CUENTA]',
        description: 'Número de cuenta',
        example: '1234567890',
      },
      {
        code: '[ACREEDOR_CBU]',
        description: 'CBU para transferencias',
        example: '0110599520000012345678',
      },
      {
        code: '[ACREEDOR_ALIAS]',
        description: 'Alias bancario',
        example: 'ADELANTOS.EMPRESA',
      },
      {
        code: '[ACREEDOR_TIPO_CUENTA]',
        description: 'Tipo de cuenta (opcional)',
        example: 'Cuenta Corriente',
      },
    ],
  },
];

export function PlantillasAccordion() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <div className="card w-full bg-gradient-to-r from-info/5 to-primary/5 border border-info/20">
      <div className="card-body">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <Code className="text-info" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-info text-lg">Guía de Variables de Plantilla</h3>
              <p className="text-sm text-base-content/60">
                Aprende a usar variables dinámicas en tus mensajes
              </p>
            </div>
          </div>
          <ChevronDown
            className={`text-info transition-transform duration-200 ${
              isAccordionOpen ? 'rotate-180' : ''
            }`}
            size={20}
          />
        </div>

        {isAccordionOpen && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {/* Explicación general */}
            <div className="bg-base-100 rounded-lg p-4 border border-base-300">
              <div className="flex items-start gap-3">
                <Info className="text-info mt-1" size={16} />
                <div className="flex-1">
                  <h4 className="font-medium mb-2">¿Cómo funcionan las variables?</h4>
                  <p className="text-sm text-base-content/70 mb-3">
                    Las variables son marcadores que se reemplazan automáticamente con datos reales
                    cuando generas un mensaje. Escribe el nombre de la variable entre corchetes como{' '}
                    <code className="bg-base-300 px-1 rounded">[VARIABLE_NOMBRE]</code>.
                  </p>
                  <div className="bg-base-200 rounded p-3">
                    <p className="text-xs text-base-content/60 mb-1">Ejemplo:</p>
                    <p className="font-mono text-sm">
                      &quot;Estimado <span className="text-primary">[DEUDOR_NOMBRE]</span>, su deuda
                      es de <span className="text-primary">[DEUDA_ACTUAL]</span>&quot;
                    </p>
                    <p className="text-xs text-base-content/60 mt-2">Se convierte en:</p>
                    <p className="text-sm">
                      &quot;Estimado <span className="font-medium">Juan Pérez</span>, su deuda es de{' '}
                      <span className="font-medium">$15.000,50</span>&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Variables por categorías */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {variableCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                    className="bg-base-100 rounded-lg border border-base-300 overflow-hidden"
                  >
                    <div className={`p-3 border-b border-base-300`}>
                      <div className="flex items-center gap-2">
                        <IconComponent className={category.color} size={18} />
                        <h5 className="font-medium">{category.title}</h5>
                      </div>
                    </div>
                    <div className="p-3 space-y-3">
                      {category.variables.map((variable, varIndex) => (
                        <div key={varIndex} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="bg-base-300 px-2 py-1 rounded text-xs font-mono">
                              {variable.code}
                            </code>
                          </div>
                          <p className="text-xs text-base-content/70">{variable.description}</p>
                          <p className="text-xs text-base-content/50">
                            Ej: <span className="font-medium">{variable.example}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tips adicionales */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <h5 className="font-medium text-warning mb-2">💡 Tips importantes:</h5>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Las variables son sensibles a mayúsculas y minúsculas</li>
                <li>• Siempre usa corchetes cuadrados [ ] para delimitar las variables</li>
                <li>• Las variables se procesan automáticamente con el formato correcto</li>
                <li>• Puedes usar múltiples variables en una sola plantilla</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
