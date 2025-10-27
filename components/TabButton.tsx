
import React from 'react';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => {
  const baseClasses = "flex items-center space-x-2 px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-medium rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500";
  const activeClasses = "bg-gray-800 text-white border-b-2 border-indigo-500";
  const inactiveClasses = "text-gray-400 hover:bg-gray-700 hover:text-white";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

export default TabButton;
