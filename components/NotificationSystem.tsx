import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  notifications, 
  onMarkAsRead,
  onClearAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateNotification, setAnimateNotification] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimateNotification(true);
      const timer = setTimeout(() => {
        setAnimateNotification(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);
  
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
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-white transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={`notification-badge ${animateNotification ? 'animate-pulse-subtle' : ''}`}>
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 elegant-card z-50 animate-fadeInUp">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-poppins text-blue-400">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={onClearAll}
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
                  onClick={() => onMarkAsRead(notification.id)}
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
  );
};

export default NotificationSystem;