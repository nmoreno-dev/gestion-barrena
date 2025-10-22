import { useSidebar } from '@/common/hooks';
import { Link } from '@tanstack/react-router';
import { X, Home, FileText } from 'lucide-react';

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { close } = useSidebar();

  const navigationItems = [
    {
      to: '/',
      label: 'Inicio',
      icon: Home,
      description: 'Gestión de Deudores',
    },
    {
      to: '/plantillas',
      label: 'Plantillas',
      icon: FileText,
      description: 'Gestión de Plantillas',
    },
  ];

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

        {/* Navegación del sidebar */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="menu w-full bg-base-200 space-y-2">
            {navigationItems.map(item => {
              const IconComponent = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors"
                    activeProps={{
                      className: 'bg-primary text-primary-content hover:bg-primary/90',
                    }}
                    onClick={close}
                  >
                    <IconComponent size={20} />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Contenido adicional si se proporciona */}
          {children && <div className="mt-6 pt-4 border-t border-base-300">{children}</div>}
        </nav>
      </aside>
    </div>
  );
}
