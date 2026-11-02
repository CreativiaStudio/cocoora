"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, useReducedMotion } from "motion/react";
import { CENTER_NODE, ORBIT_SLOTS, LEGS, samplePictogram } from "./pictogram";

const SCALE = 1.4;
const PARTICLE_COUNT = 2400;
const PARTICLE_SEED = 42;
const ASSEMBLE_DURATION = 1.6;
const ORBIT_FLAT_RADIUS = 1.0 * SCALE;
const ORBIT_TILTED_RADIUS = 1.22 * SCALE;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uAssemble;

  attribute vec3 aScatter;
  attribute float aPhase;

  varying float vPhase;
  varying float vGlow;

  void main() {
    vPhase = aPhase;

    float t = clamp(uAssemble, 0.0, 1.0);
    float ease = 1.0 - pow(1.0 - t, 3.0);
    vec3 pos = mix(aScatter, position, ease);

    float vib = 0.012 * (1.0 - ease * 0.6);
    pos.x += sin(uTime * 1.10 + aPhase * 2.0) * vib;
    pos.y += cos(uTime * 0.90 + aPhase * 1.7) * vib;
    pos.z += sin(uTime * 1.30 + aPhase * 2.4) * vib;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 14.0 * uPixelRatio * (1.0 / max(0.001, -mvPosition.z));

    vGlow = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase * 3.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vPhase;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 2.0);

    vec3 pearl = vec3(0.89, 0.95, 0.97);
    vec3 slate = vec3(0.50, 0.63, 0.70);
    vec3 halo  = vec3(0.16, 0.44, 0.55);

    float mixA = smoothstep(0.0, 0.45, d);
    vec3 color = mix(pearl, slate, mixA);
    color = mix(color, halo, smoothstep(0.35, 0.5, d));

    float shimmer = 0.85 + 0.15 * sin(vPhase * 2.0);
    float alpha = glow * (0.45 + 0.40 * vGlow) * shimmer;

    gl_FragColor = vec4(color, alpha);
  }
