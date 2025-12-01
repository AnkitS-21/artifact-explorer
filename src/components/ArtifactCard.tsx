import { motion } from 'framer-motion';
import { Heart, MapPin, Star } from 'lucide-react';
import { Artifact } from '@/types/museum';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ArtifactCardProps {
  artifact: Artifact;
  index?: number;
  compact?: boolean;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, index = 0, compact = false }) => {
  const { isAuthenticated, favorites, addToFavorites, removeFromFavorites } = useAuth();
  const navigate = useNavigate();
  const isFavorite = favorites.includes(artifact.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isFavorite) {
      removeFromFavorites(artifact.id);
    } else {
      addToFavorites(artifact.id);
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => navigate(`/artifact/${artifact.id}`)}
        className="flex items-center gap-3 p-3 glass-hover rounded-xl cursor-pointer"
      >
        <img
          src={artifact.imageUrl}
          alt={artifact.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-semibold text-foreground truncate">{artifact.name}</h4>
          <p className="text-sm text-muted-foreground truncate">{artifact.era}</p>
        </div>
        {isAuthenticated && (
          <button onClick={handleFavoriteClick} className="p-2">
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/artifact/${artifact.id}`)}
      className="card-elevated overflow-hidden cursor-pointer group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={artifact.imageUrl}
          alt={artifact.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        
        {/* Favorite button */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 glass rounded-full"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : 'text-foreground'}`} />
          </button>
        )}

        {/* Popularity badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 glass rounded-full text-xs">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-foreground font-medium">{artifact.popularity}%</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold text-foreground mb-1 line-clamp-1">{artifact.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{artifact.era}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{artifact.gallery}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtifactCard;
