import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Html } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MockGamepad() {
  const groupRef = useRef<THREE.Group>(null);
  const leftJoyconRef = useRef<THREE.Group>(null);
  const rightJoyconRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const group = groupRef.current;
    const leftJoy = leftJoyconRef.current;
    const rightJoy = rightJoyconRef.current;
    const screen = screenRef.current;

    if (!group || !screen || !leftJoy || !rightJoy) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // 1. Rotazione
      tl.to(group.rotation, { x: Math.PI / 4, y: Math.PI / 6, duration: 2 });

      // 2. Esplosione laterale
      tl.to(leftJoy.position, { x: -3.5, duration: 2 }, ">");
      tl.to(rightJoy.position, { x: 3.5, duration: 2 }, "<");

      // 3. Schermo si alza
      tl.to(screen.position, { y: 1.5, z: -1, duration: 2 }, ">");
    });

    return () => ctx.revert();
  }, []);

  return (
    <group ref={groupRef}>
      {/* Corpo */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.4, 2]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>

      {/* Schermo */}
      <mesh
        ref={screenRef}
        position={[0, 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2.8, 1.8]} />
        <meshStandardMaterial color="#fff" emissive="#fff" />
        <Html position={[0, 0, -1.2]} center distanceFactor={10}>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            DISPLAY OLED 4K
          </div>
        </Html>
      </mesh>

      {/* Joycon SX */}
      <group ref={leftJoyconRef} position={[-1.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.4, 2]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.3, -0.5]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <Html position={[-0.5, 0.5, 0]} center distanceFactor={8}>
          <div
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Feedback Aptico
          </div>
        </Html>
      </group>

      {/* Joycon DX */}
      <group ref={rightJoyconRef} position={[1.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.4, 2]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.3, 0.5]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
}

export default function App() {
  return (
    /* Forziamo lo sfondo scuro e togliamo i margini di default */
    <div
      style={{
        backgroundColor: "#171717",
        color: "white",
        fontFamily: "sans-serif",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      {/* IL CANVAS E LA TELECAMERA: CSS puro per forzare il 100% del viewport */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* FIX: Camera a Z=3 e FOV=30 farà sembrare l'oggetto massiccio */}
        <Canvas
          camera={{ position: [0, 1, 3], fov: 100 }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <Environment preset="city" />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <MockGamepad />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.6}
            scale={10}
            blur={2}
            far={4}
          />
        </Canvas>
      </div>

      {/* TESTI HTML: Impaginati con Flexbox inline per non dipendere da Tailwind */}
      <div
        id="scroll-container"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "300vh",
        }}
      >
        <section
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0 10%",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              margin: "0 0 1rem 0",
            }}
          >
            Switch Clone
          </h1>
          <p style={{ fontSize: "1.5rem", color: "#a3a3a3", margin: 0 }}>
            Architettura Modulare.
          </p>
        </section>

        <section
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: "0 10%",
            textAlign: "right",
          }}
        >
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              margin: "0 0 1rem 0",
              color: "white",
            }}
          >
            Controller Indipendenti
          </h2>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#d4d4d4",
              maxWidth: "400px",
              margin: 0,
            }}
          >
            I controller si staccano e diventano pad Bluetooth.
          </p>
        </section>

        <section
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#60a5fa",
              margin: 0,
            }}
          >
            Performance allo stato puro
          </h2>
        </section>
      </div>
    </div>
  );
}
