import { FileText, Edit, Trash2, Eye } from 'lucide-react';

interface Plantilla {
  id: string;
  name: string;
  subject: string;
  body: string;
  bcc: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface PlantillaCardProps {
  plantilla: Plantilla;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
}

export function PlantillaCard({ plantilla, onEdit, onDelete, onPreview }: PlantillaCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start gap-4">
          {/* Información de la plantilla */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{plantilla.name}</h3>
                <div className="text-sm text-base-content/60">
                  Creada: {plantilla.createdAt.toLocaleDateString('es-AR')} • Actualizada:{' '}
                  {plantilla.updatedAt.toLocaleDateString('es-AR')}
                </div>
              </div>
            </div>

            {/* Preview del asunto */}
            <div className="bg-base-200 rounded-lg p-2 mb-2">
              <div className="text-xs text-base-content/50 mb-1">ASUNTO:</div>
              <div className="text-sm font-medium text-base-content/80 line-clamp-1">
                {plantilla.subject}
              </div>
            </div>

            {/* Preview del contenido */}
            <div className="bg-base-200 rounded-lg p-3 mb-4">
              <div className="text-sm text-base-content/70 line-clamp-2">
                {plantilla.body.substring(0, 150)}
                {plantilla.body.length > 150 && '...'}
              </div>
            </div>

            {/* BCC si existe */}
            {plantilla.bcc && plantilla.bcc.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-base-content/50 mb-1">BCC:</div>
                <div className="flex flex-wrap gap-1">
                  {plantilla.bcc.slice(0, 2).map((email, index) => (
                    <div key={index} className="badge badge-sm badge-ghost">
                      {email}
                    </div>
                  ))}
                  {plantilla.bcc.length > 2 && (
                    <div className="badge badge-sm badge-ghost">+{plantilla.bcc.length - 2}</div>
                  )}
                </div>
              </div>
            )}

            {/* Variables detectadas */}
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-base-content/50">Variables:</span>
              <div className="badge badge-sm badge-outline">[DEUDOR_NOMBRE]</div>
              <div className="badge badge-sm badge-outline">[DEUDA_ACTUAL]</div>
              <div className="badge badge-sm badge-outline">+2 más</div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2">
            <button className="btn btn-ghost btn-sm gap-2" onClick={() => onPreview(plantilla.id)}>
              <Eye size={14} />
              Vista Previa
            </button>
            <button className="btn btn-ghost btn-sm gap-2" onClick={() => onEdit(plantilla.id)}>
              <Edit size={14} />
              Editar
            </button>
            <button
              className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10"
              onClick={() => onDelete(plantilla.id)}
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
