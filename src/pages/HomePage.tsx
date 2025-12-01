import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Camera, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtifactCard from '@/components/ArtifactCard';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { mockArtifacts } from '@/data/mockArtifacts';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Egyptian', 'Greek', 'Asian', 'Medieval', 'European'];

  const filteredArtifacts = mockArtifacts.filter(artifact => {
    const matchesSearch = artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || artifact.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArtifacts = [...mockArtifacts].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const recentArtifacts = [...mockArtifacts].sort((a, b) => 
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  ).slice(0, 4);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Explorer';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass border-b border-border/50"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h1 className="font-serif text-xl font-bold text-foreground">
                {displayName}
              </h1>
            </div>
            <Button
              variant="gold"
              size="icon"
              onClick={() => navigate('/camera')}
              className="rounded-full w-12 h-12"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artifacts..."
              className="input-glass w-full pl-10"
            />
          </div>
        </div>
      </motion.header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Quick scan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card p-6 border border-primary/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              Scan Any Artifact
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Point your camera at any museum artifact to instantly identify it and learn its history.
            </p>
            <Button variant="gold" onClick={() => navigate('/camera')}>
              <Camera className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'gold' : 'glass'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Search results or default content */}
        {searchQuery ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              Search Results ({filteredArtifacts.length})
            </h2>
            <div className="museum-grid">
              {filteredArtifacts.map((artifact, index) => (
                <ArtifactCard key={artifact.id} artifact={artifact} index={index} />
              ))}
            </div>
          </motion.section>
        ) : (
          <>
            {/* Popular artifacts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Popular</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  See all
                </Button>
              </div>
              <div className="museum-grid">
                {popularArtifacts.map((artifact, index) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} index={index} />
                ))}
              </div>
            </motion.section>

            {/* Recently added */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Recently Added</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  See all
                </Button>
              </div>
              <div className="space-y-3">
                {recentArtifacts.map((artifact, index) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} index={index} compact />
                ))}
              </div>
            </motion.section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;
