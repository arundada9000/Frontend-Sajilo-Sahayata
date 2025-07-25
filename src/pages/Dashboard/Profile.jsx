import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import usePreferences from "../../stores/UsePreference.jsx";
import { useNavigate } from "react-router-dom";
import useAuth from "../../stores/useAuth";
import { useLocalGovernment } from "../../hooks/useLocalGovernment.js";
import { motion, AnimatePresence } from "framer-motion";

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "tween",
      duration: 0.35,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "tween",
      duration: 0.25,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const ProfileDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const localGov = useLocalGovernment();

  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    language,
    setLanguage,
  } = usePreferences();

  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/welcome");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 bg-gray-500 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
            className="fixed top-0 right-0 h-full w-[90vw] sm:w-[380px] bg-white z-50 shadow-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <button
                onClick={onClose}
                aria-label={t("profile.back")}
                className="text-2xl text-gray-700"
              >
                ←
              </button>
              <h2 className="text-lg font-semibold">{t("profile.title")}</h2>
              <span className="w-6" />
            </div>

            {/* Content */}
            <motion.div
              className="overflow-y-auto p-4 space-y-4 text-sm text-gray-800 flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* User Info */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="w-24 h-24 rounded-full relative bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('/assets/dummy/krishna.jpg')`,
                  }}
                >
                  <button className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow text-xs cursor-pointer hover:bg-gray-100 transition">
                    ✏️
                  </button>
                </div>
                <p className="mt-2 text-lg font-bold">
                  {user?.username || "Guest"}
                </p>
                <p className="text-gray-500 text-sm">
                  {user?.role || "Not logged in"}
                </p>
                <p className="text-sm">
                  📍 {localGov || "Detecting your local government..."}
                </p>
              </motion.div>

              {user && (
                <motion.div
                  className="bg-gray-50 rounded-lg p-4 space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  {[
                    { label: t("profile.phone"), value: user.phoneNumber },
                    { label: t("profile.email"), value: user.email },
                    { label: t("profile.gender"), value: user.gender },
                    {
                      label: t("profile.citizenship"),
                      value: user.citizenshipId,
                    },
                    { label: t("profile.address"), value: user.address },
                  ].map((info, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 5 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <InfoRow label={info.label} value={info.value || "N/A"} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Preferences */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <SelectRow
                  label={t("profile.language")}
                  value={language}
                  onChange={setLanguage}
                  options={[
                    { value: "en", label: "English" },
                    { value: "ne", label: "नेपाली" },
                  ]}
                />
                <SelectRow
                  label={t("profile.fontSize")}
                  value={fontSize}
                  onChange={setFontSize}
                  options={[
                    { value: "sm", label: "Small" },
                    { value: "base", label: "Default" },
                    { value: "lg", label: "Large" },
                    { value: "xl", label: "Extra Large" },
                  ]}
                />
                <SelectRow
                  label={t("profile.fontFamily")}
                  value={fontFamily}
                  onChange={setFontFamily}
                  options={[
                    { value: "poppins", label: "Poppins" },
                    { value: "arial", label: "Arial" },
                    { value: "sans", label: "Sans" },
                    { value: "serif", label: "Serif" },
                    { value: "mono", label: "Monospace" },
                    { value: "montserrat", label: "Montserrat" },
                  ]}
                />
                <label className="block text-sm font-medium">
                  {t("profile.theme")}
                  <button
                    onClick={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                    className="block w-full bg-gray-100 border rounded py-1 mt-1"
                  >
                    {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
                  </button>
                </label>
              </div>

              {/* Community Text */}
              <motion.div
                className="bg-white text-center text-md font-medium p-3 rounded-lg shadow border"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🤝 {t("profile.community")}
              </motion.div>

              {/* Admin Button */}
              {user?.role === "admin" && (
                <motion.div
                  className="text-center mt-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/admin");
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    🛠 Admin Dashboard
                  </button>
                </motion.div>
              )}

              {/* Auth Button */}
              <motion.div
                className="text-center mt-4"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
                  >
                    {t("auth.logout") || "Logout"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/welcome");
                    }}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                  >
                    {t("auth.login") || "Login"}
                  </button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span>{value}</span>
  </div>
);

const SelectRow = ({ label, value, onChange, options }) => (
  <label className="block text-sm font-medium">
    {label}
    <select
      className="w-full mt-1 border rounded px-2 py-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

export default ProfileDrawer;
