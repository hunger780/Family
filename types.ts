export enum RelationshipType {
  PARENT_OF = 'PARENT_OF',
  SPOUSE_OF = 'SPOUSE_OF',
  SIBLING_OF = 'SIBLING_OF',
}

export interface GraphNode {
  id: string;
  name: string;
  relationLabel?: string; // e.g. "Dad", "Aunt" - optional display label
  bio: string;
  generation: number; // 0 for user, -1 for parents, 1 for children
  group?: number; 
  imageUrl?: string;
  
  // Basic Profile Details
  age?: string;
  gender?: string;
  location?: string;
  occupation?: string;

  // d3-force simulation properties
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: RelationshipType;

  // d3-force simulation properties
  index?: number;
}

// Helper types for UI
export type AddNodeFormData = {
  name: string;
  relationLabel: string; // "Dad", "Sister", etc.
  bio: string;
  relatedNodeId: string;
  relationshipType: 'PARENT' | 'CHILD' | 'SPOUSE' | 'SIBLING';
};

export type ViewType = 'HOME' | 'GRAPH' | 'GROUP' | 'CHATS' | 'PROFILE';