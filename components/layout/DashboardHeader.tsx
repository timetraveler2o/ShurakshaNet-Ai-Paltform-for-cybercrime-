import React from 'react';
import { ProfileBadge } from './ProfileBadge';
import { Menu, Bell, Search } from 'lucide-react'; // Added Search and Bell icons

interface DashboardHeaderProps {
  appName: string;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ appName, toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-slate-700/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-lg">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full text-slate-400 hover:text-sky-400 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-sky-500 clickable-element mr-2 md:mr-4"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={22} />
        </button>
        {/* Search Bar - conceptual */}
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="search" 
            placeholder="Search cases, reports..."
            className="bg-slate-700/70 border border-slate-600/50 text-sm text-slate-300 rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        <button 
          className="p-2 rounded-full text-slate-400 hover:text-sky-400 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-sky-500 clickable-element"
          aria-label="Notifications"
          title="Notifications (Conceptual)"
        >
          <Bell size={20} />
          {/* Notification dot example */}
          {/* <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800"></span> */}
        </button>
        <ProfileBadge userName="Operator Delta" userRole="Lead Analyst" />
      </div>
    </header>
  );
};
