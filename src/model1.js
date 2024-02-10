import React from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ModelComponent />
      <OrbitControls />
    </Canvas>
  );
};

const ModelComponent = () => {
  const gltf = useGLTF('LittlestTokyo.glb');
  return <primitive object={gltf.scene} />;
};

export default Model;