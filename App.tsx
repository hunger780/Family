import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './components/AuthPage';
import { ProfilePanel } from './components/ProfilePanel';
import { HomePage } from './components/views/HomePage';
import { FamilyGraphPage } from './components/views/FamilyGraphPage';
import { FamilyGroupPage } from './components/views/FamilyGroupPage';
import { ChatPage } from './components/views/ChatPage';
import { MyProfilePage } from './components/views/MyProfilePage';
import { TimelinePage } from './components/views/TimelinePage';
import { EventsPage } from './components/views/EventsPage';
import { GraphNode, GraphLink, RelationshipType, AddNodeFormData, ViewType, Photo, Event } from './types';

// Initial Family Tree Data
const INITIAL_NODES: GraphNode[] = [
  { id: '1', name: 'Me', relationLabel: 'Self', bio: 'The center of this universe.', generation: 0, group: 1, age: '28', gender: 'Male', location: 'New York, USA', occupation: 'Software Engineer', isCloseFamily: true },
  { id: '2', name: 'Arthur', relationLabel: 'Father', bio: 'Hardworking man who loves fishing.', generation: -1, group: 2, age: '62', gender: 'Male', isCloseFamily: true },
  { id: '3', name: 'Molly', relationLabel: 'Mother', bio: 'The best cook in the world.', generation: -1, group: 2, age: '60', gender: 'Female', isCloseFamily: true },
  { id: '4', name: 'Ginny', relationLabel: 'Spouse', bio: 'My partner in crime.', generation: 0, group: 1, age: '27', gender: 'Female', isCloseFamily: true },
  { id: '5', name: 'James', relationLabel: 'Son', bio: 'Full of energy and mischief.', generation: 1, group: 3, age: '5', gender: 'Male', isCloseFamily: true },
  { id: '6', name: 'Albus', relationLabel: 'Son', bio: 'Quiet and thoughtful.', generation: 1, group: 3, age: '3', gender: 'Male', isCloseFamily: true },
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
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<GraphLink[]>(INITIAL_LINKS);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

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
      isCloseFamily: data.isCloseFamily
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
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        userName={user.name} 
      />

      {/* Main Content Area */}
      <main className="flex-1 relative h-full overflow-hidden flex flex-col">
        {view === 'HOME' && (
          <HomePage userNode={userNode} totalMembers={nodes.length} />
        )}

        {view === 'GRAPH' && (
          <FamilyGraphPage 
            nodes={nodes} 
            links={links} 
            onNodeClick={setSelectedNode}
            onBackgroundClick={() => setSelectedNode(null)}
            onAddNode={handleAddNode}
          />
        )}

        {view === 'GROUP' && (
          <FamilyGroupPage 
            nodes={nodes} 
            onNodeClick={setSelectedNode} 
          />
        )}

        {view === 'TIMELINE' && (
          <TimelinePage 
            photos={photos} 
            nodes={nodes} 
            onAddPhoto={handleAddPhoto} 
          />
        )}

        {view === 'EVENTS' && (
          <EventsPage 
            events={events}
            nodes={nodes}
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
          />
        )}

        {/* Global Profile Panel Overlay */}
        <ProfilePanel 
          node={selectedNode} 
          isOpen={!!selectedNode} 
          onClose={() => setSelectedNode(null)}
          onUpdate={handleUpdateNode}
          onDelete={handleDeleteNode}
        />
      </main>
    </div>
  );
}