import React from 'react';

interface TabBarProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 border-b border-sage/30 mb-6 overflow-x-auto">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => onTabChange(idx)}
          className={`px-4 py-3 font-medium text-sm transition whitespace-nowrap ${
            activeTab === idx
              ? 'text-sage border-b-2 border-sage'
              : 'text-gray-400 hover:text-charcoal border-b-2 border-transparent'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
