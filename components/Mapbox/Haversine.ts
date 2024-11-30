/**
 * A function that calculates the distance between two points on a sphere taking into account the earth
 * @param coord1
 * @param coord2
 * @returns the distance in meters between two points (also known as the crow flies)
 */
export function haversineDistance(coord1: HCoord, coord2: HCoord) {
  if (coord2.lat == null || coord2.lng == null) return;
  const earthRadius = 6371e3; // meters
  const lat1 = toRadians(coord1.lat);
  const lat2 = toRadians(coord2.lat);
  const deltaLat = toRadians(coord2.lat - coord1.lat);
  const deltaLng = toRadians(coord2.lng - coord1.lng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export interface HCoord {
  lat: number;
  lng: number;
}
