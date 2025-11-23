import React, { useState, useEffect } from 'react';
import { GraphNode, Family } from '../types';
import { X, Users, Check, Search, Save, Trash2, Plus } from 'lucide-react';

interface ManageFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (familyId: string | null, name: string, memberIds: string[]) => void;
  onDelete: (familyId: string) => void;
  family: Family | null; // null if creating a new family
  allNodes: GraphNode[];
}

export const ManageFamilyModal: React.FC<ManageFamilyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  family,
  allNodes,
}) => {
  const [name, setName] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (family) {
        setName(family.name);
        // Find all nodes that have this family's ID
        const members = allNodes
          .filter(n => n.familyIds.includes(family.id))
          .map(n => n.id);
        setSelectedMemberIds(members);
      } else {
        setName('');
        setSelectedMemberIds([]);
      }
      setSearchTerm('');
    }
  }, [isOpen, family, allNodes]);

  const handleToggleMember = (nodeId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(family ? family.id : null, name.trim(), selectedMemberIds);
    onClose();
  };

  const handleDelete = () => {
    if (family && confirm(`Are you sure you want to delete the family "${family.name}"? This will not delete the people, only the group.`)) {
      onDelete(family.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  const filteredNodes = allNodes.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (node.relationLabel && node.relationLabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {family ? <Users className="text-pink-500" /> : <Plus className="text-pink-500" />}
            {family ? 'Configure Family' : 'Create New Family'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Family Name</label>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
              placeholder="e.g. The Smiths, Vacation Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Members Selection */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-80">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <div className="flex justify-between items-center mb-3">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                   Select Members ({selectedMemberIds.length})
                 </label>
                 <div className="flex gap-2 text-xs">
                    <button 
                      type="button"
                      onClick={() => setSelectedMemberIds(allNodes.map(n => n.id))}
                      className="text-pink-400 hover:text-pink-300"
                    >
                      All
                    </button>
                    <span className="text-slate-600">|</span>
                    <button 
                      type="button"
                      onClick={() => setSelectedMemberIds([])}
                      className="text-slate-400 hover:text-slate-300"
                    >
                      None
                    </button>
                 </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="Search people..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredNodes.length > 0 ? (
                filteredNodes.map(node => {
                  const isSelected = selectedMemberIds.includes(node.id);
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleToggleMember(node.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${
                        isSelected 
                          ? 'bg-pink-600/20 border-pink-500/30' 
                          : 'hover:bg-slate-800 border-transparent'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                        isSelected ? 'bg-pink-600' : 'bg-slate-700'
                      }`}>
                        {node.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {node.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{node.relationLabel || 'Member'}</p>
                      </div>
                      {isSelected && <Check size={16} className="text-pink-400" />}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No people found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl flex gap-3">
          {family && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded-lg transition-colors"
              title="Delete Family"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {family ? 'Save Changes' : 'Create Family'}
          </button>
        </div>
      </div>
    </div>
  );
};
