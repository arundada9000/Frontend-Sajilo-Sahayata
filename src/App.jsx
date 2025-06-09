import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { useLocalGovernment } from "./hooks/useLocalGovernment";

const App = () => {
  useLocalGovernment();
  return <AppRoutes />;
};

export default App;
