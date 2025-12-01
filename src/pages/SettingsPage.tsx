import { motion } from 'framer-motion';
import { User, Bell, Globe, HelpCircle, Shield, LogOut, ChevronRight, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Guest';

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Receive updates about new artifacts',
          action: (
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          ),
        },
        {
          icon: darkMode ? Moon : Sun,
          label: 'Dark Mode',
          description: 'Toggle dark theme',
          action: (
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          ),
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'English',
          action: <ChevronRight className="w-5 h-5 text-muted-foreground" />,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'Get help with the app',
          action: <ChevronRight className="w-5 h-5 text-muted-foreground" />,
        },
        {
          icon: Shield,
          label: 'Privacy Policy',
          description: 'View our privacy policy',
          action: <ChevronRight className="w-5 h-5 text-muted-foreground" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 glass border-b border-border/50"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="font-serif text-xl font-bold text-foreground">Settings</h1>
        </div>
      </motion.header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* User profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-4 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif font-semibold text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email || 'Not logged in'}</p>
            {isAdmin && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                Administrator
              </span>
            )}
          </div>
          <Button variant="glass" size="sm">
            Edit
          </Button>
        </motion.div>

        {/* Admin Dashboard Link */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Button
              variant="gold"
              className="w-full"
              onClick={() => navigate('/admin')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
          </motion.div>
        )}

        {/* Settings groups */}
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {group.title}
            </h3>
            <div className="card-elevated divide-y divide-border/50">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.action}
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="glass"
            size="lg"
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* App version */}
        <p className="text-center text-sm text-muted-foreground pt-4">
          ArtifactAI v1.0.0
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
