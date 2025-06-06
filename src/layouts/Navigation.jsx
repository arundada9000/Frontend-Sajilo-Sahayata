import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import ProfileDrawer from "../pages/Dashboard/Profile";

const NavigationLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="relative min-h-screen bg-red-50 text-gray-800">
      {/* Top Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white shadow-md transition-transform duration-300 ${
          showTopNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="text-xl font-bold text-red-600">Sajilo Sahayata</div>
        <div className="flex items-center gap-4">
          <IconButton icon="/icons/notification.svg" alt="Notifications" />
          <IconButton
            icon="/icons/profile.png"
            alt="Profile"
            onClick={() => setShowProfileDrawer(true)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navbar */}
      <nav
        className={`fixed  pr-8 bottom-0 left-0 right-0 z-40 bg-white border-t shadow-md transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Toggle Button */}
        <div
          className={`absolute  right-4 z-10 ${
            showBottomNav ? "top-4" : "-top-8"
          }`}
        >
          <button
            onClick={() => setShowBottomNav(!showBottomNav)}
            className={`w-10 h-10 flex items-center justify-center bg-gray-300 text-red-500 text-bold rounded-md shadow-md text-xs transition-all duration-300`}
            aria-label="Toggle Bottom Navigation"
          >
            {showBottomNav ? "⌄" : "⌃"}
          </button>
        </div>

        <div className="flex items-center justify-around py-2">
          <NavButton
            icon="/icons/home.svg"
            label={t("navigation.home")}
            active={isActive("/home")}
            onClick={() => navigate("/dashboard/home")}
          />
          <NavButton
            icon="/icons/report.png"
            label={t("navigation.report")}
            active={isActive("/reports")}
            onClick={() => navigate("/dashboard/reports")}
          />
          <NavButton
            icon="/icons/map.svg"
            label={t("navigation.map")}
            active={isActive("/map")}
            onClick={() => navigate("/dashboard/map")}
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
    className={`flex flex-col items-center justify-center p-2 transition duration-200 cursor-pointer hover:scale-110 ${
      active
        ? "text-red-600 font-semibold scale-110"
        : "text-gray-500 hover:text-red-500"
    }`}
  >
    <img src={icon} alt={label} className="w-6 h-6 mb-1" />
    <span className="text-xs">{label}</span>
  </button>
);

const IconButton = ({ icon, alt, onClick }) => (
  <button
    className="p-1 cursor-pointer hover:scale-110 transition duration-300"
    aria-label={alt}
    onClick={onClick}
  >
    <img src={icon} alt={alt} className="w-6 h-6" />
  </button>
);

export default NavigationLayout;
