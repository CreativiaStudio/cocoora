type Point2 = readonly [number, number];

interface Disk {
  readonly center: Point2;
  readonly radius: number;
}

export interface OrbitSlot extends Disk {
  readonly angle: number;
  readonly orbitRadius: 1;
  readonly connected: boolean;
  readonly kind: "satellite" | "connected";
}

export interface Leg {
  readonly from: Point2;
  readonly to: Point2;
  readonly thickness: number;
  readonly cap: "round";
}

const ORBIT_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;
const Z_JITTER = 0.035;

export const CENTER_NODE = {
  center: [0, 0] as const,
  radius: 0.22,
} as const;

export const ORBIT_SLOTS: readonly OrbitSlot[] = Object.freeze(
  ORBIT_ANGLES.map((angle): OrbitSlot => {
    const radians = (angle * Math.PI) / 180;
    const connected = angle === 225 || angle === 315;

    return {
      angle,
      orbitRadius: 1,
      center: [Math.cos(radians), Math.sin(radians)] as const,
      radius: connected ? 0.2 : 0.16,
      connected,
      kind: connected ? "connected" : "satellite",
    };
  }),
);

// Round capsules overlap the central and orbital nodes, creating filled legs
// with soft joints. The exported thickness is the full thickness, not the radius.
export const LEGS: readonly Leg[] = Object.freeze(
  ORBIT_SLOTS.filter((slot) => slot.connected).map((slot) => ({
    from: CENTER_NODE.center,
    to: slot.center,
    thickness: 0.18,
    cap: "round" as const,
  })),
);

const NODE_DISKS: readonly Disk[] = [CENTER_NODE, ...ORBIT_SLOTS];

const SAMPLE_BOUNDS = (() => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const disk of NODE_DISKS) {
    const [x, y] = disk.center;
    minX = Math.min(minX, x - disk.radius);
    minY = Math.min(minY, y - disk.radius);
    maxX = Math.max(maxX, x + disk.radius);
    maxY = Math.max(maxY, y + disk.radius);
  }

  for (const leg of LEGS) {
    const radius = leg.thickness * 0.5;
    minX = Math.min(minX, leg.from[0] - radius, leg.to[0] - radius);
    minY = Math.min(minY, leg.from[1] - radius, leg.to[1] - radius);
    maxX = Math.max(maxX, leg.from[0] + radius, leg.to[0] + radius);
    maxY = Math.max(maxY, leg.from[1] + radius, leg.to[1] + radius);
  }

  return { minX, minY, maxX, maxY };
})();

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pointInsideLeg(x: number, y: number, leg: Leg): boolean {
  const abX = leg.to[0] - leg.from[0];
  const abY = leg.to[1] - leg.from[1];
  const lengthSquared = abX * abX + abY * abY;

  const projection =
    ((x - leg.from[0]) * abX + (y - leg.from[1]) * abY) / lengthSquared;
  const t = Math.max(0, Math.min(1, projection));

  const closestX = leg.from[0] + abX * t;
  const closestY = leg.from[1] + abY * t;
  const dx = x - closestX;
  const dy = y - closestY;
  const radius = leg.thickness * 0.5;

  return dx * dx + dy * dy <= radius * radius;
}

function pointInsidePictogram(x: number, y: number): boolean {
  for (const disk of NODE_DISKS) {
    const dx = x - disk.center[0];
    const dy = y - disk.center[1];

    if (dx * dx + dy * dy <= disk.radius * disk.radius) {
      return true;
    }
  }

  for (const leg of LEGS) {
    if (pointInsideLeg(x, y, leg)) {
      return true;
    }
  }

  return false;
}

/**
 * Samples the filled 2D pictogram and returns interleaved x/y/z coordinates.
 * Rejection sampling over the complete union keeps density uniform even where
 * legs overlap nodes, rather than over-sampling those intersections.
 */
export function samplePictogram(count: number, seed = 42): Float32Array {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError("count must be a non-negative integer");
  }

  const points = new Float32Array(count * 3);
  if (count === 0) {
    return points;
  }

  const random = mulberry32(seed);
  const { minX, minY, maxX, maxY } = SAMPLE_BOUNDS;
  const width = maxX - minX;
  const height = maxY - minY;

  for (let index = 0; index < count; index += 1) {
    let x = 0;
    let y = 0;

    do {
      x = minX + random() * width;
      y = minY + random() * height;
    } while (!pointInsidePictogram(x, y));

    const offset = index * 3;
    points[offset] = x;
    points[offset + 1] = y;
    points[offset + 2] = (random() * 2 - 1) * Z_JITTER;
  }

  return points;
}