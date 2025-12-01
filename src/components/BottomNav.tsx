import { motion } from 'framer-motion';
import { Home, Camera, Map, Heart, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: Camera, label: 'Scan', path: '/camera' },
  { icon: Heart, label: 'Saved', path: '/favorites' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50 safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isScan = item.label === 'Scan';

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                isScan ? 'w-16' : 'flex-1 py-2'
              }`}
            >
              {isScan ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <Camera className="w-6 h-6 text-primary-foreground" />
                </motion.div>
              ) : (
                <>
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-xs mt-1 ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-0.5 w-8 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
