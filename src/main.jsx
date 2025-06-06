import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./i18n";
import usePreferences from "./stores/UsePreference.jsx";

const ApplyPreferences = ({ children }) => {
  const { theme, fontSize, fontFamily, loadPreferences } = usePreferences();

  React.useEffect(() => {
    loadPreferences();

    // ✅ Apply theme class to <body>
    const body = document.body;
    // document.body.style.backgroundColor =
    //   theme === "dark" ? "#111827" : "white";
    // document.body.style.color = theme === "dark" ? "#f9fafb" : "#111827";

    // ✅ Apply font classes to <body>
    body.classList.remove(
      "font-poppins",
      "font-arial",
      "font-sans",
      "font-serif",
      "font-mono"
    );
    body.classList.add(`font-${fontFamily}`);

    body.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    body.classList.add(`text-${fontSize}`);
  }, [theme, fontSize, fontFamily]);

  return <>{children}</>;
};

const Root = () => (
  <React.StrictMode>
    <ApplyPreferences>
      <App />
    </ApplyPreferences>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
