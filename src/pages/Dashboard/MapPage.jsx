import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LocateFixed, ChevronDown, CheckCircle, XCircle } from "lucide-react";

// All available incident types (add more here)
const incidentTypesConfig = [
  { key: "fire", icon: "🔥" },
  { key: "flood", icon: "🌊" },
  { key: "landslide", icon: "🚧" },
  { key: "accident", icon: "🚗" },
  { key: "garbage", icon: "🗑️" },
  { key: "relief", icon: "📦" },
  { key: "other", icon: "❓" },
];

// Dummy incident data
const incidents = [
  {
    id: 1,
    title: "Fire in Lalitpur",
    type: "fire",
    lat: 27.6588,
    lng: 85.3247,
    time: "1h ago",
  },
  {
    id: 2,
    title: "Flood in Bhaktapur",
    type: "flood",
    lat: 27.6736,
    lng: 85.4294,
    time: "2h ago",
  },
  {
    id: 3,
    title: "Landslide in Dhading",
    type: "landslide",
    lat: 27.7804,
    lng: 84.9484,
    time: "5h ago",
  },
  {
    id: 4,
    title: "Accident in Kalanki",
    type: "accident",
    lat: 27.6931,
    lng: 85.279,
    time: "6h ago",
  },
  {
    id: 5,
    title: "Garbage overflow",
    type: "garbage",
    lat: 27.7006,
    lng: 85.3475,
    time: "Today",
  },
  {
    id: 6,
    title: "Relief center opened",
    type: "relief",
    lat: 27.6719,
    lng: 85.3174,
    time: "Now",
  },
  {
    id: 7,
    title: "Unknown issue",
    type: "other",
    lat: 27.7079,
    lng: 85.3086,
    time: "Unknown",
  },
];

// Leaflet icon generator
const getIcon = (type) =>
  new L.Icon({
    iconUrl: `/icons/${type}.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

// Locate Me button
function LocateButton({ onLocate }) {
  const map = useMap();
  const locate = () => {
    map.locate({ setView: true, maxZoom: 16 });
    map.once("locationfound", (e) => onLocate(e.latlng));
  };
  return (
    <button
      onClick={locate}
      className="absolute bottom-24 right-4 bg-white border border-gray-300 shadow-md rounded-full p-2 z-[1000]"
      title="Locate Me"
    >
      <LocateFixed size={20} className="text-blue-600" />
    </button>
  );
}

const MapPage = () => {
  const { t } = useTranslation();
  const [position, setPosition] = useState([27.7172, 85.324]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(
    Object.fromEntries(incidentTypesConfig.map((i) => [i.key, true]))
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = [latitude, longitude];
        setPosition(latlng);
        setUserLocation(latlng);
        if (mapRef.current) mapRef.current.flyTo(latlng, 16, { duration: 1.5 });
      },
      (err) => console.warn("Geolocation failed:", err.message)
    );
  }, []);

  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const setAll = (value) => {
    const all = Object.fromEntries(
      incidentTypesConfig.map((i) => [i.key, value])
    );
    setSelectedTypes(all);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4 text-lg font-bold text-blue-700 bg-white border-b shadow-sm">
        {t("map.title")}
      </header>

      {/* Dropdown Filter */}
      <div className="relative p-4 bg-white border-b">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded shadow-sm w-full justify-between"
        >
          <span>{t("map.filterLabel")}</span>
          <ChevronDown size={18} />
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 mt-2 w-full bg-white border shadow rounded p-3 space-y-2">
            {incidentTypesConfig.map((type) => (
              <label
                key={type.key}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes[type.key]}
                  onChange={() => toggleType(type.key)}
                />
                <img
                  src={`/icons/${type.key}.png`}
                  alt={type.key}
                  className="w-5 h-5"
                />
                {t(`incidentTypes.${type.key}`)}
              </label>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAll(true)}
                className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded"
              >
                <CheckCircle size={14} /> {t("map.selectAll")}
              </button>
              <button
                onClick={() => setAll(false)}
                className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded"
              >
                <XCircle size={14} /> {t("map.clearAll")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={true}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        style={{ height: "80vh", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>{t("map.youAreHere")}</Popup>
          </Marker>
        )}

        <MarkerClusterGroup>
          {incidents
            .filter((i) => selectedTypes[i.type])
            .map((incident) => (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
                icon={getIcon(incident.type)}
              >
                <Popup>
                  <strong>{incident.title}</strong>
                  <br />
                  {incident.time}
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>

        <LocateButton onLocate={(pos) => setUserLocation([pos.lat, pos.lng])} />
      </MapContainer>
    </div>
  );
};

export default MapPage;
