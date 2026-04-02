/**
 * Geo utilities for distance calculation and formatting.
 * All coordinate parameters are decimal degrees (WGS-84).
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians.
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculate the great-circle distance between two points using the
 * Haversine formula.
 *
 * @returns Distance in kilometres (rounded to 2 decimal places)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  return Math.round(distanceKm * 100) / 100;
}

/**
 * Format a distance in kilometres into a human-readable string.
 *
 * - Values < 1 km are shown with one decimal place: '0.5 km'
 * - Values >= 1 km are rounded to the nearest whole kilometre: '10 km'
 */
export function formatDistance(km: number): string {
  if (km < 0) {
    throw new RangeError('Distance cannot be negative');
  }

  if (km < 1) {
    // Show one decimal place for sub-kilometre distances
    return `${Math.round(km * 10) / 10} km`;
  }

  return `${Math.round(km)} km`;
}

/**
 * Check whether two points are within a given radius of each other.
 *
 * @param radiusKm - Maximum allowed distance in kilometres
 */
export function isWithinRadius(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  radiusKm: number,
): boolean {
  return calculateDistance(lat1, lng1, lat2, lng2) <= radiusKm;
}

/**
 * Convert metres to kilometres.
 */
export function metersToKm(meters: number): number {
  return meters / 1000;
}

/**
 * Convert kilometres to metres.
 */
export function kmToMeters(km: number): number {
  return km * 1000;
}
