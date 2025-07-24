import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import usePreferences from "../../stores/UsePreference";
import { useLocalGovernment } from "../../hooks/useLocalGovernment";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [notification, setNotification] = useState(null);
  const localGov = useLocalGovernment();
  const [locationNames, setLocationNames] = useState({});
  const [expandedLocationId, setExpandedLocationId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports");
        const data = response.data;
        console.log(...data);

        setIncidents(data);

        // Reverse geocode for all incidents
        const locationFetches = await Promise.all(
          data.map(async (incident) => {
            const coords = incident.location?.coordinates;
            if (coords && coords.length === 2) {
              const [lat, lon] = coords;
              try {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
                );
                const json = await res.json();
                return { id: incident._id, name: json.display_name };
              } catch (err) {
                console.error(
                  "Geocoding failed for incident",
                  incident._id,
                  err
                );
                return { id: incident._id, name: "Unknown location" };
              }
            }
            return { id: incident._id, name: "Unknown location" };
          })
        );

        // Build and store location name map
        const namesMap = {};
        locationFetches.forEach(({ id, name }) => {
          namesMap[id] = name;
        });
        setLocationNames(namesMap);

        // Demo notification
        const latestNotification = {
          type: "landslide",
          location: "Sainamaina-04, Murgiya",
          description: "Road blocked due to landslide.",
          timeAgo: "5 minutes ago",
        };
        setNotification(latestNotification);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };
    fetchData();
  }, []);

  const filteredIncidents = incidents
    .filter((incident) => {
      const status = incident.status || "reported"; // fallback
      return filterType === "all" || status === filterType;
    })
    .sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

  const statusDotColor = {
    verified: "bg-red-500",
    working: "bg-yellow-500",
    solved: "bg-green-500",
    pending: "bg-orange-400",
  };

  const formatLocation = (incident) => {
    const location = incident.location;
    if (!location) return t("Unknown Location");
    if (locationNames[incident._id]) return locationNames[incident._id];
    if (typeof location === "string") return location;
    if (location.city && location.area)
      return `${location.area}, ${location.city}`;
    if (location.city) return location.city;
    return t("Unknown Location");
  };

  return (
    <div className="mt-4 p-4 space-y-5 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl min-h-full mx-auto bg-[#edf2f8] shadow-md rounded-lg">
      {/* Notification */}
      {notification && (
        <div className="bg-[#fae35e] text-black p-3 rounded-4xl shadow-[#7e7e68] shadow-md relative">
          <strong className="text-red-500 font-extrabold">
            {t("Notification!")}
          </strong>
          <p className="text-sm leading-none text-[#264960]">
            {notification.timeAgo}, a {notification.type} was reported in{" "}
            {notification.location}.
          </p>
          <p className="text-xs mt-1 text-gray-700">
            {notification.description}
          </p>
        </div>
      )}

      {/* Latest Reports */}
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center rounded-lg p-2 px-4">
          <h2 className="text-2xl font-bold text-blue-950">
            {t("dashboard.latestReports")}
          </h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm text-shadow-blue-900 bg-white border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">{t("dashboard.All")}</option>
            <option value="verified">{t("dashboard.Verified")}</option>
            <option value="working">{t("dashboard.Working")}</option>
            <option value="solved">{t("dashboard.Solved")}</option>
            <option value="pending">{t("dashboard.Pending")}</option>
          </select>
        </div>

        <div className="flex flex-row-reverse gap-10 overflow-x-auto p-[10px] scrollbar-hide shadow-md rounded-lg ">
          {filteredIncidents.map((incident) => {
            const status = incident.status || "reported";
            return (
              <div
                key={incident._id}
                className="relative mt-4  min-w-[270px] rounded-xl shadow-md overflow-hidden bg-[#ffffff] hover:shadow-lg transition-shadow duration-300 p-5"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:3000/${incident.imageUrl}`}
                    alt={incident.type}
                    className="h-60 w-full object-cover rounded-3xl"
                    onClick={() =>
                      navigate("/dashboard/map", {
                        state: {
                          focus: {
                            id: incident.id,
                            lat: incident.location.coordinates[0],
                            lng: incident.location.coordinates[1],
                            title: incident.title,
                            type: incident.type,
                          },
                        },
                      })
                    }
                  />
                  <div
                    className="absolute bottom-5 left-2 max-w-[80%] cursor-pointer"
                    onClick={() =>
                      setExpandedLocationId(
                        expandedLocationId === incident._id
                          ? null
                          : incident._id
                      )
                    }
                  >
                    {expandedLocationId === incident._id ? (
                      <div className="bg-black/70 text-white text-[11px] px-3 py-2 rounded-lg shadow-md z-10">
                        {formatLocation(incident)}
                      </div>
                    ) : (
                      <div className="bg-black/40 text-white text-[10px] px-2 py-1 rounded-md truncate">
                        {formatLocation(incident)}
                      </div>
                    )}
                  </div>

                  <div
                    className={`absolute opacity-60 top-4 right-4 w-8 h-8 rounded-full border-2 border-white ${
                      statusDotColor[status] || "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="p-2">
                  <div className="text-sm font-semibold capitalize text-blue-950">
                    {t(`incidentTypes.${incident.type}`)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {incident.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOS Section */}
      <div className="bg-[#e9403e] mt-9 mb-[60px] p-1 rounded-full shadow-md">
        <button
          className="flex items-center justify-center gap-2 bg-[#e9403e] text-white font-semibold text-4xl w-full rounded-full shadow hover:bg-red-600 transition-colors p-2"
          onClick={() => navigate("/dashboard/emergency-type-selection")}
        >
          <img src="/icons/call.svg" alt="Call" className="w-16 h-11" />
          {t("dashboard.sahayatacall")}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
