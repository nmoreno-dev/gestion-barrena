// Componente para cargar archivos siguiendo la estetica propuesta de DaisyUI
import React, { forwardRef } from 'react';

type FileInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type FileInputColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

interface FileLoaderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: FileInputSize;
  color?: FileInputColor;
  ghost?: boolean;
  withFieldset?: boolean;
  fieldsetLegend?: string;
  fieldsetLabel?: string;
  className?: string;
}

const FileLoader = forwardRef<HTMLInputElement, FileLoaderProps>(
  (
    {
      size = 'md',
      color,
      ghost,
      withFieldset,
      fieldsetLegend,
      fieldsetLabel,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    // Construir las clases CSS
    const inputClasses = [
      'file-input',
      ghost && 'file-input-ghost',
      size && `file-input-${size}`,
      color && `file-input-${color}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const fileInput = (
      <input ref={ref} type="file" className={inputClasses} disabled={disabled} {...props} />
    );

    // Si se requiere fieldset, envolver el input
    if (withFieldset) {
      return (
        <fieldset className="fieldset">
          {fieldsetLegend && <legend className="fieldset-legend">{fieldsetLegend}</legend>}
          {fileInput}
          {fieldsetLabel && <label className="label">{fieldsetLabel}</label>}
        </fieldset>
      );
    }

    return fileInput;
  },
);

FileLoader.displayName = 'FileLoader';

export default FileLoader;

// Componente con ejemplos de uso
export const FileLoaderExamples = () => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">File Input Básico</h3>
        <FileLoader />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">File Input Ghost</h3>
        <FileLoader ghost />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Con Fieldset y Label</h3>
        <FileLoader withFieldset fieldsetLegend="Pick a file" fieldsetLabel="Max size 2MB" />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Tamaños</h3>
        <div className="space-y-2">
          <FileLoader size="xs" />
          <FileLoader size="sm" />
          <FileLoader size="md" />
          <FileLoader size="lg" />
          <FileLoader size="xl" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Colores</h3>
        <div className="space-y-2">
          <FileLoader color="primary" />
          <FileLoader color="secondary" />
          <FileLoader color="accent" />
          <FileLoader color="neutral" />
          <FileLoader color="info" />
          <FileLoader color="success" />
          <FileLoader color="warning" />
          <FileLoader color="error" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Deshabilitado</h3>
        <FileLoader disabled placeholder="You can't touch this" />
      </div>
    </div>
  );
};
