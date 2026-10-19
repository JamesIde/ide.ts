import * as turf from "@turf/turf";

export interface TrackPoint {
  lng: number;
  lat: number;
  elevation: number; // metres (smoothed)
  distance: number; // cumulative metres from start
}

export interface Track {
  points: TrackPoint[];
  coordinates: [number, number][]; // index-aligned with points (for the map + marker store)
  totalDistance: number;
  gain: number;
  loss: number;
}

const SMOOTHING_WINDOW = 5; // odd number, points either side = (n-1)/2
const ELEVATION_THRESHOLD = 3; // ignore wiggles under 3m when computing gain/loss

function smooth(values: number[], window: number): number[] {
  const half = Math.floor(window / 2);
  return values.map((_, i) => {
    const start = Math.max(0, i - half);
    const end = Math.min(values.length - 1, i + half);
    let sum = 0;
    for (let j = start; j <= end; j++) sum += values[j];
    return sum / (end - start + 1);
  });
}

export function processTrack(raw: number[][]): Track {
  const elevations = smooth(
    raw.map((c) => c[2] ?? 0),
    SMOOTHING_WINDOW,
  );

  const points: TrackPoint[] = [];
  let distance = 0;
  let gain = 0;
  let loss = 0;
  let lastCounted = elevations[0] ?? 0;

  for (let i = 0; i < raw.length; i++) {
    const [lng, lat] = raw[i];

    if (i > 0) {
      const [prevLng, prevLat] = raw[i - 1];
      distance += turf.distance([prevLng, prevLat], [lng, lat], {
        units: "meters",
      });
    }

    // Gain/loss with a threshold so GPS noise doesn't inflate the totals
    const diff = elevations[i] - lastCounted;
    if (Math.abs(diff) >= ELEVATION_THRESHOLD) {
      if (diff > 0) gain += diff;
      else loss -= diff;
      lastCounted = elevations[i];
    }

    points.push({ lng, lat, elevation: Math.round(elevations[i]), distance });
  }

  return {
    points,
    coordinates: points.map((p) => [p.lng, p.lat]),
    totalDistance: distance,
    gain: Math.round(gain),
    loss: Math.round(loss),
  };
}
