import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Zap, Image as ImageIcon, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockArtifacts } from '@/data/mockArtifacts';
import { toast } from 'sonner';

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const simulateScan = useCallback(() => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Simulate finding a random artifact
          const randomArtifact = mockArtifacts[Math.floor(Math.random() * mockArtifacts.length)];
          toast.success(`Identified: ${randomArtifact.name}`, {
            description: `${randomArtifact.era} • 94% confidence`,
          });
          setTimeout(() => {
            navigate(`/artifact/${randomArtifact.id}`);
          }, 1500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  }, [navigate]);

  const resetCapture = () => {
    setCapturedImage(null);
    setScanProgress(0);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="glass" size="icon" onClick={() => navigate(-1)}>
            <X className="w-5 h-5" />
          </Button>
          <h1 className="font-serif text-lg font-semibold text-foreground">Scan Artifact</h1>
          <div className="w-10" />
        </div>
      </motion.header>

      <main className="pt-20 pb-8 px-4 max-w-lg mx-auto">
        {/* Camera viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-card border border-border mb-6"
        >
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-card">
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center px-8">
                Capture or upload an image of an artifact to identify it
              </p>
            </div>
          )}

          {/* Scan overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                {/* Scanning animation */}
                <div className="relative w-48 h-48 mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full"
                  />
                  <div className="absolute inset-4 flex items-center justify-center">
                    <Zap className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                </div>

                <p className="font-serif text-xl text-foreground mb-2">Analyzing Artifact...</p>
                <p className="text-muted-foreground text-sm mb-4">Using AI to identify the artifact</p>

                {/* Progress bar */}
                <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-gold-light"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-primary text-sm mt-2">{scanProgress}%</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner guides */}
          {!capturedImage && (
            <>
              <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
            </>
          )}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-6"
        >
          {capturedImage ? (
            <>
              <Button
                variant="glass"
                size="lg"
                onClick={resetCapture}
                disabled={isScanning}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake
              </Button>
              <Button
                variant="gold"
                size="xl"
                onClick={simulateScan}
                disabled={isScanning}
                className="px-8"
              >
                <Check className="w-5 h-5 mr-2" />
                Identify
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="glass"
                size="icon"
                className="w-14 h-14 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-6 h-6" />
              </Button>
              
              <Button
                variant="gold"
                size="icon"
                className="w-20 h-20 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-8 h-8" />
              </Button>

              <div className="w-14 h-14" /> {/* Spacer for symmetry */}
            </>
          )}
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Point your camera at any museum artifact or upload an image
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Our AI will identify it and show you detailed information
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default CameraPage;
