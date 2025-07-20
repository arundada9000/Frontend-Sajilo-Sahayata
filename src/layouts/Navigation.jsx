import { useState, useEffect, useRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import ProfileDrawer from "../pages/Dashboard/Profile";
import { useLocalGovernment } from "../hooks/useLocalGovernment";
import useAuth from "../stores/useAuth";

const NavigationLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const localGov = useLocalGovernment();

  const user = useAuth((state) => state.user);

  const [prevScrollY, setPrevScrollY] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const currentPath = location.pathname;

  const underlineRef = useRef(null);
  const buttonRefs = useRef([]);

  const isActive = (path) => {
    if (path === "/home") {
      return currentPath === "/" || currentPath === "/dashboard/home";
    }
    return currentPath.includes(path);
  };

  const navItems = [
    { path: "/home", index: 0 },
    { path: "/reports", index: 1 },
    { path: "/map", index: 2 },
    { path: "/settings", index: 3 },
  ];

  const activeIndex =
    navItems.find((item) =>
      item.path !== "/settings" ? isActive(item.path) : false
    )?.index ?? (showProfileDrawer ? 3 : -1);

  // Move underline on activeIndex change
  useEffect(() => {
    if (activeIndex >= 0 && buttonRefs.current[activeIndex]) {
      const button = buttonRefs.current[activeIndex];
      const rect = button.getBoundingClientRect();
      const parentRect = button.parentNode.getBoundingClientRect();

      const left = rect.left - parentRect.left + rect.width / 2 - 10; // 20px width / 2
      if (underlineRef.current) {
        underlineRef.current.style.left = `${left}px`;
      }
    }
  }, [activeIndex]);

  // Auto hide/show nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowBottomNav(prevScrollY > currentScroll || currentScroll < 10);
      setPrevScrollY(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

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
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#155ac1] border-t shadow-md transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        } w-full`}
      >
        <div className="relative mx-auto max-w-md w-full flex items-center justify-around py-1 px-3">
          {/* Underline */}
          <div
            ref={underlineRef}
            className="absolute bottom-0 h-1 bg-yellow-300 transition-all duration-300 ease-in-out"
            style={{
              width: "20px",
              top: "45px",
              borderRadius: "40px",
            }}
          />

          {/* Buttons */}
          <NavButton
            ref={(el) => (buttonRefs.current[0] = el)}
            icon="/icons/home-icon.svg"
            label={t("navigation.home")}
            active={isActive("/home")}
            onClick={() => navigate("/dashboard/home")}
          />
          <NavButton
            ref={(el) => (buttonRefs.current[1] = el)}
            icon="/icons/emergency-icon.svg"
            label={t("navigation.report")}
            active={isActive("/reports")}
            onClick={() => navigate("/dashboard/reports")}
          />
          <NavButton
            ref={(el) => (buttonRefs.current[2] = el)}
            icon="/icons/location-icon.svg"
            label={t("navigation.map")}
            active={isActive("/map")}
            onClick={() => navigate("/dashboard/map")}
          />
          <NavButton
            ref={(el) => (buttonRefs.current[3] = el)}
            icon="/icons/setting-icon.svg"
            label={t("navigation.settings")}
            active={showProfileDrawer}
            onClick={() => setShowProfileDrawer(true)}
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

// NavButton with forwardRef
const NavButton = forwardRef(({ icon, label, active, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-1 transition duration-200 cursor-pointer hover:scale-110 ${
      active
        ? "text-yellow-300 scale-110 font-bold"
        : "text-white hover:text-red-500"
    }`}
  >
    <img src={icon} alt={label} className="w-10 h-10" />
    <span className="text-xs">{label}</span>
  </button>
));

export default NavigationLayout;
