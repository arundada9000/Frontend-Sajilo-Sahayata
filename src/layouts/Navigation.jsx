import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import ProfileDrawer from "../pages/Dashboard/Profile";
import { useLocalGovernment } from "../hooks/useLocalGovernment";
import useAuth from "../stores/useAuth"; // ✅ Use the correct store

const NavigationLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const localGov = useLocalGovernment();

  const user = useAuth((state) => state.user); // ✅ Get user from Zustand

  const [showTopNav, setShowTopNav] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowTopNav(prevScrollY > currentScroll || currentScroll < 10);
      setPrevScrollY(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  const isActive = (path) => {
    if (path === "/home") {
      return currentPath === "/" || currentPath === "/dashboard/home";
    }
    return currentPath.includes(path);
  };

  const userName = user?.username || t("navigation.citizen");

  return (
    <div className="relative min-h-screen bg-red-50 text-gray-800 w-full">
      {/* Top Navbar */}
      <div className="text-white bg-[#155ac1] px-4 pt-6 pb-2 relative">
        <div className="text-lg font-extrabold">{t("navigation.hello")},</div>
        <div className="text-base">{userName}!</div>
        <div className="absolute right-4 top-4">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="w-15 h-15 rounded-full"
            onClick={() => navigate("/dashboard/home")}
          />
        </div>
        <p className="mt-4 text-white absolute top-0 left-[50%] transform -translate-x-1/2">
          {localGov ? `${localGov}` : "Detecting your local government..."}
        </p>
      </div>

      {/* Main Content */}
      <main className="pt-1 pb-1">
        <Outlet />
      </main>

      {/* Bottom Navbar */}
      <nav
        className={`fixed pr-8 bottom-0 left-0 right-0 z-40 bg-[#155ac1] border-t shadow-md transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        } w-full`}
      >
        <div className="flex items-center justify-around py-1 px-3">
          <NavButton
            icon="/icons/home-icon.svg"
            label={t("navigation.home")}
            active={isActive("/home")}
            onClick={() => navigate("/dashboard/home")}
          />
          <NavButton
            icon="/icons/emergency-icon.svg"
            label={t("navigation.report")}
            active={isActive("/reports")}
            onClick={() => navigate("/dashboard/reports")}
          />
          <NavButton
            icon="/icons/location-icon.svg"
            label={t("navigation.map")}
            active={isActive("/map")}
            onClick={() => navigate("/dashboard/map")}
          />
          <NavButton
            icon="/icons/setting-icon.svg"
            alt="Profile"
            onClick={() => setShowProfileDrawer(true)}
            label={t("navigation.settings")}
          />
        </div>
      </nav>

      {/* Sliding Profile Drawer */}
      <ProfileDrawer
        open={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
      />
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-1 transition duration-200 cursor-pointer hover:scale-110 ${
      active
        ? "text-yellow-300 scale-110 font-bold"
        : "text-white hover:text-red-500"
    }`}
  >
    <img src={icon} alt={label} className="w-9 h-9" />
    <span className="text-xs">{label}</span>
  </button>
);

export default NavigationLayout;
