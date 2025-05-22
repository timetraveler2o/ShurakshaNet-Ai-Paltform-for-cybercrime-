import React from 'react';
import { UserCircle } from 'lucide-react';

interface ProfileBadgeProps {
  userName: string;
  userRole: string;
  avatarUrl?: string; // Optional
}

export const ProfileBadge: React.FC<ProfileBadgeProps> = ({ userName, userRole, avatarUrl }) => {
  return (
    <button className="flex items-center space-x-2 p-1 pr-2 rounded-full hover:bg-slate-700/50 transition-colors clickable-element group focus:outline-none focus:ring-2 focus:ring-sky-500">
      {avatarUrl ? (
        <img src={avatarUrl} alt={userName} className="h-8 w-8 rounded-full object-cover border-2 border-slate-600 group-hover:border-sky-500 transition-colors" />
      ) : (
        <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center border-2 border-slate-500 group-hover:border-sky-500 transition-colors">
          <UserCircle size={20} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
        </div>
      )}
      <div className="text-left hidden md:block">
        <p className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors truncate max-w-[100px]">{userName}</p>
        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate max-w-[100px]">{userRole}</p>
      </div>
    </button>
  );
};
