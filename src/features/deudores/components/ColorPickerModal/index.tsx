import cn from 'classnames';
import { Check } from 'lucide-react';

// 10 colores vibrantes de la paleta de Tailwind
const TAILWIND_COLORS = [
  { name: 'Rosa', value: 'pink-500', bg: 'bg-pink-500', border: 'border-pink-500' },
  { name: 'Púrpura', value: 'purple-500', bg: 'bg-purple-500', border: 'border-purple-500' },
  { name: 'Azul', value: 'blue-500', bg: 'bg-blue-500', border: 'border-blue-500' },
  { name: 'Cian', value: 'cyan-500', bg: 'bg-cyan-500', border: 'border-cyan-500' },
  { name: 'Teal', value: 'teal-500', bg: 'bg-teal-500', border: 'border-teal-500' },
  { name: 'Esmeralda', value: 'emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500' },
  { name: 'Lima', value: 'lime-500', bg: 'bg-lime-500', border: 'border-lime-500' },
  { name: 'Ámbar', value: 'amber-500', bg: 'bg-amber-500', border: 'border-amber-500' },
  { name: 'Naranja', value: 'orange-500', bg: 'bg-orange-500', border: 'border-orange-500' },
  { name: 'Rojo', value: 'red-500', bg: 'bg-red-500', border: 'border-red-500' },
] as const;

interface ColorPickerModalProps {
  isOpen: boolean;
  currentColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

export function ColorPickerModal({
  isOpen,
  currentColor,
  onSelectColor,
  onClose,
}: ColorPickerModalProps) {
  if (!isOpen) return null;

  const handleColorSelect = (color: string) => {
    onSelectColor(color);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">🎨 Seleccionar Color</h3>

        {/* Grid de colores */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {TAILWIND_COLORS.map(color => {
            const isSelected = currentColor === color.value;

            return (
              <button
                key={color.value}
                type="button"
                className={cn(
                  'relative w-full aspect-square rounded-lg transition-all duration-200',
                  'hover:scale-110 hover:shadow-lg',
                  color.bg,
                  {
                    'ring-4 ring-base-content ring-offset-2 scale-105': isSelected,
                  },
                )}
                onClick={() => handleColorSelect(color.value)}
                title={color.name}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={24} className="text-white drop-shadow-lg" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Nombre del color seleccionado */}
        <div className="text-center mb-4">
          <span className="text-sm opacity-70">
            Color actual:{' '}
            <span className="font-semibold">
              {TAILWIND_COLORS.find(c => c.value === currentColor)?.name || 'Ninguno'}
            </span>
          </span>
        </div>

        {/* Botón de cerrar */}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export { TAILWIND_COLORS };
