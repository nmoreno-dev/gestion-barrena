import { useSidebar } from '@/common/hooks';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';

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
      </div>

      {/* Sidebar */}
      <Sidebar>{sidebarContent}</Sidebar>
    </div>
  );
}
