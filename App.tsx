import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNavbar } from './components/MobileNavbar';
import { AuthPage } from './components/AuthPage';
import { ProfilePanel } from './components/ProfilePanel';
import { HomePage } from './components/views/HomePage';
import { FamilyGraphPage } from './components/views/FamilyGraphPage';
import { FamilyGroupPage } from './components/views/FamilyGroupPage';
import { ChatPage } from './components/views/ChatPage';
import { MyProfilePage } from './components/views/MyProfilePage';
import { TimelinePage } from './components/views/TimelinePage';
import { EventsPage } from './components/views/EventsPage';
import { ManageFamilyModal } from './components/ManageFamilyModal';
import { GraphNode, GraphLink, RelationshipType, AddNodeFormData, ViewType, Photo, Event, Family } from './types';
import { ChevronDown, Users, Settings, Plus, Check, X } from 'lucide-react';

const INITIAL_FAMILIES: Family[] = [
  { id: 'all', name: 'All Families' },
  { id: 'f1', name: 'My Household' },
  { id: 'f2', name: 'Parents\' Family' },
  { id: 'f3', name: 'In-Laws' },
];

// Initial Family Tree Data
const INITIAL_NODES: GraphNode[] = [
  { id: '1', name: 'Me', relationLabel: 'Self', bio: 'The center of this universe.', generation: 0, group: 1, age: '28', gender: 'Male', location: 'New York, USA', occupation: 'Software Engineer', isCloseFamily: true, familyIds: ['f1', 'f2', 'f3'] },
  { id: '2', name: 'Arthur', relationLabel: 'Father', bio: 'Hardworking man who loves fishing.', generation: -1, group: 2, age: '62', gender: 'Male', isCloseFamily: true, familyIds: ['f2'] },
  { id: '3', name: 'Molly', relationLabel: 'Mother', bio: 'The best cook in the world.', generation: -1, group: 2, age: '60', gender: 'Female', isCloseFamily: true, familyIds: ['f2'] },
  { id: '4', name: 'Ginny', relationLabel: 'Spouse', bio: 'My partner in crime.', generation: 0, group: 1, age: '27', gender: 'Female', isCloseFamily: true, familyIds: ['f1', 'f3'] },
  { id: '5', name: 'James', relationLabel: 'Son', bio: 'Full of energy and mischief.', generation: 1, group: 3, age: '5', gender: 'Male', isCloseFamily: true, familyIds: ['f1'] },
  { id: '6', name: 'Albus', relationLabel: 'Son', bio: 'Quiet and thoughtful.', generation: 1, group: 3, age: '3', gender: 'Male', isCloseFamily: true, familyIds: ['f1'] },
];

const INITIAL_LINKS: GraphLink[] = [
  { source: '2', target: '1', type: RelationshipType.PARENT_OF }, // Dad -> Me
  { source: '3', target: '1', type: RelationshipType.PARENT_OF }, // Mom -> Me
  { source: '1', target: '4', type: RelationshipType.SPOUSE_OF }, // Me <-> Spouse
  { source: '1', target: '5', type: RelationshipType.PARENT_OF }, // Me -> Son
  { source: '4', target: '5', type: RelationshipType.PARENT_OF }, // Spouse -> Son
  { source: '1', target: '6', type: RelationshipType.PARENT_OF }, // Me -> Son
  { source: '4', target: '6', type: RelationshipType.PARENT_OF }, // Spouse -> Son
];

