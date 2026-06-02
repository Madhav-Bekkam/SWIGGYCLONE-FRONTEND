import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, Stars, PerspectiveCamera } from '@react-three/drei';

function Rig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    // Parallax effect following mouse
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function FloatingIngredients() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <mesh position={[3, 2, -2]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#fc8019" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[-3, 1, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#48c479" roughness={0.4} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1} floatIntensity={4}>
        <mesh position={[2, -2, 1]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#ff3b3b" roughness={0.1} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={3} floatIntensity={1}>
        <mesh position={[-2, -2, -1]}>
          <torusGeometry args={[0.4, 0.15, 16, 32]} />
          <meshStandardMaterial color="#ffd700" roughness={0.3} metalness={0.5} />
        </mesh>
      </Float>
    </>
  );
}

function MainFoodDish() {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.3;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });
  
  return (
    <group ref={mesh}>
      {/* Abstract Burger / Food Dish Representation */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[2, 2, 0.5, 32]} />
        <meshStandardMaterial color="#e6a15c" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.4, 32]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.1, 32]} />
        <meshStandardMaterial color="#48c479" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e6a15c" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <spotLight position={[-10, 10, -5]} intensity={0.8} color="#fc8019" />
        
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1.5} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <MainFoodDish />
        </Float>
        
        <FloatingIngredients />
        
        <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
        <Rig />
      </Canvas>
    </div>
  );
}
