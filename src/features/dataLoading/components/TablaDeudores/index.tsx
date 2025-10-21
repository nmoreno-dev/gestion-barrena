import { Deudor } from '../../interfaces/deudor';
import {
  Table,
  createBasicColumn,
  createActionColumn,
  type ColumnDef,
} from '@/common/components/Table/exports';
import { toast } from '@/utils/toast';
import { copyToClipboard } from '@/utils/clipboard';
import { createMessage, sendEmail } from '../../utils';
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
  createBasicColumn({
    key: 'email',
    title: 'Email',
    width: 180,
    render: value => (
      <a href={`mailto:${value as string}`} className="link link-primary">
        {value as string}
      </a>
    ),
  }),
  createBasicColumn({
    key: 'telefono',
    title: 'Teléfono',
    width: 120,
    render: value => (
      <a href={`tel:${value as string}`} className="link">
        {value as string}
      </a>
    ),
  }),
  {
    accessorKey: 'acreedor.nombreCortoBanco',
    header: 'Banco',
    cell: ({ getValue }) => (
      <span className="badge badge-outline text-xs">{getValue() as string}</span>
    ),
    size: 150,
  },
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
      const bcc = ['micaelarecabarren94@gmail.com'];
      const subject = `${deudor.nombre} - PRESTAMOS EN ATRASO ⚠️ - ADELANTOS.COM - TEM`;
      const message = createMessage(deudor);
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

const TablaDeudores = ({ deudores }: { deudores: Deudor[] }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Lista de Deudores ({deudores.length} registros)</h3>
          {deudores.length > 0 && (
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Deuda Actual</div>
                <div className="stat-value text-success">
                  $
                  {deudores
                    .reduce((sum, d) => sum + d.deudaActual, 0)
                    .toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Total Cancelatoria</div>
                <div className="stat-value text-warning">
                  $
                  {deudores
                    .reduce((sum, d) => sum + d.deudaCancelatoria, 0)
                    .toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Table enableFiltering enablePagination enableSorting columns={columns} data={deudores} />
    </div>
  );
};
export default TablaDeudores;
