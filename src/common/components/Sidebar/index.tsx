import { useSidebar } from '@/common/hooks';
import { X } from 'lucide-react';

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { close } = useSidebar();

  return (
    <div className="drawer-side z-50">
      <label className="drawer-overlay" aria-label="close sidebar" onClick={close} />
      <aside className="min-h-full w-[280px] md:w-[300px] bg-base-200 flex flex-col shadow-xl">
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold">Menú</h2>
          <button
            onClick={close}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Cerrar menú"
          >
            <X size={16} />
          </button>
        </div>

        {/* Contenido del sidebar */}
        <div className="flex-1 p-4 overflow-y-auto">
          {children || (
            <div className="text-center text-base-content/60 mt-8">
              <p>Contenido del sidebar</p>
              <p className="text-sm mt-2">Aquí irán los elementos del menú</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
