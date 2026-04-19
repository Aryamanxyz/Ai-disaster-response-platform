import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { useDisaster } from '../../context/DisasterContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getSeverityColor = (severity) => {
  if (severity >= 8) return '#ef4444';
  if (severity >= 5) return '#f59e0b';
  return '#22c55e';
};

const HeatmapLayer = ({ incidents }) => {
  const map = useMap();

  useEffect(() => {
    const heatData = incidents.map(inc => [
      inc.location.coordinates.lat,
      inc.location.coordinates.lng,
      inc.severity / 10
    ]);

    const heatLayer = L.heatLayer(heatData, {
      radius: 40,
      blur: 25,
      maxZoom: 10,
      gradient: {
        0.2: '#22c55e',
        0.5: '#f59e0b',
        0.8: '#ef4444',
        1.0: '#7f1d1d'
      }
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [incidents, map]);

  return null;
};

const DisasterMap = () => {
  const { incidents } = useDisaster();

  const validIncidents = incidents.filter(
    inc => inc.location?.coordinates?.lat && inc.location?.coordinates?.lng
  );

  return (
    <div style={styles.container}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={styles.map}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatmapLayer incidents={validIncidents} />

        {validIncidents.map((incident) => (
          <div key={incident._id}>
            <Marker
              position={[
                incident.location.coordinates.lat,
                incident.location.coordinates.lng
              ]}
            >
              <Popup>
                <div style={styles.popup}>
                  <h3 style={styles.popupTitle}>{incident.title}</h3>
                  <p style={styles.popupType}>Type: {incident.type}</p>
                  <p style={styles.popupSeverity}>
                    Severity: <strong>{incident.severity}/10</strong>
                  </p>
                  <p style={styles.popupLocation}>
                    📍 {incident.location.city}, {incident.location.state}
                  </p>
                  <p style={styles.popupAffected}>
                    👥 {incident.affectedPeople} affected
                  </p>
                  <span style={{
                    ...styles.popupBadge,
                    background: incident.status === 'active' ? '#1d4ed8' : '#475569'
                  }}>
                    {incident.status}
                  </span>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[
                incident.location.coordinates.lat,
                incident.location.coordinates.lng
              ]}
              radius={incident.severity * 3000}
              pathOptions={{
                color: getSeverityColor(incident.severity),
                fillColor: getSeverityColor(incident.severity),
                fillOpacity: 0.2
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

const styles = {
  container: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #334155',
    height: '400px'
  },
  map: {
    height: '100%',
    width: '100%'
  },
  popup: {
    minWidth: '180px'
  },
  popupTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#1e293b'
  },
  popupType: {
    fontSize: '12px',
    color: '#475569',
    textTransform: 'capitalize'
  },
  popupSeverity: {
    fontSize: '12px',
    color: '#475569'
  },
  popupLocation: {
    fontSize: '12px',
    color: '#475569'
  },
  popupAffected: {
    fontSize: '12px',
    color: '#475569',
    marginBottom: '6px'
  },
  popupBadge: {
    color: 'white',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '11px'
  }
};

export default DisasterMap;