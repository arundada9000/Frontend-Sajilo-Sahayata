import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import usePreferences from "../../stores/UsePreference";
import { useLocalGovernment } from "../../hooks/useLocalGovernment";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder] = useState("latest");
  const [locationNames, setLocationNames] = useState({});
  const [expandedLocationId, setExpandedLocationId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const geocodeCache = useRef({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports");
        const data = response.data;
        if (!isMounted) return;
        setIncidents(data); // Show cards immediately

        // Reverse geocode in background
        const locationFetches = await Promise.all(
          data.map(async (incident) => {
            const coords = incident.location?.coordinates;
            if (coords && coords.length === 2) {
              const [lat, lon] = coords;
              const key = `${lat},${lon}`;
              if (geocodeCache.current[key]) {
                return { id: incident._id, name: geocodeCache.current[key] };
              }
              try {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
                  { signal }
                );
                const json = await res.json();
                geocodeCache.current[key] = json.display_name;
                return { id: incident._id, name: json.display_name };
              } catch (err) {
                if (err.name === "AbortError") return null;
                return { id: incident._id, name: "Unknown location" };
              }
            }
            return { id: incident._id, name: "Unknown location" };
          })
        );

        const namesMap = {};
        locationFetches.forEach((result) => {
          if (result) namesMap[result.id] = result.name;
        });
        if (isMounted) setLocationNames(namesMap);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/alerts");
        const alerts = res.data || [];
        const formatted = alerts.map((alert) => ({
          type: alert.type,
          location: alert.location || "Unknown area",
          description: alert.description,
          timeAgo: new Date(alert.timestamp).toLocaleTimeString(),
        }));
        if (isMounted) setNotifications(formatted);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        if (isMounted) setLoadingAlerts(false);
      }
    };

    fetchReports();
    fetchAlerts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const filteredIncidents = incidents
    .filter((incident) => {
      const status = incident.status || "reported";
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
    <motion.div
      className="mt-4 p-4 space-y-5 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl min-h-full mx-auto bg-[#edf2f8] shadow-md rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* 🔔 Notifications */}
      {loadingAlerts ? (
        <Skeleton height={80} borderRadius={20} />
      ) : notifications.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 p-2 scroll-smooth">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                className="min-w-[280px] bg-[#fae35e] text-black p-3 rounded-3xl shadow-md relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: index * 0.05 }}
              >
                <strong className="text-red-500 font-extrabold">
                  {t("Notification!")}
                </strong>
                <p className="text-sm text-[#264960]">
                  {notification.timeAgo}, a {notification.type} was reported in{" "}
                  {notification.location}.
                </p>
                <p className="text-xs mt-1 text-gray-700">
                  {notification.description}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : null}

      {/* 📋 Reports */}
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center rounded-lg p-2 px-4">
          <h2 className="text-2xl font-bold text-blue-950">
            {t("dashboard.latestReports")}
          </h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">{t("dashboard.All")}</option>
            <option value="verified">{t("dashboard.Verified")}</option>
            <option value="working">{t("dashboard.Working")}</option>
            <option value="solved">{t("dashboard.Solved")}</option>
            <option value="pending">{t("dashboard.Pending")}</option>
          </select>
        </div>

        {incidents.length === 0 ? (
          <Skeleton height={320} width={270} count={3} borderRadius={20} />
        ) : (
          <div className="flex flex-row-reverse gap-10 overflow-x-auto p-[10px] scrollbar-hide shadow-md rounded-lg scroll-smooth snap-x snap-mandatory">
            <AnimatePresence>
              {filteredIncidents.map((incident, index) => {
                const status = incident.status || "reported";
                return (
                  <motion.div
                    key={incident._id}
                    className="relative mt-4 min-w-[270px] rounded-xl shadow-md bg-white p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative">
                      <img
                        src={`http://localhost:3000/${incident.imageUrl}`}
                        alt={incident.type}
                        className="h-60 w-full object-cover rounded-3xl cursor-pointer"
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

                      {/* Location label */}
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
                            {locationNames[incident._id] ? (
                              formatLocation(incident)
                            ) : (
                              <Skeleton height={12} width={100} />
                            )}
                          </div>
                        ) : (
                          <div className="bg-black/40 text-white text-[10px] px-2 py-1 rounded-md truncate">
                            {locationNames[incident._id] ? (
                              formatLocation(incident)
                            ) : (
                              <Skeleton height={10} width={60} />
                            )}
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🆘 SOS Button */}
      <motion.div
        className="bg-[#e9403e] mt-9 mb-[60px] p-1 rounded-full shadow-md"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <motion.button
          className="flex items-center justify-center gap-2 bg-[#e9403e] text-white font-semibold text-4xl w-full rounded-full shadow hover:bg-red-600 transition-colors p-2"
          onClick={() => navigate("/dashboard/emergency-type-selection")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <img src="/icons/call.svg" alt="Call" className="w-16 h-11" />
          {t("dashboard.sahayatacall")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
