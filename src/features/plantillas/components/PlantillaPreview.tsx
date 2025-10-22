import { Eye } from 'lucide-react';

// Datos de ejemplo basados en datos reales
const EXAMPLE_DATA = {
  '[DEUDOR_NOMBRE]': 'ABAD MARCELA YAMILA',
  '[DEUDOR_CUIL]': '27-27176013-8',
  '[DEUDOR_EMAIL]': 'marcelayamilaabad86@gmail.com',
  '[DEUDOR_TELEFONO]': '387155337977',
  '[NUMERO_CREDITO]': '839025',
  '[DEUDA_ACTUAL]': '$44.863,77',
  '[DEUDA_CANCELATORIA]': '$281.463,77',
  '[PLAZO_VENCIMIENTO]': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'es-AR',
  ),
  '[ACREEDOR_BANCO]': 'BANCO INDUSTRIAL S.A.',
  '[ACREEDOR_NOMBRE_EMPRESA]': 'ADELANTOS PAY S.A.',
  '[ACREEDOR_CUIT]': '30-71843890-6',
  '[ACREEDOR_CUENTA]': '1-5020320/1',
  '[ACREEDOR_CBU]': '3220001805050203200010',
  '[ACREEDOR_ALIAS]': 'ADELANTOSPAY',
  '[ACREEDOR_TIPO_CUENTA]': 'CUENTA CORRIENTE',
};

interface PlantillaPreviewProps {
  name: string;
  body: string;
}

function PlantillaPreview({ name, body }: PlantillaPreviewProps) {
  // Función para reemplazar variables en el preview
  const getPreviewText = (text: string) => {
    let preview = text;
    Object.entries(EXAMPLE_DATA).forEach(([variable, value]) => {
      preview = preview.replace(
        new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        value,
      );
    });
    return preview;
  };

  return (
    <div className="card bg-base-200 sticky top-6">
      <div className="card-body">
        <h3 className="card-title text-lg">
          <Eye className="w-5 h-5" />
          Vista Previa en Tiempo Real
        </h3>
        <p className="text-sm text-base-content/60 mb-4">
          Así se verá tu plantilla con datos de ejemplo
        </p>

        <div className="bg-base-300 p-4 rounded-lg border-l-4 border-primary min-h-[200px]">
          <div className="prose max-w-none">
            <h4 className="text-base font-semibold mb-2 text-primary">{name || 'Sin nombre'}</h4>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {body ? (
                getPreviewText(body)
              ) : (
                <span className="text-base-content/40 italic">
                  El contenido aparecerá aquí mientras escribes...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Información de variables usadas */}
        <div className="mt-4">
          <div className="text-sm text-base-content/60">
            <span className="font-medium">Variables de ejemplo:</span>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
              <li>
                <code className="text-primary">[DEUDOR_NOMBRE]</code> → ABAD MARCELA YAMILA
              </li>
              <li>
                <code className="text-primary">[DEUDOR_CUIL]</code> → 27-27176013-8
              </li>
              <li>
                <code className="text-primary">[DEUDA_ACTUAL]</code> → $44.863,77
              </li>
              <li>
                <code className="text-primary">[ACREEDOR_BANCO]</code> → BANCO INDUSTRIAL S.A.
              </li>
              <li>
                <code className="text-primary">[ACREEDOR_ALIAS]</code> → ADELANTOSPAY
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantillaPreview;
