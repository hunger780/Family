import React from 'react';
import { GraphNode } from '../../types';
import { Calendar, Activity, Star, Clock } from 'lucide-react';

interface HomePageProps {
  userNode: GraphNode;
  totalMembers: number;
}

export const HomePage: React.FC<HomePageProps> = ({ userNode, totalMembers }) => {
  return (
    <div className="flex-1 h-full bg-slate-900 overflow-y-auto p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {userNode.name} 👋</h1>
        <p className="text-slate-400 text-sm md:text-base">Here's what's happening in your family today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Members Tile */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
              <Activity size={16} />
            </div>
            <h3 className="text-slate-200 font-semibold text-sm">Total Members</h3>
          </div>
          <p className="text-2xl font-bold text-white relative z-10">{totalMembers}</p>
          <p className="text-xs text-slate-500 mt-1 relative z-10">+2 added this month</p>
        </div>

        {/* Upcoming Events Tile */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Calendar size={16} />
            </div>
            <h3 className="text-slate-200 font-semibold text-sm">Upcoming Events</h3>
          </div>
          <p className="text-2xl font-bold text-white relative z-10">2</p>
          <p className="text-xs text-slate-500 mt-1 relative z-10">Birthdays this week</p>
        </div>

        {/* Memories Tile */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Star size={16} />
            </div>
            <h3 className="text-slate-200 font-semibold text-sm">Memories</h3>
          </div>
          <p className="text-2xl font-bold text-white relative z-10">14</p>
          <p className="text-xs text-slate-500 mt-1 relative z-10">New photos shared</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { user: 'Arthur', action: 'added a new photo', time: '2 hours ago', color: 'bg-blue-500' },
              { user: 'Molly', action: 'updated her bio', time: '5 hours ago', color: 'bg-purple-500' },
              { user: 'Ginny', action: 'commented on "Vacation 2024"', time: '1 day ago', color: 'bg-pink-500' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white font-bold shrink-0 text-sm`}>
                  {item.user.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-300 text-sm">
                    <span className="font-semibold text-white">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-700 rounded-xl p-5 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-2">Complete Your Profile</h2>
            <p className="text-indigo-200 mb-4 text-xs md:text-sm leading-relaxed">
              Adding more details about yourself helps build a richer history for future generations. You haven't added your birthplace yet.
            </p>
            <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-semibold text-xs hover:bg-indigo-50 transition-colors">
              Edit Profile
            </button>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl -mr-12 -mb-12 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};