import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Menu, Settings } from 'lucide-react';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

interface ElegantHeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const ElegantHeader: React.FC<ElegantHeaderProps> = ({ 
  user: initialUser, 
  onLogout,
  onToggleSidebar
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [user, setUser] = useState<User>(() => {
    // Try to get user from localStorage first
    const savedUser = localStorage.getItem('userProfile');
    return savedUser ? JSON.parse(savedUser) : initialUser;
  });
  
  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const savedUser = localStorage.getItem('userProfile');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };
    
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
    };
  }, []);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'System Update',
      message: 'SurakshaNet has been updated to the latest version.',
      type: 'info',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      title: 'Security Alert',
      message: 'Suspicious activity detected. Check security logs.',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    }
  ]);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const handleClearAll = () => {
    setNotifications([]);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'error':
        return 'border-l-4 border-red-500';
      case 'warning':
        return 'border-l-4 border-amber-500';
      case 'success':
        return 'border-l-4 border-emerald-500';
      default:
        return 'border-l-4 border-blue-500';
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center">
            <button 
              onClick={onToggleSidebar}
              className="mr-4 p-1 text-slate-400 hover:text-white md:hidden"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-900 flex items-center justify-center mr-3 shadow-blue-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-subtle-grid opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                <span className="font-poppins text-white text-lg font-bold relative z-10">S</span>
              </div>
              <h1 className="text-xl font-poppins font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent tracking-wide">
                SURAKSHA<span className="text-blue-400">NET</span>
              </h1>
            </div>
          </div>
          
          {/* Navigation - Hidden on Mobile */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Dashboard</a>
            <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Analytics</a>
            <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Reports</a>
            <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Settings</a>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (isProfileOpen) setIsProfileOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-white transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge animate-pulse-subtle">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 elegant-card z-50 animate-fadeInUp">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-poppins text-blue-400">Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleClearAll}
                        className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto pr-2">
                    {notifications.length === 0 ? (
                      <p className="text-center text-slate-400 py-4">No notifications</p>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`mb-3 p-3 bg-slate-800/50 rounded-lg ${getTypeStyles(notification.type)} ${!notification.read ? 'ring-1 ring-blue-500/30' : ''}`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            <span className="text-xs text-slate-400">{formatTime(notification.timestamp)}</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  if (isNotificationsOpen) setIsNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <span className="hidden md:inline-block text-slate-300">{user.name}</span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 elegant-card z-50 animate-fadeInUp">
                  <div className="p-2 border-b border-slate-700/50">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-xs text-blue-400">{user.role}</p>
                  </div>
                  
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        // Navigate to settings with account tab
                        if (window.setActiveView) {
                          window.setActiveView('settings');
                          // Set a timeout to ensure the view has changed before trying to set the tab
                          setTimeout(() => {
                            const accountTab = document.querySelector('[data-tab="account"]');
                            if (accountTab) {
                              (accountTab as HTMLElement).click();
                            }
                          }, 100);
                        }
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-white rounded-md"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => {
                        // Navigate to settings
                        if (window.setActiveView) {
                          window.setActiveView('settings');
                        }
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-white rounded-md"
                    >
                      <div className="flex items-center">
                        <Settings size={14} className="mr-2" />
                        <span>Settings</span>
                      </div>
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ElegantHeader;