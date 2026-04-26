import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MockDevice() {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const btnRedRef = useRef<THREE.Mesh>(null);
  const btnBlueRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const group = groupRef.current;
    const screen = screenRef.current;
    const btnRed = btnRedRef.current;
    const btnBlue = btnBlueRef.current;

    if (!group || !screen || !btnRed || !btnBlue) return;

    // Pre render before animation
    if (
      !groupRef.current ||
      !screenRef.current ||
      !btnRedRef.current ||
      !btnBlueRef.current
    )
      return;

    let ctx = gsap.context(() => {
      // Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-container", // Tag trigger
          start: "top top", // top of component touch the top of screen
          end: "bottom bottom", // bottom of component touch the bottom of screen
          scrub: 1,
        },
      });

      // Rotate the entire group to see it from above
      tl.to(
        group.rotation,
        { x: -Math.PI / 6, z: Math.PI / 8, duration: 1 },
        0,
      );

      // Raise Y axis and push Z axis
      tl.to(screen.position, { y: 1.5, z: 0.5, duration: 1 }, 0);

      // Push to the right the buttons to see them from above
      tl.to(btnRed.position, { x: 2.5, y: 1, duration: 1 }, 0);
      tl.to(btnBlue.position, { x: 2.5, y: 1, z: -1, duration: 1 }, 0);
    });

    return () => ctx.revert(); // Clean animation
  }, []);

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.5, 2.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh
        ref={screenRef}
        position={[-0.5, 0.26, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#000000" emissive="#111" />
      </mesh>

      <mesh ref={btnRedRef} position={[1.2, 0.3, 0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} />
      </mesh>

      <mesh ref={btnBlueRef} position={[1.2, 0.3, -0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function App() {
  return (
    <div className="bg-neutral-900 text-white font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
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
        </Canvas>
      </div>

      <div id="scroll-container" className="relative z-10 w-full h-[300vh]">
        <section className="h-screen flex flex-col justify-center items-start p-20">
          <h1 className="text-6xl font-bold mb-4">Pro Device X</h1>
          <p className="text-2xl text-gray-400">Il futuro nelle tue mani.</p>
          <p className="mt-8 animate-bounce text-blue-400">
            ↓ Scrolla per esplodere
          </p>
        </section>

        <section className="h-screen flex flex-col justify-center items-end p-20 text-right">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Ingegneria di precisione
          </h2>
          <p className="text-xl text-gray-300 max-w-md">
            Ogni componente è progettato per garantire le massime prestazioni. I
            moduli separati assicurano una dissipazione termica perfetta.
          </p>
        </section>

        <section className="h-screen flex flex-col justify-center items-center">
          <h2 className="text-5xl font-bold mb-4 text-red-400">
            Assemblaggio perfetto
          </h2>
          <button className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition pointer-events-auto">
            Preordina Ora
          </button>
        </section>
      </div>
    </div>
  );
}
