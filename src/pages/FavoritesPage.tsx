import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock } from 'lucide-react';
import ArtifactCard from '@/components/ArtifactCard';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { mockArtifacts } from '@/data/mockArtifacts';

const FavoritesPage: React.FC = () => {
  const { favorites, history } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  const favoriteArtifacts = mockArtifacts.filter(a => favorites.includes(a.id));
  const historyArtifacts = mockArtifacts.filter(a => history.includes(a.id));

  const displayArtifacts = activeTab === 'favorites' ? favoriteArtifacts : historyArtifacts;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass border-b border-border/50"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="font-serif text-xl font-bold text-foreground mb-4">My Collection</h1>
          
          {/* Tabs */}
          <div className="flex bg-secondary/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'favorites' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <Heart className="w-4 h-4" />
              Favorites ({favoriteArtifacts.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'history' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <Clock className="w-4 h-4" />
              History ({historyArtifacts.length})
            </button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {displayArtifacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
              {activeTab === 'favorites' ? (
                <Heart className="w-10 h-10 text-muted-foreground" />
              ) : (
                <Clock className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              {activeTab === 'favorites' ? 'No favorites yet' : 'No history yet'}
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {activeTab === 'favorites'
                ? 'Start exploring artifacts and save your favorites here.'
                : 'Artifacts you view will appear here.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {displayArtifacts.map((artifact, index) => (
              <ArtifactCard key={artifact.id} artifact={artifact} index={index} compact />
            ))}
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default FavoritesPage;
