import { Menu } from 'lucide-react';
import { useSidebar } from '@/common/hooks';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Gestión Selena' }: HeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 p-4 bg-base-100 border-b border-base-300">
      <button onClick={toggle} className="btn btn-ghost btn-sm btn-square" aria-label="Toggle menu">
        <Menu size={20} />
      </button>
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
    </header>
  );
}
