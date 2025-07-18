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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports");
        const data = response.data;

        setIncidents(data);

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
    reported: "bg-red-500",
    working: "bg-yellow-500",
    solved: "bg-green-500",
    pending: "bg-orange-400",
  };

  const formatLocation = (location) => {
    if (!location) return t("Unknown Location");
    if (typeof location === "string") return location;
    if (location.city && location.area)
      return `${location.area}, ${location.city}`;
    if (location.city) return location.city;
    return t("Unknown Location");
  };

  return (
    <div className="p-4 space-y-5 max-w-md min-h-full mx-auto bg-[#f7f9fc]">
      {/* Notification */}
      {notification && (
        <div className="bg-[#fae35e] border-2 border-red-400 text-black p-3 rounded-4xl shadow-md relative">
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
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{t("dashboard.latestReports")}</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm text-gray-700 bg-white border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">{t("dashboard.All")}</option>
            <option value="reported">{t("dashboard.Reported")}</option>
            <option value="working">{t("dashboard.Working")}</option>
            <option value="solved">{t("dashboard.Solved")}</option>
            <option value="pending">{t("dashboard.Pending")}</option>
          </select>
        </div>

        <div className="flex flex-row-reverse gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {filteredIncidents.map((incident) => {
            const status = incident.status || "reported";
            return (
              <div
                key={incident._id}
                className="relative min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:3000/${incident.imageUrl}`}
                    alt={incident.type}
                    className="h-36 w-full object-cover"
                  />
                  <div
                    className={`absolute opacity-80 bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white ${
                      statusDotColor[status] || "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-bold text-rose-700">
                    {formatLocation(incident.location)}
                  </div>
                  <div className="text-sm font-semibold capitalize">
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
      <div className="bg-[#e9403e] p-1 rounded-full shadow-md">
        <button
          className="flex items-center justify-center gap-2 bg-[#e9403e] text-white font-semibold text-lg py-0 w-full rounded-full shadow hover:bg-red-600 transition-colors"
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
