// Disable Lit development mode warnings
(globalThis as any).litIssuedWarnings = new Set();

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./lib/registerServiceWorker";

// Register Service Worker for PWA functionality
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
