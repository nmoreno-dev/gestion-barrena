import { ReactNode, useState } from 'react';
import cn from 'classnames';
import { Plus } from 'lucide-react';

interface DeudoresTabsProps {
  children: ReactNode;
}

export function DeudoresTabs({ children }: DeudoresTabsProps) {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div role="tablist" className="tabs tabs-liftedw-fit">
        <button
          role="tab"
          className={cn(
            'tab h-12 font-semibold transition-all duration-300 border-primary border-b-3 bg-base-100 rounded-t-xl',
            {
              'tab-active text-primary border-primary shadow-lg border-b-6': activeTab === 1,
              'hover:text-primary hover:scale-102 hover:shadow-md': activeTab !== 1,
            },
          )}
          onClick={() => setActiveTab(1)}
        >
          <span
            className={cn('flex items-center gap-2', {
              'opacity-50': activeTab !== 1,
            })}
          >
            📊 tab 1
          </span>
        </button>
        <button
          role="tab"
          className={cn(
            'tab h-12 font-semibold transition-all duration-150 border-primary border-b-3 bg-base-100 rounded-t-xl',
            {
              'tab-active text-primary border-primary shadow-lg border-b-6': activeTab === 2,
              'hover:text-primary hover:scale-102 hover:shadow-md': activeTab !== 2,
            },
          )}
          onClick={() => setActiveTab(2)}
        >
          <span
            className={cn('flex items-center gap-2', {
              'opacity-50': activeTab !== 2,
            })}
          >
            📊 tab 2
          </span>
        </button>
        <button
          role="tab"
          className="tab h-12 text-2xl hover:text-primary hover:scale-110 transition-all duration-150 opacity-60 hover:opacity-100"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tab Content */}
      <div className="card bg-base-100 shadow-xl rounded-tl-none border-l-4 border-l-primary">
        <div className="card-body animate-in fade-in duration-300">
          {activeTab === 1 && children}
          {activeTab === 2 && children}
        </div>
      </div>
    </div>
  );
}
