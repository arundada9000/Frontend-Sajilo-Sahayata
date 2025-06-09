import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import usePreferences from "../../stores/UsePreference";
import { useLocalGovernment } from "../../hooks/useLocalGovernment";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [incidents, setIncidents] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [notification, setNotification] = useState(null);
  const localGov = useLocalGovernment();

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Replace with API call to fetch incidents
      const data = [
        {
          _id: "1",
          type: "garbage",
          location: "Butwal, Rupandehi",
          description: "Garbage left with bad smell and makes the area dirty.",
          photo:
            "https://martech.org/wp-content/uploads/2014/08/photos-images-pictures-ss-1920.jpg",
          timestamp: "2025-06-07T10:00:00",
          status: "reported",
        },
        {
          _id: "2",
          type: "landslide",
          location: "Jordhara, Palpa",
          description: "Roads blocked due to heavy rain and landslides.",
          photo: "https://cdn.wallpapersafari.com/44/55/kp50Ri.jpg",
          timestamp: "2025-06-06T09:00:00",
          status: "working",
        },
      ];
      setIncidents(data);

      // TODO: Replace with API call to fetch latest notification
      const latestNotification = {
        type: "landslide",
        location: "Sainamaina-04, Murgiya",
        description: "Road blocked due to landslide.",
        timeAgo: "5 minutes ago",
      };
      setNotification(latestNotification);
    };
    fetchData();
  }, []);

  const filteredIncidents = incidents
    .filter(
      (incident) => filterType === "all" || incident.status === filterType
    )
    .sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

  const statusDotColor = {
    reported: "bg-red-500",
    working: "bg-yellow-500",
    solved: "bg-green-500",
  };

  return (
    <div className="p-4 space-y-5 max-w-md min-h-full mx-auto bg-[#f7f9fc]">
      {/* Notification */}
      {notification && (
        <div className="bg-[#fae35e] border-2 border-red-400 text-black p-3 rounded-4xl shadow-md relative">
          <div>
            <strong className=" text-red-500 font-extrabold">
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
        </div>
      )}

      {/* Latest Reports */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{t("Latest Reports")}</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm text-gray-700 bg-white border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="reported">Reported</option>
            <option value="working">Working</option>
            <option value="solved">Solved</option>
          </select>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {filteredIncidents.map((incident) => (
            <div
              key={incident._id}
              className="relative min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={incident.photo}
                  alt={incident.type}
                  className="h-36 w-full object-cover"
                />
                <div
                  className={`absolute opacity-80 bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white ${
                    statusDotColor[incident.status]
                  }`}
                ></div>
              </div>
              <div className="p-2">
                <div className="text-xs font-bold text-rose-700">
                  {incident.location}
                </div>
                <div className="text-sm font-semibold capitalize">
                  {t(`incidentTypes.${incident.type}`)}
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {incident.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOS Section */}
      <div className="bg-[#e9403e] p-1 rounded-full shadow-md">
        <button
          className="flex items-center justify-center gap-2 bg-[#e9403e] text-white font-semibold text-lg py-0 w-full rounded-full shadow hover:bg-red-600 transition-colors"
          onClick={() => navigate("/dashboard/emergency-type-selection")}
        >
          <img src="/icons/call.svg" alt="Call" className="w-16 h-11" />
          {t("EMERGENCY CALL")}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
