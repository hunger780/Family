import React, { useState } from 'react';
import { GraphNode, Photo } from '../../types';
import { Plus, X, Upload, Calendar, Tag, User, Lock, Globe } from 'lucide-react';

interface TimelinePageProps {
  photos: Photo[];
  nodes: GraphNode[];
  onAddPhoto: (photo: Photo) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ photos, nodes, onAddPhoto }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({
    date: new Date().toISOString().split('T')[0],
    taggedNodeIds: [],
    privacy: 'ALL'
  });

  // Sort photos by date descending
  const sortedPhotos = [...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(prev => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (nodeId: string) => {
    setNewPhoto(prev => {
      const currentTags = prev.taggedNodeIds || [];
      if (currentTags.includes(nodeId)) {
        return { ...prev, taggedNodeIds: currentTags.filter(id => id !== nodeId) };
      } else {
        return { ...prev, taggedNodeIds: [...currentTags, nodeId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhoto.url && newPhoto.date && newPhoto.description) {
      onAddPhoto({
        id: Date.now().toString(),
        url: newPhoto.url,
        description: newPhoto.description,
        date: newPhoto.date,
        taggedNodeIds: newPhoto.taggedNodeIds || [],
        privacy: newPhoto.privacy || 'ALL'
      });
      setIsModalOpen(false);
      setNewPhoto({ date: new Date().toISOString().split('T')[0], taggedNodeIds: [], privacy: 'ALL' });
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-900 overflow-y-auto relative">
      <div className="p-8 pb-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Family Memories</h1>
            <p className="text-slate-400">A timeline of cherished moments.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-pink-500/20"
          >
            <Plus size={18} />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      <div className="p-8 pt-0 relative max-w-4xl mx-auto">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 -ml-px"></div>

        {sortedPhotos.length === 0 ? (
          <div className="text-center py-20 text-slate-500 relative z-10">
            <p>No photos yet. Start adding memories!</p>
          </div>
        ) : (
          <div className="space-y-12 pb-12">
            {sortedPhotos.map((photo, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={photo.id} className={`relative flex flex-col md:flex-row gap-8 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-pink-500 rounded-full border-4 border-slate-900 -ml-2 shadow-[0_0_0_4px_rgba(236,72,153,0.2)] z-10"></div>
                  
                  {/* Date Label (Desktop) */}
                  <div className={`hidden md:block w-1/2 text-center text-sm font-bold text-slate-500 ${isEven ? 'text-left pl-8' : 'text-right pr-8'}`}>
                    {new Date(photo.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group">
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                         <img src={photo.url} alt={photo.description} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         
                         {/* Privacy Badge */}
                         {photo.privacy === 'CLOSE_FAMILY' && (
                           <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
                             <Lock size={10} className="text-emerald-400" />
                             <span>Close Family Only</span>
                           </div>
                         )}
                      </div>
                      <div className="p-5">
                         {/* Date Label (Mobile) */}
                         <div className="md:hidden text-xs font-bold text-pink-500 mb-2 uppercase tracking-wide">
                            {new Date(photo.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                         </div>
                         <p className="text-white text-lg font-medium mb-3">{photo.description}</p>
                         
                         {photo.taggedNodeIds.length > 0 && (
                           <div className="flex items-start gap-2 text-sm text-slate-400">
                             <Tag size={16} className="mt-0.5 shrink-0" />
                             <div className="flex flex-wrap gap-2">
                               {photo.taggedNodeIds.map(id => {
                                 const person = nodes.find(n => n.id === id);
                                 return person ? (
                                   <span key={id} className="bg-slate-700/50 px-2 py-0.5 rounded text-pink-200 text-xs border border-slate-600">
                                     @{person.name}
                                   </span>
                                 ) : null;
                               })}
                             </div>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold text-white">Add New Memory</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Photo</label>
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-700/30 transition-colors relative group">
                  {newPhoto.url ? (
                    <div className="relative w-full h-48">
                      <img src={newPhoto.url} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                      <button 
                        type="button" 
                        onClick={() => setNewPhoto(prev => ({...prev, url: ''}))}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="text-slate-500 mb-2 group-hover:text-pink-500 transition-colors" />
                      <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                 <div className="relative">
                   <Calendar className="absolute left-3 top-2.5 text-slate-500" size={18} />
                   <input 
                    type="date"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500 color-scheme-dark"
                    value={newPhoto.date}
                    onChange={e => setNewPhoto({...newPhoto, date: e.target.value})}
                   />
                 </div>
              </div>

              {/* Description */}
              <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                 <textarea 
                   required
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 h-24 resize-none"
                   placeholder="What happened in this moment?"
                   value={newPhoto.description || ''}
                   onChange={e => setNewPhoto({...newPhoto, description: e.target.value})}
                   maxLength={150}
                 />
              </div>

              {/* Privacy Setting */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPhoto(prev => ({...prev, privacy: 'ALL'}))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${newPhoto.privacy === 'ALL' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                  >
                    <Globe size={16} />
                    <span className="text-sm font-medium">Everyone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPhoto(prev => ({...prev, privacy: 'CLOSE_FAMILY'}))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${newPhoto.privacy === 'CLOSE_FAMILY' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                  >
                    <Lock size={16} />
                    <span className="text-sm font-medium">Close Family</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  {newPhoto.privacy === 'CLOSE_FAMILY' 
                    ? "Only members marked as 'Close Family' can see this."
                    : "All family members can see this memory."}
                </p>
              </div>

              {/* Tagging */}
              <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tag Family Members</label>
                 <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
                   {nodes.map(node => (
                     <div 
                       key={node.id} 
                       onClick={() => toggleTag(node.id)}
                       className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${newPhoto.taggedNodeIds?.includes(node.id) ? 'bg-pink-600/20 border border-pink-500/30' : 'hover:bg-slate-800'}`}
                     >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${node.generation === 0 ? 'bg-pink-600' : 'bg-slate-600'}`}>
                          {node.name.charAt(0)}
                        </div>
                        <span className={`text-sm ${newPhoto.taggedNodeIds?.includes(node.id) ? 'text-pink-200' : 'text-slate-300'}`}>{node.name}</span>
                        {newPhoto.taggedNodeIds?.includes(node.id) && <div className="ml-auto w-2 h-2 bg-pink-500 rounded-full"></div>}
                     </div>
                   ))}
                 </div>
              </div>

            </form>
            
            <div className="p-6 border-t border-slate-700 bg-slate-900/50">
               <button 
                onClick={handleSubmit}
                disabled={!newPhoto.url || !newPhoto.description}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98]"
              >
                Save Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};