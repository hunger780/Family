import React from 'react';
import { Home, Network, Users, MessageCircle, UserCircle, Image as ImageIcon, Calendar } from 'lucide-react';
import { ViewType } from '../types';

interface MobileNavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ currentView, setView }) => {
  const menuItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'Home', icon: <Home size={20} /> },
    { id: 'GRAPH', label: 'Tree', icon: <Network size={20} /> },
    { id: 'EVENTS', label: 'Events', icon: <Calendar size={20} /> },
    { id: 'CHATS', label: 'Chat', icon: <MessageCircle size={20} /> },
    { id: 'TIMELINE', label: 'Memories', icon: <ImageIcon size={20} /> },
    { id: 'GROUP', label: 'People', icon: <Users size={20} /> },
    { id: 'PROFILE', label: 'Me', icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-2 pb-2">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2 px-1 gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center min-w-[4rem] p-2 rounded-lg transition-colors ${
              currentView === item.id ? 'text-pink-500 bg-pink-500/10' : 'text-slate-500'
            }`}
          >
            <div className={`mb-1 ${currentView === item.id ? 'text-pink-500' : 'text-slate-400'}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
