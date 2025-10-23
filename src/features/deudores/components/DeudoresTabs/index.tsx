import { ReactNode, useState } from 'react';
import cn from 'classnames';

interface DeudoresTabsProps {
  children: ReactNode;
}

export function DeudoresTabs({ children }: DeudoresTabsProps) {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div role="tablist" className="tabs tabs-lifted gap-2">
        <button
          role="tab"
          className={cn('tab h-12 font-semibold transition-all duration-300', {
            'tab-active text-primary border-primary shadow-lg scale-105': activeTab === 1,
            'hover:text-primary hover:scale-102 hover:shadow-md opacity-70': activeTab !== 1,
          })}
          onClick={() => setActiveTab(1)}
        >
          <span className="flex items-center gap-2">📊 tab 1</span>
        </button>
        <button
          role="tab"
          className={cn('tab h-12 font-semibold transition-all duration-300', {
            'tab-active text-primary border-primary shadow-lg scale-105': activeTab === 2,
            'hover:text-primary hover:scale-102 hover:shadow-md opacity-70': activeTab !== 2,
          })}
          onClick={() => setActiveTab(2)}
        >
          <span className="flex items-center gap-2">📈 tab 2</span>
        </button>
        <button
          role="tab"
          className="tab h-12 text-2xl hover:text-primary hover:scale-110 transition-all duration-300 opacity-60 hover:opacity-100"
        >
          +
        </button>
      </div>

      {/* Tab Content */}
      <div className="card bg-base-100 shadow-xl rounded-tl-none border-t-0 border-2 border-primary/20">
        <div className="card-body animate-in fade-in duration-300">
          {activeTab === 1 && children}
          {activeTab === 2 && children}
        </div>
      </div>
    </div>
  );
}
