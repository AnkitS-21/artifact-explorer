import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { mockArtifacts, museumGrid } from '@/data/mockArtifacts';
import { useNavigate } from 'react-router-dom';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  const artifact = selectedArtifact ? mockArtifacts.find(a => a.id === selectedArtifact) : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass border-b border-border/50"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h1 className="font-serif text-xl font-bold text-foreground">Museum Map</h1>
            </div>
            <Button
              variant="glass"
              size="icon"
              onClick={() => setShowLabels(!showLabels)}
            >
              <Layers className={`w-5 h-5 ${showLabels ? 'text-primary' : ''}`} />
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Map controls */}
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Map grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-elevated p-4 overflow-auto"
        >
          <div
            className="grid gap-1 transition-transform duration-300"
            style={{
              gridTemplateColumns: `repeat(${museumGrid.width}, minmax(40px, 1fr))`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          >
            {museumGrid.cells.flat().map((cell) => {
              const cellArtifact = cell.artifactId 
                ? mockArtifacts.find(a => a.id === cell.artifactId) 
                : null;
              const isSelected = cell.artifactId === selectedArtifact;

              return (
                <motion.button
                  key={`${cell.x}-${cell.y}`}
                  onClick={() => cell.artifactId && setSelectedArtifact(cell.artifactId)}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center relative
                    transition-all duration-200
                    ${cell.type === 'artifact' 
                      ? isSelected 
                        ? 'bg-primary shadow-lg shadow-primary/30' 
                        : 'bg-primary/30 hover:bg-primary/50' 
                      : cell.type === 'entrance' 
                        ? 'bg-sage/50' 
                        : 'bg-secondary/30'
                    }
                  `}
                >
                  {cell.type === 'artifact' && (
                    <>
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} />
                      {showLabels && cellArtifact && (
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground whitespace-nowrap">
                          {cellArtifact.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                      )}
                    </>
                  )}
                  {cell.type === 'entrance' && (
                    <Navigation className="w-4 h-4 text-sage" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/30" />
            <span className="text-muted-foreground">Artifact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sage/50" />
            <span className="text-muted-foreground">Entrance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary/30" />
            <span className="text-muted-foreground">Path</span>
          </div>
        </div>

        {/* Selected artifact preview */}
        {artifact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="card-elevated p-4 flex items-center gap-4">
              <img
                src={artifact.imageUrl}
                alt={artifact.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-foreground">{artifact.name}</h3>
                <p className="text-sm text-muted-foreground">{artifact.gallery}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Location: ({artifact.coordinates.x}, {artifact.coordinates.y})
                </p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() => navigate(`/artifact/${artifact.id}`)}
              >
                View
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default MapPage;
