import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signin from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Welcome from "../pages/Auth/Welcome";
import VerifyOTP from "../pages/Auth/VerifyOTP";
import DashboardHome from "../pages/Dashboard/Home";
import DashboardAlerts from "../pages/Dashboard/Alerts";
import DashboardReports from "../pages/Dashboard/Reports";
import UserProfile from "../pages/Dashboard/Profile";
import MapPage from "../pages/Dashboard/MapPage";
import ReportForm from "../pages/Reports/ReportForm";
import Navigation from "../layouts/Navigation";
import Profile from "../pages/Dashboard/Profile";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public/Auth Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        {/* User Routes with Navigation layout */}
        <Route path="/dashboard" element={<Navigation />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="alerts" element={<DashboardAlerts />} />
          <Route path="reports" element={<DashboardReports />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="map" element={<MapPage />} />
          <Route path="report" element={<ReportForm />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
