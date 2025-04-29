import React, { useEffect, useRef } from 'react';
import { initMap, updateMarkers } from '../services/mapService';
import './TrackingMap.css';

const TrackingMap = ({ customerLocation, driverLocation, showDriver }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!customerLocation) return;
    
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = initMap(
        mapRef.current, 
        customerLocation,
        driverLocation
      );
    }
    
    // Update markers whenever locations change
    updateMarkers(
      mapInstanceRef.current, 
      customerLocation, 
      showDriver ? driverLocation : null
    );
    
  }, [customerLocation, driverLocation, showDriver]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="tracking-map"></div>
      {showDriver ? (
        <div className="map-legend">
          <div className="legend-item">
            <div className="dot customer-dot"></div>
            <span>Your Location</span>
          </div>
          <div className="legend-item">
            <div className="dot driver-dot"></div>
            <span>Driver Location</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TrackingMap;
