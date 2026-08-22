'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CameraModel, LensModel, PhotoFrame, Particles } from './models';

function CameraRig() {
  const { camera, pointer, viewport } = useThree();

  useFrame((state) => {
    const isMobile = viewport.width < 7;
    const movement = isMobile ? 0.55 : 1;

    const targetX = pointer.x * 1.4 * movement;
    const targetY = pointer.y * 1.05 * movement;

    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;

    camera.position.z +=
      (6.15 - camera.position.z) * 0.02;

    camera.lookAt(0, 0, 0);

    // Very subtle cinematic camera breathing.
    const breathing =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.025;

    camera.position.z += breathing;
  });

  return null;
}

function SceneGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;

    ref.current.rotation.y =
      Math.sin(t * 0.12) * 0.11;

    ref.current.rotation.x =
      Math.sin(t * 0.08) * 0.025;

    ref.current.position.y =
      Math.sin(t * 0.18) * 0.035;
  });

  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && canvasRef.current) {
        canvasRef.current.style.display = 'none';
      } else if (canvasRef.current) {
        canvasRef.current.style.display = '';
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <Canvas
      ref={canvasRef as never}
      shadows={false}
      dpr={[1, 1.25]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      frameloop="always"
      performance={{ min: 0.65 }}
      className="!absolute inset-0"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
      <CameraRig />

      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#D4AF37"
      />
      <spotLight
        position={[-5, 5, 3]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
      />
      <pointLight position={[0, -3, 2]} intensity={1} color="#D4AF37" />

      <Suspense fallback={null}>
        <SceneGroup>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <CameraModel />
          </Float>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group position={[2.8, 1.5, -1]}>
              <LensModel scale={0.5} />
            </group>
          </Float>
          <PhotoFrame position={[-3.5, 1, -1.5]} rotation={[0, 0.4, -0.1]} />
          <PhotoFrame position={[3.2, -1.5, -1]} rotation={[0, -0.3, 0.15]} color="#BF953F" />
          <PhotoFrame position={[-2.5, -2, -2]} rotation={[0.1, 0.3, 0.05]} color="#AA771C" />
          <PhotoFrame position={[2.5, 2.2, -2.5]} rotation={[0, -0.2, -0.08]} />
        </SceneGroup>
        <Particles count={60} />
        <Environment preset="night" />
      </Suspense>

      <fog attach="fog" args={['#050505', 8, 20]} />
    </Canvas>
  );
}
