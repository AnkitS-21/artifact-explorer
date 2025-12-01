import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!showSplash) {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/auth');
      }
    }
  }, [showSplash, isAuthenticated, navigate]);

  return (
    <AnimatePresence>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
    </AnimatePresence>
  );
};

export default Index;
