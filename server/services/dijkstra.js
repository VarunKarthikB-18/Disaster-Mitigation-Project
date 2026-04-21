const { haversine } = require('./haversine');

/**
 * Ray-casting algorithm to check if a point is inside a polygon.
 * @param {number} lat - Point latitude
 * @param {number} lng - Point longitude
 * @param {Array} polygon - Array of [lat, lng] pairs
 * @returns {boolean}
 */
function pointInPolygon(lat, lng, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Check if a line segment between two points passes through any disaster zone.
 * Uses midpoint and quarter-point sampling for approximation.
 */
function edgeCrossesDisasterZone(node1, node2, disasters) {
  // Sample points along the edge
  const samples = 5;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lat = node1.lat + t * (node2.lat - node1.lat);
    const lng = node1.lng + t * (node2.lng - node1.lng);

    for (const disaster of disasters) {
      if (disaster.isActive && pointInPolygon(lat, lng, disaster.polygon)) {
        return disaster;
      }
    }
  }
  return null;
}

/**
 * Calculate edge weight considering disaster zones.
 * - Safe road: distance in km
 * - Risky road (in disaster zone): distance + 500km penalty
 * - Blocked edge: Infinity
 */
function calculateEdgeWeight(node1, node2, disasters, blockedEdges = []) {
  const edgeKey = `${node1.id}-${node2.id}`;
  const reverseKey = `${node2.id}-${node1.id}`;

  if (blockedEdges.includes(edgeKey) || blockedEdges.includes(reverseKey)) {
    return Infinity;
  }

  const distance = haversine(node1.lat, node1.lng, node2.lat, node2.lng);
  const crossingDisaster = edgeCrossesDisasterZone(node1, node2, disasters);

  if (crossingDisaster) {
    const penalty = crossingDisaster.severity === 'critical' ? 1000 : 500;
    return distance + penalty;
  }

  return distance;
}

/**
 * Dijkstra's algorithm for finding the safest/shortest path.
 * Uses a priority queue (min-heap) implemented with array.
 */
function dijkstra(graph, startId, endId, disasters) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  // Priority queue: [distance, nodeId]
  const pq = [];

  // Initialize
  for (const nodeId of Object.keys(graph.nodes)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  }
  distances[startId] = 0;
  pq.push([0, startId]);

  while (pq.length > 0) {
    // Find minimum distance node
    pq.sort((a, b) => a[0] - b[0]);
    const [currentDist, currentId] = pq.shift();

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    if (currentId === endId) break;

    // Get neighbors
    const neighbors = graph.edges[currentId] || [];
    for (const neighborId of neighbors) {
      if (visited.has(neighborId)) continue;

      const currentNode = graph.nodes[currentId];
      const neighborNode = graph.nodes[neighborId];

      const weight = calculateEdgeWeight(currentNode, neighborNode, disasters);
      const newDist = currentDist + weight;

      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
        previous[neighborId] = currentId;
        pq.push([newDist, neighborId]);
      }
    }
  }

  // Reconstruct path
  if (distances[endId] === Infinity) {
    return { path: [], distance: Infinity, reachable: false };
  }

  const path = [];
  let current = endId;
  while (current) {
    path.unshift(graph.nodes[current]);
    current = previous[current];
  }

  return {
    path: path.map(n => ({ lat: n.lat, lng: n.lng, id: n.id })),
    distance: Math.round(distances[endId] * 100) / 100,
    reachable: true,
  };
}

/**
 * Find the nearest graph node to a given lat/lng coordinate.
 */
function snapToGraph(lat, lng, graph) {
  let minDist = Infinity;
  let nearestId = null;

  for (const [id, node] of Object.entries(graph.nodes)) {
    const dist = haversine(lat, lng, node.lat, node.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestId = id;
    }
  }

  return nearestId;
}

module.exports = {
  dijkstra,
  snapToGraph,
  pointInPolygon,
  calculateEdgeWeight,
  edgeCrossesDisasterZone,
};
