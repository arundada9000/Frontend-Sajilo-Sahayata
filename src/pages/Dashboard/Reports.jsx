import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocalGovernment } from "../../hooks/useLocalGovernment";

const ReportForm = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mediaSource, setMediaSource] = useState(""); // "camera" or "gallery"

  const localGov = useLocalGovernment();
  const fileInputRef = useRef(null);

  const tags = [
    "Accident",
    "Fire",
    "Flood",
    "Other",
    "Relief",
    "Landslide",
    "Garbage",
  ];

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
    if (!file) return;

    const now = Date.now();
    const fileTime = file.lastModified;
    const timeDiff = now - fileTime;
    const isCameraPhoto = timeDiff < 30000; // 30 seconds

    if (isCameraPhoto) {
      console.log("✅ Photo was taken just now (camera)");
      setMediaSource("camera");
    } else {
      console.log("⚠️ Photo is likely from gallery");
      setMediaSource("gallery");
    }

    setMediaFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!mediaFile) {
      setError(t("report.mediaRequired"));
      return;
    }

    if (mediaSource !== "camera") {
      setError("Please use your camera to take a real-time photo.");
      return;
    }

    if (!location) {
      getLocation();
      setError(t("report.locationFetching"));
      return;
    }

    setLoading(true);

    // const formData = {
    //   location,
    //   mediaFile,
    //   description,
    //   tag,
    //   timestamp,
    // };
    const formData = new FormData();

    formData.append("type", tag); // e.g. "incident"
    formData.append("description", description); // must be >= 10 characters
    formData.append("location", JSON.stringify(location)); // [lat, lng] as stringified array
    formData.append("image", mediaFile); // File object from input[type="file"]

    try {
      console.log("📤 Submitting report...", formData);
      fetch(
        "http://localhost:3000/api/reports",

        {
          method: "POST",
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
      setLocation(null);
      setMediaFile(null);
      setDescription("");
      setTag("");
      setMediaSource("");
    } catch (err) {
      setError(t("report.submitError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 pt-0 pb-20">
      <div className="mt-4 text-center">
        <button
          onClick={getLocation}
          type="button"
          className="bg-[#0047AB] text-white font-medium px-4 py-2 rounded-full flex items-center justify-center mx-auto"
        >
          <img
            src="/icons/location.svg"
            alt="location"
            className="w-4 h-4 mr-2"
          />
          {t("report.getLocation")}
        </button>
        {location && (
          <p className="text-xs text-green-600 mt-1">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current.click()}
        className="w-28 h-28 mx-auto mt-6 mb-2 bg-gray-100 flex items-center justify-center rounded-lg cursor-pointer"
      >
        <img src="/icons/camera.png" alt="Upload" className="w-25 h-20" />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        onChange={handleMediaCapture}
        className="hidden"
      />

      {mediaFile && (
        <p
          className={`text-xs text-center mb-3 ${
            mediaSource === "camera" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {mediaSource === "camera"
            ? "Photo ready"
            : "Please take a photo using the camera for better accuracy."}
        </p>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">
          {t("report.description")}
        </label>
        <textarea
          placeholder={t("report.descriptionPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">
          {t("report.selectAuthority")}
        </label>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">{t("report.selectOption")}</option>
          {tags.map((tagName) => (
            <option key={tagName} value={tagName}>
              {t(`incidentTypes.${tagName.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center mb-2">{error}</p>
      )}
      {submitted && (
        <p className="text-sm text-green-600 text-center mb-2">
          {t("report.success")}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full text-white py-2 rounded-md font-semibold text-lg ${
          loading ? "bg-gray-400" : "bg-[#e9403e]"
        }`}
      >
        {loading ? t("report.submitting") + "..." : t("report.submit")}
      </button>
    </div>
  );
};

export default ReportForm;
