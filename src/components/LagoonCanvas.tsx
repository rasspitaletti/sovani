"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { LAGOON_FRAG, LAGOON_VERT } from "@/lib/lagoon-glsl";
import { skyAt } from "@/lib/sky";
import { lagoon, onHour } from "@/lib/store";

const FOV = 0.82; // radians, shared by the shader's rays and the three.js camera so the meshes sit on the water
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function Scene({ low, still }: { low: boolean; still: boolean }) {
  const { camera, size, invalidate } = useThree();
  const water = useRef<THREE.ShaderMaterial>(null!);
  const beamsL = useRef<THREE.Group>(null!);
  const beamsR = useRef<THREE.Group>(null!);
  const shade = useMemo(() => new THREE.MeshBasicMaterial({ color: "#050709" }), []);
  const far = useMemo(() => new THREE.MeshBasicMaterial({ color: "#0b1014", fog: false }), []);
  const lamp = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffd9a0", transparent: true, opacity: 0 }), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 8 }, uAspect: { value: 1 }, uSeed: { value: 1 },
    uStars: { value: 0 }, uPitch: { value: 0 }, uYaw: { value: 0 }, uFov: { value: FOV }, uHeight: { value: 3 }, uOct: { value: low ? 3 : 5 },
    uZenith: { value: new THREE.Vector3() }, uHorizon: { value: new THREE.Vector3() }, uSun: { value: new THREE.Vector3() },
    uDeep: { value: new THREE.Vector3() }, uShallow: { value: new THREE.Vector3() }, uSunDir: { value: new THREE.Vector3() },
  }), [low]);

  // Overwater pavilions on the horizon; they carry the idea, a villa seen from a villa.
  const pavilions = useMemo(() => {
    const out: { x: number; z: number; s: number }[] = [];
    for (let i = 0; i < 9; i++) out.push({ x: -46 + i * 9.5 + (i % 2) * 1.6, z: -74 - (i % 3) * 10, s: 1 + (i % 3) * 0.14 });
    return out;
  }, []);

  useEffect(() => onHour(() => invalidate()), [invalidate]);

  useFrame((_, dt) => {
    const u = water.current.uniforms;
    if (still) lagoon.hour = lagoon.targetHour;
    else lagoon.hour += (lagoon.targetHour - lagoon.hour) * Math.min(1, dt * 2.4);
    if (Math.abs(lagoon.targetHour - lagoon.hour) > 0.002) invalidate();
    const k = skyAt(lagoon.hour);
    if (!still) u.uTime.value += dt;
    u.uAspect.value = size.width / size.height;
    u.uStars.value = k.stars;
    u.uZenith.value.set(...k.zenith); u.uHorizon.value.set(...k.horizon); u.uSun.value.set(...k.sun);
    u.uDeep.value.set(...k.deep); u.uShallow.value.set(...k.shallow); u.uSunDir.value.set(...k.sunDir);

    // Scroll takes the camera out from under the roof, up, and finally down onto the lagoon.
    const s = lagoon.scroll;
    const out = smooth(0, 0.6, s), rise = smooth(0.25, 1, s), down = smooth(0.45, 1, s);
    const height = 3 + rise * 26;
    const pitch = 0.18 - down * 1.28 + lagoon.py * -0.018;
    const yaw = lagoon.px * -0.035;
    u.uHeight.value = height; u.uPitch.value = pitch; u.uYaw.value = yaw;
    camera.position.set(lagoon.px * 0.08, height, 3.2 - out * 14);
    camera.rotation.order = "YXZ";
    camera.rotation.set(pitch, yaw, 0);

    // The roof: beams part left and right. `open` plays once on load, scroll takes them the rest of the way.
    const part = lagoon.open * 10 + s * 8;
    beamsL.current.position.x = -part;
    beamsR.current.position.x = part;

    // Silhouettes pick up the hour; windows light as the sun goes.
    const sil = new THREE.Color(k.horizon[0] * 0.22, k.horizon[1] * 0.2, k.horizon[2] * 0.24);
    far.color.copy(sil);
    shade.color.setRGB(0.012 + k.horizon[0] * 0.035, 0.014 + k.horizon[1] * 0.035, 0.018 + k.horizon[2] * 0.04);
    lamp.opacity = k.isDay && lagoon.hour < 17.2 ? 0 : 0.85;
  });

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-10}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3]} />
        </bufferGeometry>
        <shaderMaterial ref={water} vertexShader={LAGOON_VERT} fragmentShader={LAGOON_FRAG} uniforms={uniforms} depthWrite={false} depthTest={false} />
      </mesh>

      {/* Pavilions */}
      {pavilions.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={p.s}>
          <mesh material={far} position={[0, 1.3, 0]}><boxGeometry args={[5.4, 0.18, 3.6]} /></mesh>
          <mesh material={far} position={[0, 2.3, 0]}><boxGeometry args={[3.8, 1.8, 2.6]} /></mesh>
          <mesh material={far} position={[0, 4, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[3.5, 1.7, 4]} /></mesh>
          <mesh material={lamp} position={[0, 2.3, 1.32]}><planeGeometry args={[2.4, 1]} /></mesh>
          {[-2.2, 0, 2.2].map((x) => <mesh key={x} material={far} position={[x, 0.65, 0]}><boxGeometry args={[0.18, 1.3, 0.18]} /></mesh>)}
        </group>
      ))}
      {/* Jetty joining them */}
      <mesh material={far} position={[-5, 1.2, -82]}><boxGeometry args={[100, 0.12, 0.8]} /></mesh>

      {/* Roof beams, split in two groups that part */}
      <group ref={beamsL}>{[...Array(7)].map((_, i) => <mesh key={i} material={shade} position={[-3.6 - i * 2.2, 6.2, -2.4]}><boxGeometry args={[0.55, 0.4, 16]} /></mesh>)}</group>
      <group ref={beamsR}>{[...Array(7)].map((_, i) => <mesh key={i} material={shade} position={[3.6 + i * 2.2, 6.2, -2.4]}><boxGeometry args={[0.55, 0.4, 16]} /></mesh>)}</group>
    </>
  );
}

export default function LagoonCanvas({ onReady }: { onReady?: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(true);
  const [cfg] = useState(() => {
    const narrow = window.innerWidth < 800;
    const weak = (navigator.hardwareConcurrency || 8) <= 4;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    return { low: narrow || weak, still, dpr: narrow || weak ? 1 : Math.min(window.devicePixelRatio, 1.5) };
  });
  const [dpr, setDpr] = useState(cfg.dpr);

  // Stops drawing once the hero has left the screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setRun(e.isIntersecting));
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        frameloop={!run ? "never" : cfg.still ? "demand" : "always"}
        gl={{ antialias: !cfg.low, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: (FOV * 180) / Math.PI, near: 0.1, far: 600, position: [0, 3, 3.2] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.LinearSRGBColorSpace; // the shader already works in display colours
          onReady?.();
        }}
      >
        <Scene low={cfg.low} still={cfg.still} />
        <FrameGuard onSlow={() => setDpr((d) => Math.max(0.7, d * 0.8))} enabled={!cfg.still} />
      </Canvas>
    </div>
  );
}

// Lowers resolution when the device cannot hold the frame rate.
function FrameGuard({ onSlow, enabled }: { onSlow: () => void; enabled: boolean }) {
  const acc = useRef({ t: 0, n: 0 });
  useFrame((_, dt) => {
    if (!enabled) return;
    const a = acc.current;
    a.t += dt; a.n++;
    if (a.t > 1.5) { if (a.n / a.t < 38) onSlow(); a.t = 0; a.n = 0; }
  });
  return null;
}
