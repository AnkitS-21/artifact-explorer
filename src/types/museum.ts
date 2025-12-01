export interface Artifact {
  id: string;
  name: string;
  description: string;
  era: string;
  origin: string;
  imageUrl: string;
  category: string;
  coordinates: { x: number; y: number };
  popularity: number;
  tags: string[];
  gallery?: string;
  dateAdded: string;
}

export interface MuseumGrid {
  width: number;
  height: number;
  cells: GridCell[][];
}

export interface GridCell {
  x: number;
  y: number;
  type: 'empty' | 'artifact' | 'wall' | 'entrance' | 'exit';
  artifactId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'visitor' | 'admin';
  favorites: string[];
  history: string[];
}

export interface ScanResult {
  artifactId: string;
  confidence: number;
  artifact: Artifact;
}
