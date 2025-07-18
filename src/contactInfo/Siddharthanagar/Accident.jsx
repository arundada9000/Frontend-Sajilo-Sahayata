import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NearbyFireAuthorities = () => {
  const { t } = useTranslation();
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace this hardcoded data with backend API fetch
    // fetch('/api/fire-stations')
    //   .then(res => res.json())
    //   .then(data => setStations(data))
    //   .catch(err => console.error('Failed to fetch fire stations', err));

    // Temporary hardcoded data
    const hardcodedStations = [
      {
        name: "Traffic Emergency Bhairahawa",
        phone: "9807778899",
        distance: "2.5 km",
      },
      {
        name: "Road Safety Siddharthanagar",
        phone: "9808889900",
        distance: "5.8 km",
      },
      {
        name: "Emergency Ambulance Siddharthanagar",
        phone: "9809990011",
        distance: "7.3 km",
      },
    ];

    setStations(hardcodedStations);
  }, []);

  return (
    <div className="bg-[#f4f7fe] px-4 pt-4 pb-24 text-gray-800">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          aria-label={t("register.back")}
          className="absolute top-[-1] left-[-2px] p-2"
        >
          <img
            src="/icons/back.png"
            alt="Back"
            className="w-10 h-10 object-contain cursor-pointer hover:scale-110 transition-transform duration-200"
          />
        </button>
        <h2 className="text-lg font-semibold mx-auto">
          {t("selectEmergencyType")}
        </h2>
      </div>
      <h2 className="text-lg font-semibold mb-4">
        {t("accidentAuthorities.nearbyAccidentAuthorities")}
      </h2>

      <div className="flex flex-col gap-4">
        {stations.map((station, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white rounded-xl p-3 shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <img
                src="/icons/accident-red.svg"
                alt="fire icon"
                className="w-10 h-10"
              />
              <div>
                <h3 className="font-medium text-sm">{station.name}</h3>
                <p className="text-xs text-gray-600">
                  {station.phone} ({station.distance})
                </p>
              </div>
            </div>

            <a
              href={`tel:${station.phone}`}
              className="bg-[#e9403e] text-white font-semibold text-sm flex items-center gap-1 px-3 py-1.5 rounded-full shadow hover:bg-red-600 transition"
            >
              <img src="/icons/call.svg" alt="Call" className="w-4 h-4" />
              {t("fireAuthorities.call")}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyFireAuthorities;
