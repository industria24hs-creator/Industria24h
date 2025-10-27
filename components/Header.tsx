
import React from 'react';
import { StudioIcon } from './icons';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const NavLink: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  const activeClasses = 'text-white border-b-2 border-lime-400';
  const inactiveClasses = 'text-gray-400 hover:text-white transition-colors';
  return (
    <button onClick={onClick} className={`py-2 px-3 text-sm font-medium ${isActive ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-zinc-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          <StudioIcon />
          <h1 className="text-xl font-bold text-white">
            Studio Andreia AI
          </h1>
        </div>

        {/* Middle Nav */}
        <nav className="hidden md:flex items-center space-x-4">
          <NavLink isActive={activeTab === AppTab.GENERATE_IMAGE} onClick={() => setActiveTab(AppTab.GENERATE_IMAGE)}>
            {AppTab.GENERATE_IMAGE}
          </NavLink>
          <NavLink isActive={activeTab === AppTab.EDIT_IMAGE} onClick={() => setActiveTab(AppTab.EDIT_IMAGE)}>
            {AppTab.EDIT_IMAGE}
          </NavLink>
          <NavLink isActive={activeTab === AppTab.GENERATE_VIDEO} onClick={() => setActiveTab(AppTab.GENERATE_VIDEO)}>
            {AppTab.GENERATE_VIDEO}
          </NavLink>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Login</button>
          <button className="bg-lime-400 text-black text-sm font-bold py-2 px-4 rounded-md hover:bg-lime-500 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
       {/* Mobile Nav */}
       <nav className="md:hidden flex items-center justify-around border-t border-zinc-800 py-2">
          <NavLink isActive={activeTab === AppTab.GENERATE_IMAGE} onClick={() => setActiveTab(AppTab.GENERATE_IMAGE)}>
            {AppTab.GENERATE_IMAGE}
          </NavLink>
          <NavLink isActive={activeTab === AppTab.EDIT_IMAGE} onClick={() => setActiveTab(AppTab.EDIT_IMAGE)}>
            {AppTab.EDIT_IMAGE}
          </NavLink>
          <NavLink isActive={activeTab === AppTab.GENERATE_VIDEO} onClick={() => setActiveTab(AppTab.GENERATE_VIDEO)}>
            {AppTab.GENERATE_VIDEO}
          </NavLink>
        </nav>
    </header>
  );
};

export default Header;