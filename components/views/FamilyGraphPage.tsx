import React, { useState } from 'react';
import { ForceGraph } from '../ForceGraph';
import { AddNodeModal } from '../AddNodeModal';
import { GraphNode, GraphLink, AddNodeFormData, Family } from '../../types';
import { Plus, Info } from 'lucide-react';

interface FamilyGraphPageProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeClick: (node: GraphNode) => void;
  onBackgroundClick: () => void;
  onAddNode: (data: AddNodeFormData) => void;
  families: Family[];
  currentFamilyId: string;
}

export const FamilyGraphPage: React.FC<FamilyGraphPageProps> = ({ 
  nodes, 
  links, 
  onNodeClick, 
  onBackgroundClick,
  onAddNode,
  families,
  currentFamilyId
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 pointer-events-none flex justify-end mt-12 md:mt-0">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-pink-500/20 active:scale-95 text-sm md:text-base"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 w-full h-full">
        <ForceGraph 
          nodes={nodes} 
          links={links} 
          onNodeClick={onNodeClick}
          onBackgroundClick={onBackgroundClick}
        />
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 left-6 z-0 pointer-events-none">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Info size={12} />
          <span>Interactive Hierarchical View • Drag to rearrange</span>
        </div>
      </div>

      {/* Add Node Modal */}
      {isModalOpen && (
        <AddNodeModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={onAddNode}
          existingNodes={nodes}
          families={families}
          currentFamilyId={currentFamilyId}
        />
      )}
    </div>
  );
};