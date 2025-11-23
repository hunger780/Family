import React, { useState } from 'react';
import { Event, GraphNode } from '../../types';
import { Plus, X, Calendar, MapPin, Clock, Star, Gift, Edit2, Users, Check } from 'lucide-react';

interface EventsPageProps {
  events: Event[];
  nodes: GraphNode[];
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, nodes, onAddEvent, onUpdateEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    date: new Date().toISOString().split('T')[0],
    type: 'GATHERING',
    invitees: []
  });

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleOpenModal = (eventToEdit?: Event) => {
    if (eventToEdit) {
      setEditingId(eventToEdit.id);
      setEventForm({ ...eventToEdit });
    } else {
      setEditingId(null);
      setEventForm({
        date: new Date().toISOString().split('T')[0],
        type: 'GATHERING',
        invitees: []
      });
    }
    setIsModalOpen(true);
  };

  const toggleInvitee = (nodeId: string) => {
    setEventForm(prev => {
      const currentInvitees = prev.invitees || [];
      if (currentInvitees.includes(nodeId)) {
        return { ...prev, invitees: currentInvitees.filter(id => id !== nodeId) };
      } else {
        return { ...prev, invitees: [...currentInvitees, nodeId] };
      }
    });
  };

  const handleSelectAllInvitees = () => {
    setEventForm(prev => ({ ...prev, invitees: nodes.map(n => n.id) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventForm.title && eventForm.date && eventForm.location) {
      const eventData: Event = {
        id: editingId || Date.now().toString(),
        title: eventForm.title,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        description: eventForm.description || '',
        type: eventForm.type as any,
        invitees: eventForm.invitees || []
      };

      if (editingId) {
        onUpdateEvent(eventData);
      } else {
        onAddEvent(eventData);
      }
      setIsModalOpen(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BIRTHDAY': return <Gift className="text-pink-500" />;
      case 'HOLIDAY': return <Star className="text-yellow-500" />;
      default: return <Calendar className="text-indigo-500" />;
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-900 overflow-y-auto relative">
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Family Events</h1>
            <p className="text-slate-400 text-sm md:text-base">Upcoming gatherings and celebrations.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors shadow-lg shadow-pink-500/20 text-sm md:text-base"
          >
            <Plus size={18} />
            <span>Add Event</span>
          </button>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No upcoming events.</p>
              <button 
                onClick={() => handleOpenModal()}
                className="text-pink-400 hover:text-pink-300 mt-2 text-sm font-medium"
              >
                Plan something new
              </button>
            </div>
          ) : (
            sortedEvents.map(event => (
              <div key={event.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row hover:border-pink-500/30 transition-colors group">
                {/* Date Box */}
                <div className="bg-slate-700/50 p-6 flex flex-col items-center justify-center min-w-[120px] text-center border-b md:border-b-0 md:border-r border-slate-700">
                  <span className="text-3xl font-bold text-white">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-sm font-semibold text-pink-400 uppercase tracking-wider">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    {new Date(event.date).getFullYear()}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 relative">
                  <button 
                    onClick={() => handleOpenModal(event)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                    title="Edit Event"
                  >
                    <Edit2 size={16} />
                  </button>

                  <div className="flex justify-between items-start mb-2 pr-10">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-700/50">
                      {getTypeIcon(event.type)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                    {event.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-slate-500" />
                        {event.time}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-slate-500" />
                      {event.location}
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {event.invitees && event.invitees.length > 0 && (
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                      <div className="flex -space-x-2">
                        {event.invitees.slice(0, 5).map(inviteeId => {
                          const person = nodes.find(n => n.id === inviteeId);
                          return person ? (
                            <div key={inviteeId} className="w-6 h-6 rounded-full bg-slate-600 border border-slate-800 flex items-center justify-center text-[10px] text-white" title={person.name}>
                              {person.name.charAt(0)}
                            </div>
                          ) : null;
                        })}
                        {event.invitees.length > 5 && (
                          <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800 flex items-center justify-center text-[10px] text-white">
                            +{event.invitees.length - 5}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{event.invitees.length} invited</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 shrink-0">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Event' : 'Plan New Event'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Grandma's 80th Birthday"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
                  value={eventForm.title || ''}
                  onChange={e => setEventForm({...eventForm, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 color-scheme-dark"
                    value={eventForm.date}
                    onChange={e => setEventForm({...eventForm, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Time</label>
                  <input 
                    type="time"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 color-scheme-dark"
                    value={eventForm.time || ''}
                    onChange={e => setEventForm({...eventForm, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-slate-500" size={18} />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 123 Family Lane"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
                    value={eventForm.location || ''}
                    onChange={e => setEventForm({...eventForm, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Event Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['GATHERING', 'BIRTHDAY', 'HOLIDAY'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventForm({...eventForm, type: type as any})}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        eventForm.type === type 
                          ? 'bg-pink-600/20 border-pink-500 text-pink-300' 
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 h-24 resize-none"
                  placeholder="Additional details..."
                  value={eventForm.description || ''}
                  onChange={e => setEventForm({...eventForm, description: e.target.value})}
                />
              </div>

              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users size={14} />
                    Invite Family Members
                  </label>
                  <button 
                    type="button"
                    onClick={handleSelectAllInvitees}
                    className="text-xs text-pink-400 hover:text-pink-300"
                  >
                    Select All
                  </button>
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                  {nodes.map(node => (
                    <div 
                      key={node.id}
                      onClick={() => toggleInvitee(node.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        eventForm.invitees?.includes(node.id) 
                          ? 'bg-indigo-600/20 border border-indigo-500/30' 
                          : 'hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                        eventForm.invitees?.includes(node.id) ? 'bg-indigo-500' : 'bg-slate-700'
                      }`}>
                        {node.name.charAt(0)}
                      </div>
                      <span className={`text-sm flex-1 truncate ${
                        eventForm.invitees?.includes(node.id) ? 'text-indigo-200' : 'text-slate-400'
                      }`}>
                        {node.name}
                      </span>
                      {eventForm.invitees?.includes(node.id) && (
                        <Check size={14} className="text-indigo-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 sticky bottom-0 bg-slate-800 pb-2">
                <button 
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98]"
                >
                  {editingId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
