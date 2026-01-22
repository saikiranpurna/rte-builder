import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// Import rte-builder styles
import "rte-builder/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
