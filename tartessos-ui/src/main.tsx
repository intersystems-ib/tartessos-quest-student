import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./style.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se ha encontrado el elemento #root en index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);