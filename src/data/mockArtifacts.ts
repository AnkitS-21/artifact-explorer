import { Artifact, MuseumGrid } from '@/types/museum';

export const mockArtifacts: Artifact[] = [
  {
    id: '1',
    name: 'The Golden Pharaoh Mask',
    description: 'An exquisite golden funerary mask from ancient Egypt, believed to have belonged to a high-ranking noble. The intricate craftsmanship showcases the advanced metallurgical skills of the New Kingdom period.',
    era: '1332-1323 BCE',
    origin: 'Ancient Egypt',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800',
    category: 'Egyptian',
    coordinates: { x: 2, y: 3 },
    popularity: 95,
    tags: ['gold', 'funerary', 'mask', 'pharaoh'],
    gallery: 'Egyptian Wing',
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    name: 'Grecian Amphora',
    description: 'A beautifully preserved red-figure amphora depicting scenes from the Trojan War. The vessel demonstrates masterful artistry typical of Athenian pottery workshops.',
    era: '5th Century BCE',
    origin: 'Ancient Greece',
    imageUrl: 'https://images.unsplash.com/photo-1608376630927-4c9ca38dfc71?w=800',
    category: 'Greek',
    coordinates: { x: 4, y: 2 },
    popularity: 88,
    tags: ['pottery', 'amphora', 'greek', 'trojan war'],
    gallery: 'Greek & Roman Gallery',
    dateAdded: '2024-02-20',
  },
  {
    id: '3',
    name: 'Terracotta Warrior',
    description: 'An original terracotta soldier from the famous army of Emperor Qin Shi Huang. Each warrior was individually crafted with unique facial features.',
    era: '210-209 BCE',
    origin: 'Ancient China',
    imageUrl: 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800',
    category: 'Asian',
    coordinates: { x: 6, y: 4 },
    popularity: 92,
    tags: ['terracotta', 'warrior', 'chinese', 'qin dynasty'],
    gallery: 'Asian Art Wing',
    dateAdded: '2024-03-10',
  },
  {
    id: '4',
    name: 'Medieval Knight Armor',
    description: 'A complete suit of plate armor from 15th century Germany, featuring intricate engravings and a fully articulated design allowing remarkable mobility.',
    era: '15th Century CE',
    origin: 'Medieval Germany',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    category: 'Medieval',
    coordinates: { x: 3, y: 5 },
    popularity: 85,
    tags: ['armor', 'knight', 'medieval', 'german'],
    gallery: 'Arms & Armor Hall',
    dateAdded: '2024-01-28',
  },
  {
    id: '5',
    name: 'Jade Emperor Seal',
    description: 'An imperial jade seal carved from finest nephrite, bearing the insignia of the Tang Dynasty. Used to authenticate royal decrees and official documents.',
    era: '618-907 CE',
    origin: 'Tang Dynasty China',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
    category: 'Asian',
    coordinates: { x: 7, y: 3 },
    popularity: 78,
    tags: ['jade', 'seal', 'imperial', 'tang dynasty'],
    gallery: 'Asian Art Wing',
    dateAdded: '2024-04-05',
  },
  {
    id: '6',
    name: 'Renaissance Oil Painting',
    description: 'A stunning Madonna and Child painting attributed to the school of Raphael, showcasing the soft sfumato technique and ideal beauty of High Renaissance art.',
    era: '16th Century CE',
    origin: 'Renaissance Italy',
    imageUrl: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800',
    category: 'European',
    coordinates: { x: 5, y: 6 },
    popularity: 90,
    tags: ['painting', 'renaissance', 'madonna', 'italian'],
    gallery: 'European Masters',
    dateAdded: '2024-02-14',
  },
  {
    id: '7',
    name: 'Mayan Calendar Stone',
    description: 'A carved stone calendar disc depicting the Mayan long count calendar system, showcasing their advanced astronomical knowledge.',
    era: '800-900 CE',
    origin: 'Ancient Maya',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    category: 'Pre-Columbian',
    coordinates: { x: 1, y: 4 },
    popularity: 82,
    tags: ['calendar', 'mayan', 'stone', 'astronomical'],
    gallery: 'Americas Gallery',
    dateAdded: '2024-03-22',
  },
  {
    id: '8',
    name: 'Samurai Katana',
    description: 'A finely crafted katana from the Edo period, featuring a distinctive hamon pattern and gold-inlaid tsuba guard.',
    era: '17th Century CE',
    origin: 'Edo Japan',
    imageUrl: 'https://images.unsplash.com/photo-1555633514-abcee6ab92e1?w=800',
    category: 'Asian',
    coordinates: { x: 8, y: 2 },
    popularity: 87,
    tags: ['katana', 'samurai', 'japanese', 'sword'],
    gallery: 'Asian Art Wing',
    dateAdded: '2024-04-18',
  },
];

export const museumGrid: MuseumGrid = {
  width: 10,
  height: 8,
  cells: Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 10 }, (_, x) => {
      const artifact = mockArtifacts.find(a => a.coordinates.x === x && a.coordinates.y === y);
      return {
        x,
        y,
        type: artifact ? 'artifact' : (x === 0 && y === 0 ? 'entrance' : 'empty'),
        artifactId: artifact?.id,
      };
    })
  ),
};

export const getArtifactById = (id: string): Artifact | undefined => {
  return mockArtifacts.find(a => a.id === id);
};

export const getNearbyArtifacts = (x: number, y: number, radius: number = 2): Artifact[] => {
  return mockArtifacts.filter(artifact => {
    const dx = Math.abs(artifact.coordinates.x - x);
    const dy = Math.abs(artifact.coordinates.y - y);
    return dx <= radius && dy <= radius && (dx !== 0 || dy !== 0);
  });
};

export const getRecommendations = (currentArtifact: Artifact, history: string[]): Artifact[] => {
  return mockArtifacts
    .filter(a => a.id !== currentArtifact.id && !history.includes(a.id))
    .sort((a, b) => {
      const categoryMatchA = a.category === currentArtifact.category ? 20 : 0;
      const categoryMatchB = b.category === currentArtifact.category ? 20 : 0;
      const distanceA = Math.abs(a.coordinates.x - currentArtifact.coordinates.x) + Math.abs(a.coordinates.y - currentArtifact.coordinates.y);
      const distanceB = Math.abs(b.coordinates.x - currentArtifact.coordinates.x) + Math.abs(b.coordinates.y - currentArtifact.coordinates.y);
      const scoreA = categoryMatchA + a.popularity - distanceA * 5;
      const scoreB = categoryMatchB + b.popularity - distanceB * 5;
      return scoreB - scoreA;
    })
    .slice(0, 4);
};
