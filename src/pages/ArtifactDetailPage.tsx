import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Tag, Box, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtifactCard from '@/components/ArtifactCard';
import { useAuth } from '@/contexts/AuthContext';
import { getArtifactById, getNearbyArtifacts, getRecommendations } from '@/data/mockArtifacts';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ArtifactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, favorites, history, addToFavorites, removeFromFavorites, addToHistory } = useAuth();

  const artifact = getArtifactById(id || '');
  const isFavorite = favorites.includes(id || '');
  const nearbyArtifacts = artifact ? getNearbyArtifacts(artifact.coordinates.x, artifact.coordinates.y) : [];
  const recommendations = artifact ? getRecommendations(artifact, history) : [];

  useEffect(() => {
    if (id && isAuthenticated) {
      addToHistory(id);
    }
  }, [id, isAuthenticated, addToHistory]);

  if (!artifact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Artifact not found</p>
      </div>
    );
  }

  const handleFavorite = () => {
    if (!isAuthenticated) return;
    if (isFavorite) {
      removeFromFavorites(artifact.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(artifact.id);
      toast.success('Added to favorites');
    }
  };

  const handleShare = () => {
    navigator.share?.({
      title: artifact.name,
      text: artifact.description,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero image */}
      <div className="relative h-[50vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={artifact.imageUrl}
          alt={artifact.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Header controls */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
          <Button variant="glass" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="glass" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            {isAuthenticated && (
              <Button variant="glass" size="icon" onClick={handleFavorite}>
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative -mt-20 px-4 pb-8 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6 mb-6"
        >
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
              {artifact.category}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">{artifact.era}</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            {artifact.name}
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {artifact.description}
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Era</p>
                <p className="text-sm font-medium text-foreground">{artifact.era}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Origin</p>
                <p className="text-sm font-medium text-foreground">{artifact.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Compass className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Gallery</p>
                <p className="text-sm font-medium text-foreground">{artifact.gallery}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Tag className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Popularity</p>
                <p className="text-sm font-medium text-foreground">{artifact.popularity}%</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {artifact.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-secondary/50 text-muted-foreground text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 3D View button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Button
            variant="glass"
            size="lg"
            className="w-full"
            onClick={() => navigate(`/gallery-3d/${artifact.id}`)}
          >
            <Box className="w-5 h-5 mr-2" />
            View in 3D Gallery
          </Button>
        </motion.div>

        {/* Nearby artifacts */}
        {nearbyArtifacts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold text-foreground">Nearby Artifacts</h2>
            </div>
            <div className="space-y-3">
              {nearbyArtifacts.slice(0, 3).map((nearby, index) => (
                <ArtifactCard key={nearby.id} artifact={nearby} index={index} compact />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold text-foreground">Recommended</h2>
          </div>
          <div className="museum-grid">
            {recommendations.map((rec, index) => (
              <ArtifactCard key={rec.id} artifact={rec} index={index} />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ArtifactDetailPage;
