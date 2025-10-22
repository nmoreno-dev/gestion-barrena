import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, FileText } from 'lucide-react';
import { useAppForm, fieldContext, formContext } from '@/common/hooks';
import { SubmitButton } from '@/common/components/Form/Atoms/SubmitButton';
import TextField from '@/common/components/Form/Atoms/TextInput';
import { useCreatePlantilla } from '../queries/plantillasQueries';
import { AVAILABLE_TEMPLATE_VARIABLES } from '../interfaces/plantilla';
import type { CreatePlantillaData } from '../interfaces/plantilla';
import PlantillaPreview from './PlantillaPreview';
import { PlantillasAccordion } from './PlantillasAccordion';

function PlantillaForm() {
  const navigate = useNavigate();
  const createPlantillaMutation = useCreatePlantilla();

  const form = useAppForm({
    defaultValues: {
      name: '',
      body: '',
    } as CreatePlantillaData,
    onSubmit: async ({ value }: { value: CreatePlantillaData }) => {
      try {
        await createPlantillaMutation.mutateAsync(value);
        navigate({ to: '/plantillas' });
      } catch (error) {
        console.error('Error al crear plantilla:', error);
      }
    },
  });

  // Insertar variable en el cursor del textarea
  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('body') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = form.getFieldValue('body') || '';
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);

      form.setFieldValue('body', newValue);

      // Restaurar cursor después de la variable insertada
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/plantillas' })}
            className="btn btn-ghost btn-sm"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div>
            <h1 className="text-3xl font-bold">Nueva Plantilla</h1>
            <p className="text-base-content/60">
              Crea una nueva plantilla de mensaje personalizable
            </p>
          </div>
        </div>
      </div>

      {/* Acordeón instructivo */}
      <PlantillasAccordion />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="space-y-6">
          <formContext.Provider value={form}>
            <form
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title">
                    <FileText className="w-5 h-5" />
                    Información de la Plantilla
                  </h2>

                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }: { value: string }) => {
                        if (!value) return 'El nombre es requerido';
                        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                        if (value.length > 100) return 'El nombre no puede exceder 100 caracteres';
                        return undefined;
                      },
                    }}
                  >
                    {field => (
                      <fieldContext.Provider value={field}>
                        <TextField
                          label="Nombre de la plantilla"
                          placeholder="Ej: Recordatorio de pago, Notificación legal..."
                          description="Un nombre descriptivo para identificar fácilmente esta plantilla"
                        />
                      </fieldContext.Provider>
                    )}
                  </form.Field>

                  <form.Field
                    name="body"
                    validators={{
                      onChange: ({ value }: { value: string }) => {
                        if (!value) return 'El contenido es requerido';
                        if (value.length < 10)
                          return 'El contenido debe tener al menos 10 caracteres';
                        if (value.length > 5000)
                          return 'El contenido no puede exceder 5000 caracteres';
                        return undefined;
                      },
                    }}
                  >
                    {
                      // TODO: Mandar este text area a la carpeta form/atoms
                      field => (
                        <div className="form-control">
                          <label htmlFor="body" className="label">
                            <span className="label-text font-semibold text-base-content text-xl mb-1">
                              Contenido del mensaje
                            </span>
                          </label>
                          <textarea
                            id="body"
                            className={`textarea textarea-bordered w-full h-40 ${
                              field.state.meta.errors.length > 0 && field.state.meta.isTouched
                                ? 'textarea-error'
                                : ''
                            }`}
                            placeholder="Escribe aquí el contenido de tu plantilla. Haz clic en las variables de abajo para insertarlas automáticamente..."
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors.length > 0 && field.state.meta.isTouched && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {field.state.meta.errors.join(', ')}
                              </span>
                            </label>
                          )}

                          {/* Variables como chips */}
                          <div className="mt-4">
                            <label className="label">
                              <span className="label-text font-medium">Variables disponibles:</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {AVAILABLE_TEMPLATE_VARIABLES.map(variable => (
                                <button
                                  key={variable.variable}
                                  type="button"
                                  className="btn btn-xs btn-outline btn-primary hover:btn-primary"
                                  onClick={() => insertVariable(variable.variable)}
                                  title={variable.description}
                                >
                                  <code className="text-xs font-mono">{variable.variable}</code>
                                </button>
                              ))}
                            </div>
                            <label className="label">
                              <span className="label-text-alt text-gray-500">
                                Haz clic en cualquier variable para insertarla en la posición del
                                cursor
                              </span>
                            </label>
                          </div>
                        </div>
                      )
                    }
                  </form.Field>
                </div>
              </div>

              <div className="flex gap-4">
                <SubmitButton label="Crear Plantilla" />
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={() => navigate({ to: '/plantillas' })}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </formContext.Provider>
        </div>

        {/* Preview siempre visible */}
        <div className="space-y-6">
          <form.Subscribe selector={state => [state.values.name, state.values.body]}>
            {([currentName, currentBody]) => (
              <PlantillaPreview name={currentName || ''} body={currentBody || ''} />
            )}
          </form.Subscribe>
        </div>
      </div>
    </div>
  );
}

export default PlantillaForm;
