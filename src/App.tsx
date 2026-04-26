import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";

function MockDevice() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.5, 2.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh position={[-0.5, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#000000" emissive="#111" />
      </mesh>

      <mesh position={[1.2, 0.3, 0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} />
      </mesh>

      <mesh position={[1.2, 0.3, -0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function App() {
  return (
    <div className="w-screen h-screen bg-neutral-900">
      <Canvas camera={{ position: [0, 5, 5], fov: 45 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <MockDevice />

        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />

        <OrbitControls enableZoom={false} />
      </Canvas>

      <div className="absolute top-10 left-10 text-white font-sans pointer-events-none">
        <h1 className="text-5xl font-bold mb-2">Pro Device X</h1>
        <p className="text-xl text-gray-400">
          Scrolla verso il basso per scoprire l'interno.
        </p>
      </div>
    </div>
  );
}
