import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const emergencyTypes = [
  { type: "fire", icon: "/icons/fire-red.svg", labelKey: "emergency.fire" },
  {
    type: "police",
    icon: "/icons/police-red.svg",
    labelKey: "emergency.police",
  },
  { type: "flood", icon: "/icons/flood-red.svg", labelKey: "emergency.flood" },
  {
    type: "accident",
    icon: "/icons/accident-red.svg",
    labelKey: "emergency.accident",
  },
  {
    type: "landslide",
    icon: "/icons/landslide-red.svg",
    labelKey: "emergency.landslide",
  },
  { type: "other", icon: "/icons/others-red.svg", labelKey: "emergency.other" },
];

const EmergencyTypeSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/dashboard/${type}`);
  };

  return (
    <div className="relative min-h-screen bg-[#f4f7fe] text-gray-800 px-4 pt-4 pb-24">
      {/* Header */}
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

      {/* Grid of emergency types */}
      <div className="grid grid-cols-2 gap-4">
        {emergencyTypes.map(({ type, icon, labelKey }) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow hover:shadow-md transition"
          >
            <img src={icon} alt={type} className="w-18 h-18 mb-2" />
            <span className="text-sm font-medium text-gray-800">
              {t(labelKey)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmergencyTypeSelection;
