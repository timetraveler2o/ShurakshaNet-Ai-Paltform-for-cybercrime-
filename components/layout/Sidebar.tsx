import React from 'react';
import type { ActiveView } from '../../types';
import { LayoutDashboard, ShieldCheck, ScanFace, PersonStanding, MessageCircleQuestion, Video, PhoneCall, MailWarning, Settings, UserCircle, Menu, X, Shield } from 'lucide-react'; // Added Shield for logo
import { DASHBOARD_APP_NAME } from '../../constants';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'dhanrakshak', label: 'DhanRakshak', icon: ShieldCheck },
  { id: 'satyadarpan', label: 'SatyaDarpan', icon: ScanFace },
  { id: 'netratrace', label: 'NetraTrace', icon: PersonStanding },
  { id: 'sahayakcopbot', label: 'Sahayak CopBot', icon: MessageCircleQuestion },
  { id: 'nigraniai', label: 'NigraniAI', icon: Video },
  { id: 'vaanishield', label: 'VaaniShield', icon: PhoneCall },
  { id: 'kavachmailguard', label: 'Kavach MailGuard', icon: MailWarning },
];

const bottomNavItems = [
  // { id: 'settings', label: 'Settings', icon: Settings },
  // { id: 'profile', label: 'Profile', icon: UserCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={toggleSidebar}></div>}

      <aside 
        className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-700/50 shadow-2xl z-40 transition-all duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'}`}
      >
        <div 
            className={`flex items-center h-16 border-b border-slate-700/50 shrink-0 
                        ${isOpen ? 'px-4 justify-between' : 'md:justify-center justify-end px-2'}`}
        >
            {isOpen ? (
                <>
                    <span className="font-orbitron text-xl font-bold text-sky-400">{DASHBOARD_APP_NAME}</span>
                    <button 
                        onClick={toggleSidebar} 
                        className="p-1 rounded-md text-slate-400 hover:text-sky-400 hover:bg-slate-700 md:hidden clickable-element" 
                        aria-label="Close sidebar"
                    >
                        <X size={22} />
                    </button>
                </>
            ) : (
                 // Collapsed state: show logo on desktop, nothing interactable on mobile (w-0)
                <div className="hidden md:flex items-center justify-center w-full h-full">
                     <Shield size={28} className="text-sky-400" />
                </div>
                // The 'X' button is not needed here for mobile as the sidebar is w-0
                // and opening is handled by the main header's menu button.
            )}
        </div>

        <nav className="flex-grow pt-4 space-y-1 overflow-y-auto custom-scrollbar-sidebar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              title={item.label} // Tooltip for collapsed state
              className={`flex items-center w-full text-left py-2.5 rounded-md transition-all duration-200 group clickable-element
                          ${activeView === item.id 
                            ? 'bg-sky-500/20 text-sky-300 border-l-4 border-sky-400 font-medium' 
                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}
                          ${isOpen ? 'px-4' : 'md:px-0 md:justify-center px-4'}`} // px-4 for mobile when collapsed but w-0 to avoid layout shift if width was >0
            >
              <item.icon size={isOpen ? 20 : 24} className={`flex-shrink-0 group-hover:scale-110 transition-transform ${isOpen ? 'mr-3' : 'md:mr-0'}`} />
              {isOpen && <span className="truncate text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={`py-4 border-t border-slate-700/50 space-y-1 shrink-0 ${isOpen ? 'px-4' : 'md:px-0'}`}>
          {bottomNavItems.map(item => (
             <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              title={item.label}
              className={`flex items-center w-full text-left py-2.5 rounded-md transition-colors group clickable-element
                          ${activeView === item.id 
                            ? 'bg-sky-500/10 text-sky-400' 
                            : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'}
                          ${isOpen ? 'px-4' : 'md:justify-center md:px-0 px-4'}`}
            >
              <item.icon size={isOpen ? 20 : 24} className={`flex-shrink-0 group-hover:scale-110 transition-transform ${isOpen ? 'mr-3' : 'md:mr-0'}`} />
              {isOpen && <span className="truncate text-sm">{item.label}</span>}
            </button>
          ))}
        </div>
      </aside>
       <style>{`
        .custom-scrollbar-sidebar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-sidebar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; } /* slate-700 */
        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb:hover { background: #475569; } /* slate-600 */
      `}</style>
    </>
  );
};