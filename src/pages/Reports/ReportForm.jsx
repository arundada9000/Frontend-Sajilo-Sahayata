import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const incidentTypes = [
  "fire",
  "flood",
  "landslide",
  "accident",
  "garbage",
  "other",
];

const ReportForm = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera when cameraActive changes to true
  useEffect(() => {
    if (!cameraActive) {
      // Stop video stream if turning off camera
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        setError("");
      })
      .catch(() => setError(t("report.cameraError")));
  }, [cameraActive, t]);

  // Location fetch on button press
  const detectLocation = () => {
    setError("");
    setLocation(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setError(t("report.locationError"))
    );
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      setPhoto(dataURL);
      setPreview(dataURL);
      setCameraActive(false); // Close camera after capture
      // Stop video stream
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location || !photo) {
      alert(t("report.validationError"));
      return;
    }
    const payload = { location, type, description, photo };
    console.log("Report submitted:", payload);
    alert(t("report.submitted"));
    // TODO: send to backend or local save
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        {t("report.title")}
      </h1>
      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        {/* Location */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            {t("report.location")}
          </label>
          {location ? (
            <p className="text-sm text-green-700 font-medium">
              {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              {t("report.locationNotDetected")}
            </p>
          )}
          <button
            type="button"
            onClick={detectLocation}
            className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            {t("report.detectLocation")}
          </button>
        </div>
        {/* Camera Activation Button or Live Camera */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            {t("report.camera")}
          </label>
          {!photo ? (
            <>
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={() => setCameraActive(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded text-lg font-semibold hover:bg-blue-700 transition"
                >
                  {t("report.openCamera")}
                </button>
              ) : (
                <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-2 right-2 bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                  >
                    {t("report.capture")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <img
              src={preview}
              alt="Captured"
              className="w-full rounded shadow"
            />
          )}
        </div>
        ;{/* Incident Type */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            {t("report.type")}
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-500"
          >
            <option value="">{t("report.selectType")}</option>
            {incidentTypes.map((key) => (
              <option key={key} value={key}>
                {t(`incidentTypes.${key}`)}
              </option>
            ))}
          </select>
        </div>
        {/* Description */}
        <div>
          <label className="block text-md font-semibold text-gray-700 mb-1">
            {t("report.description")}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-500"
            placeholder={t("report.descriptionPlaceholder")}
          />
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded text-lg font-semibold hover:bg-green-700 transition"
        >
          {t("report.submit")}
        </button>
      </form>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ReportForm;