const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60',
    description: 'Family hiking trip to the mountains.',
    date: '2023-06-15',
    taggedNodeIds: ['1', '2', '3'], // Me, Dad, Mom
    privacy: 'ALL'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=60',
    description: 'James and Albus playing in the park.',
    date: '2024-03-10',
    taggedNodeIds: ['5', '6'], // Kids
    privacy: 'CLOSE_FAMILY'
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Family Reunion BBQ',
    date: '2024-07-20',
    time: '12:00',
    location: 'Central Park',
    description: 'Annual family gathering with food, games, and fun.',
    type: 'GATHERING',
    invitees: ['1', '2', '3', '4', '5', '6']
  },
  {
    id: '2',
    title: 'Dad\'s 63rd Birthday',
    date: '2024-08-15',
    time: '18:00',
    location: 'Arthur\'s House',
    description: 'Dinner and cake to celebrate Dad.',
    type: 'BIRTHDAY',
    invitees: ['2', '3']
  }
];

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [view, setView] = useState<ViewType>('HOME');
  const [families, setFamilies] = useState<Family[]>(INITIAL_FAMILIES);
  const [currentFamilyId, setCurrentFamilyId] = useState<string>('all');
  
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<GraphLink[]>(INITIAL_LINKS);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Dropdown & Family Management State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManageFamilyModalOpen, setIsManageFamilyModalOpen] = useState(false);
  const [familyToEdit, setFamilyToEdit] = useState<Family | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle saving a family (create or update)
  const handleSaveFamily = (id: string | null, name: string, memberIds: string[]) => {
    let familyId = id;
    
    // 1. Update Families List
    if (familyId) {
      // Edit existing
      setFamilies(prev => prev.map(f => f.id === familyId ? { ...f, name } : f));
    } else {
      // Create new
      familyId = Date.now().toString();
      const newFamily = { id: familyId, name };
      setFamilies(prev => [...prev, newFamily]);
      setCurrentFamilyId(familyId); // Switch to new family
    }

    // 2. Update Members (GraphNodes)
    setNodes(prev => prev.map(node => {
      const isSelected = memberIds.includes(node.id);
      const currentFamilies = node.familyIds || [];
      const hasFamily = currentFamilies.includes(familyId!);

      if (isSelected && !hasFamily) {
        // Add family ID
        return { ...node, familyIds: [...currentFamilies, familyId!] };
      } else if (!isSelected && hasFamily) {
        // Remove family ID
        return { ...node, familyIds: currentFamilies.filter(fid => fid !== familyId) };
      }
      return node;
    }));
  };

  const handleDeleteFamily = (familyId: string) => {
    setFamilies(prev => prev.filter(f => f.id !== familyId));
    
    // Remove this family ID from all nodes
    setNodes(prev => prev.map(node => ({
      ...node,
      familyIds: node.familyIds.filter(fid => fid !== familyId)
    })));

    if (currentFamilyId === familyId) {
      setCurrentFamilyId('all');
    }
  };

  const openManageModal = (e: React.MouseEvent, family?: Family) => {
    e.stopPropagation();
    setFamilyToEdit(family || null);
    setIsManageFamilyModalOpen(true);
    setIsDropdownOpen(false);
  };

  // Filter nodes and links based on selected family
  const filteredNodes = useMemo(() => {
    if (currentFamilyId === 'all') return nodes;
    return nodes.filter(node => node.familyIds.includes(currentFamilyId));
  }, [nodes, currentFamilyId]);

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return links.filter(link => {
      const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
      return nodeIds.has(sourceId as string) && nodeIds.has(targetId as string);
    });
  }, [links, filteredNodes]);

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    // Update "Me" node with the user's name
    setNodes((prevNodes) => 
      prevNodes.map(node => 
        node.id === '1' ? { ...node, name: userData.name } : node
      )
    );
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedNode(null);
    setView('HOME');
  };

  const handleAddNode = (data: AddNodeFormData) => {
    const relatedNode = nodes.find(n => n.id === data.relatedNodeId);
    if (!relatedNode) return;

    let newGeneration = relatedNode.generation;
    let linkType = RelationshipType.SIBLING_OF;
    let sourceId = relatedNode.id;
    let targetId = '';

    const newId = Date.now().toString();

    // Determine generation and direction based on relationship
    switch (data.relationshipType) {
      case 'PARENT':
        newGeneration = relatedNode.generation - 1;
        linkType = RelationshipType.PARENT_OF;
        sourceId = newId;
        targetId = relatedNode.id;
        break;
      case 'CHILD':
        newGeneration = relatedNode.generation + 1;
        linkType = RelationshipType.PARENT_OF;
        sourceId = relatedNode.id;
        targetId = newId;
        break;
      case 'SPOUSE':
        newGeneration = relatedNode.generation;
        linkType = RelationshipType.SPOUSE_OF;
        sourceId = relatedNode.id;
        targetId = newId;
        break;
      case 'SIBLING':
        newGeneration = relatedNode.generation;
        linkType = RelationshipType.SIBLING_OF;
        sourceId = relatedNode.id;
        targetId = newId;
        break;
    }

    const newNode: GraphNode = {
      id: newId,
      name: data.name,
      relationLabel: data.relationLabel,
      bio: data.bio || 'New family member',
      generation: newGeneration,
      group: Math.abs(newGeneration) % 5 + 1,
      isCloseFamily: data.isCloseFamily,
      familyIds: data.familyIds
    };

    const newLink: GraphLink = {
      source: sourceId,
      target: targetId,
      type: linkType
    };

    setNodes((prev) => [...prev, newNode]);
    setLinks((prev) => [...prev, newLink]);
  };

  const handleUpdateNode = (updatedNode: GraphNode) => {
    setNodes((prev) => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
    if (selectedNode?.id === updatedNode.id) {
        setSelectedNode(updatedNode);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter(n => n.id !== nodeId));
    setLinks((prev) => prev.filter(l => l.source !== nodeId && l.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleAddPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const handleAddEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Find the 'Me' node to pass to profile/home
  const userNode = nodes.find(n => n.id === '1') || INITIAL_NODES[0];

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar Navigation - Hidden on Mobile */}
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        userName={user.name} 
      />

      {/* Main Content Area */}
      <main className="flex-1 relative h-full overflow-hidden flex flex-col pb-[80px] md:pb-0">
        
        {/* Top Bar for Family Context Switching */}
        <div className="absolute top-4 right-4 z-20 md:top-6 md:right-8" ref={dropdownRef}>
          <div className="relative">
            {/* Trigger */}
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-700 transition-all shadow-lg min-w-[220px]"
            >
              <div className="flex items-center gap-2">
                <Users size={18} className="text-pink-500" />
                <span className="text-base font-medium text-white max-w-[150px] truncate">
                  {families.find(f => f.id === currentFamilyId)?.name || 'All Families'}
                </span>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right z-30 flex flex-col">
                <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {families.map(family => (
                    <div key={family.id} className="border-b border-slate-700/50 last:border-0">
                        <div
                          onClick={() => {
                            setCurrentFamilyId(family.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group/item cursor-pointer ${
                            currentFamilyId === family.id 
                              ? 'bg-pink-600/10 text-pink-500 font-medium' 
                              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-4 text-base">{family.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {family.id !== 'all' && (
                              <button
                                onClick={(e) => openManageModal(e, family)}
                                className="text-slate-500 hover:text-white opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 rounded hover:bg-slate-600"
                                title="Configure Family & Members"
                              >
                                <Settings size={14} />
                              </button>
                            )}
                            {currentFamilyId === family.id && <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />}
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
                {/* Create New Family Button */}
                <div className="p-2 border-t border-slate-700 bg-slate-800">
                  <button
                    onClick={(e) => openManageModal(e)}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    <span>Create New Family</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {view === 'HOME' && (
          <HomePage userNode={userNode} totalMembers={filteredNodes.length} />
        )}

        {view === 'GRAPH' && (
          <FamilyGraphPage 
            nodes={filteredNodes} 
            links={filteredLinks} 
            onNodeClick={setSelectedNode}
            onBackgroundClick={() => setSelectedNode(null)}
            onAddNode={handleAddNode}
            families={families}
            currentFamilyId={currentFamilyId}
          />
        )}

        {view === 'GROUP' && (
          <FamilyGroupPage 
            nodes={filteredNodes} 
            onNodeClick={setSelectedNode} 
          />
        )}

        {view === 'TIMELINE' && (
          <TimelinePage 
            photos={photos} 
            nodes={nodes} // Pass all nodes so tagging works even if filtered out of view
            onAddPhoto={handleAddPhoto} 
          />
        )}

        {view === 'EVENTS' && (
          <EventsPage 
            events={events}
            nodes={nodes} // Pass all nodes for inviting
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {view === 'CHATS' && (
          <ChatPage />
        )}

        {view === 'PROFILE' && (
          <MyProfilePage 
            userNode={userNode}
            onUpdate={handleUpdateNode}
            onLogout={handleLogout}
          />
        )}

        {/* Global Profile Panel Overlay */}
        <ProfilePanel 
          node={selectedNode} 
          isOpen={!!selectedNode} 
          onClose={() => setSelectedNode(null)}
          onUpdate={handleUpdateNode}
          onDelete={handleDeleteNode}
          families={families}
        />

        {/* Manage Family Modal */}
        <ManageFamilyModal
          isOpen={isManageFamilyModalOpen}
          onClose={() => setIsManageFamilyModalOpen(false)}
          onSave={handleSaveFamily}
          onDelete={handleDeleteFamily}
          family={familyToEdit}
          allNodes={nodes}
        />
      </main>

      {/* Mobile Navigation - Visible on Mobile */}
      <MobileNavbar currentView={view} setView={setView} />
    </div>
  );
}
