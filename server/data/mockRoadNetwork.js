// Simple mock road network for Mumbai (Bandra, Andheri, Worli, etc)
// Coordinates approximate

// Nodes
const n1 = { id: 'm-nw-1', lat: 19.1648, lng: 72.8464 }; // Goregaon
const n2 = { id: 'm-nw-2', lat: 19.1314, lng: 72.8256 }; // Andheri West
const n3 = { id: 'm-nw-3', lat: 19.1136, lng: 72.8697 }; // Andheri East (MIDC)
const n4 = { id: 'm-nw-4', lat: 19.1051, lng: 72.8267 }; // Juhu
const n5 = { id: 'm-sw-1', lat: 19.0596, lng: 72.8656 }; // BKC
const n6 = { id: 'm-cw-1', lat: 19.0504, lng: 72.8277 }; // Bandra West
const n7 = { id: 'm-cw-2', lat: 19.0335, lng: 72.8370 }; // Mahim
const n8 = { id: 'm-sw-2', lat: 19.0269, lng: 72.8378 }; // Shivaji Park
const n9 = { id: 'm-s-1', lat: 18.9440, lng: 72.8226 };  // Marine Drive

const nodes = [n1, n2, n3, n4, n5, n6, n7, n8, n9];

// Edges (distances are simulated to map layout realistically)
const edges = [
  // Goregaon to Andheri
  { source: 'm-nw-1', target: 'm-nw-3', distance: 6 },
  { source: 'm-nw-1', target: 'm-nw-2', distance: 5 },
  
  // Andheri cross connections
  { source: 'm-nw-2', target: 'm-nw-3', distance: 4 },
  { source: 'm-nw-2', target: 'm-nw-4', distance: 3 }, // Andheri W to Juhu
  
  // Down to Bandra
  { source: 'm-nw-4', target: 'm-cw-1', distance: 6 }, // Juhu to Bandra West
  { source: 'm-nw-3', target: 'm-sw-1', distance: 7 }, // Andheri E to BKC
  { source: 'm-cw-1', target: 'm-sw-1', distance: 5 }, // Bandra W to BKC
  
  // Into South Bombay
  { source: 'm-cw-1', target: 'm-cw-2', distance: 3 }, // Bandra W to Mahim
  { source: 'm-sw-1', target: 'm-cw-2', distance: 4 }, // BKC to Mahim
  { source: 'm-cw-2', target: 'm-sw-2', distance: 2 }, // Mahim to Shivaji Park
  
  // Deep South
  { source: 'm-sw-2', target: 'm-s-1', distance: 10 }, // Shivaji Park to Marine Drive
];

module.exports = { nodes, edges };
