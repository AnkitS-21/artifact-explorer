import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text, RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { getArtifactById, mockArtifacts } from '@/data/mockArtifacts';
import * as THREE from 'three';

interface ArtifactFrameProps {
  position: [number, number, number];
  imageUrl: string;
  name: string;
  onClick?: () => void;
}

const ArtifactFrame: React.FC<ArtifactFrameProps> = ({ position, imageUrl, name, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position} onClick={onClick}>
        {/* Frame */}
        <RoundedBox args={[2.4, 3.2, 0.15]} radius={0.05} ref={meshRef}>
          <meshStandardMaterial color="#c9a55c" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        
        {/* Inner frame */}
        <RoundedBox args={[2.2, 3, 0.1]} radius={0.02} position={[0, 0, 0.05]}>
          <meshStandardMaterial color="#1a1f2e" />
        </RoundedBox>
        
        {/* Image placeholder */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2, 2.8]} />
          <meshBasicMaterial color="#2a3040" />
        </mesh>

        {/* Name label */}
        <Text
          position={[0, -1.9, 0.1]}
          fontSize={0.12}
          color="#c9a55c"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {name}
        </Text>
      </group>
    </Float>
  );
};

const GalleryScene: React.FC<{ artifacts: typeof mockArtifacts; onSelect: (id: string) => void }> = ({ 
  artifacts, 
  onSelect 
}) => {
  // Arrange artifacts in a semi-circle
  const radius = 6;
  const angleStep = Math.PI / (artifacts.length + 1);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight position={[0, 10, 0]} intensity={1} angle={0.6} penumbra={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#c9a55c" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#c9a55c" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0d1117" />
      </mesh>

      {/* Artifacts */}
      {artifacts.map((artifact, index) => {
        const angle = angleStep * (index + 1) - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <ArtifactFrame
            key={artifact.id}
            position={[x, 0.5, z]}
            imageUrl={artifact.imageUrl}
            name={artifact.name}
            onClick={() => onSelect(artifact.id)}
          />
        );
      })}

      {/* Environment */}
      <Environment preset="night" />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const Gallery3DPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const currentArtifact = id ? getArtifactById(id) : null;
  const displayArtifacts = currentArtifact 
    ? [currentArtifact, ...mockArtifacts.filter(a => a.id !== id).slice(0, 5)]
    : mockArtifacts.slice(0, 6);

  const handleSelect = (artifactId: string) => {
    navigate(`/artifact/${artifactId}`);
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
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-serif text-lg font-semibold text-foreground">3D Gallery</h1>
          <Button variant="glass" size="icon">
            <Maximize2 className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      {/* 3D Canvas */}
      <div className="h-screen w-full">
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <GalleryScene artifacts={displayArtifacts} onSelect={handleSelect} />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RotateCcw className="w-4 h-4" />
          <span>Drag to rotate • Scroll to zoom</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Gallery3DPage;
