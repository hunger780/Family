import React, { useState, useEffect } from 'react';
import { GraphNode, Family } from '../types';
import { X, User, Sparkles, Trash2, Edit2, Save, Users, MapPin, Briefcase, Calendar, ShieldCheck, Mail, Check } from 'lucide-react';
import { generateBio } from '../services/geminiService';
import { WelcomeLetterModal } from './WelcomeLetterModal';

interface ProfilePanelProps {
  node: GraphNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedNode: GraphNode) => void;
  onDelete: (nodeId: string) => void;
  families: Family[];
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ node, isOpen, onClose, onUpdate, onDelete, families }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNode, setEditedNode] = useState<GraphNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    setEditedNode(node);
    setIsEditing(false);
  }, [node]);

  if (!node || !isOpen) return null;

  const handleGenerateBio = async () => {
    if (!editedNode) return;
    setIsGenerating(true);
    const newBio = await generateBio(editedNode.name, editedNode.relationLabel);
    setEditedNode(prev => prev ? { ...prev, bio: newBio } : null);
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (editedNode) {
      onUpdate(editedNode);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove ${node.name} from the family tree?`)) {
      onDelete(node.id);
      onClose();
    }
  };

  const toggleFamily = (familyId: string) => {
    if (!editedNode) return;
    const currentIds = editedNode.familyIds || [];
    let newIds;
    if (currentIds.includes(familyId)) {
      newIds = currentIds.filter(id => id !== familyId);
    } else {
      newIds = [...currentIds, familyId];
    }
    setEditedNode({ ...editedNode, familyIds: newIds });
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-slate-800/95 backdrop-blur-md border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Family Profile</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg border-2 border-slate-700 ${node.generation === 0 ? 'bg-pink-500' : 'bg-slate-600'}`}>
                {node.name.charAt(0).toUpperCase()}
              </div>
              {node.isCloseFamily && !isEditing && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-800" title="Close Family Member">
                  <ShieldCheck size={14} />
                </div>
              )}
            </div>
            
            {isEditing && editedNode ? (
              <input 
                className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-center font-bold text-xl w-full focus:outline-none focus:border-pink-500"
                value={editedNode.name}
                onChange={(e) => setEditedNode({...editedNode, name: e.target.value})}
              />
            ) : (
               <h3 className="text-2xl font-bold text-white text-center">{node.name}</h3>
            )}
            
            {isEditing && editedNode ? (
               <input 
                 className="bg-slate-700 border border-slate-600 text-slate-300 rounded px-2 py-1 text-center text-sm mt-2 w-2/3 focus:outline-none focus:border-pink-500"
                 placeholder="Relation label (e.g. Dad)"
                 value={editedNode.relationLabel || ''}
                 onChange={(e) => setEditedNode({...editedNode, relationLabel: e.target.value})}
               />
            ) : (
              <span className="text-pink-400 font-medium mt-1">{node.relationLabel}</span>
            )}

            {!isEditing && (
              <button 
                onClick={() => setShowWelcomeModal(true)}
                className="mt-4 text-xs flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-500/30 transition-colors"
              >
                <Mail size={12} />
                Send Welcome Letter
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Permissions / Close Family Toggle */}
            {isEditing && editedNode && (
              <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-900/50">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      <ShieldCheck size={16} />
                      <span>Close Family Member</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Grants privileges to view private photos.</p>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={editedNode.isCloseFamily || false}
                      onChange={(e) => setEditedNode({...editedNode, isCloseFamily: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </div>
                </label>
              </div>
            )}

            {/* Families Selection in Edit Mode */}
            {isEditing && editedNode && (
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 mb-3 text-sm uppercase tracking-wider font-semibold">
                  <Users size={16} />
                  <span>Belongs to Families</span>
                </div>
                <div className="space-y-2">
                  {families.filter(f => f.id !== 'all').map(family => (
                    <div 
                      key={family.id}
                      onClick={() => toggleFamily(family.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${
                        editedNode.familyIds?.includes(family.id) 
                          ? 'bg-indigo-600/20 border-indigo-500/30' 
                          : 'bg-slate-800 border-transparent hover:border-slate-600'
                      }`}
                    >
                      <span className={`text-sm ${editedNode.familyIds?.includes(family.id) ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {family.name}
                      </span>
                      {editedNode.familyIds?.includes(family.id) && (
                        <Check size={14} className="text-indigo-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View Mode Family Chips */}
            {!isEditing && node.familyIds && node.familyIds.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {node.familyIds.map(fid => {
                   const fam = families.find(f => f.id === fid);
                   return fam ? (
                     <span key={fid} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full border border-slate-600">
                       {fam.name}
                     </span>
                   ) : null;
                 })}
               </div>
            )}

            {/* Info Grid */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 grid grid-cols-2 gap-4">
               <div>
                  <span className="text-xs text-slate-500 block mb-1">Age</span>
                  {isEditing && editedNode ? (
                     <input 
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300 text-sm"
                      value={editedNode.age || ''}
                      placeholder="e.g. 35"
                      onChange={(e) => setEditedNode({...editedNode, age: e.target.value})}
                     />
                  ) : (
                     <span className="text-slate-300 text-sm flex items-center gap-1"><Calendar size={12}/> {node.age || 'N/A'}</span>
                  )}
               </div>
               <div>
                  <span className="text-xs text-slate-500 block mb-1">Occupation</span>
                  {isEditing && editedNode ? (
                     <input 
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300 text-sm"
                      value={editedNode.occupation || ''}
                      placeholder="e.g. Engineer"
                      onChange={(e) => setEditedNode({...editedNode, occupation: e.target.value})}
                     />
                  ) : (
                     <span className="text-slate-300 text-sm flex items-center gap-1"><Briefcase size={12}/> {node.occupation || 'N/A'}</span>
                  )}
               </div>
               <div className="col-span-2">
                  <span className="text-xs text-slate-500 block mb-1">Location</span>
                  {isEditing && editedNode ? (
                     <input 
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300 text-sm"
                      value={editedNode.location || ''}
                      placeholder="e.g. New York, USA"
                      onChange={(e) => setEditedNode({...editedNode, location: e.target.value})}
                     />
                  ) : (
                     <span className="text-slate-300 text-sm flex items-center gap-1"><MapPin size={12}/> {node.location || 'N/A'}</span>
                  )}
               </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 mb-3 text-sm uppercase tracking-wider font-semibold">
                <User size={16} />
                <span>About</span>
              </div>
              
              {isEditing && editedNode ? (
                <div className="space-y-3">
                   <textarea 
                      className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-slate-300 text-sm h-32 focus:outline-none focus:border-pink-500"
                      value={editedNode.bio}
                      onChange={(e) => setEditedNode({...editedNode, bio: e.target.value})}
                   />
                   <button 
                    onClick={handleGenerateBio}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-xs bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 px-3 py-1.5 rounded-lg transition-colors w-fit border border-pink-500/30"
                   >
                     <Sparkles size={14} />
                     {isGenerating ? "Thinking..." : "Auto-generate Bio"}
                   </button>
                </div>
              ) : (
                 <p className="text-slate-300 leading-relaxed text-sm italic">
                   "{node.bio || "No details added yet."}"
                 </p>
              )}
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
               <div className="flex items-center gap-2 text-slate-400 mb-3 text-sm uppercase tracking-wider font-semibold">
                  <Users size={16} />
                  <span>Tree Position</span>
               </div>
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                     <span className="block text-slate-500 text-xs">Generation</span>
                     <span className="text-slate-300 font-mono">
                       {node.generation === 0 ? "Current (0)" : node.generation > 0 ? `+${node.generation} (Descendant)` : `${node.generation} (Ancestor)`}
                     </span>
                  </div>
                  <div>
                     <span className="block text-slate-500 text-xs">Access Level</span>
                     <span className={`font-medium ${node.isCloseFamily ? 'text-emerald-400' : 'text-slate-400'}`}>
                       {node.isCloseFamily ? 'Close Family' : 'Extended Family'}
                     </span>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700 flex gap-4 mb-20 md:mb-10">
             {isEditing ? (
               <>
                 <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                 >
                   <Save size={18} />
                   Save
                 </button>
                 <button 
                  onClick={() => { setIsEditing(false); setEditedNode(node); }}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
               </>
             ) : (
               <>
                 <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                 >
                   <Edit2 size={18} />
                   Edit Profile
                 </button>
                 <button 
                  onClick={handleDelete}
                  className="px-4 py-2.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded-lg transition-colors"
                  title="Remove Member"
                 >
                   <Trash2 size={18} />
                 </button>
               </>
             )}
          </div>
        </div>
      </div>

      <WelcomeLetterModal 
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        recipient={node}
        senderName="Me" // In a real app, pass the logged-in user's name
      />
    </>
  );
};