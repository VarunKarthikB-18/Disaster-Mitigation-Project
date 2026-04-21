/**
 * Mock road network graph for Delhi NCR.
 * Nodes = intersections/landmarks. Edges = road connections.
 * Some edges cross disaster zones for demo routing.
 */
const roadNetwork = {
  nodes: {
    // === Central Delhi ===
    'n1':  { id: 'n1',  lat: 28.6139, lng: 77.2090, name: 'India Gate' },
    'n2':  { id: 'n2',  lat: 28.6315, lng: 77.2195, name: 'Connaught Place' },
    'n3':  { id: 'n3',  lat: 28.6188, lng: 77.2490, name: 'Pragati Maidan' },
    'n4':  { id: 'n4',  lat: 28.6350, lng: 77.2240, name: 'Mandi House' },
    'n5':  { id: 'n5',  lat: 28.6440, lng: 77.2170, name: 'New Delhi Station' },

    // === South Delhi ===
    'n6':  { id: 'n6',  lat: 28.5900, lng: 77.2200, name: 'Lodhi Garden' },
    'n7':  { id: 'n7',  lat: 28.5700, lng: 77.2370, name: 'Lajpat Nagar' },
    'n8':  { id: 'n8',  lat: 28.5672, lng: 77.2100, name: 'AIIMS' },
    'n9':  { id: 'n9',  lat: 28.5490, lng: 77.2510, name: 'Nehru Place' },
    'n10': { id: 'n10', lat: 28.5300, lng: 77.2100, name: 'Saket' },
    'n11': { id: 'n11', lat: 28.5100, lng: 77.1900, name: 'Mehrauli' },   // Inside earthquake zone
    'n12': { id: 'n12', lat: 28.5400, lng: 77.1800, name: 'Vasant Kunj' },

    // === West Delhi ===
    'n13': { id: 'n13', lat: 28.6270, lng: 77.0810, name: 'Janakpuri' },
    'n14': { id: 'n14', lat: 28.6200, lng: 77.1200, name: 'Rajouri Garden' },
    'n15': { id: 'n15', lat: 28.6350, lng: 77.1600, name: 'Patel Nagar' },
    'n16': { id: 'n16', lat: 28.6390, lng: 77.1910, name: 'Karol Bagh' },
    'n17': { id: 'n17', lat: 28.5840, lng: 77.0650, name: 'Dwarka' },

    // === North Delhi ===
    'n18': { id: 'n18', lat: 28.6600, lng: 77.2270, name: 'Old Delhi' },
    'n19': { id: 'n19', lat: 28.6830, lng: 77.2200, name: 'Civil Lines' },
    'n20': { id: 'n20', lat: 28.7050, lng: 77.2100, name: 'Model Town' },
    'n21': { id: 'n21', lat: 28.7200, lng: 77.1800, name: 'Pitampura' },
    'n22': { id: 'n22', lat: 28.7360, lng: 77.1160, name: 'Rohini' },
    'n23': { id: 'n23', lat: 28.7500, lng: 77.1500, name: 'Shalimar Bagh' },

    // === East Delhi ===
    'n24': { id: 'n24', lat: 28.6280, lng: 77.2750, name: 'ITO' },
    'n25': { id: 'n25', lat: 28.6350, lng: 77.2600, name: 'Pragati Maidan N' },
    'n26': { id: 'n26', lat: 28.6550, lng: 77.2500, name: 'Yamuna Bank' },   // Near flood zone
    'n27': { id: 'n27', lat: 28.6700, lng: 77.2700, name: 'Shahdara' },      // Near flood zone
    'n28': { id: 'n28', lat: 28.6830, lng: 77.2950, name: 'GTB Nagar East' },
    'n29': { id: 'n29', lat: 28.6070, lng: 77.2930, name: 'Mayur Vihar' },
    'n30': { id: 'n30', lat: 28.6200, lng: 77.3100, name: 'Noida Border' },

    // === Connector nodes ===
    'n31': { id: 'n31', lat: 28.6600, lng: 77.1700, name: 'Shakti Nagar' },
    'n32': { id: 'n32', lat: 28.6500, lng: 77.1400, name: 'Kirti Nagar' },
    'n33': { id: 'n33', lat: 28.6800, lng: 77.1600, name: 'Ashok Vihar' },
    'n34': { id: 'n34', lat: 28.5800, lng: 77.1700, name: 'RK Puram' },
    'n35': { id: 'n35', lat: 28.5600, lng: 77.1500, name: 'Vasant Vihar' },
    'n36': { id: 'n36', lat: 28.6000, lng: 77.1400, name: 'Punjabi Bagh' },
    'n37': { id: 'n37', lat: 28.7000, lng: 77.1300, name: 'Wazirpur' },
    'n38': { id: 'n38', lat: 28.5600, lng: 77.2700, name: 'Kalkaji' },
    'n39': { id: 'n39', lat: 28.6450, lng: 77.2450, name: 'IP Estate' },
    'n40': { id: 'n40', lat: 28.5200, lng: 77.2000, name: 'Qutub Minar' },  // Inside earthquake zone

    // === Far nodes ===
    'n41': { id: 'n41', lat: 28.7700, lng: 77.1000, name: 'Bawana' },
    'n42': { id: 'n42', lat: 28.8200, lng: 77.0850, name: 'Narela' },       // Inside fire zone
    'n43': { id: 'n43', lat: 28.7800, lng: 77.0600, name: 'Narela Junction' },
    'n44': { id: 'n44', lat: 28.5500, lng: 77.0900, name: 'Palam' },
    'n45': { id: 'n45', lat: 28.6100, lng: 77.0400, name: 'Dwarka Mor' },
  },

  edges: {
    'n1':  ['n2', 'n3', 'n6'],
    'n2':  ['n1', 'n4', 'n5', 'n16'],
    'n3':  ['n1', 'n24', 'n25'],
    'n4':  ['n2', 'n5', 'n25', 'n39'],
    'n5':  ['n2', 'n4', 'n18', 'n16'],
    'n6':  ['n1', 'n7', 'n8'],
    'n7':  ['n6', 'n8', 'n9', 'n38'],
    'n8':  ['n6', 'n7', 'n34'],
    'n9':  ['n7', 'n10', 'n38'],
    'n10': ['n9', 'n11', 'n12', 'n40'],
    'n11': ['n10', 'n40'],              // Inside earthquake zone — risky
    'n12': ['n10', 'n34', 'n35'],
    'n13': ['n14', 'n17', 'n45'],
    'n14': ['n13', 'n15', 'n32', 'n36'],
    'n15': ['n14', 'n16', 'n32'],
    'n16': ['n2', 'n5', 'n15', 'n31'],
    'n17': ['n13', 'n44', 'n45'],
    'n18': ['n5', 'n19', 'n26', 'n31'],
    'n19': ['n18', 'n20', 'n27', 'n33'],
    'n20': ['n19', 'n21', 'n33', 'n37'],
    'n21': ['n20', 'n22', 'n23'],
    'n22': ['n21', 'n23', 'n37', 'n41'],
    'n23': ['n21', 'n22', 'n37'],
    'n24': ['n3', 'n25', 'n29', 'n39'],
    'n25': ['n3', 'n4', 'n24', 'n26'],
    'n26': ['n18', 'n25', 'n27'],       // Near flood zone — risky
    'n27': ['n19', 'n26', 'n28'],       // Near flood zone — risky
    'n28': ['n27'],
    'n29': ['n24', 'n30', 'n38'],
    'n30': ['n29'],
    'n31': ['n16', 'n18', 'n33'],
    'n32': ['n14', 'n15', 'n36'],
    'n33': ['n19', 'n20', 'n31', 'n37'],
    'n34': ['n8', 'n12', 'n35', 'n36'],
    'n35': ['n12', 'n34', 'n44'],
    'n36': ['n14', 'n32', 'n34'],
    'n37': ['n20', 'n22', 'n23', 'n33', 'n41'],
    'n38': ['n7', 'n9', 'n29'],
    'n39': ['n4', 'n24'],
    'n40': ['n10', 'n11'],              // Inside earthquake zone — risky
    'n41': ['n22', 'n37', 'n42', 'n43'],
    'n42': ['n41', 'n43'],              // Inside fire zone — risky
    'n43': ['n41', 'n42'],
    'n44': ['n17', 'n35', 'n45'],
    'n45': ['n13', 'n17', 'n44'],
  },
};

module.exports = roadNetwork;
