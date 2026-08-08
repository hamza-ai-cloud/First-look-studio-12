'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* A stylized DSLR camera built from primitives — gold body + glass lens */
export function CameraModel() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.3;
    group.current.rotation.x = Math.cos(t * 0.2) * 0.1;
  });

  return (
    <group ref={group} dispose={null}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[2.4, 1.5, 0.9]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Gold top plate */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[2.42, 0.04, 0.92]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      {/* Gold side accents */}
      <mesh position={[1.21, 0, 0]}>
        <boxGeometry args={[0.02, 1.52, 0.92]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[-1.21, 0, 0]}>
        <boxGeometry args={[0.02, 1.52, 0.92]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      {/* Viewfinder hump */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.5]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.16, 0]}>
        <boxGeometry args={[0.72, 0.02, 0.52]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      {/* Flash hot-shoe */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.3]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>
      {/* Grip */}
      <mesh position={[-1, -0.05, 0]}>
        <boxGeometry args={[0.5, 1.3, 0.95]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Shutter button */}
      <mesh position={[-1, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>
      {/* Lens mount ring */}
      <mesh position={[0, -0.1, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      {/* Lens body */}
      <mesh position={[0, -0.1, 0.85]}>
        <cylinderGeometry args={[0.62, 0.68, 0.7, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Lens ring */}
      <mesh position={[0, -0.1, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.04, 8, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>
      {/* Lens glass — cheap transparent material instead of MeshTransmissionMaterial */}
      <mesh position={[0, -0.1, 1.2]}>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 16]} />
        <meshStandardMaterial
          color="#88aaff"
          metalness={0.8}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Lens reflection inner */}
      <mesh position={[0, -0.1, 1.18]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 16]} />
        <meshStandardMaterial color="#1a2a4a" metalness={0.5} roughness={0.1} emissive="#3366ff" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

/* A rotating camera lens — standalone decorative piece */
export function LensModel({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.4;
  });

  return (
    <group ref={ref} scale={scale} dispose={null}>
      <mesh>
        <cylinderGeometry args={[1, 1, 0.4, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[1, 0.05, 8, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[1, 0.05, 8, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.21]}>
        <cylinderGeometry args={[0.85, 0.85, 0.02, 32]} />
        <meshStandardMaterial
          color="#88aaff"
          metalness={0.8}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

/* A floating photo frame */
export function PhotoFrame({
  position,
  rotation = [0, 0, 0],
  color = '#D4AF37',
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={position} rotation={rotation} dispose={null}>
        {/* Frame */}
        <mesh>
          <boxGeometry args={[1.4, 1.7, 0.08]} />
          <meshStandardMaterial color={color} metalness={1} roughness={0.2} />
        </mesh>
        {/* Photo (dark glass) */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.15, 1.45, 0.02]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.5}
            roughness={0.1}
            emissive="#1a1a2a"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* Particle field — floating gold specks */
export function Particles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#D4AF37"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
