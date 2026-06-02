import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Stars, PerspectiveCamera, Text3D, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';

function CinematicText() {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    const scrollFactor = scrollY * 0.015;

    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(t) * 0.3;
      // Pushing text forward towards the camera on scroll
      groupRef.current.position.z = scrollFactor * 2;
      // Slight tilt on scroll
      groupRef.current.rotation.x = scrollFactor * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Center position={[0, 1.5, 0]}>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
          size={2.5}
          height={0.4}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.05}
          bevelSegments={8}
        >
          EXTRAORDINARY
          <meshPhysicalMaterial 
            color="#ff3b3b" 
            metalness={0.3} 
            roughness={0.1} 
            transmission={0.8} 
            ior={1.5} 
            thickness={2} 
          />
        </Text3D>
      </Center>

      <Center position={[0, -2, 0]}>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
          size={3.5}
          height={0.6}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.05}
          bevelSegments={8}
        >
          FOOD
          <meshPhysicalMaterial 
            color="#fc8019" 
            metalness={0.5} 
            roughness={0.2} 
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function FloatingParticles() {
  const groupRef = useRef();
  useFrame(() => {
    const scrollY = window.scrollY;
    groupRef.current.position.y = scrollY * 0.02;
    groupRef.current.rotation.y -= 0.001;
  });
  return (
    <group ref={groupRef}>
      <Sparkles count={400} scale={25} size={15} speed={0.4} color="#fc8019" opacity={0.6} />
      <Sparkles count={200} scale={20} size={25} speed={0.2} color="#ff3b3b" opacity={0.4} />
      <Sparkles count={150} scale={30} size={30} speed={0.6} color="#ffd700" opacity={0.5} />
    </group>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 4, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 4, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <spotLight position={[-10, -10, -5]} intensity={1.5} color="#48c479" />
        <spotLight position={[10, 10, -5]} intensity={1.5} color="#fc8019" />
        
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1.5} />
        
        <CinematicText />
        <FloatingParticles />
        
        <Rig />
      </Canvas>
    </div>
  );
}
