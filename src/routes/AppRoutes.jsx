// ✅ AppRoutes.jsx with Framer Motion page transitions
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Signin from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Welcome from "../pages/Auth/Welcome";
import VerifyOTP from "../pages/Auth/VerifyOTP";
import DashboardHome from "../pages/Dashboard/Home";
import DashboardAlerts from "../pages/Dashboard/Alerts";
import DashboardReports from "../pages/Dashboard/Reports";
import MapPage from "../pages/Dashboard/MapPage";
import ReportForm from "../pages/Reports/ReportForm";
import Navigation from "../layouts/Navigation";
import Profile from "../pages/Dashboard/Profile";
import EmergencyTypeSelection from "../pages/Dashboard/EmergencyTypeSelection";

import Fire from "../contactInfo/butwal//Fire";
import Police from "../contactInfo/butwal//Police";
import Flood from "../contactInfo/butwal//Flood";
import Landslide from "../contactInfo/butwal//Landslide";
import Other from "../contactInfo/butwal//Other";
import Accident from "../contactInfo/butwal//Accident";

import TillotamaFire from "../contactInfo/tillotama//Fire";
import TillotamaPolice from "../contactInfo/tillotama//Police";
import TillotamaFlood from "../contactInfo/tillotama//Flood";
import TillotamaLandslide from "../contactInfo/tillotama//Landslide";
import TillotamaOther from "../contactInfo/tillotama//Other";
import TillotamaAccident from "../contactInfo/tillotama//Accident";

import OmsatiyaFire from "../contactInfo/omsatiya//Fire";
import OmsatiyaPolice from "../contactInfo/omsatiya//Police";
import OmsatiyaFlood from "../contactInfo/omsatiya//Flood";
import OmsatiyaLandslide from "../contactInfo/omsatiya//Landslide";
import OmsatiyaOther from "../contactInfo/omsatiya//Other";
import OmsatiyaAccident from "../contactInfo/omsatiya//Accident";

import SiddharthanagarFire from "../contactInfo/siddharthanagar//Fire";
import SiddharthanagarPolice from "../contactInfo/siddharthanagar//Police";
import SiddharthanagarFlood from "../contactInfo/siddharthanagar//Flood";
import SiddharthanagarLandslide from "../contactInfo/siddharthanagar//Landslide";
import SiddharthanagarOther from "../contactInfo/siddharthanagar//Other";
import SiddharthanagarAccident from "../contactInfo/siddharthanagar//Accident";

import AdminDashboard from "../Admin/Dashboard";
import ManageUsers from "../Admin/Manage-Users";
import ManageReports from "../Admin/Manage-Reports";
import SendAlerts from "../Admin/SendAlerts";
import RequireAdmin from "../auth/RequireAdmin";
import Unauthorized from "../pages/Unauthorized";
import Logout from "../Auth/Logout";
import AdminLayout from "../layouts/AdminLayout";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public/Auth Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

        {/* User Routes with Navigation layout */}
        <Route path="/dashboard" element={<Navigation />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="alerts" element={<DashboardAlerts />} />
          <Route path="reports" element={<DashboardReports />} />
          <Route path="map" element={<MapPage />} />
          <Route path="report" element={<ReportForm />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="emergency-type-selection"
            element={<EmergencyTypeSelection />}
          />
          <Route path="butwal/fire" element={<Fire />} />
          <Route path="butwal/police" element={<Police />} />
          <Route path="butwal/flood" element={<Flood />} />
          <Route path="butwal/landslide" element={<Landslide />} />
          <Route path="butwal/other" element={<Other />} />
          <Route path="butwal/accident" element={<Accident />} />

          <Route path="tillotama/fire" element={<TillotamaFire />} />
          <Route path="tillotama/police" element={<TillotamaPolice />} />
          <Route path="tillotama/flood" element={<TillotamaFlood />} />
          <Route path="tillotama/landslide" element={<TillotamaLandslide />} />
          <Route path="tillotama/other" element={<TillotamaOther />} />
          <Route path="tillotama/accident" element={<TillotamaAccident />} />

          <Route path="omsatiya/fire" element={<OmsatiyaFire />} />
          <Route path="omsatiya/police" element={<OmsatiyaPolice />} />
          <Route path="omsatiya/flood" element={<OmsatiyaFlood />} />
          <Route path="omsatiya/landslide" element={<OmsatiyaLandslide />} />
          <Route path="omsatiya/other" element={<OmsatiyaOther />} />
          <Route path="omsatiya/accident" element={<OmsatiyaAccident />} />

          <Route
            path="siddharthanagar/fire"
            element={<SiddharthanagarFire />}
          />
          <Route
            path="siddharthanagar/police"
            element={<SiddharthanagarPolice />}
          />
          <Route
            path="siddharthanagar/flood"
            element={<SiddharthanagarFlood />}
          />
          <Route
            path="siddharthanagar/landslide"
            element={<SiddharthanagarLandslide />}
          />
          <Route
            path="siddharthanagar/other"
            element={<SiddharthanagarOther />}
          />
          <Route
            path="siddharthanagar/accident"
            element={<SiddharthanagarAccident />}
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="send-alerts" element={<SendAlerts />} />
          <Route path="manage-reports" element={<ManageReports />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default AppRoutes;
