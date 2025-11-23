import React, { useState } from 'react';
import { GraphNode, AddNodeFormData } from '../types';
import { generateBio } from '../services/geminiService';
import { X, Sparkles, UserPlus, ShieldCheck } from 'lucide-react';

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddNodeFormData) => void;
  existingNodes: GraphNode[];
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({ isOpen, onClose, onAdd, existingNodes }) => {
  const [formData, setFormData] = useState<AddNodeFormData>({
    name: '',
    relationLabel: '',
    bio: '',
    relatedNodeId: '',
    relationshipType: 'PARENT',
    isCloseFamily: false
  });
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateBio = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const generatedBio = await generateBio(formData.name, formData.relationLabel || 'Family Member');
    setFormData(prev => ({ ...prev, bio: generatedBio }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.relatedNodeId) {
      onAdd(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserPlus className="text-pink-500" />
            Add Family Member
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Grandma Rose"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-700/50">
            <h3 className="text-sm font-medium text-white mb-3">Relationship</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">This person is related to:</label>
                <select 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500 text-sm"
                  value={formData.relatedNodeId}
                  onChange={e => setFormData({...formData, relatedNodeId: e.target.value})}
                >
                  <option value="">-- Select Person --</option>
                  {existingNodes.map(node => (
                    <option key={node.id} value={node.id}>{node.name} ({node.relationLabel || 'Member'})</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2 items-center">
                <span className="text-slate-400 text-sm whitespace-nowrap">as a</span>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500 text-sm"
                  value={formData.relationshipType}
                  onChange={e => setFormData({...formData, relationshipType: e.target.value as any})}
                >
                  <option value="PARENT">Parent (Above)</option>
                  <option value="CHILD">Child (Below)</option>
                  <option value="SPOUSE">Spouse/Partner (Beside)</option>
                  <option value="SIBLING">Sibling (Beside)</option>
                </select>
                <span className="text-slate-400 text-sm whitespace-nowrap">of them.</span>
              </div>

               <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Label (e.g. "Mom", "Brother")</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors text-sm"
                  value={formData.relationLabel}
                  onChange={e => setFormData({...formData, relationLabel: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-900/50">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <ShieldCheck size={16} />
                  <span>Mark as Close Family</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Allows this person to see private family photos.</p>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.isCloseFamily}
                  onChange={(e) => setFormData({...formData, isCloseFamily: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </div>
            </label>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1.5">
               <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio (Optional)</label>
               <button 
                type="button"
                onClick={handleGenerateBio}
                disabled={!formData.name || isGenerating}
                className="text-pink-400 hover:text-pink-300 text-xs flex items-center gap-1 disabled:opacity-50"
               >
                 <Sparkles size={12} />
                 {isGenerating ? 'Generating...' : 'AI Generate'}
               </button>
             </div>
             <textarea 
               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors h-20 resize-none"
               placeholder="A short story about them..."
               value={formData.bio}
               onChange={e => setFormData({...formData, bio: e.target.value})}
             />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={!formData.name || !formData.relatedNodeId}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98]"
            >
              Add to Tree
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};