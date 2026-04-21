const mockDisasters = [
  {
    name: 'Mithi River Flooding',
    type: 'flood',
    severity: 'critical',
    isActive: true,
    center: { lat: 19.0664, lng: 72.8596 },
    polygon: [
      [19.071, 72.855],
      [19.071, 72.865],
      [19.061, 72.865],
      [19.061, 72.855]
    ],
    description: 'Severe waterlogging and overflowing of Mithi river following extreme continuous rainfall. Avoid BKC routes.'
  },
  {
    name: 'Andheri Industrial Fire',
    type: 'fire',
    severity: 'high',
    isActive: true,
    center: { lat: 19.1136, lng: 72.8697 },
    polygon: [
      [19.118, 72.865],
      [19.118, 72.875],
      [19.108, 72.875],
      [19.108, 72.865]
    ],
    description: 'Major fire reported in MIDC industrial belt. Chemical fumes detected, evacuate immediate radius.'
  },
  {
    name: 'Marine Drive Coastal Surge',
    type: 'flood',
    severity: 'high',
    isActive: true,
    center: { lat: 18.9440, lng: 72.8226 },
    polygon: [
      [18.950, 72.818],
      [18.950, 72.827],
      [18.938, 72.827],
      [18.938, 72.818]
    ],
    description: 'High tide coastal surges breaching Marine Drive promenade. Road partially closed.'
  }
];

module.exports = mockDisasters;
