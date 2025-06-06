import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t, i18n } = useTranslation();

  const switchLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "np" : "en");
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">
          {t("welcome")}
        </h1>
        <button
          onClick={switchLanguage}
          className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
        >
          {i18n.language === "en" ? "नेपाली" : "English"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            title: t("activeDisasters"),
            value: 4,
            color: "bg-red-100 text-red-700",
          },
          {
            title: t("respondersDeployed"),
            value: 23,
            color: "bg-blue-100 text-blue-700",
          },
          {
            title: t("resourcesAvailable"),
            value: 52,
            color: "bg-green-100 text-green-700",
          },
        ].map((card, i) => (
          <div key={i} className={`p-4 rounded-xl shadow ${card.color}`}>
            <h2 className="text-sm font-semibold">{card.title}</h2>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Incident List Placeholder */}
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("recentIncidents")}
        </h3>
        <ul className="space-y-3">
          {[1, 2, 3].map((id) => (
            <li
              key={id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="text-sm text-gray-700">Incident #{id}</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Under Review
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
