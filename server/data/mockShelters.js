const mockShelters = [
  // Shelters
  {
    name: 'Bandra Kurla Complex Relief Camp',
    capacity: 2000,
    currentOccupancy: 850,
    location: { type: 'Point', coordinates: [72.8656, 19.0596] },
    amenities: ['food', 'water', 'medical', 'power'],
    contact: '+91-22-2659-0001',
    isHospital: false
  },
  {
    name: 'Shivaji Park Emergency Shelter',
    capacity: 1500,
    currentOccupancy: 1200,
    location: { type: 'Point', coordinates: [72.8378, 19.0269] },
    amenities: ['food', 'water', 'medical'],
    contact: '+91-22-2445-0002',
    isHospital: false
  },
  {
    name: 'Juhu Beach Recreation Center',
    capacity: 800,
    currentOccupancy: 450,
    location: { type: 'Point', coordinates: [72.8267, 19.1051] },
    amenities: ['food', 'water'],
    contact: '+91-22-2612-0003',
    isHospital: false
  },
  {
    name: 'Goregaon Sports Complex',
    capacity: 3000,
    currentOccupancy: 2800,
    location: { type: 'Point', coordinates: [72.8464, 19.1648] },
    amenities: ['food', 'water', 'medical', 'helipad'],
    contact: '+91-22-2872-0004',
    isHospital: false
  },
  
  // Hospitals
  {
    name: 'Lilavati Hospital & Research Centre',
    capacity: 500,
    currentOccupancy: 450,
    location: { type: 'Point', coordinates: [72.8277, 19.0504] },
    amenities: ['medical', 'surgery', 'icu', 'ambulance'],
    contact: '+91-22-2675-1000',
    isHospital: true
  },
  {
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    capacity: 750,
    currentOccupancy: 600,
    location: { type: 'Point', coordinates: [72.8256, 19.1314] },
    amenities: ['medical', 'surgery', 'icu', 'trauma'],
    contact: '+91-22-3099-9999',
    isHospital: true
  },
  {
    name: 'Hinduja Hospital',
    capacity: 400,
    currentOccupancy: 380,
    location: { type: 'Point', coordinates: [72.8370, 19.0335] },
    amenities: ['medical', 'surgery', 'icu'],
    contact: '+91-22-2445-1515',
    isHospital: true
  }
];

module.exports = mockShelters;
