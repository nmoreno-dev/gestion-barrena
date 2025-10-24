import { ReactNode, useState } from 'react';
import cn from 'classnames';
import { Plus, X, Check } from 'lucide-react';
import type { DeudorCollection } from '../../interfaces/collection';

interface DeudoresTabsProps {
  collections: DeudorCollection[];
  activeCollectionId: string | null;
  onTabChange: (collectionId: string) => void;
  onAddTab: () => void;
  onDeleteTab: (collectionId: string) => void;
  onRenameTab: (collectionId: string, newName: string) => void;
  children: ReactNode;
}

export function DeudoresTabs({
  collections,
  activeCollectionId,
  onTabChange,
  onAddTab,
  onDeleteTab,
  onRenameTab,
  children,
}: DeudoresTabsProps) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartEdit = (collection: DeudorCollection) => {
    setEditingTabId(collection.id);
    setEditingName(collection.name);
  };

  const handleConfirmEdit = () => {
    if (editingTabId && editingName.trim()) {
      onRenameTab(editingTabId, editingName.trim());
    }
    setEditingTabId(null);
    setEditingName('');
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

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div role="tablist" className="tabs tabs-lifted w-fit flex flex-wrap">
        {collections.map(collection => {
          const isActive = collection.id === activeCollectionId;
          const isEditing = editingTabId === collection.id;

          return (
            <div
              key={collection.id}
              role="tab"
              className={cn(
                'tab h-12 font-semibold transition-all duration-150 border-primary border-b-3 bg-base-100 rounded-t-xl relative group',
                {
                  'tab-active text-primary border-primary shadow-lg border-b-6': isActive,
                  'hover:text-primary hover:scale-102 hover:shadow-md': !isActive,
                },
              )}
            >
              {isEditing ? (
                <div className="flex items-center gap-1 px-2">
                  📊
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input input-bordered w-32 h-full outline-0"
                    autoFocus
                    onBlur={handleConfirmEdit}
                  />
                  <button
                    className="btn btn-ghost btn-xs text-success"
                    onClick={handleConfirmEdit}
                    title="Confirmar"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={cn('flex items-center gap-2 cursor-pointer px-3', {
                      'opacity-50': !isActive,
                    })}
                    onClick={() => onTabChange(collection.id)}
                    onDoubleClick={() => handleStartEdit(collection)}
                    title="Doble click para editar"
                  >
                    📊 {collection.name}
                  </span>

                  {/* Botón de eliminación (visible solo en tab activa) */}
                  {isActive && collections.length > 1 && (
                    <button
                      className="btn btn-ghost btn-xs text-error opacity-60 hover:opacity-100 ml-2"
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteTab(collection.id);
                      }}
                      title="Eliminar tab"
                    >
                      <X size={14} />
                    </button>
                  )}
                </>
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
      <div className="card bg-base-100 shadow-xl rounded-tl-none border-l-4 border-l-primary">
        <div className="card-body animate-in fade-in duration-300">{children}</div>
      </div>
    </div>
  );
}
