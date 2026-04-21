const { haversine } = require('./haversine');
const { pointInPolygon } = require('./dijkstra');

/**
 * Recommend safe shelters sorted by distance from user location.
 * Filters out shelters inside disaster zones and at capacity.
 *
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {Array} shelters - All shelter documents
 * @param {Array} disasters - All active disaster documents
 * @param {number} limit - Max number of results
 * @returns {Array} Sorted shelter recommendations
 */
function recommendShelters(userLat, userLng, shelters, disasters, limit = 10) {
  const activeShelters = shelters.filter(shelter => {
    // Filter out inactive shelters
    if (!shelter.isActive) return false;

    // Filter out hospitals (they have separate markers)
    if (shelter.isHospital) return false;

    // Filter out shelters at capacity
    if (shelter.currentOccupancy >= shelter.capacity) return false;

    // Filter out shelters inside disaster zones
    const [lng, lat] = shelter.location.coordinates;
    for (const disaster of disasters) {
      if (disaster.isActive && pointInPolygon(lat, lng, disaster.polygon)) {
        return false;
      }
    }

    return true;
  });

  // Calculate distance and sort
  const withDistance = activeShelters.map(shelter => {
    const [lng, lat] = shelter.location.coordinates;
    const distance = haversine(userLat, userLng, lat, lng);
    return {
      ...shelter.toObject ? shelter.toObject() : shelter,
      distance: Math.round(distance * 100) / 100,
      availableCapacity: shelter.capacity - shelter.currentOccupancy,
    };
  });

  withDistance.sort((a, b) => a.distance - b.distance);

  return withDistance.slice(0, limit);
}

module.exports = { recommendShelters };
