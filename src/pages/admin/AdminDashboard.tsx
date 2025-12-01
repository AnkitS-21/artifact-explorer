import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, Map, Users, Settings, LogOut,
  Plus, Search, Edit, Trash2, Eye, TrendingUp, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockArtifacts } from '@/data/mockArtifacts';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'artifacts' | 'map' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect non-admins
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/home');
    }
  }, [isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Admin';

  const stats = [
    { label: 'Total Artifacts', value: mockArtifacts.length, icon: Package, trend: '+12%' },
    { label: 'Daily Scans', value: '2,847', icon: Eye, trend: '+8%' },
    { label: 'Active Users', value: '1,234', icon: Users, trend: '+15%' },
    { label: 'Avg. Session', value: '12m', icon: Clock, trend: '+5%' },
  ];

  const filteredArtifacts = mockArtifacts.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'artifacts', label: 'Artifacts', icon: Package },
    { id: 'map', label: 'Map Editor', icon: Map },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-card border-r border-border p-6 flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif font-bold text-foreground">ArtifactAI</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{displayName}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, {displayName}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-elevated p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="flex items-center gap-1 text-sm text-sage">
                        <TrendingUp className="w-4 h-4" />
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent artifacts */}
              <div className="card-elevated p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Recent Artifacts</h3>
                <div className="space-y-3">
                  {mockArtifacts.slice(0, 5).map((artifact) => (
                    <div key={artifact.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                      <img src={artifact.imageUrl} alt={artifact.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{artifact.name}</p>
                        <p className="text-sm text-muted-foreground">{artifact.gallery}</p>
                      </div>
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">{artifact.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'artifacts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Artifacts</h2>
                  <p className="text-muted-foreground">Manage museum artifacts</p>
                </div>
                <Button variant="gold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Artifact
                </Button>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artifacts..."
                  className="input-glass w-full pl-10"
                />
              </div>

              {/* Artifacts table */}
              <div className="card-elevated overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/30">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Artifact</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Era</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Gallery</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredArtifacts.map((artifact) => (
                      <tr key={artifact.id} className="hover:bg-secondary/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={artifact.imageUrl} alt={artifact.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-medium text-foreground">{artifact.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">{artifact.category}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{artifact.era}</td>
                        <td className="p-4 text-muted-foreground">{artifact.gallery}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Map Editor</h2>
                <p className="text-muted-foreground">Edit museum floor plan and artifact locations</p>
              </div>
              <div className="card-elevated p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Map editor coming soon</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Settings</h2>
                <p className="text-muted-foreground">Configure admin portal settings</p>
              </div>
              <div className="card-elevated p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Settings panel coming soon</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
