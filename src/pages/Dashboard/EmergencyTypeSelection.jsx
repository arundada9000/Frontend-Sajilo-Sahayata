import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useLocalGovernment } from "../../hooks/useLocalGovernment";
import { motion } from "framer-motion";

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
  const location = useLocation();
  const localGov = useLocalGovernment();

  const handleSelect = (type) => {
    navigate(`/dashboard/${localGov}/${type}`);
  };

  return (
    <motion.div
      className="relative min-h-screen bg-[#f4f7fe] text-gray-800 px-4 pt-4 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label={t("register.back")}
          className="absolute top-[-1] left-[-2px] p-2"
        >
          <motion.img
            src="/icons/back.png"
            alt="Back"
            className="w-8 h-8 object-contain cursor-pointer hover:scale-110 transition-transform duration-200"
            whileHover={{ scale: 1.1 }}
          />
        </button>
        <h2 className="text-lg font-semibold mx-auto">
          {t("selectEmergencyType")}
        </h2>
      </motion.div>

      {/* Emergency grid */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {emergencyTypes.map(({ type, icon, labelKey }, index) => (
          <motion.button
            key={type}
            onClick={() => handleSelect(type)}
            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow hover:shadow-md transition"
            whileHover={{ scale: 1.05 }}
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 10 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.img
              src={icon}
              alt={type}
              className="w-24 h-24 mb-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
            <span className="text-sm font-medium text-gray-800">
              {t(labelKey)}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EmergencyTypeSelection;
