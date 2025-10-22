import { Deudor } from '../../interfaces/deudor';
import {
  Table,
  createBasicColumn,
  createActionColumn,
  type ColumnDef,
} from '@/common/components/Table/exports';
import { toast } from '@/utils/toast';
import { copyToClipboard } from '@/utils/clipboard';
import {
  createMessage,
  sendEmail,
  processPlantillaForDeudor,
  type PlantillaData,
} from '../../utils';
import formatCuil from '@/utils/cuilFormater';

const copyMessageToClipboard = async (htmlString: string) => {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      // Copia el HTML con formato (Gmail lo renderiza correctamente)
      const blobInput = new Blob([htmlString], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blobInput,
        'text/plain': new Blob([htmlString.replace(/<[^>]+>/g, '')], {
          type: 'text/plain',
        }),
      });
      await navigator.clipboard.write([clipboardItem]);
    } else {
      // Fallback: copia texto plano si ClipboardItem no está soportado
      await navigator.clipboard.writeText(htmlString);
    }

    toast.success('Mensaje copiado al portapapeles correctamente', {
      duration: 3000,
    });
  } catch (error) {
    console.error('Error copying message to clipboard:', error);
    toast.error('Error al copiar el mensaje al portapapeles', {
      duration: 4000,
    });
  }
};

const copyCellValueToClipboard = async (value: string, label: string) => {
  try {
    await copyToClipboard(value);
    toast.success(`${label} copiado al portapapeles: ${value}`, {
      duration: 2000,
    });
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    toast.error(`Error al copiar ${label}`, {
      duration: 3000,
    });
  }
};

const TablaDeudores = ({
  deudores,
  plantillas = [],
  selectedPlantillaId,
  onPlantillaChange,
  isLoadingPlantillas = false,
}: {
  deudores: Deudor[];
  plantillas?: PlantillaData[];
  selectedPlantillaId?: string | null;
  onPlantillaChange?: (id: string | null) => void;
  isLoadingPlantillas?: boolean;
}) => {
  // Encontrar la plantilla seleccionada
  const selectedPlantilla = selectedPlantillaId
    ? plantillas.find(p => p.id === selectedPlantillaId)
    : null;

  // Crear columnas dinámicamente basadas en si hay plantilla seleccionada
  const columns: ColumnDef<Deudor>[] = [
    createBasicColumn({
      key: 'cuil',
      title: 'CUIL',
      render: value => {
        const formattedCuil = formatCuil(value as string);
        return (
          <span
            className="underline cursor-pointer hover:text-success"
            title="Click para copiar CUIL"
            onClick={() => copyCellValueToClipboard(value as string, 'CUIL')}
          >
            {formattedCuil}
          </span>
        );
      },
    }),
    createBasicColumn({
      key: 'nombre',
      title: 'Nombre',
      width: 200,
    }),
    {
      accessorKey: 'acreedor.nombre',
      header: 'Acreedor',
      size: 150,
    },
    createBasicColumn({
      key: 'numeroCredito',
      title: 'N° Crédito',
      width: 120,
      align: 'center',
      render: value => (
        <span
          className="underline cursor-pointer hover:text-success"
          title="Click para copiar N° Crédito"
          onClick={() => copyCellValueToClipboard(value.toString(), 'N° Crédito')}
        >
          {value.toString()}
        </span>
      ),
    }),
    createBasicColumn({
      key: 'deudaActual',
      title: 'Deuda Actual',
      width: 130,
      align: 'right',
      render: value => (
        <span className="font-mono text-success">
          ${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      ),
    }),
    createBasicColumn({
      key: 'deudaCancelatoria',
      title: 'Deuda Cancelatoria',
      width: 150,
      align: 'right',
      render: value => (
        <span className="font-mono text-warning">
          ${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      ),
    }),
    createActionColumn({
      title: 'Acciones',
      width: 120,
      render: deudor => {
        // Usar plantilla seleccionada o la primera disponible, fallback a template por defecto
        let bcc: string[];
        let subject: string;
        let message: string;

        const plantillaToUse = selectedPlantilla || (plantillas.length > 0 ? plantillas[0] : null);

        if (plantillaToUse) {
          const processed = processPlantillaForDeudor(plantillaToUse, deudor);
          bcc = processed.bcc;
          subject = processed.subject;
          message = processed.body;
        } else {
          // Fallback al template por defecto solo si no hay plantillas
          bcc = ['micaelarecabarren94@gmail.com'];
          subject = `${deudor.nombre} - PRESTAMOS EN ATRASO ⚠️ - ADELANTOS.COM - TEM`;
          message = createMessage(deudor);
        }

        const onSendEmail = () => {
          sendEmail({
            to: [deudor.email],
            bcc,
            subject,
          });
        };

        return (
          <div className="flex gap-1">
            <button
              className="btn btn-ghost btn-xs text-xl"
              title="Enviar Mail"
              onClick={onSendEmail}
            >
              📨
            </button>
            <button
              className="btn btn-ghost btn-xs text-xl"
              title="Copiar Mensaje"
              onClick={() => copyMessageToClipboard(message)}
            >
              📄
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-4">
          <h3 className="text-3xl font-semibold">
            Lista de Deudores ({deudores.length} registros)
          </h3>

          {/* Dropdown de selección de plantilla */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm font-medium whitespace-nowrap">Plantilla:</label>
            {isLoadingPlantillas ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : plantillas.length === 0 ? (
              <div className="text-sm text-base-content/60 italic">
                No hay plantillas configuradas
              </div>
            ) : (
              <select
                className="select select-bordered select-sm w-full md:w-64"
                value={selectedPlantillaId || plantillas[0]?.id || ''}
                onChange={e => onPlantillaChange?.(e.target.value)}
              >
                {plantillas.map(plantilla => (
                  <option key={plantilla.id} value={plantilla.id}>
                    {plantilla.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Indicador de plantilla seleccionada */}
        {selectedPlantilla && (
          <div className="alert alert-info mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <div className="font-semibold">Usando plantilla: {selectedPlantilla.name}</div>
              <div className="text-sm">Asunto: {selectedPlantilla.subject}</div>
            </div>
          </div>
        )}

        <Table enableFiltering enablePagination enableSorting columns={columns} data={deudores} />
      </div>
    </div>
  );
};
export default TablaDeudores;