`;

type Vec3Like = { x: number; y: number; z?: number } | [number, number, number?] | undefined;

function toScaledVec3(p: Vec3Like): THREE.Vector3 {
  if (!p) return new THREE.Vector3();
  if (Array.isArray(p)) {
    return new THREE.Vector3((p[0] ?? 0) * SCALE, (p[1] ?? 0) * SCALE, (p[2] ?? 0) * SCALE);
  }
  return new THREE.Vector3((p.x ?? 0) * SCALE, (p.y ?? 0) * SCALE, (p.z ?? 0) * SCALE);
}

function samplePolyline(path: THREE.Vector3[], t: number): THREE.Vector3 {
  if (path.length === 0) return new THREE.Vector3();
  if (path.length === 1) return path[0].clone();
  const clamped = Math.max(0, Math.min(1, t));
  const segments = path.length - 1;
  const scaled = clamped * segments;
  const i = Math.min(Math.floor(scaled), segments - 1);
  const local = scaled - i;
  return path[i].clone().lerp(path[i + 1], local);
}

function useLegPaths(): THREE.Vector3[][] {
  return useMemo(() => {
    const raw = LEGS as any;
    const paths: THREE.Vector3[][] = [];

    if (Array.isArray(raw)) {
      for (const leg of raw) {
        if (Array.isArray(leg) && leg.length >= 2) {
          paths.push(leg.map(toScaledVec3));
        } else if (leg && typeof leg === "object") {
          if (Array.isArray(leg.points) && leg.points.length >= 2) {
            paths.push(leg.points.map(toScaledVec3));
          } else if (leg.from && leg.to) {
            paths.push([toScaledVec3(leg.from), toScaledVec3(leg.to)]);
          } else if (leg.start && leg.end) {
            paths.push([toScaledVec3(leg.start), toScaledVec3(leg.end)]);
          } else if (leg.a && leg.b) {
            paths.push([toScaledVec3(leg.a), toScaledVec3(leg.b)]);
          }
        }
      }
    }

    if (paths.length === 0) {
      for (const deg of [225, 315]) {
        const rad = (deg * Math.PI) / 180;
        paths.push([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(
            Math.cos(rad) * 0.92 * SCALE,
            Math.sin(rad) * 0.92 * SCALE,
            0
          ),
        ]);
      }
    }

    return paths;
  }, []);
}

function PictogramPoints({ reduced }: { reduced: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const startRef = useRef<number | null>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const samples = samplePictogram(PARTICLE_COUNT, PARTICLE_SEED);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scatter = new Float32Array(PARTICLE_COUNT * 3);
    const phase = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const offset = i * 3;
      const sx = samples[offset + 0] ?? 0;
      const sy = samples[offset + 1] ?? 0;
      const sz = samples[offset + 2] ?? 0;

      positions[offset + 0] = sx * SCALE;
      positions[offset + 1] = sy * SCALE;
      positions[offset + 2] = sz * SCALE;

      const radius = 2.8 + Math.random() * 1.4;
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const ring = Math.sqrt(Math.max(0, 1 - u * u));

      scatter[i * 3 + 0] = radius * ring * Math.cos(theta);
      scatter[i * 3 + 1] = radius * ring * Math.sin(theta);
      scatter[i * 3 + 2] = radius * u;

      phase[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5.0);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: {
            value:
              typeof window !== "undefined"
                ? Math.min(2, window.devicePixelRatio || 1)
                : 1,
          },
          uAssemble: { value: reduced ? 1 : 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [reduced]
  );

  useEffect(() => {
    material.uniforms.uPixelRatio.value = Math.min(2, gl.getPixelRatio());
  }, [gl, material]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    if (startRef.current === null) startRef.current = t;
    const elapsed = t - startRef.current;
    const duration = reduced ? 0.001 : ASSEMBLE_DURATION;
    material.uniforms.uAssemble.value = Math.min(1, elapsed / duration);

    if (pointsRef.current) {
      pointsRef.current.frustumCulled = false;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}

function OrbitRings() {
  const ringData = useMemo(() => {
    const makeGeo = (radius: number) => {
      const pts: THREE.Vector3[] = [];
      const segments = 180;
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
      }
      return new THREE.BufferGeometry().setFromPoints(pts);
    };

    const geoFlat = makeGeo(ORBIT_FLAT_RADIUS);
    const geoTilted = makeGeo(ORBIT_TILTED_RADIUS);

    const matFlat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#80a1b2"),
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const matTilted = new THREE.LineBasicMaterial({
      color: new THREE.Color("#c5dbe3"),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const ringFlat = new THREE.LineLoop(geoFlat, matFlat);
    const ringTilted = new THREE.LineLoop(geoTilted, matTilted);
    ringTilted.rotation.set(Math.PI * 0.42, 0.35, Math.PI * 0.15);

    return { geoFlat, geoTilted, matFlat, matTilted, ringFlat, ringTilted };
  }, []);

  useEffect(() => {
    return () => {
      ringData.geoFlat.dispose();
      ringData.geoTilted.dispose();
      ringData.matFlat.dispose();
      ringData.matTilted.dispose();
    };
  }, [ringData]);

  return (
    <group>
      <primitive object={ringData.ringFlat} />
      <primitive object={ringData.ringTilted} />
    </group>
  );
}

function NodeSpheres() {
  const nodes = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const center = toScaledVec3(CENTER_NODE as unknown as Vec3Like);
    arr.push(center);

    if (Array.isArray(ORBIT_SLOTS)) {
      for (const slot of ORBIT_SLOTS) {
        arr.push(toScaledVec3(slot as unknown as Vec3Like));
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {nodes.map((p, i) => (
        <group key={`node-${i}`} position={p}>
          <mesh>
            <sphereGeometry args={[0.024 * SCALE, 18, 18]} />
            <meshBasicMaterial
              color={i === 0 ? "#fafcfd" : "#e2edf1"}
              transparent
              opacity={i === 0 ? 0.95 : 0.72}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.07 * SCALE, 16, 16]} />
            <meshBasicMaterial
              color={i === 0 ? "#c5dbe3" : "#1c4a5c"}
              transparent
              opacity={i === 0 ? 0.18 : 0.13}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PulseVisual({
  size,
  color,
  halo,
}: {
  size: number;
  color: string;
  halo: string;
}) {
  return (
    <>
      <mesh>
        <sphereGeometry args={[size, 14, 14]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 3.4, 14, 14]} />
        <meshBasicMaterial
          color={halo}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function LightPulses({ reduced }: { reduced: boolean }) {
  const legPaths = useLegPaths();
  const legRefs = useRef<(THREE.Group | null)[]>([null, null]);
  const orbitRefs = useRef<(THREE.Group | null)[]>([null, null]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = reduced ? 0.08 : 0.32;

    legRefs.current.forEach((group, i) => {
      if (!group || legPaths.length === 0) return;
      const path = legPaths[i % legPaths.length];
      const prog = (t * speed + i * 0.5) % 1;
      const pos = samplePolyline(path, prog);
      group.position.copy(pos);
      const s = 1 + Math.sin(t * 3.2 + i * 1.7) * (reduced ? 0.05 : 0.25);
      group.scale.setScalar(s);
    });

    orbitRefs.current.forEach((group, i) => {
      if (!group) return;
      const prog = (t * speed * 0.55 + i * 0.5 + 0.25) % 1;
      const angle = prog * Math.PI * 2;
      group.position.set(
        Math.cos(angle) * ORBIT_FLAT_RADIUS,
        Math.sin(angle) * ORBIT_FLAT_RADIUS,
        0
      );
      const s = 1 + Math.sin(t * 3.8 + i * 2.1) * (reduced ? 0.05 : 0.22);
      group.scale.setScalar(s);
    });
  });

  return (
    <group>
      {[0, 1].map((i) => (
        <group
          key={`leg-pulse-${i}`}
          ref={(el) => {
            legRefs.current[i] = el;
          }}
        >
          <PulseVisual size={0.028} color="#fafcfd" halo="#e2edf1" />
        </group>
      ))}
      {[0, 1].map((i) => (
        <group
          key={`orbit-pulse-${i}`}
          ref={(el) => {
            orbitRefs.current[i] = el;
          }}
        >
          <PulseVisual size={0.024} color="#e2edf1" halo="#1c4a5c" />
        </group>
      ))}
    </group>
  );
}

function OrbitScene({
  interactive,
  reduced,
}: {
  interactive: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced || !interactive) return;
    const onMove = (e: PointerEvent) => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1;
      const h = typeof window !== "undefined" ? window.innerHeight : 1;
      mouseRef.current.x = (e.clientX / w) * 2 - 1;
      mouseRef.current.y = (e.clientY / h) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, reduced]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    if (reduced) {
      g.rotation.x = 0;
      g.rotation.y = 0;
      g.rotation.z = 0;
      return;
    }

    const t = state.clock.getElapsedTime();
    const mx = interactive ? mouseRef.current.x : 0;
    const my = interactive ? mouseRef.current.y : 0;
    const waveY = Math.sin(t * 0.32) * 0.16;
    const waveX = Math.cos(t * 0.24) * 0.10;

    const targetY = waveY + mx * 0.35;
    const targetX = waveX - my * 0.25;

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.05);
    g.rotation.z = Math.sin(t * 0.2) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <PictogramPoints reduced={reduced} />
      <OrbitRings />
      <NodeSpheres />
      <LightPulses reduced={reduced} />
    </group>
  );
}

export default function CocooraOrbit3D({
  className,
  interactive = true,
}: {
  className?: string;
  interactive?: boolean;
}) {
  const reduced = Boolean(useReducedMotion());

  return (
    <div className={className ?? "relative h-full w-full"}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4.6], fov: 42 }}
      >
        <OrbitScene interactive={interactive} reduced={reduced} />
      </Canvas>
    </div>
  );
}
