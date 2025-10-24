import { ReactNode, useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Plus, X, Check, Palette, Sheet } from 'lucide-react';
import type { DeudorCollection } from '../../interfaces/collection';
import { ColorPickerModal } from '../ColorPickerModal';

interface DeudoresTabsProps {
  collections: DeudorCollection[];
  activeCollectionId: string | null;
  onTabChange: (collectionId: string) => void;
  onAddTab: () => void;
  onDeleteTab: (collectionId: string) => void;
  onRenameTab: (collectionId: string, newName: string) => void;
  onChangeColor: (collectionId: string, color: string) => void;
  children: ReactNode;
}

export function DeudoresTabs({
  collections,
  activeCollectionId,
  onTabChange,
  onAddTab,
  onDeleteTab,
  onRenameTab,
  onChangeColor,
  children,
}: DeudoresTabsProps) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const editingRef = useRef<HTMLDivElement>(null);

  // Detectar clicks fuera del área de edición
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Solo cerrar si la modal de colores está cerrada
      if (!showColorPicker && editingTabId && editingRef.current) {
        if (!editingRef.current.contains(event.target as Node)) {
          handleConfirmEdit();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingTabId, showColorPicker]);

  const handleStartEdit = (collection: DeudorCollection) => {
    setEditingTabId(collection.id);
    setEditingName(collection.name);
    setSelectedColor(collection.color || 'blue-500');
  };

  const handleConfirmEdit = () => {
    if (editingTabId && editingName.trim()) {
      onRenameTab(editingTabId, editingName.trim());
    }
    setEditingTabId(null);
    setEditingName('');
    setSelectedColor('');
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (editingTabId) {
      onChangeColor(editingTabId, color);
    }
  };

  const handleCancelEdit = () => {
    setEditingTabId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const activeCollection = collections.find(c => c.id === activeCollectionId);

  // Mapeo de colores Tailwind a valores RGB reales
  const colorMap: Record<string, string> = {
    'pink-500': '236, 72, 153',
    'purple-500': '168, 85, 247',
    'blue-500': '59, 130, 246',
    'cyan-500': '6, 182, 212',
    'teal-500': '20, 184, 166',
    'emerald-500': '16, 185, 129',
    'lime-500': '132, 204, 22',
    'amber-500': '245, 158, 11',
    'orange-500': '249, 115, 22',
    'red-500': '239, 68, 68',
  };

  // Color de la colección activa que se aplicará a todos los bordes
  const activeColor = activeCollection?.color || 'blue-500';
  const activeRgbColor = colorMap[activeColor] || colorMap['blue-500'];

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div role="tablist" className={cn('tabs tabs-lifted w-fit flex flex-wrap')}>
        {collections.map(collection => {
          const isActive = collection.id === activeCollectionId;
          const isEditing = editingTabId === collection.id;
          const collectionColor = collection.color || 'blue-500';
          const rgbColor = colorMap[collectionColor] || colorMap['blue-500'];

          return (
            <div
              key={collection.id}
              role="tab"
              className={cn(
                'tab h-12 font-semibold transition-all duration-150 bg-base-100 rounded-t-xl relative group px-3',
                {
                  'tab-active shadow-lg border-b-4': isActive,
                  'hover:shadow-md border-b-2': !isActive,
                },
              )}
              style={{
                color: `rgb(${rgbColor})`,
                borderBottomColor: `rgb(${activeRgbColor})`,
              }}
            >
              {isEditing ? (
                <div className="flex items-center gap-2" ref={editingRef}>
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input input-bordered w-32 h-full outline-0"
                    autoFocus
                  />
                  {/* Botón para abrir selector de colores */}
                  <span className="flex gap-1">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs p-0.5"
                      onClick={e => {
                        e.stopPropagation();
                        setShowColorPicker(true);
                      }}
                      title="Cambiar color"
                    >
                      <Palette size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-success p-0.5"
                      onClick={handleConfirmEdit}
                      title="Confirmar"
                    >
                      <Check size={14} />
                    </button>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className={cn('flex items-center gap-2 cursor-pointer', {
                      'opacity-50': !isActive,
                    })}
                    onClick={() => onTabChange(collection.id)}
                    onDoubleClick={() => handleStartEdit(collection)}
                    title="Doble click para editar"
                  >
                    <Sheet size={20} />
                    {collection.name}
                  </span>

                  <button
                    className="btn btn-ghost btn-xs text-error opacity-60 hover:opacity-100 p-0.5"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteTab(collection.id);
                    }}
                    title={
                      collection.totalRecords > 0
                        ? 'Eliminar tabla y sus datos'
                        : 'Eliminar tabla vacía'
                    }
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Botón para agregar nueva tab */}
        <button
          role="tab"
          className="tab h-12 text-2xl hover:text-primary hover:scale-110 transition-all duration-150 opacity-60 hover:opacity-100"
          onClick={onAddTab}
          title="Agregar nueva tabla"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tab Content */}
      <div
        className="card bg-base-100 shadow-xl rounded-tl-none border-l-4"
        style={{
          borderLeftColor: `rgb(${activeRgbColor})`,
        }}
      >
        <div className="card-body animate-in fade-in duration-300">{children}</div>
      </div>

      {/* Modal de selección de color */}
      <ColorPickerModal
        isOpen={showColorPicker}
        currentColor={selectedColor}
        onSelectColor={handleColorSelect}
        onClose={() => setShowColorPicker(false)}
      />
    </div>
  );
}
