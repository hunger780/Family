import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Smile, ChevronLeft } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>('family');
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  const chats = [
    { id: 'family', name: 'Family Group ❤️', lastMessage: 'Mom: Dinner is at 6pm!', time: '10m', unread: 2, avatar: null, group: true },
    { id: 'mom', name: 'Molly (Mom)', lastMessage: 'Did you see the photo?', time: '1h', unread: 0, avatar: 'M' },
    { id: 'dad', name: 'Arthur (Dad)', lastMessage: 'Fishing trip next week?', time: '3h', unread: 0, avatar: 'A' },
    { id: 'ginny', name: 'Ginny', lastMessage: 'Picking up the kids now', time: '5h', unread: 0, avatar: 'G' },
  ];

  const messages = [
    { id: 1, sender: 'Mom', text: 'Hey everyone! Are we still on for Sunday lunch?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Yes! I will bring the dessert.', time: '10:32 AM', isMe: true },
    { id: 3, sender: 'Dad', text: 'I am making my famous stew.', time: '10:35 AM', isMe: false },
    { id: 4, sender: 'Ginny', text: 'Can we make it 1pm instead of 12?', time: '10:40 AM', isMe: false },
    { id: 5, sender: 'Mom', text: 'Sure, 1pm works. Dinner is at 6pm!', time: '10:45 AM', isMe: false },
  ];

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const activeChatData = chats.find(c => c.id === activeChat);

  return (
    <div className="flex h-full bg-slate-900 overflow-hidden relative">
      {/* Chat List */}
      <div className={`w-full md:w-80 border-r border-slate-800 bg-slate-900 flex flex-col absolute md:static inset-0 z-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors ${activeChat === chat.id ? 'bg-slate-800 md:border-l-2 md:border-pink-500' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${chat.group ? 'bg-pink-600' : 'bg-slate-700'}`}>
                {chat.avatar || <UsersIcon />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-white truncate">{chat.name}</span>
                  <span className="text-xs text-slate-500">{chat.time}</span>
                </div>
                <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full h-full flex flex-col bg-slate-900/50 absolute md:static inset-0 z-10 ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
        {activeChatData ? (
          <>
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToList} className="md:hidden text-slate-400 hover:text-white mr-1">
                  <ChevronLeft size={24} />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${activeChatData.group ? 'bg-pink-600' : 'bg-slate-700'}`}>
                   {activeChatData.avatar || <UsersIcon />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">{activeChatData.name}</h3>
                  <p className="text-xs text-slate-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 text-slate-400">
                <button className="hover:text-white"><Phone size={20} /></button>
                <button className="hover:text-white"><Video size={20} /></button>
                <button className="hover:text-white"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] md:max-w-[70%] ${msg.isMe ? 'bg-pink-600 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-slate-800 text-slate-200 rounded-r-2xl rounded-tl-2xl'} p-3 md:p-4 shadow-md`}>
                    {!msg.isMe && <p className="text-xs font-bold text-pink-400 mb-1">{msg.sender}</p>}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-2 text-right ${msg.isMe ? 'text-pink-200' : 'text-slate-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 md:p-4 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2 border border-slate-700">
                <button className="text-slate-400 hover:text-white"><Smile size={20} /></button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent text-white focus:outline-none text-sm py-1"
                />
                <button className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-slate-500">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
