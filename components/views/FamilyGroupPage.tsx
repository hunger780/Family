import React from 'react';
import { GraphNode } from '../../types';
import { Search } from 'lucide-react';

interface FamilyGroupPageProps {
  nodes: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
}

export const FamilyGroupPage: React.FC<FamilyGroupPageProps> = ({ nodes, onNodeClick }) => {
  return (
    <div className="flex-1 h-full bg-slate-900 overflow-y-auto p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Family Group</h1>
          <p className="text-slate-400">Directory of all {nodes.length} family members.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search family..." 
            className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-pink-500 w-full md:w-64"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nodes.map(node => (
          <div 
            key={node.id}
            onClick={() => onNodeClick(node)}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg ${
                node.generation === 0 ? 'bg-pink-600' : (node.generation < 0 ? 'bg-indigo-600' : 'bg-emerald-600')
              }`}>
                {node.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg group-hover:text-pink-400 transition-colors">{node.name}</h3>
                <p className="text-slate-500 text-sm">{node.relationLabel || 'Family Member'}</p>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
              {node.bio}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-700/50 pt-3">
              <span className="px-2 py-1 bg-slate-700/50 rounded text-slate-400">
                Gen {node.generation === 0 ? 'Current' : node.generation}
              </span>
              {node.age && (
                <span className="px-2 py-1 bg-slate-700/50 rounded text-slate-400">
                  {node.age} yrs
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};