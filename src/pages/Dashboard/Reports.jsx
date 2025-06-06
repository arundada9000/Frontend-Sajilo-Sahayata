import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const ReportForm = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef(null);
  const tags = ["Accident", "Fire", "Flood", "Others"];

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setError(t("report.locationError"));
      },
      { enableHighAccuracy: true }
    );
  };

  const handleMediaCapture = (e) => {
    const file = e.target.files[0];
    if (file) setMediaFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!mediaFile) {
      setError(t("report.mediaRequired"));
      return;
    }

    if (!location) {
      getLocation();
      setError(t("report.locationFetching"));
      return;
    }

    setLoading(true);

    const timestamp = new Date().toISOString();
    const formData = {
      location,
      mediaFile,
      description,
      tag,
      timestamp,
    };

    try {
      // 🔧 Replace with actual backend or Firebase logic
      console.log("📤 Submitting report...", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // fake wait

      setSubmitted(true);
      setLocation(null);
      setMediaFile(null);
      setDescription("");
      setTag("");
    } catch (err) {
      setError(t("report.submitError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-red-600 text-center mb-4">
        📢 {t("report.title")}
      </h2>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {submitted && (
        <p className="text-sm text-green-600 mb-2 text-center">
          ✅ {t("report.success")}
        </p>
      )}

      <div className="mb-4">
        <button
          onClick={getLocation}
          type="button"
          className="w-full bg-red-500 text-white py-2 rounded-lg text-lg"
          aria-label={t("report.getLocation")}
        >
          📍 {t("report.getLocation")}
        </button>
        {location && (
          <p className="text-sm mt-1 text-green-700 text-center">
            {t("report.locationSet")}: {location.lat.toFixed(5)},{" "}
            {location.lng.toFixed(5)}
          </p>
        )}
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="w-full bg-red-500 text-white py-2 rounded-lg text-lg"
          aria-label={t("report.openCamera")}
        >
          📷 {t("report.openCamera")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          onChange={handleMediaCapture}
          className="hidden"
        />
        {mediaFile && (
          <p className="text-sm mt-1 text-green-700 text-center">
            {mediaFile.type.includes("image") ? "📸" : "🎥"}{" "}
            {t("report.mediaReady")}
          </p>
        )}
      </div>

      <textarea
        aria-label={t("report.description")}
        placeholder={t("report.descriptionPlaceholder")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg focus:outline-red-500"
        rows={3}
      />

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {tags.map((tname) => (
          <button
            key={tname}
            type="button"
            onClick={() => setTag(tname)}
            aria-label={`Tag: ${tname}`}
            className={`px-4 py-1 rounded-full border text-sm ${
              tag === tname
                ? "bg-red-500 text-white"
                : "bg-white text-red-600 border-red-500"
            }`}
          >
            {tname}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full ${
          loading ? "bg-gray-400" : "bg-green-600"
        } text-white py-2 rounded-lg text-lg`}
        aria-label={t("report.submit")}
      >
        {loading ? t("report.submitting") + "..." : "🚀 " + t("report.submit")}
      </button>
    </div>
  );
};

export default ReportForm;
