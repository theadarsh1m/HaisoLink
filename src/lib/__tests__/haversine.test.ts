import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../haversine';

describe('calculateDistance (Haversine)', () => {
  it('should return 0 when the coordinates are identical', () => {
    const lat = 40.7128;
    const lon = -74.0060;
    const distance = calculateDistance(lat, lon, lat, lon);
    expect(distance).toBe(0);
  });

  it('should correctly calculate the distance between New York and London', () => {
    const nyLat = 40.7128;
    const nyLon = -74.0060;
    const ldnLat = 51.5074;
    const ldnLon = -0.1278;

    const distance = calculateDistance(nyLat, nyLon, ldnLat, ldnLon);
    
    // NY to London is approx 5570 km
    expect(distance).toBeGreaterThan(5500);
    expect(distance).toBeLessThan(5650);
  });
});
