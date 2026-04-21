/**
 * Mock disaster zones centered around Delhi NCR, India.
 */
const mockDisasters = [
  {
    name: 'Yamuna Flood Zone — East Delhi',
    type: 'flood',
    severity: 'critical',
    description: 'Severe flooding along the Yamuna river. Low-lying areas in East Delhi submerged. Water level 3m above danger mark.',
    polygon: [
      [28.630, 77.250],
      [28.645, 77.280],
      [28.670, 77.285],
      [28.685, 77.270],
      [28.675, 77.245],
      [28.650, 77.240],
      [28.630, 77.250],
    ],
    center: { lat: 28.655, lng: 77.265 },
    isActive: true,
  },
  {
    name: 'Seismic Activity — South Delhi',
    type: 'earthquake',
    severity: 'high',
    description: 'Moderate seismic tremors detected (4.5 Richter). Multiple structural cracks reported in Mehrauli and Saket areas.',
    polygon: [
      [28.500, 77.170],
      [28.510, 77.210],
      [28.530, 77.220],
      [28.540, 77.200],
      [28.535, 77.175],
      [28.515, 77.160],
      [28.500, 77.170],
    ],
    center: { lat: 28.520, lng: 77.190 },
    isActive: true,
  },
  {
    name: 'Industrial Fire — North West Delhi',
    type: 'fire',
    severity: 'critical',
    description: 'Major fire outbreak in industrial area near Narela. Toxic smoke advisory issued for 5km radius.',
    polygon: [
      [28.820, 77.070],
      [28.830, 77.100],
      [28.850, 77.110],
      [28.860, 77.090],
      [28.850, 77.065],
      [28.835, 77.060],
      [28.820, 77.070],
    ],
    center: { lat: 28.840, lng: 77.085 },
    isActive: true,
  },
];

module.exports = mockDisasters;
