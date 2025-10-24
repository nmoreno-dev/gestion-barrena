import { useSidebar } from '@/common/hooks';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { PACKAGE_JSON } from '@/app/constants';

interface LayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

export function Layout({ children, sidebarContent }: LayoutProps) {
  const { drawerId } = useSidebar();

  return (
    <div className="drawer">
      {/* Checkbox que controla el estado del drawer */}
      <input id={drawerId} type="checkbox" className="drawer-toggle" />

      {/* Contenido principal */}
      <div className="drawer-content flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4">{children}</main>
        <footer className="mt-auto p-4 text-center bg-base-100 border-t border-base-300">
          <p className="text-sm text-base-content/60">
            Gestión Selena v{PACKAGE_JSON.version} - Hecho con 💕 por{' '}
            <a
              className="link"
              href="https://www.linkedin.com/in/nahuel-moreno-developer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nahuel Moreno
            </a>
          </p>
        </footer>
      </div>

      {/* Sidebar */}
      <Sidebar>{sidebarContent}</Sidebar>
    </div>
  );
}
