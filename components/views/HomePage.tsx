import React from 'react';
import { GraphNode } from '../../types';
import { Calendar, Activity, Star, Clock } from 'lucide-react';

interface HomePageProps {
  userNode: GraphNode;
  totalMembers: number;
}

export const HomePage: React.FC<HomePageProps> = ({ userNode, totalMembers }) => {
  return (
    <div className="flex-1 h-full bg-slate-900 overflow-y-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userNode.name} 👋</h1>
        <p className="text-slate-400">Here's what's happening in your family today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
              <Activity size={20} />
            </div>
            <h3 className="text-slate-200 font-semibold">Total Members</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalMembers}</p>
          <p className="text-sm text-slate-500 mt-2">+2 added this month</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Calendar size={20} />
            </div>
            <h3 className="text-slate-200 font-semibold">Upcoming Events</h3>
          </div>
          <p className="text-3xl font-bold text-white">2</p>
          <p className="text-sm text-slate-500 mt-2">Birthdays this week</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Star size={20} />
            </div>
            <h3 className="text-slate-200 font-semibold">Memories</h3>
          </div>
          <p className="text-3xl font-bold text-white">14</p>
          <p className="text-sm text-slate-500 mt-2">New photos shared</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            {[
              { user: 'Arthur', action: 'added a new photo', time: '2 hours ago', color: 'bg-blue-500' },
              { user: 'Molly', action: 'updated her bio', time: '5 hours ago', color: 'bg-purple-500' },
              { user: 'Ginny', action: 'commented on "Vacation 2024"', time: '1 day ago', color: 'bg-pink-500' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold shrink-0`}>
                  {item.user.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
            <p className="text-indigo-200 mb-6 text-sm leading-relaxed">
              Adding more details about yourself helps build a richer history for future generations. You haven't added your birthplace yet.
            </p>
            <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors">
              Edit Profile
            </button>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};