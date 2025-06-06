import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import usePreferences from "../../stores/UsePreference.jsx";

const ProfileDrawer = ({ open, onClose }) => {
  const { theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily } =
    usePreferences();
  const { t } = useTranslation();

  const user = {
    name: "User",
    role: "Citizen",
    city: "Kathmandu",
    phone: "+977 0000000000",
    email: "user@gmail.com",
    gender: "Male",
    citizenshipId: "21 0234 214",
    language: "English",
    address: "Butwal, Rupandehi",
    isVerified: true,
  };

  // Prevent body scroll on open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity duration-300 z-40 ${
          open ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[90vw] sm:w-[380px] bg-white z-50 shadow-lg transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
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
        <div className="overflow-y-auto p-4 space-y-4 text-sm text-gray-800 flex-1">
          <div className="flex flex-col items-center">
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
            <p className="mt-2 text-lg font-bold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.role}</p>
            <p className="text-sm">📍 {user.city}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <InfoRow label={t("profile.phone")} value={user.phone} />
            <InfoRow label={t("profile.email")} value={user.email} />
            <InfoRow label={t("profile.gender")} value={user.gender} />
            <InfoRow
              label={t("profile.citizenship")}
              value={user.citizenshipId}
            />
            <InfoRow label={t("profile.language")} value={user.language} />
            <InfoRow label={t("profile.address")} value={user.address} />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <p className="font-medium">
              {t("profile.verification")}:
              <span className="ml-2 text-green-600 font-semibold">
                {user.isVerified
                  ? t("profile.verified") + " ✅"
                  : t("profile.notVerified")}
              </span>
            </p>

            <label className="block text-sm font-medium">
              {t("profile.fontSize")}
              <select
                className="w-full mt-1 border rounded px-2 py-1"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="sm">Small</option>
                <option value="base">Default</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              {t("profile.fontFamily")}
              <select
                className="w-full mt-1 border rounded px-2 py-1"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="poppins">Poppins</option>
                <option value="arial">Arial</option>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              {t("profile.theme")}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="block w-full bg-gray-100 border rounded py-1 mt-1"
              >
                {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
              </button>
            </label>
          </div>

          <div className="bg-white text-center text-md font-medium p-3 rounded-lg shadow border">
            🤝 {t("profile.community")}
          </div>
        </div>
      </div>
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span>{value}</span>
  </div>
);

export default ProfileDrawer;
