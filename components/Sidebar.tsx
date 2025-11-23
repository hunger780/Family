import React from 'react';
import { Home, Network, Users, MessageCircle, UserCircle, LogOut, Heart, Image as ImageIcon } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, userName }) => {
  const menuItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'Home', icon: <Home size={20} /> },
    { id: 'GRAPH', label: 'Family Tree', icon: <Network size={20} /> },
    { id: 'GROUP', label: 'Family Group', icon: <Users size={20} /> },
    { id: 'TIMELINE', label: 'Memories', icon: <ImageIcon size={20} /> },
    { id: 'CHATS', label: 'Family Chats', icon: <MessageCircle size={20} /> },
    { id: 'PROFILE', label: 'My Profile', icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-600/20">
          <Heart className="text-white fill-white" size={16} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Family</h1>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={`${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500 truncate">Online</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};