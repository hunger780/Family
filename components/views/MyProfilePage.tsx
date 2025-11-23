import React, { useState } from 'react';
import { GraphNode } from '../../types';
import { User, MapPin, Calendar, Briefcase, Heart, Save } from 'lucide-react';

interface MyProfilePageProps {
  userNode: GraphNode;
  onUpdate: (updatedNode: GraphNode) => void;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({ userNode, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: userNode.name,
    age: userNode.age || '',
    gender: userNode.gender || '',
    location: userNode.location || '',
    occupation: userNode.occupation || '',
    bio: userNode.bio,
    relationLabel: userNode.relationLabel || 'Self'
  });
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...userNode,
      ...formData
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 h-full bg-slate-900 overflow-y-auto p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-32 bg-gradient-to-r from-pink-600 to-indigo-600 relative">
             <div className="absolute -bottom-12 left-8 w-24 h-24 bg-slate-900 rounded-full p-1.5">
               <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-white/10">
                 {formData.name.charAt(0).toUpperCase()}
               </div>
             </div>
          </div>
          
          <div className="pt-16 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="What do you do?"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
                      value={formData.occupation}
                      onChange={e => setFormData({...formData, occupation: e.target.value})}
                    />
                  </div>
                </div>

                 <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input 
                      type="number" 
                      placeholder="Age"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <select
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500 appearance-none"
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="City, Country"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                 <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bio</label>
                  <textarea 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-pink-500 h-32"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
                  <p className="text-xs text-slate-500 mt-2 text-right">Visible to family members</p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-pink-500/20 active:scale-95"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                {isSaved && (
                  <span className="text-emerald-400 text-sm font-medium animate-fade-in">Profile Updated Successfully!</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};