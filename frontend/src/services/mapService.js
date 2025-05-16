import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Store map markers to update them later
let customerMarker = null;
let driverMarker = null;
let pathLine = null;

/**
 * Initialize a Leaflet map
 */
export const initMap = (mapElement, customerLocation, driverLocation = null) => {
  // Create map instance
  const map = L.map(mapElement).setView(
    [customerLocation.lat, customerLocation.lng], 
    15
  );
  
  // Add tile layer (using OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  // Add customer marker
  customerMarker = L.marker([customerLocation.lat, customerLocation.lng], {
    icon: createCustomIcon('#3498db', '📍')
  }).addTo(map).bindPopup('Your Location');
  
  // Add driver marker if available
  if (driverLocation) {
    driverMarker = L.marker([driverLocation.lat, driverLocation.lng], {
      icon: createCustomIcon('#e74c3c', '🚚')
    }).addTo(map).bindPopup('Driver Location');
  }
  
  return map;
};

/**
 * Update markers on the map
 */
export const updateMarkers = (map, customerLocation, driverLocation) => {
  // Update customer marker
  if (customerMarker && customerLocation) {
    customerMarker.setLatLng([customerLocation.lat, customerLocation.lng]);
  }
  
  // Update or create driver marker
  if (driverLocation) {
    if (driverMarker) {
      driverMarker.setLatLng([driverLocation.lat, driverLocation.lng]);
    } else {
      driverMarker = L.marker([driverLocation.lat, driverLocation.lng], {
        icon: createCustomIcon('#e74c3c', '🚚')
      }).addTo(map).bindPopup('Driver Location');
    }
    
    // Draw path between customer and driver
    drawPath(map, customerLocation, driverLocation);
    
    // Center map to include both markers
    const bounds = L.latLngBounds(
      [customerLocation.lat, customerLocation.lng],
      [driverLocation.lat, driverLocation.lng]
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }
};

/**
 * Create a custom map icon
 */
const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        ${symbol}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

/**
 * Draw a path between customer and driver
 */
const drawPath = (map, customerLocation, driverLocation) => {
  // Remove old path if exists
  if (pathLine) {
    map.removeLayer(pathLine);
  }
  
  // Create new path
  pathLine = L.polyline(
    [
      [customerLocation.lat, customerLocation.lng],
      [driverLocation.lat, driverLocation.lng]
    ],
    {
      color: '#3498db',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }
  ).addTo(map);
};
