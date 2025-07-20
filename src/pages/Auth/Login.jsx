import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../stores/useAuth";
import API from "../../api/axios";
import { motion } from "framer-motion";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const login = useAuth((state) => state.login);

  const handleLogin = async () => {
    setError("");
    setStatus(null);

    const fullPhone = "+977" + phone;
    const isValidPhone = /^[0-9]{10}$/.test(phone);
    const isValidPassword = password.length >= 6;

    if (!isValidPhone) return setError("Invalid phone number");
    if (!isValidPassword) return setError("Password too short");

    try {
      const res = await API.post("/auth/login", {
        phone: fullPhone,
        password,
      });

      const { user, token } = res.data;

      login(user, token); // ✅ Store in Zustand
      setStatus("success");
      setTimeout(() => navigate("/dashboard/home"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Check phone or password.");
      setStatus("fail");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-8 relative flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label={t("login.back")}
        className="absolute top-4 left-4 p-2"
      >
        <img
          src="/icons/back.png"
          alt="Back"
          className="w-8 h-8 object-contain hover:scale-110 transition-transform duration-200"
        />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center justify-center mt-6">
        <motion.img
          src="/assets/logo.png"
          alt="Logo"
          className="h-12 mb-4 cursor-pointer"
          onClick={() => navigate("/")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        />
        <motion.h1
          className="text-2xl font-extrabold text-blue-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t("login.title", "Sign In")}
        </motion.h1>
        <p className="text-sm text-gray-500 mt-2">
          {t("login.subtitle", "Welcome back! Please log in.")}
        </p>
      </div>

      {/* Form Container */}
      <motion.div
        className="w-full max-w-sm bg-white mt-6 p-6 rounded-xl shadow-lg mx-auto space-y-5 text-left"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            {t("login.phoneLabel", "Username or Phone Number")}
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
            <span className="text-sm text-gray-600 mr-2">+977</span>
            <input
              id="phone"
              type="tel"
              aria-label={t("login.phoneLabel")}
              placeholder="9800000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 outline-none text-sm"
              maxLength={10}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {t("login.passwordLabel", "Password")}
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-blue-300">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-label={t("login.passwordLabel")}
              placeholder={t(
                "login.passwordPlaceholder",
                "Enter your password"
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 text-sm ml-2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            {t("login.remember", "Remember for 30 days")}
          </label>
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {t("login.forgot", "Forgot password?")}
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          aria-label={t("login.login")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          {t("login.login", "Login")}
        </button>

        {/* Feedback */}
        {status === "success" && (
          <p className="text-green-600 text-sm mt-2">
            {t("login.success", "Login successful!")}
          </p>
        )}
        {status === "fail" && (
          <p className="text-red-500 text-sm mt-2">{t("login.failed")}</p>
        )}
      </motion.div>

      {/* Bottom Register Link */}
      <p className="text-sm text-center mt-6 text-gray-700">
        {t("login.noAccount", "Don’t have an account?") + " "}
        <span
          className="text-red-600 font-semibold cursor-pointer hover:underline"
          onClick={() => navigate("/signup")}
        >
          {t("login.register")}
        </span>
      </p>
    </div>
  );
};

export default Login;
