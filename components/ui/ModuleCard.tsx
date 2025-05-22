import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { ActiveView } from '../../types'; // Assuming ActiveView might be relevant if cards link to views directly

export interface ModuleCardProps {
  title: string;
  description: string;
  iconName: keyof typeof LucideIcons; // Ensure this matches how icons are passed
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, iconName, onClick }) => {
  // Ensure LucideIcons contains the iconName, provide a default if not
  const IconComponent = LucideIcons[iconName] as React.ElementType || LucideIcons.Box; // Default icon

  return (
    <button
      onClick={onClick}
      className="bg-slate-800 hover:bg-slate-700/70 border border-slate-700 p-5 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-sky-500/30 hover:-translate-y-1 clickable-element group"
    >
      <div className="flex items-center mb-3">
        <IconComponent className="h-7 w-7 text-sky-400 group-hover:text-sky-300 transition-colors" />
        <h2 className="ml-3 text-xl font-orbitron font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">{title}</h2>
      </div>
      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{description}</p>
    </button>
  );
};
